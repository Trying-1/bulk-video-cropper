/**
 * Subscription Service API
 * 
 * Handles interactions with the subscription system, including retrieving user
 * subscription information and tracking usage limits.
 */

import { SUBSCRIPTION_PLANS } from "@/config/pricing";

// Define interfaces for subscription data
export interface UserSubscription {
  userId: string;
  planId: string; // free, premium, pro
  status: 'active' | 'canceled' | 'expired' | 'trial';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod?: string;
  lastPayment?: {
    amount: number;
    date: string;
    status: 'success' | 'failed' | 'refunded';
  };
  usageData?: {
    videosProcessed: number;
    creditsUsed: number;
    lastProcessedDate?: string;
    monthlyReset: string; // When the monthly counter was last reset
    processingHistory?: Array<{
      videoId: string;
      processedAt: string;
      fileSize: number;
      duration: number;
      creditsUsed: number;
    }>;
  };
}

// Mock database of user subscriptions - in production this would be a database
const mockSubscriptionsDB: Record<string, UserSubscription> = {};

/**
 * Get a user's subscription information
 * @param userId The user ID to check subscription for
 * @returns The user's subscription details or null if not found
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  // In production, this would query a database or API
  return mockSubscriptionsDB[userId] || null;
}

/**
 * Update a user's subscription information
 * @param subscription The updated subscription data
 */
export async function updateUserSubscription(subscription: UserSubscription): Promise<void> {
  mockSubscriptionsDB[subscription.userId] = subscription;
}

/**
 * Set up a new user with a free subscription
 * @param userId The user ID to create subscription for
 */
export async function setupNewUserSubscription(userId: string): Promise<UserSubscription> {
  const now = new Date();
  // Set expiration to 1 year from now for free plan
  const oneYearFromNow = new Date(now);
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  
  const subscription: UserSubscription = {
    userId,
    planId: 'free',
    status: 'active',
    startDate: now.toISOString(),
    endDate: oneYearFromNow.toISOString(),
    autoRenew: true,
    usageData: {
      videosProcessed: 0,
      creditsUsed: 0,
      monthlyReset: now.toISOString(),
      processingHistory: []
    }
  };
  
  // Save to our mock database
  mockSubscriptionsDB[userId] = subscription;
  
  return subscription;
}

/**
 * Update a user's credit usage data
 * @param userId User ID to update
 * @param creditsUsed Number of credits used
 * @param videoData Optional metadata about the processed video
 */
export async function updateUserUsage(userId: string, creditsUsed: number, videoData?: {id: string, size: number, duration: number}): Promise<void> {
  let subscription = await getUserSubscription(userId);
  
  if (!subscription) {
    // Create a new subscription if one doesn't exist
    subscription = await setupNewUserSubscription(userId);
  }
  
  // Update usage data
  if (!subscription.usageData) {
    subscription.usageData = {
      creditsUsed: 0,
      videosProcessed: 0,  // Keep for backward compatibility
      monthlyReset: new Date().toISOString(),
      processingHistory: []
    };
  }
  
  // Make sure we have the new credits field
  if (subscription.usageData.creditsUsed === undefined) {
    subscription.usageData.creditsUsed = subscription.usageData.videosProcessed || 0;
  }
  
  // Make sure we have the processing history array
  if (!subscription.usageData.processingHistory) {
    subscription.usageData.processingHistory = [];
  }
  
  // Update both fields for compatibility
  subscription.usageData.creditsUsed += creditsUsed;
  subscription.usageData.videosProcessed += creditsUsed;
  subscription.usageData.lastProcessedDate = new Date().toISOString();
  
  // Add video details to history if provided
  if (videoData) {
    subscription.usageData.processingHistory.push({
      videoId: videoData.id,
      processedAt: new Date().toISOString(),
      fileSize: videoData.size,
      duration: videoData.duration,
      creditsUsed: creditsUsed
    });
  }
  
  // Save updates to Firebase
  await updateUserSubscription(subscription);
  
  console.log(`Updated user ${userId} database record with ${creditsUsed} credits used`);
}

/**
 * Check if a user can process videos based on their subscription limit
 * @param userId User ID to check
 * @param count Number of videos to process (default: 1)
 */
export async function canUserProcessVideos(userId: string, count: number = 1): Promise<{
  canProcess: boolean;
  currentUsage: number;
  limit: number | "Unlimited";
  remaining: number | "Unlimited";
}> {
  const subscription = await getUserSubscription(userId);
  
  // No subscription means user is on free plan
  if (!subscription) {
    const freeLimit = SUBSCRIPTION_PLANS.FREE.totalCredits;
    return {
      canProcess: count <= freeLimit,
      currentUsage: 0,
      limit: freeLimit,
      remaining: freeLimit
    };
  }
  
  // Get plan limit from plan ID
  const planKey = subscription.planId.toUpperCase();
  const plan = SUBSCRIPTION_PLANS[planKey];
  
  if (!plan) {
    // Fallback to free plan if plan not found
    const freeLimit = SUBSCRIPTION_PLANS.FREE.totalCredits;
    return {
      canProcess: count <= freeLimit,
      currentUsage: subscription.usageData?.videosProcessed || 0,
      limit: freeLimit,
      remaining: Math.max(0, freeLimit - (subscription.usageData?.videosProcessed || 0))
    };
  }
  
  // Check if plan has unlimited credits
  if (plan.totalCredits === Infinity) {
    return {
      canProcess: true,
      currentUsage: subscription.usageData?.videosProcessed || 0,
      limit: "Unlimited",
      remaining: "Unlimited"
    };
  }
  
  // Calculate remaining credits
  const currentUsage = subscription.usageData?.videosProcessed || 0;
  const remaining = Math.max(0, plan.totalCredits - currentUsage);
  
  return {
    canProcess: count <= remaining,
    currentUsage,
    limit: plan.totalCredits,
    remaining
  };
}

/**
 * Reset a user's monthly usage counter
 * @param userId User ID to reset usage for
 */
export async function resetUserMonthlyUsage(userId: string): Promise<void> {
  const subscription = await getUserSubscription(userId);
  
  if (subscription && subscription.usageData) {
    subscription.usageData.videosProcessed = 0;
    subscription.usageData.creditsUsed = 0; // Reset credits used
    subscription.usageData.monthlyReset = new Date().toISOString();
    
    // Keep processing history but reset for the month
    if (!subscription.usageData.processingHistory) {
      subscription.usageData.processingHistory = [];
    }
    
    await updateUserSubscription(subscription);
  }
}

/**
 * Update a user's subscription plan
 * @param userId User ID to update
 * @param planId New plan ID (free, premium, pro)
 */
export async function updateUserSubscriptionPlan(userId: string, planId: string): Promise<void> {
  let subscription = await getUserSubscription(userId);
  
  if (!subscription) {
    subscription = await setupNewUserSubscription(userId);
  }
  
  subscription.planId = planId;
  
  // Set new end date based on plan (could handle different durations based on plan)
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  subscription.endDate = oneYearFromNow.toISOString();
  
  // Reset usage data with new plan
  if (!subscription.usageData) {
    subscription.usageData = {
      videosProcessed: 0,
      creditsUsed: 0,
      monthlyReset: new Date().toISOString(),
      processingHistory: []
    };
  }
  
  await updateUserSubscription(subscription);
}
