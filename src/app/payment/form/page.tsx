'use client';

// Prevent static generation errors with Stripe Elements
export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Load Stripe outside of component to avoid recreating it on each render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      setIsLoading(false);
      return;
    }

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        setError(stripeError.message || 'An error occurred');
        setIsLoading(false);
        return;
      }

      // Here you would typically send the paymentMethod.id to your backend
      // For now, we'll just redirect to the checkout page
      router.push('/payment/checkout');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Payment Information</h1>
      <Card className="max-w-md mx-auto p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <CardElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  letterSpacing: '0.025em',
                  fontFamily: 'Source Code Pro, monospace',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }} />
          </div>

          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}

// Wrapper component to provide Stripe Elements context
export default function PaymentFormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full"></div>
    </div>}>
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </Suspense>
  );
}
