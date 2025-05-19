/**
 * CSRF Protection Utilities
 * 
 * This module provides utilities for generating and validating CSRF tokens
 * to protect against Cross-Site Request Forgery attacks.
 */

import { cookies } from 'next/headers';
import crypto from 'crypto';

const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Generate a secure random token
 */
const generateSecureToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Create a new CSRF token and store it in a cookie
 */
export const generateCsrfToken = (): string => {
  const token = generateSecureToken();
  
  // Store the token in a HttpOnly, secure cookie with strict SameSite policy
  cookies().set({
    name: CSRF_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: TOKEN_EXPIRY / 1000, // Convert to seconds for cookie
  });
  
  return token;
};

/**
 * Validate that the CSRF token in the request header matches the one stored in cookies
 */
export const validateCsrfToken = (requestToken: string | null): boolean => {
  if (!requestToken) {
    return false;
  }
  
  // Get the token from the cookie
  const cookieToken = cookies().get(CSRF_COOKIE_NAME)?.value;
  
  if (!cookieToken) {
    return false;
  }
  
  // Compare the tokens using a timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(cookieToken, 'utf8'),
    Buffer.from(requestToken, 'utf8')
  );
};

/**
 * Server middleware to check CSRF token
 */
export const csrfProtection = (handler: Function) => {
  return async (req: Request, ...args: any[]) => {
    // Get the token from the request header
    const requestToken = req.headers.get(CSRF_HEADER_NAME);
    
    // For GET, HEAD, OPTIONS requests, we don't need to validate CSRF token
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return handler(req, ...args);
    }
    
    // For all other methods (POST, PUT, DELETE, etc.), validate the token
    if (!validateCsrfToken(requestToken)) {
      return new Response(JSON.stringify({
        error: 'Invalid CSRF token',
        message: 'Failed to validate request origin'
      }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // If the token is valid, proceed with the original handler
    return handler(req, ...args);
  };
};

/**
 * Client-side function to retrieve the CSRF token from cookies
 */
export const getCsrfToken = (): string | null => {
  // Simplified approach for demo purposes - in a real app, you'd have a more secure mechanism
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  
  for (const cookie of cookies) {
    if (cookie.startsWith(`${CSRF_COOKIE_NAME}=`)) {
      return cookie.substring(CSRF_COOKIE_NAME.length + 1);
    }
  }
  
  return null;
};

/**
 * React hook to get CSRF token and attach it to fetch requests
 */
export const useCsrfFetch = () => {
  /**
   * Enhanced fetch function that automatically adds CSRF token to non-GET requests
   */
  const csrfFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const method = options.method?.toUpperCase() || 'GET';
    
    // Only add CSRF token for state-changing methods
    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      const csrfToken = getCsrfToken();
      
      // Create headers with CSRF token
      const headers = new Headers(options.headers || {});
      headers.set(CSRF_HEADER_NAME, csrfToken || '');
      
      options.headers = headers;
    }
    
    return fetch(url, options);
  };
  
  return { csrfFetch };
};
