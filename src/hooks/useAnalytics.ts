'use client';

import { useEffect, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView, trackEvent } from '@/config/firebase';

/**
 * Custom hook for Firebase Analytics tracking
 * 
 * Automatically tracks page views and provides methods for custom event tracking
 */
export const useAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views automatically
  useEffect(() => {
    if (pathname) {
      // Add any search parameters to the page path
      const queryString = searchParams?.toString();
      const pagePath = queryString ? `${pathname}?${queryString}` : pathname;
      
      // Get page title from document if available
      const pageTitle = typeof document !== 'undefined' ? document.title : pathname;
      
      // Track the page view
      trackPageView(pagePath, pageTitle);
    }
  }, [pathname, searchParams]);

  // Method to track custom events
  const logEvent = useCallback((eventName: string, eventParams?: Record<string, any>) => {
    trackEvent(eventName, eventParams);
  }, []);

  return { logEvent };
};
