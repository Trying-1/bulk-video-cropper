/**
 * Rate Limiter Utility
 * 
 * This module provides rate limiting functionality to prevent API abuse and brute force attacks.
 * It uses a simple in-memory storage with configurable limits based on IP address or other identifiers.
 */

import { NextRequest, NextResponse } from 'next/server';

// Default rate limit settings
const DEFAULT_LIMIT = 100; // requests
const DEFAULT_WINDOW = 60 * 1000; // 1 minute in milliseconds

// In-memory store for rate limiting
// In production, this should be replaced with Redis or another distributed store
type RateLimitStore = {
  [key: string]: {
    count: number;
    resetAt: number;
  };
};

// Store to track request counts
const rateLimitStore: RateLimitStore = {};

/**
 * Clean up expired rate limit entries
 * This prevents memory leaks from accumulating over time
 */
const cleanupStore = () => {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach(key => {
    if (rateLimitStore[key].resetAt < now) {
      delete rateLimitStore[key];
    }
  });
};

// Regularly clean up the store to prevent memory leaks
// This is a simple approach - in production, use a better mechanism
setInterval(cleanupStore, 5 * 60 * 1000); // Clean up every 5 minutes

/**
 * Get a unique identifier for the request
 * Default is IP address, but can be customized for user ID or API key
 */
const getIdentifier = (req: NextRequest, identifierFn?: (req: NextRequest) => string): string => {
  if (identifierFn) {
    return identifierFn(req);
  }
  
  // Default to IP address
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  return `ip:${ip}`;
};

/**
 * Rate limit middleware for Next.js API routes
 */
export const rateLimiter = (
  handler: Function,
  {
    limit = DEFAULT_LIMIT,
    window = DEFAULT_WINDOW,
    identifier = getIdentifier,
    keyPrefix = '',
  }: {
    limit?: number;
    window?: number;
    identifier?: (req: NextRequest) => string;
    keyPrefix?: string;
  } = {}
) => {
  return async (req: NextRequest, ...args: any[]) => {
    const id = `${keyPrefix}:${identifier(req)}`;
    const now = Date.now();
    
    // Initialize or update the rate limiter entry
    if (!rateLimitStore[id] || rateLimitStore[id].resetAt < now) {
      rateLimitStore[id] = {
        count: 1,
        resetAt: now + window,
      };
    } else {
      rateLimitStore[id].count += 1;
    }
    
    // Get remaining requests allowed
    const remaining = Math.max(0, limit - rateLimitStore[id].count);
    const reset = Math.ceil((rateLimitStore[id].resetAt - now) / 1000); // in seconds
    
    // Set rate limiting headers
    const headers = {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    };
    
    // If rate limit exceeded, return 429 Too Many Requests
    if (rateLimitStore[id].count > limit) {
      return new Response(
        JSON.stringify({
          error: 'rate_limit_exceeded',
          message: 'Too many requests, please try again later',
        }),
        {
          status: 429,
          headers: {
            ...headers,
            'Content-Type': 'application/json',
            'Retry-After': reset.toString(),
          },
        }
      );
    }
    
    // If within rate limit, process the request and add headers to response
    try {
      const response = await handler(req, ...args);
      
      // Clone the response to add headers
      const newResponse = NextResponse.next();
      
      // Copy original response data
      const originalData = await response.json();
      newResponse.headers.set('Content-Type', 'application/json');
      
      // Add rate limit headers
      Object.entries(headers).forEach(([key, value]) => {
        newResponse.headers.set(key, value);
      });
      
      // Return the modified response
      return new Response(JSON.stringify(originalData), {
        status: response.status,
        headers: newResponse.headers,
      });
    } catch (error) {
      // If any error occurs in the handler, still return rate limit headers
      const errorResponse = new Response(
        JSON.stringify({
          error: 'internal_server_error',
          message: 'An error occurred while processing your request',
        }),
        {
          status: 500,
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return errorResponse;
    }
  };
};

/**
 * Rate limit configuration for different API endpoints
 * Adjust these based on endpoint sensitivity and expected usage
 */
export const rateLimitConfig = {
  // Default API rate limits
  default: {
    limit: 100, // 100 requests
    window: 60 * 1000, // per minute
  },
  
  // Authentication-related endpoints (more strict)
  auth: {
    limit: 10, // 10 requests
    window: 60 * 1000, // per minute
  },
  
  // Video processing endpoints (more permissive)
  video: {
    limit: 50, // 50 requests
    window: 5 * 60 * 1000, // per 5 minutes
  },
};
