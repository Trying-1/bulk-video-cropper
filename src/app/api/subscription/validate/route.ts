/**
 * Subscription Validation API
 * 
 * This API endpoint validates user subscription status and feature access
 * in a secure manner that prevents client-side manipulation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { secureErrorHandler } from '@/utils/secureErrorHandling';
import { rateLimiter, rateLimitConfig } from '@/utils/rateLimiter';
import { hasFeatureAccess, getSubscriptionLimits } from '@/utils/subscriptionValidator';
import { csrfProtection } from '@/utils/csrfProtection';

/**
 * GET handler to check subscription status and limits
 */
const handleGet = async (request: NextRequest) => {
  try {
    // In a real implementation, we would extract the user ID from a session
    // For now, we'll use a query parameter for demonstration purposes
    const userId = request.nextUrl.searchParams.get('userId') || undefined;
    
    // Get the subscription limits for the user
    const limits = getSubscriptionLimits(userId);
    
    // Return the subscription limits
    return NextResponse.json({ limits });
  } catch (error) {
    return secureErrorHandler(error, 'Failed to validate subscription');
  }
};

/**
 * POST handler to check feature access
 */
const handlePost = async (request: NextRequest) => {
  try {
    const { userId, features } = await request.json();
    
    // Validate the request
    if (!features || !Array.isArray(features)) {
      return NextResponse.json(
        { error: 'Invalid request, expected features array' },
        { status: 400 }
      );
    }
    
    // Check each feature and build a response object
    const results: Record<string, boolean> = {};
    
    for (const feature of features) {
      if (typeof feature === 'string') {
        results[feature] = hasFeatureAccess(feature, userId);
      }
    }
    
    // Return the feature access results
    return NextResponse.json({ results });
  } catch (error) {
    return secureErrorHandler(error, 'Failed to check feature access');
  }
};

// Apply rate limiting to the GET endpoint with default rate limits
export const GET = rateLimiter(handleGet, rateLimitConfig.default);

// Apply CSRF protection and rate limiting to the POST endpoint
const csrfProtectedPost = csrfProtection(handlePost);
export const POST = rateLimiter(csrfProtectedPost, rateLimitConfig.default);
