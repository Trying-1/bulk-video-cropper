/**
 * Centralized branding configuration for the Bulk Video Cropper application
 * All branding elements should be defined here and imported where needed
 */

// App identity
export const APP_IDENTITY = {
  name: 'Bulk Video Cropper',
  shortName: 'BVC',
  slogan: 'Process videos in bulk for all social platforms',
  description: 'A powerful web application for cropping and processing videos for social media platforms.',
  copyright: `© ${new Date().getFullYear()} Bulk Video Cropper. All rights reserved.`,
  version: '1.0.0',
};

// Domain and URLs
export const APP_URLS = {
  domain: 'bulkvideocropper.com',
  baseUrl: 'https://bulkvideocropper.com',
  apiBase: 'https://bulkvideocropper.com/api',
  appBase: 'https://app.bulkvideocropper.com',
  landingPage: 'https://bulkvideocropper.com',
  contactPage: 'https://bulkvideocropper.com/contact',
};

// Email addresses
export const APP_EMAILS = {
  support: 'support@bulkvideocropper.com',
  info: 'info@bulkvideocropper.com',
  press: 'press@bulkvideocropper.com',
  business: 'business@bulkvideocropper.com',
  privacy: 'privacy@bulkvideocropper.com',
  admin: 'admin@bulkvideocropper.com',
  developers: 'developers@bulkvideocropper.com',
};

// Product information
export const PRODUCT = {
  features: [
    'Bulk video processing',
    'Multiple aspect ratios',
    'Custom crop settings',
    'Social media optimizations',
    'High-quality output',
    'No watermarks',
  ],
  benefits: [
    'Save time with batch processing',
    'Perfect for content creators',
    'Optimize videos for any platform',
    'No technical skills required',
  ],
};

// Logo paths and image assets
export const LOGO = {
  primary: '/assets/logo.svg',
  favicon: '/favicon.ico',
  appleTouchIcon: '/assets/apple-touch-icon.png',
  og: '/assets/og-image.jpg', // Open Graph image
};

// Social media profiles
export const SOCIAL_MEDIA = {
  twitter: {
    handle: '@bulkvidcropper',
    url: 'https://twitter.com/bulkvidcropper',
  },
  facebook: {
    url: 'https://facebook.com/bulkvidcropper',
  },
  instagram: {
    handle: '@bulkvidcropper',
    url: 'https://instagram.com/bulkvideocropper',
  },
  youtube: {
    url: 'https://youtube.com/c/bulkvidcropper',
  },
  linkedin: {
    url: 'https://linkedin.com/company/bulkvidcropper',
  },
};

// Contact information
export const CONTACT_INFO = {
  email: {
    support: 'support@bulkvidcropper.com',
    info: 'info@bulkvidcropper.com',
    press: 'press@bulkvidcropper.com',
  },
  phone: '+1 (555) 123-4567',
  address: {
    line1: '123 Video Street',
    line2: 'Suite 456',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    country: 'USA',
  },
};

// Developer and API information
export const DEVELOPER_INFO = {
  website: 'https://developers.bulkvidcropper.com',
  documentation: 'https://docs.bulkvidcropper.com',
  github: 'https://github.com/bulkvidcropper',
};

// Legal documents
export const LEGAL_DOCS = {
  termsOfService: '/legal/terms',
  privacyPolicy: '/legal/privacy',
  cookiePolicy: '/legal/cookies',
};

// App colors - can be used for consistent branding across platforms
export const BRAND_COLORS = {
  primary: '#0D9488', // teal-600
  secondary: '#7C3AED', // purple-600
  accent: '#F97316', // orange-500
  dark: '#111827', // gray-900
  light: '#F9FAFB', // gray-50
};
