'use client';

import Link from 'next/link';
import LegalSideNav from '@/components/LegalSideNav';
import { APP_EMAILS } from "@/config/branding";

export default function ContactPage() {

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Floating Side Navigation */}
      <LegalSideNav />
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Contact Us</h1>

          <div className="text-center max-w-2xl mx-auto">

            <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Have questions or need support? Reach out to us directly.
              </p>
              <div className="mt-4">
                <a
                  href={`mailto:${APP_EMAILS.support}`}
                  className="text-teal-500 hover:text-teal-600 inline-flex items-center"
                >
                  <span className="mr-1">{APP_EMAILS.support}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
