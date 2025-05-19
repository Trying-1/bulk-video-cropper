'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminNav from './AdminNav';

interface AccessDeniedProps {}

const AccessDenied: React.FC<AccessDeniedProps> = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <svg 
            className="w-16 h-16 text-red-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">You don't have permission to access the admin dashboard.</p>
        <Link 
          href="/" 
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    // Check if user is admin - this would typically check a custom claim or admin role
    if (user) {
      // For demo purposes, you might hardcode some admin emails or use Firestore
      const adminEmails = ['admin@bulkvidcropper.com', 'test@example.com'];
      setIsAdmin(adminEmails.includes(user.email || ''));
    }
  }, [user]);

  if (!loading && (!user || !isAdmin)) {
    return <AccessDenied />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white dark:bg-gray-800 shadow-lg">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-teal-600 dark:bg-teal-700">
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <AdminNav />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.email || 'Admin User'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar button */}
      <div className="fixed top-0 right-0 p-1 md:hidden z-50">
        <button className="bg-teal-600 rounded-md p-2 text-white">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile sidebar */}
      <div className="md:hidden fixed inset-0 flex z-40 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300">
        <div className="fixed inset-0 flex">
          <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white dark:bg-gray-800">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-teal-600 dark:bg-teal-700">
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <AdminNav />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-auto">
        <main className="flex-1 relative focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
