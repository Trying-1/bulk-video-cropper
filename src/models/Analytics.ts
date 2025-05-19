/**
 * Analytics models for tracking usage patterns and optimizing database queries
 */

export interface ProcessingHistory {
  id: string;
  userId: string;
  videoId: string;
  timestamp: Date;
  processingTime: number; // in milliseconds
  inputSize: number; // in bytes
  outputSize: number; // in bytes
  processingOptions: {
    cropSettings?: any;
    quality?: string;
    format?: string;
  };
  success: boolean;
  errorMessage?: string;
  // For efficient querying
  indexFields: {
    userIdWithTimestamp: string; // userId_timestamp
    dateOnly: string; // YYYY-MM-DD (for daily stats)
  };
}

export interface UserActivity {
  id: string;
  userId: string;
  action: 'login' | 'upload' | 'process' | 'download' | 'upgrade' | 'settings_change' | 'feature_discovery';
  timestamp: Date;
  details?: any;
  sessionId?: string;
  referrer?: string;
  // For efficient querying
  indexFields: {
    userIdWithAction: string; // userId_action
    actionWithTimestamp: string; // action_timestamp (for global analytics)
  };
}

export interface DailyUsageStats {
  date: string; // YYYY-MM-DD
  totalUploads: number;
  totalProcessed: number;
  totalUsers: number;
  totalNewUsers: number;
  totalStorageUsed: number; // in bytes
  avgProcessingTime: number; // in milliseconds
  conversionRate: number; // % of uploads that were processed
  upgradeRate: number; // % of free users who upgraded
  // User engagement metrics
  returningUsers: number;
  avgSessionDuration: number; // in seconds
  // Payment metrics
  revenue: number;
  subscriptionsStarted: number;
  subscriptionsCancelled: number;
}

export interface UserSessionData {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  browser: string;
  os: string;
  device: string;
  ip?: string;
  country?: string;
  referrer?: string;
  pagesVisited: string[];
  actions: string[];
  isCompleted: boolean;
}
