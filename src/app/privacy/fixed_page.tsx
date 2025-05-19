'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Using global navigation from Layout - removed duplicate header */}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300">
              Last Updated: May 19, 2025
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to Bulk Video Cropper. We understand that your video content and personal information are important to you. This Privacy Policy explains how we collect, use, and protect your information when you use our video editing platform and related services.
            </p>
            <p>
              Our AI-powered video cropping system processes your videos to optimize them for different social media platforms while maintaining their visual integrity. We take your privacy seriously and are committed to transparent data practices.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mt-6 mb-3">2.1 Information You Provide</h3>
            <p>
              We collect information you provide directly to us when you use our Bulk Video Cropper Services, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> When you register for an account, we collect your name, email address, password, and profile information to create and manage your user account.</li>
              <li><strong>Payment Information:</strong> If you subscribe to our premium or pro plans, we collect payment information through our secure payment processor (Stripe), which may include your credit card details, billing address, and transaction history.</li>
              <li><strong>Video Content:</strong> We collect the videos you upload for processing, along with any editing preferences or settings you choose for each video.</li>
              <li><strong>Usage Statistics:</strong> We track your video processing usage, including the number of videos processed, processing time, and features used to manage your subscription limits.</li>
              <li><strong>Communications:</strong> We collect information you provide when you contact us for customer support or communicate with us in any other way.</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 dark:text-white mt-6 mb-3">2.2 Video Content and Processing</h3>
            <p>
              When you upload videos to our platform, we process this content using our AI-based algorithms to identify important visual elements and optimize cropping. Here&apos;s specifically how we handle your video content:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Temporary Storage:</strong> Your original videos are stored temporarily on our secure servers only during the processing period. Free plan users&apos; videos are automatically deleted 24 hours after processing is complete.</li>
              <li><strong>Premium Storage:</strong> Premium and Pro users can store processed videos in their account storage for up to 30 days (Premium) or 90 days (Pro).</li>
              <li><strong>AI Processing:</strong> Our proprietary AI algorithms analyze visual content, motion, focal points, and subjects to determine optimal crop boundaries. This processing is automated and does not involve human review unless specifically requested for support issues.</li>
              <li><strong>No Content Ownership:</strong> We do not claim ownership of your video content. You retain all rights to your original and processed videos.</li>
              <li><strong>Content Security:</strong> All uploaded videos are stored with encryption at rest and processed in secure, isolated environments.</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-900 dark:text-white mt-6 mb-3">2.3 Usage Information</h3>
            <p>
              When you use our Bulk Video Cropper service, we automatically collect certain information about your device and usage, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Device Information:</strong> We collect information about your device, including IP address, browser type, operating system, and device identifiers to optimize our service for your specific device configuration.</li>
              <li><strong>Video Processing Metrics:</strong> We collect data about video processing operations, including file sizes, processing duration, resolution changes, and AI cropping decisions to improve our algorithms and maintain quality.</li>
              <li><strong>Subscription Usage:</strong> We track the number of videos processed, total processing time, and feature utilization to enforce subscription plan limits and provide usage statistics in your dashboard.</li>
              <li><strong>Performance Data:</strong> We monitor system performance during video processing to identify and resolve bottlenecks, optimizing the service for future use.</li>
              <li><strong>Cookies and Similar Technologies:</strong> We use cookies and similar technologies to maintain your session, remember your preferences, and provide a personalized experience.</li>
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
            <p className="mt-4">
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
              <li>Deleting your personal information</li>
              <li>Objecting to certain processing activities</li>
              <li>Withdrawing consent</li>
              <li>Data portability</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us using the information provided in the &quot;Contact Us&quot; section below.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">7. Children&apos;s Privacy</h2>
            <p>
              Our Services are not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected personal information from a child under 13, please contact us so we can delete this information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">8. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or by posting a notice on our website. Your continued use of our Services after such notice constitutes your acceptance of the changes.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
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
