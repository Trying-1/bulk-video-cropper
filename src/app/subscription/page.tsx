'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function SubscriptionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    // Fetch subscription details from backend
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/subscription');
        const data = await response.json();
        setSubscription(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        setLoading(false);
      }
    };

    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const handleUpgrade = async (planId: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      if (response.ok) {
        toast.success('Upgrade successful!');
        router.refresh();
      } else {
        toast.error('Upgrade failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Subscription cancelled successfully.');
        setShowCancelModal(false);
        router.refresh();
      } else {
        toast.error('Cancellation failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Your Subscription
          </h1>

          {subscription ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {subscription.plan.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    ${subscription.plan.price} / month
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Current Plan Details
                  </h3>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center">
                      <span className="w-1/3">Plan:</span>
                      <span className="font-medium">{subscription.plan.name}</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-1/3">Status:</span>
                      <span className={`font-medium ${
                        subscription.status === 'active' 
                          ? 'text-green-600' 
                          : subscription.status === 'cancelled' 
                            ? 'text-red-600' 
                            : 'text-yellow-600'
                      }`}>
                        {subscription.status}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-1/3">Next Billing:</span>
                      <span className="font-medium">
                        {new Date(subscription.nextBillingDate).toLocaleDateString()}
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Usage
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Videos Processed
                        </span>
                        <h4 className="text-lg font-semibold">
                          {subscription.usage.videosProcessed} / {subscription.plan.videoLimit}
                        </h4>
                      </div>
                      <div className="w-48">
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-teal-500 dark:bg-teal-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(subscription.usage.videosProcessed / subscription.plan.videoLimit) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Storage Used
                        </span>
                        <h4 className="text-lg font-semibold">
                          {(subscription.usage.storageUsed / 1024 / 1024).toFixed(1)} MB
                        </h4>
                      </div>
                      <div className="w-48">
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-teal-500 dark:bg-teal-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(subscription.usage.storageUsed / subscription.plan.storageLimit) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No active subscription
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You're currently on the Free plan. Upgrade to unlock more features.
              </p>
              <Link
                href="/plans"
                className="bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Upgrade Now
              </Link>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Available Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free Plan */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Free
                </h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    $0
                  </span>
                  <span className="ml-2 text-gray-500 dark:text-gray-400">
                    / month
                  </span>
                </div>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>5 videos per month</li>
                  <li>Basic video cropping</li>
                  <li>Standard quality output</li>
                  <li>Watermark included</li>
                </ul>
              </div>

              {/* Premium Plan */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Premium
                </h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    $9.99
                  </span>
                  <span className="ml-2 text-gray-500 dark:text-gray-400">
                    / month
                  </span>
                </div>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>50 videos per month</li>
                  <li>Advanced video cropping</li>
                  <li>HD quality output</li>
                  <li>No watermark</li>
                  <li>Priority support</li>
                </ul>
                <button
                  onClick={() => handleUpgrade('premium')}
                  className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 w-full mt-4"
                >
                  Upgrade to Premium
                </button>
              </div>

              {/* Pro Plan */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Pro
                </h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    $29.99
                  </span>
                  <span className="ml-2 text-gray-500 dark:text-gray-400">
                    / month
                  </span>
                </div>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Unlimited videos</li>
                  <li>All premium features</li>
                  <li>4K quality output</li>
                  <li>Custom branding</li>
                  <li>Dedicated support</li>
                </ul>
                <button
                  onClick={() => handleUpgrade('pro')}
                  className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 w-full mt-4"
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Cancel Subscription
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to cancel your subscription? Your plan will remain active until the end of your current billing cycle.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
