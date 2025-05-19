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
 * Enhanced error logger with rate limiting and better context handling
 * This prevents excessive logging and improves performance during error storms
 */
const errorCounts: Record<string, { count: number; lastLogged: number }> = {};
const ERROR_RATE_LIMIT = 5; // Max identical errors per minute

export const logError = (error: Error, context: Record<string, any> = {}): void => {
  // Generate error fingerprint for rate limiting
  const errorKey = `${error.name}:${error.message}`;
  const now = Date.now();
  
  // Check if we've seen this error recently (rate limiting)
  if (!errorCounts[errorKey]) {
    errorCounts[errorKey] = { count: 0, lastLogged: 0 };
  }
  
  const errorData = errorCounts[errorKey];
  
  // Reset count if it's been more than a minute
  if (now - errorData.lastLogged > 60000) {
    errorData.count = 0;
  }
  
  // Increment count and update timestamp
  errorData.count++;
  errorData.lastLogged = now;
  
  // Skip logging if we're over the rate limit
  if (errorData.count > ERROR_RATE_LIMIT) {
    // Only log rate limit message every 10 occurrences
    if (errorData.count % 10 === 0) {
      console.warn(`[RATE LIMITED] Error "${errorKey}" occurred ${errorData.count} times in the last minute`);
    }
    return;
  }
  
  // Add performance information to context
  const enhancedContext = {
    ...context,
    url: typeof window !== 'undefined' ? window.location.href : '',
    timestamp: new Date().toISOString(),
    occurenceCount: errorData.count
  };
  
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${error.name}: ${error.message}`, {
      stack: error.stack,
      ...enhancedContext
    });
  } else {
    // In production, we would send this to a monitoring service like Sentry
    console.error(`[ERROR] ${error.name}: ${error.message}`);
    
    // If Sentry were implemented, it would look like:
    // Sentry.captureException(error, { extra: enhancedContext });
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
