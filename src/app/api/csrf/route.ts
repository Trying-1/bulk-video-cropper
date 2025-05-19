/**
 * CSRF Token API Route
 * 
 * This route provides endpoints for generating and validating CSRF tokens
 * to protect against Cross-Site Request Forgery attacks.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateCsrfToken, validateCsrfToken, csrfProtection } from '@/utils/csrfProtection';
import { secureErrorHandler } from '@/utils/secureErrorHandling';
import { rateLimiter, rateLimitConfig } from '@/utils/rateLimiter';

/**
 * GET handler to generate a new CSRF token
 * Protected by rate limiting to prevent abuse
 */
const handleGet = async (request: NextRequest) => {
  try {
    // Generate a new CSRF token
    const token = generateCsrfToken();
    
    // Return the token in the response
    return NextResponse.json({ token });
  } catch (error) {
    // Use our secure error handling to prevent sensitive information disclosure
    return secureErrorHandler(error, 'Failed to generate CSRF token');
  }
};

// Apply rate limiting to the GET endpoint
// Use auth rate limit configuration since this is a security-sensitive endpoint
export const GET = rateLimiter(handleGet, rateLimitConfig.auth);

/**
 * POST handler to validate a CSRF token
 * This endpoint is wrapped with CSRF protection middleware
 */
const handlePost = async (request: NextRequest) => {
  try {
    // Parse the request body to get the token to validate
    const { token } = await request.json();
    
    // If no token is provided, return an error
    if (!token) {
      return NextResponse.json(
        { error: 'Missing token parameter' },
        { status: 400 }
      );
    }
    
    // Validate the token
    const isValid = validateCsrfToken(token);
    
    // Return the result
    return NextResponse.json({ isValid });
  } catch (error) {
    // Use our secure error handling to prevent sensitive information disclosure
    return secureErrorHandler(error, 'Failed to validate CSRF token');
  }
};

// Apply both CSRF protection and rate limiting to the POST endpoint
// First apply CSRF protection, then rate limiting
const csrfProtectedPost = csrfProtection(handlePost);
export const POST = rateLimiter(csrfProtectedPost, rateLimitConfig.auth);
