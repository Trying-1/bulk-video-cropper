import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In a real application, this would be your backend API endpoint
  const processPayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Here you would typically:
      // 1. Send payment details to your backend
      // 2. Create a payment intent with Stripe
      // 3. Handle the payment confirmation

      // Simulating payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to success page
      router.push('/payment/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <Card className="max-w-md mx-auto p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span>Video Cropping Service</span>
                <span>$9.99</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>$9.99</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}

          <Button
            onClick={processPayment}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              'Complete Payment'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
