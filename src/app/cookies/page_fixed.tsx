'use client';

import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Using global navigation from Layout - removed duplicate header */}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300">
              Last Updated: May 19, 2025
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. What are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. How We Use Cookies</h2>
            <p>
              Bulk Video Cropper uses cookies to enhance your experience on our platform, remember your preferences, and understand how you interact with our video processing services. We use cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To keep you logged in during your session</li>
              <li>To remember your video processing preferences</li>
              <li>To maintain your selected export settings</li>
              <li>To track your subscription usage and limits</li>
              <li>To analyze how our video processing tools are used</li>
              <li>To personalize your experience based on past usage</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mt-6 mb-3">3.1 Essential Cookies</h3>
            <p>
              Essential cookies are necessary for the Bulk Video Cropper application to function properly. They enable core features like user authentication, session management, and video processing functionality.
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cookie</th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Purpose</th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Duration</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">session_id</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Maintains your session across page loads</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Session</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">auth_token</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Authenticates you with our video processing servers</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">30 days</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">csrf_token</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Protects against Cross-Site Request Forgery attacks</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-medium text-gray-900 dark:text-white mt-6 mb-3">3.2 Functional Cookies</h3>
            <p>
              Functional cookies enhance your experience with Bulk Video Cropper by remembering your preferences and settings for video editing and processing.
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cookie</th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Purpose</th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Duration</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">video_preferences</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Remembers your preferred crop dimensions and aspect ratios</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">theme</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Remembers your theme preference (light/dark)</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">export_settings</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Stores your preferred video export settings</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-medium text-gray-900 dark:text-white mt-6 mb-3">3.3 Analytical Cookies</h3>
            <p>
              Analytical cookies help us understand how users interact with Bulk Video Cropper. They provide insights into video processing patterns, tool usage, and performance metrics to help us improve the application.
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cookie</th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Purpose</th>
                    <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Duration</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">_ga</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Used by Google Analytics to distinguish users</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">2 years</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">_gid</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Used by Google Analytics to distinguish users for 24 hours</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">24 hours</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">video_processing_metrics</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Tracks performance metrics for video processing operations</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">90 days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Managing Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their settings. You can usually find these settings in the "Options" or "Preferences" menu of your browser. You can:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Delete all cookies from your browser</li>
              <li>Block all cookies by default</li>
              <li>Allow only certain sites to set cookies</li>
              <li>Browse in private or incognito mode to delete cookies when you close your browser</li>
            </ul>
            <p className="mt-4">
              Please note that if you choose to block or delete cookies, some features of Bulk Video Cropper may not function properly. In particular, you may not be able to stay logged in or save your video processing preferences.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">5. Updates to this Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this policy periodically to stay informed about our use of cookies.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">6. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> privacy@bulkvidcropper.com<br />
              <strong>Address:</strong> 123 Video Lane, San Francisco, CA 94103, USA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
