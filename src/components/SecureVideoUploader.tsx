/**
 * Secure Video Uploader Component
 * 
 * This component handles video uploads with comprehensive security
 * and subscription limit enforcement without intrusive popups or guides.
 */

'use client';

import React, { useState, useRef } from 'react';
import { validateVideo } from '@/utils/fileValidation';
import { useSubscription } from '@/hooks/useSecureSubscription';
import { trackSuspiciousActivity } from '@/utils/securityMonitoring';

interface SecureVideoUploaderProps {
  onUpload: (files: File[]) => void;
  currentVideoCount: number;
  className?: string;
  buttonLabel?: string;
  buttonClassName?: string;
  userId?: string;
}

/**
 * Secure video upload component with subscription limit enforcement
 * Uses a clean interface without popups or guides
 */
const SecureVideoUploader: React.FC<SecureVideoUploaderProps> = ({
  onUpload,
  currentVideoCount,
  className = '',
  buttonLabel = 'Upload Videos',
  buttonClassName = '',
  userId
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Get subscription limits
  const { 
    limits, 
    isLoading,
    canUploadMoreVideos
  } = useSubscription(userId);

  // Handle file selection
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const files = Array.from(event.target.files);
      
      // Check if adding these files would exceed the subscription limit
      const remainingSlots = limits.videoLimit - currentVideoCount;
      
      if (remainingSlots <= 0) {
        setError(`Maximum limit of ${limits.videoLimit} videos reached based on your plan.`);
        return;
      }
      
      // Limit the number of files to process
      const filesToProcess = files.slice(0, remainingSlots);
      
      if (files.length > remainingSlots) {
        setError(`Only processing ${remainingSlots} of ${files.length} videos due to your plan limit.`);
      }
      
      // Validate each file
      const validatedFiles: File[] = [];
      const validationErrors: string[] = [];
      
      for (const file of filesToProcess) {
        const validation = await validateVideo(file, limits.videoSizeLimit, limits.videoDurationLimit);
        
        if (validation.valid) {
          validatedFiles.push(file);
        } else {
          validationErrors.push(`${file.name}: ${validation.errors.join(', ')}`);
          
          // Log security event for suspicious files
          if (validation.errors.some(err => 
            err.includes('Invalid file type') || 
            err.includes('Invalid filename') ||
            err.includes('security risk')
          )) {
            trackSuspiciousActivity('upload_validation_failure', {
              filename: file.name,
              errors: validation.errors
            });
          }
        }
      }
      
      // Handle validation errors with a non-intrusive message
      if (validationErrors.length > 0) {
        if (validatedFiles.length === 0) {
          setError(`Upload failed: ${validationErrors.join('. ')}`);
        } else {
          setError(`Some files couldn't be processed: ${validationErrors.join('. ')}`);
        }
      }
      
      // If we have valid files, proceed with upload
      if (validatedFiles.length > 0) {
        onUpload(validatedFiles);
      }
    } catch (error) {
      console.error('Error processing uploads:', error);
      setError('An error occurred while processing your uploads.');
    } finally {
      setIsValidating(false);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle button click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Determine if uploads are disabled
  const isDisabled = isLoading || isValidating || !canUploadMoreVideos(currentVideoCount);

  return (
    <div className={className}>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*"
        multiple
        className="hidden"
        disabled={isDisabled}
      />
      
      {/* Upload button */}
      <button
        onClick={handleButtonClick}
        disabled={isDisabled}
        className={`relative ${buttonClassName} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isValidating ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-t-blue-500 border-gray-300 rounded-full animate-spin"></span>
            Processing...
          </span>
        ) : (
          <>
            <span>{buttonLabel}</span>
            
            {/* Simple indicator if close to limit - no popup */}
            {!isLoading && limits.videoLimit - currentVideoCount <= 2 && (
              <span className="absolute -top-1 -right-1 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">
                {limits.videoLimit - currentVideoCount} left
              </span>
            )}
          </>
        )}
      </button>
      
      {/* Error message - simple inline text, not a popup */}
      {error && (
        <div className="text-sm text-red-600 mt-2">
          {error}
        </div>
      )}
      
      {/* Upload limits display - simple text, not a popup */}
      {!isLoading && (
        <div className="text-xs text-gray-500 mt-1">
          {currentVideoCount} of {limits.videoLimit} videos used
          <span className="text-xs text-gray-400 ml-2">
            (Max {limits.videoDurationLimit}s, {limits.videoSizeLimit}MB)
          </span>
        </div>
      )}
    </div>
  );
};

export default SecureVideoUploader;
