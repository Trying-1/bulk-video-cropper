import { NextRequest, NextResponse } from 'next/server';

// Custom middleware function for handling authentication
export function middleware(request: NextRequest) {
  // Get the path of the current request
  const path = request.nextUrl.pathname;
  
  // Get authentication cookie or token from request
  // Note: This is a simplified implementation. In a real app, you would validate tokens.
  const authCookie = request.cookies.get('authToken')?.value;
  
  // Define public paths that don't require authentication
  const isPublicPath = (
    path === '/' || 
    path.startsWith('/auth') || 
    path.startsWith('/legal') || 
    path.startsWith('/about') ||
    path.startsWith('/_next')
  );
  
  // Redirect logic
  if (!authCookie && !isPublicPath) {
    // Redirect to login if trying to access protected route without auth
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  
  // Allow the request to proceed
  return NextResponse.next();
}

// Define which routes this middleware should run on
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    '/profile/:path*',
  ],
};
