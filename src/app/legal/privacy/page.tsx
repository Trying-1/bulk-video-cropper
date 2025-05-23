'use client';

import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import LegalSideNav from '@/components/LegalSideNav';
import { APP_EMAILS } from '@/config/branding';

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col">
      {/* Floating Side Navigation */}
      <LegalSideNav />
      
      {/* Main Content */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6 bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Privacy Policy</h1>
            <p className="text-gray-500 mt-2">Last Updated: May 19, 2025</p>
          </div>
          
          {/* Table of Contents */}
          <div className="bg-gray-50 p-4 rounded-md mb-8">
            <h3 className="font-semibold text-gray-700 mb-2">Contents:</h3>
            <ul className="space-y-1">
              <li><a href="#intro" className="text-teal-600 hover:text-teal-800">1. Introduction</a></li>
              <li><a href="#collect" className="text-teal-600 hover:text-teal-800">2. Information We Collect</a></li>
              <li><a href="#use" className="text-teal-600 hover:text-teal-800">3. How We Use Your Information</a></li>
              <li><a href="#security" className="text-teal-600 hover:text-teal-800">4. Data Security</a></li>
              <li><a href="#contact" className="text-teal-600 hover:text-teal-800">5. Contact Us</a></li>
            </ul>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            <section id="intro" className="p-4 border-l-4 border-teal-500 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Introduction</h2>
              <p className="text-gray-700">
                Welcome to Bulk Video Cropper. This Privacy Policy explains how we collect, use, and protect your information when you use our video editing platform.
              </p>
            </section>
            
            <section id="collect" className="p-4 border-l-4 border-teal-500 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Information We Collect</h2>
              <p className="text-gray-700 mb-3">
                We collect information when you use our services, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Account information (name, email, password)</li>
                <li>Videos you upload for editing</li>
                <li>Usage statistics and preferences</li>
              </ul>
            </section>
            
            <section id="use" className="p-4 border-l-4 border-teal-500 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-3">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Process your video content according to your specifications</li>
                <li>Provide support for our services</li>
                <li>Analyze usage patterns to improve our platform's functionality</li>
              </ul>
            </section>
            
            <section id="security" className="p-4 border-l-4 border-teal-500 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Data Security</h2>
              <p className="text-gray-700">
                We implement appropriate technical and organizational measures to protect your information against unauthorized or unlawful processing, accidental loss, destruction, or damage. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
              </p>
            </section>
            
            <section id="contact" className="p-4 border-l-4 border-teal-500 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Contact Us</h2>
              <p className="text-gray-700 mb-3">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-white p-4 rounded border border-gray-200">
                <p className="text-gray-700">
                  <strong>Email: </strong>
                  <a 
                    href={`mailto:${APP_EMAILS.support}`}
                    className="text-teal-600 hover:text-teal-800 hover:underline"
                  >
                    {APP_EMAILS.support}
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}