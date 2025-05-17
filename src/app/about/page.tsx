'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPage() {
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
              <Link href="/about" className="text-teal-600 dark:text-teal-500 font-medium">
                About
              </Link>
              <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500">
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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
            <div className="prose prose-lg dark:prose-invert">
              <p>
                Bulk Video Cropper was created in 2024 by a team of video enthusiasts who recognized the need for smarter video editing tools. Our platform uses advanced AI algorithms to automatically detect and preserve the most important parts of your videos while cropping them to perfect dimensions for any social media platform.
              </p>
              <p>
                Unlike traditional video editors, Bulk Video Cropper understands the context of your content. Our intelligent cropping system analyzes faces, movement, and visual importance to ensure that no key moments are lost when adjusting video dimensions.
              </p>
              <p>
                Today, Bulk Video Cropper is trusted by over 50,000 creators across the globe, processing millions of videos monthly. Our users range from solo content creators to large media organizations, all benefiting from our time-saving automation and intelligent editing capabilities.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
            <div className="prose prose-lg dark:prose-invert">
              <p>
                Our mission is to revolutionize video editing by combining cutting-edge AI with intuitive design. We believe that technology should work for creators, not against them.
              </p>
              <p>
                We're dedicated to creating tools that not only save time but also enhance creativity. With Bulk Video Cropper, creators can focus on what matters most - their content - while we handle the technical details.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-4 overflow-hidden">
                  <img 
                    src="https://ui-avatars.com/api/?name=Alex+Johnson&background=0D9488&color=fff" 
                    alt="Alex Johnson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Alex Johnson</h3>
                <p className="text-teal-600 dark:text-teal-400 mb-2">Founder & CEO</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Former content creator with a passion for simplifying video workflows.
                </p>
              </div>

              {/* Team Member 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-4 overflow-hidden">
                  <img 
                    src="https://ui-avatars.com/api/?name=Sarah+Chen&background=0D9488&color=fff" 
                    alt="Sarah Chen" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Sarah Chen</h3>
                <p className="text-teal-600 dark:text-teal-400 mb-2">CTO</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  AI specialist with expertise in computer vision and video processing.
                </p>
              </div>

              {/* Team Member 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-4 overflow-hidden">
                  <img 
                    src="https://ui-avatars.com/api/?name=Miguel+Rodriguez&background=0D9488&color=fff" 
                    alt="Miguel Rodriguez" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Miguel Rodriguez</h3>
                <p className="text-teal-600 dark:text-teal-400 mb-2">Head of Product</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  UX designer focused on creating intuitive video editing experiences.
                </p>
              </div>
            </div>
          </motion.div>
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
            <h2 className="text-3xl font-bold mb-6">Ready to transform your video workflow?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
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
