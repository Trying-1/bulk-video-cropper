// Error handling utility functions

/**
 * Custom error class for video processing errors
 */
export class VideoProcessingError extends Error {
  public readonly code: string;
  
  constructor(message: string, code: string = 'PROCESSING_ERROR') {
    super(message);
    this.name = 'VideoProcessingError';
    this.code = code;
  }
}

/**
 * Custom error class for file validation errors
 */
export class FileValidationError extends Error {
  public readonly code: string;
  
  constructor(message: string, code: string = 'VALIDATION_ERROR') {
    super(message);
    this.name = 'FileValidationError';
    this.code = code;
  }
}

/**
 * Log errors to console in development and to monitoring service in production
 */
export const logError = (error: Error, context: Record<string, any> = {}): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${error.name}: ${error.message}`, {
      stack: error.stack,
      ...context
    });
  } else {
    // In production, we would send this to a monitoring service like Sentry
    // This is a placeholder for that implementation
    console.error(`[ERROR] ${error.name}: ${error.message}`);
    
    // If Sentry were implemented, it would look like:
    // Sentry.captureException(error, { extra: context });
  }
};

/**
 * Validate video file before processing
 */
export const validateVideoFile = (file: File): { valid: boolean; error?: string } => {
  // Check if it's a video file
  if (!file.type.startsWith('video/')) {
    return { 
      valid: false, 
      error: 'The selected file is not a video. Please upload a video file.' 
    };
  }
  
  // Check file size (limit to 100MB)
  const MAX_SIZE = 100 * 1024 * 1024; // 100MB in bytes
  if (file.size > MAX_SIZE) {
    return { 
      valid: false, 
      error: 'The video file is too large. Please upload a video smaller than 100MB.' 
    };
  }
  
  return { valid: true };
};

/**
 * Format error messages for user display
 */
export const formatErrorMessage = (error: Error): string => {
  // Handle known error types
  if (error instanceof VideoProcessingError) {
    switch (error.code) {
      case 'FFMPEG_FAILED':
        return 'Video processing failed. Please try again with a different video format.';
      case 'TIMEOUT':
        return 'Video processing took too long. Please try a shorter video or lower resolution.';
      default:
        return 'An error occurred while processing your video. Please try again.';
    }
  }
  
  if (error instanceof FileValidationError) {
    return error.message;
  }
  
  // Generic error handling
  if (error.message.includes('network') || error.message.includes('connection')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  // Default message for unknown errors
  return 'An unexpected error occurred. Please try again or contact support if the issue persists.';
};
