'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import LegalSideNav from '@/components/LegalSideNav';
import { APP_EMAILS } from "@/config/branding";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Floating Side Navigation */}
      <LegalSideNav />
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Contact Us</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading || success}
                    className="w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sending...' : success ? 'Message Sent!' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email Us</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Have a question or need support? Send us an email and we'll get back to you as soon as possible.
                  </p>
                  <div className="mt-4">
                    <a
                      href={`mailto:${APP_EMAILS.support}`}
                      className="text-teal-500 hover:text-teal-600 inline-flex items-center"
                    >
                      <span className="mr-1">{APP_EMAILS.support}</span>
                    </a>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Business Inquiries</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    For partnership opportunities, API integrations, or business-related inquiries.
                  </p>
                  <div className="mt-4">
                    <a
                      href={`mailto:${APP_EMAILS.business}`}
                      className="text-teal-500 hover:text-teal-600 inline-flex items-center"
                    >
                      <span className="mr-1">{APP_EMAILS.business}</span>
                    </a>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Social Media</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Follow us on social media for the latest updates and news.
                  </p>
                  <div className="mt-4 flex space-x-4">
                    <a
                      href="https://twitter.com/bulkvidcropper"
                      className="text-gray-400 hover:text-gray-500"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                      </svg>
                    </a>
                    <a
                      href="https://linkedin.com/company/bulkvidcropper"
                      className="text-gray-400 hover:text-gray-500"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 6a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 9a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 6a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0" />
                      </svg>
                    </a>
                    <a
                      href="https://instagram.com/bulkvidcropper"
                      className="text-gray-400 hover:text-gray-500"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 21.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Our Office</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    123 Tech Street<br />
                    San Francisco, CA 94105<br />
                    United States
                  </p>
                </div>
              </div>
            </div>
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
                  <Link href="/legal/privacy" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-500 text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terms" className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-500 text-sm">
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
