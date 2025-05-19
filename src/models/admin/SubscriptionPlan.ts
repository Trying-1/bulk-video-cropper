/**
 * Subscription Plan Model
 * Represents the available subscription plans that users can purchase
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  features: string[];
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  isActive: boolean;
  trialDays: number;
  maxVideoStorage: number; // in GB
  maxProcessingHours: number;
  priority: number; // for display order
  createdAt: Date | string;
  updatedAt: Date | string;
  // Discount-related fields
  hasPromotion: boolean;
  promotionCode?: string;
  discountPercentage?: number;
  promotionExpiry?: Date | string;
  displayOriginalPrice?: boolean;
}

/**
 * Default subscription plans
 */
export const defaultSubscriptionPlans: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Free',
    description: 'Basic video cropping for personal use',
    features: [
      'Crop up to 3 videos per day',
      '5 mins max video length',
      'Standard quality export',
      'Basic aspect ratios'
    ],
    priceMonthly: 0,
    priceYearly: 0,
    currency: 'USD',
    isActive: true,
    trialDays: 0,
    maxVideoStorage: 1,
    maxProcessingHours: 1,
    priority: 1,
    hasPromotion: false
  },
  {
    name: 'Pro',
    description: 'Enhanced features for content creators',
    features: [
      'Unlimited video crops',
      '30 mins max video length',
      'HD quality export',
      'All aspect ratios',
      'Batch processing',
      'Priority processing'
    ],
    priceMonthly: 9.99,
    priceYearly: 99.99,
    currency: 'USD',
    isActive: true,
    trialDays: 7,
    maxVideoStorage: 20,
    maxProcessingHours: 10,
    priority: 2,
    hasPromotion: false,
    promotionCode: 'PRO15',
    discountPercentage: 15,
    displayOriginalPrice: true
  },
  {
    name: 'Premium',
    description: 'Professional video cropping for businesses',
    features: [
      'Everything in Pro',
      'Unlimited video length',
      '4K quality export',
      'Advanced filters and effects',
      'Cloud storage integration',
      'Team accounts',
      'API access'
    ],
    priceMonthly: 29.99,
    priceYearly: 299.99,
    currency: 'USD',
    isActive: true,
    trialDays: 14,
    maxVideoStorage: 100,
    maxProcessingHours: 50,
    priority: 3,
    hasPromotion: true,
    promotionCode: 'SUMMER20',
    discountPercentage: 20,
    promotionExpiry: new Date('2025-08-31T23:59:59.999Z'),
    displayOriginalPrice: true
  }
];
