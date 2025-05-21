# Bulk Video Cropper MVP

A powerful web application for cropping and processing videos for social media platforms. This application works seamlessly on both desktop and mobile devices, allowing users to efficiently prepare videos for various social media platforms.

## Current MVP Features

- Upload videos for cropping
- Adjust crop dimensions and position
- Select from common aspect ratio presets (16:9, 9:16, 1:1, 4:5, etc.)
- Process videos with a simple interface
- Download cropped videos
- User account creation and management
- Enhanced user onboarding and workflow guidance
- Basic usage analytics
- Internet connection monitoring for secure processing
- Full mobile touch support for video cropping
- Responsive design for all device sizes
- Cross-platform video processing

## Future Premium Features

- Batch video processing (prepared but disabled in MVP)
- Multiple output formats
- Premium subscription options (prepared but disabled in MVP)
- Advanced filters and effects
- Cloud storage of processed videos

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- FFmpeg.js for video processing

## Requirements

- **Internet Connection**: An active internet connection is required for video processing operations to ensure proper credit tracking and prevent unauthorized usage.

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```
   cd webapp_mvp
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

## Deployment

### MVP Deployment

The application is currently configured for MVP deployment with payments disabled. To deploy:

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Deploy the built application to your hosting provider. This application is compatible with Vercel, Netlify, or any other Next.js-compatible hosting service.

   ```bash
   # Example for Vercel
   vercel --prod
   ```

### Required Environment Variables

Make sure to set these environment variables on your hosting platform:

```
# Firebase Configuration - Required for authentication and database
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Stripe Configuration - Can be added later when enabling payments
# STRIPE_SECRET_KEY=your_stripe_secret_key
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
# STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
# STRIPE_PREMIUM_PRICE_ID=your_stripe_premium_price_id
# STRIPE_PRO_PRICE_ID=your_stripe_pro_price_id
```

## Enabling Payments After MVP

Payments are currently disabled for the MVP release. To enable payments in the future:

1. Update the feature flag in `src/config/features.ts`:
   ```typescript
   export const FEATURES = {
     // Change this to true to enable payments
     ENABLE_PAYMENTS: true,
     // Other feature flags...
   };
   ```

2. Set up the required Stripe environment variables in your hosting platform.

3. Test the payment flow thoroughly with Stripe test mode before enabling in production.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
# or
yarn build
```

Then start the production server:

```bash
npm run start
# or
yarn start
```

## Project Structure

- `src/app/page.tsx` - Landing page
- `src/app/editor/page.tsx` - Video editor page with cropping functionality
- `src/app/globals.css` - Global styles using Tailwind CSS

## Configuration Architecture

The application uses a centralized configuration approach to improve maintainability and consistency. All configuration files are located in the `src/config/` directory:

### Core Configuration Files

- `branding.ts` - App identity elements (name, logo, social media, contact info)
- `subscriptionPlans.ts` - Subscription plan details (pricing, features, limits)
- `features.ts` - Feature flags for enabling/disabling functionality
- `env.ts` - Environment variable management
- `apiEndpoints.ts` - Centralized API endpoints
- `messages.ts` - Application-wide messages (errors, success, UI text)
- `appConstants.ts` - Application-wide constants (limits, durations, settings)

### Using the Configuration

Import the configuration directly from the config files:

```typescript
// Example: Using branding configuration
import { APP_IDENTITY } from '@/config/branding';

function Header() {
  return <h1>{APP_IDENTITY.name}</h1>;
}

// Example: Using feature flags
import { isFeatureEnabled } from '@/config/features';

function PaymentButton() {
  if (!isFeatureEnabled('ENABLE_PAYMENTS')) {
    return null;
  }
  return <button>Subscribe</button>;
}
```

### Modifying Configuration

To change application-wide settings, modify the appropriate configuration file instead of changing values in individual components. This ensures consistency across the application.

## MVP Focus

This MVP version focuses on the core functionality of video cropping with a simple and intuitive interface. Advanced features like user accounts, project saving, and batch processing will be added in future versions.
