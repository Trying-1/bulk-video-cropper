'use client';

import { Suspense } from 'react';

/**
 * App template component providing Suspense boundaries for the entire application
 * This ensures all client components using useSearchParams() are properly wrapped
 * Required for Next.js 14+ to avoid the "useSearchParams() should be wrapped in a suspense boundary" error
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-4 border-teal-500 border-solid rounded-full animate-spin"></div>
      </div>
    }>
      {children}
    </Suspense>
  );
}
