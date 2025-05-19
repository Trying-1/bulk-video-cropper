import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/config/stripe';
import { isFeatureEnabled } from '@/config/features';

// Define plan prices in cents
const PLAN_PRICES = {
  premium: {
    amount: 999, // $9.99 in cents
    currency: 'usd',
  },
  pro: {
    amount: 2999, // $29.99 in cents
    currency: 'usd',
  }
};

export async function POST(request: NextRequest) {
  try {
    // Check if payments are enabled
    if (!isFeatureEnabled('ENABLE_PAYMENTS')) {
      console.log('Payment feature is disabled in MVP mode');
      // Return a mock successful response for the MVP
      return NextResponse.json({
        clientSecret: 'mock_payment_intent_client_secret_for_mvp',
        message: 'MVP mode: Real payments are disabled',
      });
    }
    
    const body = await request.json();
    const { planId, userId } = body;
    
    // Validate the plan exists
    if (!PLAN_PRICES[planId as keyof typeof PLAN_PRICES]) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }
    
    // Validate user is authenticated
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get plan price details
    const { amount, currency } = PLAN_PRICES[planId as keyof typeof PLAN_PRICES];
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        userId,
        planId,
      },
    });
    
    // Return the client secret for the payment intent
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret 
    });
    
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
