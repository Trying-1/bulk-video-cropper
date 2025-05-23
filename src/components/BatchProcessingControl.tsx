/**
 * Batch Processing Control Component
 * 
 * This component provides batch video processing functionality with subscription
 * awareness, while maintaining a clean interface without popups or guides.
 */

'use client';

import React, { useState } from 'react';
import SubscriptionFeatureGuard from './SubscriptionFeatureGuard';
import { useSubscription } from '@/hooks/useSecureSubscription';
import { logSecurityEvent, SecurityEventType } from '@/utils/securityMonitoring';

interface BatchProcessingControlProps {
  videos: Array<{
    id: string;
    name: string;
    processed: boolean;
  }>;
  onProcessAll: () => void;
  processing: boolean;
  progressPercent: number;
  currentProcessingVideo?: string;
  onCancel: () => void;
  userId?: string;
  className?: string;
}

const BatchProcessingControl: React.FC<BatchProcessingControlProps> = ({
  videos,
  onProcessAll,
  processing,
  progressPercent,
  currentProcessingVideo,
  onCancel,
  userId,
  className = ''
}) => {
  const [attemptedBatchAsNonPremium, setAttemptedBatchAsNonPremium] = useState(false);
  
  // Get feature access status
  const { hasFeature } = useSubscription(userId);
  const hasBatchProcessing = hasFeature('batchProcessing');
  
  // Handle attempting to use batch processing as a non-premium user
  const handleNonPremiumAttempt = () => {
    // Set the flag to show the minimal upgrade message
    setAttemptedBatchAsNonPremium(true);
    
    // Log the attempt as a security event (not shown to the user)
    logSecurityEvent(
      SecurityEventType.FEATURE_ACCESS_DENIED,
      'low',
      {
        feature: 'batchProcessing',
        videoCount: videos.length
      },
      userId
    );
  };
  
  // Count of unprocessed videos
  const unprocessedCount = videos.filter(video => !video.processed).length;
  
  // Don't show anything if no videos to process
  if (videos.length === 0) {
    return null;
  }
  
  return (
    <div className={`${className}`}>
      <SubscriptionFeatureGuard
        feature="batchProcessing"
        userId={userId}
        fallback={
          <div className="relative">
            {/* Disabled button for non-premium users */}
            <button
              onClick={handleNonPremiumAttempt}
              className="opacity-60 cursor-not-allowed bg-gray-200 text-gray-700 px-4 py-2 rounded flex items-center gap-2"
              disabled
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Process All Videos
              <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full ml-1">Coming Soon</span>
            </button>
            
            {/* Simple non-intrusive message if they attempt to use the feature */}
            {attemptedBatchAsNonPremium && (
              <div className="mt-2 text-sm text-gray-600">
                Batch processing is coming soon! For now, please process videos individually.
              </div>
            )}
          </div>
        }
      >
        {/* For premium users with batch processing */}
        {processing ? (
          <div className="flex flex-col gap-2">
            {/* Progress bar - simple, not a popup */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            
            {/* Current processing info - simple text, not a popup */}
            <div className="flex justify-between items-center text-sm">
              <span>
                {currentProcessingVideo ? (
                  <span className="text-gray-700">Processing: {currentProcessingVideo}</span>
                ) : (
                  <span className="text-gray-500">Starting processing...</span>
                )}
              </span>
              <span className="text-blue-600 font-medium">{Math.round(progressPercent)}%</span>
            </div>
            
            {/* Cancel button */}
            <button
              onClick={onCancel}
              className="text-red-600 text-sm hover:text-red-700 mt-1"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={onProcessAll}
            disabled={unprocessedCount === 0}
            className={`bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 ${
              unprocessedCount === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Process All Videos ({unprocessedCount})
          </button>
        )}
      </SubscriptionFeatureGuard>
    </div>
  );
};

export default BatchProcessingControl;
