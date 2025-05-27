'use client';

// Firebase configuration
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, logEvent, isSupported, Analytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// Using direct values to avoid environment variable issues
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ''
};

// Initialize Firebase
let app: FirebaseApp | undefined;

// Initialize Firebase app first
if (!app) {
  app = initializeApp(firebaseConfig);
}

// Export auth initialization function
export const initializeFirebase = async () => {
  try {
    const authInstance = getAuth(app);
    await setPersistence(authInstance, browserLocalPersistence);
    return authInstance;
  } catch (error) {
    console.error('Error initializing Firebase auth:', error);
    throw error;
  }
};

// Export initialized services
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

// Initialize analytics conditionally (only in browser)
let analytics: Analytics | null = null;

// Safely initialize analytics
export const initAnalytics = async () => {
  try {
    // Check if analytics is supported in current environment
    if (typeof window !== 'undefined' && await isSupported()) {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized');
      return analytics;
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Analytics:', error);
  }
  return null;
};

// Get analytics instance (initializes if needed)
export const getAnalyticsInstance = async () => {
  if (!analytics) {
    return await initAnalytics();
  }
  return analytics;
};

// Track page views
export const trackPageView = async (pagePath: string, pageTitle?: string) => {
  const analyticsInstance = await getAnalyticsInstance();
  if (analyticsInstance) {
    logEvent(analyticsInstance, 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || pagePath,
      page_location: typeof window !== 'undefined' ? window.location.href : ''
    });
  }
};

// Track custom events
export const trackEvent = async (eventName: string, eventParams?: Record<string, any>) => {
  const analyticsInstance = await getAnalyticsInstance();
  if (analyticsInstance) {
    logEvent(analyticsInstance, eventName, eventParams);
  }
};

export { app };
