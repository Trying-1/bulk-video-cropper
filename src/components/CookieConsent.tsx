'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check local storage to see if the user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem('cookiesAccepted');
    if (!hasAcceptedCookies) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 md:mr-4">
          <p className="text-gray-700 dark:text-gray-300">
            We use cookies to enhance your experience on our site. By continuing to use our site, you consent to our use of cookies in accordance with our{' '}
            <Link href="/legal/cookies" className="text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300 font-medium">
              Cookie Policy
            </Link>.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={acceptCookies}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Accept
          </button>
          <Link href="/legal/cookies" className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
