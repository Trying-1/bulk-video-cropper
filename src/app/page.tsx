"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserSessionCookie, updateAppStateCookie, getAppStateCookie } from '@/utils/cookies';
import { useComingSoon } from "@/components/ComingSoonModal";
import { isFeatureEnabled } from "@/config/features";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user, loading } = useAuth();
  const { showComingSoon, ComingSoonModal } = useComingSoon();
  
  // Check if payments are enabled
  const paymentsEnabled = isFeatureEnabled('ENABLE_PAYMENTS');
  
  useEffect(() => {
    // Check cookies first for faster initial render
    const sessionCookie = getUserSessionCookie();
    if (sessionCookie) {
      setIsAuthenticated(true);
    }
    
    // Track that user visited landing page
    updateAppStateCookie({
      lastVisitedPage: '/'
    });
    
    setIsLoaded(true);
  }, []);
  
  // Update from actual auth state once it's loaded
  useEffect(() => {
    if (!loading) {
      setIsAuthenticated(!!user);
    }
  }, [user, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden relative">
      {/* Coming Soon Modal Component - Only show when triggered */}
      <ComingSoonModal />
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-teal-300 to-teal-400 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-br from-orange-300 to-pink-400 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="hidden md:block absolute -top-10 -right-10 w-28 h-28 bg-teal-500 opacity-30 rounded-lg transform rotate-12"></div>
        <div className="hidden md:block absolute top-1/4 -left-10 w-20 h-20 bg-orange-500 opacity-30 rounded-lg transform -rotate-12"></div>
      </div>
      
      {/* Removed duplicate Navbar - using global navigation from Layout */}
      <main className="relative z-10">
        <section className="relative py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              {/* Animated badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white text-sm font-medium mb-6 animate-pulse">
                <span className="flex h-2 w-2 relative mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                New: Batch processing now available!
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-400 dark:to-blue-500 mb-6 leading-tight">
                Bulk Video Cropper
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
                Edit multiple videos at once with our powerful video editing tool. Perfect for social media content creators.
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-6 relative z-10">
                <Link
                  href={isAuthenticated ? "/editor" : "/auth?source=free"}
                  className="group relative overflow-hidden bg-gradient-to-r from-teal-500 to-blue-600 text-white px-10 py-5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Get Started for Free
                  </span>
                </Link>
                <Link
                  href="/plans"
                  className="group relative overflow-hidden bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 border-2 border-teal-500 dark:border-teal-400 px-10 py-5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="absolute top-0 left-0 w-full h-full bg-teal-50 dark:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                    See Plans & Pricing
                  </span>
                </Link>
                <Link
                  href="#how-it-works"
                  className="group relative overflow-hidden bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-10 py-5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="absolute top-0 left-0 w-full h-full bg-gray-100 dark:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    How It Works
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="container mx-auto px-4 py-20 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl my-12 shadow-xl">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-800 font-medium text-sm mb-4 dark:bg-orange-900 dark:text-orange-200">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              How <span className="text-teal-600 dark:text-teal-400">Bulk Video Cropper</span> Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-4">
              Crop multiple videos in just a few simple steps - no technical skills required.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg relative h-full border border-gray-100 dark:border-gray-600">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-md">1</div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Upload Videos</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Drag and drop multiple videos into our platform.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-12 transform -translate-y-1/2 z-10">
                <svg className="w-24 h-8 text-teal-500" fill="none" viewBox="0 0 24 8" stroke="currentColor">
                  <path d="M23.354 4.354a.5.5 0 0 0 0-.708L20.172.464a.5.5 0 0 0-.708.708L22.293 4l-2.829 2.828a.5.5 0 1 0 .708.708l3.182-3.182zM0 4.5h23v-1H0v1z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg relative h-full border border-gray-100 dark:border-gray-600">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-md">2</div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">AI Processing</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our AI analyzes and processes your videos to optimize them for social media.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-12 transform -translate-y-1/2 z-10">
                <svg className="w-24 h-8 text-orange-500" fill="none" viewBox="0 0 24 8" stroke="currentColor">
                  <path d="M23.354 4.354a.5.5 0 0 0 0-.708L20.172.464a.5.5 0 0 0-.708.708L22.293 4l-2.829 2.828a.5.5 0 1 0 .708.708l3.182-3.182zM0 4.5h23v-1H0v1z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            
            {/* Step 3 */}
            <div>
              <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg relative h-full border border-gray-100 dark:border-gray-600">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-md">3</div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Export & Share</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Download your optimized videos and share them directly to social media.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <Link 
              href="/editor" 
              className="px-8 py-4 bg-orange-500 text-white rounded-lg font-medium text-lg hover:bg-orange-600 transition-colors shadow-md inline-flex items-center justify-center"
            >
              Try It Now - It's Free
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-teal-500 text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Batch Processing
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Process multiple videos simultaneously, saving you time and effort.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-teal-500 text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Advanced Cropping
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Precise video cropping with multiple aspect ratios for all social media platforms.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-teal-500 text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Subscription Plans
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Choose from multiple plans to suit your video editing needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-gradient-to-br from-teal-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Pricing Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-t-4 border-gray-200 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 -z-10 opacity-50"></div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Free
                </h3>
                <div className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
                  $0<span className="text-sm text-gray-500 font-normal">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    5 videos per month
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Basic video cropping
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    720p output quality
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Small watermark
                  </li>
                </ul>
                <button
                  onClick={() => {
                    const user = localStorage.getItem('user');
                    if (user) {
                      // User is logged in, go to plans
                      window.location.href = '/plans?plan=free';
                    } else {
                      // User is not logged in, go to auth with returnUrl
                      window.location.href = '/auth?source=free&returnUrl=/plans?plan=free';
                    }
                  }}
                  className="block w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-center text-gray-700 dark:text-white font-medium rounded-lg transition-colors"
                >
                  Get Started Free
                </button>
              </div>

              {/* Premium Plan */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 hover:shadow-2xl transition-shadow border-t-4 border-teal-500 dark:border-teal-400 relative scale-105 z-10 overflow-hidden">
                <div className="absolute -top-6 -right-6 bg-teal-500 text-white text-xs font-bold px-4 py-1 rotate-45 transform w-28">
                  POPULAR
                </div>
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/10 -z-10 opacity-50"></div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Premium
                </h3>
                <div className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
                  $9.99<span className="text-sm text-gray-500 font-normal">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <strong>50 videos per month</strong>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <strong>Advanced cropping options</strong>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <strong>1080p HD output quality</strong>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <strong>No watermark</strong>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <strong>Priority support</strong>
                  </li>
                </ul>
                <button
                  onClick={() => {
                    if (!paymentsEnabled) {
                      // Show the cool ComingSoon modal instead of redirecting
                      showComingSoon({
                        featureName: 'Premium Plan',
                        description: 'The Premium plan is coming soon! We\'re currently finalizing our payment system and premium features. You can continue using our free plan in the meantime.'
                      });
                      return;
                    }
                    
                    const user = localStorage.getItem('user');
                    if (user) {
                      // User is logged in, go directly to payment
                      window.location.href = '/payment?plan=premium';
                    } else {
                      // User is not logged in, go to auth with returnUrl
                      window.location.href = '/auth?returnUrl=/payment?plan=premium';
                    }
                  }}
                  className="block w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-center text-white font-medium rounded-lg transition-colors shadow-md"
                >
                  Upgrade to Premium
                </button>
              </div>

              {/* Pro Plan */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-t-4 border-purple-500 dark:border-purple-400 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 -z-10 opacity-50"></div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Pro
                </h3>
                <div className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
                  $29.99<span className="text-sm text-gray-500 font-normal">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <strong>Unlimited videos</strong>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <strong>All Premium features</strong>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <strong>4K output quality</strong>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <strong>Batch processing</strong>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <strong>24/7 dedicated support</strong>
                  </li>
                </ul>
                <button
                  onClick={() => {
                    if (!paymentsEnabled) {
                      // Show the cool ComingSoon modal instead of redirecting
                      showComingSoon({
                        featureName: 'Pro Plan',
                        description: 'The Pro plan is coming soon! We\'re currently finalizing our payment system and advanced pro features. You can continue using our free plan in the meantime.'
                      });
                      return;
                    }
                    
                    const user = localStorage.getItem('user');
                    if (user) {
                      // User is logged in, go directly to payment
                      window.location.href = '/payment?plan=pro';
                    } else {
                      // User is not logged in, go to auth with returnUrl
                      window.location.href = '/auth?returnUrl=/payment?plan=pro';
                    }
                  }}
                  className="block w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-center text-white font-medium rounded-lg transition-colors shadow-md"
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-500 dark:text-teal-300 text-xl font-bold mr-4">
                    S
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Sarah K.</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Social Media Manager</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "This tool has saved me hours of work every week. I can now crop all my videos for different platforms in minutes!"
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-500 dark:text-teal-300 text-xl font-bold mr-4">
                    M
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Michael T.</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Content Creator</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "The batch processing feature is a game-changer. I can now prepare content for all my social channels at once."
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-500 dark:text-teal-300 text-xl font-bold mr-4">
                    J
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Jessica L.</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Marketing Director</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "The premium plan is worth every penny. The quality and speed of processing has significantly improved our workflow."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-teal-500 to-teal-700 dark:from-teal-700 dark:to-teal-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Video Workflow?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of content creators who are saving time and producing better content with our bulk video cropping tool.
            </p>
            <Link
              href="/auth"
              className="inline-block bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-lg"
            >
              Get Started Today
            </Link>
          </div>
        </section>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-teal-500 text-white rounded-full p-3 shadow-lg hover:bg-teal-600 transition-colors z-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white text-lg font-semibold mb-4">Bulk Video Cropper</h3>
                <p className="mb-4">
                  Intelligent video cropping for content creators and marketers. Transform your video workflow with our AI-powered tools.
                </p>
                <div className="flex space-x-4 mt-4">
                  <Link href="https://twitter.com/bulkvidcropper" className="text-gray-400 hover:text-teal-400 transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    </svg>
                  </Link>
                  <Link href="https://linkedin.com/company/bulkvidcropper" className="text-gray-400 hover:text-teal-400 transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 6a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 9a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 6a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0" />
                    </svg>
                  </Link>
                  <Link href="https://instagram.com/bulkvidcropper" className="text-gray-400 hover:text-teal-400 transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 21.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="text-white text-md font-semibold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#features" className="hover:text-teal-400 transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#pricing" className="hover:text-teal-400 transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="/editor" className="hover:text-teal-400 transition-colors">
                      Try Demo
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white text-md font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="hover:text-teal-400 transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-teal-400 transition-colors">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="hover:text-teal-400 transition-colors">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white text-md font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/privacy" className="hover:text-teal-400 transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-teal-400 transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookies" className="hover:text-teal-400 transition-colors">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-sm">
                &copy; {new Date().getFullYear()} Bulk Video Cropper. All rights reserved.
              </p>
              <p className="mt-2 text-xs">
                Currently offering a 20% discount on Premium plans with code SUMMER20
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
