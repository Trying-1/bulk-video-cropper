/**
 * Subscription Validator Utility
 * 
 * This utility provides secure validation of subscription status and access control
 * for premium features, protecting against client-side manipulation attempts.
 */

import { SUBSCRIPTION_PLANS, SubscriptionPlan, SERVICE_LIMITS } from '@/config/pricing';
import { secureGet, secureSet } from './secureStorage';
import { logSecurityEvent, SecurityEventType } from './securityMonitoring';

// Default subscription plan for users without a subscription
const DEFAULT_PLAN = SUBSCRIPTION_PLANS.FREE;

/**
 * Check if a feature is available for a given subscription tier
 * 
 * @param featureName The name of the feature to check
 * @param planId The subscription plan ID
 * @returns Whether the feature is available
 */
export const isFeatureAvailableForPlan = (featureName: string, planId: string): boolean => {
  const plan = SUBSCRIPTION_PLANS[planId.toUpperCase()] || DEFAULT_PLAN;
  
  // Check if the feature is included in the plan's features list
  if (plan.features.includes(featureName)) {
    return true;
  }
  
  // For specific features that aren't directly in the features array
  switch (featureName) {
    case 'batchProcessing':
      return plan.features.includes('Batch processing');
      
    case 'highQualityOutput':
      return plan.features.includes('High-quality output');
      
    case 'noWatermark':
      return plan.features.includes('No watermark');
      
    case 'extendedVideoLimit':
      return true; // We now use credits instead of video limits
      
    case 'extendedDurationLimit':
      return true; // All plans have the same duration limit now
      
    case 'extendedSizeLimit':
      return plan.features.includes('Extended size limit') || plan.id !== 'free';
      
    // Default to false for unknown features
    default:
      return false;
  }
};

/**
 * Get the subscription plan for a user
 * In a real implementation, this would verify with a database
 * 
 * @param userId The user ID to check
 * @returns The subscription plan
 */
export const getUserSubscriptionPlan = (userId?: string): SubscriptionPlan => {
  if (!userId) {
    return DEFAULT_PLAN;
  }
  
  try {
    // In a real implementation, this would verify with a database or auth provider
    // This is a simplified version that uses secure local storage
    const storedPlanId = secureGet<string>(`user_${userId}_subscription`);
    
    if (!storedPlanId) {
      return DEFAULT_PLAN;
    }
    
    // Get the plan from the configuration
    const plan = SUBSCRIPTION_PLANS[storedPlanId.toUpperCase()];
    
    if (!plan) {
      // Log a security event if the stored plan ID is invalid
      logSecurityEvent(
        SecurityEventType.SUSPICIOUS_ACTIVITY,
        'medium',
        {
          activity: 'invalid_subscription_plan',
          userId,
          planId: storedPlanId
        }
      );
      
      return DEFAULT_PLAN;
    }
    
    return plan;
  } catch (error) {
    // Log an error and return the default plan
    console.error('Error getting user subscription plan:', error);
    
    // Log a security event
    logSecurityEvent(
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      'medium',
      {
        activity: 'subscription_validation_error',
        userId,
        error: error instanceof Error ? error.message : String(error)
      }
    );
    
    return DEFAULT_PLAN;
  }
};

/**
 * Check if a user has access to a specific feature
 * 
 * @param featureName The name of the feature to check
 * @param userId The user ID to check (optional)
 * @returns Whether the user has access to the feature
 */
export const hasFeatureAccess = (featureName: string, userId?: string): boolean => {
  // Get the user's subscription plan
  const plan = getUserSubscriptionPlan(userId);
  
  // Check if the feature is available for the plan
  return isFeatureAvailableForPlan(featureName, plan.id);
};

/**
 * Get the subscription limits for a user
 * 
 * @param userId The user ID to check (optional)
 * @returns Subscription limits
 */
export const getSubscriptionLimits = (userId?: string) => {
  const plan = getUserSubscriptionPlan(userId);
  
  return {
    totalCredits: plan.totalCredits,
    maxUploads: plan.maxUploadsAtOnce,
    hasBatchProcessing: plan.features.includes('Batch processing'),
    hasWatermark: !plan.features.includes('No watermark'),
    hasHighQuality: plan.features.includes('High-quality output'),
    // Legacy fields kept for backwards compatibility
    videoLimit: plan.totalCredits, // Credits are now equivalent to video limit
    videoDurationLimit: 300, // Default for all plans
    videoSizeLimit: plan.id === 'free' ? 100 : 500, // MB, simplified for free vs paid plans
  };
};

/**
 * Mock function to update a user's subscription 
 * In a real implementation, this would interact with a payment provider
 * 
 * @param userId The user ID to update
 * @param planId The new plan ID
 * @returns Whether the update was successful
 */
export const updateUserSubscription = (userId: string, planId: string): boolean => {
  try {
    // Validate the plan ID
    if (!SUBSCRIPTION_PLANS[planId.toUpperCase()]) {
      return false;
    }
    
    // Save the subscription to secure storage
    secureSet(`user_${userId}_subscription`, planId.toUpperCase());
    
    return true;
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return false;
  }
};
