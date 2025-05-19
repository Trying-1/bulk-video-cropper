'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import LegalSideNav from '@/components/LegalSideNav';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Floating Side Navigation */}
      <LegalSideNav />
      
      {/* Using the global navigation from Layout - removed duplicate header/navbar */}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-500 to-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Bulk Video Cropper</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Transforming the way creators prepare videos for social media platforms
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-2xl text-gray-800 dark:text-gray-100 mb-6">
                Bulk Video Cropper was born from a simple realization: social media creators spend too much time reformatting videos for different platforms. What started as a personal project to solve this problem quickly grew into a comprehensive solution used by content creators worldwide.
              </p>
              <p className="text-2xl text-gray-800 dark:text-gray-100 mb-6">
                Founded in 2022, we've grown from a small team with a big idea to a platform that processes thousands of videos daily. Our journey has been defined by a relentless focus on making advanced video editing accessible to everyone, regardless of technical expertise.
              </p>
              <p className="text-2xl text-gray-800 dark:text-gray-100 mb-6">
                Today, Bulk Video Cropper combines powerful AI-driven video analysis with intuitive batch processing capabilities, allowing creators to transform their content for any platform in just a few clicks.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-teal-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-8 text-center">Our Mission</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-2xl text-gray-800 dark:text-gray-100 mb-6">
                Our mission is to revolutionize video editing by combining cutting-edge AI with intuitive design. We believe that technology should work for creators, not against them.
              </p>
              <p className="text-2xl text-gray-800 dark:text-gray-100 mb-6">
                We're dedicated to creating tools that not only save time but also enhance creativity. With Bulk Video Cropper, creators can focus on what matters most - their content - while we handle the technical details.
              </p>
              <p className="text-2xl text-gray-800 dark:text-gray-100 mb-6">
                Our platform is built by a passionate team of engineers, designers, and content creators who understand the challenges of modern video production. We're committed to continuous improvement and innovation to serve our growing community of users worldwide.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Our Values</h2>
            <p className="text-3xl text-gray-800 dark:text-gray-200 max-w-3xl mx-auto">
              The principles that guide our product development and company culture.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-100 dark:border-gray-700"
            >
              <div className="text-teal-600 dark:text-teal-400 mb-4">
                <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">Innovation</h3>
              <p className="text-2xl text-gray-800 dark:text-gray-200">
                We constantly push the boundaries of what's possible in video editing technology.
              </p>
            </motion.div>

            {/* Value 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-100 dark:border-gray-700"
            >
              <div className="text-teal-600 dark:text-teal-400 mb-4">
                <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">Community</h3>
              <p className="text-2xl text-gray-800 dark:text-gray-200">
                We're building tools for creators, guided by creators, to foster a supportive community.
              </p>
            </motion.div>

            {/* Value 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-100 dark:border-gray-700"
            >
              <div className="text-teal-600 dark:text-teal-400 mb-4">
                <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">Simplicity</h3>
              <p className="text-2xl text-gray-800 dark:text-gray-200">
                We believe powerful technology should be simple to use, with intuitive interfaces.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-teal-600 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to transform your video workflow?</h2>
            <p className="text-2xl max-w-2xl mx-auto mb-8">
              Join thousands of creators who are saving time and publishing better content across all platforms.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/auth" 
                className="px-8 py-3 bg-white text-teal-700 font-medium rounded-md shadow-sm hover:bg-gray-100 transition-colors"
              >
                Get Started Free
              </Link>
              <Link 
                href="/editor" 
                className="px-8 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors"
              >
                Try Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

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
                <span className="font-bold text-2xl text-gray-900 dark:text-white">Bulk Video Cropper</span>
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
