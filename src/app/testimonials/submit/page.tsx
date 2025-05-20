'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { APP_IDENTITY } from '@/config/branding';
import { useAuth } from '@/contexts/AuthContext';
import { createTestimonial } from '@/services/testimonialService';

export default function SubmitTestimonialPage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    role: '',
    message: '',
    email: '',
    consent: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill the form with user data if they're logged in
  useEffect(() => {
    if (userProfile) {
      setTestimonialForm(prev => ({
        ...prev,
        name: userProfile.displayName || '',
        email: userProfile.email || ''
      }));
    }
  }, [userProfile]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      // Submit the testimonial to the database
      await createTestimonial(
        testimonialForm.name,
        testimonialForm.role || undefined, // Send undefined if empty string
        testimonialForm.message,
        testimonialForm.email,
        user?.uid // Include user ID if logged in
      );
      
      setSubmitSuccess(true);
      console.log('Testimonial submitted successfully');
    } catch (err) {
      console.error('Error submitting testimonial:', err);
      setError('There was an error submitting your testimonial. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <Link 
            href="/#testimonials" 
            className="inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Testimonials
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Share Your Experience
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Tell us how {APP_IDENTITY.name} has helped your video editing workflow.
          </p>
        </div>
        
        {submitSuccess ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
            <div className="h-20 w-20 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="h-10 w-10 text-teal-600 dark:text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Thank You!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your testimonial has been submitted successfully and will be reviewed by our team before being published.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  setTestimonialForm({
                    name: userProfile?.displayName || '',
                    role: '',
                    message: '',
                    email: userProfile?.email || '',
                    consent: false
                  });
                }}
                className="py-2 px-4 bg-teal-100 text-teal-700 hover:bg-teal-200 dark:bg-teal-800 dark:text-teal-200 dark:hover:bg-teal-700 rounded-lg font-medium transition-colors"
              >
                Submit Another Testimonial
              </button>
              
              <Link 
                href="/" 
                className="py-2 px-4 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                <p className="font-medium flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {error}
                </p>
              </div>
            )}
            
            {user ? (
              <div className="mb-6 p-4 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-lg">
                <p className="text-teal-700 dark:text-teal-300 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Logged in as <span className="font-medium ml-1">{userProfile?.email}</span>
                </p>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-blue-700 dark:text-blue-300">
                  <span className="font-medium">Tip:</span> Sign in to your account to submit verified testimonials and track your submissions.
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="E.g., John Smith"
                    value={testimonialForm.name}
                    onChange={(e) => setTestimonialForm({...testimonialForm, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Role <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="role"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="E.g., Content Creator, Social Media Manager"
                    value={testimonialForm.role}
                    onChange={(e) => setTestimonialForm({...testimonialForm, role: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                {user ? (
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      required
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white cursor-not-allowed"
                      value={testimonialForm.email}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-teal-600 dark:text-teal-400 text-sm">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="your.email@example.com"
                      value={testimonialForm.email}
                      onChange={(e) => setTestimonialForm({...testimonialForm, email: e.target.value})}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      We'll never share your email. It's only used to verify your testimonial.
                    </p>
                  </>
                )}
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Testimonial <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {testimonialForm.message.length}/500 characters
                  </span>
                </div>
                <textarea
                  id="message"
                  required
                  maxLength={500}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  placeholder="Share how our tool has helped improve your video editing workflow..."
                  value={testimonialForm.message}
                  onChange={(e) => setTestimonialForm({...testimonialForm, message: e.target.value})}
                ></textarea>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="consent"
                    type="checkbox"
                    required
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-teal-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-teal-600 dark:ring-offset-gray-800"
                    checked={testimonialForm.consent}
                    onChange={(e) => setTestimonialForm({...testimonialForm, consent: e.target.checked})}
                  />
                </div>
                <label htmlFor="consent" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  I consent to the publication of my testimonial and name on the {APP_IDENTITY.name} website. <span className="text-red-500">*</span>
                </label>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-lg font-medium transition-colors flex justify-center"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : 'Submit Testimonial'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Have questions? <Link href="/contact" className="text-teal-600 dark:text-teal-400 hover:underline">Contact our support team</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
