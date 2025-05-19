# Configuration Guide for Bulk Video Cropper

## Overview

This guide explains the centralized configuration architecture used in the Bulk Video Cropper application. The centralized approach improves maintainability and ensures consistency throughout the application by providing a single source of truth for all configuration values.

## Configuration Directory Structure

All configuration files are located in the `src/config/` directory:

```
src/
└── config/
    ├── apiEndpoints.ts     # API endpoint definitions
    ├── appConstants.ts     # Application-wide constants
    ├── branding.ts         # App identity and branding elements
    ├── databaseIndexes.ts  # Firestore collection and index definitions
    ├── env.ts              # Environment variable management
    ├── features.ts         # Feature flags for toggling functionality
    ├── firebase.ts         # Firebase configuration
    ├── messages.ts         # Error messages and UI text
    ├── stripe.ts           # Stripe payment integration
    └── subscriptionPlans.ts # Subscription plan details
```

## Configuration Files

### 1. branding.ts

Contains all brand identity elements to maintain consistent branding across the application.

```typescript
// Example usage
import { APP_IDENTITY, SOCIAL_MEDIA } from '@/config/branding';

function Footer() {
  return (
    <footer>
      <p>{APP_IDENTITY.copyright}</p>
      <a href={SOCIAL_MEDIA.twitter.url}>Twitter</a>
    </footer>
  );
}
```

Key objects:
- `APP_IDENTITY`: Name, slogan, description, copyright
- `LOGO`: Paths to logo assets
- `SOCIAL_MEDIA`: Social media profile links
- `CONTACT_INFO`: Email addresses, phone, physical address
- `LEGAL_DOCS`: Links to legal documents
- `UI_PREFERENCES`: Interface preferences for a clean, non-intrusive experience
- `BRAND_COLORS`: Primary brand color palette

### 2. subscriptionPlans.ts

Defines subscription plans, pricing, and features for each tier with a non-intrusive approach.

```typescript
// Example usage
import { SUBSCRIPTION_PLANS, getPlanById } from '@/config/subscriptionPlans';
import SubscriptionFeatureGuard from '@/components/SubscriptionFeatureGuard';

function PlanDetails({ planId, userId }) {
  const plan = getPlanById(planId) || SUBSCRIPTION_PLANS.FREE;
  
  return (
    <div>
      <h2>{plan.name} - ${plan.price}/{plan.billing}</h2>
      <p>{plan.description}</p>
      <ul>
        {plan.features.map((feature, i) => (
          <li key={i}>{feature.text}</li>
        ))}
      </ul>
      
      {/* Feature access with clean interface, no popups */}
      <SubscriptionFeatureGuard 
        feature="batchProcessing" 
        userId={userId}
        fallback={<span className="text-sm text-gray-500">Available in Premium plan</span>}
      >
        <button>Process All Videos</button>
      </SubscriptionFeatureGuard>
    </div>
  );
}
```

Includes:
- Plan tiers (Free, Premium, Pro)
- Pricing and billing cycle information
- Feature lists for each plan
- Video limitations based on subscription level
- Clean interface preferences (no upgrade popups)

**Security Enhancement**: Now secured by server-side validation through `subscriptionValidator.ts` to prevent client-side manipulation.

### 3. features.ts

Controls feature availability throughout the application using feature flags.

```typescript
// Example usage
import { getFeatures } from '@/config/features';

function NewFeatureButton() {
  const features = getFeatures();
  
  if (!features.newFeature.enabled) {
    return null;
  }
  
  return <button>Try New Feature</button>;
}
```

This file defines:
- Feature flags (enabled/disabled state)
- Feature requirements (subscription tier, etc.)
- Optional configuration for each feature
- Clean interface settings (no popups, no guides)

**Security Note**: Feature flags are now protected by server-side validation through the `serverFeatureValidation.ts` utility and secure API endpoints.

### 4. messages.ts

Centralized repository for all user-facing messages.

```typescript
// Example usage
import { ERROR_MESSAGES, formatErrorMessage } from '@/config/messages';

function ErrorDisplay({ error }) {
  return <div className="error">{formatErrorMessage(error)}</div>;
}
```

Key objects:
- `ERROR_MESSAGES`: All error messages organized by category
- `SUCCESS_MESSAGES`: Success notifications
- `UI_MESSAGES`: Static UI text elements
- `formatErrorMessage()`: Helper function for consistent error formatting

### 5. apiEndpoints.ts

Defines all API endpoints used throughout the application.

```typescript
// Example usage
import { API_ENDPOINTS, buildApiUrl } from '@/config/apiEndpoints';

async function fetchUserProfile(userId) {
  const response = await fetch(
    buildApiUrl(API_ENDPOINTS.USER_DATA.PROFILE, { userId })
  );
  return response.json();
}
```

Key objects:
- `API_ENDPOINTS`: Nested object of all API endpoints
- `buildApiUrl()`: Helper function to construct URLs with query parameters
- `getApiBaseUrl()`: Returns the base API URL

### 6. appConstants.ts

Application-wide constants for consistent settings.

```typescript
// Example usage
import { CACHE_DURATIONS, FILE_LIMITS } from '@/config/appConstants';

function VideoUploader() {
  return (
    <input
      type="file"
      accept={FILE_LIMITS.ACCEPTED_VIDEO_FORMATS.join(',')}
      max-size={FILE_LIMITS.MAX_UPLOAD_SIZE}
    />
  );
}
```

Key objects:
- `COOKIES`: Cookie names and durations
- `ERROR_SETTINGS`: Error handling configuration
- `CACHE_DURATIONS`: Cache timeouts for different data types
- `PAGINATION`: Page size settings
- `FILE_LIMITS`: Upload size limits and accepted formats
- `UI_SETTINGS`: UI-related constants

### 7. env.ts

Type-safe access to environment variables.

```typescript
// Example usage
import { getEnv, MAX_VIDEO_COUNT } from '@/config/env';

function VideoCounter() {
  return <p>Maximum videos: {MAX_VIDEO_COUNT}</p>;
}
```

Key objects:
- Environment variable exports with type safety
- `getEnv()`: Helper function for accessing environment variables

### 8. security.ts

Security configurations for the application.

```typescript
// Example usage
import { securityConfig } from '@/config/security';

function SecureComponent() {
  return (
    <div>
      <h2>Security Configuration</h2>
      <p>CSP: {securityConfig.csp}</p>
      <p>Rate Limiting: {securityConfig.rateLimiting}</p>
    </div>
  );
}
```

Key objects:
- `csp`: Content Security Policy configuration
- `rateLimiting`: Rate limiting configuration
- `envValidation`: Environment validation configuration

### 9. uiPreferences.ts

UI preferences for a clean interface.

```typescript
// Example usage
import { uiPreferences } from '@/config/uiPreferences';

function CleanInterfaceComponent() {
  return (
    <div>
      <h2>UI Preferences</h2>
      <p>Show Popups: {uiPreferences.showPopups}</p>
      <p>Guided Tours: {uiPreferences.guidedTours}</p>
    </div>
  );
}
```

Key objects:
- `showPopups`: Show popup notifications
- `guidedTours`: Guided tours
- `overlayNotifications`: Overlay notifications
- `confirmationDialogs`: Confirmation dialogs

## Best Practices

### When to Use Configuration

Use the centralized configuration for:
- Any value that might need to change in the future
- Text that appears in multiple places
- Settings that differ between environments
- Feature toggles
- Any branding elements

### When to Update Configuration

Update configuration files when:
- Adding new features that require settings
- Changing branding elements
- Adding new API endpoints
- Modifying subscription plans
- Adding new error messages or UI text

### Implementation Guidelines

1. **Never hardcode values** that should come from configuration
2. **Keep configuration organized** within the appropriate file
3. **Use TypeScript interfaces** to ensure type safety
4. **Document new configuration values** with comments
5. **Use helper functions** provided by configuration modules

## Extending the Configuration System

To add a new configuration file:

1. Create a new TypeScript file in the `src/config/` directory
2. Define and export the configuration objects
3. Add TypeScript interfaces for type safety
4. Include helper functions if needed
5. Update this documentation

## Common Configuration Tasks

### Updating App Name or Branding

Edit `src/config/branding.ts` to update:
```typescript
export const APP_IDENTITY = {
  name: 'Your New App Name',
  // Other properties...
};
```

### Adding a New Subscription Plan

Edit `src/config/subscriptionPlans.ts` to add:
```typescript
export const SUBSCRIPTION_PLANS = {
  // Existing plans...
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 49.99,
    billing: 'monthly',
    // Other properties...
  },
};
```

### Enabling/Disabling Features

Edit `src/config/features.ts` to toggle features:
```typescript
export const FEATURES = {
  // Existing features...
  ENABLE_PAYMENTS: true, // Set to false to disable payments
};
```

### Adding New Error Messages

Edit `src/config/messages.ts` to add:
```typescript
export const ERROR_MESSAGES = {
  // Existing categories...
  NEW_CATEGORY: {
    NEW_ERROR: 'Your new error message here',
  },
};
```

## Conclusion

The centralized configuration architecture simplifies maintenance and ensures consistency across the Bulk Video Cropper application. By following this guide, you can effectively manage and extend the configuration system to meet the evolving needs of the application.
