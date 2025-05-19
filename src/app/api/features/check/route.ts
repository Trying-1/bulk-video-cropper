/**
 * API Route for validating feature access
 * 
 * This route provides a server-side check for feature access, preventing client-side manipulation.
 * It's used to validate if a user has access to premium features based on their subscription.
 */

import { NextRequest, NextResponse } from 'next/server';
import { hasFeatureAccess } from '@/utils/serverFeatureValidation';
import { secureErrorHandler } from '@/utils/secureErrorHandling';
import { rateLimiter, rateLimitConfig } from '@/utils/rateLimiter';
import { FEATURES } from '@/config/features';

/**
 * GET handler to check if a user has access to a specific feature
 */
const handleGet = async (request: NextRequest) => {
  try {
    // Extract the feature name from the URL query parameters
    const featureName = request.nextUrl.searchParams.get('feature');
    
    // If no feature name is provided, return an error
    if (!featureName) {
      return NextResponse.json(
        { error: 'Missing feature parameter' },
        { status: 400 }
      );
    }
    
    // Check if the feature name is valid
    if (!(featureName in FEATURES)) {
      return NextResponse.json({ hasAccess: false });
    }
    
    // Check if the user has access to the feature
    const hasAccess = await hasFeatureAccess(featureName as keyof typeof FEATURES);
    
    // Return the result
    return NextResponse.json({ hasAccess });
  } catch (error) {
    // Use our secure error handling to prevent sensitive information disclosure
    return secureErrorHandler(error, 'Failed to check feature access');
  }
};

// Apply rate limiting to the GET endpoint
// Use default rate limit configuration since this is less security-critical
export const GET = rateLimiter(handleGet, rateLimitConfig.default);

/**
 * POST handler for batch checking multiple features at once
 */
const handlePost = async (request: NextRequest) => {
  try {
    // Parse the request body to get the list of features to check
    const { features } = await request.json();
    
    // If no features array is provided, return an error
    if (!Array.isArray(features)) {
      return NextResponse.json(
        { error: 'Invalid request, expected features array' },
        { status: 400 }
      );
    }
    
    // Check each feature and build a response object
    const results: Record<string, boolean> = {};
    
    for (const feature of features) {
      if (typeof feature === 'string' && feature in FEATURES) {
        results[feature] = await hasFeatureAccess(feature as keyof typeof FEATURES);
      } else {
        results[feature] = false;
      }
    }
    
    // Return the results
    return NextResponse.json({ results });
  } catch (error) {
    // Use our secure error handling to prevent sensitive information disclosure
    return secureErrorHandler(error, 'Failed to batch check feature access');
  }
};

// Apply rate limiting to the POST endpoint
// Use default rate limit configuration since this is less security-critical
export const POST = rateLimiter(handlePost, rateLimitConfig.default);
