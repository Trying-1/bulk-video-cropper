/**
 * Promotion Code Model
 * Represents discount promotions that can be applied to subscription plans
 */
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
  createdAt: Date | string;
  updatedAt: Date | string;
  createdBy: string;
  // Display settings
  displayOnPricingPage: boolean;
  promotionalText?: string;
  badgeText?: string;
  badgeColor?: string;
}

/**
 * Default promotion codes
 */
export const defaultPromotionCodes: Omit<PromotionCode, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>[] = [
  {
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
  }
];
