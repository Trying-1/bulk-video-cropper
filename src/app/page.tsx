"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserSessionCookie, updateAppStateCookie } from '@/utils/cookies';
import { useComingSoon } from "@/components/ComingSoonModal";
import { APP_IDENTITY, SOCIAL_MEDIA, CONTACT_INFO, LEGAL_DOCS, PRODUCT } from "@/config/branding";
import { getApprovedTestimonials, createTestimonial, updateTestimonialStatus, Testimonial } from '@/services/testimonialService';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const { user, loading } = useAuth();
  const { showComingSoon, ComingSoonModal } = useComingSoon();
  
  useEffect(() => {
    // Check cookies first for faster initial render
    const sessionCookie = getUserSessionCookie();
    if (sessionCookie) {
      setIsAuthenticated(true);
    }
    
    // Track that user visited landing page
    updateAppStateCookie({
      lastVisitedPage: '/'
    });
    
    // Fetch testimonials from the database
    const fetchTestimonials = async () => {
      try {
        setLoadingTestimonials(true);
        console.log('Fetching testimonials for landing page...');
        
        // Get only featured testimonials from the database
        let featuredTestimonials = await getApprovedTestimonials(true, 3);
        console.log('Featured testimonials fetched from DB:', featuredTestimonials);
        
        // Use only what's in the database, no fallbacks
        let fetchedTestimonials = featuredTestimonials;
        
        // If no testimonials found, show nothing
        if (!fetchedTestimonials || fetchedTestimonials.length === 0) {
          console.log('No testimonials found in database, testimonial section will be empty');
          fetchedTestimonials = [];
        }
        
        console.log('Final testimonials to display:', fetchedTestimonials);
        console.log('Testimonials count:', fetchedTestimonials.length);
        
        setTestimonials(fetchedTestimonials);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        
        // Fallback to mock data in case of error
        console.log('Error occurred, using mock testimonial data');
        const mockTestimonials = [
          {
            id: 'mock-1',
            name: 'Sarah K.',
            role: 'Content Creator',
            message: 'This tool has saved me hours of work. Now I can crop multiple videos for Instagram, TikTok, and YouTube Shorts all at once!',
            email: 'demo@example.com',
            approved: true,
            featured: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'mock-2',
            name: 'Michael T.',
            role: 'Social Media Manager',
            message: 'The batch processing feature is a game-changer for our agency. We can now deliver content for multiple platforms much faster.',
            email: 'demo@example.com',
            approved: true,
            featured: false,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        setTestimonials(mockTestimonials);
      } finally {
        setLoadingTestimonials(false);
      }
    };
    
    fetchTestimonials();
    setIsLoaded(true);
  }, []);
  
  // Update from actual auth state once it's loaded
  useEffect(() => {
    if (!loading) {
      setIsAuthenticated(!!user);
    }
  }, [user, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden relative">
      {/* Coming Soon Modal Component - Only show when triggered */}
      <ComingSoonModal />
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-teal-300 to-teal-400 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-br from-orange-300 to-pink-400 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="hidden md:block absolute -top-10 -right-10 w-28 h-28 bg-teal-500 opacity-30 rounded-lg transform rotate-12"></div>
        <div className="hidden md:block absolute top-1/4 -left-10 w-20 h-20 bg-orange-500 opacity-30 rounded-lg transform -rotate-12"></div>
      </div>
      
      {/* Removed duplicate Navbar - using global navigation from Layout */}
      <main className="relative z-10">
        {/* 1. Hero Section */}
        {/* Replace main hero container with neumorphic card */}
        <section className="relative py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center bg-white rounded-2xl shadow-neumorph p-10 mb-12">
              {/* Animated badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white text-sm font-medium mb-6 animate-pulse">
                <span className="flex h-2 w-2 relative mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                New: Batch processing now available!
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-400 dark:to-blue-500 mb-6 leading-tight font-heading">
                {APP_IDENTITY.name}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto font-body">
                Effortlessly crop multiple videos simultaneously for all social media platforms.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/editor" 
                  className="px-8 py-4 bg-white text-teal-600 rounded-xl font-medium text-lg shadow-neumorph inline-flex items-center justify-center transition-all duration-300 w-full sm:w-auto hover:shadow-neumorph-inset hover:bg-teal-50 focus:outline-none"
                >
                  Try It Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link 
                  href="#how-it-works" 
                  className="px-8 py-4 bg-white text-text-primary border border-gray-200 rounded-xl font-medium text-lg shadow-neumorph inline-flex items-center justify-center transition-all duration-300 w-full sm:w-auto hover:shadow-neumorph-inset hover:bg-gray-50 focus:outline-none"
                >
                  <span className="inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    How It Works
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. How It Works Section */}
        <section id="how-it-works" className="container mx-auto px-4 py-20 bg-white rounded-3xl my-12 shadow-neumorph">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-800 font-medium text-sm mb-4">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              How <span className="text-teal-600 dark:text-teal-400">{APP_IDENTITY.name}</span> Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-4">
              Crop multiple videos in just a few simple steps - no technical skills required.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-neumorph relative h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-md">1</div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Upload Videos</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Drag and drop multiple videos into our platform.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-12 transform -translate-y-1/2 z-10">
                <svg className="w-24 h-8" viewBox="0 0 96 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    {[...Array(8)].map((_, i) => (
                      <circle
                        key={i}
                        cx={10 + i * 10}
                        cy={12}
                        r={2}
                        fill="#14b8a6"
                        className={`animate-dot-flow`}
                        style={{ animationDelay: `${i * 0.12}s` }}
                      />
                    ))}
                    {/* Arrowhead */}
                    <polygon points="88,8 96,12 88,16" fill="#14b8a6" className="animate-dot-arrowhead" />
                  </g>
                </svg>
              </div>
            </div>
            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-neumorph relative h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-md">2</div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Manual Cropping</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Use our intuitive tools to manually crop and adjust your videos for different platforms.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-12 transform -translate-y-1/2 z-10">
                <svg className="w-24 h-8" viewBox="0 0 96 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    {[...Array(8)].map((_, i) => (
                      <circle
                        key={i}
                        cx={10 + i * 10}
                        cy={12}
                        r={2}
                        fill="#fb923c"
                        className={`animate-dot-flow`}
                        style={{ animationDelay: `${i * 0.12}s` }}
                      />
                    ))}
                    {/* Arrowhead */}
                    <polygon points="88,8 96,12 88,16" fill="#fb923c" className="animate-dot-arrowhead" />
                  </g>
                </svg>
              </div>
            </div>
            {/* Step 3 */}
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-neumorph relative h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-md">3</div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Export & Share</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Download your optimized videos and share them directly to social media.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-neumorph p-6 hover:shadow-neumorph-inset transition-shadow">
                <div className="text-teal-500 text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Batch Processing
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Process multiple videos simultaneously, saving you time and effort.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-neumorph p-6 hover:shadow-neumorph-inset transition-shadow">
                <div className="text-teal-500 text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Advanced Cropping
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Precise video cropping with multiple aspect ratios for all social media platforms.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-neumorph p-6 hover:shadow-neumorph-inset transition-shadow">
                <div className="text-teal-500 text-4xl mb-4">🔄</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Custom Format Options
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Export videos in various formats optimized for different platforms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Testimonials Section */}
        <section id="testimonials" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
              What Our Users Say
            </h2>
            {loadingTestimonials ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-neumorph animate-pulse">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : testimonials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => {
                  // Generate a color based on the first letter of the name
                  const colors = [
                    'bg-teal-100 text-teal-500',
                    'bg-orange-100 text-orange-500',
                    'bg-blue-100 text-blue-500',
                    'bg-purple-100 text-purple-500',
                    'bg-pink-100 text-pink-500',
                    'bg-green-100 text-green-500'
                  ];
                  const colorIndex = testimonial.name.charCodeAt(0) % colors.length;
                  const colorClass = colors[colorIndex];
                  return (
                    <div key={testimonial.id} className="bg-white p-6 rounded-2xl shadow-neumorph">
                      <div className="flex items-center mb-4">
                        <div className={`h-12 w-12 rounded-full ${colorClass} flex items-center justify-center text-xl font-bold mr-4`}>
                          {testimonial.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.role || 'User'}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">"{testimonial.message}"</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">Posted on {testimonial.createdAt.toLocaleDateString()}</p>
                      {testimonial.featured && (
                        <div className="mt-4 flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No testimonials available yet. Be the first to share your experience!</p>
              </div>
            )}
            <div className="text-center mt-12">
              <Link 
                href="/testimonials" 
                className="inline-flex items-center mr-4 px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-neumorph text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                View All Testimonials
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link 
                href="/testimonials/submit" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-neumorph text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                Share Your Experience
              </Link>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Join the hundreds of users who have already shared their feedback.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
