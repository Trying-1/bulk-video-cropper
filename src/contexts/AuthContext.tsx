'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { onAuthChange, UserProfile } from '@/services/auth';
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
  
  switch (plan) {
    case 'premium':
      price = 9.99;
      break;
    case 'pro':
      price = 29.99;
      break;
    default: // free
      price = 0;
  }
  
  return {
    plan: {
      name: plan,
      price: price
    },
    status: 'active',
    nextBillingDate: userData.nextRenewal || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    usage: {
      videosProcessed: userData.usedQuota || 0,
      videoLimit: plan === 'pro' ? 120 : plan === 'premium' ? 40 : 5,
      storageUsed: 0,
      storageLimit: plan === 'pro' ? 10240 : plan === 'premium' ? 2048 : 500 // Storage limits in MB
    }
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      // First check if we have a session cookie
      const sessionCookie = getUserSessionCookie();
      
      if (sessionCookie) {
        // If we have a session cookie, use it to set initial state
        setUserProfile({
          uid: sessionCookie.uid,
          email: sessionCookie.email,
          displayName: sessionCookie.displayName || '',
          photoURL: sessionCookie.photoURL || ''
        });
        
        // We still need to check with Firebase to confirm the cookie is valid
        const authUser = auth.currentUser;
        if (authUser && authUser.uid === sessionCookie.uid) {
          setUser(authUser);
          // Fetch user data to get subscription information
          try {
            const userData = await getUserData(authUser.uid);
            console.log('User data from Firestore:', userData);
            
            if (userData) {
              // Transform the user data into a subscription object
              const subscriptionData = createSubscriptionFromUserData(userData);
              console.log('Created subscription data:', subscriptionData);
              setSubscription(subscriptionData);
            }
          } catch (error) {
            console.error('Error fetching subscription:', error);
          }
        } else {
          // Cookie is invalid or expired
          clearUserSessionCookie();
          setUser(null);
          setUserProfile(null);
        }
      } else {
        // Check if user is already logged in
        const authUser = auth.currentUser;
        if (authUser) {
          setUser(authUser);
          setUserProfile({
            uid: authUser.uid,
            email: authUser.email || '',
            displayName: authUser.displayName || '',
            photoURL: authUser.photoURL || ''
          });
          
          // Store in cookie for future page loads
          setUserSessionCookie({
            uid: authUser.uid,
            email: authUser.email || '',
            displayName: authUser.displayName || '',
            photoURL: authUser.photoURL || '',
            lastLogin: Date.now()
          });
        } else {
          setUser(null);
          setUserProfile(null);
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setLoading(true);
      if (authUser) {
        setUser(authUser);
        const profileData = {
          uid: authUser.uid,
          email: authUser.email || '',
          displayName: authUser.displayName || '',
          photoURL: authUser.photoURL || ''
        };
        setUserProfile(profileData);
        
        // Update cookie whenever auth state changes
        setUserSessionCookie({
          ...profileData,
          lastLogin: Date.now()
        });
        
        // Fetch user data to update subscription
        getUserData(authUser.uid).then(userData => {
          if (userData) {
            const subscriptionData = createSubscriptionFromUserData(userData);
            setSubscription(subscriptionData);
          }
        }).catch(error => {
          console.error('Error fetching user data on auth change:', error);
        });
        
        // Save current page in app state
        updateAppStateCookie({
          lastVisitedPage: window.location.pathname
        });
      } else {
        setUser(null);
        setUserProfile(null);
        clearUserSessionCookie();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, subscription, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
