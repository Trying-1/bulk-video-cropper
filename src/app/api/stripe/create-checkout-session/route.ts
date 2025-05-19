import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/config/stripe';

// Map of plan IDs to their Stripe price IDs
// In a production app, you would store these in a database or environment variables
const PLAN_PRICE_IDS = {
  premium: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_placeholder',
  pro: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_placeholder',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, userId, successUrl, cancelUrl } = body;
    
    // Validate the plan exists
    if (!PLAN_PRICE_IDS[planId as keyof typeof PLAN_PRICE_IDS]) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }
    
    // Create a checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: PLAN_PRICE_IDS[planId as keyof typeof PLAN_PRICE_IDS],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${request.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${request.headers.get('origin')}/plans`,
      metadata: {
        userId,
        planId,
      },
    });
    
    return NextResponse.json({ url: session.url });
    
  } catch (error) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
