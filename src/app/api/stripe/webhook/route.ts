import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/config/stripe';
import { headers } from 'next/headers';
import { DatabaseService } from '@/services/databaseService';
import Stripe from 'stripe';
import { SubscriptionTier } from '@/models/User';
import { buffer } from 'micro';

/**
 * Handle subscription events from Stripe
 * This function processes subscription creations, updates, and cancellations
 */
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const { customer, status, id: subscriptionId, items, cancel_at_period_end } = subscription;
  const current_period_end = (subscription as any).current_period_end;
  const priceId = items.data[0]?.price.id;
  const customerId = typeof customer === 'string' ? customer : customer.id;
  
  try {
    // Get the customer to find their userId from metadata
    const customerData = await stripe.customers.retrieve(customerId);
    
    // Check if the customer is not deleted and has metadata
    if (customerData && !('deleted' in customerData) && customerData.metadata) {
      const userId = customerData.metadata.userId;
      
      if (!userId) {
        console.error('No userId found in customer metadata');
        return;
      }
      
      // Map Stripe status to our subscription status
      let subscriptionStatus: 'active' | 'cancelled' | 'trialing' | 'past_due' = 'active';
      if (status === 'trialing') subscriptionStatus = 'trialing';
      else if (status === 'past_due') subscriptionStatus = 'past_due';
      else if (status === 'canceled') subscriptionStatus = 'cancelled';
      
      // Map price ID to subscription tier
      let tier: SubscriptionTier = 'free';
      
      // Get price data to determine tier and price amount
      const premium_price_id = process.env.STRIPE_PREMIUM_PRICE_ID;
      const pro_price_id = process.env.STRIPE_PRO_PRICE_ID;
      
      const price = await stripe.prices.retrieve(priceId);
      const priceAmount = price.unit_amount ? price.unit_amount / 100 : 0; // Convert cents to dollars
      
      if (priceId === premium_price_id || price.nickname?.toLowerCase().includes('premium')) {
        tier = 'premium';
      } else if (priceId === pro_price_id || price.nickname?.toLowerCase().includes('pro')) {
        tier = 'pro';
      }
      
      // Only update if status is active or trialing
      if (status === 'active' || status === 'trialing') {
        // Get payment method details if available
        let paymentMethod = undefined;
        
        try {
          const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: 'card',
          });
          
          if (paymentMethods.data.length > 0) {
            const card = paymentMethods.data[0].card;
            if (card) {
              paymentMethod = {
                brand: card.brand,
                last4: card.last4,
                expiryMonth: card.exp_month,
                expiryYear: card.exp_year,
              };
            }
          }
        } catch (err) {
          console.error('Error fetching payment method:', err);
        }
        
        // Update the user's subscription in the database
        await DatabaseService.updateSubscription(userId, tier, {
          customerId: customerId,
          subscriptionId: subscriptionId,
        });
        
        // Update user record with more detailed subscription data
        const nextBillingDate = new Date(current_period_end * 1000);
        const user = await DatabaseService.getUser(userId);
        
        if (user) {
          await DatabaseService.updateUser(userId, {
            subscription: {
              ...user.subscription,
              tier,
              status: subscriptionStatus,
              nextBillingDate: nextBillingDate,
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              cancelAtPeriodEnd: cancel_at_period_end,
              paymentMethod,
              price: priceAmount
            }
          });
          
          // Log this activity
          await DatabaseService.logUserActivity(userId, 'upgrade', {
            tier,
            subscriptionId,
            amount: priceAmount
          });
        }
        
        console.log(`Successfully updated subscription for user ${userId} to ${tier}`);
      } else if (status === 'canceled') {
        // Handle cancellation
        const user = await DatabaseService.getUser(userId);
        
        if (user) {
          await DatabaseService.updateUser(userId, {
            subscription: {
              ...user.subscription,
              status: 'cancelled',
              cancelAtPeriodEnd: true
            }
          });
          
          // Log this activity
          await DatabaseService.logUserActivity(userId, 'upgrade', {
            action: 'cancel',
            previousTier: user.subscription.tier
          });
        }
        
        console.log(`Subscription cancelled for user ${userId}`);
      }
    } else {
      console.error('Customer was deleted or has no metadata');
    }
  } catch (error) {
    console.error('Error updating user subscription:', error);
  }
}

/**
 * Next.js doesn't allow raw body access by default, so we need to configure it
 * to skip body parsing for our webhook route
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Process Stripe webhook events
 * This handler verifies the webhook signature and routes events to the appropriate handlers
 */
export async function POST(request: NextRequest) {
  // Get the raw body and signature
  const body = await request.text();
  const signature = headers().get('stripe-signature') || '';
  
  try {
    // Verify webhook signature
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Missing Stripe webhook secret');
      return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 });
    }
    
    // Construct the event
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed: ${err instanceof Error ? err.message : String(err)}`);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    
    console.log(`✅ Success: Received webhook ${event.id} for event type ${event.type}`);
    
    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
        
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        // If this was a subscription checkout, handle subscription
        if (session.mode === 'subscription' && session.subscription) {
          // Fetch the full subscription details
          const subscriptionId = typeof session.subscription === 'string' 
            ? session.subscription 
            : session.subscription.id;
            
          const subscriptionDetails = await stripe.subscriptions.retrieve(subscriptionId);
          await handleSubscriptionChange(subscriptionDetails);
        }
        // If this was a one-time payment, handle payment
        else if (session.mode === 'payment' && session.payment_intent) {
          const paymentIntentId = typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent.id;
            
          await handleOneTimePayment(paymentIntentId, session.customer as string);
        }
        break;
        
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        if (paymentIntent.customer) {
          await handleOneTimePayment(paymentIntent.id, paymentIntent.customer as string);
        }
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log(`❌ Payment failed: ${failedPayment.id}`);
        
        // If customer exists, log the failure
        if (failedPayment.customer) {
          const customerId = typeof failedPayment.customer === 'string' 
            ? failedPayment.customer 
            : failedPayment.customer.id;
            
          // Retrieve customer to get user ID
          const customerData = await stripe.customers.retrieve(customerId);
          if (customerData && !('deleted' in customerData) && customerData.metadata?.userId) {
            // Log failed payment attempt
            await DatabaseService.logUserActivity(customerData.metadata.userId, 'upgrade', {
              action: 'payment_failed',
              paymentIntentId: failedPayment.id,
              errorMessage: failedPayment.last_payment_error?.message
            });
          }
        }
        break;
        
      case 'invoice.payment_succeeded':
      case 'invoice.payment_failed':
        // Handle invoice events (subscription renewals, etc.)
        const invoice = event.data.object as any; // Using any temporarily to handle Stripe type issues
        if (invoice.subscription && invoice.customer) {
          // Get subscription details
          const subscriptionId = typeof invoice.subscription === 'string' 
            ? invoice.subscription 
            : invoice.subscription.id;
            
          const subscriptionDetails = await stripe.subscriptions.retrieve(subscriptionId);
          
          // Update subscription data
          await handleSubscriptionChange(subscriptionDetails);
          
          // For payment failures, alert the system
          if (event.type === 'invoice.payment_failed') {
            console.log(`❌ Invoice payment failed for subscription: ${subscriptionId}`);
          }
        }
        break;
        
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle one-time payments
 * Updates user quota and logs the payment
 */
async function handleOneTimePayment(paymentIntentId: string, customerId: string) {
  try {
    console.log(`✅ Payment succeeded: ${paymentIntentId}`);
    
    // Get payment details
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const amount = paymentIntent.amount / 100; // Convert cents to dollars
    
    // Get customer to find user ID
    const customerData = await stripe.customers.retrieve(customerId);
    
    if (customerData && !('deleted' in customerData) && customerData.metadata?.userId) {
      const userId = customerData.metadata.userId;
      
      // Get user data
      const user = await DatabaseService.getUser(userId);
      
      if (user) {
        // Add credits or quota based on payment amount
        // Example: $10 = 10GB additional quota
        const additionalQuota = Math.floor(amount * 1024 * 1024 * 1024); // Convert $ to bytes
        
        // Update user quota
        await DatabaseService.updateUser(userId, {
          quota: {
            ...user.quota,
            total: user.quota.total + additionalQuota
          }
        });
        
        // Log payment activity
        await DatabaseService.logUserActivity(userId, 'upgrade', {
          action: 'one_time_payment',
          paymentIntentId,
          amount,
          additionalQuota
        });
        
        console.log(`Added ${additionalQuota} bytes to quota for user ${userId}`);
      }
    }
  } catch (error) {
    console.error('Error processing payment:', error);
  }
}
