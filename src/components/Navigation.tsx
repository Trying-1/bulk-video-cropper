'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useComingSoon } from './ComingSoonModal';
import { isFeatureEnabled } from '@/config/features';

// Optimized with React.memo for better performance
function Navigation() {
  const pathname = usePathname();
  const { user, subscription } = useAuth();
  const { showComingSoon, ComingSoonModal } = useComingSoon();
  
  // Payments will be implemented later
  const paymentsEnabled = isFeatureEnabled('ENABLE_PAYMENTS');

  // Memoize the active path checking function to avoid unnecessary calculations
  const isActive = useMemo(() => {
    return (path: string) => pathname === path;
  }, [pathname]);

  // Handle errors gracefully if auth context isn't available
  if (!user && subscription) {
    console.error('Navigation received inconsistent auth state');
  }

  return (
    <>
      {/* Coming Soon Modal Component - Only show when explicitly triggered */}
      <ComingSoonModal />
      
      <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                Bulk Video Cropper
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/profile"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  isActive('/profile')
                    ? 'border-teal-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white'
                }`}
              >
                Profile
              </Link>
              <Link
                href="/editor"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  isActive('/editor')
                    ? 'border-teal-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white'
                }`}
              >
                Editor
              </Link>
              <Link
                href="/plans"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  isActive('/plans')
                    ? 'border-teal-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white'
                }`}
              >
                Plans
              </Link>
              {/* Subscription page removed temporarily */}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  {/* Upgrade button with Coming Soon modal */}
                  {!paymentsEnabled && subscription?.tier === 'free' && (
                    <button
                      onClick={() => showComingSoon({
                        featureName: 'Premium Features',
                        description: 'Premium features are coming soon! We\'re hard at work making this application even better.'
                      })}
                      className="bg-gradient-to-r from-purple-600 to-blue-500 text-white text-xs px-3 py-1 rounded-full hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
                    >
                      Upgrade
                    </button>
                  )}
                  
                  {subscription && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      subscription.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : subscription.status === 'cancelled'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {subscription.status}
                    </span>
                  )}
                  <Link
                    href="/profile"
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white flex items-center gap-1"
                    aria-label="User Profile"
                    prefetch={true}
                    onClick={(e) => {
                      // Prevent default and navigate programmatically to ensure client-side navigation
                      e.preventDefault();
                      window.location.href = '/profile';
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="sr-only">Profile</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="ml-3 relative">
                <Link
                  href="/auth"
                  className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
    </>
  );
}

// Export with React.memo for performance optimization to prevent unnecessary re-renders
export default React.memo(Navigation);
