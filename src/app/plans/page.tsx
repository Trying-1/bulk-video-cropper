'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useComingSoon } from '@/components/ComingSoonModal';
import { isFeatureEnabled } from '@/config/features';
import { getAllPlans, PROMOTION_CODES, calculateDiscountedPrice, SubscriptionPlan } from '@/config/pricing';

export default function PlansPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showComingSoon, ComingSoonModal } = useComingSoon();
  
  // Check if payments are enabled
  const paymentsEnabled = isFeatureEnabled('ENABLE_PAYMENTS');
  
  // Use the centralized promotion codes from pricing configuration
  const [activePromoCodes, setActivePromoCodes] = useState<string[]>([]);
  
  // Get the first active promotion code if any
  const activePromo = activePromoCodes.length > 0 ? PROMOTION_CODES.find(promo => 
    promo.code === activePromoCodes[0]
  ) : null;

  // Track pre-selected plan from URL
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  // Check if there's an active discount for the plan
  const hasPlanDiscount = (planId: string): boolean => {
    if (!activePromo) return false;
    
    const promo = PROMOTION_CODES.find(p => p.code === activePromo.code && p.isActive);
    if (!promo) return false;
    
    // Manually check if promotion is valid for the plan
    try {
      const currentDate = new Date();
      const startDate = new Date(promo.startDate);
      const endDate = new Date(promo.endDate);
      
      return (
        promo.isActive &&
        currentDate >= startDate &&
        currentDate <= endDate &&
        promo.applicablePlans.includes(planId.toLowerCase())
      );
    } catch (error) {
      console.error('Error checking plan discount:', error);
      return false;
    }
  };
  
  // Calculate discounted price for a plan
  const calculatePlanPrice = (plan: SubscriptionPlan) => {
    if (!activePromo || !hasPlanDiscount(plan.id)) return plan.price;
    const promo = PROMOTION_CODES.find(p => p.code === activePromo.code && p.isActive);
    if (!promo) return plan.price;
    return calculateDiscountedPrice(plan.price, promo.discountPercentage);
  };

  useEffect(() => {
    // Check for plan parameter in URL
    const params = new URLSearchParams(window.location.search);
    const planParam = params.get('plan');
    
    if (planParam) {
      setSelectedPlan(planParam);
      
      // Automatically scroll to the plan section
      setTimeout(() => {
        const planElement = document.getElementById(`plan-${planParam}`);
        if (planElement) {
          planElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add a highlight animation
          planElement.classList.add('highlight-plan');
          setTimeout(() => {
            planElement.classList.remove('highlight-plan');
          }, 2000);
        }
      }, 500);
    }
  }, []);

  // Toggle promotion code for a plan
  const togglePromotion = (promoCode: string) => {
    // Only allow one active promotion at a time
    setActivePromoCodes(prev => {
      if (prev.includes(promoCode)) {
        return [];
      }
      return [promoCode];
    });
  };

  // Apply promotion code
  const applyPromoCode = (code: string) => {
    const promo = PROMOTION_CODES.find(p => p.code === code && p.isActive);
    if (promo) {
      setActivePromoCodes([code]);
    } else {
      toast.error('Invalid or expired promotion code');
    }
  };

  // Clear all active promotions
  const clearPromotions = () => {
    setActivePromoCodes([]);
  };

  // Calculate price with any active promotion codes
  const getDiscountedPrice = (plan: SubscriptionPlan) => {
    // Skip free plans
    if (plan.price === 0) return plan.price.toFixed(2);
    
    // Check for any applicable promo codes that are active
    const applicablePromo = PROMOTION_CODES.find(promo => 
      activePromoCodes.includes(promo.code) && 
      promo.applicablePlans.includes(plan.id)
    );
    
    if (applicablePromo) {
      return calculateDiscountedPrice(plan.price, applicablePromo.discountPercentage).toFixed(2);
    }
    
    return plan.price.toFixed(2);
  };

  // Get plans from centralized pricing configuration
  const plans = getAllPlans();

  // Function to handle selecting a plan
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    
    // For the free plan, go directly to the payment page (which will just show confirmation)
    if (planId === 'free') {
      router.push(`/payment?plan=${planId}`);
      return;
    }
    
    // For premium plans, if payments are disabled, show Coming Soon modal
    if (!paymentsEnabled) {
      const plan = plans.find(p => p.id === planId);
      showComingSoon({
        featureName: `${plan?.name} Plan`,
        description: `The ${plan?.name} plan is coming soon! We're currently finalizing our payment system and premium features. You can continue using our free plan in the meantime.`
      });
      return;
    }
    
    // If payments are enabled, proceed to payment page
    router.push(`/payment?plan=${planId}`);
  };

  // Handle signing up from plans page
  const handleSignUp = () => {
    if (!user) {
      // Store current path to redirect back after auth
      sessionStorage.setItem('authRedirect', '/plans');
      router.push('/auth');
    }
  };

  // Function to display prices with formatting
  const formatCurrency = (amount: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: amount % 1 === 0 ? 0 : decimals,
      maximumFractionDigits: decimals
    }).format(amount);
  };

  // CSS animations for plan hover
  const hoverAnimation = "transition-transform duration-300 hover:-translate-y-2";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      {/* Coming Soon Modal Component */}
      <ComingSoonModal />
      
      {!paymentsEnabled && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700 dark:text-blue-200 font-medium">
                  <span className="font-bold">Coming Soon:</span> Premium features are currently in development for our MVP. You can explore plan options below, but payment processing is not yet available. Stay tuned for updates!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
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
            // Check if any promo codes apply to this plan
            const applicablePromos = PROMOTION_CODES.filter(promo => 
              activePromoCodes.includes(promo.code) && 
              promo.applicablePlans.includes(plan.id)
            );
            const hasDiscount = applicablePromos.length > 0;
            const activePromo = hasDiscount ? applicablePromos[0] : null;
            const discountPrice = getDiscountedPrice(plan);
            
            return (
              <div 
                id={`plan-${plan.id}`}
                key={plan.id} 
                className={
                  `p-6 rounded-lg transition-all duration-300 ${plan.popular 
                    ? 'bg-white dark:bg-gray-800 shadow-lg scale-105 border-2 border-teal-500 dark:border-teal-400' 
                    : 'bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg'}
                  ${selectedPlan === plan.id ? 'ring-4 ring-teal-500 ring-opacity-50' : ''}`
                }
              >
                {/* Top ribbon */}
                {plan.popular && (
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-center py-2 px-4 font-bold">
                    Most Popular
                  </div>
                )}
                
                {/* Discount badge - only for premium and pro */}
                {hasPlanDiscount(plan.id) && activePromo && (
                  <div className="absolute -right-10 top-6 transform rotate-45 bg-yellow-500 text-yellow-900 font-bold py-1 px-12 shadow-md z-20">
                    {activePromo.discountPercentage}% OFF
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  
                  {/* Price display with discount if applicable */}
                  <div className="flex items-baseline mb-6">
                    {hasPlanDiscount(plan.id) && activePromo ? (
                      <>
                        <span className="relative inline-block mr-2">
                          <span className="text-2xl text-gray-500 dark:text-gray-400 line-through">${plan.price.toFixed(2)}</span>
                          <span className="absolute -top-4 right-0 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                            SAVE {activePromo.discountPercentage}%
                          </span>
                        </span>
                        <span className="text-4xl font-bold text-teal-600 dark:text-teal-400">
                          ${calculatePlanPrice(plan).toFixed(2)}
                        </span>
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
                          <span className="text-yellow-800 dark:text-yellow-200 font-medium">{activePromo?.code}</span>
                        </div>
                        <div className="text-xs text-yellow-600 dark:text-yellow-400">
                          Limited time offer
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
                    className={`w-full mt-8 ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900'} text-white rounded-lg px-4 py-3 transition-colors duration-300 relative`}
                  >
                    {!paymentsEnabled && plan.id !== 'free' ? (
                      <>
                        <span className="opacity-80">{plan.cta}</span>
                        <span className="absolute top-0 right-2 transform -translate-y-1/2 bg-yellow-500 text-xs text-black px-2 py-0.5 rounded-full">Coming Soon</span>
                      </>
                    ) : (
                      plan.cta
                    )}
                  </button>

                  {/* Toggle applicable promotion codes */}
                  {plan.price > 0 && (
                    <div className="mt-4">
                      {PROMOTION_CODES.filter(promo => 
                        promo.isActive && promo.applicablePlans.includes(plan.id)
                      ).map(promo => (
                        <button 
                          key={promo.code}
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePromotion(promo.code);
                          }}
                          className="text-xs text-gray-500 dark:text-gray-400 hover:underline mx-1"
                        >
                          {activePromoCodes.includes(promo.code) ? `Remove ${promo.code}` : `Apply ${promo.code} (${promo.discountPercentage}% off)`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                Can I change plans later?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, you can upgrade, downgrade or cancel your plan at any time. Changes will take effect at the end of your current billing cycle.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                What happens when I reach my monthly video limit?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                On the Free plan, you'll need to wait until the next billing cycle to process more videos. Premium and Pro plans have higher or unlimited processing allowances.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                How do I cancel my subscription?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You can cancel anytime from your account settings. After cancellation, your premium features will remain active until the end of your current billing period.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, we offer a 7-day money-back guarantee if you're not satisfied with our service. Contact our support team to request a refund.
              </p>
            </div>
          </div>
        </div>
        
        {/* Final CTA */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to start cropping videos like a pro?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Choose the plan that fits your needs and start creating perfect videos for every platform.
          </p>
          <button
            onClick={() => handleSelectPlan('free')}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started for Free
          </button>
        </div>
      </div>
    </div>
  );
}
