import { 
  SUBSCRIPTION_VIDEO_LIMITS,
  SUBSCRIPTION_DURATION_LIMITS,
  SUBSCRIPTION_SIZE_LIMITS 
} from '@/config/subscriptionPlans';

/**
 * Gets the plan name from a subscription object
 * @param subscription User's subscription object from AuthContext
 * @returns Uppercase plan name or 'FREE' as default
 */
function getPlanName(subscription: any | null): string {
  if (!subscription) {
    return 'FREE';
  }
  
  // Check for simple string format (e.g., "pro")
  if (typeof subscription === 'string') {
    return subscription.toUpperCase();
  }
  
  // Check if subscription is a direct property (e.g., {subscription: "pro"})
  if (typeof subscription.subscription === 'string') {
    return subscription.subscription.toUpperCase();
  }
  
  // Check for complex object format (e.g., {plan: {name: "premium"}})
  return subscription?.plan?.name?.toUpperCase() || 'FREE';
}

/**
 * Determines the maximum number of videos allowed based on user's subscription plan
 * @param subscription User's subscription object from AuthContext
 * @returns Maximum number of videos allowed
 */
export function getVideoLimitBySubscription(subscription: any | null): number {
  const planName = getPlanName(subscription);
  
  switch (planName) {
    case 'PREMIUM':
      return SUBSCRIPTION_VIDEO_LIMITS.PREMIUM;
    case 'PRO':
      return SUBSCRIPTION_VIDEO_LIMITS.PRO;
    case 'FREE':
    default:
      return SUBSCRIPTION_VIDEO_LIMITS.FREE;
  }
}

/**
 * Determines the maximum video duration (in seconds) allowed based on user's subscription plan
 * @param subscription User's subscription object from AuthContext
 * @returns Maximum video duration in seconds
 */
export function getVideoDurationLimitBySubscription(subscription: any | null): number {
  const planName = getPlanName(subscription);
  
  switch (planName) {
    case 'PREMIUM':
      return SUBSCRIPTION_DURATION_LIMITS.PREMIUM;
    case 'PRO':
      return SUBSCRIPTION_DURATION_LIMITS.PRO;
    case 'FREE':
    default:
      return SUBSCRIPTION_DURATION_LIMITS.FREE;
  }
}

/**
 * Determines the maximum video file size (in MB) allowed based on user's subscription plan
 * @param subscription User's subscription object from AuthContext
 * @returns Maximum video file size in MB
 */
export function getVideoSizeLimitBySubscription(subscription: any | null): number {
  const planName = getPlanName(subscription);
  
  switch (planName) {
    case 'PREMIUM':
      return SUBSCRIPTION_SIZE_LIMITS.PREMIUM;
    case 'PRO':
      return SUBSCRIPTION_SIZE_LIMITS.PRO;
    case 'FREE':
    default:
      return SUBSCRIPTION_SIZE_LIMITS.FREE;
  }
}
