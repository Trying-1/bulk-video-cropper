'use client';

import React, { useState } from 'react';
import { 
  SUBSCRIPTION_PLANS, 
  SubscriptionPlan, 
  PROMOTION_CODES, 
  isPromotionValidForPlan,
  calculateDiscountedPrice,
  calculateAnnualPrice,
  ANNUAL_DISCOUNT_PERCENTAGE
} from '@/config/pricing';

interface SubscriptionPlansProps {
  onSelectPlan?: (plan: SubscriptionPlan) => void;
  showAnnualOption?: boolean;
  currentPlanId?: string;
  promoCode?: string;
}

export default function SubscriptionPlans({ 
  onSelectPlan, 
  showAnnualOption = true, 
  currentPlanId, 
  promoCode 
}: SubscriptionPlansProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [promoCodeInput, setPromoCodeInput] = useState(promoCode || '');
  const [appliedPromoCode, setAppliedPromoCode] = useState(promoCode || '');
  const [promoError, setPromoError] = useState('');

  // Get all available plans
  const plans = Object.values(SUBSCRIPTION_PLANS);

  // Apply promo code if valid
  const applyPromoCode = () => {
    const code = promoCodeInput.trim().toUpperCase();
    const promo = PROMOTION_CODES.find(p => p.code === code && p.isActive);
    
    if (!promo) {
      setPromoError('Invalid or expired promotion code');
      return;
    }
    
    setAppliedPromoCode(code);
    setPromoError('');
  };

  // Calculate discounted price based on applied promo code
  const getDiscountedPrice = (plan: SubscriptionPlan) => {
    // Skip free plans
    if (plan.price === 0) return plan.price;
    
    // Check if the plan has a built-in promotion
    if (plan.hasPromotion && plan.discountPercentage && plan.discountedPrice) {
      return plan.discountedPrice;
    }
    
    // Check for applied promo code
    const promoCode = appliedPromoCode ? PROMOTION_CODES.find(p => 
      p.code === appliedPromoCode && 
      p.isActive && 
      p.applicablePlans.includes(plan.id)
    ) : null;
    
    if (promoCode) {
      return calculateDiscountedPrice(plan.price, promoCode.discountPercentage);
    }
    
    // Calculate annual price if annual billing selected
    if (billingCycle === 'annual') {
      const annualPricing = calculateAnnualPrice(plan.price);
      return annualPricing.monthlyEquivalent;
    }
    
    return plan.price;
  };

  // Get the discount percentage text
  const getDiscountText = (plan: SubscriptionPlan) => {
    // Skip free plans
    if (plan.price === 0) return '';
    
    // Plan's built-in promotion
    if (plan.hasPromotion && plan.discountPercentage) {
      return `${plan.discountPercentage}% off`;
    }
    
    // Applied promo code
    const promoCode = appliedPromoCode ? PROMOTION_CODES.find(p => 
      p.code === appliedPromoCode && 
      p.isActive && 
      p.applicablePlans.includes(plan.id)
    ) : null;
    
    if (promoCode) {
      return `${promoCode.discountPercentage}% off with ${promoCode.code}`;
    }
    
    // Annual billing discount
    if (billingCycle === 'annual') {
      return `${ANNUAL_DISCOUNT_PERCENTAGE}% off with annual billing`;
    }
    
    return '';
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {showAnnualOption && (
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${billingCycle === 'monthly' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${billingCycle === 'annual' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Annual
              <span className="ml-1 bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-200">Save {ANNUAL_DISCOUNT_PERCENTAGE}%</span>
            </button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const price = getDiscountedPrice(plan);
          const discountText = getDiscountText(plan);
          const isCurrentPlan = currentPlanId === plan.id;
          
          return (
            <div 
              key={plan.id}
              className={`rounded-lg overflow-hidden border ${plan.popular ? 'border-teal-500 dark:border-teal-400 shadow-lg' : 'border-gray-200 dark:border-gray-700'} ${isCurrentPlan ? 'ring-2 ring-teal-500 dark:ring-teal-400' : ''}`}
            >
              {/* Plan header */}
              <div className={`px-6 py-4 ${plan.popular ? 'bg-teal-500 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200'}`}>
                {plan.popular && (
                  <span className="inline-block px-2 py-1 text-xs font-semibold bg-white text-teal-800 rounded-full mb-2">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm opacity-90">{plan.description}</p>
              </div>
              
              {/* Plan pricing */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-baseline">
                  <span className="text-3xl font-extrabold">
                    {price === 0 ? 'Free' : `$${price}`}
                  </span>
                  {price > 0 && (
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      /{billingCycle === 'monthly' ? 'mo' : 'mo, billed annually'}
                    </span>
                  )}
                </div>
                {discountText && (
                  <div className="mt-1 text-sm text-green-600 dark:text-green-400">
                    {discountText}
                  </div>
                )}
              </div>
              
              {/* Plan features */}
              <div className="px-6 py-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-teal-500 dark:text-teal-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.limitations.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Limitations:</p>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-600 dark:text-gray-300">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Plan CTA */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                <button
                  onClick={() => onSelectPlan && onSelectPlan(plan)}
                  disabled={isCurrentPlan}
                  className={`w-full py-2 px-4 rounded-md font-medium ${isCurrentPlan 
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed' 
                    : plan.popular 
                      ? 'bg-teal-600 hover:bg-teal-700 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                  {isCurrentPlan ? 'Current Plan' : plan.cta}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Promo code input */}
      <div className="mt-8 max-w-md mx-auto">
        <div className="flex">
          <input
            type="text"
            value={promoCodeInput}
            onChange={(e) => setPromoCodeInput(e.target.value)}
            placeholder="Enter promo code"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-200"
          />
          <button
            onClick={applyPromoCode}
            className="px-4 py-2 bg-teal-600 text-white rounded-r-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Apply
          </button>
        </div>
        {promoError && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{promoError}</p>
        )}
        {appliedPromoCode && !promoError && (
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">
            Promo code {appliedPromoCode} applied successfully!
          </p>
        )}
      </div>
    </div>
  );
}
