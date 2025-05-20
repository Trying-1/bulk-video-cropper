import { AppOptions, cert, getApps, initializeApp } from 'firebase-admin/app';

/**
 * Initializes Firebase Admin if it hasn't been initialized already
 */
export function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    const credentials = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    const options: AppOptions = {
      credential: cert(credentials),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    };

    initializeApp(options);
  }
}
