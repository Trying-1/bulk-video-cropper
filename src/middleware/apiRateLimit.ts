/**
 * API Rate Limiting Middleware
 * 
 * This middleware applies rate limiting to all API routes to prevent abuse.
 * It uses a simple in-memory storage solution with different limits based on the endpoint type.
 */

import { NextRequest, NextResponse } from 'next/server';
import { rateLimitConfig } from '@/utils/rateLimiter';

// In-memory store for rate limiting
// In production, this should be replaced with Redis or another distributed store
type RateLimitStore = {
  [key: string]: {
    count: number;
    resetAt: number;
  };
};

// Store to track request counts - shared across all requests
const apiRateLimitStore: RateLimitStore = {};

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(apiRateLimitStore).forEach(key => {
    if (apiRateLimitStore[key].resetAt < now) {
      delete apiRateLimitStore[key];
    }
  });
}, 5 * 60 * 1000); // Clean up every 5 minutes

/**
 * Get the appropriate rate limit configuration based on the request path
 */
const getRateLimitConfig = (path: string) => {
  // Authentication endpoints
  if (path.includes('/api/auth') || path.includes('/api/csrf')) {
    return rateLimitConfig.auth;
  }
  
  // Video processing endpoints
  if (path.includes('/api/video') || path.includes('/api/upload')) {
    return rateLimitConfig.video;
  }
  
  // Default for all other API endpoints
  return rateLimitConfig.default;
};

/**
 * Middleware function that applies rate limiting to API routes
 */
export function apiRateLimitMiddleware(req: NextRequest) {
  // Only apply to API routes
  if (!req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Get the appropriate rate limit configuration
  const path = req.nextUrl.pathname;
  const { limit, window } = getRateLimitConfig(path);
  
  // Get a unique identifier for the request (IP address)
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  const id = `${path}:${ip}`;
  
  const now = Date.now();
  
  // Initialize or update the rate limiter entry
  if (!apiRateLimitStore[id] || apiRateLimitStore[id].resetAt < now) {
    apiRateLimitStore[id] = {
      count: 1,
      resetAt: now + window,
    };
  } else {
    apiRateLimitStore[id].count += 1;
  }
  
  // Get remaining requests and reset time
  const count = apiRateLimitStore[id].count;
  const remaining = Math.max(0, limit - count);
  const reset = Math.ceil((apiRateLimitStore[id].resetAt - now) / 1000); // in seconds
  
  // Create response with rate limit headers
  const response = NextResponse.next();
  
  // Add rate limit headers to all API responses
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', reset.toString());
  
  // If rate limit exceeded, return 429 Too Many Requests
  if (count > limit) {
    return new Response(
      JSON.stringify({
        error: 'rate_limit_exceeded',
        message: 'Too many requests, please try again later.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': reset.toString(),
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    );
  }
  
  return response;
}
