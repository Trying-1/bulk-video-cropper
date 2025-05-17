'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function PlansPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Discount system configuration (currently disabled)
  const [discounts, setDiscounts] = useState({
    premium: {
      active: false,
      code: 'SUMMER20',
      percent: 20,
      expiresIn: '2d 15h 32m',
    },
    pro: {
      active: false,
      code: 'PRO15',
      percent: 15,
      expiresIn: '5d 10h 22m',
    }
  });

  // Toggle discount for demo purposes
  const toggleDiscount = (plan: 'premium' | 'pro') => {
    setDiscounts(prev => ({
      ...prev,
      [plan]: {
        ...prev[plan],
        active: !prev[plan].active
      }
    }));
  };

  // Calculate discounted price
  const getDiscountedPrice = (price: number, planId: string) => {
    if (planId === 'premium' && discounts.premium.active) {
      return (price * (100 - discounts.premium.percent) / 100).toFixed(2);
    }
    if (planId === 'pro' && discounts.pro.active) {
      return (price * (100 - discounts.pro.percent) / 100).toFixed(2);
    }
    return price.toFixed(2);
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      billing: 'Free forever',
      description: 'Perfect for casual users who want to try out our service.',
      features: [
        '5 videos per month',
        'Basic video cropping',
        'Standard quality output',
        'Community support'
      ],
      limitations: [
        'Watermark on videos',
        'Limited resolution',
        'No batch processing'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      billing: 'per month',
      description: 'For content creators who need more power and flexibility.',
      features: [
        '50 videos per month',
        'Advanced video cropping',
        'HD quality output',
        'No watermark',
        'Batch processing',
        'Priority support'
      ],
      limitations: [],
      cta: 'Choose Premium',
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29.99,
      billing: 'per month',
      description: 'For professionals who need the ultimate video editing experience.',
      features: [
        'Unlimited videos',
        'All premium features',
        '4K quality output',
        'Custom branding',
        'API access',
        'Dedicated support'
      ],
      limitations: [],
      cta: 'Choose Pro',
      popular: false
    }
  ];

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') {
      // For free plan, just redirect to editor
      if (user) {
        toast.success('You are now on the Free plan!');
        router.push('/editor');
      } else {
        router.push('/auth?signup=true');
      }
    } else {
      // For paid plans, redirect to checkout
      if (user) {
        // Apply discount code if active
        const discountCode = 
          (planId === 'premium' && discounts.premium.active) ? discounts.premium.code :
          (planId === 'pro' && discounts.pro.active) ? discounts.pro.code : null;
          
        if (discountCode) {
          router.push(`/checkout?plan=${planId}&promo=${discountCode}`);
        } else {
          router.push(`/checkout?plan=${planId}`);
        }
      } else {
        // Pass discount code to auth if active
        const discountCode = 
          (planId === 'premium' && discounts.premium.active) ? discounts.premium.code :
          (planId === 'pro' && discounts.pro.active) ? discounts.pro.code : null;
          
        if (discountCode) {
          router.push(`/auth?signup=true&plan=${planId}&promo=${discountCode}`);
        } else {
          router.push(`/auth?signup=true&plan=${planId}`);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-teal-300 to-teal-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -top-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute bottom-40 right-10 w-72 h-72 bg-gradient-to-br from-orange-300 to-pink-400 rounded-full filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 text-sm font-medium mb-6">
            <span className="flex h-2 w-2 relative mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
            </span>
            Limited-time offers available!
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-400 dark:to-blue-500 mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Select the perfect plan for your video editing needs. All plans include our core features with different limits and capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isPremium = plan.id === 'premium';
            const isPro = plan.id === 'pro';
            const hasDiscount = (isPremium && discounts.premium.active) || (isPro && discounts.pro.active);
            const discountData = isPremium ? discounts.premium : isPro ? discounts.pro : null;
            const discountPrice = hasDiscount ? getDiscountedPrice(plan.price, plan.id) : plan.price.toFixed(2);
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl ${plan.popular ? 'ring-2 ring-teal-500 dark:ring-teal-400 scale-105 md:scale-110 z-10' : ''}`}
              >
                {/* Top ribbon */}
                {plan.popular && (
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-center py-2 px-4 font-bold">
                    Most Popular
                  </div>
                )}
                
                {/* Discount badge - only for premium and pro */}
                {hasDiscount && (
                  <div className="absolute -right-10 top-6 transform rotate-45 bg-yellow-500 text-yellow-900 font-bold py-1 px-12 shadow-md z-20">
                    {discountData?.percent}% OFF
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  
                  {/* Price display with discount if applicable */}
                  <div className="flex items-baseline mb-6">
                    {hasDiscount ? (
                      <>
                        <span className="relative inline-block mr-2">
                          <span className="text-2xl text-gray-500 dark:text-gray-400 line-through">${plan.price.toFixed(2)}</span>
                          <span className="absolute -top-4 right-0 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                            SAVE {discountData?.percent}%
                          </span>
                        </span>
                        <span className="text-4xl font-bold text-teal-600 dark:text-teal-400">${discountPrice}</span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold text-teal-600 dark:text-teal-400">${plan.price.toFixed(2)}</span>
                    )}
                    <span className="text-gray-500 dark:text-gray-400 ml-2">{plan.billing}</span>
                  </div>
                  
                  {/* Promo code display */}
                  {hasDiscount && (
                    <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span className="text-yellow-800 dark:text-yellow-200 font-medium">{discountData?.code}</span>
                        </div>
                        <div className="text-xs text-yellow-600 dark:text-yellow-400">
                          Expires in: {discountData?.expiresIn}
                        </div>
                      </div>
                      <div className="mt-1 h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full animate-pulse" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 min-h-[60px]">{plan.description}</p>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-700 dark:text-gray-300">
                        <svg
                          className="h-5 w-5 text-teal-500 dark:text-teal-400 mr-3 flex-shrink-0"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <ul className="space-y-3 mb-8">
                      {plan.limitations.map((limitation, i) => (
                        <li key={i} className="flex items-center text-gray-500 dark:text-gray-400">
                          <svg
                            className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 transform shadow-lg hover:shadow-xl hover:-translate-y-1 ${hasDiscount ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700' : plan.popular ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'}`}
                  >
                    {hasDiscount ? `${plan.cta} - Save ${discountData?.percent}%` : plan.cta}
                  </button>

                  {/* For testing: toggle discount button (remove in production) */}
                  {(isPremium || isPro) && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDiscount(isPremium ? 'premium' : 'pro');
                      }}
                      className="mt-4 text-xs text-gray-500 dark:text-gray-400 hover:underline"
                    >
                      {hasDiscount ? 'Remove discount' : 'Apply discount'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto grid gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I upgrade or downgrade my plan later?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the start of your next billing cycle.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                How does the video limit work?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                The video limit refers to the number of videos you can process each month. This counter resets at the beginning of each billing cycle.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Do you offer educational or non-profit discounts?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, we offer special pricing for educational institutions and non-profit organizations. Please contact our support team for more details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
