'use client';

// Prevent static generation errors with useSearchParams
export const dynamic = 'force-dynamic';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import StreamlinedPaymentFlow from '@/components/StreamlinedPaymentFlow';
import { updateAppStateCookie } from '@/utils/cookies';

function PaymentContent() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/editor';
  const { user } = useAuth();
  
  useEffect(() => {
    // Track analytics for payment page
    updateAppStateCookie({
      lastVisitedPage: '/payment',
      paymentPageVisited: new Date().toISOString()
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Upgrade Your Experience
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose the plan that works best for you and start creating amazing videos today.
          </p>
        </div>
        
        <StreamlinedPaymentFlow returnUrl={returnUrl} />
        
        <div className="mt-16 bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Why Upgrade?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <h3 className="ml-4 text-lg font-medium text-gray-900 dark:text-white">
                  Advanced Editing
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 ml-14">
                Access premium cropping options, custom aspect ratios, and advanced editing features.
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="ml-4 text-lg font-medium text-gray-900 dark:text-white">
                  No Limitations
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 ml-14">
                Process longer videos, remove watermarks, and enjoy unlimited video processing.
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="ml-4 text-lg font-medium text-gray-900 dark:text-white">
                  Faster Processing
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 ml-14">
                Priority processing queue and batch processing for multiple videos simultaneously.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Secure Payments
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            All payments are processed securely through Stripe. We never store your full credit card information on our servers.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full"></div>
    </div>}>
      <PaymentContent />
    </Suspense>
  );
}
