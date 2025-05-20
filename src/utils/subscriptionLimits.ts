import { SERVICE_LIMITS } from '@/config/pricing';

/**
 * Gets the plan name from a subscription object
 * @param subscription User's subscription object from AuthContext
 * @returns Uppercase plan name or 'FREE' as default
 */
function getPlanName(subscription: any | null): string {
  if (!subscription) {
    // If user is logged in but has no subscription, return FREE plan
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
 * Determines if the user is authenticated
 * @param user User object from AuthContext
 * @returns Boolean indicating whether user is authenticated
 */
function isUserAuthenticated(user: any | null): boolean {
  return !!user;
}

/**
 * Determines the maximum number of videos allowed per upload session based on user's subscription plan
 * @param user User object from AuthContext
 * @param subscription User's subscription object from AuthContext
 * @returns Maximum number of videos allowed per upload session
 */
export function getMaxUploadLimitBySubscription(user: any | null, subscription: any | null): number {
  // If user is not authenticated, use UNREGISTERED limits
  if (!isUserAuthenticated(user)) {
    return SERVICE_LIMITS.MAX_UPLOAD.UNREGISTERED;
  }
  
  const planName = getPlanName(subscription);
  
  switch (planName) {
    case 'PREMIUM':
      return SERVICE_LIMITS.MAX_UPLOAD.PREMIUM;
    case 'PRO':
      return SERVICE_LIMITS.MAX_UPLOAD.PRO;
    case 'FREE':
    default:
      return SERVICE_LIMITS.MAX_UPLOAD.FREE;
  }
}

/**
 * Determines the maximum number of videos allowed per month based on user's subscription plan
 * @param user User object from AuthContext
 * @param subscription User's subscription object from AuthContext
 * @returns Maximum number of videos allowed per month (or "Unlimited" for unlimited plans)
 */
export function getMonthlyLimitBySubscription(user: any | null, subscription: any | null): number | "Unlimited" {
  // If user is not authenticated, use UNREGISTERED limits
  if (!isUserAuthenticated(user)) {
    return SERVICE_LIMITS.TOTAL_CREDITS.UNREGISTERED;
  }
  
  const planName = getPlanName(subscription);
  
  switch (planName) {
    case 'PRO':
      // The PRO plan has a large credit allowance
      const proLimit = SERVICE_LIMITS.TOTAL_CREDITS.PRO;
      return proLimit === Infinity ? "Unlimited" : proLimit;
    case 'PREMIUM':
      return SERVICE_LIMITS.TOTAL_CREDITS.PREMIUM;
    case 'FREE':
    default:
      return SERVICE_LIMITS.TOTAL_CREDITS.FREE;
  }
}

/**
 * Determines the maximum video duration (in seconds) allowed based on user's subscription plan
 * @param user User object from AuthContext
 * @param subscription User's subscription object from AuthContext
 * @returns Maximum video duration in seconds
 */
export function getVideoDurationLimitBySubscription(user: any | null, subscription: any | null): number {
  // If user is not authenticated, use UNREGISTERED limits
  if (!isUserAuthenticated(user)) {
    return SERVICE_LIMITS.DURATION.UNREGISTERED;
  }
  
  const planName = getPlanName(subscription);
  
  switch (planName) {
    case 'PREMIUM':
      return SERVICE_LIMITS.DURATION.PREMIUM;
    case 'PRO':
      return SERVICE_LIMITS.DURATION.PRO;
    case 'FREE':
    default:
      return SERVICE_LIMITS.DURATION.FREE;
  }
}

/**
 * Determines the maximum video file size (in MB) allowed based on user's subscription plan
 * @param user User object from AuthContext
 * @param subscription User's subscription object from AuthContext
 * @returns Maximum video file size in MB
 */
export function getVideoSizeLimitBySubscription(user: any | null, subscription: any | null): number {
  // If user is not authenticated, use UNREGISTERED limits
  if (!isUserAuthenticated(user)) {
    return SERVICE_LIMITS.SIZE.UNREGISTERED;
  }
  
  const planName = getPlanName(subscription);
  
  switch (planName) {
    case 'PREMIUM':
      return SERVICE_LIMITS.SIZE.PREMIUM;
    case 'PRO':
      return SERVICE_LIMITS.SIZE.PRO;
    case 'FREE':
    default:
      return SERVICE_LIMITS.SIZE.FREE;
  }
}

/**
 * For backward compatibility - returns the maximum upload limit (same as getMaxUploadLimitBySubscription)
 * @param subscription User's subscription object from AuthContext
 * @returns Maximum number of videos allowed per upload session
 */
export function getVideoLimitBySubscription(subscription: any | null): number {
  // For backward compatibility, we assume user is authenticated if this function is called
  // with just a subscription parameter
  return getMaxUploadLimitBySubscription(true, subscription);
}
