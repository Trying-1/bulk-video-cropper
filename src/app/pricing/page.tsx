'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import SubscriptionPlans from '@/components/SubscriptionPlans';
import { APP_IDENTITY } from '@/config/branding';
import { SubscriptionPlan } from '@/config/pricing';
import Link from 'next/link';

export default function PricingPage() {
  const router = useRouter();
  const { user, userProfile, subscription } = useAuth();
  
  const handlePlanSelect = (plan: SubscriptionPlan) => {
    if (!user) {
      // If not logged in, redirect to auth page with plan info
      router.push(`/auth?signup=true&plan=${plan.id}`);
      return;
    }
    
    // If logged in, redirect to checkout page with plan info
    router.push(`/checkout?plan=${plan.id}`);
  };
  
  return (
    <div className="min-h-screen py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            Choose the perfect plan for your video editing needs
          </p>
        </div>
        
        <SubscriptionPlans 
          onSelectPlan={handlePlanSelect}
          currentPlanId={subscription?.plan?.name.toLowerCase()}
        />
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-8 text-left">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Can I change my plan later?</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Is there a limit to how many videos I can process?</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Yes, each plan has a specific limit for the number of videos you can process. Check the plan details for more information.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">What payment methods do you accept?</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                We accept all major credit cards, PayPal, and Apple Pay. All payments are processed securely through Stripe.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Do you offer refunds?</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                We offer a 7-day money-back guarantee if you're not satisfied with our service. Contact our support team for assistance.
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            <p className="text-base text-gray-500 dark:text-gray-400">
              Have more questions? <Link href="/contact" className="text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300 font-medium">Contact our support team</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
