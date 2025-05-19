import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto">
        <Card className="p-8">
          <div className="text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
            <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">
              Your payment has been processed successfully. You can now start using the video cropping service.
            </p>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
