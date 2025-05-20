'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '@/config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { adminStyles } from '../styles/adminStyles';
import { saveToLocalStorage, getFromLocalStorage, getFromSessionStorage, saveToSessionStorage } from '@/utils/storageUtils';
import { withAdminAuth } from '@/utils/withAdminAuth';
import { toast } from 'react-hot-toast';
import AdminHeader from '../components/AdminHeader';
import AdminAnalytics from '../components/AdminAnalytics';

// Storage keys for local storage
const STORAGE_KEYS = {
  ADMIN_TESTIMONIALS_FILTER: 'bvc_admin_testimonials_filter',
  ADMIN_TESTIMONIALS_SEARCH: 'bvc_admin_testimonials_search',
  ADMIN_TESTIMONIALS_SORT: 'bvc_admin_testimonials_sort'
};

// Import the Testimonial type and mapTestimonialDoc helper
interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  message: string;
  email: string;
  userId?: string;
  approved: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Helper to map Firestore documents to Testimonial objects
const mapTestimonialDoc = (doc: any): Testimonial => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    role: data.role,
    message: data.message,
    email: data.email,
    userId: data.userId,
    approved: data.approved,
    featured: data.featured,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate()
  };
};

// Testimonial status filter options
type StatusFilter = 'all' | 'pending' | 'approved' | 'featured';

function TestimonialsAdminPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  // Initialize filters from localStorage if available
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(() => {
    if (typeof window !== 'undefined') {
      const savedFilter = getFromLocalStorage<StatusFilter>(STORAGE_KEYS.ADMIN_TESTIMONIALS_FILTER);
      return savedFilter || 'all';
    }
    return 'all';
  });
  
  // Initialize search query from localStorage if available
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedSearch = getFromLocalStorage<string>(STORAGE_KEYS.ADMIN_TESTIMONIALS_SEARCH);
      return savedSearch || '';
    }
    return '';
  });
  
  // Use ref for debounce timer to avoid TypeScript errors with window object
  const searchDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize sort preference from localStorage if available
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>(() => {
    if (typeof window !== 'undefined') {
      const savedSort = getFromLocalStorage<'newest' | 'oldest' | 'name'>(STORAGE_KEYS.ADMIN_TESTIMONIALS_SORT);
      return savedSort || 'newest';
    }
    return 'newest';
  });
  const [analytics, setAnalytics] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    featured: 0,
    conversionRate: 0,
    averageLength: 0
  });

  // Enhanced fetchTestimonials function with caching support
  const fetchTestimonials = useCallback(async (forceFresh = false) => {
    setLoading(true);
    
    // Check for cached testimonials data
    const cachedData = !forceFresh ? getFromLocalStorage<Testimonial[]>('bvc_admin_testimonials_data') : null;
    const lastFetchTime = getFromLocalStorage<number>('bvc_admin_testimonials_last_fetch');
    const now = new Date().getTime();
    const cacheAge = lastFetchTime ? now - lastFetchTime : Infinity;
    const cacheExpired = cacheAge > 15 * 60 * 1000; // 15 minutes cache validity
    
    // Use cached data if available and not expired
    if (cachedData && !cacheExpired && !forceFresh) {
      console.log('Using cached testimonials data');
      setTestimonials(cachedData);
      calculateAnalytics(cachedData);
      setLoading(false);
      
      // Refresh in background after using cache
      setTimeout(() => fetchTestimonials(true), 100);
      return;
    }
    
    try {
      const testimonialsQuery = query(
        collection(db, 'testimonials'),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(testimonialsQuery);
      const testimonialsList = snapshot.docs.map(mapTestimonialDoc);
      
      // Save to state
      setTestimonials(testimonialsList);
      
      // Calculate analytics and get the data for caching
      const analyticsData = calculateAnalytics(testimonialsList);
      
      // Cache the fresh data
      saveToLocalStorage('bvc_admin_testimonials_data', testimonialsList);
      saveToLocalStorage('bvc_admin_testimonials_last_fetch', now);
      
      // Store analytics in session for reuse
      saveToSessionStorage('bvc_admin_testimonials_analytics', analyticsData);
      
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
      
      // If error and we have cached data, use that as fallback
      const fallbackData = getFromLocalStorage<Testimonial[]>('bvc_admin_testimonials_data');
      if (fallbackData) {
        console.log('Using fallback cached data after fetch error');
        setTestimonials(fallbackData);
        calculateAnalytics(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch testimonials when component mounts with caching optimization
  useEffect(() => {
    // Try to load analytics from session storage first for instant display
    const cachedAnalytics = getFromSessionStorage<typeof analytics>('bvc_admin_testimonials_analytics');
    if (cachedAnalytics) {
      setAnalytics(cachedAnalytics);
    }
    
    // Then fetch the full data (which might use cache if available)
    fetchTestimonials(false);
  }, [fetchTestimonials]);

  // Save filter, search query, and sorting preferences to localStorage when they change
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.ADMIN_TESTIMONIALS_FILTER, statusFilter);
  }, [statusFilter]);
  
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.ADMIN_TESTIMONIALS_SEARCH, searchQuery);
  }, [searchQuery]);
  
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.ADMIN_TESTIMONIALS_SORT, sortBy);
  }, [sortBy]);

  // Apply filters whenever testimonials, filters, or search changes
  useEffect(() => {
    if (!testimonials.length) return;

    let filtered = [...testimonials];
    
    // Apply status filter
    if (statusFilter === 'pending') {
      filtered = filtered.filter(t => !t.approved);
    } else if (statusFilter === 'approved') {
      filtered = filtered.filter(t => t.approved && !t.featured);
    } else if (statusFilter === 'featured') {
      filtered = filtered.filter(t => t.featured);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        (t.role && t.role.toLowerCase().includes(query)) ||
        t.message.toLowerCase().includes(query) ||
        t.email.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setFilteredTestimonials(filtered);
  }, [testimonials, statusFilter, searchQuery, sortBy]);

  // Calculate analytics data and return for caching
  const calculateAnalytics = (testimonialsList: Testimonial[]) => {
    const total = testimonialsList.length;
    const pending = testimonialsList.filter(t => !t.approved).length;
    const approved = testimonialsList.filter(t => t.approved && !t.featured).length;
    const featured = testimonialsList.filter(t => t.featured).length;
    
    // Calculate average message length
    const totalLength = testimonialsList.reduce((sum, t) => sum + t.message.length, 0);
    const averageLength = total > 0 ? Math.round(totalLength / total) : 0;
    
    // Placeholder for conversion rate (would need actual data)
    const conversionRate = approved > 0 ? Math.round((featured / approved) * 100) : 0;
    
    // Create analytics object
    const analyticsData = {
      total,
      pending,
      approved,
      featured,
      conversionRate,
      averageLength
    };
    
    // Update state
    setAnalytics(analyticsData);
    
    // Return the analytics data for caching
    return analyticsData;
  };

  // Approve a testimonial
  const approveTestimonial = async (id: string) => {
    try {
      const testimonialRef = doc(db, 'testimonials', id);
      await updateDoc(testimonialRef, {
        approved: true,
        updatedAt: Timestamp.now()
      });
      
      // Update local state
      const updatedTestimonials = testimonials.map(t => 
        t.id === id ? { ...t, approved: true, updatedAt: new Date() } : t
      );
      
      setTestimonials(updatedTestimonials);
      calculateAnalytics(updatedTestimonials);
      toast.success('Testimonial approved');
    } catch (error) {
      console.error('Error approving testimonial:', error);
      toast.error('Failed to approve testimonial');
    }
  };

  // Toggle featured status
  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const testimonialRef = doc(db, 'testimonials', id);
      await updateDoc(testimonialRef, {
        featured: !currentStatus,
        approved: true, // Featured testimonials must be approved
        updatedAt: Timestamp.now()
      });
      
      // Update local state
      const updatedTestimonials = testimonials.map(t => 
        t.id === id ? { ...t, featured: !currentStatus, approved: true, updatedAt: new Date() } : t
      );
      
      setTestimonials(updatedTestimonials);
      calculateAnalytics(updatedTestimonials);
      toast.success(`Testimonial ${!currentStatus ? 'featured' : 'unfeatured'}`);
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast.error('Failed to update testimonial');
    }
  };

  // Delete a testimonial
  const deleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      
      // Update local state
      const updatedTestimonials = testimonials.filter(t => t.id !== id);
      setTestimonials(updatedTestimonials);
      calculateAnalytics(updatedTestimonials);
      toast.success('Testimonial deleted');
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  return (
    <div className={adminStyles.pageContainer}>
      <AdminHeader 
        title="Testimonial Management" 
        description="Review, approve, and manage user testimonials"
      />
      
      {/* Analytics Dashboard */}
      <AdminAnalytics analytics={analytics} />
      
      {/* Filters and Search */}
      <div className={adminStyles.contentCard}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`${adminStyles.filterButton.base} ${statusFilter === 'all' 
                ? adminStyles.filterButton.active.all 
                : adminStyles.filterButton.inactive}`}
              aria-pressed={statusFilter === 'all'}
            >
              All ({analytics.total})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`${adminStyles.filterButton.base} ${statusFilter === 'pending' 
                ? adminStyles.filterButton.active.pending 
                : adminStyles.filterButton.inactive}`}
              aria-pressed={statusFilter === 'pending'}
            >
              Pending ({analytics.pending})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`${adminStyles.filterButton.base} ${statusFilter === 'approved' 
                ? adminStyles.filterButton.active.approved 
                : adminStyles.filterButton.inactive}`}
              aria-pressed={statusFilter === 'approved'}
            >
              Approved ({analytics.approved})
            </button>
            <button
              onClick={() => setStatusFilter('featured')}
              className={`${adminStyles.filterButton.base} ${statusFilter === 'featured' 
                ? adminStyles.filterButton.active.featured 
                : adminStyles.filterButton.inactive}`}
              aria-pressed={statusFilter === 'featured'}
            >
              Featured ({analytics.featured})
            </button>
          </div>
          
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input
                type="search"
                className={adminStyles.input + " pl-10"}
                placeholder="Search testimonials..."
                value={searchQuery}
                onChange={(e) => {
                  // Use local variable to avoid state update on every keystroke
                  const newValue = e.target.value;
                  setSearchQuery(newValue);
                  
                  // Debounce saving to localStorage to reduce writes
                  if (searchDebounceTimerRef.current) {
                    clearTimeout(searchDebounceTimerRef.current);
                  }
                  searchDebounceTimerRef.current = setTimeout(() => {
                    saveToLocalStorage(STORAGE_KEYS.ADMIN_TESTIMONIALS_SEARCH, newValue);
                  }, 500);
                }}
                aria-label="Search testimonials"
              />
            </div>
            
            <select
              className={adminStyles.select}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'name')}
              aria-label="Sort testimonials by"
            >
              <option value="newest" className={adminStyles.option}>Newest First</option>
              <option value="oldest" className={adminStyles.option}>Oldest First</option>
              <option value="name" className={adminStyles.option}>Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Testimonials Table */}
      <div className={adminStyles.contentCard + " overflow-hidden p-0"}>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading testimonials...</p>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-300">
            {searchQuery ? 'No testimonials match your search.' : 'No testimonials found.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-3">Name / Role</th>
                  <th scope="col" className="px-6 py-3">Message</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTestimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                      {testimonial.role && (
                        <div className="text-xs text-gray-700 dark:text-gray-300">{testimonial.role}</div>
                      )}
                      <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">{testimonial.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs overflow-hidden text-ellipsis text-gray-700 dark:text-gray-300">
                        {testimonial.message.length > 100 
                          ? `${testimonial.message.substring(0, 100)}...` 
                          : testimonial.message
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {testimonial.createdAt && testimonial.createdAt instanceof Date 
                        ? testimonial.createdAt.toLocaleDateString() 
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {testimonial.featured ? (
                        <span className="px-2 py-1 text-xs font-bold text-white bg-purple-700 rounded-full border border-purple-300">Featured</span>
                      ) : testimonial.approved ? (
                        <span className="px-2 py-1 text-xs font-bold text-white bg-green-700 rounded-full border border-green-300">Approved</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-bold text-yellow-800 bg-yellow-200 rounded-full border border-yellow-300">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {!testimonial.approved && (
                          <button
                            onClick={() => approveTestimonial(testimonial.id)}
                            className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded font-medium border border-green-200 dark:border-green-700"
                            title="Approve"
                            aria-label="Approve testimonial"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => toggleFeatured(testimonial.id, testimonial.featured)}
                          className={`text-xs px-2 py-1 ${testimonial.featured ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'} rounded font-medium border ${testimonial.featured ? 'border-gray-300 dark:border-gray-600' : 'border-purple-200 dark:border-purple-700'}`}
                          title={testimonial.featured ? 'Remove from featured' : 'Add to featured'}
                          aria-label={testimonial.featured ? 'Remove from featured' : 'Add to featured'}
                        >
                          {testimonial.featured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button
                          onClick={() => deleteTestimonial(testimonial.id)}
                          className="text-xs px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded font-medium border border-red-200 dark:border-red-700"
                          title="Delete"
                          aria-label="Delete testimonial"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Export with withAdminAuth
export default withAdminAuth(TestimonialsAdminPage);
