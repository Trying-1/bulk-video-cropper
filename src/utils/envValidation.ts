/**
 * Environment variable validation utilities
 * Ensures the application has all required configuration values before starting
 */

import { isFeatureEnabled } from '@/config/features';

interface ValidationResult {
  valid: boolean;
  missing: string[];
}

/**
 * Required environment variables for core functionality
 * These must be present for the application to operate correctly
 */
const CORE_REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'
];

/**
 * Validates that all required environment variables are present
 * @returns Validation result with status and list of missing variables
 */
export function validateEnvironment(): ValidationResult {
  const missingVars: string[] = [];
  
  // Check core environment variables
  for (const envVar of CORE_REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }
  
  return {
    valid: missingVars.length === 0,
    missing: missingVars
  };
}

/**
 * Safely gets an environment variable with a fallback
 * Logs a warning if the environment variable is missing
 * 
 * @param key The environment variable name
 * @param fallback Optional fallback value
 * @param required Whether the variable is required
 * @returns The environment variable value or fallback
 */
export function getEnvVar(
  key: string, 
  fallback: string = '', 
  required: boolean = false
): string {
  const value = process.env[key];
  
  if (!value) {
    if (required) {
      // If running in a browser, don't throw to avoid breaking the app
      if (typeof window !== 'undefined') {
        console.error(`Missing required environment variable: ${key}`);
        return fallback;
      }
      throw new Error(`Missing required environment variable: ${key}`);
    } else {
      console.warn(`Missing optional environment variable: ${key}, using fallback`);
    }
    return fallback;
  }
  
  return value;
}

/**
 * Validates environment on startup if server-side
 * This function is called during Next.js server initialization
 * to prevent the application from starting with missing configuration
 */
export function validateEnvironmentOnStartup(): void {
  // Only run on server side
  if (typeof window === 'undefined') {
    const { valid, missing } = validateEnvironment();
    
    if (!valid) {
      throw new Error(
        `Application cannot start due to missing environment variables: ${missing.join(', ')}\n` +
        `Please configure these variables in your .env file or deployment environment.`
      );
    }
  }
}
