'use client';

import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">Bulk Video Cropper</span>
            </Link>
            <nav className="flex space-x-4">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500">
                Home
              </Link>
              <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500">
                About
              </Link>
              <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500">
                Terms
              </Link>
              <Link href="/cookies" className="text-teal-600 dark:text-teal-500 font-medium">
                Cookie Policy
              </Link>
              <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300">
              Last Updated: May 17, 2025
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. What are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit websites. They help us remember your preferences and provide a better browsing experience.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mt-6 mb-3">2.1 Essential Cookies</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Authentication cookies for user sessions</li>
              <li>Security cookies to protect your account</li>
              <li>Preferences cookies to remember your settings</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 dark:text-white mt-6 mb-3">2.2 Analytics Cookies</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Google Analytics to understand how users interact with our site</li>
              <li>Usage tracking to improve our services</li>
              <li>Performance monitoring to enhance site speed</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 dark:text-white mt-6 mb-3">2.3 Marketing Cookies</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Advertising cookies for personalized content</li>
              <li>Social media cookies for sharing features</li>
              <li>Retargeting cookies for relevant ads</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. How to Control Cookies</h2>
            <p>
              You can control cookies using your browser settings:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Chrome: Settings > Privacy and Security > Cookies and other site data</li>
              <li>Firefox: Options > Privacy & Security > Cookies and Site Data</li>
              <li>Safari: Preferences > Privacy > Manage Website Data</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Cookie Consent</h2>
            <p>
              By using our website, you consent to our use of cookies as described in this policy. You can withdraw your consent at any time by changing your browser settings.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">5. Changes to This Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. Any changes will be posted on this page and take effect immediately upon posting.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">6. Contact Us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact us at:
            </p>
            <p className="mt-2">
              Email: privacy@bulkvidcropper.com<br />
              Address: 123 Tech Street, San Francisco, CA 94105, USA
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-white">Bulk Video Cropper</span>
              </Link>
              <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
                Intelligent video cropping for content creators and marketers.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/features" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-500 text-sm">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/#pricing" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-500 text-sm">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/editor" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-500 text-sm">
                    Try Demo
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-500 text-sm">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-500 text-sm">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-500 text-sm">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-500 text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-500 text-sm">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-teal-600 dark:text-teal-500 hover:text-teal-700 dark:hover:text-teal-400 text-sm">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
