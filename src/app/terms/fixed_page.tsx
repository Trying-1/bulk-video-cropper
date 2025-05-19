'use client';

import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Using global navigation from Layout - removed duplicate header */}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300">
              Last Updated: May 19, 2025
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Bulk Video Cropper (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you agree to comply with and be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree with these Terms, you may not access or use our Services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. Services Description</h2>
            <p>
              Bulk Video Cropper provides an AI-powered video editing platform that enables users to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Upload and process multiple videos simultaneously</li>
              <li>Use intelligent AI cropping to preserve key content</li>
              <li>Create optimized videos for various social media formats</li>
              <li>Export and download processed videos</li>
              <li>Access free and premium subscription features</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. Account Registration</h2>
            <p>
              To use certain features of our Services, you may need to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            <p>
              You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Subscription Plans and Payments</h2>
            <p>
              Bulk Video Cropper offers both free and paid subscription plans:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Free Plan:</strong> Limited access to basic features with processing limits (5 videos per month, 720p quality with watermark)</li>
              <li><strong>Premium Plan:</strong> Enhanced features with higher processing limits (50 videos per month, 1080p HD output, no watermark)</li>
              <li><strong>Pro Plan:</strong> Full access to all features with maximum processing capacity (unlimited videos, 4K output quality, batch processing)</li>
            </ul>
            <p className="mt-4">
              By subscribing to a paid plan, you agree to pay all fees associated with your selected subscription plan. All payments are processed securely through our third-party payment processors.
            </p>
            <p>
              Subscription fees are billed in advance on a monthly basis. You may cancel your subscription at any time, but no refunds will be provided for any unused portion of the current billing period.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">5. User Content</h2>
            <p>
              Our Services allow you to upload, store, and process video content (&quot;User Content&quot;). You retain all rights to your User Content, but grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your User Content solely for the purpose of providing the Services to you.
            </p>
            <p>
              You represent and warrant that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You own or have obtained all necessary rights to the User Content you upload</li>
              <li>Your User Content does not violate any third-party rights, including intellectual property rights and privacy rights</li>
              <li>Your User Content complies with these Terms and all applicable laws and regulations</li>
            </ul>
            <p className="mt-4">
              We do not claim ownership of your User Content, and your content is automatically deleted from our servers after processing, unless you specifically save it to your account storage. We reserve the right to remove any User Content that violates these Terms or that we find objectionable.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">6. Intellectual Property</h2>
            <p>
              The Bulk Video Cropper platform, including its software, algorithms, design, and functionality, is protected by copyright, trademark, and other intellectual property laws. Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Services.
            </p>
            <p>
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify, adapt, or hack the Services or modify any other website to falsely imply an association with Bulk Video Cropper</li>
              <li>Reverse engineer, decompile, or disassemble the Services</li>
              <li>Create derivative works based on the Services</li>
              <li>Use the Services for any illegal or unauthorized purpose</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">7. AI Technology and Processing</h2>
            <p>
              Bulk Video Cropper uses AI algorithms to automatically crop and optimize videos. While our AI technology is designed to preserve key visual elements and content, we cannot guarantee that all important content will be preserved in every video processing case. Results may vary based on the nature and quality of the original video content.
            </p>
            <p>
              By using our Services, you acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>AI processing may not perfectly preserve all content you consider important</li>
              <li>You should review all processed videos before distribution or use</li>
              <li>We are not liable for any dissatisfaction with the AI processing results</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">8. Privacy and Data Security</h2>
            <p>
              Your privacy is important to us. Our <Link href="/privacy" className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">Privacy Policy</Link> explains how we collect, use, and protect your personal information and video content when you use our Services. By using Bulk Video Cropper, you consent to our data practices as described in our Privacy Policy.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, Bulk Video Cropper, its affiliates, and their respective officers, employees, agents, partners, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your access to or use of or inability to access or use the Services</li>
              <li>Any conduct or content of any third party on the Services</li>
              <li>Any content obtained from the Services</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              <li>Loss or damage to your video content during processing or transmission</li>
              <li>AI processing results that do not meet your expectations</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">10. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Bulk Video Cropper, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable attorneys&apos; fees and costs, arising out of or in any way connected with your access to or use of the Services or your violation of these Terms.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">11. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Services immediately, without prior notice or liability, for any reason, including, without limitation, if you breach these Terms. Upon termination, your right to use the Services will immediately cease.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">12. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If we make material changes to these Terms, we will notify you by email or by posting a notice on our website. Your continued use of the Services after any such changes constitutes your acceptance of the new Terms.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">13. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any dispute arising from or relating to the subject matter of these Terms shall be resolved exclusively in the courts located in the United States.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">14. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> support@bulkvidcropper.com<br />
              <strong>Address:</strong> 123 Video Lane, San Francisco, CA 94103, USA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
