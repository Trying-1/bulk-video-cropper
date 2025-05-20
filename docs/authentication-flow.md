# Authentication Flow Documentation

## Overview

This document outlines the authentication system used in Bulk Video Kropper. The authentication system is built using Firebase Authentication with additional custom session management to ensure a seamless user experience.

## Core Architecture

- **Firebase Authentication**: Primary authentication provider
- **Multiple Auth Methods**: Email/password and Google Sign-In
- **Context-based Design**: Uses React Context API for state management
- **Cookie Session Management**: Enhanced persistence beyond Firebase's built-in functionality

## Key Components

### 1. Authentication Context (`AuthContext.tsx`)

- Central hub for authentication state management
- Provides user data, profile information, and subscription details to the entire app
- Implements secure cookie-based session management for persistence
- Handles the Firebase authentication state and synchronizes it with the app
- Located at: `src/contexts/AuthContext.tsx`

### 2. Authentication Services (`auth.ts`)

- Core authentication functionality including:
  - Email/password signup and signin
  - Google authentication
  - Password reset
  - Sign out
- Error handling for authentication operations
- Located at: `src/services/auth.ts`

### 3. Auth Pages

- Main auth page (`/auth/page.tsx`) that serves as an entry point
- Uses `AuthLayout` component to render either signin, signup, or password reset form based on URL parameters
- Supports special flags like `signup=true`, `forgot=true`, and `source=free`
- Handles redirect results from third-party auth providers (Google)
- Located at: `src/app/auth/page.tsx` and `src/components/auth/AuthLayout.tsx`

### 4. Session Management

- Client-side cookies store authenticated session details
- Implemented fallback mechanism to maintain session state during page reloads
- Cookies include basic user data (UID, email, display name, photo URL)
- Cookie utils located at: `src/utils/cookies.ts`

### 5. Subscription Integration

- Authentication is linked with subscription data
- Creates subscription objects from user data with plan details, status, and usage limits
- Subscription plans defined in: `src/config/subscriptionPlans.ts`

## User Flows

### Sign Up Flow

1. User navigates to `/auth?signup=true`
2. User enters email, password, confirms password, and accepts terms
3. Firebase creates new account via `createUserWithEmailAndPassword`
4. Basic profile is stored with display name
5. User is redirected to profile page
6. Session cookie is created for persistence

### Sign In Flow

1. User navigates to `/auth`
2. User enters email and password
3. Firebase validates credentials via `signInWithEmailAndPassword`
4. Session cookie is created for persistence
5. User is redirected to profile or requested page (via `returnUrl` parameter)

### Google Authentication Flow

1. User clicks "Continue with Google" button
2. Firebase popup opens for Google authentication via `signInWithPopup`
3. On success, user profile is created/retrieved
4. Session cookie is created for persistence
5. User is redirected to profile page

### Password Reset Flow

1. User navigates to `/auth?forgot=true` or clicks "Forgot Password" link
2. User enters email in forgot password form
3. Firebase sends password reset email via `sendPasswordResetEmail`
4. Success message is displayed to user
5. User receives email with reset link

### Session Management Flow

1. App initializes and `AuthProvider` component mounts
2. `AuthProvider` checks for existing Firebase user and session cookie
3. If session cookie exists but Firebase user doesn't, maintains session until Firebase initializes
4. On page refresh or navigation, checks session cookie before Firebase authentication completes
5. Provides loading state during authentication checks

### Guest Mode Flow

1. User comes from "free tier" button (`source=free` parameter)
2. Option to "Continue without signup" is displayed
3. Clicking this redirects user to editor with `guest=true` parameter
4. Guest users have limited functionality and no saved data

## Security Considerations

- Authentication tokens are stored securely in HTTP-only cookies
- Password strength is evaluated during signup
- Firebase security rules limit access to user-specific data
- Session expiration is enforced
- Sensitive user data (e.g., Firebase tokens, email addresses) are not logged to console

## Error Handling

- Comprehensive error messages for authentication failures
- Retry logic for network issues
- Graceful failure for timeout conditions
- User-friendly error messages displayed in the UI

## Future Enhancements

- Two-factor authentication
- OAuth integration with additional providers (Apple, Facebook, Twitter)
- Enhanced session management with refresh tokens
- Improved rate limiting for authentication attempts
- Account linking between different authentication methods

## Related Configuration

- Firebase configuration: `src/config/firebase.ts`
- Branding configuration: `src/config/branding.ts`
- Subscription plans: `src/config/subscriptionPlans.ts`
