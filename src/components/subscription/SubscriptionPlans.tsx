'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChange } from '@/services/firebaseService';
import { User } from '@/types/user';

interface SubscriptionPlan {
  name: string;
  price: number;
  features: string[];
}

const plans: SubscriptionPlan[] = [
  {
    name: 'Free',
    price: 0,
    features: [
      '5 videos per month',
      'Basic video cropping',
      'Standard quality output',
      'Watermark included'
    ]
  },
  {
    name: 'Premium',
    price: 9.99,
    features: [
      '50 videos per month',
      'Advanced video cropping',
      'HD quality output',
      'No watermark',
      'Priority support'
    ]
  },
  {
    name: 'Pro',
    price: 29.99,
    features: [
      '100 videos per month',
      'All premium features',
      '4K quality output',
      'Custom branding',
      'Dedicated support'
    ]
  }
];

export default function SubscriptionPlans() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);
    return () => unsubscribe();
  }, []);

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    // For now, we'll just show an alert
    alert(`Upgrade to ${plan.name} plan`);
  };

  if (!user) {
    return <div className="text-center py-8">Please sign in to view subscription plans</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">{plan.name}</h2>
            <p className="text-4xl font-bold text-center mb-6">
              ${plan.price.toFixed(2)}
              <span className="text-lg font-normal">/month</span>
            </p>
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg mt-6 hover:bg-blue-600 transition-colors"
              onClick={() => handleUpgrade(plan)}
              disabled={plan.name === 'Free' || (user.subscription === 'premium' && plan.name === 'Premium')}
            >
              {plan.name === 'Free' ? 'Current Plan' : 'Upgrade to ' + plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
