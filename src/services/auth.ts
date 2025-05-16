'use client';

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult as firebaseGetRedirectResult,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  User
} from 'firebase/auth';
import { auth } from '@/config/firebase';

// Simple user profile type without Firestore dependencies
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

// Sign up with email and password
export const signUp = async (email: string, password: string, displayName?: string): Promise<User> => {
  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile if display name is provided
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    
    return user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Get the currently signed-in user (if any)
export const getCurrentAuthUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};



// Sign in with Google - works for both sign-in and sign-up
export const signInWithGoogle = async (): Promise<User> => {
  try {
    console.log('Starting Google authentication...');
    
    // Create a new Google auth provider with minimal configuration
    const provider = new GoogleAuthProvider();
    
    // Set persistence to LOCAL to keep the user logged in
    await setPersistence(auth, browserLocalPersistence);
    
    // Use signInWithPopup for a simpler flow
    console.log('Attempting Google popup authentication...');
    const userCredential = await signInWithPopup(auth, provider);
    
    console.log('Google authentication successful, user:', userCredential.user.uid);
    
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    
    // Provide user-friendly error messages
    if (error.code === 'auth/popup-closed-by-user' || 
        error.code === 'auth/cancelled-popup-request') {
      throw new Error('The sign-in window was closed. Please try again and complete the Google sign-in process.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('The sign-in popup was blocked by your browser. Please allow popups for this site and try again.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection and try again.');
    } else {
      throw new Error('Authentication failed: ' + (error.message || 'Please try again later.'));
    }
  }
};

// Helper function to get user profile (simplified without Firestore)
function getUserProfileFromUser(user: User): UserProfile {
  return {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    photoURL: user.photoURL || ''
  };
}

// Sign out
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Listen for auth state changes
export const onAuthChange = (callback: (user: User | null) => void): () => void => {
  return onAuthStateChanged(auth, callback);
};

// Get user profile (simplified without Firestore)
export const createUserProfile = (user: User, displayName?: string): UserProfile | null => {
  if (!user) {
    console.error('Cannot create profile for null user');
    return null;
  }
  
  return {
    uid: user.uid,
    email: user.email || '',
    displayName: displayName || user.displayName || '',
    photoURL: user.photoURL || ''
  };
};

// No longer needed - removed Firestore dependency

// Get user profile - simplified without Firestore
export const getUserProfile = (uid: string): Promise<UserProfile | null> => {
  return Promise.resolve(null);
};

// Update video processing count - simplified without Firestore
export const incrementVideosProcessed = (uid: string, count: number = 1): Promise<void> => {
  console.log(`Would increment videos processed for user ${uid} by ${count}`);
  return Promise.resolve();
};

// Process redirect result from Google sign-in - simplified without Firestore
export const processRedirectResult = async (): Promise<User | null> => {
  try {
    console.log('Checking for redirect result...');
    // Get the redirect result
    const result = await firebaseGetRedirectResult(auth);
    
    // If we have a user from the redirect, return it
    if (result && result.user) {
      console.log('Redirect result found, user:', result.user.uid);
      return result.user;
    }
    
    console.log('No redirect result found');
    return null;
  } catch (error) {
    console.error('Error processing redirect result:', error);
    throw error;
  }
};
