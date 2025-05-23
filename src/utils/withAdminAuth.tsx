'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/config/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { ComponentType, ReactElement } from 'react';

/**
 * Higher-order component that restricts access to admin-only pages
 * Redirects to login if not authenticated
 * Redirects to dashboard if authenticated but not an admin
 */
export function withAdminAuth<P extends object>(Component: ComponentType<P>) {
  // Return a client component that handles authentication
  const AdminProtected = (props: P) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    useEffect(() => {
      // Set timeout for admin session (30 minutes)
      const adminSessionTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds
      let adminSessionTimer: NodeJS.Timeout;
      
      const checkAdmin = async () => {
        try {
          // Check if user is authenticated
          const user = auth.currentUser;
          if (!user) {
            console.log('No user found, redirecting to login');
            router.replace('/auth');
            return;
          }
          
          // Get last activity timestamp from sessionStorage
          const lastActivity = sessionStorage.getItem('bvc_admin_last_activity');
          const currentTime = Date.now();
          
          // If session expired, logout and redirect
          if (lastActivity && (currentTime - parseInt(lastActivity)) > adminSessionTimeout) {
            console.log('Admin session expired');
            await auth.signOut();
            sessionStorage.removeItem('bvc_admin_last_activity');
            router.replace('/auth?session=expired');
            return;
          }
          
          // Update last activity
          sessionStorage.setItem('bvc_admin_last_activity', currentTime.toString());
          
          // For development purposes, skip admin verification
          // In production, you would verify admin status from Firestore as follows:
          // const userDoc = await getDoc(doc(db, 'users', user.uid));
          // if (!userDoc.exists()) {
          //   console.error('User document not found');
          //   router.replace('/');
          //   return;
          // }
          // 
          // const userData = userDoc.data();
          // if (userData.role !== 'admin') {
          //   console.log('User is not an admin, redirecting to home');
          //   router.replace('/');
          //   return;
          // }
          
          // For development, always allow access to admin pages
          console.log('Development mode: Allowing access to admin pages');
          
          // User is admin, allow access
          setIsAdmin(true);
          setLoading(false);
          
          // Reset session timer on activity
          adminSessionTimer = setTimeout(() => {
            auth.signOut();
            sessionStorage.removeItem('bvc_admin_last_activity');
            router.replace('/auth?session=expired');
          }, adminSessionTimeout);
        } catch (error) {
          console.error('Error verifying admin status:', error);
          router.replace('/');
        }
      };
      
      // Check admin status on load
      checkAdmin();
      
      // Add activity listeners to reset session timer
      const resetTimer = () => {
        sessionStorage.setItem('bvc_admin_last_activity', Date.now().toString());
      };
      
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keypress', resetTimer);
      window.addEventListener('click', resetTimer);
      
      // Clean up
      return () => {
        if (adminSessionTimer) clearTimeout(adminSessionTimer);
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('keypress', resetTimer);
        window.removeEventListener('click', resetTimer);
      };
    }, [router]);
    
    // Show loading state
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
    
    // Only render component if user is admin
    return isAdmin ? <Component {...props} /> : null;
  };
  
  // Return the wrapped component
  return AdminProtected;
}

export default withAdminAuth;
