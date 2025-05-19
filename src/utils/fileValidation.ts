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
/**
 * Comprehensive video file validation with enhanced security checks
 */
export const validateVideo = async (file: File, maxSizeMB: number = 100, maxDurationSeconds: number = 60): Promise<{ 
  valid: boolean; 
  errors: string[];
  duration?: number;
  secureFilename?: string;
}> => {
  const errors: string[] = [];
  let duration: number | undefined;
  let secureFilename: string | undefined;
  
  // Check if file exists and is a valid object
  if (!file || !(file instanceof File)) {
    errors.push('No valid file provided');
    return { valid: false, errors };
  }
  
  // Verify against null bytes (prevents null byte injection attacks)
  if (file.name.includes('\0') || file.type.includes('\0')) {
    errors.push('Invalid file: contains illegal characters');
    return { valid: false, errors };
  }
  
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
  
  // Enhanced MIME type validation
  if (!isValidMimeType(file, allowedTypes)) {
    errors.push(`Invalid file format: ${file.type}. Please upload a supported video format (MP4, WebM, etc.)`);
  } else {
    // Verify file extension matches content type
    if (!validateFileExtension(file.name, file.type)) {
      errors.push('File extension does not match the content type. Please check your file.');
    }
  }
  
  // Check file size with strict validation
  if (!isValidFileSize(file, maxSizeMB)) {
    errors.push(`File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum size is ${maxSizeMB}MB.`);
  }
  
  // Check for zero-byte files
  if (file.size === 0) {
    errors.push('Empty file. Please upload a valid video file.');
  }
  
  // Less strict filename validation - only check for dangerous patterns
  if (file.name.includes('..') || 
      file.name.includes('/') || 
      file.name.includes('\\')) {
    errors.push('Invalid filename. Please rename your file before uploading.');
  }
  
  // Generate secure filename regardless of validation results
  secureFilename = sanitizeFilename(file.name);
  
  // Check video duration
  try {
    duration = await getVideoDuration(file);
    if (!isValidVideoDuration(duration, maxDurationSeconds)) {
      const minutes = Math.floor(maxDurationSeconds / 60);
      const seconds = maxDurationSeconds % 60;
      const durationText = minutes > 0 ? 
        `${minutes} minute${minutes > 1 ? 's' : ''}${seconds > 0 ? ` ${seconds} seconds` : ''}` :
        `${seconds} seconds`;
      
      errors.push(`Video too long: ${duration.toFixed(1)} seconds. Maximum duration is ${durationText}.`);
    }
  } catch (error) {
    errors.push('Could not determine video duration. Please check if the file is a valid video.');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    duration,
    secureFilename
  };
};

/**
 * Sanitizes a filename to make it safe for storage
 * Enhanced security implementation to prevent path traversal and command injection
 */
export const sanitizeFilename = (filename: string): string => {
  if (!filename || typeof filename !== 'string') {
    return 'unnamed_file';
  }
  
  // Extract file extension before sanitizing
  const filenameParts = filename.split('.');
  let extension = '';
  if (filenameParts.length > 1) {
    extension = filenameParts.pop() || '';
    // Sanitize extension - allow only alphanumeric
    extension = extension.replace(/[^a-zA-Z0-9]/g, '');
    // Limit extension length
    extension = extension.substring(0, 10);
  }
  
  // Get the base filename
  const baseFilename = filenameParts.join('.');
  
  // Rigorously sanitize the base filename
  // 1. Remove path traversal sequences and directory separators
  // 2. Remove any potentially dangerous characters
  // 3. Replace spaces with underscores
  let sanitized = baseFilename
    .replace(/\.\.+/g, '') // Remove path traversal sequences
    .replace(/[\/\\:*?"<>|]/g, '') // Remove characters not allowed in filenames
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[^a-zA-Z0-9_.-]/g, ''); // Only allow alphanumeric, underscore, period, and hyphen
  
  // Ensure the filename isn't blank after sanitization
  if (!sanitized) {
    sanitized = 'file_' + Date.now();
  }
  
  // Prevent excessively long filenames
  const MAX_FILENAME_LENGTH = 50; // Significantly shorter than filesystem limits
  if (sanitized.length > MAX_FILENAME_LENGTH) {
    sanitized = sanitized.substring(0, MAX_FILENAME_LENGTH);
  }
  
  // Add a timestamp to ensure uniqueness and prevent overwriting
  const timestamp = Date.now();
  sanitized = `${sanitized}_${timestamp}`;
  
  // Re-add the extension if it exists
  if (extension) {
    sanitized = `${sanitized}.${extension}`;
  }
  
  return sanitized;
};

/**
 * Generates a secure random filename with enhanced entropy
 * This prevents predictability and filename collisions
 */
export const generateSecureFilename = (originalFilename: string): string => {
  // Extract and sanitize extension
  const filenameParts = originalFilename.split('.');
  let extension = '';
  if (filenameParts.length > 1) {
    extension = filenameParts.pop() || '';
    // Sanitize extension - only allow alphanumeric
    extension = extension.replace(/[^a-zA-Z0-9]/g, '');
    // Limit extension length
    extension = extension.substring(0, 10);
  }
  
  // Generate secure random values with higher entropy
  const timestamp = Date.now();
  
  // Use multiple random sources for better entropy
  const randomString1 = Math.random().toString(36).substring(2, 10);
  const randomString2 = Math.random().toString(36).substring(2, 10);
  
  // Combine multiple entropy sources
  const secureFilename = `video_${timestamp}_${randomString1}_${randomString2}`;
  
  // Add sanitized extension if it exists
  return extension ? `${secureFilename}.${extension}` : secureFilename;
};

/**
 * Validates a file MIME type against an allowed list
 * @param file The file to validate
 * @param allowedTypes Array of allowed MIME types
 */
export const isValidMimeType = (file: File, allowedTypes: string[]): boolean => {
  // Check for empty MIME type (some browsers might not report it correctly)
  if (!file.type && file.name) {
    // Try to infer from extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'mp4' || ext === 'mov' || ext === 'webm') {
      return true; // Common video formats are accepted even without MIME type
    }
  }
  
  // Check the reported MIME type
  const mimeMatch = allowedTypes.includes(file.type);
  return mimeMatch;
};

/**
 * Verifies file extension matches the content type
 * Helps protect against MIME type spoofing, but with fallbacks
 */
export const validateFileExtension = (filename: string, mimeType: string): boolean => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  // If no extension, reject the file
  if (!extension) {
    return false;
  }
  
  // If no MIME type but has a valid video extension, accept it
  if (!mimeType && ['mp4', 'mov', 'webm', 'avi', 'mkv', 'ogg', 'ogv', 'm4v', 'qt', 'flv'].includes(extension)) {
    return true;
  }
  
  // Map of MIME types to expected extensions
  const mimeToExtMap: Record<string, string[]> = {
    'video/mp4': ['mp4', 'm4v'],
    'video/webm': ['webm'],
    'video/ogg': ['ogv', 'ogg'],
    'video/quicktime': ['mov', 'qt'],
    'video/x-msvideo': ['avi'],
    'video/x-matroska': ['mkv'],
    'video/x-flv': ['flv'],
    // Some browsers/systems report different MIME types
    'video/mpeg': ['mp4', 'mpeg', 'mpg', 'm4v'],
    'application/mp4': ['mp4', 'm4v'],
    '': ['mp4', 'mov', 'webm', 'avi', 'mkv'] // Fallback for empty MIME type
  };
  
  // If the MIME type isn't in our map but the extension is a video extension, accept it
  if (!mimeToExtMap[mimeType] && ['mp4', 'mov', 'webm', 'avi', 'mkv', 'ogg', 'ogv'].includes(extension)) {
    return true;
  }
  
  // Check if extension matches expected extensions for the MIME type
  return mimeToExtMap[mimeType]?.includes(extension) || false;
};
