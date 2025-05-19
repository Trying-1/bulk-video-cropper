'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { updateAppStateCookie } from '@/utils/cookies';
import Link from 'next/link';

interface Feature {
  title: string;
  description: string;
  free: string;
  premium: string;
  icon: React.ReactNode;
}

export default function UpsellPage() {
  const router = useRouter();
  const { user, subscription } = useAuth();
  const [activePlan, setActivePlan] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    // Track page visit
    updateAppStateCookie({
      lastVisitedPage: '/upsell'
    });
    
    // If user is already premium, redirect to editor
    if (subscription && subscription.plan?.name !== 'free') {
      router.push('/editor');
    }
  }, [subscription, router]);

  const features: Feature[] = [
    {
      title: 'Video Upload Limit',
      description: 'How many videos you can process per month',
      free: '5 videos/month',
      premium: 'Unlimited',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    },
    {
      title: 'Video Duration',
      description: 'Maximum length for video processing',
      free: 'Up to 5 minutes',
      premium: 'Up to 60 minutes',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Batch Processing',
      description: 'Process multiple videos at once',
      free: 'Limited to 2 videos',
      premium: 'Up to 50 videos at once',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      )
    },
    {
      title: 'Export Quality',
      description: 'Resolution and bitrate for processed videos',
      free: 'Standard (720p)',
      premium: 'High (4K)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      title: 'Custom Aspect Ratios',
      description: 'Use specific aspect ratios for your videos',
      free: 'Limited presets only',
      premium: 'Custom aspect ratios',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      title: 'Watermark',
      description: 'Branding options for processed videos',
      free: 'App watermark included',
      premium: 'No watermark',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      )
    },
    {
      title: 'Priority Processing',
      description: 'How fast your videos are processed',
      free: 'Standard queue',
      premium: 'Priority queue',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: 'Customer Support',
      description: 'Get help when you need it',
      free: 'Email support',
      premium: 'Priority support',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
              Upgrade Your Experience
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Unlock premium features and process unlimited videos with our premium plans.
          </p>
        </motion.div>

        {/* Plan selector tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setActivePlan('monthly')}
              className={`px-6 py-3 text-sm font-medium rounded-l-md ${
                activePlan === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setActivePlan('yearly')}
              className={`px-6 py-3 text-sm font-medium rounded-r-md relative ${
                activePlan === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Free plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
          >
            <div className="px-6 py-8 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Free Plan</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Basic features for occasional use
              </p>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$0</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">/month</span>
              </div>
              <div className="mt-6">
                <button
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 font-medium cursor-not-allowed"
                >
                  Current Plan
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">5 videos per month</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">720p video quality</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Standard aspect ratios</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Basic editing tools</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-red-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-500 dark:text-gray-400 line-through">Batch processing</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-red-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-500 dark:text-gray-400 line-through">Remove watermark</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Premium plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden ring-2 ring-blue-500 dark:ring-blue-400 relative"
          >
            <div className="absolute top-0 right-0">
              <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                RECOMMENDED
              </div>
            </div>
            <div className="px-6 py-8 bg-gradient-to-br from-blue-500 to-teal-400 border-b border-blue-400">
              <h3 className="text-2xl font-bold text-white">Premium Plan</h3>
              <p className="mt-2 text-blue-100">
                Advanced features for power users
              </p>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-white">
                  ${activePlan === 'monthly' ? '9.99' : '95.90'}
                </span>
                <span className="text-blue-100 ml-1">/{activePlan === 'monthly' ? 'month' : 'year'}</span>
                {activePlan === 'yearly' && (
                  <span className="ml-2 bg-white bg-opacity-20 text-white text-xs px-2 py-0.5 rounded-full">
                    $7.99/month
                  </span>
                )}
              </div>
              <div className="mt-6">
                <Link
                  href="/payment"
                  className="block w-full px-4 py-2 bg-white text-blue-600 rounded-md font-medium text-center hover:bg-blue-50 transition-colors"
                >
                  Upgrade Now
                </Link>
              </div>
            </div>
            <div className="px-6 py-4">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong>Unlimited</strong> videos per month
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong>4K</strong> video quality
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong>Custom</strong> aspect ratios
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong>Advanced</strong> editing tools
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong>Batch processing</strong> (up to 50 videos)
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">
                    <strong>No watermark</strong>
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Feature comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-16"
        >
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Feature Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Feature
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Free
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {features.map((feature, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 text-blue-500 dark:text-blue-400">
                          {feature.icon}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {feature.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {feature.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {feature.free}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {feature.premium}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-500 to-teal-400 rounded-xl shadow-lg p-8 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Upgrade?</h2>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
            Unlock all premium features and start creating professional-quality videos today.
            No limits, no watermarks, just pure creativity.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/payment"
              className="px-6 py-3 bg-white text-blue-600 rounded-md font-medium text-center hover:bg-blue-50 transition-colors shadow-sm"
            >
              Upgrade Now
            </Link>
            <Link
              href="/editor"
              className="px-6 py-3 bg-blue-600 bg-opacity-25 text-white rounded-md font-medium text-center hover:bg-opacity-30 transition-colors"
            >
              Continue with Free Plan
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
