/**
 * Centralized Pricing Configuration
 * All pricing, subscription plans, and discount information is defined here
 * Import from this file to ensure consistency across the application
 */

import { APP_IDENTITY } from './branding';

// ===== Plan Feature Interface =====
export interface PlanFeature {
  text: string;
  enabled: boolean;
}

// ===== Subscription Plan Interface =====
export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  billing: string;
  description: string;
  features: string[];
  limitations: string[];
  cta: string;
  popular: boolean;
  maxUploadsAtOnce: number;
  totalCredits: number;
  creditsExpiration: string;
  costPerVideo: number;
  supportLevel: string;
  requiresRegistration: boolean; // indicates if this plan requires user registration
  // Optional promotion-related fields
  hasPromotion?: boolean;
  promotionCode?: string;
  discountPercentage?: number;
  discountedPrice?: number;
  promotionExpiry?: Date | string;
}

// ===== Promotion Code Interface =====
export interface PromotionCode {
  id: string;
  code: string;
  description: string;
  discountPercentage: number;
  discountAmount?: number; // For fixed-amount discounts
  currency?: string;
  isActive: boolean;
  applicablePlans: string[]; // IDs of plans this promo can apply to
  startDate: Date | string;
  endDate: Date | string;
  maxUses?: number;
  currentUses: number;
  // Display settings
  displayOnPricingPage: boolean;
  promotionalText?: string;
  badgeText?: string;
  badgeColor?: string;
}

// ===== Base Subscription Plans =====
export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  UNREGISTERED: {
    id: 'unregistered',
    name: 'Unregistered',
    price: 0,
    billing: 'Free forever',
    description: 'Try out the service without registration',
    features: [
      '5 total credits',
      '5 videos max upload at once',
      '720p quality output',
      'Basic video cropping'
    ],
    limitations: [
      'No saved videos',
      'Watermark on videos',
      'Limited resolution',
      'No batch processing',
      'No account features'
    ],
    cta: 'Try It Out',
    popular: false,
    maxUploadsAtOnce: 5,
    totalCredits: 5,
    creditsExpiration: 'never',
    costPerVideo: 1,
    supportLevel: 'none',
    requiresRegistration: false
  },
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    billing: 'Free forever',
    description: 'Perfect for casual users who want to try out our service.',
    features: [
      '150 credits per month',
      '15 videos max upload at once',
      'Basic editing tools',
      '1080p quality output',
      'Save edited videos'
    ],
    limitations: [
      'Watermark on videos',
      'Limited batch processing',
      'Standard support only'
    ],
    cta: 'Get Started',
    popular: false,
    maxUploadsAtOnce: 15,
    totalCredits: 150,
    creditsExpiration: 'monthly',
    costPerVideo: 1,
    supportLevel: 'standard',
    requiresRegistration: true
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    billing: 'monthly',
    description: 'Ideal for content creators who need more flexibility and features.',
    features: [
      '300 credits per month',
      '50 videos max upload at once',
      'Advanced editing tools',
      '2K quality output',
      'No watermark',
      'Efficient batch processing',
      'Priority support'
    ],
    limitations: [
      'Limited cloud storage'
    ],
    cta: 'Choose Premium',
    popular: true,
    maxUploadsAtOnce: 50,
    totalCredits: 300,
    creditsExpiration: 'monthly',
    costPerVideo: 1,
    supportLevel: 'priority',
    requiresRegistration: true,
    hasPromotion: true,
    promotionCode: 'PREMIUM20',
    discountPercentage: 20,
    discountedPrice: 7.99,
    promotionExpiry: '2023-12-31'
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 29.99,
    billing: 'monthly',
    description: 'For professional creators who need the full power of our platform.',
    features: [
      '1000 credits per month',
      '200 videos max upload at once',
      'All premium features',
      '4K quality output',
      'No watermark',
      'Advanced batch processing',
      'Priority support',
      'API access',
      'Dedicated account manager'
    ],
    limitations: [],
    cta: 'Choose Pro',
    popular: false,
    maxUploadsAtOnce: 200,
    totalCredits: 1000,
    creditsExpiration: 'monthly',
    costPerVideo: 1,
    supportLevel: 'dedicated',
    requiresRegistration: true,
    hasPromotion: true,
    promotionCode: 'PRO15',
    discountPercentage: 15,
    discountedPrice: 25.49,
    promotionExpiry: '2023-12-31'
  }
};

// ===== Service Limits =====
export const SERVICE_LIMITS = {
  // Maximum number of videos in a single upload session
  MAX_UPLOAD: {
    UNREGISTERED: SUBSCRIPTION_PLANS.UNREGISTERED.maxUploadsAtOnce,
    FREE: SUBSCRIPTION_PLANS.FREE.maxUploadsAtOnce,
    PREMIUM: SUBSCRIPTION_PLANS.PREMIUM.maxUploadsAtOnce,
    PRO: SUBSCRIPTION_PLANS.PRO.maxUploadsAtOnce,
    DEFAULT: 5 // Fallback for unknown plans or no subscription
  },
  // Total credits available based on plan
  TOTAL_CREDITS: {
    UNREGISTERED: SUBSCRIPTION_PLANS.UNREGISTERED.totalCredits,
    FREE: SUBSCRIPTION_PLANS.FREE.totalCredits,
    PREMIUM: SUBSCRIPTION_PLANS.PREMIUM.totalCredits,
    PRO: SUBSCRIPTION_PLANS.PRO.totalCredits,
    DEFAULT: 5 // Fallback for unknown plans or no subscription
  },
  // Cost per video in credits
  COST_PER_VIDEO: {
    UNREGISTERED: SUBSCRIPTION_PLANS.UNREGISTERED.costPerVideo,
    FREE: SUBSCRIPTION_PLANS.FREE.costPerVideo,
    PREMIUM: SUBSCRIPTION_PLANS.PREMIUM.costPerVideo,
    PRO: SUBSCRIPTION_PLANS.PRO.costPerVideo,
    DEFAULT: 1 // Fallback for unknown plans or no subscription
  },
  // Credit expiration policy
  CREDITS_EXPIRATION: {
    UNREGISTERED: SUBSCRIPTION_PLANS.UNREGISTERED.creditsExpiration,
    FREE: SUBSCRIPTION_PLANS.FREE.creditsExpiration,
    PREMIUM: SUBSCRIPTION_PLANS.PREMIUM.creditsExpiration,
    PRO: SUBSCRIPTION_PLANS.PRO.creditsExpiration,
    DEFAULT: 'monthly' // Fallback for unknown plans or no subscription
  },
  // Video duration limits in seconds
  DURATION: {
    UNREGISTERED: 30, // 30 seconds for unregistered users
    FREE: 60, // 1 minute for free users
    PREMIUM: 180, // 3 minutes for premium users
    PRO: 300, // 5 minutes for pro users
    PAY_AS_YOU_GO_SMALL: 60, // 1 minute for small pay-as-you-go
    PAY_AS_YOU_GO_MEDIUM: 120, // 2 minutes for medium pay-as-you-go
    PAY_AS_YOU_GO_LARGE: 240, // 4 minutes for large pay-as-you-go
    DEFAULT: 30 // Fallback for unknown plans or no subscription
  },
  // Video size limits in MB
  SIZE: {
    UNREGISTERED: 50, // 50MB for unregistered users
    FREE: 200, // 200MB for free users
    PREMIUM: 500, // 500MB for premium users
    PRO: 2000, // 2GB for pro users
    PAY_AS_YOU_GO_SMALL: 200, // 200MB for small pay-as-you-go
    PAY_AS_YOU_GO_MEDIUM: 500, // 500MB for medium pay-as-you-go
    PAY_AS_YOU_GO_LARGE: 1000, // 1GB for large pay-as-you-go
    DEFAULT: 50 // Fallback for unknown plans or no subscription
  }
};

// ===== Promotion Codes =====
export const PROMOTION_CODES: PromotionCode[] = [
  {
    id: 'summer20',
    code: 'SUMMER20',
    description: 'Summer promotion - 20% off Premium plan',
    discountPercentage: 20,
    currency: 'USD',
    isActive: true,
    applicablePlans: ['premium'],
    startDate: new Date('2025-05-01T00:00:00.000Z'),
    endDate: new Date('2025-08-31T23:59:59.999Z'),
    maxUses: 1000,
    currentUses: 0,
    displayOnPricingPage: true,
    promotionalText: 'Limited time offer - 20% off',
    badgeText: '20% OFF',
    badgeColor: '#ff6b6b'
  },
  {
    id: 'pro15',
    code: 'PRO15',
    description: '15% off Pro plan',
    discountPercentage: 15,
    currency: 'USD',
    isActive: false, // Not currently active
    applicablePlans: ['pro'],
    startDate: new Date('2025-05-01T00:00:00.000Z'),
    endDate: new Date('2025-12-31T23:59:59.999Z'),
    maxUses: 500,
    currentUses: 0,
    displayOnPricingPage: false,
    promotionalText: 'Special offer - 15% off Pro plan',
    badgeText: '15% OFF',
    badgeColor: '#4dabf7'
  },
  {
    id: 'welcome10',
    code: 'WELCOME10',
    description: 'New user welcome discount - 10% off any plan',
    discountPercentage: 10,
    currency: 'USD',
    isActive: true,
    applicablePlans: ['premium', 'pro'],
    startDate: new Date('2025-01-01T00:00:00.000Z'),
    endDate: new Date('2025-12-31T23:59:59.999Z'),
    maxUses: 1,  // One-time use per user
    currentUses: 0,
    displayOnPricingPage: false,
    promotionalText: 'Welcome - 10% off your first month',
    badgeText: '10% OFF',
    badgeColor: '#82c91e'
  }
];

// ===== Annual Billing Discount =====
export const ANNUAL_DISCOUNT_PERCENTAGE = 20; // 20% off for annual billing

// ===== Extended Free Trials =====
export const TRIAL_PERIODS = {
  DEFAULT: 7, // Default 7-day trial
  EXTENDED: 14, // Extended 14-day trial for promotional periods
  PARTNER: 30, // 30-day partner offer trial
};

// ===== Helper Functions =====

/**
 * Get a subscription plan by its ID
 */
export function getPlanById(planId: string): SubscriptionPlan | undefined {
  const upperPlanId = planId.toUpperCase();
  return SUBSCRIPTION_PLANS[upperPlanId];
}

/**
 * Get all available subscription plans as an array
 */
export function getAllPlans(): SubscriptionPlan[] {
  return Object.values(SUBSCRIPTION_PLANS);
}

/**
 * Get all active plans that should be displayed on the pricing page
 */
export function getPublicPlans(): SubscriptionPlan[] {
  // Filter out any plans that shouldn't be publicly displayed
  return getAllPlans();
}

/**
 * Calculate the discounted price for a plan with a promotion code
 */
export function calculateDiscountedPrice(planPrice: number, discountPercentage: number): number {
  const discountAmount = (planPrice * discountPercentage) / 100;
  return Number((planPrice - discountAmount).toFixed(2));
}

/**
 * Get a promotion code by its code
 */
export function getPromotionByCode(code: string): PromotionCode | undefined {
  return PROMOTION_CODES.find(promo => 
    promo.code.toLowerCase() === code.toLowerCase() && promo.isActive
  );
}

/**
 * Calculate the annual price with discount
 */
export function calculateAnnualPrice(monthlyPrice: number): {
  monthlyEquivalent: number;
  annualTotal: number;
  savings: number;
} {
  const annualTotal = monthlyPrice * 12 * (1 - ANNUAL_DISCOUNT_PERCENTAGE / 100);
  const monthlyEquivalent = annualTotal / 12;
  const savings = (monthlyPrice * 12) - annualTotal;
  
  return {
    monthlyEquivalent: Number(monthlyEquivalent.toFixed(2)),
    annualTotal: Number(annualTotal.toFixed(2)),
    savings: Number(savings.toFixed(2))
  };
}

/**
 * Check if a promotion is valid for a given plan
 */
export function isPromotionValidForPlan(promoCode: string, planId: string): boolean {
  const promotion = getPromotionByCode(promoCode);
  if (!promotion) return false;
  
  const currentDate = new Date();
  const startDate = new Date(promotion.startDate);
  const endDate = new Date(promotion.endDate);
  
  // Check if promotion is active and applicable to the plan
  return (
    promotion.isActive &&
    currentDate >= startDate &&
    currentDate <= endDate &&
    promotion.applicablePlans.includes(planId.toLowerCase()) &&
    (promotion.maxUses === undefined || promotion.currentUses < promotion.maxUses)
  );
}
