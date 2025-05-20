'use client';

import React from 'react';

interface AnalyticsData {
  total: number;
  pending: number;
  approved: number;
  featured: number;
  conversionRate: number;
  averageLength: number;
}

interface AdminAnalyticsProps {
  analytics: AnalyticsData;
}

export default function AdminAnalytics({ analytics }: AdminAnalyticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Summary Cards */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Testimonial Stats</p>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.total}</span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Total</span>
            </div>
          </div>
          <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900">
            <svg className="w-6 h-6 text-teal-600 dark:text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <div className="text-center">
            <span className="text-sm font-medium text-yellow-500">{analytics.pending}</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-green-500">{analytics.approved}</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">Approved</p>
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-purple-500">{analytics.featured}</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">Featured</p>
          </div>
        </div>
      </div>
      
      {/* Performance Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Feature Conversion</p>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.conversionRate}%</span>
            </div>
          </div>
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${analytics.conversionRate}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Percentage of approved testimonials that are featured
          </p>
        </div>
      </div>
      
      {/* Content Quality */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Content Quality</p>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.averageLength}</span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">avg. chars</span>
            </div>
          </div>
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
            <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Short</span>
            <span>Detailed</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            {/* Assuming 500 is max length */}
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(100, (analytics.averageLength / 500) * 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Average testimonial length (out of 500 chars max)
          </p>
        </div>
      </div>
    </div>
  );
}
