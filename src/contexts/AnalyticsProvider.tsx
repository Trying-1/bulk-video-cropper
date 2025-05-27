'use client';

import { useEffect, createContext, useContext, ReactNode, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initAnalytics, trackPageView, trackEvent } from '@/config/firebase';

// Define the Analytics Context type
type AnalyticsContextType = {
  trackEvent: (eventName: string, eventParams?: Record<string, any>) => void;
};

// Create the context with default values
const AnalyticsContext = createContext<AnalyticsContextType>({
  trackEvent: () => {}, // Default empty implementation
});

// Custom hook to use analytics
export const useAnalytics = () => useContext(AnalyticsContext);

interface AnalyticsProviderProps {
  children: ReactNode;
}

// SearchParams component needs to be inside Suspense
function AnalyticsTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views when route changes
  useEffect(() => {
    if (pathname) {
      // Create full page path with query parameters
      const queryString = searchParams?.toString();
      const pagePath = queryString ? `${pathname}?${queryString}` : pathname;
      
      // Get page title from document if available
      const pageTitle = typeof document !== 'undefined' ? document.title : pathname;
      
      // Track the page view
      trackPageView(pagePath, pageTitle);
      
      console.log('Analytics: Page view tracked', pagePath);
    }
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  // Initialize analytics when component mounts
  useEffect(() => {
    const init = async () => {
      await initAnalytics();
    };
    init();
  }, []);

  // Function to track custom events
  const handleTrackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    trackEvent(eventName, eventParams);
    console.log('Analytics: Custom event tracked', eventName, eventParams);
  };

  // Provide the analytics context to children
  return (
    <AnalyticsContext.Provider value={{ trackEvent: handleTrackEvent }}>
      <Suspense fallback={null}>
        <AnalyticsTracking />
      </Suspense>
      {children}
    </AnalyticsContext.Provider>
  );
}
