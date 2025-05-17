# Bulk Video Cropper Architecture

## Overview

The Bulk Video Cropper is a web-based application built using Next.js and React, with FFmpeg for video processing. This document provides an overview of the system architecture and component structure.

## Tech Stack

- **Frontend**: Next.js 14, React 18
- **Video Processing**: FFmpeg.js (WebAssembly)
- **Storage**: Firebase Storage (Optional)
- **Authentication**: Firebase Auth (Optional)
- **Styling**: Tailwind CSS

## Component Architecture

### 1. Core Components

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

## Authentication & User Management

#### AuthContext
- User authentication state
- Login/Logout management 
- Session persistence
- Subscription data management
- Limit enforcement based on subscription tier

#### User Dashboard
- Account management
- Usage statistics
- Subscription management
- Plan-based limits display

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
