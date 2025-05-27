'use client';

import React, { Suspense, ReactNode } from 'react';

interface ClientWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A global wrapper component for client components
 * Provides Suspense boundaries for Next.js 14+ requirements around useSearchParams()
 */
export default function ClientWrapper({ 
  children, 
  fallback = <div className="p-4 flex items-center justify-center min-h-[200px]">
    <div className="w-8 h-8 border-t-4 border-teal-500 border-solid rounded-full animate-spin"></div>
  </div> 
}: ClientWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}
