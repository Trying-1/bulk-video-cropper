'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserFlowPage() {
  const router = useRouter();
  const [activeZoom, setActiveZoom] = useState<string | null>(null);

  // Allow keyboard navigation through the diagram
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeZoom) {
        setActiveZoom(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeZoom]);

  const flowSections = [
    {
      id: 'landing',
      title: 'Landing Page',
      description: 'Users discover the app, learn about features, and sign up',
      path: '/',
      connections: ['auth', 'plans'],
      color: 'bg-blue-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'auth',
      title: 'Authentication',
      description: 'Single-page authentication with sign-in/sign-up toggle. Supports promotional codes SUMMER20 and PRO15.',
      path: '/auth',
      connections: ['profile', 'landing'],
      color: 'bg-green-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      )
    },
    {
      id: 'plans',
      title: 'Plans & Pricing',
      description: 'Subscription options with promotional discounts',
      path: '/plans',
      connections: ['auth', 'subscription'],
      color: 'bg-purple-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'profile',
      title: 'Profile Dashboard',
      description: 'User information, subscription status, and quick actions',
      path: '/profile',
      connections: ['editor', 'history', 'subscription'],
      color: 'bg-indigo-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 'editor',
      title: 'Video Editor',
      description: 'Upload, crop, and process videos in bulk',
      path: '/editor',
      connections: ['history'],
      color: 'bg-rose-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    },
    {
      id: 'history',
      title: 'Video History',
      description: 'View and manage processed videos',
      path: '/history',
      connections: ['editor'],
      color: 'bg-amber-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'subscription',
      title: 'Subscription Management',
      description: 'Manage plan, billing, and usage metrics',
      path: '/subscription',
      connections: ['profile'],
      color: 'bg-cyan-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    }
  ];

  // Helper function to calculate position for connection lines
  const getConnectionPath = (from: string, to: string) => {
    const fromIndex = flowSections.findIndex(s => s.id === from);
    const toIndex = flowSections.findIndex(s => s.id === to);
    
    // If we can't find either section, don't render a connection
    if (fromIndex === -1 || toIndex === -1) return null;
    
    // Simple straight connections for adjacently positioned items
    if (Math.abs(fromIndex - toIndex) === 1) {
      return "direct";
    }
    
    // For non-adjacent items, create a curved path
    return "curved";
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Bulk Video Cropper
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            User Journey Flow Diagram
          </p>
        </div>

        {/* Flow Diagram */}
        <div className="relative bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="flex justify-center items-center h-full">
              <div className="w-full h-full bg-gradient-to-br from-transparent via-gray-200 dark:via-gray-700 to-transparent opacity-20"></div>
            </div>
          </div>

          {/* Visual Connection Lines */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-w-5xl mx-auto">
              {/* Subtle connecting lines */}
              <div className="absolute top-1/4 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-blue-300 to-green-300 opacity-30 transform rotate-12"></div>
              <div className="absolute top-2/4 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-purple-300 to-indigo-300 opacity-30 transform -rotate-12"></div>
              <div className="absolute top-3/5 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-amber-300 to-rose-300 opacity-30 transform rotate-6"></div>
            </div>
          </div>

          {/* Flow Items */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {flowSections.map((section) => (
              <div 
                key={section.id}
                className={`${section.color} ${activeZoom === section.id ? 'scale-105' : ''} 
                  rounded-lg shadow-lg p-6 text-white cursor-pointer transition-all duration-300
                  transform hover:scale-105 hover:shadow-xl`}
                onClick={() => setActiveZoom(activeZoom === section.id ? null : section.id)}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-bold">{section.title}</h3>
                </div>
                <p className="mb-4">{section.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <Link href={section.path} className="text-white font-medium hover:underline flex items-center">
                    Visit {section.title}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                  {activeZoom === section.id && (
                    <button 
                      className="text-white bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveZoom(null);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Special Flows Section */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Special User Journeys</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg shadow-lg p-6 text-white">
                <h4 className="text-xl font-bold mb-2">Promotional Flow</h4>
                <p className="mb-4">Marketing campaign → Promo landing page → Sign up with discount → Premium features</p>
                <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-yellow-400 text-yellow-800 px-2 py-1 rounded text-xs font-bold">SUMMER20</div>
                    <span className="text-white text-sm">20% off Premium Plan</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-400 text-blue-800 px-2 py-1 rounded text-xs font-bold">PRO15</div>
                    <span className="text-white text-sm">15% off Pro Plan</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg p-6 text-white">
                <h4 className="text-xl font-bold mb-2">Free Trial Conversion</h4>
                <p className="mb-4">Sign up → Use free tier → Reach limits → Upgrade prompt → Subscribe</p>
                <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">1. Free tier</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white text-sm">2. Limits</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white text-sm">3. Subscribe</span>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-white font-medium bg-white bg-opacity-10 px-2 py-1 rounded">Conversion Rate: 15%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-lg p-6 text-white">
                <h4 className="text-xl font-bold mb-2">Bulk Processing Workflow</h4>
                <p className="mb-4">Upload multiple videos → Apply batch settings → Process → Download zip</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-white font-medium">Time saved: 80%</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg shadow-lg p-6 text-white">
                <h4 className="text-xl font-bold mb-2">User Onboarding</h4>
                <p className="mb-4">New sign-up → Guided tour → First video upload → Processing → Success</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-white font-medium">Completion Rate: 85%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Navigation */}
        <div className="text-center mt-8 space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">This diagram illustrates the complete user journey through the Bulk Video Cropper application.</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => router.push('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
            <button 
              onClick={() => router.push('/editor')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              Try Video Editor
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
