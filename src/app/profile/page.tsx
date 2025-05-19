'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { User } from '@/types/user';
import { getUserData, getUserStats } from '@/services/userService';
import { clearUserSessionCookie, getUserSessionCookie, setUserSessionCookie, UserSession, getAppStateCookie, updateAppStateCookie } from '@/utils/cookies';

interface LoadingState {
  user: boolean;
  stats: boolean;
}

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${className || ''}`} />
);

export default function Profile() {
  const { user, userProfile, subscription, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [stats, setStats] = useState<{ totalVideosProcessed: number; totalSizeProcessed: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Loading states for different parts of the UI with optimized initial states
  const [loadingState, setLoadingState] = useState<LoadingState>({
    user: false,
    stats: false
  });

  // Handle sign out and clear cookies
  const handleSignOut = async () => {
    try {
      // Clear session cookie first
      clearUserSessionCookie();
      await firebaseSignOut(auth);
      toast.success('Successfully signed out');
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  // Fetch user data function
  const fetchUserData = useCallback(async (userId: string) => {
    setLoadingState(prev => ({ ...prev, user: true }));
    setError(null);
    
    try {
      // Check local storage cache first for performance
      const cachedData = localStorage.getItem(`userData_${userId}`);
      const cacheTimestamp = localStorage.getItem(`userData_${userId}_timestamp`);
      const CACHE_VALIDITY = 5 * 60 * 1000; // 5 minutes
      
      // Use cached data if valid and recent
      if (cachedData && cacheTimestamp && 
          Date.now() - parseInt(cacheTimestamp) < CACHE_VALIDITY) {
        console.log('Using cached user data');
        setUserData(JSON.parse(cachedData));
      } else {
        // Fetch fresh data with timeout protection
        const fetchTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('User data fetch timeout')), 8000)
        );
        const dataPromise = getUserData(userId);
        const data = await Promise.race([dataPromise, fetchTimeout]) as User;
        
        if (data) {
          setUserData(data);
          // Update cache
          localStorage.setItem(`userData_${userId}`, JSON.stringify(data));
          localStorage.setItem(`userData_${userId}_timestamp`, Date.now().toString());
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load your profile data');
      toast.error('Failed to load your profile data. Please try again.');
    } finally {
      setLoadingState(prev => ({ ...prev, user: false }));
    }
  }, []);

  // Fetch user statistics function
  const fetchUserStats = useCallback(async (userId: string) => {
    setLoadingState(prev => ({ ...prev, stats: true }));
    
    try {
      // Check cache for stats
      const cachedStats = localStorage.getItem(`userStats_${userId}`);
      const cacheTimestamp = localStorage.getItem(`userStats_${userId}_timestamp`);
      const CACHE_VALIDITY = 10 * 60 * 1000; // 10 minutes
      
      if (cachedStats && cacheTimestamp && 
          Date.now() - parseInt(cacheTimestamp) < CACHE_VALIDITY) {
        console.log('Using cached user stats');
        setStats(JSON.parse(cachedStats));
      } else {
        const userStats = await getUserStats(userId);
        setStats(userStats);
        // Update cache
        localStorage.setItem(`userStats_${userId}`, JSON.stringify(userStats));
        localStorage.setItem(`userStats_${userId}_timestamp`, Date.now().toString());
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Don't show toast for stats as it's less critical
    } finally {
      setLoadingState(prev => ({ ...prev, stats: false }));
    }
  }, []);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      // Check for session cookie
      const sessionCookie = getUserSessionCookie();
      
      if (!authLoading) {
        if (user || (sessionCookie && sessionCookie.uid)) {
          // If we have either Firebase auth or a valid session cookie, proceed
          const userId = user?.uid || sessionCookie?.uid;
          
          if (userId) {
            // Fetch user data and stats in parallel for performance
            fetchUserData(userId);
            fetchUserStats(userId);
          }
        } else {
          // No user and no valid session cookie, redirect to auth
          console.log('No auth detected, redirecting to login');
          router.push('/auth');
        }
      }
    };
    
    // Run the auth check and data fetching
    checkAuthAndFetch();
  }, [user, authLoading, router, fetchUserData, fetchUserStats]);

  // Format bytes to human-readable format
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };



  // Get days until renewal
  const getDaysUntilRenewal = () => {
    if (!userData?.nextRenewal) return 0;
    
    const now = new Date();
    const renewalDate = new Date(userData.nextRenewal);
    const diffTime = renewalDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  if (!user) {
    return null;
  }

  // Helper function to safely get user display name
  const getDisplayName = () => {
    if (!user) {
      return 'User';
    }
    return user.displayName || user.email?.split('@')[0] || 'User';
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white dark:bg-gray-800 flex flex-col md:flex-row -mt-[1px]">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        {/* Removed redundant header to avoid duplicate branding */}
        
        {/* User Profile Summary - Top Section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Profile</h2>
          {loadingState.user ? (
            <div className="flex flex-col items-center space-y-3">
              <Skeleton className="h-20 w-20 rounded-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-40" />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {user && (
                <div className="relative">
                  {user.photoURL ? (
                    <img
                      className="h-20 w-20 rounded-full object-cover border-2 border-teal-500"
                      src={user.photoURL}
                      alt={getDisplayName()}
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full border-2 border-teal-500 bg-teal-100 dark:bg-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 text-xl font-bold overflow-hidden">
                      {getDisplayName()[0]?.toUpperCase() || (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                  )}
                  {userData?.subscription === 'premium' && (
                    <div className="absolute -top-1 -right-1 bg-teal-500 rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              )}
              <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">
                {userData?.username || getDisplayName()}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'loading@email.com'}</p>
              <div className="mt-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">
                {userData?.subscription === 'free' ? 'Free Plan' : 
                 userData?.subscription === 'premium' ? 'Premium Plan' : 
                 userData?.subscription === 'pro' ? 'Pro Plan' : 'Loading...'}
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar Navigation */}
        <nav className="p-4">
          <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Main</p>
          <div className="mt-3 space-y-1">
            <Link
              href="/profile"
              className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="text-teal-500 dark:text-teal-400 mr-3 flex-shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Link>

            <Link
              href="/editor"
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 mr-3 flex-shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Video Editor
            </Link>
          </div>
          
          <p className="mt-8 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Account</p>
          <div className="mt-3 space-y-1">
            <button
              onClick={() => {
                firebaseSignOut(auth)
                  .then(() => {
                    // Clear user session cookie
                    clearUserSessionCookie();
                    toast.success('Signed out successfully!');
                    router.push('/');
                  })
                  .catch((error) => {
                    toast.error('Failed to sign out');
                  });
              }}
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 mr-3 flex-shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Your Profile</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your account and view your activity</p>
          </div>

          {/* Main profile content */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subscription Info */}
            {loadingState.stats ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <Skeleton className="h-6 w-48 mb-4 rounded-lg" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full rounded-md mt-4" />
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Subscription
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Current Plan</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${userData?.subscription === 'free' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : userData?.subscription === 'premium' ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'}`}>
                        {userData?.subscription === 'free' ? 'Free' : userData?.subscription === 'premium' ? 'Premium' : 'Pro'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Renews in</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {userData?.nextRenewal ? getDaysUntilRenewal() : 'N/A'} days
                      </span>
                    </div>
                    {userData?.subscription === 'free' && (
                      <Link
                        href="/#pricing"
                        className="mt-4 block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      >
                        Upgrade Plan
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            {loadingState.stats ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <Skeleton className="h-6 w-48 mb-4 rounded-lg" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg">
                      <Skeleton className="h-8 w-24 mb-2 rounded-lg" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="p-4 rounded-lg">
                      <Skeleton className="h-8 w-24 mb-2 rounded-lg" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="mt-6">
                    <Skeleton className="h-6 w-32 mb-2 rounded-lg" />
                    <div className="grid grid-cols-2 gap-3">
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Your Stats
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stats?.totalVideosProcessed || 0}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Videos Processed
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stats ? formatBytes(stats.totalSizeProcessed) : '0 Bytes'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Total Size
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
}
