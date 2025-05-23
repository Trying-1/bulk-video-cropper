import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, sendEmailVerification, applyActionCode } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { User } from '../types/user';
import { getAuthErrorMessage } from '../utils/authErrorHandler';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export const createUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      createdAt: new Date(),
      subscription: 'free',
      usedQuota: 0,
      emailVerified: false,
      nextRenewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    });

    // Send email verification
    await sendEmailVerification(user);

    return user;
  } catch (error) {
    throw error;
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signOutUser = async () => {
  await signOut(auth);
};

// Google authentication
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    // Configure Google provider with required scopes
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    // Add error logging
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Google sign-in successful:', result);
    const user = result.user;
    
    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      // Create new user document
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
        subscription: 'free',
        usedQuota: 0,
        nextRenewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        displayName: user.displayName,
        photoURL: user.photoURL
      });
      console.log('New user created in Firestore:', user.uid);
    } else {
      console.log('Existing user logged in:', user.uid);
    }
    
    return user;
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    throw new Error(error.message || 'Failed to sign in with Google');
  }
};

export const getUser = async (uid: string) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.data() as User;
};

export const updateSubscriptionRenewal = async (uid: string) => {
  await updateDoc(doc(db, 'users', uid), {
    nextRenewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  });
};

export const updateUsedQuota = async (uid: string, increment: number) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  const userData = userDoc.data() as User;
  
  await updateDoc(doc(db, 'users', uid), {
    usedQuota: userData.usedQuota + increment
  });
};

export const resetUsedQuota = async (uid: string) => {
  await updateDoc(doc(db, 'users', uid), {
    usedQuota: 0
  });
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userData = await getUser(user.uid);
      callback(userData);
    } else {
      callback(null);
    }
  });
};

// Password reset function
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: 'Password reset email sent successfully' };
  } catch (error: any) {
    console.error('Password reset error:', error);
    return { 
      success: false, 
      message: getAuthErrorMessage(error)
    };
  }
};

// Email verification functions
export const sendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { 
        success: false, 
        message: 'Please sign in first before requesting a verification email.'
      };
    }

    await sendEmailVerification(user);
    return { success: true, message: 'Verification email sent successfully' };
  } catch (error: any) {
    console.error('Email verification error:', error);
    return { 
      success: false, 
      message: getAuthErrorMessage(error)
    };
  }
};

export const checkEmailVerified = async (uid: string) => {
  try {
    // First check Firebase Auth emailVerified property
    const user = auth.currentUser;
    if (user && user.emailVerified) {
      // Update Firestore if needed
      const userDoc = await getDoc(doc(db, 'users', uid));
      const userData = userDoc.data() as User;
      
      if (!userData.emailVerified) {
        await updateDoc(doc(db, 'users', uid), {
          emailVerified: true
        });
      }
      
      return { verified: true };
    }

    // If not verified in Auth, check if we need to reload the user to get latest status
    if (user) {
      await user.reload();
      if (user.emailVerified) {
        // Update Firestore
        await updateDoc(doc(db, 'users', uid), {
          emailVerified: true
        });
        return { verified: true };
      }
    }

    return { verified: false };
  } catch (error: any) {
    console.error('Check email verification error:', error);
    return { verified: false, error: error.message };
  }
};

export const verifyEmail = async (actionCode: string) => {
  try {
    await applyActionCode(auth, actionCode);
    
    // Update user's verification status in Firestore if they're logged in
    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), {
        emailVerified: true
      });
    }
    
    return { success: true, message: 'Email verified successfully' };
  } catch (error: any) {
    console.error('Email verification error:', error);
    return { 
      success: false, 
      message: getAuthErrorMessage(error)
    };
  }
};
