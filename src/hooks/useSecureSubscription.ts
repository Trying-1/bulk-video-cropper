/**
 * Secure Subscription Hook
 * 
 * This hook provides secure access to subscription information and feature validation
 * by checking with the server rather than relying on client-side data that could be manipulated.
 * It maintains a clean interface without popups or prompts.
 */

import { useState, useEffect, useCallback } from 'react';
import { useCsrfFetch } from '@/utils/csrfProtection';
import { trackSuspiciousActivity } from '@/utils/securityMonitoring';

// Subscription limits interface
interface SubscriptionLimits {
  videoLimit: number;
  videoDurationLimit: number;
  videoSizeLimit: number;
  batchProcessing: boolean | number;
  watermark: boolean;
  outputQuality: string;
}

// Default subscription limits for fallback
const DEFAULT_LIMITS: SubscriptionLimits = {
  videoLimit: 5,
  videoDurationLimit: 60, // 1 minute
  videoSizeLimit: 100, // 100MB
  batchProcessing: false,
  watermark: true,
  outputQuality: 'standard',
};

/**
 * Hook for securely accessing subscription limits
 * 
 * @param userId Optional user ID (will be extracted from session in production)
 * @returns Subscription limits and loading state
 */
export const useSubscriptionLimits = (userId?: string) => {
  const [limits, setLimits] = useState<SubscriptionLimits>(DEFAULT_LIMITS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get CSRF-protected fetch
  const { csrfFetch } = useCsrfFetch();
  
  // Function to fetch subscription limits from the server
  const fetchLimits = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Build the URL with optional userId
      const url = `/api/subscription/validate${userId ? `?userId=${encodeURIComponent(userId)}` : ''}`;
      
      // Fetch limits from the server
      const response = await csrfFetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch subscription limits: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update limits
      setLimits(data.limits);
    } catch (err) {
      console.error('Error fetching subscription limits:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Track suspicious activity if there's an unexpected error
      if (err instanceof Error && !err.message.includes('Failed to fetch')) {
        trackSuspiciousActivity('subscription_limits_error', {
          error: err instanceof Error ? err.message : String(err)
        });
      }
      
      // Fall back to default limits
      setLimits(DEFAULT_LIMITS);
    } finally {
      setIsLoading(false);
    }
  }, [userId, csrfFetch]);
  
  // Fetch limits on mount and when userId changes
  useEffect(() => {
    fetchLimits();
  }, [fetchLimits]);
  
  // Function to refresh the limits
  const refreshLimits = () => {
    fetchLimits();
  };
  
  return {
    limits,
    isLoading,
    error,
    refreshLimits
  };
};

/**
 * Hook for checking feature access
 * 
 * @param features Array of feature names to check
 * @param userId Optional user ID
 * @returns Feature access results and loading state
 */
export const useFeatureAccess = (features: string[], userId?: string) => {
  const [accessResults, setAccessResults] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get CSRF-protected fetch
  const { csrfFetch } = useCsrfFetch();
  
  // Function to check feature access
  const checkFeatureAccess = useCallback(async () => {
    // Initialize with all features denied during loading
    const initialResults: Record<string, boolean> = {};
    features.forEach(feature => {
      initialResults[feature] = false;
    });
    
    if (isLoading) {
      setAccessResults(initialResults);
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Call the API to check feature access
      const response = await csrfFetch('/api/subscription/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          features
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to check feature access: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update access results
      setAccessResults(data.results);
    } catch (err) {
      console.error('Error checking feature access:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Track suspicious activity for unexpected errors
      if (err instanceof Error && !err.message.includes('Failed to fetch')) {
        trackSuspiciousActivity('feature_access_error', {
          error: err instanceof Error ? err.message : String(err),
          features
        });
      }
      
      // Fall back to denying all features
      setAccessResults(initialResults);
    } finally {
      setIsLoading(false);
    }
  }, [features, userId, csrfFetch, isLoading]);
  
  // Check feature access when component mounts or dependencies change
  useEffect(() => {
    checkFeatureAccess();
  }, [checkFeatureAccess]);
  
  // Function to refresh access checks
  const refreshAccess = () => {
    checkFeatureAccess();
  };
  
  return {
    accessResults,
    isLoading,
    error,
    refreshAccess,
    // Convenience functions for checking individual features
    hasAccess: (feature: string) => accessResults[feature] || false
  };
};

/**
 * Component props for conditional rendering based on subscription
 */
export interface SubscriptionGuardProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Hook that provides a complete subscription management solution
 * 
 * @param userId Optional user ID
 * @returns Subscription management functions and data
 */
export const useSubscription = (userId?: string) => {
  // Get subscription limits
  const { 
    limits, 
    isLoading: limitsLoading, 
    refreshLimits 
  } = useSubscriptionLimits(userId);
  
  // Common premium features to check
  const commonFeatures = [
    'batchProcessing',
    'highQualityOutput',
    'noWatermark',
    'extendedVideoLimit',
    'extendedDurationLimit',
    'extendedSizeLimit'
  ];
  
  // Check access to common features
  const { 
    accessResults, 
    isLoading: featuresLoading,
    refreshAccess
  } = useFeatureAccess(commonFeatures, userId);
  
  // Calculate if the user has any premium features
  const hasPremiumFeatures = Object.values(accessResults).some(access => access);
  
  // Function to check if a user can upload more videos
  const canUploadMoreVideos = (currentCount: number) => {
    return currentCount < limits.videoLimit;
  };
  
  // Function to check if a video duration is allowed
  const isVideoDurationAllowed = (durationSeconds: number) => {
    return durationSeconds <= limits.videoDurationLimit;
  };
  
  // Function to check if a video size is allowed
  const isVideoSizeAllowed = (sizeMB: number) => {
    return sizeMB <= limits.videoSizeLimit;
  };
  
  // Refresh all subscription data
  const refreshSubscription = () => {
    refreshLimits();
    refreshAccess();
  };
  
  return {
    limits,
    isLoading: limitsLoading || featuresLoading,
    hasPremiumFeatures,
    featureAccess: accessResults,
    canUploadMoreVideos,
    isVideoDurationAllowed,
    isVideoSizeAllowed,
    hasFeature: (feature: string) => accessResults[feature] || false,
    refreshSubscription
  };
};
