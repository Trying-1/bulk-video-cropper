/**
 * Central configuration for subscription plans
 * All plan details should be defined here and imported where needed
 */

export interface PlanFeature {
  text: string;
  enabled: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billing: string;
  description: string;
  features: PlanFeature[];
  limitations: PlanFeature[];
  cta: string;
  popular: boolean;
  videoLimit: number;
  videoDurationLimit: number; // in seconds
  videoSizeLimit: number; // in MB
  outputQuality: string;
  watermark: boolean;
  batchProcessing: boolean | number;
  supportLevel: string;
}

// Define all subscription plans with complete details
export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    billing: 'Free forever',
    description: 'Perfect for casual users who want to try out our service.',
    features: [
      { text: '5 videos total', enabled: true },
      { text: 'Basic video cropping', enabled: true },
      { text: 'Standard quality output', enabled: true },
      { text: 'Community support', enabled: true }
    ],
    limitations: [
      { text: 'Watermark on videos', enabled: true },
      { text: 'Limited resolution', enabled: true },
      { text: 'No batch processing', enabled: true }
    ],
    cta: 'Get Started',
    popular: false,
    videoLimit: 100,
    videoDurationLimit: 30,
    videoSizeLimit: 100,
    outputQuality: '720p',
    watermark: true,
    batchProcessing: false,
    supportLevel: 'community'
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    billing: 'monthly',
    description: 'Ideal for content creators who need more flexibility and features.',
    features: [
      { text: '40 videos total', enabled: true },
      { text: 'Premium video cropping', enabled: true },
      { text: 'HD quality output', enabled: true },
      { text: 'Priority support', enabled: true },
      { text: 'No watermarks', enabled: true },
      { text: 'Custom presets', enabled: true }
    ],
    limitations: [
      { text: 'Limited batch processing (10 videos)', enabled: true },
      { text: 'Standard export formats only', enabled: true }
    ],
    cta: 'Choose Premium',
    popular: true,
    videoLimit: 40,
    videoDurationLimit: 60,
    videoSizeLimit: 500,
    outputQuality: '1080p',
    watermark: false,
    batchProcessing: 10,
    supportLevel: 'priority'
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 29.99,
    billing: 'monthly',
    description: 'For professional creators who need the full power of our platform.',
    features: [
      { text: '120 videos total', enabled: true },
      { text: 'Unlimited batch processing', enabled: true },
      { text: '4K quality output', enabled: true },
      { text: 'All export formats', enabled: true },
      { text: 'Advanced filters', enabled: true },
      { text: 'API access', enabled: true },
      { text: 'Dedicated support', enabled: true }
    ],
    limitations: [],
    cta: 'Choose Pro',
    popular: false,
    videoLimit: 120,
    videoDurationLimit: 180,
    videoSizeLimit: 1024,
    outputQuality: '4K',
    watermark: false,
    batchProcessing: true,
    supportLevel: 'dedicated'
  }
};

// Define video count limits
export const SUBSCRIPTION_VIDEO_LIMITS = {
  FREE: SUBSCRIPTION_PLANS.FREE.videoLimit,
  PREMIUM: SUBSCRIPTION_PLANS.PREMIUM.videoLimit,
  PRO: SUBSCRIPTION_PLANS.PRO.videoLimit,
  DEFAULT: 10 // Fallback for unknown plans or no subscription
};

// Define video duration limits (in seconds)
export const SUBSCRIPTION_DURATION_LIMITS = {
  FREE: SUBSCRIPTION_PLANS.FREE.videoDurationLimit,
  PREMIUM: SUBSCRIPTION_PLANS.PREMIUM.videoDurationLimit,
  PRO: SUBSCRIPTION_PLANS.PRO.videoDurationLimit,
  DEFAULT: 20 // Fallback for unknown plans or no subscription
};

// Define video size limits (in MB)
export const SUBSCRIPTION_SIZE_LIMITS = {
  FREE: SUBSCRIPTION_PLANS.FREE.videoSizeLimit,
  PREMIUM: SUBSCRIPTION_PLANS.PREMIUM.videoSizeLimit,
  PRO: SUBSCRIPTION_PLANS.PRO.videoSizeLimit,
  DEFAULT: 100 // Fallback for unknown plans or no subscription
};

// Function to get a plan by ID
export function getPlanById(planId: string): SubscriptionPlan | undefined {
  const upperPlanId = planId.toUpperCase();
  return SUBSCRIPTION_PLANS[upperPlanId];
}

// Function to get an array of all plans
export function getAllPlans(): SubscriptionPlan[] {
  return Object.values(SUBSCRIPTION_PLANS);
}
