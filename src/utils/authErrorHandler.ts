/**
 * Utility to handle authentication errors and provide user-friendly error messages
 * that don't expose the underlying authentication provider.
 */

type ErrorCode = string;

interface ErrorMap {
  [key: string]: string;
}

// Map Firebase auth error codes to user-friendly messages
const errorMessages: ErrorMap = {
  // Email/password authentication errors
  'auth/invalid-email': 'The email address you entered is not valid.',
  'auth/user-disabled': 'This account has been disabled. Please contact support.',
  'auth/user-not-found': 'Incorrect email or password. Please try again.',
  'auth/wrong-password': 'Incorrect email or password. Please try again.',
  'auth/invalid-credential': 'Incorrect email or password. Please try again.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Your password is too weak. Please choose a stronger password.',
  'auth/requires-recent-login': 'For security reasons, please sign in again before making this change.',
  'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later or reset your password.',
  'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
  'auth/cancelled-popup-request': 'The previous sign-in attempt was cancelled.',
  'auth/popup-blocked': 'Sign-in popup was blocked by your browser. Please allow popups for this site.',
  'auth/timeout': 'The request has timed out. Please try again.',
  'auth/invalid-verification-code': 'The verification code is invalid. Please try again.',
  'auth/missing-verification-code': 'Please enter the verification code sent to your email.',
  'auth/expired-action-code': 'This link has expired. Please request a new verification email.',
  'auth/invalid-action-code': 'This link is invalid or has already been used.',

  // Generic errors
  'default': 'An error occurred during authentication. Please try again.'
};

/**
 * Translates authentication errors to user-friendly messages
 * without exposing implementation details.
 */
export const getAuthErrorMessage = (error: any): string => {
  // If error is a string, return it directly
  if (typeof error === 'string') {
    return error;
  }

  // Check for Firebase error code
  const errorCode: ErrorCode = error?.code || 'default';
  
  // Return the user-friendly message or a generic error message
  return errorMessages[errorCode] || errorMessages['default'];
};
