/**
 * Centralized API endpoints configuration
 * This file contains all API endpoints used throughout the application
 * for improved maintainability and ease of updates
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    SIGN_UP: `${API_BASE_URL}/auth`,
    SIGN_IN: `${API_BASE_URL}/auth`,
    SIGN_OUT: `${API_BASE_URL}/auth/signout`,
    GOOGLE_AUTH: `${API_BASE_URL}/auth/google`,
    PASSWORD_RESET: `${API_BASE_URL}/auth/password-reset`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
    USER_PROFILE: `${API_BASE_URL}/auth/profile`,
  },

  // Payment and subscription endpoints
  PAYMENT: {
    CREATE_SESSION: `${API_BASE_URL}/payment/create-session`,
    CONFIRM_PAYMENT: `${API_BASE_URL}/payment/confirm`,
    CREATE_SETUP_INTENT: `${API_BASE_URL}/payment/setup-intent`,
    SUBSCRIPTIONS: `${API_BASE_URL}/subscriptions`,
    BILLING_PORTAL: `${API_BASE_URL}/payment/billing-portal`,
    WEBHOOK: `${API_BASE_URL}/payment/webhook`,
  },

  // Video processing endpoints
  VIDEO: {
    UPLOAD: `${API_BASE_URL}/video/upload`,
    PROCESS: `${API_BASE_URL}/video/process`,
    STATUS: `${API_BASE_URL}/video/status`,
    DOWNLOAD: `${API_BASE_URL}/video/download`,
    LIST: `${API_BASE_URL}/video/list`,
    DELETE: `${API_BASE_URL}/video/delete`,
  },

  // User data endpoints
  USER_DATA: {
    USAGE_STATS: `${API_BASE_URL}/user/usage`,
    PREFERENCES: `${API_BASE_URL}/user/preferences`,
    HISTORY: `${API_BASE_URL}/user/history`,
  },
};

/**
 * Helper function to construct API URLs with query parameters
 */
export function buildApiUrl(
  endpoint: string,
  queryParams?: Record<string, string | number | boolean | undefined>
): string {
  if (!queryParams) {
    return endpoint;
  }

  const url = new URL(endpoint, window.location.origin);
  
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  return url.toString();
}

/**
 * Get the base URL for API calls
 * This is useful for situations where you need the base URL
 * without a specific endpoint
 */
export function getApiBaseUrl(): string {
  return API_BASE_URL;
}
