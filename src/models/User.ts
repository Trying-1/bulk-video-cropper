/**
 * Enhanced User model with better typing and comprehensive data structure
 */

export type SubscriptionTier = 'free' | 'premium' | 'pro';
export type SubscriptionStatus = 'active' | 'cancelled' | 'trialing' | 'past_due';

export interface SubscriptionData {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  startDate: Date;
  nextBillingDate: Date;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  defaultAspectRatio?: string;
  notificationsEnabled?: boolean;
  exportQuality?: 'standard' | 'high' | 'ultra';
  saveOriginals?: boolean;
  preferredVideoFormat?: 'mp4' | 'webm' | 'mov';
  autoApplyLastSettings?: boolean;
}

export interface UserStats {
  totalVideosProcessed: number;
  totalSizeProcessed: number; // in bytes
  lastActivityDate?: Date;
  loginCount: number;
  lastLoginDate: Date;
  averageVideoSize?: number;
  averageProcessingTime?: number;
  completedWorkflowSteps: string[];
}

export interface User {
  uid: string;
  email: string | null;
  username: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  subscription: SubscriptionData;
  preferences: UserPreferences;
  stats: UserStats;
  isOnboarded: boolean;
  quota: {
    used: number;
    total: number;
    resetDate: Date;
  };
  // For caching and optimizing data access
  cachedData?: {
    lastDataRefresh: Date;
    recentVideos?: any[];
  };
}
