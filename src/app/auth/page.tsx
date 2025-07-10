'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import { getUserSessionCookie } from '@/utils/cookies';
import { useAuth } from '@/contexts/AuthContext';
import SearchParamsWrapper from '@/components/SearchParamsWrapper';
import { FEATURES } from '@/config/features';

function AuthDisabled() {
  return <div className="p-8 text-center text-gray-500">Authentication is currently disabled.</div>;
}

function AuthPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);
  
  useEffect(() => {
    // Check if we already have a valid session cookie before showing auth screen
    const checkExistingSession = () => {
      // If we have a logged in user, redirect to profile
      if (user) {
        router.push('/profile');
        return;
      }
      
      // If we have a session cookie, redirect to profile
      const sessionCookie = getUserSessionCookie();
      if (sessionCookie) {
        console.log('Found valid session cookie, redirecting to profile');
        router.push('/profile');
        return;
      }
      
      // If authentication is still loading, wait
      if (authLoading) {
        return;
      }
      
      // No session and not loading, show auth form
      setChecking(false);
    };
    
    checkExistingSession();
  }, [user, authLoading, router]);
  
  // Show a blank screen while checking for an existing session
  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-teal-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // Show auth form only if no existing session was found
  return (
    <SearchParamsWrapper>
      <AuthLayout />
    </SearchParamsWrapper>
  );
}

export default FEATURES.ENABLE_AUTH && FEATURES.ENABLE_USER_SYSTEM ? AuthPage : AuthDisabled;
