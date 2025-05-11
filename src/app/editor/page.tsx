"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { processBatchVideos, cancelProcessing } from "@/utils/ffmpeg";
import ProcessingStatus from "@/components/ProcessingStatus";
import VideoPreviewModal from "@/components/VideoPreviewModal";

import dynamic from 'next/dynamic';
import { validateVideo, sanitizeFilename } from "@/utils/fileValidation";
import { logError, formatErrorMessage } from "@/utils/errorHandling";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import ErrorNotification from "@/components/ErrorNotification";

// Dynamically import the ParticleBackground to prevent SSR issues
const EditorParticleBackground = dynamic(
  () => import('./ParticleBackground'),
  { ssr: false }
);

export default function EditorPage() {
  const [videos, setVideos] = useState<Array<{
    id: string;
    name: string;
    file: File;
    url: string;
    processed: boolean;
    processedUrl?: string;
    error?: string;
    cropSettings: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>>([]);
  
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>("16:9");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [currentProcessingVideo, setCurrentProcessingVideo] = useState<string>();
  const [completionMessage, setCompletionMessage] = useState<string | undefined>();

  const [cropMode, setCropMode] = useState(false);
  const [cropStartPosition, setCropStartPosition] = useState<{ x: number; y: number } | null>(null);
  const [resizeMode, setResizeMode] = useState<string | null>(null); // 'nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'
  const [previewModal, setPreviewModal] = useState<{isOpen: boolean, url: string, name: string, videoId?: string}>({isOpen: false, url: '', name: ''});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [useCurrentCropForAll, setUseCurrentCropForAll] = useState(false);
  
  // Performance optimization
  const isLowPerformance = useMediaQuery('(max-width: 768px)') || useMediaQuery('(prefers-reduced-motion: reduce)');
  
  const currentVideo = videos.find(v => v.id === currentVideoId) || null;
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setIsUploading(true);
      setErrorMessage(null);
      
      try {
        const files = Array.from(event.target.files);
        const validatedVideos = [];
        
        // Check if adding these files would exceed the 10 video limit
        const currentCount = videos.length;
        const remainingSlots = 10 - currentCount;
        
        if (remainingSlots <= 0) {
          setErrorMessage('Maximum limit of 10 videos reached. Please remove some videos before adding more.');
          return;
        }
        
        // Limit the number of files to process
        const filesToProcess = files.slice(0, remainingSlots);
        
        if (files.length > remainingSlots) {
          setErrorMessage(`Only processing ${remainingSlots} of ${files.length} videos due to the 10 video limit.`);
        }
        
        for (const file of filesToProcess) {
          const validation = await validateVideo(file);
          
          if (validation.valid) {
            validatedVideos.push({
              id: Math.random().toString(36).substring(2, 9),
              name: sanitizeFilename(file.name),
              file: file,
              url: URL.createObjectURL(file),
              processed: false,
              duration: validation.duration,
              cropSettings: {
                x: 0,
                y: 0,
                width: 0,  // Start with zero width/height to indicate not cropped yet
                height: 0
              }
            });
          } else {
            validatedVideos.push({
              id: Math.random().toString(36).substring(2, 9),
              name: file.name,
              file: file,
              url: URL.createObjectURL(file),
              processed: false,
              error: validation.errors.join(', '),
              duration: validation.duration,
              cropSettings: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
              }
            });
          }
        }
        
        setVideos(prev => [...prev, ...validatedVideos]);
        
        if (!currentVideoId && validatedVideos.length > 0) {
          setCurrentVideoId(validatedVideos[0].id);
        }
        
        // Show error if any files had validation issues
        const invalidVideos = validatedVideos.filter(v => v.error);
        if (invalidVideos.length > 0) {
          if (invalidVideos.length === validatedVideos.length && validatedVideos.length > 0) {
            setErrorMessage(`All uploaded files have issues: ${invalidVideos[0].error}`);
          } else if (invalidVideos.length > 0) {
            setErrorMessage(`${invalidVideos.length} of ${validatedVideos.length} files have issues and may not process correctly.`);
          }
        }
      } catch (error) {
        logError(error as Error, { context: 'handleFileChange' });
        setErrorMessage('Error uploading files. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };
  
  const handleRemoveVideo = (id: string) => {
    setVideos(prev => {
      // Find the video to be removed
      const videoToRemove = prev.find(video => video.id === id);
      
      // Revoke object URL if it exists to prevent memory leaks
      if (videoToRemove?.url) {
        try {
          URL.revokeObjectURL(videoToRemove.url);
        } catch (error) {
          console.warn('Failed to revoke URL:', error);
        }
      }
      
      const updatedVideos = prev.filter(video => video.id !== id);
      
      // If we're removing the current video, select another one if available
      if (id === currentVideoId) {
        if (updatedVideos.length > 0) {
          setCurrentVideoId(updatedVideos[0].id);
        } else {
          setCurrentVideoId(null);
        }
      }
      
      return updatedVideos;
    });
  };
  
  const handleRemoveProcessedVideo = (id: string) => {
    setVideos(prev => prev.map(video => {
      if (video.id === id) {
        // Revoke the object URL to prevent memory leaks
        if (video.processedUrl) {
          try {
            URL.revokeObjectURL(video.processedUrl);
          } catch (error) {
            console.warn('Failed to revoke URL:', error);
          }
        }
        
        return {
          ...video,
          processed: false,
          processedUrl: undefined
        };
      }
      return video;
    }));
  };
  
  const handleRemoveAllProcessedVideos = () => {
    if (window.confirm('Are you sure you want to remove all processed videos?')) {
      setVideos(prev => prev.map(video => {
        if (video.processed) {
          // Revoke the object URL to prevent memory leaks
          if (video.processedUrl) {
            try {
              URL.revokeObjectURL(video.processedUrl);
            } catch (error) {
              console.warn('Failed to revoke URL:', error);
            }
          }
          
          return {
            ...video,
            processed: false,
            processedUrl: undefined
          };
        }
        return video;
      }));
    }
  };
  
  const handleAspectRatioChange = (ratio: string) => {
    if (!currentVideo) return;
    
    setAspectRatio(ratio);
    
    // Update crop settings based on aspect ratio
    const [width, height] = ratio.split(":").map(Number);
    const aspectRatioValue = width / height;
    
    // Set a reasonable size based on the aspect ratio
    let newWidth = 300;
    let newHeight = Math.round(newWidth / aspectRatioValue);
    
    // If height would be too large, adjust width instead
    if (newHeight > 200) {
      newHeight = 200;
      newWidth = Math.round(newHeight * aspectRatioValue);
    }
    
    // Center the crop area in the container
    const containerWidth = videoContainerRef.current?.clientWidth || 640;
    const containerHeight = videoContainerRef.current?.clientHeight || 360;
    const x = Math.max(0, Math.floor((containerWidth - newWidth) / 2));
    const y = Math.max(0, Math.floor((containerHeight - newHeight) / 2));
    
    handleCropChange({
      x,
      y,
      width: newWidth,
      height: newHeight
    });
  };
  
  const handleCropChange = (newCropSettings: { x: number; y: number; width: number; height: number }) => {
    if (!currentVideoId) return;
    
    setVideos(prev => prev.map(video => {
      if (video.id === currentVideoId || (useCurrentCropForAll && !video.processed)) {
        return {
          ...video,
          cropSettings: newCropSettings
        };
      }
      return video;
    }));
  };
  
  const getResizeMode = (e: React.MouseEvent<HTMLDivElement>, cropSettings: any) => {
    if (!cropMode || !currentVideo) return null;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const { x, y, width, height } = cropSettings;
    const edgeThreshold = 10; // pixels from edge to trigger resize mode
    
    const isNearTop = Math.abs(mouseY - y) <= edgeThreshold;
    const isNearBottom = Math.abs(mouseY - (y + height)) <= edgeThreshold;
    const isNearLeft = Math.abs(mouseX - x) <= edgeThreshold;
    const isNearRight = Math.abs(mouseX - (x + width)) <= edgeThreshold;
    
    // Check corners first (they have priority)
    if (isNearTop && isNearLeft) return 'nw';
    if (isNearTop && isNearRight) return 'ne';
    if (isNearBottom && isNearLeft) return 'sw';
    if (isNearBottom && isNearRight) return 'se';
    
    // Then check edges
    if (isNearTop) return 'n';
    if (isNearRight) return 'e';
    if (isNearBottom) return 's';
    if (isNearLeft) return 'w';
    
    // Check if inside the crop area
    const isInside = mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY <= y + height;
    if (isInside) return 'move';
    
    return null;
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cropMode || !currentVideo) return;
    
    // Get the position relative to the container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if we're near an edge for resizing
    const mode = getResizeMode(e, currentVideo.cropSettings);
    setResizeMode(mode);
    
    // If we're not resizing or moving, start a new crop
    if (!mode) {
      setCropStartPosition({ x, y });
      
      // Reset crop settings to start fresh
      handleCropChange({
        x,
        y,
        width: 0,
        height: 0
      });
    } else {
      // For resize or move, just record the start position
      setCropStartPosition({ x, y });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cropMode || !currentVideo) return;
    
    // Update cursor based on position
    if (!cropStartPosition) {
      const mode = getResizeMode(e, currentVideo.cropSettings);
      if (mode === 'nw' || mode === 'se') e.currentTarget.style.cursor = 'nwse-resize';
      else if (mode === 'ne' || mode === 'sw') e.currentTarget.style.cursor = 'nesw-resize';
      else if (mode === 'n' || mode === 's') e.currentTarget.style.cursor = 'ns-resize';
      else if (mode === 'e' || mode === 'w') e.currentTarget.style.cursor = 'ew-resize';
      else if (mode === 'move') e.currentTarget.style.cursor = 'move';
      else e.currentTarget.style.cursor = 'crosshair';
      return;
    }
    
    // Get the position relative to the container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Get the current crop settings
    const { cropSettings } = currentVideo;
    let newSettings = { ...cropSettings };
    
    if (!resizeMode) {
      // Drawing a new crop area
      const width = Math.abs(x - cropStartPosition.x);
      const height = Math.abs(y - cropStartPosition.y);
      const cropX = Math.min(x, cropStartPosition.x);
      const cropY = Math.min(y, cropStartPosition.y);
      
      newSettings = {
        x: cropX,
        y: cropY,
        width,
        height
      };
    } else if (resizeMode === 'move') {
      // Moving the entire crop area
      const deltaX = x - cropStartPosition.x;
      const deltaY = y - cropStartPosition.y;
      
      newSettings = {
        x: Math.max(0, cropSettings.x + deltaX),
        y: Math.max(0, cropSettings.y + deltaY),
        width: cropSettings.width,
        height: cropSettings.height
      };
      
      // Update start position for smooth movement
      setCropStartPosition({ x, y });
    } else {
      // Resizing the crop area
      const deltaX = x - cropStartPosition.x;
      const deltaY = y - cropStartPosition.y;
      
      // Handle different resize modes
      switch (resizeMode) {
        case 'nw': // Northwest corner
          newSettings = {
            x: cropSettings.x + deltaX,
            y: cropSettings.y + deltaY,
            width: cropSettings.width - deltaX,
            height: cropSettings.height - deltaY
          };
          break;
        case 'n': // North edge
          newSettings = {
            ...cropSettings,
            y: cropSettings.y + deltaY,
            height: cropSettings.height - deltaY
          };
          break;
        case 'ne': // Northeast corner
          newSettings = {
            ...cropSettings,
            y: cropSettings.y + deltaY,
            width: cropSettings.width + deltaX,
            height: cropSettings.height - deltaY
          };
          break;
        case 'e': // East edge
          newSettings = {
            ...cropSettings,
            width: cropSettings.width + deltaX
          };
          break;
        case 'se': // Southeast corner
          newSettings = {
            ...cropSettings,
            width: cropSettings.width + deltaX,
            height: cropSettings.height + deltaY
          };
          break;
        case 's': // South edge
          newSettings = {
            ...cropSettings,
            height: cropSettings.height + deltaY
          };
          break;
        case 'sw': // Southwest corner
          newSettings = {
            x: cropSettings.x + deltaX,
            y: cropSettings.y,
            width: cropSettings.width - deltaX,
            height: cropSettings.height + deltaY
          };
          break;
        case 'w': // West edge
          newSettings = {
            x: cropSettings.x + deltaX,
            y: cropSettings.y,
            width: cropSettings.width - deltaX,
            height: cropSettings.height
          };
          break;
      }
      
      // Update start position for smooth resizing
      setCropStartPosition({ x, y });
    }
    
    // Ensure width and height are not negative
    if (newSettings.width < 0) {
      newSettings.x += newSettings.width;
      newSettings.width = Math.abs(newSettings.width);
    }
    
    if (newSettings.height < 0) {
      newSettings.y += newSettings.height;
      newSettings.height = Math.abs(newSettings.height);
    }
    
    // Apply the new crop settings
    handleCropChange(newSettings);
  };
  
  const handleMouseUp = () => {
    setCropStartPosition(null);
    setResizeMode(null);
  };
  
  const handleDownloadAll = () => {
    const processedVideos = videos.filter(video => video.processed && video.processedUrl);
    if (processedVideos.length === 0) {
      alert('No processed videos available to download.');
      return;
    }
    
    // Create a zip file containing all processed videos
    // For simplicity, we'll just trigger downloads for each video
    processedVideos.forEach(video => {
      if (video.processedUrl) {
        const link = document.createElement('a');
        link.href = video.processedUrl;
        link.download = `cropped-${video.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };
  
  const handleCancelProcessing = () => {
    cancelProcessing();
    setIsProcessing(false);
    setCurrentProcessingVideo(undefined);
    setProcessingProgress(0);
    
    // Display a message about cancellation
    setCompletionMessage('Processing cancelled. Any videos that were already processed are available in the Processed Videos section.');
  };
  
  const closeProcessingDialog = () => {
    // Clear the completion message to hide the dialog
    setCompletionMessage('');
  };
  
  const handleProcessVideo = async () => {
    if (videos.length === 0) {
      alert('Please upload videos before processing.');
      return;
    }
    
    setIsProcessing(true);
    setProcessingProgress(0);
    setErrorMessage(null);
    setCompletionMessage('');
    
    try {
      // Get container dimensions for accurate crop calculation
      const containerDimensions = videoContainerRef.current ? {
        width: videoContainerRef.current.clientWidth,
        height: videoContainerRef.current.clientHeight
      } : { width: 640, height: 360 };
      
      // Get all unprocessed videos
      const unprocessedVideos = videos.filter(video => !video.processed);
      
      // If we have the "Apply to all" toggle on and a current video with valid crop settings,
      // apply those settings to all unprocessed videos
      if (useCurrentCropForAll && currentVideoId) {
        const currentVideo = videos.find(v => v.id === currentVideoId);
        if (currentVideo && currentVideo.cropSettings.width > 0 && currentVideo.cropSettings.height > 0) {
          // First apply the crop settings to all videos
          setVideos(prev => prev.map(video => {
            if (!video.processed && video.id !== currentVideoId) {
              return {
                ...video,
                cropSettings: { ...currentVideo.cropSettings }
              };
            }
            return video;
          }));
          
          // Then prepare all unprocessed videos for processing
          const videosToProcess = unprocessedVideos.map(video => ({
            id: video.id,
            file: video.file,
            cropSettings: video.id === currentVideoId ? video.cropSettings : { ...currentVideo.cropSettings },
            containerDimensions
          }));
          
          // Update videosToProcessWithSettings with these videos
          var videosToProcessWithSettings = videosToProcess;
        }
      } else {
        // Only process videos that have valid crop settings
        const videosWithCropSettings = unprocessedVideos.filter(video => {
          const settings = video.cropSettings;
          return settings && settings.width > 0 && settings.height > 0;
        });
        
        // Map videos to the format expected by processBatchVideos
        var videosToProcessWithSettings = videosWithCropSettings.map(video => ({
          id: video.id,
          file: video.file,
          cropSettings: video.cropSettings,
          containerDimensions
        }));
      }
      
      // If no videos to process, show message and return
      if (videosToProcessWithSettings.length === 0) {
        setIsProcessing(false);
        setCompletionMessage('No videos with valid crop settings found. Please select a video and set crop dimensions first, or make sure you haven\'t already processed all videos.');
        return;
      }
      
      // Process all videos and update UI in real-time as each video completes
      let completedVideos = [];
      let processingError = null;
      
      try {
        completedVideos = await processBatchVideos(
          videosToProcessWithSettings,
          (progress, currentVideo, justCompletedVideo) => {
            // Update progress state
            setProcessingProgress(progress);
            setCurrentProcessingVideo(currentVideo);
            
            // If a video was just completed, update the UI immediately
            if (justCompletedVideo) {
              try {
                // Create a URL for the processed video
                const processedUrl = URL.createObjectURL(justCompletedVideo.processedVideo);
                
                setVideos(prev => prev.map(video => {
                  if (video.id === justCompletedVideo.id) {
                    return {
                      ...video,
                      processed: true,
                      processedUrl
                    };
                  }
                  return video;
                }));
              } catch (urlError) {
                console.error('Error creating URL for processed video:', urlError);
                // Still mark as processed even if URL creation fails
                setVideos(prev => prev.map(video => {
                  if (video.id === justCompletedVideo.id) {
                    return {
                      ...video,
                      processed: true,
                      // No URL, but still processed
                    };
                  }
                  return video;
                }));
              }
            }
          }
        );
      } catch (error) {
        // If processing was cancelled, we still want to keep any completed videos
        if (error.message === 'Processing cancelled') {
          // Just note that processing was cancelled
          processingError = 'Processing was cancelled by user.';
        } else {
          // Save the error to display it later, but don't throw
          processingError = error;
          console.error('Error during batch processing:', error);
        }
      }
      
      // Videos have already been updated in real-time, just finish the process
      setIsProcessing(false);
      setCurrentProcessingVideo(undefined);
      
      // If there was an error during processing, show it
      if (processingError) {
        if (typeof processingError === 'string') {
          setErrorMessage(processingError);
        } else {
          const err = processingError as Error;
          setErrorMessage(formatErrorMessage(err));
        }
      }
      
      // Set completion message based on results
      if (completedVideos.length > 0 && !processingError) {
        setCompletionMessage(`${completedVideos.length} video(s) processed successfully! You can now download them individually or all at once.`);
      } else if (completedVideos.length > 0 && processingError) {
        setCompletionMessage(`${completedVideos.length} video(s) processed successfully, but some errors occurred.`);
      }
    } catch (error) {
      console.error('Unhandled error in video processing:', error);
      const err = error as Error;
      setIsProcessing(false);
      setCurrentProcessingVideo(undefined);
      setErrorMessage(formatErrorMessage(err));
    }
  };
  
  const openPreviewModal = (url: string, name: string, videoId?: string) => {
    setPreviewModal({
      isOpen: true,
      url,
      name,
      videoId
    });
  };
  
  const closePreviewModal = () => {
    setPreviewModal({
      isOpen: false,
      url: '',
      name: '',
      videoId: undefined
    });
  };
  
  const navigateToNextProcessedVideo = () => {
    const processedVideos = videos.filter(v => v.processed && v.processedUrl);
    if (processedVideos.length <= 1 || !previewModal.videoId) return;
    
    const currentIndex = processedVideos.findIndex(v => v.id === previewModal.videoId);
    if (currentIndex === -1) return;
    
    const nextIndex = (currentIndex + 1) % processedVideos.length;
    const nextVideo = processedVideos[nextIndex];
    
    setPreviewModal({
      isOpen: true,
      url: nextVideo.processedUrl!,
      name: nextVideo.name,
      videoId: nextVideo.id
    });
  };
  
  const navigateToPreviousProcessedVideo = () => {
    const processedVideos = videos.filter(v => v.processed && v.processedUrl);
    if (processedVideos.length <= 1 || !previewModal.videoId) return;
    
    const currentIndex = processedVideos.findIndex(v => v.id === previewModal.videoId);
    if (currentIndex === -1) return;
    
    const prevIndex = (currentIndex - 1 + processedVideos.length) % processedVideos.length;
    const prevVideo = processedVideos[prevIndex];
    
    setPreviewModal({
      isOpen: true,
      url: prevVideo.processedUrl!,
      name: prevVideo.name,
      videoId: prevVideo.id
    });
  };
  
  const handleViewProcessedVideo = (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (video && video.processedUrl) {
      openPreviewModal(video.processedUrl, video.name, video.id);
    }
  };
  
  const goToNextVideo = () => {
    if (videos.length <= 1 || !currentVideoId) return;
    
    const currentIndex = videos.findIndex(v => v.id === currentVideoId);
    if (currentIndex === -1) return;
    
    const nextIndex = (currentIndex + 1) % videos.length;
    setCurrentVideoId(videos[nextIndex].id);
  };
  
  const goToPreviousVideo = () => {
    if (videos.length <= 1 || !currentVideoId) return;
    
    const currentIndex = videos.findIndex(v => v.id === currentVideoId);
    if (currentIndex === -1) return;
    
    const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
    setCurrentVideoId(videos[prevIndex].id);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
      {/* Three.js Particle Background */}
      {!isLowPerformance && <EditorParticleBackground quality="low" />}
      <ProcessingStatus 
        isProcessing={isProcessing} 
        progress={processingProgress} 
        currentVideoName={currentProcessingVideo}
        onCancel={handleCancelProcessing}
        onClose={closeProcessingDialog}
        totalVideos={videos.filter(v => !v.processed && v.cropSettings.width > 0).length}
        processedVideos={videos.filter(v => v.processed).length}
        completionMessage={completionMessage}
      />
      <VideoPreviewModal
        isOpen={previewModal.isOpen}
        onClose={closePreviewModal}
        videoUrl={previewModal.url}
        videoName={previewModal.name}
        onPrevious={navigateToPreviousProcessedVideo}
        onNext={navigateToNextProcessedVideo}
        hasMultipleVideos={videos.filter(v => v.processed && v.processedUrl).length > 1}
      />
      <ErrorNotification 
        message={errorMessage} 
        onDismiss={() => setErrorMessage(null)}
        type="error"
      />
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-900 dark:to-teal-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-2 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
                  </svg>
                </div>
                <span className="font-bold text-white">Video Cropper</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/90 dark:bg-gray-800/90 shadow-lg rounded-lg overflow-hidden backdrop-blur-sm border border-teal-100 dark:border-teal-900">
          <div className="p-4 border-b border-teal-200 dark:border-teal-800 bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30">
            <h2 className="text-lg font-medium text-teal-800 dark:text-teal-200">Video Editor</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Upload and crop your video for social media
            </p>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Preview */}
              <div className="lg:col-span-2 space-y-6">
                <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                  {/* Video Navigation Controls */}
                  {videos.length > 1 && currentVideo && (
                    <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between px-2 z-20 pointer-events-none">
                      <button 
                        onClick={goToPreviousVideo}
                        className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 focus:outline-none transition-all pointer-events-auto"
                        aria-label="Previous video"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button 
                        onClick={goToNextVideo}
                        className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 focus:outline-none transition-all pointer-events-auto"
                        aria-label="Next video"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {currentVideo ? (
                    <div 
                      ref={videoContainerRef}
                      className="relative w-full h-full"
                    >
                      <div className="w-full h-full flex flex-col">
                        <div className="flex-grow relative" style={{ paddingBottom: '45px' }}> {/* Container with padding for controls */}
                          <video 
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-contain"
                            src={currentVideo.url}
                            controlsList="nofullscreen nodownload noremoteplayback"
                            disablePictureInPicture
                            controls
                            loop
                          />
                        </div>
                      </div>
                      {cropMode && (
                        <div 
                          className="absolute inset-0 bg-transparent z-10"
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                        ></div>
                      )}
                      {currentVideo.cropSettings.width > 0 && currentVideo.cropSettings.height > 0 && (
                        <div 
                          className="absolute border-2 border-teal-500 bg-teal-500 bg-opacity-20 pointer-events-none"
                          style={{
                            left: `${currentVideo.cropSettings.x}px`,
                            top: `${currentVideo.cropSettings.y}px`,
                            width: `${currentVideo.cropSettings.width}px`,
                            height: `${currentVideo.cropSettings.height}px`
                          }}
                        >
                          {/* Resize handles */}
                          <div className="absolute w-3 h-3 bg-white border border-teal-500 rounded-full -top-1.5 -left-1.5" />
                          <div className="absolute w-3 h-3 bg-white border border-teal-500 rounded-full -top-1.5 -right-1.5" />
                          <div className="absolute w-3 h-3 bg-white border border-teal-500 rounded-full -bottom-1.5 -left-1.5" />
                          <div className="absolute w-3 h-3 bg-white border border-teal-500 rounded-full -bottom-1.5 -right-1.5" />
                          
                          {/* Edge handles */}
                          <div className="absolute w-3 h-3 bg-white border border-teal-500 rounded-full top-1/2 -left-1.5 transform -translate-y-1/2" />
                          <div className="absolute w-3 h-3 bg-white border border-teal-500 rounded-full top-1/2 -right-1.5 transform -translate-y-1/2" />
                          <div className="absolute w-3 h-3 bg-white border border-teal-500 rounded-full left-1/2 -top-1.5 transform -translate-x-1/2" />
                          <div className="absolute w-3 h-3 bg-white border border-teal-500 rounded-full left-1/2 -bottom-1.5 transform -translate-x-1/2" />
                        </div>
                      )}
                      {currentVideo.cropSettings.width > 0 && currentVideo.cropSettings.height > 0 && (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                          <div className="text-white text-xs font-bold bg-gradient-to-r from-teal-600 to-teal-700 px-2 py-1 rounded shadow-sm">
                            Crop Area
                          </div>
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                      <p className="text-gray-500 dark:text-gray-400">No video selected</p>
                    </div>
                  )}
                </div>
                
                {/* Crop Controls */}
                {currentVideo && (
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/40 dark:to-teal-800/40 rounded-lg p-4 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Crop Settings</h3>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-teal-700 dark:text-teal-300 border-b border-teal-200 dark:border-teal-800 pb-1">Crop Mode</h4>
                        <div className="flex items-center">
                          <label className="inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={useCurrentCropForAll} 
                              onChange={(e) => setUseCurrentCropForAll(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className={`relative w-11 h-6 rounded-full peer ${useCurrentCropForAll ? 'bg-orange-600' : 'bg-gray-300 dark:bg-gray-600'} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-orange-500 transition-colors`}>
                              <div className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all duration-200 ${useCurrentCropForAll ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                            <span className="ml-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                              Apply to all
                            </span>
                          </label>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                        {cropMode ? 
                          "Click and drag on the video to set crop area. Use handles to resize." :
                          "Use crop mode to visually select the area to crop, or adjust the values manually below."}
                      </p>
                      {useCurrentCropForAll && (
                        <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded p-2 mb-3">
                          <p className="text-xs text-orange-700 dark:text-orange-300 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>Crop settings will be applied to all videos</span>
                          </p>
                        </div>
                      )}
                      
                      {cropMode && (
                        <div className="mb-3 flex space-x-2 items-center">
                          <div className="text-white text-xs font-medium bg-gradient-to-r from-teal-600 to-teal-700 px-2 py-1 rounded shadow-sm">
                            Click and drag to set crop area
                          </div>
                          <div className="text-white text-xs font-medium bg-gradient-to-r from-orange-600 to-orange-700 px-2 py-1 rounded shadow-sm">
                            Use corner handles to resize
                          </div>
                        </div>
                      )}
                      
                      {cropMode ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setCropMode(false);
                              // Don't automatically play the video when exiting crop mode
                              // This ensures controls remain visible
                            }}
                            className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-teal-600 dark:border-teal-500 rounded-md shadow-sm text-sm font-medium text-teal-700 dark:text-teal-300 bg-white dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-teal-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Exit Crop Mode
                          </button>
                          
                          <button
                            onClick={() => {
                              // Reset crop to center while maintaining original video dimensions
                              const containerWidth = videoContainerRef.current?.clientWidth || 640;
                              const containerHeight = videoContainerRef.current?.clientHeight || 360;
                              
                              // Get video element dimensions
                              let videoWidth = containerWidth;
                              let videoHeight = containerHeight;
                              
                              if (videoRef.current) {
                                // Use actual video dimensions if available
                                videoWidth = videoRef.current.videoWidth || containerWidth;
                                videoHeight = videoRef.current.videoHeight || containerHeight;
                                
                                // Scale to fit container while maintaining aspect ratio
                                const containerRatio = containerWidth / containerHeight;
                                const videoRatio = videoWidth / videoHeight;
                                
                                if (videoRatio > containerRatio) {
                                  // Video is wider than container
                                  videoWidth = containerWidth;
                                  videoHeight = containerWidth / videoRatio;
                                } else {
                                  // Video is taller than container
                                  videoHeight = containerHeight;
                                  videoWidth = containerHeight * videoRatio;
                                }
                              }
                              
                              // Center the crop area using original video dimensions
                              const x = Math.max(0, Math.floor((containerWidth - videoWidth) / 2));
                              const y = Math.max(0, Math.floor((containerHeight - videoHeight) / 2));
                              
                              handleCropChange({ x, y, width: videoWidth, height: videoHeight });
                            }}
                            className="inline-flex justify-center items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            // Enter crop mode and pause video
                            setCropMode(true);
                            if (videoRef.current) {
                              videoRef.current.pause();
                            }
                            
                            // If no crop area is set, initialize with a default centered crop
                            if (currentVideo.cropSettings.width === 0 || currentVideo.cropSettings.height === 0) {
                              const containerWidth = videoContainerRef.current?.clientWidth || 640;
                              const containerHeight = videoContainerRef.current?.clientHeight || 360;
                              
                              // Get video element dimensions if available
                              let cropWidth, cropHeight;
                              
                              if (videoRef.current && videoRef.current.videoWidth && videoRef.current.videoHeight) {
                                // Use actual video dimensions if available
                                const videoWidth = videoRef.current.videoWidth;
                                const videoHeight = videoRef.current.videoHeight;
                                
                                // Scale to fit container while maintaining aspect ratio
                                const containerRatio = containerWidth / containerHeight;
                                const videoRatio = videoWidth / videoHeight;
                                
                                if (videoRatio > containerRatio) {
                                  // Video is wider than container
                                  cropWidth = containerWidth;
                                  cropHeight = containerWidth / videoRatio;
                                } else {
                                  // Video is taller than container
                                  cropHeight = containerHeight;
                                  cropWidth = containerHeight * videoRatio;
                                }
                              } else {
                                // Fallback to aspect ratio if video dimensions aren't available
                                const [width, height] = aspectRatio.split(":").map(Number);
                                const aspectRatioValue = width / height;
                                
                                // Set a reasonable size based on the aspect ratio
                                cropWidth = Math.min(300, containerWidth * 0.7);
                                cropHeight = Math.round(cropWidth / aspectRatioValue);
                              }
                              
                              // Center the crop area
                              const x = Math.max(0, Math.floor((containerWidth - cropWidth) / 2));
                              const y = Math.max(0, Math.floor((containerHeight - cropHeight) / 2));
                              
                              handleCropChange({ x, y, width: cropWidth, height: cropHeight });
                            }
                          }}
                          className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all transform hover:scale-105 duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7v10m5-5H5" />
                          </svg>
                          Enter Crop Mode
                        </button>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-teal-700 dark:text-teal-300 mb-2 border-b border-teal-200 dark:border-teal-800 pb-1">Dimensions & Position</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <span>Width</span>
                            <span className="text-teal-600 dark:text-teal-400 font-bold">{currentVideo.cropSettings.width}px</span>
                          </label>
                          <input
                            type="range"
                            min="10"
                            max={videoContainerRef.current?.clientWidth || 640}
                            value={currentVideo.cropSettings.width}
                            onChange={(e) => handleCropChange({...currentVideo.cropSettings, width: parseInt(e.target.value) || 0})}
                            className="block w-full accent-teal-600 dark:accent-teal-500 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          />
                          <input
                            type="number"
                            value={currentVideo.cropSettings.width}
                            onChange={(e) => handleCropChange({...currentVideo.cropSettings, width: parseInt(e.target.value) || 0})}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-teal-300 dark:border-teal-700 rounded-md shadow-sm text-sm font-medium text-teal-800 dark:text-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>
                        <div>
                          <label className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <span>Height</span>
                            <span className="text-teal-600 dark:text-teal-400 font-bold">{currentVideo.cropSettings.height}px</span>
                          </label>
                          <input
                            type="range"
                            min="10"
                            max={videoContainerRef.current?.clientHeight || 360}
                            value={currentVideo.cropSettings.height}
                            onChange={(e) => handleCropChange({...currentVideo.cropSettings, height: parseInt(e.target.value) || 0})}
                            className="block w-full accent-teal-600 dark:accent-teal-500 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          />
                          <input
                            type="number"
                            value={currentVideo.cropSettings.height}
                            onChange={(e) => handleCropChange({...currentVideo.cropSettings, height: parseInt(e.target.value) || 0})}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-teal-300 dark:border-teal-700 rounded-md shadow-sm text-sm font-medium text-teal-800 dark:text-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>
                        <div>
                          <label className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <span>X Position</span>
                            <span className="text-orange-600 dark:text-orange-400 font-bold">{currentVideo.cropSettings.x}px</span>
                          </label>
                          <input
                            type="range"
                            min="0"
                            max={(videoContainerRef.current?.clientWidth || 640) - currentVideo.cropSettings.width}
                            value={currentVideo.cropSettings.x}
                            onChange={(e) => handleCropChange({...currentVideo.cropSettings, x: parseInt(e.target.value) || 0})}
                            className="block w-full accent-orange-600 dark:accent-orange-500 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          />
                          <input
                            type="number"
                            value={currentVideo.cropSettings.x}
                            onChange={(e) => handleCropChange({...currentVideo.cropSettings, x: parseInt(e.target.value) || 0})}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-orange-300 dark:border-orange-700 rounded-md shadow-sm text-sm font-medium text-orange-800 dark:text-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <span>Y Position</span>
                            <span className="text-orange-600 dark:text-orange-400 font-bold">{currentVideo.cropSettings.y}px</span>
                          </label>
                          <input
                            type="range"
                            min="0"
                            max={(videoContainerRef.current?.clientHeight || 360) - currentVideo.cropSettings.height}
                            value={currentVideo.cropSettings.y}
                            onChange={(e) => handleCropChange({...currentVideo.cropSettings, y: parseInt(e.target.value) || 0})}
                            className="block w-full accent-orange-600 dark:accent-orange-500 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          />
                          <input
                            type="number"
                            value={currentVideo.cropSettings.y}
                            onChange={(e) => handleCropChange({...currentVideo.cropSettings, y: parseInt(e.target.value) || 0})}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-orange-300 dark:border-orange-700 rounded-md shadow-sm text-sm font-medium text-orange-800 dark:text-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Aspect Ratio Presets
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { name: "16:9", width: 16, height: 9 },
                          { name: "9:16", width: 9, height: 16 },
                          { name: "1:1", width: 1, height: 1 },
                          { name: "4:5", width: 4, height: 5 },
                          { name: "4:3", width: 4, height: 3 },
                          { name: "3:4", width: 3, height: 4 }
                        ].map((ratio) => (
                          <button
                            key={ratio.name}
                            onClick={() => handleAspectRatioChange(ratio.name)}
                            className={`px-3 py-1 text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                              aspectRatio === ratio.name
                                ? "bg-gradient-to-r from-teal-100 to-teal-200 border-teal-300 text-teal-800 dark:from-teal-900 dark:to-teal-800 dark:border-teal-700 dark:text-teal-200 font-medium"
                                : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {ratio.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                {/* Upload Section */}
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/40 dark:to-teal-800/40 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Upload Videos</h3>
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors duration-200">
                    <input 
                      type="file" 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="video/*"
                      multiple
                      disabled={videos.length >= 10}
                    />
                    {isUploading ? (
                      <div className="flex flex-col items-center justify-center">
                        <svg className="animate-spin h-10 w-10 text-teal-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm text-teal-600 dark:text-teal-400 font-medium">
                          Uploading videos...
                        </span>
                      </div>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Click to upload multiple videos
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500 block mt-1">
                          Supports MP4, WebM, MOV (max 100MB, max 60 seconds)
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500 block mt-1">
                          Maximum 10 videos allowed ({10 - videos.length} slots remaining)
                        </span>
                      </>
                    )}
                  </label>
                </div>
                
                {/* Source Video List */}
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/40 dark:to-teal-800/40 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Source Videos ({videos.length})</h3>
                  {videos.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {videos.map(video => (
                        <div 
                          key={video.id} 
                          className={`flex items-center justify-between p-2 rounded-md ${currentVideoId === video.id ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                          onClick={() => setCurrentVideoId(video.id)}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-800 dark:to-teal-700 rounded flex items-center justify-center mr-2 shadow-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="truncate max-w-[120px]">
                              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{video.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {video.error ? (
                                  <span className="text-red-500">Error</span>
                                ) : video.processed ? 'Processed' : 'Ready to process'}
                              </p>
                              {video.error && (
                                <p className="text-xs text-red-500 truncate" title={video.error}>
                                  {video.error.length > 20 ? video.error.substring(0, 20) + '...' : video.error}
                                </p>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRemoveVideo(video.id); }}
                            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                      No videos uploaded yet
                    </p>
                  )}
                </div>
                
                {/* Processed Video List */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Processed Videos ({videos.filter(v => v.processed).length})
                    </h3>
                    {videos.filter(v => v.processed).length > 0 && (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleDownloadAll}
                          className="text-xs px-2 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download All
                        </button>
                        <button
                          onClick={() => {
                            // Reset all processed videos
                            setVideos(prev => prev.map(video => ({
                              ...video,
                              processed: false,
                              processedUrl: undefined
                            })));
                          }}
                          className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete All
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {videos.filter(v => v.processed).length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {videos.filter(v => v.processed).map(video => (
                        <div 
                          key={`processed-${video.id}`} 
                          className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                          onClick={() => video.processedUrl && openPreviewModal(video.processedUrl, video.name)}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded flex items-center justify-center mr-2 shadow-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div className="truncate max-w-[120px]">
                              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">cropped-{video.name}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewProcessedVideo(video.id);
                              }}
                              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 text-xs font-medium flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Preview
                            </button>
                            <a 
                              href={video.processedUrl} 
                              download={`cropped-${video.name}`}
                              className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 text-xs font-medium flex items-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download
                            </a>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveProcessedVideo(video.id);
                              }}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xs font-medium flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                      No processed videos yet
                    </p>
                  )}
                </div>
                
                {/* Process Section */}
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/40 dark:to-teal-800/40 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Process Video</h3>
                  

                  
                  <button
                    onClick={handleProcessVideo}
                    disabled={isProcessing || videos.length === 0}
                    className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 duration-200 mt-4"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Process Videos"
                    )}
                  </button>
                </div>
                
                {/* Instructions */}
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/40 dark:to-teal-800/40 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">How to Use</h3>
                  <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Upload multiple videos using the upload section</li>
                    <li>Select a video from the list to edit</li>
                    <li>Adjust the crop settings or select a preset aspect ratio</li>
                    <li>Click "Process Video" to crop all videos</li>
                    <li>Download the processed videos when ready</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
