'use client';

// Prevent static generation errors with useSearchParams
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // In a production application, you would verify the session with your backend
      // For this MVP, we'll just set a timeout to simulate checking the payment
      const timer = setTimeout(() => {
        setLoading(false);
        setPaymentDetails({
          status: 'succeeded',
          planName: localStorage.getItem('selected_plan_name') || 'Premium',
          date: new Date().toLocaleDateString()
        });
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
      setError('No payment session found. Please contact support if you believe this is an error.');
    }
  }, [searchParams, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Processing Your Payment</h2>
              <p className="text-gray-600 dark:text-gray-300">Please wait while we confirm your payment...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="h-12 w-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Error</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
              <Link
                href="/plans"
                className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg px-6 py-3 transition-colors"
              >
                Return to Plans
              </Link>
            </div>
          ) : (
            <div className="p-8">
              <div className="h-16 w-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
                Payment Successful!
              </h2>
              
              <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Payment Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Plan:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{paymentDetails?.planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Status:</span>
                    <span className="font-medium text-green-500">Completed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Date:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{paymentDetails?.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Thank you for your purchase! Your subscription is now active and you can start enjoying all the premium features.
                </p>
                
                <div className="space-x-4">
                  <Link
                    href="/editor"
                    className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg px-6 py-3 transition-colors"
                  >
                    Start Using Your Plan
                  </Link>
                  
                  <Link
                    href="/profile"
                    className="inline-block bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-medium rounded-lg px-6 py-3 transition-colors"
                  >
                    Go to Profile
                  </Link>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full"></div>
    </div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
