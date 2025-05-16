"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, loading } = useAuth();
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden relative">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
            </svg>
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white">BulkVidCropper</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-600 hover:text-teal-600 dark:text-gray-300 dark:hover:text-teal-400 transition-colors">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-teal-600 dark:text-gray-300 dark:hover:text-teal-400 transition-colors">How It Works</a>
          <a href="#testimonials" className="text-gray-600 hover:text-teal-600 dark:text-gray-300 dark:hover:text-teal-400 transition-colors">Testimonials</a>
        </div>
        {!loading && (
          user ? (
            <Link 
              href="/editor" 
              className="hidden md:block px-5 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg font-medium hover:from-orange-500 hover:to-orange-700 transition-all shadow-md"
            >
              Start Cropping Now
            </Link>
          ) : (
            <div className="space-x-4">
              <Link href="/auth/signin" className="inline-block px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg font-medium hover:from-orange-500 hover:to-orange-700 transition-all shadow-md">
                Sign In
              </Link>
              <Link href="/auth/signup" className="inline-block px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-lg font-medium hover:from-teal-600 hover:to-teal-800 transition-all shadow-md">
                Sign Up
              </Link>
            </div>
          )
        )}
      </nav>
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between">
        <div className={`md:w-1/2 text-center md:text-left mb-12 md:mb-0 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
          <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 font-medium text-sm mb-6 dark:from-teal-900 dark:to-teal-800 dark:text-teal-200 shadow-sm">
            Free Online Video Tool
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
            Crop Multiple Videos <span className="text-orange-500 dark:text-orange-400">Instantly</span>
          </h1>
          
          <p className="text-xl max-w-xl mb-8 text-gray-600 dark:text-gray-300">
            The fastest way to crop videos for Instagram, TikTok, YouTube, and all social media platforms. No watermarks, no sign-up required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/editor" 
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md inline-flex items-center justify-center transform hover:scale-105 duration-200"
            >
              Start Cropping Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <a 
              href="#how-it-works" 
              className="px-8 py-4 bg-white text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-700 border border-teal-600 rounded-lg font-medium text-lg hover:bg-teal-50 transition-all shadow-sm inline-flex items-center justify-center dark:bg-gray-800 dark:border-teal-500 dark:hover:bg-gray-700 transform hover:scale-105 duration-200"
            >
              How It Works
            </a>
          </div>
          
          <div className="mt-8 flex items-center justify-center md:justify-start">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm border-2 border-white dark:border-gray-800">JD</div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm border-2 border-white dark:border-gray-800">KT</div>
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm border-2 border-white dark:border-gray-800">MR</div>
            </div>
            <div className="ml-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-bold">1,000+</span> videos processed today
            </div>
          </div>
        </div>
        
        <div className={`md:w-1/2 relative transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
          <div className="relative z-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
            <div className="aspect-video relative">
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse"></div>
                </div>
                <div className="h-8 w-20 bg-blue-100 dark:bg-blue-900 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/4 -right-12 w-40 h-40 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:mix-blend-overlay"></div>
          <div className="absolute -bottom-8 -left-12 w-40 h-40 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:mix-blend-overlay"></div>
          <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 dark:mix-blend-overlay"></div>
        </div>
      </header>

      {/* Feature Highlights */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-teal-100 text-teal-800 font-medium text-sm mb-4 dark:bg-teal-900 dark:text-teal-200">
            Powerful Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Everything You Need for <span className="text-orange-500 dark:text-orange-400">Video Cropping</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-4">
            Our tool is designed to make video cropping simple, fast, and effective for content creators of all levels.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 group hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-800 dark:to-teal-900 rounded-xl flex items-center justify-center mb-6 group-hover:from-teal-500 group-hover:to-teal-700 transition-all shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-teal-600 dark:text-teal-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-teal-500 group-hover:to-teal-700 dark:group-hover:from-teal-300 dark:group-hover:to-teal-500 transition-all">
              Bulk Video Processing
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Save hours of work by processing multiple videos simultaneously. Perfect for content creators who need to format videos for different platforms.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Process unlimited videos at once
              </li>
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Apply same crop to multiple videos
              </li>
            </ul>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 group hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Precise Crop Control
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our intuitive drag-and-crop interface lets you visually select exactly the part of the video you want to keep with pixel-perfect precision.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Drag edges for precise adjustments
              </li>
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Common aspect ratio presets
              </li>
            </ul>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 group hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600 dark:text-green-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
              Fast Processing & Download
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our optimized processing engine handles your videos quickly, and you can download individually or in bulk when complete.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Preview before downloading
              </li>
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Download all videos with one click
              </li>
            </ul>
          </div>
          
          {/* Feature 4 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 group hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-600 dark:text-red-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
              100% Private & Secure
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              All processing happens directly in your browser. Your videos never leave your device, ensuring complete privacy.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                No cloud uploads required
              </li>
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                No account registration needed
              </li>
            </ul>
          </div>
          
          {/* Feature 5 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 group hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-yellow-600 dark:text-yellow-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
              Social Media Optimized
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Preset aspect ratios for all major social platforms, so your videos always look perfect wherever you post them.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Instagram, TikTok, YouTube presets
              </li>
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Custom aspect ratios available
              </li>
            </ul>
          </div>
          
          {/* Feature 6 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 group hover:-translate-y-1 transition-transform duration-300">
            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              No Quality Loss
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our advanced processing maintains video quality while cropping, so your content always looks professional.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Maintains original resolution
              </li>
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                No watermarks or branding
              </li>
            </ul>
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="relative">
            <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg relative h-full border border-gray-100 dark:border-gray-600">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-md">1</div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Upload Your Videos</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Select and upload multiple videos from your device. Our tool accepts all common video formats.
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
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Set Crop Dimensions</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Use our intuitive drag-and-crop interface to select the exact portion of your videos you want to keep.
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
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Process & Download</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Click process, preview your results, and download your cropped videos individually or all at once.
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
      
      {/* Testimonials Section */}
      <section id="testimonials" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 font-medium text-sm mb-4 dark:bg-yellow-900 dark:text-yellow-200">
            User Feedback
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            What Content Creators Are <span className="text-yellow-600 dark:text-yellow-400">Saying</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-4">
            Join thousands of satisfied users who save time with our bulk video cropping tool.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">J</div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">James Wilson</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Instagram Content Creator</p>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              "This tool has saved me so much time! I used to spend hours cropping videos for different platforms, but now I can do it all at once. The drag-to-crop feature is incredibly intuitive."
            </p>
          </div>
          
          {/* Testimonial 2 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl mr-4">S</div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Sarah Johnson</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">TikTok Creator</p>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              "I love that I can crop multiple videos at once for my TikTok content. The preset aspect ratios make it super easy to get the perfect format every time. Highly recommend!"
            </p>
          </div>
          
          {/* Testimonial 3 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl mr-4">M</div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Michael Rodriguez</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">YouTube Content Creator</p>
              </div>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              "As a YouTube creator, I need different crops for my main videos, shorts, and promotional clips. This tool lets me do it all at once with perfect precision. The edge dragging feature is a game-changer!"
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 my-8">
        <div className="bg-gradient-to-br from-teal-600 via-teal-500 to-orange-500 rounded-2xl p-10 md:p-16 text-center text-white shadow-xl relative overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Crop Your Videos?<br />
              Start Using Bulk Video Cropper Today
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-white">
              Join thousands of content creators who save time with our free, easy-to-use bulk video cropping tool.
            </p>
            <Link 
              href="/editor" 
              className="px-8 py-4 bg-white text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-orange-500 rounded-lg font-medium text-lg hover:bg-gray-50 transition-all shadow-md inline-flex items-center justify-center border border-teal-100 transform hover:scale-105 duration-200"
            >
              Get Started Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
                  </svg>
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-white">BulkVidCropper</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The fastest way to crop multiple videos for social media. Free, online, and no sign-up required.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Features</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Bulk Processing</a></li>
                <li><a href="#features" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Precise Crop Control</a></li>
                <li><a href="#features" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Fast Processing</a></li>
                <li><a href="#features" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Privacy & Security</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#how-it-works" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">How It Works</a></li>
                <li><a href="#testimonials" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Testimonials</a></li>
                <li><Link href="/editor" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Video Editor</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Social Media Formats</h3>
              <ul className="space-y-2">
                <li><span className="text-gray-600 dark:text-gray-400">Instagram (1:1, 4:5, 9:16)</span></li>
                <li><span className="text-gray-600 dark:text-gray-400">TikTok (9:16)</span></li>
                <li><span className="text-gray-600 dark:text-gray-400">YouTube (16:9, 1:1, 9:16)</span></li>
                <li><span className="text-gray-600 dark:text-gray-400">Facebook (16:9, 1:1, 4:5)</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Bulk Video Cropper. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Optimized for Instagram, TikTok, YouTube, Facebook, Twitter, and all social media platforms.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
