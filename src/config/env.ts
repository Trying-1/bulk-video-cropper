const env = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  MAX_VIDEO_COUNT: parseInt(process.env.NEXT_PUBLIC_MAX_VIDEO_COUNT || '100'),
} as const;

export default env;

// Type definitions
export type Env = typeof env;
export type EnvKey = keyof Env;

export const MAX_VIDEO_COUNT = env.MAX_VIDEO_COUNT;

// Helper function to get env values with type safety
export const getEnv = (key: EnvKey) => {
  const value = env[key];
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};
