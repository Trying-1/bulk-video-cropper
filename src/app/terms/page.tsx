'use client';

import Link from 'next/link';

export default function TermsOfServicePage() {
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
              <Link href="/terms" className="text-teal-600 dark:text-teal-500 font-medium">
                Terms
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300">
              Last Updated: May 17, 2025
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Bulk Video Cropper ("we," "our," or "us"), you agree to comply with and be bound by these Terms of Service ("Terms"). If you do not agree with these Terms, you may not access or use our Services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. Services Description</h2>
            <p>
              Bulk Video Cropper provides an AI-powered video editing platform that enables users to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Upload and process multiple videos simultaneously</li>
              <li>Use intelligent AI cropping to preserve key content</li>
              <li>Optimize videos for various social media platforms</li>
              <li>Export in multiple formats and resolutions</li>
              <li>Access advanced video processing features</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. User Account</h2>
            <p>
              To use certain features of our Services, you must create an account and provide accurate information. You are responsible for maintaining the confidentiality of your account credentials.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. User Content</h2>
            <p>
              You retain all rights to any content you upload to our Services. By uploading content, you grant us a non-exclusive, worldwide, royalty-free license to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and optimize your videos using our AI algorithms</li>
              <li>Store and cache your videos for processing</li>
              <li>Display thumbnails and previews of your videos</li>
              <li>Provide technical support and troubleshooting</li>
            </ul>
            <p>
              We do not claim any ownership of your video content, and you are solely responsible for the content you upload.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">5. Prohibited Activities</h2>
            <p>
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use our Services for any illegal or unauthorized purposes</li>
              <li>Upload content that violates any intellectual property rights</li>
              <li>Attempt to interfere with or disrupt our Services</li>
              <li>Impersonate any person or entity</li>
              <li>Use automated means to access our Services</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">6. Payment Terms</h2>
            <p>
              Our subscription plans include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Free Plan: Basic video processing with limited features</li>
              <li>Premium Plan: Advanced AI features and higher processing limits</li>
              <li>Pro Plan: Enterprise-level features and priority support</li>
            </ul>
            <p>
              All payments are processed through secure payment providers. Our refund policy is available on our website.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">7. Intellectual Property</h2>
            <p>
              Our proprietary AI algorithms and video processing technology are protected by copyright and other intellectual property laws. You may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Reverse engineer or decompile our software</li>
              <li>Modify or create derivative works</li>
              <li>Distribute or sublicense our technology</li>
              <li>Use our technology for unauthorized purposes</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">8. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your access to our Services at any time, with or without cause, and without prior notice.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">9. Disclaimer of Warranties</h2>
            <p>
              Our Services are provided "as is" and "as available." We make no warranties, express or implied, regarding the Services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">10. Limitation of Liability</h2>
            <p>
              In no event shall we be liable for any damages arising from the use of our Services, including but not limited to direct, indirect, incidental, or consequential damages.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Your continued use of our Services after any changes constitutes your acceptance of the modified Terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">12. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              Email: support@bulkvidcropper.com<br />
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
                  <Link href="/cookies" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-500 text-sm">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
              © {new Date().getFullYear()} Bulk Video Cropper. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
