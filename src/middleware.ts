import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { apiRateLimitMiddleware } from './middleware/apiRateLimit';

// List of payment and subscription related paths to block
const BLOCKED_PATHS = [
  '/subscription',
  '/plans',
  '/pricing',
  '/upsell'
];

/**
 * Security middleware that adds appropriate HTTP security headers to all responses
 * This middleware runs on all routes and helps mitigate common web vulnerabilities
 * 
 * Headers implemented:
 * - Content-Security-Policy: Prevents XSS by controlling resource loading
 * - X-XSS-Protection: Enables browser XSS filtering
 * - X-Frame-Options: Prevents clickjacking by controlling iframe embedding
 * - X-Content-Type-Options: Prevents MIME-type sniffing
 * - Referrer-Policy: Controls referrer information in requests
 * - Permissions-Policy: Restricts access to browser features
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path starts with any blocked path
  const isBlocked = BLOCKED_PATHS.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isBlocked) {
    // Redirect to 404 page
    const url = request.nextUrl.clone();
    url.pathname = '/404';
    return NextResponse.rewrite(url);
  }

  // Apply API rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    return apiRateLimitMiddleware(request);
  }
  
  // For non-API routes, apply security headers
  const response = NextResponse.next();

  // Content-Security-Policy (CSP)
  // Highly permissive policy for development to ensure video processing works
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https: blob:;
    style-src 'self' 'unsafe-inline' https:;
    img-src 'self' data: https: blob:;
    media-src 'self' data: blob:;
    font-src 'self' data: https:;
    worker-src 'self' blob: data: 'unsafe-eval';
    child-src 'self' blob:;
    connect-src 'self' https: wss: blob: data:;
    frame-ancestors 'self';
    form-action 'self';
    object-src 'self' blob:;
    base-uri 'self';
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim();

  // Set security headers
  const securityHeaders = {
    // Content Security Policy
    'Content-Security-Policy': cspHeader,
    
    // Prevent clickjacking
    'X-Frame-Options': 'SAMEORIGIN',
    
    // Prevent MIME-type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Enable browser XSS protection
    'X-XSS-Protection': '1; mode=block',
    
    // Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Restrict access to browser features
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
    
    // Strict Transport Security (only in production)
    ...(process.env.NODE_ENV === 'production' 
      ? { 'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload' } 
      : {}),
  };

  // Add security headers to response
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// Run middleware on all routes except static files and API routes
// Note: We exclude API routes to prevent potential interference with API responses
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes - handled separately)
     */
    {
      source: '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
