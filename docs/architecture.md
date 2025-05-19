# Bulk Video Cropper Architecture

## Overview

The Bulk Video Cropper is a web-based application built using Next.js and React, with FFmpeg for video processing. This document provides an overview of the system architecture and component structure.

## Tech Stack

- **Frontend**: Next.js 14, React 18
- **Video Processing**: FFmpeg.js (WebAssembly)
- **Storage**: Firebase Storage (Optional)
- **Authentication**: Firebase Auth (Optional)
- **Styling**: Tailwind CSS

## Configuration Architecture

The application uses a centralized configuration system to improve maintainability and consistency. All configuration files are located in the `src/config/` directory.

### 1. Configuration Components

#### Branding Configuration (`/src/config/branding.ts`)
- App identity elements (name, slogan, description)
- Logo paths and image assets
- Social media profile links
- Contact information
- Copyright and legal information
- Brand colors

#### Subscription Plans (`/src/config/subscriptionPlans.ts`)
- Subscription tier details (Free, Premium, Pro)
- Pricing and billing information
- Feature lists for each plan
- Video limits (count, duration, size) by plan

#### Feature Flags (`/src/config/features.ts`)
- Toggle switches for enabling/disabling functionality
- Environment-specific feature configuration
- Helper function for checking feature status

#### Messages (`/src/config/messages.ts`)
- Centralized error messages
- Success notifications
- UI text elements
- Helper function for formatting error messages

#### API Endpoints (`/src/config/apiEndpoints.ts`)
- Centralized API endpoint definitions
- Helper functions for building API URLs
- Environment-specific API configuration

#### App Constants (`/src/config/appConstants.ts`)
- Application-wide constants and settings
- Cookie settings and storage configurations
- Cache durations
- File upload limits
- UI settings
- Environment-aware constants

#### Environment Variables (`/src/config/env.ts`)
- Type-safe environment variable access
- Default values for optional variables
- Helper functions for retrieving environment values

## Component Architecture

### 2. Core Components

#### Editor Page (`/src/app/editor/page.tsx`)
- Main application interface
- Handles video uploads and processing
- Manages state for multiple videos
- Implements drag-and-drop interface

#### Video Processing Service (`/src/utils/ffmpeg.ts`)
- FFmpeg initialization and management
- Video cropping functionality
- Batch processing
- Error handling

#### Video Service (`/src/services/videoService.ts`)
- Video file operations
- File validation
- Processing queue management

#### Subscription Limits (`/src/utils/subscriptionLimits.ts`)
- Defines limits for each subscription tier (free, premium, pro)
- Video count limits 
- Video duration limits
- File size limits

### 2. UI Components

#### VideoPreviewModal
- Displays processed video preview
- Handles video playback
- Provides download options

#### ProcessingStatus
- Shows processing progress
- Handles error states
- Provides cancellation functionality

#### ErrorNotification
- Centralized error handling
- User-friendly error messages
- Error logging

### 3. Utility Functions

#### File Validation (`/src/utils/fileValidation.ts`)
- Video format validation
- File size checks
- MIME type verification

#### Cache Management (`/src/utils/cache.ts`)
- Browser cache handling
- Temporary file management
- Memory optimization

## Data Flow

1. **Video Upload**
   - User selects videos
   - Files are validated
   - Metadata is extracted
   - Files are loaded into memory

2. **Processing**
   - FFmpeg is initialized
   - Crop settings are applied
   - Processing queue is managed
   - Progress is tracked

3. **Output**
   - Processed videos are generated
   - Files are made available for download
   - Optional storage to Firebase

## State Management

- **Local State**: React useState for component-level state
- **Global State**: Context API for authentication and subscription data
- **Session Storage**: For preserving state between page reloads
- **Firestore**: For user data, subscription status, and usage tracking

## Authentication & Security Architecture

### Authentication
- Optional Firebase Authentication integration with secure fallback mechanisms
- Role-based access control with server-side validation
- Secure session management with enhanced cookie protection

### Data Security
- Comprehensive file validation and sanitization to prevent attacks
- Input sanitization and validation for XSS prevention
- CSRF protection with token-based validation
- Secure local storage with encryption for client-side data

### Subscription Security
- Server-side subscription validation to prevent feature manipulation
- Secure feature access verification with API endpoints
- Non-intrusive premium feature management (no popups)

### API Security
- Rate limiting to prevent abuse and brute force attacks
- Request validation and sanitization
- Secure error handling to prevent information disclosure

### Infrastructure Security
- Comprehensive Content Security Policy implementation
- Security headers for protection against common web vulnerabilities
- Security monitoring and logging for suspicious activities

## Security Considerations

1. **Video Processing**
   - All processing happens client-side
   - No video uploads to server (unless using Firebase)
   - Memory management for large files

2. **Authentication**
   - Optional Firebase Auth integration
   - Secure token handling
   - Protected routes

3. **Error Handling**
   - Graceful error recovery
   - User-friendly error messages
   - Error logging

## Performance Optimization

1. **Memory Management**
   - Efficient video file handling
   - Proper cleanup of temporary files
   - Memory leak prevention

2. **Processing**
   - Batch processing optimization
   - FFmpeg configuration for speed
   - Resource utilization monitoring

3. **UI Responsiveness**
   - Non-blocking operations
   - Progress updates
   - Performance monitoring

## Future Considerations

1. **Scalability**
   - Server-side processing for larger videos
   - Cloud infrastructure for processing
   - Multi-worker management

2. **Features**
   - Additional video editing capabilities
   - Preset management
   - Advanced export options
   - Custom subscription tiers
   - Usage analytics

3. **Architecture**
   - Modular component design
   - Easy plugin system
   - Better state management

## Best Practices

1. **Code Organization**
   - Clear separation of concerns
   - Consistent naming conventions
   - Proper error handling

2. **Performance**
   - Regular memory profiling
   - Performance testing
   - Optimization based on usage patterns

## File Structure

```
/src
  /app             # Next.js 14 app router components
    /api           # API routes with security protection
  /components      # Reusable React components
  /config          # Application configuration
  /contexts        # React context providers
  /hooks           # Custom React hooks
    /useSecureFeature.ts    # Secure feature validation hook
    /useSecureSubscription.ts # Secure subscription hook
  /lib             # Third-party library integrations
  /middleware      # Application middleware for security
  /types           # TypeScript type definitions
  /utils           # Utility functions
    /clientSecurity.ts      # Client-side security utilities
    /csrfProtection.ts      # CSRF protection utilities
    /envValidation.ts       # Environment variable validation
    /fileValidation.ts      # Secure file validation
    /rateLimiter.ts         # API rate limiting
    /secureErrorHandling.ts # Secure error handling
    /secureStorage.ts       # Encrypted local storage
    /securityMonitoring.ts  # Security event monitoring
    /serverFeatureValidation.ts # Server-side feature validation
    /subscriptionValidator.ts   # Subscription validation
