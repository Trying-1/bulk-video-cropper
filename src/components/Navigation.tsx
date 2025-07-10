'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useComingSoon } from '@/components/ComingSoonModal';
import { isFeatureEnabled } from '@/config/features';
import { APP_IDENTITY, LOGO } from '@/config/branding';

// Optimized with React.memo for better performance
function Navigation() {
  const pathname = usePathname();
  const { user, subscription } = useAuth();
  const { showComingSoon, ComingSoonModal } = useComingSoon();
  
  // Feature flags
  const paymentsEnabled = isFeatureEnabled('ENABLE_PAYMENTS');
  const userFlowEnabled = isFeatureEnabled('ENABLE_USER_FLOW_PAGE');
  const showProfile = isFeatureEnabled('ENABLE_USER_SYSTEM') && isFeatureEnabled('ENABLE_PROFILE');

  // Memoize the active path checking function to avoid unnecessary calculations
  const isActive = useMemo(() => {
    return (path: string) => pathname === path;
  }, [pathname]);
  
  // Check if we're on the landing page
  const isLandingPage = pathname === '/';

  // Handle errors gracefully if auth context isn't available
  if (!user && subscription) {
    console.error('Navigation received inconsistent auth state');
  }

  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <>
      {/* Coming Soon Modal Component - Only show when explicitly triggered */}
      <ComingSoonModal />
      
      <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                {APP_IDENTITY.name}
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {/* Landing page section links - only shown on homepage */}
              {isLandingPage && (
                <>
                  <a
                    href="#features"
                    className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    How It Works
                  </a>

                  <a
                    href="#testimonials"
                    className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Testimonials
                  </a>
                </>
              )}
              
              {/* App navigation links */}
              {showProfile && (
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
              )}
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

              {userFlowEnabled && (
                <Link
                  href="/user-flow"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                    isActive('/user-flow')
                      ? 'border-teal-500 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white'
                  }`}
                >
                  User Flow
                </Link>
              )}
              {/* Subscription page removed temporarily */}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">


                  {showProfile && user && (
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
                  )}
                </div>
              </div>
            ) : (
              <div className="ml-3 relative flex items-center">
                {!user && isFeatureEnabled('ENABLE_USER_SYSTEM') && isFeatureEnabled('ENABLE_AUTH') && (
                <Link
                  href="/auth"
                  className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 whitespace-nowrap flex-shrink-0 inline-flex items-center justify-center"
                >
                  Sign In
                </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-800 pb-3 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-1 pt-2 px-4">
            {/* Landing page section links - only shown on homepage for mobile */}
            {isLandingPage && (
              <>
                <a
                  href="#features"
                  className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How It Works
                </a>

                <a
                  href="#testimonials"
                  className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Testimonials
                </a>
              </>
            )}
            
            {/* App navigation links */}
            {showProfile && (
            <Link
              href="/profile"
              className={`block py-2 px-3 rounded-md ${isActive('/profile') ? 'bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            )}
            <Link
              href="/editor"
              className={`block py-2 px-3 rounded-md ${isActive('/editor') ? 'bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Editor
            </Link>
            {userFlowEnabled && (
              <Link
                href="/user-flow"
                className={`block py-2 px-3 rounded-md ${isActive('/user-flow') ? 'bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                User Flow
              </Link>
            )}
            {!user && isFeatureEnabled('ENABLE_USER_SYSTEM') && isFeatureEnabled('ENABLE_AUTH') && (
              <Link
                href="/auth"
                className="block py-2 px-3 rounded-md bg-teal-500 text-white hover:bg-teal-600 mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
    </>
  );
}

// Export with React.memo for performance optimization to prevent unnecessary re-renders
export default React.memo(Navigation);
