'use client';

import { useEffect, useState } from 'react';  
import { useRouter } from 'next/navigation';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

import { ComponentType, ReactElement } from 'react';

/**
 * Higher-order component that restricts access to authenticated users only
 * Redirects to login if not authenticated
 */
export function withUserAuth<P extends object>(
  Component: ComponentType<P>,
  requireAuth: boolean = true,
  requireSubscription: 'any' | 'premium' | 'pro' = 'any'
) {
  const ProtectedRoute = (props: P) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [subscription, setSubscription] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    useEffect(() => {
      // Set timeout for user session (2 hours)
      const userSessionTimeout = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
      let userSessionTimer: NodeJS.Timeout;
      
      const checkAuth = () => {
        // Get last activity timestamp from sessionStorage
        const lastActivity = sessionStorage.getItem('bvc_user_last_activity');
        const currentTime = Date.now();
        
        // If session expired, logout and redirect
        if (lastActivity && (currentTime - parseInt(lastActivity)) > userSessionTimeout) {
          console.log('User session expired');
          auth.signOut();
          sessionStorage.removeItem('bvc_user_last_activity');
          router.replace('/auth/login?session=expired');
          return;
        }
        
        // Update last activity
        sessionStorage.setItem('bvc_user_last_activity', currentTime.toString());
        
        const unsubscribe = onAuthStateChanged(auth, async (currentUser: FirebaseUser | null) => {
          if (!currentUser) {
            console.log('No user found, redirecting to login');
            router.replace('/auth/login');
            return;
          }
          
          // User is authenticated, get subscription info from localStorage or user object
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          const userData = userDoc.data();
          const userSubscription = userData?.subscription || 'free';
          setSubscription(userSubscription);
          
          // Check if the user has the required subscription level
          if (requireSubscription !== 'any') {
            if (requireSubscription === 'premium' && userSubscription !== 'premium' && userSubscription !== 'pro') {
              router.replace('/subscription/upgrade?required=premium');
              return;
            }
            
            if (requireSubscription === 'pro' && userSubscription !== 'pro') {
              router.replace('/subscription/upgrade?required=pro');
              return;
            }
          }
          
          setUser(currentUser);
          setLoading(false);
          
          // Reset session timer on activity
          userSessionTimer = setTimeout(() => {
            auth.signOut();
            sessionStorage.removeItem('bvc_user_last_activity');
            router.replace('/auth/login?session=expired');
          }, userSessionTimeout);
        });
        
        return unsubscribe;
      };
      
      const unsubscribe = checkAuth();
      
      // Add activity listeners to reset session timer
      const resetTimer = () => {
        sessionStorage.setItem('bvc_user_last_activity', Date.now().toString());
      };
      
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keypress', resetTimer);
      window.addEventListener('click', resetTimer);
      
      // Clean up
      return () => {
        if (unsubscribe) unsubscribe();
        if (userSessionTimer) clearTimeout(userSessionTimer);
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('keypress', resetTimer);
        window.removeEventListener('click', resetTimer);
      };
    }, [router, requireSubscription]);
    
    // Show loading component
    if (loading) {
      return (
        <div className="p-6 space-y-4">
          <Skeleton className="h-12 w-64 bg-gray-300" />
          <Skeleton className="h-4 w-full bg-gray-300" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <Skeleton className="h-40 w-full bg-gray-300" />
            <Skeleton className="h-40 w-full bg-gray-300" />
            <Skeleton className="h-40 w-full bg-gray-300" />
          </div>
        </div>
      );
    }
    
    // Only pass the original props to maintain type safety
    return <Component {...props} />;
  };
  
  // Return the wrapped component
  return ProtectedRoute;
}

export default withUserAuth;
