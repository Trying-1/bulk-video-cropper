/**
 * Centralized application messages
 * This file contains all user-facing messages used throughout the application
 * for improved maintainability and consistency
 */

// Error messages
export const ERROR_MESSAGES = {
  // Authentication errors
  AUTH: {
    SIGN_IN_FAILED: 'Authentication failed. Please try again later.',
    GOOGLE_SIGN_IN_FAILED: 'Failed to sign in with Google. Please try again.',
    GOOGLE_SIGN_UP_FAILED: 'An error occurred during Google sign up. Please try again.',
    PASSWORD_RESET_FAILED: 'Failed to send password reset email. Please try again.',
    INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
    ACCOUNT_NOT_FOUND: 'Account not found. Please sign up first.',
    EMAIL_ALREADY_IN_USE: 'This email is already in use. Please use a different email or sign in.',
  },

  // Payment errors
  PAYMENT: {
    INITIALIZATION_FAILED: 'Failed to initialize payment. Please try again.',
    PROCESSING_FAILED: 'An error occurred during payment processing. Please try again.',
    CARD_DECLINED: 'Your card was declined. Please try another payment method.',
    GENERAL: 'An error occurred with your payment. Please try again later.',
  },

  // Video processing errors
  VIDEO: {
    PROCESSING_FAILED: 'Failed to process video. Please try again.',
    CANCELLED: 'Video processing was cancelled.',
    UPLOAD_FAILED: 'Failed to upload video. Please check your connection and try again.',
    INVALID_FORMAT: 'Invalid video format. Please upload an MP4, MOV, or other supported video format.',
    TOO_LARGE: 'Video file size exceeds the limit for your plan.',
    EXCEEDED_LIMIT: 'You have reached your plan\'s video processing limit.',
  },

  // Network errors
  NETWORK: {
    CONNECTION_LOST: 'Network connection lost. Please check your internet connection.',
    REQUEST_FAILED: 'Network request failed. Please try again later.',
    TIMEOUT: 'Request timed out. Please try again.',
  },

  // General errors
  GENERAL: {
    UNEXPECTED: 'An unexpected error occurred. Please try again later.',
    OPERATION_FAILED: 'Operation failed. Please try again.',
    PERMISSION_DENIED: 'Permission denied. Please check your account access.',
  }
};

// Success messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    SIGN_UP_SUCCESS: 'Account created successfully! Welcome to Bulk Video Cropper.',
    SIGN_IN_SUCCESS: 'Signed in successfully!',
    PASSWORD_RESET_SENT: 'Password reset email sent. Please check your inbox.',
    PASSWORD_UPDATED: 'Password updated successfully.',
  },
  
  PAYMENT: {
    SUBSCRIPTION_SUCCESS: 'Subscription successful! Thank you for your purchase.',
    PAYMENT_RECEIVED: 'Payment received. Thank you!',
  },
  
  VIDEO: {
    PROCESSING_COMPLETE: 'Video processing complete!',
    UPLOAD_SUCCESS: 'Video uploaded successfully.',
    BATCH_PROCESSING_COMPLETE: 'All videos processed successfully.',
  }
};

// Informational and UI messages
export const UI_MESSAGES = {
  LOADING: 'Loading...',
  PROCESSING: 'Processing...',
  UPLOADING: 'Uploading...',
  SAVING: 'Saving...',
  WELCOME: 'Welcome to Bulk Video Cropper!',
  DROP_VIDEOS: 'Drop video files here or click to browse',
  MAX_FILES_NOTICE: (limit: number) => `Maximum ${limit} videos allowed for your plan`,
  SUBSCRIPTION_REQUIRED: 'This feature requires a premium subscription',
  
  // Confirmation prompts
  CONFIRM_DELETE: 'Are you sure you want to delete this?',
  CONFIRM_DISCARD: 'Are you sure you want to discard your changes?',
  CONFIRM_CANCEL: 'Are you sure you want to cancel the operation?',
};

/**
 * Format error messages for user display
 */
export function formatErrorMessage(error: any): string {
  if (!error) {
    return ERROR_MESSAGES.GENERAL.UNEXPECTED;
  }

  // Handle Error objects
  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes('network') || error.message.includes('connection')) {
      return ERROR_MESSAGES.NETWORK.CONNECTION_LOST;
    }
    
    // Return the error message directly if it's a custom Error
    return error.message;
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // Default fallback
  return ERROR_MESSAGES.GENERAL.UNEXPECTED;
}
