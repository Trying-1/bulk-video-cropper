'use client';

import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import LegalSideNav from '@/components/LegalSideNav';

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Floating Side Navigation */}
      <LegalSideNav />
      
      {/* Main Content */}
      <div className="flex-grow bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6 bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Terms of Service</h1>
            <p className="text-gray-500 mt-2">Last Updated: May 19, 2025</p>
          </div>
          
          {/* Table of Contents */}
          <div className="bg-gray-50 p-4 rounded-md mb-8">
            <h3 className="font-semibold text-gray-700 mb-2">Contents:</h3>
            <ul className="space-y-1">
              <li><a href="#acceptance" className="text-teal-600 hover:text-teal-800">1. Acceptance of Terms</a></li>
              <li><a href="#services" className="text-teal-600 hover:text-teal-800">2. Services Description</a></li>
              <li><a href="#account" className="text-teal-600 hover:text-teal-800">3. Account Registration</a></li>
              <li><a href="#subscription" className="text-teal-600 hover:text-teal-800">4. Subscription Plans</a></li>
              <li><a href="#content" className="text-teal-600 hover:text-teal-800">5. User Content</a></li>
              <li><a href="#contact" className="text-teal-600 hover:text-teal-800">6. Contact Us</a></li>
            </ul>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            <section id="acceptance" className="p-4 border-l-4 border-teal-500 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing or using Bulk Video Cropper, you agree to comply with and be bound by these Terms of Service. 
                If you do not agree with these Terms, you may not access or use our Services. Your continued use of the 
                platform constitutes acceptance of these terms and any updates we may make to them.
              </p>
            </section>
            
            <section id="services" className="p-4 border-l-4 border-teal-500 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Services Description</h2>
              <p className="text-gray-700 mb-3">
                Bulk Video Cropper provides an AI-powered video editing platform that enables users to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Upload and process multiple videos simultaneously</li>
                <li>Use intelligent AI cropping to preserve key content</li>
                <li>Create optimized videos for various social media formats</li>
                <li>Export and download processed videos</li>
                <li>Access free and premium subscription features</li>
              </ul>
            </section>
            
            <section id="account" className="p-4 border-l-4 border-teal-500 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Account Registration</h2>
              <p className="text-gray-700">
                To use certain features of our Services, you need to register for an account. You are responsible for 
                maintaining the security of your account and password. You must provide accurate, current, and complete 
                information during registration and keep it updated. You agree to notify us immediately of any unauthorized 
                use of your account.
              </p>
            </section>
            
            <section id="subscription" className="p-4 border-l-4 border-teal-500 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Subscription Plans</h2>
              <p className="text-gray-700 mb-3">
                Bulk Video Cropper offers both free and paid subscription plans:
              </p>
              <div className="bg-white p-4 rounded border border-gray-200 mb-3">
                <h3 className="font-semibold text-gray-700">Free Plan</h3>
                <p className="text-gray-600">Limited access to basic features with processing limits</p>
              </div>
              <div className="bg-white p-4 rounded border border-gray-200 mb-3">
                <h3 className="font-semibold text-gray-700">Premium Plan</h3>
                <p className="text-gray-600">Enhanced features with higher processing limits</p>
              </div>
              <div className="bg-white p-4 rounded border border-gray-200">
                <h3 className="font-semibold text-gray-700">Pro Plan</h3>
                <p className="text-gray-600">Full access to all features with maximum processing capacity</p>
              </div>
            </section>
            
            <section id="content" className="p-4 border-l-4 border-teal-500 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. User Content</h2>
              <p className="text-gray-700">
                You retain all rights to your content uploaded to our platform. By using our services, you grant us permission 
                to process your videos for the purpose of providing our services. You represent that you have all necessary 
                rights to the content you upload, and that it does not violate any third-party rights or applicable laws.
              </p>
            </section>
            
            <section id="contact" className="p-4 border-l-4 border-teal-500 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Contact Us</h2>
              <p className="text-gray-700 mb-3">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-white p-4 rounded border border-gray-200">
                <p className="text-gray-700"><strong>Email:</strong> support@bulkvidcropper.com</p>
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
