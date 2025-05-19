import { getEnvVar, validateEnvironmentOnStartup } from '@/utils/envValidation';

// Run environment validation at startup on server side
validateEnvironmentOnStartup();

/**
 * Centralized environment variable configuration with enhanced security
 * Uses the environment validation utility for safer access
 */
const env = {
  // Firebase configuration - critical for application functionality
  NEXT_PUBLIC_FIREBASE_API_KEY: getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY', '', true),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', '', true),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID', '', true),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: getEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', '', true),
  
  // Application settings with safe defaults
  MAX_VIDEO_COUNT: parseInt(getEnvVar('NEXT_PUBLIC_MAX_VIDEO_COUNT', '100')),
  
  // Environment mode
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  IS_PRODUCTION: getEnvVar('NODE_ENV', 'development') === 'production',
} as const;

export default env;

// Type definitions for better type safety
export type Env = typeof env;
export type EnvKey = keyof Env;

// Commonly used values exported for convenience
export const MAX_VIDEO_COUNT = env.MAX_VIDEO_COUNT;
export const IS_PRODUCTION = env.IS_PRODUCTION;

/**
 * Enhanced helper function to get env values with improved type safety and error handling
 * This function will throw an error if a required environment variable is missing
 */
export const getEnv = (key: EnvKey) => {
  const value = env[key];
  
  // Additional validation for critical environment variables
  if (value === undefined || (typeof value === 'string' && value.trim() === '')) {
    if (typeof window !== 'undefined') {
      // In browser context, log error but avoid breaking the app
      console.error(`Missing required environment variable: ${key}`);
      return '' as any; // Return empty string to avoid runtime errors
    }
    // In server context, throw error to prevent running with missing configuration
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value;
};
