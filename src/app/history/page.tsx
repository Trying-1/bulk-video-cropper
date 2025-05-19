'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { updateAppStateCookie } from '@/utils/cookies';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

interface ProcessedVideo {
  id: string;
  name: string;
  originalSize: string;
  processedSize: string;
  date: string;
  thumbnailUrl: string;
  downloadUrl: string;
  aspectRatio: string;
  duration: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [videos, setVideos] = useState<ProcessedVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filterDays, setFilterDays] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Track page visit
    updateAppStateCookie({
      lastVisitedPage: '/history'
    });

    // Fetch user's video history
    const fetchVideos = async () => {
      setIsLoading(true);
      
      try {
        // This would be a real API call in production
        // For demo purposes, we'll create mock data
        const mockVideos: ProcessedVideo[] = Array.from({ length: 12 }, (_, i) => ({
          id: `video-${i + 1}`,
          name: `Processed Video ${i + 1}.mp4`,
          originalSize: `${Math.floor(Math.random() * 100) + 10}MB`,
          processedSize: `${Math.floor(Math.random() * 50) + 5}MB`,
          date: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
          thumbnailUrl: `/mock-thumbnails/thumbnail-${(i % 6) + 1}.jpg`,
          downloadUrl: '#',
          aspectRatio: ['16:9', '9:16', '1:1', '4:5'][(i % 4)],
          duration: `${Math.floor(Math.random() * 5) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        }));
        
        setVideos(mockVideos);
      } catch (error) {
        console.error('Failed to fetch video history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideos();
  }, []);

  // Filter videos based on search query and day filter
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDateFilter = filterDays === null || 
      (new Date(video.date) > new Date(Date.now() - filterDays * 86400000));
    
    return matchesSearch && matchesDateFilter;
  });

  const handleDeleteVideo = (id: string) => {
    // In a real app, this would call an API to delete the video
    setVideos(videos.filter(video => video.id !== id));
  };

  const handleReprocess = (id: string) => {
    // In a real app, this would open the editor with the selected video
    router.push(`/editor?videoId=${id}`);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Video History</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View and manage your processed videos
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                href="/editor"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Process New Video
              </Link>
            </div>
          </div>

          {/* Filters and search */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex space-x-2 mb-4 sm:mb-0">
              <button
                onClick={() => setFilterDays(null)}
                className={`px-3 py-1 text-sm rounded-md ${
                  filterDays === null
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                All Time
              </button>
              <button
                onClick={() => setFilterDays(7)}
                className={`px-3 py-1 text-sm rounded-md ${
                  filterDays === 7
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setFilterDays(30)}
                className={`px-3 py-1 text-sm rounded-md ${
                  filterDays === 30
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Last 30 Days
              </button>
            </div>
            <div className="flex items-center w-full sm:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <div className="ml-2 flex">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded-md ${
                    view === 'grid'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded-md ml-1 ${
                    view === 'list'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No videos found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchQuery ? 'Try adjusting your search or filter.' : 'Start processing videos to see them here.'}
              </p>
              <div className="mt-6">
                <Link
                  href="/editor"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Process New Video
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredVideos.map((video) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                    >
                      <div className="relative pb-[56.25%] bg-gray-200 dark:bg-gray-700">
                        <div className="absolute inset-0 flex items-center justify-center">
                          {/* In a real app, this would be an actual thumbnail */}
                          <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-2 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {video.aspectRatio}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-gray-900 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate" title={video.name}>
                          {video.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(video.date).toLocaleDateString()}
                        </p>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                          <span>Original: {video.originalSize}</span>
                          <span>Processed: {video.processedSize}</span>
                        </div>
                        <div className="flex justify-between mt-4">
                          <button
                            onClick={() => handleReprocess(video.id)}
                            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-500"
                          >
                            Reprocess
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(video.id)}
                            className="text-red-600 dark:text-red-400 text-sm font-medium hover:text-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Video
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Size
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Aspect Ratio
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Duration
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredVideos.map((video) => (
                        <tr key={video.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {video.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(video.date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {video.processedSize}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {video.aspectRatio}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {video.duration}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleReprocess(video.id)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 mr-4"
                            >
                              Reprocess
                            </button>
                            <button
                              onClick={() => handleDeleteVideo(video.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
