'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
              <Link href="/privacy" className="text-teal-600 dark:text-teal-500 font-medium">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500">
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300">
              Last Updated: May 17, 2025
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to Bulk Video Cropper ("we," "our," or "us"). We understand that your video content and personal information are important to you. This Privacy Policy explains how we collect, use, and protect your information when you use our video editing platform and related services (collectively, the "Services").
            </p>
            <p>
              Our AI-powered video cropping system processes your videos to optimize them for different social media platforms while maintaining their visual integrity. We take your privacy seriously and are committed to transparent data practices.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mt-6 mb-3">2.1 Information You Provide</h3>
            <p>
              We collect information you provide directly to us when you:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create an account or user profile</li>
              <li>Upload videos for processing</li>
              <li>Configure AI cropping preferences</li>
              <li>Subscribe to our premium plans</li>
              <li>Contact our support team</li>
              <li>Provide feedback or suggestions</li>
            </ul>
            <p>
              This information may include your name, email address, payment details, and preferences for video processing settings.
            </p>

            <h3 className="text-xl font-medium text-gray-900 dark:text-white mt-6 mb-3">2.2 Video Content</h3>
            <p>
              When you upload videos to our Services, we collect and process the video content itself. We do not use the content of your videos for any purpose other than to provide you with the Services you requested.
            </p>

            <h3 className="text-xl font-medium text-gray-900 dark:text-white mt-6 mb-3">2.3 Usage Information</h3>
            <p>
              We automatically collect certain information about your use of the Services, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Video processing statistics (number of videos processed, preferred aspect ratios)</li>
              <li>Performance metrics (processing time, success rates)</li>
              <li>Usage patterns (preferred platforms, frequency of use)</li>
              <li>Technical information (browser type, device specifications)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and optimize your video content</li>
              <li>Improve our AI cropping algorithms</li>
              <li>Enhance video processing performance</li>
              <li>Provide personalized support and recommendations</li>
              <li>Analyze usage patterns to improve our platform</li>
              <li>Protect against unauthorized access and misuse</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Sharing Your Information</h2>
            <p>
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With service providers who perform services on our behalf</li>
              <li>To comply with legal obligations</li>
              <li>To protect and defend our rights and property</li>
              <li>With your consent or at your direction</li>
              <li>In connection with a business transfer (such as a merger or acquisition)</li>
            </ul>
            <p>
              We do not sell your personal information to third parties.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your information against unauthorized or unlawful processing, accidental loss, destruction, or damage. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">6. Your Rights and Choices</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Accessing your personal information</li>
              <li>Correcting inaccurate information</li>
              <li>Deleting your information</li>
              <li>Restricting or objecting to processing</li>
              <li>Data portability</li>
              <li>Withdrawing consent</li>
            </ul>
            <p>
              To exercise these rights, please contact us at privacy@bulkvidcropper.com.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">7. Cookies and Similar Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to collect information about your browsing activities and to distinguish you from other users of our Services. This helps us provide you with a good experience when you browse our Services and also allows us to improve our Services. For more information, please see our Cookie Policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">8. Children's Privacy</h2>
            <p>
              Our Services are not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn that we have collected personal information from a child under 13, we will promptly delete that information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">9. International Data Transfers</h2>
            <p>
              Your information may be transferred to, and processed in, countries other than the country in which you reside. These countries may have data protection laws that are different from the laws of your country. We have taken appropriate safeguards to require that your personal information will remain protected in accordance with this Privacy Policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or by posting a notice on our website prior to the change becoming effective. We encourage you to periodically review this page for the latest information on our privacy practices.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">11. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
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
