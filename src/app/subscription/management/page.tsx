'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { updateAppStateCookie } from '@/utils/cookies';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

interface BillingCycle {
  period: string;
  nextBilling: string;
  amount: string;
}

interface UsageStats {
  videosProcessed: number;
  totalVideosAllowed: number;
  storageUsed: string;
  totalStorage: string;
}

export default function SubscriptionManagementPage() {
  const router = useRouter();
  const { user, subscription } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<BillingCycle | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);

  useEffect(() => {
    // Track page visit
    updateAppStateCookie({
      lastVisitedPage: '/subscription/management'
    });

    // Fetch subscription details
    const fetchSubscriptionDetails = async () => {
      setIsLoading(true);
      
      try {
        // This would be a real API call in production
        // For demo purposes, we'll create mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock billing cycle data
        const mockBillingCycle: BillingCycle = {
          period: 'Monthly',
          nextBilling: new Date(Date.now() + 15 * 86400000).toLocaleDateString(),
          amount: '$9.99'
        };
        
        // Mock usage stats
        const mockUsageStats: UsageStats = {
          videosProcessed: 27,
          totalVideosAllowed: 100,
          storageUsed: '1.2 GB',
          totalStorage: '10 GB'
        };
        
        // Mock payment methods
        const mockPaymentMethods = [
          {
            id: 'pm_1',
            type: 'card',
            brand: 'visa',
            last4: '4242',
            expMonth: 12,
            expYear: 2028,
            isDefault: true
          }
        ];
        
        // Mock billing history
        const mockBillingHistory = [
          {
            id: 'inv_1',
            date: new Date(Date.now() - 30 * 86400000).toLocaleDateString(),
            amount: '$9.99',
            status: 'Paid',
            downloadUrl: '#'
          },
          {
            id: 'inv_2',
            date: new Date(Date.now() - 60 * 86400000).toLocaleDateString(),
            amount: '$9.99',
            status: 'Paid',
            downloadUrl: '#'
          }
        ];
        
        setBillingCycle(mockBillingCycle);
        setUsageStats(mockUsageStats);
        setPaymentMethods(mockPaymentMethods);
        setBillingHistory(mockBillingHistory);
      } catch (error) {
        console.error('Failed to fetch subscription details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only fetch if user is authenticated and subscribed
    if (user && subscription && subscription.plan?.name !== 'free') {
      fetchSubscriptionDetails();
    } else if (user) {
      // Redirect free users to upgrade page
      router.push('/upsell');
    }
  }, [user, subscription, router]);

  const handleCancelSubscription = () => {
    // In a real app, this would call an API to cancel the subscription
    setIsConfirmCancelOpen(false);
    
    // Show success message
    alert('Your subscription has been canceled. You will continue to have access until the end of your billing period.');
    
    // Redirect to home page
    router.push('/');
  };

  const handleUpdatePaymentMethod = () => {
    // In a real app, this would open a modal or redirect to a payment method update page
    router.push('/payment-methods');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscription Management</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your plan, billing, and payment methods
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                href="/profile"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Profile
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="md:col-span-2 space-y-8">
                {/* Current Plan */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                >
                  <div className="px-6 py-4 bg-blue-50 dark:bg-blue-900 border-b border-blue-100 dark:border-blue-800">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Current Plan</h2>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Premium Plan</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {billingCycle?.period} billing
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {billingCycle?.amount}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Next billing on {billingCycle?.nextBilling}
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col sm:flex-row sm:justify-between gap-4">
                      <Link
                        href="/plans"
                        className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Change Plan
                      </Link>
                      <button
                        onClick={() => setIsConfirmCancelOpen(true)}
                        className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Cancel Subscription
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Usage Statistics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                >
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Usage Statistics</h2>
                  </div>
                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Videos Processed
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {usageStats?.videosProcessed} / {usageStats?.totalVideosAllowed}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${(usageStats?.videosProcessed || 0) / (usageStats?.totalVideosAllowed || 1) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Storage Used
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {usageStats?.storageUsed} / {usageStats?.totalStorage}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: '12%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Billing History */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                >
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Billing History</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Invoice
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {billingHistory.map((invoice) => (
                          <tr key={invoice.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {invoice.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {invoice.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                                {invoice.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a href={invoice.downloadUrl} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                                Download
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Payment Methods */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                >
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Methods</h2>
                  </div>
                  <div className="p-6">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          {method.brand === 'visa' && (
                            <svg className="h-8 w-8 mr-3" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="48" height="48" rx="6" fill="#1A1F71" />
                              <path d="M18 32H14L10 16H14L18 32Z" fill="#FFFFFF" />
                              <path d="M29 16C28.1 16 26.5 16.5 26 18L22 32H26L26.5 30H30.5L31 32H35L31 16H29ZM27.5 26L29 21L30 26H27.5Z" fill="#FFFFFF" />
                              <path d="M21 24L22 20C20.5 19 18 18 16 18L16 18.5C19 20 21 22 21 24Z" fill="#FFFFFF" />
                              <path d="M39 32H35L32 16H36L39 32Z" fill="#FFFFFF" />
                            </svg>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              •••• {method.last4}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Expires {method.expMonth}/{method.expYear}
                            </p>
                          </div>
                        </div>
                        {method.isDefault && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                    
                    <button
                      onClick={handleUpdatePaymentMethod}
                      className="mt-2 inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full"
                    >
                      Update Payment Method
                    </button>
                  </div>
                </motion.div>

                {/* Need Help? */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                >
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Need Help?</h2>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Have questions about your subscription or billing? Our support team is here to help.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full"
                    >
                      Contact Support
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmCancelOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      Cancel Subscription
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to cancel your subscription? You will lose access to all premium features at the end of your current billing period.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCancelSubscription}
                >
                  Cancel Subscription
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsConfirmCancelOpen(false)}
                >
                  Keep Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
