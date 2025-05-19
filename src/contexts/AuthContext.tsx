'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { UserProfile } from '@/services/auth';
import { getUserData } from '@/services/userService';
import { getUserSessionCookie, setUserSessionCookie, clearUserSessionCookie, updateAppStateCookie } from '@/utils/cookies';

interface Subscription {
  plan: {
    name: string;
    price: number;
  };
  status: 'active' | 'cancelled' | 'trialing' | 'past_due';
  nextBillingDate: string;
  usage: {
    videosProcessed: number;
    videoLimit: number;
    storageUsed: number;
    storageLimit: number;
  };
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  subscription: Subscription | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  subscription: null,
  loading: true
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Create a Subscription object from User data
const createSubscriptionFromUserData = (userData: any): Subscription | null => {
  if (!userData) return null;
  
  const plan = userData.subscription?.toLowerCase() || 'free';
  let price = 0;
  let videoLimit = 10;
  let storageLimit = 1024 * 1024 * 100; // 100MB for free plan
  
  if (plan === 'premium') {
    price = 9.99;
    videoLimit = 100;
    storageLimit = 1024 * 1024 * 1024 * 2; // 2GB for premium
  } else if (plan === 'pro') {
    price = 19.99;
    videoLimit = 500;
    storageLimit = 1024 * 1024 * 1024 * 10; // 10GB for pro
  }
  
  return {
    plan: {
      name: plan,
      price: price
    },
    status: userData.subscriptionStatus || 'active',
    nextBillingDate: userData.nextRenewal || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    usage: {
      videosProcessed: userData.videosProcessed || 0,
      videoLimit: videoLimit,
      storageUsed: userData.storageUsed || 0,
      storageLimit: storageLimit
    }
  };
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state and check for session cookies
  useEffect(() => {
    // Check for session cookie first for immediate UI response
    try {
      const sessionCookie = getUserSessionCookie();
      if (sessionCookie && sessionCookie.uid && sessionCookie.email) {
        console.log('Found session cookie, using cached data while Firebase initializes');
        const tempProfile: UserProfile = {
          uid: sessionCookie.uid,
          email: sessionCookie.email,
          displayName: sessionCookie.displayName || sessionCookie.email.split('@')[0],
          photoURL: sessionCookie.photoURL || ''
        };
        setUserProfile(tempProfile);
      }
    } catch (error) {
      console.error('Error reading session cookie:', error);
      clearUserSessionCookie(); // Clear potentially corrupted cookie
    }

    // Set up Firebase auth state listener with retry logic
    let retryCount = 0;
    const maxRetries = 3;
    
    const setupAuthListener = () => {
      try {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
          if (authUser) {
            // User is signed in
            console.log('Firebase auth state: signed in', authUser.uid);
            setUser(authUser);
            
            // Save session to cookie with appropriate security flags
            const sessionData = {
              uid: authUser.uid,
              email: authUser.email || '',
              displayName: authUser.displayName || authUser.email?.split('@')[0] || '',
              photoURL: authUser.photoURL || '',
              lastLogin: Date.now()
            };
            setUserSessionCookie(sessionData);
            
            try {
              // Fetch additional user data with timeout
              const fetchTimeout = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('User data fetch timeout')), 5000)
              );
              const userDataPromise = getUserData(authUser.uid);
              const userData = await Promise.race([userDataPromise, fetchTimeout]);
              
              // Create profile with data validation
              const profile: UserProfile = {
                uid: authUser.uid,
                email: authUser.email || '',
                displayName: authUser.displayName || authUser.email?.split('@')[0] || '',
                photoURL: authUser.photoURL || ''
              };
              
              setUserProfile(profile);
              setSubscription(createSubscriptionFromUserData(userData));
              
              // Update app state
              updateAppStateCookie({
                lastLogin: new Date().toISOString(),
                authStatus: 'authenticated'
              });
            } catch (error) {
              console.error('Error fetching user data:', error);
              // Set basic profile data even if additional data fetch fails
              const fallbackProfile: UserProfile = {
                uid: authUser.uid,
                email: authUser.email || '',
                displayName: authUser.displayName || '',
                photoURL: authUser.photoURL || ''
              };
              setUserProfile(fallbackProfile);
            }
          } else {
            // No Firebase user
            console.log('Firebase auth state: signed out');
            
            // Check for session cookie before clearing user state
            const sessionCookie = getUserSessionCookie();
            if (!sessionCookie) {
              // No cookie and no Firebase user - definitely logged out
              setUser(null);
              setUserProfile(null);
              setSubscription(null);
            } else {
              // We have a cookie but Firebase says logged out
              // This can happen during page refresh or initialization
              console.log('Session cookie exists but Firebase reports logged out');
              // Keep the session data from cookie until Firebase finishes initializing
            }
          }
          
          // Auth state checked
          setLoading(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('Error setting up auth listener:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying auth listener setup (${retryCount}/${maxRetries})...`);
          setTimeout(setupAuthListener, 1000 * retryCount);
        } else {
          console.error('Max retries reached for auth listener');
          setLoading(false);
        }
        return () => {};
      }
    };

    // Start the authentication listener
    const unsubscribe = setupAuthListener();
    
    // Cleanup listener on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, subscription, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
