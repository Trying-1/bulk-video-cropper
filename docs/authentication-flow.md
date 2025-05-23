# Authentication Flow Documentation

## Overview

This document outlines the authentication system used in Bulk Video Kropper. The authentication system is built using Firebase Authentication with additional custom session management to ensure a seamless user experience.

## Core Architecture

- **Firebase Authentication**: Primary authentication provider
- **Authentication Method**: Email/password with verification
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
  - Email verification
  - Password reset
  - Sign out
- Error handling for authentication operations
- Located at: `src/services/auth.ts`

### 3. Auth Pages

- Main auth page (`/auth/page.tsx`) that serves as an entry point
- Uses `AuthLayout` component to render either signin, signup, or password reset form based on URL parameters
- Supports special flags like `signup=true`, `forgot=true`, and `source=free`
- Handles email verification flow
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
4. Verification email is automatically sent to the user's email address
5. Basic profile is stored with display name
6. User is shown a verification email notification
7. Session cookie is created for persistence

### Sign In Flow

1. User navigates to `/auth`
2. User enters email and password
3. Firebase validates credentials via `signInWithEmailAndPassword`
4. System checks if user's email is verified
   - If verified, user proceeds to normal flow
   - If not verified, user is shown verification notification with option to resend verification email
5. Session cookie is created for persistence
6. Verified users are redirected to profile or requested page (via `returnUrl` parameter)

### Email Verification Flow

1. System sends verification email when user creates account
2. User receives email with verification link
3. When clicked, link directs to `/verify-email` page with verification code
4. System verifies email using Firebase's `applyActionCode`
5. User's account is marked as verified in both Firebase and database
6. User can now fully access all features

### Password Reset Flow

1. User navigates to `/auth?forgot=true` or clicks "Forgot Password" link
2. User enters email in forgot password form
3. Firebase sends password reset email via `sendPasswordResetEmail`
4. Success message is displayed to user
5. User receives email with reset link

### Resend Verification Email Flow

1. Unverified user signs in or clicks "Resend verification email" button
2. System calls `sendVerificationEmail` function
3. New verification email is sent to user's email address
4. Success message confirms email has been sent

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
