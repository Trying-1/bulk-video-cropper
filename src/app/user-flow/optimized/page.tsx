'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getEditorSettingsCookie, updateAppStateCookie } from '@/utils/cookies';

export default function OptimizedUserFlowPage() {
  const router = useRouter();
  const { user, subscription } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  
  useEffect(() => {
    // Track page visit for analytics
    updateAppStateCookie({
      lastVisitedPage: '/user-flow/optimized'
    });
    
    // Simulate loading state for smoother transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Optimized user flows based on user state
  const userFlows = [
    {
      id: 'new-user',
      title: 'New User Journey',
      description: 'From discovery to first video crop',
      steps: [
        { id: 'landing', label: 'Landing Page', path: '/' },
        { id: 'signup', label: 'Quick Signup', path: '/auth?source=quick' },
        { id: 'editor', label: 'Video Editor', path: '/editor' },
        { id: 'download', label: 'Download Result', path: '/editor' },
        { id: 'plans', label: 'Upgrade Options', path: '/plans' }
      ],
      color: 'from-blue-500 to-teal-400'
    },
    {
      id: 'returning-free',
      title: 'Free User Journey',
      description: 'Optimized workflow for free users',
      steps: [
        { id: 'landing', label: 'Landing Page', path: '/' },
        { id: 'login', label: 'Quick Login', path: '/auth?source=returning' },
        { id: 'editor', label: 'Video Editor', path: '/editor' },
        { id: 'process', label: 'Process Video', path: '/editor' },
        { id: 'upsell', label: 'Premium Features', path: '/upsell' }
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'premium',
      title: 'Premium User Journey',
      description: 'Advanced features for premium subscribers',
      steps: [
        { id: 'dashboard', label: 'User Dashboard', path: '/profile' },
        { id: 'editor', label: 'Bulk Editor', path: '/editor' },
        { id: 'process', label: 'Batch Processing', path: '/editor' },
        { id: 'history', label: 'Video History', path: '/history' },
        { id: 'share', label: 'Share Results', path: '/editor' }
      ],
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 'payment',
      title: 'Upgrade Journey',
      description: 'Seamless subscription upgrade process',
      steps: [
        { id: 'plans', label: 'Plans & Pricing', path: '/plans' },
        { id: 'payment', label: 'Payment Form', path: '/payment/form' },
        { id: 'checkout', label: 'Checkout', path: '/payment/checkout' },
        { id: 'confirmation', label: 'Confirmation', path: '/payment/success' },
        { id: 'premium-editor', label: 'Premium Editor', path: '/editor' }
      ],
      color: 'from-green-500 to-emerald-600'
    }
  ];

  // Get recommended flow based on user state
  const getRecommendedFlow = () => {
    if (!user) return 'new-user';
    if (subscription && subscription.plan?.name !== 'free') return 'premium';       
    return 'returning-free';
  };

  // Quick action button for the most relevant next step
  const getQuickActionButton = () => {
    if (!user) {
      return {
        label: 'Try for Free',
        path: '/auth?source=quick',
        color: 'bg-blue-500 hover:bg-blue-600'
      };
    }
    
    if (subscription && subscription.plan?.name === 'free') {
      return {
        label: 'Upgrade Now',
        path: '/plans',
        color: 'bg-purple-500 hover:bg-purple-600'
      };
    }
    
    return {
      label: 'Edit Videos',
      path: '/editor',
      color: 'bg-green-500 hover:bg-green-600'
    };
  };

  const quickAction = getQuickActionButton();
  const recommendedFlow = getRecommendedFlow();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {isLoading ? (
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl tracking-tight">
              Optimized User Experience
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We've streamlined the video editing process to make it faster and more intuitive
            </p>
            
            <div className="mt-8">
              <Link 
                href={quickAction.path}
                className={`${quickAction.color} text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center`}
              >
                {quickAction.label}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Flow Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {userFlows.map((flow) => (
              <motion.div
                key={flow.id}
                className={`bg-gradient-to-br ${flow.color} rounded-xl shadow-lg p-6 text-white cursor-pointer
                  ${flow.id === recommendedFlow ? 'ring-4 ring-white ring-opacity-60' : ''}
                  ${selectedFlow === flow.id ? 'scale-105' : 'hover:scale-102'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedFlow(flow.id === selectedFlow ? null : flow.id)}
              >
                <h3 className="text-xl font-bold mb-2">{flow.title}</h3>
                <p className="text-white text-opacity-90 mb-4">{flow.description}</p>
                {flow.id === recommendedFlow && (
                  <div className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium mb-3">
                    Recommended for you
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm">{flow.steps.length} steps</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Selected Flow Details */}
          {selectedFlow && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 mb-12"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userFlows.find(f => f.id === selectedFlow)?.title}
                </h2>
                <button
                  onClick={() => setSelectedFlow(null)}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="relative">
                {/* Flow Steps */}
                <div className="flex flex-col md:flex-row justify-between items-start relative z-10">
                  {userFlows.find(f => f.id === selectedFlow)?.steps.map((step, index) => (
                    <div key={step.id} className="flex flex-col items-center mb-8 md:mb-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg
                        bg-gradient-to-br ${userFlows.find(f => f.id === selectedFlow)?.color}`}>
                        {index + 1}
                      </div>
                      <h3 className="mt-3 font-medium text-gray-900 dark:text-white text-center">
                        {step.label}
                      </h3>
                      <Link
                        href={step.path}
                        className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Visit
                      </Link>
                    </div>
                  ))}
                </div>
                
                {/* Connecting line */}
                <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <Link
                  href={userFlows.find(f => f.id === selectedFlow)?.steps[0].path || '/'}
                  className={`bg-gradient-to-r ${userFlows.find(f => f.id === selectedFlow)?.color} 
                    text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  Start This Flow
                </Link>
              </div>
            </motion.div>
          )}

          {/* Workflow Optimization Highlights */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Workflow Improvements
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Faster Onboarding</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Simplified signup process and intuitive first-time user experience
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900 w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Seamless Payments</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Streamlined checkout process with intuitive payment flow
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="rounded-full bg-green-100 dark:bg-green-900 w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">One-Click Editing</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Simplified video cropping with smart presets and batch processing
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
