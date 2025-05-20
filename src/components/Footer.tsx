'use client';

import React from 'react';
import Link from 'next/link';
import { APP_IDENTITY, APP_EMAILS, APP_URLS, SOCIAL_MEDIA } from '@/config/branding';

/**
 * Comprehensive footer component used across the application
 */
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">{APP_IDENTITY.name}</h3>
            <p className="mb-4">
              Intelligent video cropping for content creators and marketers. Transform your video workflow with our AI-powered tools.
            </p>
            <div className="flex space-x-4 mt-4">
              <Link href={SOCIAL_MEDIA.twitter.url} className="text-gray-400 hover:text-teal-400 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </Link>
              <Link href={SOCIAL_MEDIA.linkedin.url} className="text-gray-400 hover:text-teal-400 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 6a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 9a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 6a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0" />
                </svg>
              </Link>
              <Link href={SOCIAL_MEDIA.instagram.url} className="text-gray-400 hover:text-teal-400 transition-colors">
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
                <Link href="/#features" className="hover:text-teal-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-teal-400 transition-colors">
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
                <Link href="/" className="hover:text-teal-400 transition-colors">
                  Home
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-md font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/privacy" className="hover:text-teal-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-teal-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:text-teal-400 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/legal" className="hover:text-teal-400 transition-colors">
                  All Legal Docs
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm">
            {APP_IDENTITY.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
