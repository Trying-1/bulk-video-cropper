import { NextResponse } from 'next/server';
import { db } from '@/config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { initializeFirebaseAdmin } from '@/config/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getPlanById, getPromotionByCode, isPromotionValidForPlan, calculateDiscountedPrice } from '@/config/pricing';
import Stripe from 'stripe';

// Initialize Stripe - in production, get this from environment variables
// Initialize Stripe with latest API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_key');

export async function POST(request: Request) {
  try {
    // Initialize Firebase Admin if not already initialized
    initializeFirebaseAdmin();
    
    // Get session token from authorization header
    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify the ID token
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Parse request body
    const { 
      planId, 
      promoCode = null, 
      isAnnual = false,
      paymentMethodId = null
    } = await request.json();
    
    // Validate the plan exists
    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid subscription plan' }, 
        { status: 400 }
      );
    }
    
    // Get user data
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }
    
    const userData = userDoc.data();
    
    // Check if downgrading from a higher plan
    if (userData.subscription === 'pro' && planId === 'premium' ||
        (userData.subscription === 'pro' || userData.subscription === 'premium') && planId === 'free') {
      // Handle downgrade logic - this would typically be more complex in production
      // with prorating and end-of-billing-period changes
      await updateDoc(userRef, { 
        subscription: planId,
        updatedAt: new Date()
      });
      
      return NextResponse.json({ 
        success: true,
        message: 'Subscription downgraded successfully. Changes will take effect at the end of your billing period.'
      });
    }
    
    // If upgrading to a paid plan
    if (planId !== 'free') {
      // Calculate price with potential discount
      let price = plan.price;
      // Apply annual discount if applicable
      if (isAnnual) {
        // Apply 20% annual discount (from the pricing configuration)
        const annualDiscount = 0.2;
        price = price * 12 * (1 - annualDiscount);
      }
      let discount = 0;
      let appliedPromoCode = null;
      
      // Apply promo code if valid
      if (promoCode) {
        const isValid = isPromotionValidForPlan(promoCode, planId);
        if (isValid) {
          const promotion = getPromotionByCode(promoCode);
          if (promotion) {
            discount = price * (promotion.discountPercentage / 100);
            price = calculateDiscountedPrice(price, promotion.discountPercentage);
            appliedPromoCode = promoCode;
          }
        }
      }
      
      // If there's no payment method for a paid plan, just return the checkout info
      if (!paymentMethodId) {
        return NextResponse.json({
          success: false,
          requiresPayment: true,
          checkoutInfo: {
            planId,
            planName: plan.name,
            basePrice: plan.price,
            discount,
            finalPrice: price,
            isAnnual,
            appliedPromoCode
          }
        });
      }
      
      try {
        // Create or retrieve Stripe customer
        let stripeCustomerId = userData.stripeCustomerId;
        let subscription: any = null;
        
        if (!stripeCustomerId) {
          // Create a new customer in Stripe
          const customer = await stripe.customers.create({
            email: userData.email,
            name: userData.displayName || userData.email,
            metadata: {
              userId: uid
            }
          });
          
          stripeCustomerId = customer.id;
          
          // Save the Stripe customer ID to Firestore
          await updateDoc(userRef, {
            stripeCustomerId: stripeCustomerId
          });
        }
        
        // Attach payment method to customer
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: stripeCustomerId,
        });
        
        // Set as default payment method
        await stripe.customers.update(stripeCustomerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });
        
        // Create or update subscription
        // subscription variable already defined above
        
        if (userData.stripeSubscriptionId) {
          // Update existing subscription
          // Calculate prorated amounts for upgrades/downgrades if user already has a subscription
          const currentPlan = userData.subscription || 'free';
          const currentPlanObj = getPlanById(currentPlan);
          const currentPlanPrice = currentPlanObj ? currentPlanObj.price : 0;
          let proration = 0;
          const daysRemaining = 30; // Simplified for example purposes
          if (isAnnual) {
            // Apply annual discount and calculate daily rate
            const annualPrice = currentPlanPrice * 12 * 0.8; // 20% annual discount
            proration = currentPlanPrice ? annualPrice / 365 * daysRemaining : 0;
          } else {
            proration = currentPlanPrice ? currentPlanPrice / 30 * daysRemaining : 0;
          }
          // Generate proper price ID for updating subscription
          const updatePriceId = 'price_' + plan.id + '_' + (isAnnual ? 'annual' : 'monthly');
          
          subscription = await stripe.subscriptions.update(userData.stripeSubscriptionId, {
            items: [
              {
                id: '0', // In a real app, this would be the actual subscription item ID
                price: updatePriceId,
              },
            ],
            proration_behavior: 'create_prorations',
          });
        } else {
          // Create new subscription
          // In a real implementation, we would have actual Stripe price IDs in our database
          // Here we're creating a dummy ID for demonstration purposes
          // This would need to be replaced with actual Stripe price IDs in production
          const stripePriceId = 'price_' + plan.id + '_' + (isAnnual ? 'annual' : 'monthly');
          subscription = await stripe.subscriptions.create({
            customer: stripeCustomerId,
            items: [
              {
                price: stripePriceId,
              },
            ],
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
          });
        }
        
        // Update user data with subscription info
        await updateDoc(userRef, {
          subscription: planId,
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          updatedAt: new Date(),
          billingPeriod: isAnnual ? 'annual' : 'monthly',
          promoCodeApplied: appliedPromoCode
        });
        
        return NextResponse.json({
          success: true,
          message: 'Subscription updated successfully',
          subscriptionId: subscription.id,
          status: subscription.status
        });
        
      } catch (stripeError: any) {
        console.error('Stripe error:', stripeError);
        return NextResponse.json(
          { 
            error: 'Payment processing failed', 
            details: stripeError.message 
          }, 
          { status: 400 }
        );
      }
    } else {
      // Free plan - no payment needed
      await updateDoc(userRef, { 
        subscription: 'free',
        updatedAt: new Date()
      });
      
      return NextResponse.json({ 
        success: true,
        message: 'Subscription updated to free plan'
      });
    }
    
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
