/**
 * Video Usage Tracking Utilities
 * 
 * This module contains functions to track and manage video credits according to subscription plans.
 * It handles both upload limits and credit usage as defined in the pricing configuration.
 */

import { updateAppStateCookie, getAppStateCookie, getCookie, COOKIE_APP_STATE, AppState } from './cookies';
import { SUBSCRIPTION_PLANS, SERVICE_LIMITS } from '@/config/pricing';
import { getUserSubscription, updateUserUsage } from '@/api/subscriptionService';

/**
 * Initialize video usage tracking for a new user
 */
export function initializeVideoUsageTracking(): void {
  const appState = getAppStateCookie() || {};
  
  if (!appState.videoUsage) {
    updateAppStateCookie({
      videoUsage: {
        currentUploadSession: {
          count: 0,
          startedAt: new Date().toISOString()
        },
        monthlyUsage: {
          count: 0,
          lastResetDate: new Date().toISOString(),
          processingHistory: []
        },
        totalProcessed: 0
      }
    });
  }
}

/**
 * Start a new upload session
 */
export function startNewUploadSession(): void {
  const appState = getAppStateCookie() || {};
  const videoUsage = appState.videoUsage || {
    currentUploadSession: { count: 0, startedAt: '' },
    monthlyUsage: { count: 0, lastResetDate: '', processingHistory: [] },
    totalProcessed: 0
  };
  
  // Reset the current session counter
  videoUsage.currentUploadSession = {
    count: 0,
    startedAt: new Date().toISOString()
  };
  
  updateAppStateCookie({ videoUsage });
}

/**
 * Check if the user has reached their upload session limit
 * @param userId Optional user ID for registered users
 * @returns Object containing information about the limit status
 */
export async function checkUploadSessionLimit(userId?: string): Promise<{
  canUpload: boolean;
  currentCount: number;
  limit: number;
  remaining: number;
}> {
  // Get user's subscription plan level
  const planLevel = userId ? await getUserPlanLevel(userId) : 'UNREGISTERED';
  
  // Get the session limit from the service limits
  const limit = planLevel in SERVICE_LIMITS.MAX_UPLOAD 
    ? SERVICE_LIMITS.MAX_UPLOAD[planLevel as keyof typeof SERVICE_LIMITS.MAX_UPLOAD] 
    : SERVICE_LIMITS.MAX_UPLOAD.DEFAULT;
  
  // Get current upload session count
  const appState = getAppStateCookie() || {};
  const videoUsage = appState.videoUsage || {
    currentUploadSession: { count: 0, startedAt: new Date().toISOString() },
    monthlyUsage: { count: 0, lastResetDate: '', processingHistory: [] },
    totalProcessed: 0
  };
  
  const currentCount = videoUsage.currentUploadSession.count;
  const remaining = Math.max(0, limit - currentCount);
  
  return {
    canUpload: currentCount < limit,
    currentCount,
    limit,
    remaining
  };
}

/**
 * Check if the user has reached their credit limit
 * @param userId Optional user ID for registered users
 * @returns Object containing information about the credit limit status
 */
export async function checkCreditLimit(userId?: string): Promise<{
  canProcess: boolean;
  currentCount: number;
  limit: number | "Unlimited";
  remaining: number | "Unlimited";
}> {
  // Get user's subscription plan level
  const planLevel = userId ? await getUserPlanLevel(userId) : 'UNREGISTERED';
  
  // Get the total credits from the service limits
  const limitValue = planLevel in SERVICE_LIMITS.TOTAL_CREDITS
    ? SERVICE_LIMITS.TOTAL_CREDITS[planLevel as keyof typeof SERVICE_LIMITS.TOTAL_CREDITS]
    : SERVICE_LIMITS.TOTAL_CREDITS.DEFAULT;
  
  // Get current monthly usage
  const appState = getAppStateCookie() || {};
  
  // Initialize if not exists
  if (!appState.videoUsage) {
    initializeVideoUsageTracking();
    return {
      canProcess: true,
      currentCount: 0,
      limit: limitValue === Infinity ? "Unlimited" : limitValue,
      remaining: limitValue === Infinity ? "Unlimited" : limitValue
    };
  }
  
  const currentCount = appState.videoUsage.monthlyUsage.count;
  
  // Handle unlimited plans (Pro plan)
  if (limitValue === Infinity) {
    return {
      canProcess: true,
      currentCount,
      limit: "Unlimited",
      remaining: "Unlimited"
    };
  }
  
  // Check if we need to reset the monthly counter (new month)
  const lastResetDate = new Date(appState.videoUsage.monthlyUsage.lastResetDate);
  const currentDate = new Date();
  
  if (lastResetDate.getMonth() !== currentDate.getMonth() || 
      lastResetDate.getFullYear() !== currentDate.getFullYear()) {
    // It's a new month, reset the counter
    resetMonthlyUsage();
    return {
      canProcess: true,
      currentCount: 0,
      limit: limitValue,
      remaining: limitValue
    };
  }
  
  const remaining = Math.max(0, limitValue - currentCount);
  
  return {
    canProcess: currentCount < limitValue,
    currentCount,
    limit: limitValue,
    remaining
  };
}

/**
 * Reset the credits usage counter (automatically called at the beginning of a new month)
 */
export function resetMonthlyUsage(): void {
  const appState = getAppStateCookie() || {};
  const videoUsage = appState.videoUsage || {
    currentUploadSession: { count: 0, startedAt: '' },
    monthlyUsage: { count: 0, lastResetDate: '', processingHistory: [] },
    totalProcessed: 0
  };
  
  // Reset credit counter but keep the history for reference
  videoUsage.monthlyUsage = {
    count: 0,
    lastResetDate: new Date().toISOString(),
    processingHistory: [] // Optionally, you could archive the history instead of clearing it
  };
  
  updateAppStateCookie({ videoUsage });
}

/**
 * Record a video upload to track against session limits
 * @param count Number of videos uploaded in this action (default: 1)
 */
export function recordVideoUpload(count: number = 1): void {
  const appState = getAppStateCookie() || {};
  const videoUsage = appState.videoUsage || {
    currentUploadSession: { count: 0, startedAt: new Date().toISOString() },
    monthlyUsage: { count: 0, lastResetDate: '', processingHistory: [] },
    totalProcessed: 0
  };
  
  // Increment the session counter
  videoUsage.currentUploadSession.count += count;
  
  updateAppStateCookie({ videoUsage });
}

/**
 * Record a video processed to use a credit
 * Both updates the local cookie storage and the database if user is logged in
 * @param videoId Unique identifier for the processed video
 * @param fileSize Size of the video in MB
 * @param duration Duration of the video in seconds
 * @param userId Optional user ID for registered users
 */
export async function recordVideoProcessed(videoId: string, fileSize: number, duration: number, userId?: string): Promise<void> {
  // 1. Update local cookie storage (works for both guest and logged-in users)
  const appState = getAppStateCookie() || {};
  const videoUsage = appState.videoUsage || {
    currentUploadSession: { count: 0, startedAt: new Date().toISOString() },
    monthlyUsage: { count: 0, lastResetDate: new Date().toISOString(), processingHistory: [] },
    totalProcessed: 0
  };
  
  // Using 1 credit per video processed
  const creditsUsed = 1;
  
  // Increment the credits used counter
  videoUsage.monthlyUsage.count += creditsUsed;
  
  // Add to processing history
  videoUsage.monthlyUsage.processingHistory.push({
    videoId,
    processedAt: new Date().toISOString(),
    fileSize,
    duration
  });
  
  // Increment total processed count
  videoUsage.totalProcessed += 1;
  videoUsage.lastProcessedAt = new Date().toISOString();
  
  // Update cookie storage
  updateAppStateCookie({ videoUsage });
  
  // 2. If user is authenticated, also update the database record
  if (userId) {
    try {
      await updateUserUsage(userId, creditsUsed, {
        id: videoId,
        size: fileSize,
        duration: duration
      });
      console.log(`Updated database credit usage for user ${userId}`);
    } catch (error) {
      console.error('Error updating user credit usage in database:', error);
    }
  }
}

/**
 * Get a user's current subscription plan level
 * @param userId User ID to check
 * @returns Subscription plan level (FREE, PREMIUM, PRO, etc.)
 */
async function getUserPlanLevel(userId: string): Promise<string> {
  try {
    // Call the subscription service to get user's plan
    const subscription = await getUserSubscription(userId);
    
    if (!subscription) {
      return 'FREE'; // Default to free for registered users with no subscription
    }
    
    return subscription.planId.toUpperCase();
  } catch (error) {
    console.error('Error getting user plan level:', error);
    return 'FREE'; // Fallback to free tier on errors
  }
}

/**
 * Get usage statistics for a user
 * @param userId Optional user ID for registered users
 * @returns Object with usage statistics
 */
export async function getUserUsageStats(userId?: string, forceRefresh: boolean = false): Promise<{
  planLevel: string;
  uploadSession: {
    used: number;
    limit: number;
    remaining: number;
  };
  monthly: {
    used: number;
    limit: number | "Unlimited";
    remaining: number | "Unlimited";
    resetDate?: string;
  };
  allTime: {
    totalProcessed: number;
    lastProcessedAt?: string;
  };
}> {
  const planLevel = userId ? await getUserPlanLevel(userId) : 'UNREGISTERED';
  const uploadLimit = planLevel in SERVICE_LIMITS.MAX_UPLOAD 
    ? SERVICE_LIMITS.MAX_UPLOAD[planLevel as keyof typeof SERVICE_LIMITS.MAX_UPLOAD] 
    : SERVICE_LIMITS.MAX_UPLOAD.DEFAULT;
  const creditLimit = planLevel in SERVICE_LIMITS.TOTAL_CREDITS 
    ? SERVICE_LIMITS.TOTAL_CREDITS[planLevel as keyof typeof SERVICE_LIMITS.TOTAL_CREDITS] 
    : SERVICE_LIMITS.TOTAL_CREDITS.DEFAULT;
  
  const appState = getAppStateCookie() || {};
  
  // Initialize if not exists
  if (!appState.videoUsage) {
    initializeVideoUsageTracking();
    return {
      planLevel,
      uploadSession: {
        used: 0,
        limit: uploadLimit,
        remaining: uploadLimit
      },
      monthly: {
        used: 0,
        limit: creditLimit === Infinity ? "Unlimited" : creditLimit,
        remaining: creditLimit === Infinity ? "Unlimited" : creditLimit,
        resetDate: new Date(new Date().setDate(1)).toISOString() // First day of next month
      },
      allTime: {
        totalProcessed: 0
      }
    };
  }
  
  const videoUsage = appState.videoUsage;
  const uploadSessionUsed = videoUsage.currentUploadSession.count;
  const creditsUsed = videoUsage.monthlyUsage.count;
  
  // Calculate when the credits will reset (first day of next month)
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const resetDate = nextMonth.toISOString();
  
  return {
    planLevel,
    uploadSession: {
      used: uploadSessionUsed,
      limit: uploadLimit,
      remaining: Math.max(0, uploadLimit - uploadSessionUsed)
    },
    monthly: {
      used: creditsUsed,
      limit: creditLimit === Infinity ? "Unlimited" : creditLimit,
      remaining: creditLimit === Infinity ? "Unlimited" : Math.max(0, creditLimit - creditsUsed),
      resetDate
    },
    allTime: {
      totalProcessed: videoUsage.totalProcessed,
      lastProcessedAt: videoUsage.lastProcessedAt
    }
  };
}
