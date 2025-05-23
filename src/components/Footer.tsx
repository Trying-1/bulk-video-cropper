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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-600 text-white font-bold text-xl mr-3">
                {APP_IDENTITY.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-white">{APP_IDENTITY.name}</h3>
            </div>
            <p className="mb-6 pr-4">{APP_IDENTITY.description}</p>
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
