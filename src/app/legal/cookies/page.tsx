'use client';

import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import LegalSideNav from '@/components/LegalSideNav';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Floating Side Navigation */}
      <LegalSideNav />
      
      {/* Main Content */}
      <div className="flex-grow bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6 bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Cookie Policy</h1>
            <p className="text-gray-500 mt-2">Last Updated: May 19, 2025</p>
          </div>
          
          {/* Table of Contents */}
          <div className="bg-gray-50 p-4 rounded-md mb-8">
            <h3 className="font-semibold text-gray-700 mb-2">Contents:</h3>
            <ul className="space-y-1">
              <li><a href="#what" className="text-teal-600 hover:text-teal-800">1. What Are Cookies</a></li>
              <li><a href="#how" className="text-teal-600 hover:text-teal-800">2. How We Use Cookies</a></li>
              <li><a href="#types" className="text-teal-600 hover:text-teal-800">3. Types of Cookies We Use</a></li>
              <li><a href="#managing" className="text-teal-600 hover:text-teal-800">4. Managing Cookies</a></li>
              <li><a href="#contact" className="text-teal-600 hover:text-teal-800">5. Contact Us</a></li>
            </ul>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            <section id="what" className="p-4 border-l-4 border-teal-500 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. What Are Cookies</h2>
              <p className="text-gray-700">
                Cookies are small text files that are stored on your device when you visit our website. They are widely used 
                to make websites work more efficiently and provide information to the website owners. These files allow our 
                website to recognize your device and remember information about your visit, such as your preferences, settings, 
                and how you use our website.
              </p>
            </section>
            
            <section id="how" className="p-4 border-l-4 border-teal-500 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Cookies</h2>
              <p className="text-gray-700 mb-3">
                Bulk Video Cropper uses cookies to enhance your experience on our platform, remember your preferences, and understand 
                how you interact with our video processing services. We use cookies for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>To keep you logged in during your session</li>
                <li>To remember your video processing preferences</li>
                <li>To maintain your selected export settings</li>
                <li>To track your subscription usage and limits</li>
                <li>To analyze how our video processing tools are used</li>
                <li>To personalize your experience based on past usage</li>
              </ul>
            </section>
            
            <section id="types" className="p-4 border-l-4 border-teal-500 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Types of Cookies We Use</h2>
              
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3.1 Essential Cookies</h3>
                <p className="text-gray-700 mb-3">
                  Essential cookies are necessary for the Bulk Video Cropper application to function properly. They enable 
                  core features like user authentication, session management, and video processing functionality.
                </p>
                <div className="bg-white p-3 rounded border border-gray-200 mb-2">
                  <p className="text-gray-600"><strong>session_id</strong>: Maintains your session across page loads</p>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-gray-600"><strong>auth_token</strong>: Authenticates you with our video processing servers</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3.2 Functional Cookies</h3>
                <p className="text-gray-700 mb-3">
                  Functional cookies enhance your experience by remembering your preferences and settings for video editing and processing.
                </p>
                <div className="bg-white p-3 rounded border border-gray-200 mb-2">
                  <p className="text-gray-600"><strong>video_preferences</strong>: Remembers your preferred crop dimensions and aspect ratios</p>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-gray-600"><strong>theme</strong>: Remembers your theme preference (light/dark)</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3.3 Analytical Cookies</h3>
                <p className="text-gray-700 mb-3">
                  Analytical cookies help us understand how users interact with Bulk Video Cropper. They provide insights into 
                  video processing patterns, tool usage, and performance metrics to help us improve the application.
                </p>
                <div className="bg-white p-3 rounded border border-gray-200 mb-2">
                  <p className="text-gray-600"><strong>_ga</strong>: Used by Google Analytics to distinguish users</p>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-gray-600"><strong>video_processing_metrics</strong>: Tracks performance metrics for video processing operations</p>
                </div>
              </div>
            </section>
            
            <section id="managing" className="p-4 border-l-4 border-teal-500 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Managing Cookies</h2>
              <p className="text-gray-700 mb-3">
                Most web browsers allow you to control cookies through their settings. You can usually find these settings 
                in the "Options" or "Preferences" menu of your browser. You can:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Delete all cookies from your browser</li>
                <li>Block all cookies by default</li>
                <li>Allow only certain sites to set cookies</li>
                <li>Browse in private or incognito mode to delete cookies when you close your browser</li>
              </ul>
              <div className="bg-gray-100 p-3 rounded mt-4 border-l-4 border-yellow-500">
                <p className="text-gray-700">
                  <strong>Note:</strong> Please be aware that if you choose to block or delete cookies, some features of Bulk Video Cropper 
                  may not function properly. In particular, you may not be able to stay logged in or save your video processing preferences.
                </p>
              </div>
            </section>
            
            <section id="contact" className="p-4 border-l-4 border-teal-500 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Contact Us</h2>
              <p className="text-gray-700 mb-3">
                If you have any questions about our use of cookies, please contact us at:
              </p>
              <div className="bg-white p-4 rounded border border-gray-200">
                <p className="text-gray-700"><strong>Email:</strong> privacy@bulkvidcropper.com</p>
                <p className="text-gray-700"><strong>Address:</strong> 123 Video Lane, San Francisco, CA 94103, USA</p>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}