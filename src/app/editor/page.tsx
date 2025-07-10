"use client";

// This prevents static generation errors with useSearchParams
export const dynamic = 'force-dynamic';
import { useState, useRef, useEffect, Suspense } from "react";
import { setEditorSettingsCookie, getEditorSettingsCookie, DEFAULT_EDITOR_SETTINGS, EditorSettings } from "@/utils/cookies";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { processBatchVideos, cancelProcessing, loadFFmpeg } from "@/utils/ffmpeg";
import { usePathname, useSearchParams } from "next/navigation";
import { 
  getMaxUploadLimitBySubscription, 
  getMonthlyLimitBySubscription, 
  getVideoDurationLimitBySubscription, 
  getVideoSizeLimitBySubscription, 
  getVideoLimitBySubscription // For backward compatibility
} from '@/utils/subscriptionLimits';
import { 
  initializeVideoUsageTracking, 
  startNewUploadSession, 
  checkUploadSessionLimit, 
  checkCreditLimit, 
  recordVideoUpload, 
  recordVideoProcessed, 
  getUserUsageStats 
} from '@/utils/usageTracking';
import {
  initConnectionMonitoring,
  onConnectionLost,
  onConnectionRestored,
  isOnline
} from '@/utils/connectionMonitor';
import ProcessingStatus from "@/components/ProcessingStatus";
import VideoPreviewModal from "@/components/VideoPreviewModal";

import { validateVideo, sanitizeFilename } from "@/utils/fileValidation";
import { logError, formatErrorMessage } from "@/utils/errorHandling";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import ErrorNotification from "@/components/ErrorNotification";

// Inner component that uses searchParams (needs to be wrapped in Suspense)
function EditorContent() {
  const { user, subscription } = useAuth();
  
  // Get limits based on subscription
  const uploadLimit = getMaxUploadLimitBySubscription(user, subscription);
  const monthlyLimit = getMonthlyLimitBySubscription(user, subscription);
  const durationLimit = getVideoDurationLimitBySubscription(user, subscription);
  const sizeLimit = getVideoSizeLimitBySubscription(user, subscription);
  
  // For backward compatibility - some components might still use videoLimit
  const videoLimit = uploadLimit;
  
  // State to track credit usage information
  const [usageInfo, setUsageInfo] = useState<{
    uploadSessionUsed: number;
    uploadSessionRemaining: number;
    creditsUsed: number;
    creditsRemaining: number | "Unlimited";
  }>({ 
    uploadSessionUsed: 0, 
    uploadSessionRemaining: uploadLimit, 
    creditsUsed: 0, 
    creditsRemaining: typeof monthlyLimit === "number" ? monthlyLimit : "Unlimited" 
  });
  
  // Function to refresh usage stats from the tracking system
  const refreshUsageStats = async () => {
    try {
      const stats = await getUserUsageStats(user?.uid, true); // Force refresh to get latest data
      
      setUsageInfo({
        uploadSessionUsed: stats.uploadSession.used,
        uploadSessionRemaining: typeof stats.uploadSession.remaining === "number" ? stats.uploadSession.remaining : uploadLimit,
        creditsUsed: stats.monthly.used,
        creditsRemaining: stats.monthly.remaining
      });
      
      console.log('Usage stats refreshed:', stats);
    } catch (error) {
      console.error('Error refreshing usage stats:', error);
    }
  };
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  


  interface Video {
    id: string;
    name: string;
    file: File;
    url: string;
    processed: boolean;
    duration?: number;
    cropSettings: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    processedUrl?: string;
    error?: string;
  }

  interface ValidatedVideo extends Video {
    error?: string;
  }

  const [videos, setVideos] = useState<Video[]>([]);
  
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>(() => {
    const savedSettings = getEditorSettingsCookie();
    return savedSettings?.aspectRatio || DEFAULT_EDITOR_SETTINGS.aspectRatio;
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [currentProcessingVideo, setCurrentProcessingVideo] = useState<string | undefined>(undefined);
  const [completionMessage, setCompletionMessage] = useState<string | undefined>();
  const [isConnected, setIsConnected] = useState<boolean>(true); // Track internet connection

  const [cropMode, setCropMode] = useState(false);
  const [cropStartPosition, setCropStartPosition] = useState<{ x: number; y: number } | null>(null);
  const [resizeMode, setResizeMode] = useState<string | null>(null); // 'nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'
  const [previewModal, setPreviewModal] = useState<{isOpen: boolean, url: string, name: string, videoId?: string}>({isOpen: false, url: '', name: ''});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [useCurrentCropForAll, setUseCurrentCropForAll] = useState(() => {
    const savedSettings = getEditorSettingsCookie();
    return savedSettings?.useCurrentCropForAll || DEFAULT_EDITOR_SETTINGS.useCurrentCropForAll;
  });
  
  // Mobile detection for responsive UI adjustments
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const currentVideo = videos.find(v => v.id === currentVideoId) || null;
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize video usage tracking when component mounts
  useEffect(() => {
    initializeVideoUsageTracking();
    startNewUploadSession();
    
    const refreshUsageStats = async () => {
      try {
        // Clear the app state cache to force a fresh read from the cookie
        const cookieData = document.cookie;
        console.log('Refreshing usage stats, current cookies:', cookieData);
        
        // Wait a moment to ensure cookie updates are processed
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const stats = await getUserUsageStats(user?.uid);
        console.log('Fresh usage stats:', stats);
        
        setUsageInfo({
          uploadSessionUsed: stats.uploadSession.used,
          uploadSessionRemaining: stats.uploadSession.remaining,
          creditsUsed: stats.monthly.used,
          creditsRemaining: typeof stats.monthly.remaining === 'number' 
            ? stats.monthly.remaining 
            : 'Unlimited'
        });
      } catch (error) {
        console.error('Error refreshing usage stats:', error);
      }
    };
    
    refreshUsageStats();
  }, [user?.uid]);
  

  
  const handleBack = () => {
    router.back();
  };

  const handleProfileClick = () => {
    if (user) {
      router.push('/profile');
    } else {
      // Redirect to auth page with return URL
      const returnPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      router.push(`/auth?returnUrl=${encodeURIComponent(returnPath)}`);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setIsUploading(true);
      setErrorMessage(null);
      
      try {
        const files = Array.from(event.target.files);
        const validatedVideos: ValidatedVideo[] = [];
        
        // Check upload session and credit limits
        const sessionLimits = await checkUploadSessionLimit(user?.uid);
        const creditLimits = await checkCreditLimit(user?.uid);

        // Update usage info
        setUsageInfo({
          uploadSessionUsed: sessionLimits.currentCount,
          uploadSessionRemaining: sessionLimits.remaining,
          creditsUsed: typeof creditLimits.currentCount === 'number' ? creditLimits.currentCount : 0,
          creditsRemaining: creditLimits.remaining
        });
        
        // Check if credit limit would be exceeded
        if (typeof creditLimits.remaining === 'number' && creditLimits.remaining <= 0) {
          setErrorMessage(`You've reached your credit limit of ${creditLimits.limit} credits. Please upgrade your plan for more processing capacity.`);
          setIsUploading(false);
          return;
        }
        
        // Check if adding these files would exceed the configured upload limit
        const currentCount = videos.length;
        const remainingSlots = Math.min(
          sessionLimits.remaining, 
          uploadLimit - currentCount
        );
        
        if (remainingSlots <= 0) {
          setErrorMessage(`Maximum limit of ${uploadLimit} videos per session reached. Please process or remove some videos before adding more.`);
          setIsUploading(false);
          return;
        }
        
        // Limit the number of files to process
        const filesToProcess = files.slice(0, remainingSlots);
        
        if (files.length > remainingSlots) {
          setErrorMessage(`Only processing ${remainingSlots} of ${files.length} videos due to the ${uploadLimit} video limit.`);
        }
        
        // Record video upload
        recordVideoUpload(filesToProcess.length);
        
        for (const file of filesToProcess) {
          const validation = await validateVideo(file, sizeLimit, durationLimit);
          
          const video: ValidatedVideo = {
              id: Math.random().toString(36).substring(2, 9),
              name: sanitizeFilename(file.name),
              file: file,
              url: URL.createObjectURL(file),
              processed: false,
              duration: validation.duration,
              cropSettings: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
              }
            };
            if (!validation.valid) {
              video.error = validation.errors.join(', ');
            }
            validatedVideos.push(video);
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
    setAspectRatio(ratio);
    
    // Save to cookie for persistence
    const currentSettings = getEditorSettingsCookie() || DEFAULT_EDITOR_SETTINGS;
    setEditorSettingsCookie({
      aspectRatio: ratio,
      useCurrentCropForAll: currentSettings.useCurrentCropForAll,
      lastUploadDirectory: currentSettings.lastUploadDirectory
    });
  };
  
  const handleUseCurrentCropForAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setUseCurrentCropForAll(newValue);
    
    // If turning on and we have a current video with crop settings, apply to all
    if (newValue && currentVideo) {
      const { cropSettings } = currentVideo;
      
      // Only apply if crop settings have been adjusted (not default 0,0,0,0)
      if (cropSettings.width > 0 && cropSettings.height > 0) {
        setVideos(prev => prev.map(video => {
          // Skip the current video as it already has these settings
          if (video.id === currentVideoId) return video;
          
          return {
            ...video,
            cropSettings: { ...cropSettings }
          };
        }));
      }
    }
    
    // Save to cookie for persistence
    const currentSettings = getEditorSettingsCookie() || DEFAULT_EDITOR_SETTINGS;
    setEditorSettingsCookie({
      aspectRatio: currentSettings.aspectRatio,
      useCurrentCropForAll: newValue,
      lastUploadDirectory: currentSettings.lastUploadDirectory
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
  
  // Handle touch start for mobile devices
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cropMode || !currentVideo) return;
    
    // Prevent scrolling while cropping - must prevent default on all touch events
    e.preventDefault();
    e.stopPropagation();
    
    // Get the position relative to the container
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    // Create a synthetic mouse event for resize mode detection
    const syntheticEvent = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      currentTarget: e.currentTarget
    };
    
    // Check if we're near an edge for resizing
    const mode = getResizeMode(syntheticEvent as any, currentVideo.cropSettings);
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
  
  // Handle touch move for mobile devices
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cropMode || !currentVideo || !cropStartPosition) return;
    
    // Prevent scrolling while cropping
    e.preventDefault();
    e.stopPropagation();
    
    // Get the position relative to the container
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
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
      // Resizing the crop area - reuse the same logic as mouse move
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
            x: cropSettings.x,
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
    
    // Make sure crop area stays within video boundaries
    const containerWidth = videoContainerRef.current?.offsetWidth || 0;
    const containerHeight = videoContainerRef.current?.offsetHeight || 0;
    
    newSettings.x = Math.max(0, Math.min(newSettings.x, containerWidth - 10));
    newSettings.y = Math.max(0, Math.min(newSettings.y, containerHeight - 10));
    newSettings.width = Math.min(newSettings.width, containerWidth - newSettings.x);
    newSettings.height = Math.min(newSettings.height, containerHeight - newSettings.y);
    
    // Update the crop settings
    handleCropChange(newSettings);
  };
  
  // Handle touch end for mobile devices
  const handleTouchEnd = () => {
    setCropStartPosition(null);
    setResizeMode(null);
  };
  
  // Prevent document scrolling when in crop mode
  useEffect(() => {
    if (!cropMode) return;
    
    // Save current scroll position
    const scrollY = window.scrollY;
    
    // Save current body style
    const originalStyle = document.body.style.cssText;
    const originalTouchAction = document.body.style.touchAction;
    
    // Instead of completely disabling scrolling, we'll just make the crop area use touch-none
    // This allows scrolling to reach the exit button if needed
    const cropArea = document.querySelector('.crop-area-container');
    if (cropArea) {
      cropArea.setAttribute('style', 'touch-action: none;');
    }
    
    // Only prevent touchmove events on the crop area itself, not the entire document
    document.body.style.touchAction = 'pan-y';  // Allow vertical scrolling
    
    // This handler will be applied to the entire document
    const preventTouchMove = (e: TouchEvent) => {
      if (cropMode) {
        e.preventDefault();
      }
    };
    
    // Add event listener with passive: false to allow preventDefault
    document.addEventListener('touchmove', preventTouchMove, { passive: false });
    
    // Cleanup function
    return () => {
      // Restore original styles
      document.body.style.cssText = originalStyle;
      document.body.style.touchAction = originalTouchAction;
      
      // Reset crop area touch action
      const cropArea = document.querySelector('.crop-area-container');
      if (cropArea) {
        cropArea.removeAttribute('style');
      }
      
      // Remove event listener
      document.removeEventListener('touchmove', preventTouchMove);
    };
  }, [cropMode]);
  
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
    
    // Check credit limits before processing
    const creditLimits = await checkCreditLimit(user?.uid);
    
    // Update usage info
    setUsageInfo(prev => ({
      ...prev,
      creditsUsed: typeof creditLimits.currentCount === 'number' ? creditLimits.currentCount : 0,
      creditsRemaining: creditLimits.remaining
    }));
    
    // Check if credit limit would be exceeded
    if (typeof creditLimits.remaining === 'number' && creditLimits.remaining <= 0) {
      setErrorMessage(`You've reached your credit limit of ${creditLimits.limit} credits. Please upgrade your plan for more processing capacity.`);
      return;
    }
    
    // Get unprocessed videos to check if we have enough credits
    const unprocessedVideos = videos.filter(video => !video.processed);
    if (typeof creditLimits.remaining === 'number' && unprocessedVideos.length > creditLimits.remaining) {
      if (!
        window.confirm(`You have ${creditLimits.remaining} credits remaining, but are trying to process ${unprocessedVideos.length} videos. Only the first ${creditLimits.remaining} videos will be processed. Continue?`)
      ) {
        return;
      }
    }
    
    setIsProcessing(true);
    setProcessingProgress(0);
    setErrorMessage(null);
    setCompletionMessage('');

    try {
      // Initialize FFmpeg if not already initialized
      await loadFFmpeg();
    } catch (error) {
      console.error('Failed to initialize FFmpeg:', error);
      setIsProcessing(false);
      setErrorMessage('Failed to initialize video processing. Please try again.');
      return;
    }
    
    try {
      // Get container dimensions for accurate crop calculation
      const containerDimensions = videoContainerRef.current ? {
        width: videoContainerRef.current.clientWidth,
        height: videoContainerRef.current.clientHeight
      } : { width: 640, height: 360 };
      
      // Initialize the processing array
      let videosToProcessWithSettings: Array<{ id: string; file: File; cropSettings: { x: number; y: number; width: number; height: number }; containerDimensions: { width: number; height: number } }> = [];

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
          
          videosToProcessWithSettings = videosToProcess;
        }
      } else {
        // Only process videos that have valid crop settings
        const videosWithCropSettings = unprocessedVideos.filter(video => {
          const settings = video.cropSettings;
          return settings && settings.width > 0 && settings.height > 0;
        });
        
        // Map videos to the format expected by processBatchVideos
        videosToProcessWithSettings = videosWithCropSettings.map(video => ({
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
            // Update progress state - processBatchVideos already returns percentages (0-100)
            // so we don't need to multiply by 100 again
            setProcessingProgress(progress);
            setCurrentProcessingVideo(currentVideo);
            
            // If a video was just completed, update the UI immediately
            if (justCompletedVideo) {
              try {
                // Create a URL for the processed video
                const processedUrl = URL.createObjectURL(justCompletedVideo.processedVideo);
                
                // Find the original video to get its details
                const originalVideo = videos.find(v => v.id === justCompletedVideo.id);
                
                // Record this processed video in our usage tracking system
                if (originalVideo) {
                  const fileSize = Math.round(originalVideo.file.size / (1024 * 1024)); // Convert to MB
                  const duration = originalVideo.duration || 0;
                  
                  // Record the processed video in our usage tracking and update the database
                  recordVideoProcessed(justCompletedVideo.id, fileSize, duration, user?.uid)
                    .then(() => {
                      console.log('Video processed, credit used for:', justCompletedVideo.id);
                    })
                    .catch(error => {
                      console.error('Error recording video processing:', error);
                    });
                  
                  // Use our dedicated function to refresh the usage stats
                  refreshUsageStats();
                  
                  // Also refresh after a slight delay to ensure cookie updates are processed
                  setTimeout(() => {
                    refreshUsageStats();
                  }, 500);
                }
                
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
        if (error instanceof Error && error.message === 'Processing cancelled') {
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-teal-300 to-teal-400 rounded-full filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute -top-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full filter blur-3xl opacity-10 animate-pulse delay-700" />
        <div className="absolute bottom-40 right-10 w-72 h-72 bg-gradient-to-br from-orange-300 to-pink-400 rounded-full filter blur-3xl opacity-10 animate-pulse delay-500" />
      </div>
      <ProcessingStatus 
        isProcessing={isProcessing} 
        progress={processingProgress} 
        currentVideoName={currentProcessingVideo}
        onCancel={handleCancelProcessing}
        onClose={closeProcessingDialog}
        totalVideos={videos.length} /* Count all videos */
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
      
      {/* Back Button and Usage Stats */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 relative z-10">
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            className="group relative overflow-hidden p-2 rounded-lg text-teal-600 dark:text-teal-400 transition-all duration-300 flex items-center shadow-sm hover:shadow-md"
            title="Back"
          >
            <span className="absolute inset-0 w-full h-full bg-teal-50 dark:bg-teal-900/30 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium">Back</span>
            </span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 relative z-10">
        <div className="bg-white/95 dark:bg-gray-800/95 shadow-xl rounded-xl overflow-hidden backdrop-blur-sm border border-teal-100 dark:border-teal-900 transition-all duration-300 hover:shadow-2xl">
          
          <div className="p-5 border-b border-teal-200 dark:border-teal-800 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/40 dark:to-blue-900/40">
            <div className="flex items-center">
              <div className="mr-3 bg-gradient-to-br from-teal-500 to-blue-500 text-white p-2 rounded-lg shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-300 dark:to-blue-300">Video Editor</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Upload and crop your videos for social media
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-2 sm:p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Video Preview */}
              <div className="md:col-span-1 lg:col-span-2 space-y-4 md:space-y-6">
                <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden relative shadow-xl border border-gray-800 transition-all duration-300 hover:shadow-2xl hover:border-gray-700">
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
                        <>
                          <div 
                            className="absolute inset-0 bg-transparent z-10 crop-area-container"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                          ></div>
                          
                          {/* Mobile-friendly Done button to exit crop mode */}
                          <button
                            onClick={() => setCropMode(false)}
                            className="absolute top-4 right-4 z-30 bg-teal-600 text-white rounded-full px-4 py-2 shadow-lg font-bold"
                            style={{ fontSize: '16px' }}
                          >
                            Done
                          </button>
                        </>
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
                
                {/* Process Button Below Video */}
                <div className="flex justify-end mt-2 gap-2">
                  {/* Crop Mode Toggle Button (left of Process) */}
                  {!cropMode ? (
                    <button
                      onClick={() => {
                        if (!currentVideo) {
                          setErrorMessage('Please upload a video first.');
                          return;
                        }
                        setCropMode(true);
                        if (videoRef.current) {
                          videoRef.current.pause();
                        }
                        if (currentVideo.cropSettings.width === 0 || currentVideo.cropSettings.height === 0) {
                          const containerWidth = videoContainerRef.current?.clientWidth || 640;
                          const containerHeight = videoContainerRef.current?.clientHeight || 360;
                          let cropWidth, cropHeight;
                          if (videoRef.current && videoRef.current.videoWidth && videoRef.current.videoHeight) {
                            const videoWidth = videoRef.current.videoWidth;
                            const videoHeight = videoRef.current.videoHeight;
                            const containerRatio = containerWidth / containerHeight;
                            const videoRatio = videoWidth / videoHeight;
                            if (videoRatio > containerRatio) {
                              cropWidth = containerWidth;
                              cropHeight = containerWidth / videoRatio;
                            } else {
                              cropHeight = containerHeight;
                              cropWidth = containerHeight * videoRatio;
                            }
                          } else {
                            const [width, height] = aspectRatio.split(":").map(Number);
                            const aspectRatioValue = width / height;
                            cropWidth = Math.min(300, containerWidth * 0.7);
                            cropHeight = Math.round(cropWidth / aspectRatioValue);
                          }
                          const x = Math.max(0, Math.floor((containerWidth - cropWidth) / 2));
                          const y = Math.max(0, Math.floor((containerHeight - cropHeight) / 2));
                          handleCropChange({ x, y, width: cropWidth, height: cropHeight });
                        }
                      }}
                      className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-[#fd7e14] hover:bg-[#e8730f] transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Enter Crop Mode
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (!currentVideo) {
                          setErrorMessage('Please upload a video first.');
                          return;
                        }
                        setCropMode(false);
                      }}
                      className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Exit Crop Mode
                    </button>
                  )}
                    {/* Process Button */}
                    <button
                    onClick={() => {
                      if (!currentVideo) {
                        setErrorMessage('Please upload a video first.');
                        return;
                      }
                      handleProcessVideo();
                    }}
                      disabled={isProcessing || videos.length === 0}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-md hover:shadow-lg transform hover:translate-y-[-1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none overflow-hidden group"
                    >
                      <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                      {isProcessing ? (
                        <div className="flex items-center">
                          <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          </svg>
                          <span>Process</span>
                        </div>
                      )}
                    </button>
                  </div>
                
                {/* Crop Controls */}
                {currentVideo && (
                  <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-900/80 dark:via-purple-900/20 dark:to-slate-800/60 rounded-lg p-5 shadow-lg border border-purple-200/50 dark:border-purple-800/30 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-200 mb-4">Crop Settings</h3>
                    
                    <div className="mb-5">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-base font-medium text-teal-700 dark:text-teal-300">Crop Mode</h4>
                        <div className="flex items-center">
                          <label className="inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={useCurrentCropForAll} 
                              onChange={(e) => setUseCurrentCropForAll(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className={`relative w-12 h-6 rounded-full peer ${useCurrentCropForAll ? 'bg-teal-400' : 'bg-gray-300 dark:bg-gray-600'} peer-focus:outline-none transition-colors`}>
                              <div className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow transition-all duration-200 ${useCurrentCropForAll ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                            <span className="ml-2 text-sm font-medium text-teal-700 dark:text-teal-300">
                              Apply to all
                            </span>
                          </label>
                        </div>
                      </div>
                      <p className="text-sm text-teal-700 dark:text-teal-400 mb-3">
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
                        <div className="mb-3 flex flex-wrap gap-2 items-center">
                          <div className="text-white text-xs font-medium bg-gradient-to-r from-teal-600 to-teal-700 px-2 py-1 rounded shadow-sm">
                            Click and drag to set crop area
                          </div>
                          <div className="text-white text-xs font-medium bg-gradient-to-r from-orange-600 to-orange-700 px-2 py-1 rounded shadow-sm">
                            Use corner handles to resize
                          </div>
                        </div>
                      )}
                      
                      {cropMode ? (
                        <div className="flex flex-wrap gap-2">
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
                          className="w-full inline-flex justify-center items-center px-4 py-3 rounded-md text-sm font-medium text-white bg-[#fd7e14] hover:bg-[#e8730f] transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Enter Crop Mode
                        </button>
                      )}
                    </div>
                    
                    <div className="mb-5">
                      <h4 className="text-base font-medium text-teal-700 dark:text-teal-300 mb-3">Dimensions & Position</h4>
                      <div className="grid grid-cols-2 gap-4 mb-5">
                        <div>
                          <label className="flex items-center justify-between text-sm font-medium text-teal-700 dark:text-teal-300 mb-1">
                            <span>Width</span>
                            <span className="text-teal-600 dark:text-teal-400">{currentVideo.cropSettings.width}px</span>
                          </label>
                          <input
                            type="range"
                            min="10"
                            max={videoContainerRef.current?.clientWidth || 640}
                            value={currentVideo.cropSettings.width}
                            onChange={(e) => handleCropChange({...currentVideo.cropSettings, width: parseInt(e.target.value) || 0})}
                            className="block w-full accent-teal-500 h-1 bg-teal-100 dark:bg-teal-700 rounded-lg appearance-none cursor-pointer mb-2"
                          />
                          <div className="relative">
                            <input
                              type="number"
                              value={currentVideo.cropSettings.width}
                              onChange={(e) => handleCropChange({...currentVideo.cropSettings, width: parseInt(e.target.value) || 0})}
                              className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-teal-200 dark:border-teal-700 rounded-md text-sm text-teal-800 dark:text-teal-200 focus:outline-none focus:border-teal-400"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-teal-500 dark:text-teal-400 text-sm">
                              0px
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="flex items-center justify-between text-sm font-medium text-teal-700 dark:text-teal-300 mb-1">
                            <span>Height</span>
                            <span className="text-teal-600 dark:text-teal-400">{currentVideo.cropSettings.height}px</span>
                          </label>
                          <input
                            type="range"
                            min="10"
                            max={videoContainerRef.current?.clientHeight || 360}
                            value={currentVideo.cropSettings.height}
                            onChange={(e) => handleCropChange({...currentVideo.cropSettings, height: parseInt(e.target.value) || 0})}
                            className="block w-full accent-teal-500 h-1 bg-teal-100 dark:bg-teal-700 rounded-lg appearance-none cursor-pointer mb-2"
                          />
                          <div className="relative">
                            <input
                              type="number"
                              value={currentVideo.cropSettings.height}
                              onChange={(e) => handleCropChange({...currentVideo.cropSettings, height: parseInt(e.target.value) || 0})}
                              className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-teal-200 dark:border-teal-700 rounded-md text-sm text-teal-800 dark:text-teal-200 focus:outline-none focus:border-teal-400"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-teal-500 dark:text-teal-400 text-sm">
                              0px
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="flex items-center justify-between text-sm font-medium text-teal-700 dark:text-teal-300 mb-1">
                            <span>X Position</span>
                            <span className="text-teal-600 dark:text-teal-400">{currentVideo.cropSettings.x}px</span>
                          </label>
                          <input
                            type="range"
                            min="0"
                            max={(videoContainerRef.current?.clientWidth || 640) - currentVideo.cropSettings.width}
                            value={currentVideo.cropSettings.x}
                            onChange={(e) => handleCropChange({...currentVideo.cropSettings, x: parseInt(e.target.value) || 0})}
                            className="block w-full accent-teal-500 h-1 bg-teal-100 dark:bg-teal-700 rounded-lg appearance-none cursor-pointer mb-2"
                          />
                          <div className="relative">
                            <input
                              type="number"
                              value={currentVideo.cropSettings.x}
                              onChange={(e) => handleCropChange({...currentVideo.cropSettings, x: parseInt(e.target.value) || 0})}
                              className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-teal-200 dark:border-teal-700 rounded-md text-sm text-teal-800 dark:text-teal-200 focus:outline-none focus:border-teal-400"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-teal-500 dark:text-teal-400 text-sm">
                              0px
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="flex items-center justify-between text-sm font-medium text-teal-700 dark:text-teal-300 mb-1">
                            <span>Y Position</span>
                            <span className="text-teal-600 dark:text-teal-400">{currentVideo.cropSettings.y}px</span>
                          </label>
                          <input
                            type="range"
                            min="0"
                            max={(videoContainerRef.current?.clientHeight || 360) - currentVideo.cropSettings.height}
                            value={currentVideo.cropSettings.y}
                            onChange={(e) => handleCropChange({...currentVideo.cropSettings, y: parseInt(e.target.value) || 0})}
                            className="block w-full accent-teal-500 h-1 bg-teal-100 dark:bg-teal-700 rounded-lg appearance-none cursor-pointer mb-2"
                          />
                          <div className="relative">
                            <input
                              type="number"
                              value={currentVideo.cropSettings.y}
                              onChange={(e) => handleCropChange({...currentVideo.cropSettings, y: parseInt(e.target.value) || 0})}
                              className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-teal-200 dark:border-teal-700 rounded-md text-sm text-teal-800 dark:text-teal-200 focus:outline-none focus:border-teal-400"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-teal-500 dark:text-teal-400 text-sm">
                              0px
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-base font-medium text-teal-700 dark:text-teal-300 mb-3">
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
                            className={`relative px-4 py-2 text-sm rounded-md focus:outline-none transition-all duration-300 overflow-hidden shadow-sm ${
                              aspectRatio === ratio.name
                                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium shadow-md transform scale-105"
                                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow"
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
              <div className="space-y-4 md:space-y-6">
                {/* Upload Section */}
                <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 dark:from-indigo-900/40 dark:via-blue-900/30 dark:to-indigo-800/40 rounded-lg p-3 sm:p-4 shadow-lg border border-indigo-200/50 dark:border-indigo-800/30 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Upload Videos</h3>
                  <label className="flex flex-col items-center justify-center w-full h-32 sm:h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors duration-200">
                    <input 
                      type="file" 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="video/*"
                      multiple
                      disabled={videos.length >= videoLimit}
                    />
                    {isUploading ? (
                      <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-md">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full border border-teal-100 dark:border-teal-900 animate-fadeIn">
                          <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="absolute inset-0 rounded-full border-t-4 border-teal-500 animate-spin"></div>
                            <div className="absolute inset-2 rounded-full border-r-4 border-blue-500 animate-spin animation-delay-150"></div>
                            <div className="absolute inset-4 rounded-full border-b-4 border-teal-600 animate-spin animation-delay-300"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-300 dark:to-blue-300 text-center mb-3">Loading Editor</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-center">Please wait while we prepare your video editing experience...</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500 mb-3 animate-bounce"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Click to upload multiple videos
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500 block mt-1">
                          Supports MP4, WebM, MOV (max {sizeLimit}MB, max {durationLimit < 60 ? `${durationLimit} seconds` : durationLimit === 60 ? `1 minute` : `${Math.floor(durationLimit / 60)} minutes`})
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500 block mt-1">
                          Maximum {videoLimit} videos allowed ({videoLimit - videos.length} slots remaining)
                        </span>
                      </>
                    )}
                  </label>
                </div>
                
                {/* Source Video List */}
                <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-violet-100 dark:from-violet-900/40 dark:via-purple-900/30 dark:to-violet-800/40 rounded-lg p-3 sm:p-4 shadow-lg border border-purple-200/50 dark:border-purple-800/30 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Source Videos ({videos.length})</h3>
                  {videos.length > 0 ? (
                    <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto">
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
                            <div className="truncate max-w-[100px] sm:max-w-[120px]">
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
                <div className="bg-gradient-to-br from-pink-50 via-fuchsia-50 to-pink-100 dark:from-pink-900/40 dark:via-fuchsia-900/30 dark:to-pink-800/40 rounded-lg p-4 mt-4 shadow-lg border border-pink-200/50 dark:border-pink-800/30 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
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
                    <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto">
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
                            <div className="truncate max-w-[100px] sm:max-w-[120px]">
                              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">cropped-{video.name}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
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
                

                {/* Instructions */}
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/40 dark:to-teal-800/40 rounded-lg p-3 sm:p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">How to Use</h3>
                  <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Upload multiple videos using the upload section</li>
                    <li>Select a video from the list to edit</li>
                    <li>Adjust the crop settings or select a preset aspect ratio</li>
                    <li>Click "Process Video" to crop all videos</li>
                    <li>Download the processed videos when ready</li>
                  </ol>
                </div>
                {/* Google AdSense Ad - bottom of editor page */}
                <div className="flex justify-center my-8">
                  <ins className="adsbygoogle"
                    style={{ display: "block" }}
                    data-ad-client="ca-pub-5829296907403264"
                    data-ad-slot="4667047861"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                  ></ins>
                </div>
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      (adsbygoogle = window.adsbygoogle || []).push({});
                    `,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Main page component with Suspense boundary for searchParams
export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-center text-gray-700 dark:text-gray-300">Loading editor...</p>
        </div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}
