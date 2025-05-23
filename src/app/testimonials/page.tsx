'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getApprovedTestimonials, Testimonial } from '@/services/testimonialService';
import { APP_IDENTITY } from '@/config/branding';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const testimonialsPerPage = 9; // Show 9 per page for a nice 3x3 grid
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'last-week', 'last-month', 'last-year'

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        console.log('Fetching approved testimonials for display page...');
        
        // Direct database query to troubleshoot
        try {
          const testimonialsRef = collection(db, 'testimonials');
          const q = query(testimonialsRef, where('approved', '==', true));
          const querySnapshot = await getDocs(q);
          
          console.log('DIRECT QUERY - Found testimonials:', querySnapshot.size);
          
          if (querySnapshot.size > 0) {
            const directTestimonials = querySnapshot.docs.map(doc => {
              const data = doc.data();
              console.log('Testimonial data:', data);
              return {
                id: doc.id,
                name: data.name || 'Anonymous',
                role: data.role || 'User',
                message: data.message || '',
                email: data.email || '',
                approved: data.approved || false,
                featured: data.featured || false,
                rating: data.rating || 0,
                createdAt: data.createdAt || new Date(),
                updatedAt: data.updatedAt || new Date()
              };
            });
            console.log('Setting direct testimonials:', directTestimonials.length);
            setTestimonials(directTestimonials);
            setFilteredTestimonials(directTestimonials);
          } else {
            console.log('No testimonials found with direct query');
            setTestimonials([]);
            setFilteredTestimonials([]);
          }
        } catch (directError) {
          console.error('Direct query error:', directError);
          
          // Fallback to service method
          const allTestimonials = await getApprovedTestimonials(false, 100);
          console.log('Fallback testimonials fetched:', allTestimonials.length);
          setTestimonials(allTestimonials);
          setFilteredTestimonials(allTestimonials);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);
  
  // Apply date filtering when dateFilter changes
  useEffect(() => {
    if (!testimonials.length) return;
    
    const now = new Date();
    const filterTestimonials = () => {
      if (dateFilter === 'all') {
        setFilteredTestimonials(testimonials);
        return;
      }
      
      let dateThreshold = new Date();
      if (dateFilter === 'last-week') {
        dateThreshold.setDate(now.getDate() - 7);
      } else if (dateFilter === 'last-month') {
        dateThreshold.setMonth(now.getMonth() - 1);
      } else if (dateFilter === 'last-year') {
        dateThreshold.setFullYear(now.getFullYear() - 1);
      }
      
      const filtered = testimonials.filter(testimonial => {
        // Handle both Date objects and Firestore timestamps
        const testimonialDate = testimonial.createdAt instanceof Date ? 
          testimonial.createdAt : 
          new Date(testimonial.createdAt.seconds * 1000);
        return testimonialDate >= dateThreshold;
      });
      
      setFilteredTestimonials(filtered);
      // Reset to first page when filter changes
      setCurrentPage(1);
    };
    
    filterTestimonials();
  }, [dateFilter, testimonials]);

  // Get current testimonials for pagination
  const indexOfLastTestimonial = currentPage * testimonialsPerPage;
  const indexOfFirstTestimonial = indexOfLastTestimonial - testimonialsPerPage;
  const currentTestimonials = filteredTestimonials.slice(indexOfFirstTestimonial, indexOfLastTestimonial);
  const totalPages = Math.ceil(filteredTestimonials.length / testimonialsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderColoredInitial = (name: string) => {
    // Generate a color based on the first letter of the name
    const colors = [
      'bg-teal-100 dark:bg-teal-900 text-teal-500',
      'bg-orange-100 dark:bg-orange-900 text-orange-500',
      'bg-blue-100 dark:bg-blue-900 text-blue-500',
      'bg-purple-100 dark:bg-purple-900 text-purple-500',
      'bg-pink-100 dark:bg-pink-900 text-pink-500',
      'bg-green-100 dark:bg-green-900 text-green-500'
    ];
    const colorIndex = name.charCodeAt(0) % colors.length;
    const colorClass = colors[colorIndex];
    
    return (
      <div className={`h-12 w-12 rounded-full ${colorClass} flex items-center justify-center text-xl font-bold mr-4`}>
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Customer Testimonials
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See what our customers are saying about {APP_IDENTITY.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {loading ? 'Loading testimonials...' : 
              filteredTestimonials.length > 0 ? 
                `Showing ${filteredTestimonials.length} testimonials` : 
                'No testimonials found'}
          </p>
        </div>
        
        {/* Date filtering controls */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg shadow-md p-1">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                dateFilter === 'all' 
                  ? 'bg-teal-500 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateFilter('last-week')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                dateFilter === 'last-week' 
                  ? 'bg-teal-500 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Last Week
            </button>
            <button
              onClick={() => setDateFilter('last-month')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                dateFilter === 'last-month' 
                  ? 'bg-teal-500 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Last Month
            </button>
            <button
              onClick={() => setDateFilter('last-year')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                dateFilter === 'last-year' 
                  ? 'bg-teal-500 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Last Year
            </button>
          </div>
        </div>

        {loading ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-1/5"></div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Testimonials Grid - Takes up more space */}
            <div className="w-full md:w-3/4">
              {filteredTestimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentTestimonials.map((testimonial) => (
                  <div 
                    key={testimonial.id} 
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow h-full flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {renderColoredInitial(testimonial.name)}
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.role || 'User'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {testimonial.createdAt instanceof Date ? 
                            testimonial.createdAt.toLocaleDateString() : 
                            new Date(testimonial.createdAt.seconds * 1000).toLocaleDateString()}
                        </p>
                        {/* Show rating stars if available, otherwise show featured badge */}
                        {testimonial.rating ? (
                          <div className="flex items-center mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        ) : testimonial.featured && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              <svg className="w-3 h-3 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              Featured
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-gray-600 dark:text-gray-300">"{testimonial.message}"</p>
                    </div>
                  </div>
                ))}
              </div>
              ) : (
                <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No testimonials available</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Be the first to share your experience with {APP_IDENTITY.name}!
                  </p>
                </div>
              )}
              
              {/* Pagination */}
              {filteredTestimonials.length > 0 && totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 text-sm font-medium ${currentPage === 1 ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium ${currentPage === number ? 'bg-teal-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      >
                        {number}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 text-sm font-medium ${currentPage === totalPages ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>

            {/* Submit Testimonial Section - Now on the side */}
            <div className="w-full md:w-1/4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-fit sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Share Your Experience
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We value your feedback! Let us know how {APP_IDENTITY.name} has helped you.
              </p>
              <Link 
                href="/testimonials/submit" 
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
              >
                Submit a Testimonial
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
