/**
 * Secure Feature Hook
 * 
 * A React hook for securely validating feature access by checking with the server API
 * rather than relying solely on client-side feature flags that could be manipulated.
 */

import { useState, useEffect, useCallback } from 'react';
import { getFeatures, FEATURES } from '@/config/features';

/**
 * Hook for securely checking feature access
 * 
 * @param featureName The name of the feature to check access for
 * @returns An object containing access status and loading state
 */
export const useSecureFeature = (featureName: keyof typeof FEATURES) => {
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // First check client-side feature flags (as a quick initial check)
  const clientFeatures = getFeatures();
  const clientHasAccess = clientFeatures[featureName] === true;
  
  // Function to validate feature access with the server
  const validateFeatureAccess = useCallback(async () => {
    // If the feature is disabled on the client side, don't bother checking with the server
    if (!clientHasAccess) {
      setHasAccess(false);
      setIsLoading(false);
      return;
    }
    
    try {
      setError(null);
      setIsLoading(true);
      
      // Call the server API to validate feature access
      const response = await fetch(`/api/features/check?feature=${encodeURIComponent(featureName)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to validate feature access: ${response.status}`);
      }
      
      const data = await response.json();
      setHasAccess(data.hasAccess);
    } catch (err) {
      console.error('Error validating feature access:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Fallback to client-side check if server validation fails
      // This allows the app to work offline, but with less security
      setHasAccess(clientHasAccess);
    } finally {
      setIsLoading(false);
    }
  }, [featureName, clientHasAccess]);
  
  // Check feature access when the component mounts or when the feature name changes
  useEffect(() => {
    validateFeatureAccess();
  }, [validateFeatureAccess]);
  
  // Function to revalidate access, useful when subscription changes
  const revalidate = () => {
    validateFeatureAccess();
  };
  
  return {
    hasAccess,
    isLoading,
    error,
    revalidate
  };
};

/**
 * Hook for checking multiple features at once
 * 
 * @param featureNames Array of feature names to check
 * @returns Object with feature access results and loading state
 */
export const useSecureFeatures = (featureNames: (keyof typeof FEATURES)[]) => {
  const [accessResults, setAccessResults] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get client-side features for initial check
  const clientFeatures = getFeatures();
  
  // Function to validate multiple features at once
  const validateFeatureAccess = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Call the server API to validate all features in one request
      const response = await fetch('/api/features/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ features: featureNames })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to validate features: ${response.status}`);
      }
      
      const data = await response.json();
      setAccessResults(data.results);
    } catch (err) {
      console.error('Error validating features:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Fallback to client-side check if server validation fails
      const clientResults = featureNames.reduce((acc, feature) => {
        acc[feature] = clientFeatures[feature] === true;
        return acc;
      }, {} as Record<string, boolean>);
      
      setAccessResults(clientResults);
    } finally {
      setIsLoading(false);
    }
  }, [featureNames, clientFeatures]);
  
  // Check feature access when the component mounts or when feature names change
  useEffect(() => {
    validateFeatureAccess();
  }, [validateFeatureAccess]);
  
  // Function to revalidate access
  const revalidate = () => {
    validateFeatureAccess();
  };
  
  return {
    accessResults,
    isLoading,
    error,
    revalidate
  };
};
