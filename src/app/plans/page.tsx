'use client';

import Link from 'next/link';

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center max-w-xl mx-auto px-4 py-12">
        <div className="mb-8 animate-bounce inline-block">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Coming Soon
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          We're working on our subscription plans and will launch them soon.
        </p>
        <p className="text-md text-gray-500 dark:text-gray-400 mb-8">
          In the meantime, you can enjoy all the free features of our video cropping tool.
        </p>
        <Link 
          href="/editor" 
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Try Free Version
        </Link>
      </div>
    </div>
  );
}
