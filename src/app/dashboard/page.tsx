'use client';

import React, { useState, useEffect } from 'react';
import { getVideoLimitBySubscription } from '@/utils/subscriptionLimits';
import { useRouter } from 'next/navigation';
import { auth } from '@/config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { User } from '@/types/user';
import { getUserData, getUserRecentVideos, getUserStats } from '@/services/userService';

interface VideoData {
  id: string;
  title: string;
  thumbnailUrl?: string;
  createdAt: string;
  fileSize: number;
  duration: number;
  status: 'processing' | 'completed' | 'failed';
}

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  const [recentVideos, setRecentVideos] = useState<VideoData[]>([]);
  const [stats, setStats] = useState<{ totalVideosProcessed: number; totalSizeProcessed: number }>({ 
    totalVideosProcessed: 0, 
    totalSizeProcessed: 0 
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    } else {
      const fetchUserData = async () => {
        try {
          // Fetch user data
          const data = await getUserData(user.uid);
          if (data) {
            setUserData(data);
          } else {
            toast.error('Failed to load user data');
          }

          // Fetch recent videos
          const videos = await getUserRecentVideos(user.uid);
          setRecentVideos(videos as VideoData[]);

          // Fetch user stats
          const userStats = await getUserStats(user.uid);
          setStats(userStats);

          setLoading(false);
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Something went wrong while loading your data');
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [user, router]);

  // Format bytes to human-readable format
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Format seconds to minutes and seconds
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate days until quota renewal
  const getDaysUntilRenewal = () => {
    if (!userData?.nextRenewal) return 0;
    
    const now = new Date();
    const renewalDate = new Date(userData.nextRenewal);
    const diffTime = renewalDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with user info and sign out */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-16 w-16 rounded-full object-cover border-2 border-teal-500"
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=0D9488&color=fff`}
                    alt={user.displayName || 'User'}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Welcome, {user.displayName || user.email?.split('@')[0] || 'User'}!
                  </h1>
                  <p className="text-gray-500 dark:text-gray-300">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  href="/editor"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Videos
                </Link>
                <button
                  onClick={() => {
                    signOut(auth)
                      .then(() => {
                        toast.success('Signed out successfully!');
                      })
                      .catch((error) => {
                        toast.error('Failed to sign out');
                      });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-1 1V16H4V4h12.586l-1-1H3zm9.707.293a1 1 0 00-1.414 0L8 6.586 6.707 5.293a1 1 0 00-1.414 1.414L6.586 8 5.293 9.293a1 1 0 001.414 1.414L8 9.414l1.293 1.293a1 1 0 001.414-1.414L9.414 8l1.293-1.293a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main dashboard content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Subscription Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Subscription
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Current Plan</span>
                  <span className={`font-semibold px-3 py-1 rounded-full text-sm ${userData?.subscription === 'free' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : userData?.subscription === 'premium' ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'}`}>
                    {userData?.subscription === 'free' ? 'Free' : userData?.subscription === 'premium' ? 'Premium' : 'Pro'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Videos Processed</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {userData?.usedQuota || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-600 dark:text-gray-300">Plan Limit</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {userData ? getVideoLimitBySubscription({ subscription: userData.subscription }) : 0} videos
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Renews in</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {getDaysUntilRenewal()} days
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

          {/* Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Your Stats
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalVideosProcessed}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Videos Processed
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatBytes(stats.totalSizeProcessed)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total Size
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/editor"
                    className="flex items-center justify-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Edit Video</span>
                  </Link>
                  <Link
                    href="/history"
                    className="flex items-center justify-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">History</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h2>
              {recentVideos.length > 0 ? (
                <div className="space-y-4">
                  {recentVideos.map((video) => (
                    <div key={video.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-shrink-0 h-12 w-16 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden">
                        {video.thumbnailUrl ? (
                          <img 
                            src={video.thumbnailUrl} 
                            alt={video.title} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {video.title || 'Untitled Video'}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                          <span className="mx-1">•</span>
                          <span>{formatDuration(video.duration || 0)}</span>
                          <span className="mx-1">•</span>
                          <span>{formatBytes(video.fileSize || 0)}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${video.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : video.status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                          {video.status === 'completed' ? 'Completed' : video.status === 'processing' ? 'Processing' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    No videos processed yet
                  </p>
                  <Link
                    href="/editor"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Process Your First Video
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
