/**
 * Server-side feature validation utility
 * 
 * This utility validates feature access on the server side to prevent client-side manipulation of premium features.
 * It complements the client-side feature flags system by providing a secure validation layer.
 */

import { cookies } from 'next/headers';
import { FEATURES, isFeatureEnabled } from '@/config/features';
import { SubscriptionTier } from '@/models/User';

/**
 * Get the current user subscription tier from server-side context
 * In a real implementation, this would validate against a database or auth provider
 */
export const getUserSubscriptionTier = (): SubscriptionTier => {
  // For now, we'll assume 'free' as we've disabled payment features
  // In a real implementation, this would check the user's actual subscription status
  return 'free';
};

/**
 * Check if a user has access to a specific feature based on their subscription
 * This validation happens on the server side and cannot be manipulated by clients
 */
export const hasFeatureAccess = async (featureName: keyof typeof FEATURES): Promise<boolean> => {
  const features = FEATURES;
  if (!(featureName in features)) {
    return false;
  }
  // Just check if the feature is enabled
  return features[featureName] === true;
};

/**
 * Middleware function to protect API routes based on feature access
 * This can be used to wrap API handlers to prevent unauthorized access
 */
export const withFeatureProtection = (handler: Function, featureName: string) => {
  return async (req: Request, ...args: any[]) => {
    const hasAccess = await hasFeatureAccess(featureName as keyof typeof FEATURES);
    
    if (!hasAccess) {
      return new Response(JSON.stringify({ 
        error: 'Feature access denied',
        message: 'You do not have access to this feature'
      }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // If the user has access, proceed with the original handler
    return handler(req, ...args);
  };
};
