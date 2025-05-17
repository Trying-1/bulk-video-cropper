'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChange, getUser, updateUsedQuota } from '@/services/firebaseService';
import { getVideoLimitBySubscription } from '@/utils/subscriptionLimits';
import { User } from '@/types/user';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (userData) => {
      if (userData) {
        const fullUserData = await getUser(userData.uid);
        setUser(fullUserData);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setVideoFiles(files);
    }
  };

  const handleProcessVideos = async () => {
    if (!user || videoFiles.length === 0) return;
    
    // Get limit based on subscription type
    const videoLimit = getVideoLimitBySubscription({ subscription: user.subscription });
    const remainingVideos = videoLimit - user.usedQuota;
    
    if (videoFiles.length > remainingVideos) {
      alert(`You can only process ${remainingVideos} more videos this month`);
      return;
    }

    setIsProcessing(true);
    try {
      // Here you would integrate with your video processing service
      // For now, we'll just show a success message
      await updateUsedQuota(user.uid, videoFiles.length);
      alert('Videos processed successfully!');
      setVideoFiles([]);
    } catch (error) {
      alert('Error processing videos');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
            <p className="text-blue-600">{user.subscription}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Video Processing</h3>
            <p>{user.usedQuota} videos processed this month</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Process Videos</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Videos
            </label>
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Selected {videoFiles.length} video(s)
            </p>
            <button
              onClick={handleProcessVideos}
              disabled={isProcessing || videoFiles.length === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Process Videos'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
