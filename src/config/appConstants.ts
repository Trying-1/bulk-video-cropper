/**
 * Centralized application constants
 * This file contains application-wide constants to improve maintainability
 * and provide a single source of truth for various settings
 */

// ===== Cookies and Storage =====
export const COOKIES = {
  EDITOR_SETTINGS: 'bulkvid_editor_settings',
  USER_SESSION: 'bulkvid_user_session',
  APP_STATE: 'bulkvid_app_state',
  // Session expiration
  SESSION_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

// ===== Error Handling =====
export const ERROR_SETTINGS = {
  RATE_LIMIT: 5, // Max identical errors per minute
  MAX_LOG_SIZE: 100 * 1024 * 1024, // 100MB in bytes for error logs
};

// ===== Cache Settings =====
export const CACHE_DURATIONS = {
  USER_PROFILE: 5 * 60 * 1000, // 5 minutes
  SUBSCRIPTION_DATA: 10 * 60 * 1000, // 10 minutes
  VIDEO_LIST: 2 * 60 * 1000, // 2 minutes
};

// ===== Pagination =====
export const PAGINATION = {
  USERS_PER_PAGE: 10,
  VIDEOS_PER_PAGE: 12,
  HISTORY_ITEMS_PER_PAGE: 20,
};

// ===== File Upload Limits =====
export const FILE_LIMITS = {
  MAX_UPLOAD_SIZE: 500 * 1024 * 1024, // 500MB in bytes
  ACCEPTED_VIDEO_FORMATS: ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
  ACCEPTED_IMAGE_FORMATS: ['.jpg', '.jpeg', '.png', '.gif'],
  MAX_FILENAME_LENGTH: 100,
};

// ===== UI Settings =====
export const UI_SETTINGS = {
  TOAST_DURATION: 5000, // milliseconds
  MAX_MOBILE_WIDTH: 768, // pixels
  MAX_TABLET_WIDTH: 1024, // pixels
  ANIMATION_DURATION: 300, // milliseconds
  DEFAULT_THEME: 'light',
};

// ===== Stripe Prices =====
// These should ideally be fetched from your Stripe dashboard or API
// but are included here for reference
export const STRIPE_PRICES = {
  MONTHLY: {
    PRO: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
    BUSINESS: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_MONTHLY || 'price_business_monthly',
  },
  YEARLY: {
    PRO: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly',
    BUSINESS: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_YEARLY || 'price_business_yearly',
  },
};

// ===== API Settings =====
export const API_SETTINGS = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// ===== Localization =====
export const DEFAULT_LOCALE = 'en-US';
export const DEFAULT_TIMEZONE = 'UTC';

// ===== Application Settings =====
export const APP_SETTINGS = {
  DEFAULT_VIDEO_QUALITY: 'high',
  DEFAULT_ASPECT_RATIO: '16:9',
  MAX_CONCURRENT_PROCESSES: 3,
};

// Helper function to get a constant based on environment
export function getEnvAwareConstant<T>(
  developmentValue: T,
  productionValue: T,
  testValue?: T
): T {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'production') {
    return productionValue;
  } else if (env === 'test' && testValue !== undefined) {
    return testValue;
  }
  
  return developmentValue;
}
