/**
 * Feature flags for controlling app functionality
 * This allows for easy enabling/disabling of features for different environments
 */

export const FEATURES = {
  // Set to false to disable payments for MVP
  ENABLE_PAYMENTS: false,
  
  // Other feature flags
  ENABLE_ANALYTICS: true,
  ENABLE_WORKFLOW_GUIDE: true,
  ENABLE_BATCH_PROCESSING: true,
  ENABLE_CLOUD_STORAGE: false, // For future implementation
};

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(featureName: keyof typeof FEATURES): boolean {
  return FEATURES[featureName] === true;
}
