import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

// Global cancellation flag
let isCancelled = false;

/**
 * Cancel any ongoing processing
 */
export const cancelProcessing = () => {
  isCancelled = true;
};

/**
 * Reset cancellation flag
 */
export const resetCancellation = () => {
  isCancelled = false;
};

let ffmpeg: FFmpeg | null = null;

/**
 * Load and initialize FFmpeg
 */
export const loadFFmpeg = async (): Promise<FFmpeg> => {
  if (ffmpeg) {
    return ffmpeg;
  }

  ffmpeg = new FFmpeg();

  // Load FFmpeg core
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  return ffmpeg;
};

/**
 * Get video dimensions
 */
export const getVideoDimensions = async (videoFile: File): Promise<{ width: number, height: number }> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve({
        width: video.videoWidth,
        height: video.videoHeight
      });
    };
    video.src = URL.createObjectURL(videoFile);
  });
};

/**
 * Calculate crop parameters relative to actual video dimensions
 */
const calculateCropParameters = (
  cropSettings: { x: number, y: number, width: number, height: number },
  videoDimensions: { width: number, height: number },
  containerDimensions: { width: number, height: number }
) => {
  // Calculate the scale factor between the container and actual video
  const containerAspectRatio = containerDimensions.width / containerDimensions.height;
  const videoAspectRatio = videoDimensions.width / videoDimensions.height;
  
  let scale: number;
  let offsetX = 0;
  let offsetY = 0;
  
  // Determine how the video fits in the container (letterboxed or pillarboxed)
  if (containerAspectRatio > videoAspectRatio) {
    // Video is taller (pillarboxed)
    scale = containerDimensions.height / videoDimensions.height;
    offsetX = (containerDimensions.width - (videoDimensions.width * scale)) / 2;
  } else {
    // Video is wider (letterboxed)
    scale = containerDimensions.width / videoDimensions.width;
    offsetY = (containerDimensions.height - (videoDimensions.height * scale)) / 2;
  }
  
  // Adjust crop coordinates to account for letterboxing/pillarboxing
  const adjustedX = Math.max(0, (cropSettings.x - offsetX) / scale);
  const adjustedY = Math.max(0, (cropSettings.y - offsetY) / scale);
  
  // Ensure crop dimensions don't exceed video boundaries
  const adjustedWidth = Math.min(videoDimensions.width - adjustedX, cropSettings.width / scale);
  const adjustedHeight = Math.min(videoDimensions.height - adjustedY, cropSettings.height / scale);
  
  return {
    x: Math.round(adjustedX),
    y: Math.round(adjustedY),
    width: Math.round(adjustedWidth),
    height: Math.round(adjustedHeight)
  };
};



/**
 * Crop a video using FFmpeg
 */
export const cropVideo = async (
  videoFile: File,
  cropSettings: { x: number, y: number, width: number, height: number },
  containerDimensions: { width: number, height: number } = { width: 640, height: 360 }
): Promise<Blob> => {
  try {
    // Check if crop settings are valid
    if (cropSettings.width <= 0 || cropSettings.height <= 0) {
      throw new Error('Invalid crop dimensions: width and height must be greater than 0');
    }
    
    // Load FFmpeg
    const ffmpegInstance = await loadFFmpeg();
    
    // Get actual video dimensions
    const videoDimensions = await getVideoDimensions(videoFile);
    
    // Calculate crop parameters
    const { x, y, width, height } = calculateCropParameters(
      cropSettings,
      videoDimensions,
      containerDimensions
    );
    
    // Validate crop parameters
    if (width <= 0 || height <= 0 || x < 0 || y < 0 || 
        x + width > videoDimensions.width || y + height > videoDimensions.height) {
      throw new Error('Invalid crop parameters: crop area is outside video boundaries');
    }
    
    // Generate unique input and output file names with timestamp and random string
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10);
    const inputFileName = `input-${timestamp}-${randomStr}.mp4`;
    const outputFileName = `output-${timestamp}-${randomStr}.mp4`;
    
    // Write the input file to memory
    await ffmpegInstance.writeFile(inputFileName, await fetchFile(videoFile));
    
    // Check for cancellation before processing
    if (isCancelled) {
      // Clean up files if cancelled
      await ffmpegInstance.deleteFile(inputFileName);
      throw new Error('Processing cancelled');
    }
    
    // Build FFmpeg command for cropping with optimized settings for speed
    const ffmpegArgs = [
      '-i', inputFileName,
      '-vf', `crop=${width}:${height}:${x}:${y}`,
      '-c:v', 'libx264',
      '-preset', 'ultrafast',  // Use ultrafast preset for maximum speed
      '-crf', '28'             // Use a higher CRF value for faster processing
    ];
    
    // Add audio copy and output filename
    ffmpegArgs.push('-c:a', 'copy', outputFileName);
    
    // Execute the FFmpeg command
    await ffmpegInstance.exec(ffmpegArgs);
    
    // Check for cancellation after processing
    if (isCancelled) {
      // Clean up files if cancelled
      await ffmpegInstance.deleteFile(inputFileName);
      await ffmpegInstance.deleteFile(outputFileName);
      throw new Error('Processing cancelled');
    }
    
    // Read the output file
    const data = await ffmpegInstance.readFile(outputFileName);
    
    // Clean up files
    try {
      await ffmpegInstance.deleteFile(inputFileName);
      await ffmpegInstance.deleteFile(outputFileName);
    } catch (cleanupError) {
      console.warn('Error cleaning up temporary files:', cleanupError);
      // Continue despite cleanup errors
    }
    
    // Convert to Blob
    return new Blob([data], { type: 'video/mp4' });
  } catch (error) {
    console.error('Error cropping video:', error);
    throw error;
  }
};

/**
 * Process multiple videos in batch
 */
export const processBatchVideos = async (
  videos: Array<{
    id: string;
    file: File;
    cropSettings: { x: number; y: number; width: number; height: number };
    containerDimensions?: { width: number; height: number };
  }>,
  onProgress?: (progress: number, currentVideo: string, justCompletedVideo?: { id: string; processedVideo: Blob }) => void
): Promise<Array<{ id: string; processedVideo: Blob }>> => {
  const results = [];
  
  // Validate input
  if (!videos || videos.length === 0) {
    throw new Error('No videos provided for processing');
  }
  
  // Reset cancellation flag at the start
  resetCancellation();
  
  // Process videos sequentially to avoid memory issues
  for (let i = 0; i < videos.length; i++) {
    // Check if processing was cancelled
    if (isCancelled) {
      throw new Error('Processing cancelled');
    }
    
    const video = videos[i];
    
    // Validate video object
    if (!video || !video.file || !video.id) {
      console.error('Invalid video object:', video);
      continue; // Skip this video and continue with the next
    }
    
    try {
      // Report progress at start
      if (onProgress) {
        const progressPercent = Math.round(((i) / videos.length) * 100);
        onProgress(progressPercent, video.file.name);
      }
      
      // Check if crop settings are valid
      if (!video.cropSettings || 
          typeof video.cropSettings.width !== 'number' || 
          typeof video.cropSettings.height !== 'number') {
        throw new Error(`Invalid crop settings for video: ${video.file.name}`);
      }
      
      const processedVideo = await cropVideo(
        video.file, 
        video.cropSettings, 
        video.containerDimensions
      );
      
      // Add to results
      results.push({
        id: video.id,
        processedVideo
      });
      
      // Report progress after completion
      if (onProgress) {
        const progressPercent = Math.round(((i + 1) / videos.length) * 100);
        const nextVideoName = i < videos.length - 1 ? videos[i + 1].file.name : '';
        onProgress(
          progressPercent,
          nextVideoName,
          { id: video.id, processedVideo }
        );
      }
    } catch (error: any) {
      if (error.message === 'Processing cancelled') {
        throw error; // Re-throw cancellation error
      }
      console.error(`Error processing video ${video.file.name}:`, error);
      // Continue with next video despite errors
    }
  }
  
  return results;
};
