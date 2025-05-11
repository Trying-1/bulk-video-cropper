/**
 * Utility functions for file validation and security
 */

/**
 * Validates if a file is a valid video format
 */
export const isValidVideoFormat = (file: File): boolean => {
  // List of allowed video mime types
  const allowedTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
    'video/x-flv'
  ];
  
  return allowedTypes.includes(file.type);
};

/**
 * Validates file size
 * @param file The file to validate
 * @param maxSizeMB Maximum size in megabytes
 */
export const isValidFileSize = (file: File, maxSizeMB: number = 100): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Gets the duration of a video file
 * @returns Promise that resolves to the duration in seconds
 */
export const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Error loading video metadata'));
    };
    
    video.src = URL.createObjectURL(file);
  });
};

/**
 * Validates if a video duration is within the allowed limit
 * @param duration Duration in seconds
 * @param maxDurationSeconds Maximum allowed duration in seconds
 */
export const isValidVideoDuration = (duration: number, maxDurationSeconds: number = 60): boolean => {
  return duration <= maxDurationSeconds;
};

/**
 * Comprehensive video file validation
 */
export const validateVideo = async (file: File): Promise<{ 
  valid: boolean; 
  errors: string[];
  duration?: number;
}> => {
  const errors: string[] = [];
  let duration: number | undefined;
  
  // Check if file exists
  if (!file) {
    errors.push('No file provided');
    return { valid: false, errors };
  }
  
  // Check file type
  if (!isValidVideoFormat(file)) {
    errors.push(`Invalid file format: ${file.type}. Please upload a supported video format (MP4, WebM, etc.)`);
  }
  
  // Check file size
  if (!isValidFileSize(file)) {
    errors.push(`File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum size is 100MB.`);
  }
  
  // Check video duration
  try {
    duration = await getVideoDuration(file);
    if (!isValidVideoDuration(duration)) {
      errors.push(`Video too long: ${duration.toFixed(1)} seconds. Maximum duration is 60 seconds.`);
    }
  } catch (error) {
    errors.push('Could not determine video duration. Please check the file.');
  }
  
  // Check filename for security
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    errors.push('Invalid filename. Please rename your file before uploading.');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    duration
  };
};

/**
 * Sanitizes a filename to make it safe for storage
 */
export const sanitizeFilename = (filename: string): string => {
  // Remove path traversal characters and invalid characters
  let sanitized = filename
    .replace(/\.\./g, '')
    .replace(/[/\\]/g, '')
    .replace(/[^\w\s.-]/g, '_');
  
  // Ensure filename isn't too long
  if (sanitized.length > 100) {
    const extension = sanitized.split('.').pop() || '';
    sanitized = sanitized.substring(0, 95) + '.' + extension;
  }
  
  return sanitized;
};

/**
 * Generates a secure random filename
 */
export const generateSecureFilename = (originalFilename: string): string => {
  const extension = originalFilename.split('.').pop() || '';
  const randomString = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now();
  
  return `video_${timestamp}_${randomString}.${extension}`;
};
