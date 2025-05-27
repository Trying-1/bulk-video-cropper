'use client';

import React, { Suspense, ReactNode } from 'react';

interface SearchParamsWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A wrapper component that provides a Suspense boundary for components using useSearchParams()
 * This is required in Next.js 14+ to prevent build errors
 */
export default function SearchParamsWrapper({ 
  children, 
  fallback = <div className="p-4 text-center">Loading...</div> 
}: SearchParamsWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}
