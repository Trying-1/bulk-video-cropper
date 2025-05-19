/**
 * Feature flags for controlling app functionality
 * This allows for easy enabling/disabling of features for different environments
 * 
 * SECURITY NOTE: Client-side feature flags should NOT be used for critical security features
 * Server-side validation is still required for all sensitive operations
 */

export const FEATURES = {
  // === Security Sensitive Features (require server validation) ===
  // These are disabled until proper server-side implementation
  ENABLE_PAYMENTS: false, // Payments disabled until secure implementation
  ENABLE_CLOUD_STORAGE: false, // Cloud storage disabled until secure implementation
  
  // === UX and Interface Features ===
  ENABLE_ANALYTICS: true, // Basic usage analytics
  ENABLE_BATCH_PROCESSING: true, // Allow processing multiple videos at once
  
  // === Popup and Guide Features ===
  // These are disabled based on user preference for clean interface
  ENABLE_WORKFLOW_GUIDE: false, // "Welcome to Premium" popup disabled
  ENABLE_QUICKSTART_POPUP: false, // QuickStart popups disabled
  ENABLE_ONBOARDING_TIPS: false, // First-time user tips disabled
  
  // === Navigation Features ===
  ENABLE_USER_FLOW_PAGE: false, // User Flow page hidden from navigation
  
  // === Authentication Features ===
  ENABLE_GOOGLE_AUTH: false, // Google authentication disabled until secure implementation
};

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(featureName: keyof typeof FEATURES): boolean {
  return FEATURES[featureName] === true;
}

/**
 * Returns all feature flags (for compatibility with legacy code)
 */
export function getFeatures() {
  return FEATURES;
}
