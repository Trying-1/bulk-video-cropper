/**
 * System Metrics Model
 * Tracks performance and usage metrics for the admin dashboard
 */
export interface SystemMetrics {
  id: string;
  timestamp: Date | string;
  // User metrics
  totalUsers: number;
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  newUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  // Subscription metrics
  subscriptionCounts: {
    free: number;
    pro: number;
    premium: number;
  };
  conversionRate: number; // Percentage of free users converting to paid
  averageRevenue: number;
  // Processing metrics
  totalVideosProcessed: number;
  totalProcessingTime: number; // in seconds
  averageProcessingTime: number; // in seconds
  processingErrors: number;
  // System health
  serverLoad: number; // Percentage
  memoryUsage: number; // Percentage
  diskUsage: number; // Percentage
  apiResponseTime: number; // in ms
}

/**
 * Daily User Activity
 * Tracks user activity on a daily basis
 */
export interface DailyUserActivity {
  id: string; // Usually the date string YYYY-MM-DD
  date: Date | string;
  uniqueVisitors: number;
  pageViews: number;
  signups: number;
  logins: number;
  videoUploads: number;
  videosProcessed: number;
  subscriptionsPurchased: {
    pro: number;
    premium: number;
  };
  processingTimeAverage: number; // in seconds
}

/**
 * Sample daily activity data for initial dashboard
 */
export const sampleDailyActivity: Omit<DailyUserActivity, 'id'>[] = [
  {
    date: new Date('2025-05-17T00:00:00.000Z'),
    uniqueVisitors: 245,
    pageViews: 876,
    signups: 23,
    logins: 87,
    videoUploads: 142,
    videosProcessed: 156,
    subscriptionsPurchased: {
      pro: 4,
      premium: 2
    },
    processingTimeAverage: 12.3
  },
  {
    date: new Date('2025-05-16T00:00:00.000Z'),
    uniqueVisitors: 232,
    pageViews: 801,
    signups: 18,
    logins: 73,
    videoUploads: 128,
    videosProcessed: 145,
    subscriptionsPurchased: {
      pro: 3,
      premium: 1
    },
    processingTimeAverage: 13.2
  }
];
