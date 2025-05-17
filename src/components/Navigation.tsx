'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const pathname = usePathname();
  const { user, subscription } = useAuth();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
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
                href="/history"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  isActive('/history')
                    ? 'border-teal-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white'
                }`}
              >
                History
              </Link>
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
              <Link
                href="/subscription"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  isActive('/subscription')
                    ? 'border-teal-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white'
                }`}
              >
                Subscription
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
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
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
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
  );
}
