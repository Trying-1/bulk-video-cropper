'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { APP_IDENTITY } from '@/config/branding';

export default function NotFoundContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  
  // Get the referring path from search params if available
  const referrer = searchParams?.get('from') || '';
  
  // Automatically redirect to landing page after 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          Sorry, the page you are looking for doesn't exist or has been moved.
          {referrer && <span className="block mt-2">Unable to find: {referrer}</span>}
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link
            href="/"
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            Go Home
          </Link>
          
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Go Back
          </button>
        </div>
        
        <div className="mt-6 text-gray-500 text-sm">
          Redirecting to home in <span className="text-teal-600 font-medium">{countdown}</span> seconds...
        </div>
      </div>
    </div>
  );
}
