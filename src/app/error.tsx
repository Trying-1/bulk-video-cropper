'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <div className="inline-block">
            <svg className="h-24 w-24 text-orange-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight sm:text-4xl">Something went wrong</h1>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">We're sorry for the inconvenience</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          An unexpected error has occurred. Our team has been notified.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Try again
          </button>
          <div className="mt-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Return to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
