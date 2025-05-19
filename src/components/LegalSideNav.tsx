'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LegalSideNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  
  // Toggle sidebar visibility on small screens
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="fixed left-0 top-1/3 z-30">
      {/* Toggle button for mobile */}
      <button 
        onClick={toggleVisibility}
        className="md:hidden bg-blue-600 text-white p-2 rounded-r-lg shadow-lg"
        aria-label="Toggle legal navigation"
      >
        {isVisible ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        )}
      </button>
      
      {/* Side navigation */}
      <div className={`${isVisible ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 bg-white dark:bg-gray-800 shadow-xl rounded-r-lg overflow-hidden`}>
        <div className="p-4">
          <nav className="flex flex-col space-y-1">
            <Link 
              href="/legal/privacy" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/legal/privacy' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Privacy Policy
            </Link>
            <Link 
              href="/legal/terms" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/legal/terms' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Terms of Service
            </Link>
            <Link 
              href="/legal/cookies" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/legal/cookies' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Cookie Policy
            </Link>
            <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>
            <Link 
              href="/about" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/about' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/contact' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
