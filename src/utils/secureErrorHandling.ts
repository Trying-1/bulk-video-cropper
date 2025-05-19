/**
 * Secure error handling utilities
 * Provides consistent error handling while preventing information disclosure
 */

import { IS_PRODUCTION } from '@/config/env';

// Interface for standardized error objects
export interface SecureError {
  // Public-facing, sanitized error message
  message: string;
  
  // Error code for programmatic handling
  code: string;
  
  // Status code (for HTTP errors)
  status?: number;
  
  // Only included in development mode
  details?: any;
  
  // Only included in development mode
  stack?: string;
}

/**
 * Error codes for consistent error handling
 */
export const ERROR_CODES = {
  // Authentication errors
  AUTH_FAILED: 'auth/failed',
  AUTH_REQUIRED: 'auth/required',
  AUTH_EXPIRED: 'auth/expired',
  
  // File operation errors
  FILE_INVALID: 'file/invalid',
  FILE_TOO_LARGE: 'file/too-large',
  FILE_PROCESSING_FAILED: 'file/processing-failed',
  
  // Input validation errors
  VALIDATION_FAILED: 'validation/failed',
  
  // Server errors
  SERVER_ERROR: 'server/error',
  NOT_FOUND: 'server/not-found',
  
  // Generic errors
  UNKNOWN_ERROR: 'error/unknown',
  OPERATION_FAILED: 'error/operation-failed',
  
  // Network errors
  NETWORK_ERROR: 'network/error',
  API_ERROR: 'api/error'
};

/**
 * Creates a secure, standardized error object
 * Sensitive information is removed in production
 * 
 * @param code Error code from ERROR_CODES
 * @param message User-friendly error message
 * @param originalError Original error object (only included in development)
 * @param status HTTP status code (for API errors)
 * @returns Standardized error object
 */
export function createSecureError(
  code: string,
  message: string,
  originalError?: any,
  status?: number
): SecureError {
  // Base error object
  const error: SecureError = {
    message,
    code,
    status
  };
  
  // In development mode, include additional debugging information
  if (!IS_PRODUCTION && originalError) {
    error.details = originalError;
    error.stack = originalError.stack;
  }
  
  return error;
}

/**
 * Logs an error securely without exposing sensitive information
 * 
 * @param error Error to log
 * @param context Additional context information
 */
export function logSecureError(error: any, context: string = ''): void {
  if (IS_PRODUCTION) {
    // In production, log minimal information to avoid exposure
    const errorMessage = error.message || 'Unknown error';
    const errorCode = error.code || ERROR_CODES.UNKNOWN_ERROR;
    
    console.error(`[ERROR] ${context}: ${errorCode} - ${errorMessage}`);
  } else {
    // In development, log full error details
    console.error(`[ERROR] ${context}:`, error);
    if (error.stack) {
      console.error(error.stack);
    }
  }
}

/**
 * Processes an error into a user-friendly format
 * Ensures sensitive information is not exposed
 * 
 * @param error Original error
 * @param defaultMessage Default message to show if error doesn't have one
 * @returns User-friendly error object
 */
export function handleClientError(
  error: any,
  defaultMessage: string = 'An unexpected error occurred'
): SecureError {
  // If it's already a SecureError, return it
  if (error && error.code && error.message) {
    return error;
  }

  // Handle common error types
  if (error instanceof Error) {
    // Common network errors
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return createSecureError(
        ERROR_CODES.NETWORK_ERROR,
        'A network error occurred. Please check your internet connection.',
        error
      );
    }
    
    // Authentication errors
    if (error.message.includes('auth') || error.message.includes('permission')) {
      return createSecureError(
        ERROR_CODES.AUTH_FAILED,
        'Authentication failed. Please try again or log in again.',
        error
      );
    }
    
    // File errors
    if (error.message.includes('file') || error.message.includes('upload')) {
      return createSecureError(
        ERROR_CODES.FILE_INVALID,
        'There was a problem with the file. Please try again with a different file.',
        error
      );
    }
    
    // Return a generic error with the original message in development
    return createSecureError(
      ERROR_CODES.UNKNOWN_ERROR,
      IS_PRODUCTION ? defaultMessage : error.message,
      error
    );
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return createSecureError(
      ERROR_CODES.UNKNOWN_ERROR,
      IS_PRODUCTION ? defaultMessage : error,
      { message: error }
    );
  }
  
  // Default fallback error
  return createSecureError(
    ERROR_CODES.UNKNOWN_ERROR,
    defaultMessage,
    error
  );
}

/**
 * Special error handler for API responses
 * Extracts error information from API responses
 * 
 * @param response Fetch API response
 * @returns Promise resolving to a SecureError
 */
export async function handleApiError(response: Response): Promise<SecureError> {
  let errorData: any = {
    message: 'Server error',
    status: response.status
  };
  
  try {
    // Try to parse response JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      errorData = await response.json();
    } else {
      // If not JSON, get text
      errorData.message = await response.text();
    }
  } catch (e) {
    // If parsing fails, use status text
    errorData.message = response.statusText || 'Server error';
  }
  
  // Map HTTP status codes to error codes
  let code = ERROR_CODES.SERVER_ERROR;
  
  switch (response.status) {
    case 401:
      code = ERROR_CODES.AUTH_REQUIRED;
      break;
    case 403:
      code = ERROR_CODES.AUTH_FAILED;
      break;
    case 404:
      code = ERROR_CODES.NOT_FOUND;
      break;
    case 422:
      code = ERROR_CODES.VALIDATION_FAILED;
      break;
    default:
      if (response.status >= 500) {
        code = ERROR_CODES.SERVER_ERROR;
      } else if (response.status >= 400) {
        code = ERROR_CODES.API_ERROR;
      }
  }
  
  // Create secure error
  return createSecureError(
    code,
    IS_PRODUCTION 
      ? getDefaultMessageForStatus(response.status)
      : (errorData.message || 'Server error'),
    errorData,
    response.status
  );
}

/**
 * Gets a user-friendly message for HTTP status codes
 * Used for production environments to avoid exposing internal details
 * 
 * @param status HTTP status code
 * @returns User-friendly error message
 */
export function getDefaultMessageForStatus(status: number): string {
  switch (status) {
    case 400: return 'The request was invalid';
    case 401: return 'Authentication is required';
    case 403: return 'You do not have permission to access this resource';
    case 404: return 'The requested resource was not found';
    case 405: return 'The requested action is not allowed';
    case 408: return 'The request timed out';
    case 409: return 'The request conflicts with the current state';
    case 410: return 'The requested resource is no longer available';
    case 413: return 'The request entity is too large';
    case 429: return 'Too many requests, please try again later';
    case 500: return 'An internal server error occurred';
    case 502: return 'Bad gateway';
    case 503: return 'Service unavailable, please try again later';
    case 504: return 'Gateway timeout';
    default: {
      if (status >= 500) return 'A server error occurred';
      if (status >= 400) return 'The request could not be completed';
      return 'An unexpected error occurred';
    }
  }
}

/**
 * Handles errors in API routes, returning appropriate responses
 * 
 * @param error The error that occurred
 * @param defaultMessage A default message to show if the error is generic
 * @param defaultStatus Default HTTP status code (500 if not specified)
 * @returns NextResponse with appropriate status and error details
 */
export function secureErrorHandler(error: any, defaultMessage: string = 'An unexpected error occurred', defaultStatus: number = 500) {
  // Log the error for debugging
  logSecureError(error, 'API Route Error');
  
  // Create a secure error object
  const secureError = createSecureError(
    ERROR_CODES.SERVER_ERROR,
    error instanceof Error ? error.message : defaultMessage,
    error,
    defaultStatus
  );
  
  // In production, remove sensitive details
  if (IS_PRODUCTION) {
    delete secureError.details;
    delete secureError.stack;
    
    // Use a generic message in production
    secureError.message = defaultMessage;
  }
  
  // Return a JSON response with the appropriate status code
  return new Response(
    JSON.stringify({
      error: secureError.code,
      message: secureError.message,
      ...(IS_PRODUCTION ? {} : { details: secureError.details })
    }),
    {
      status: secureError.status || 500,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}
