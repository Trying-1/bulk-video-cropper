'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { updateAppStateCookie } from '@/utils/cookies';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';

// This would be configured in your environment variables
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function AddPaymentMethodForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // In a real application, you would call your backend API
      // For demo purposes, we'll simulate a successful operation
      await new Promise(resolve => setTimeout(resolve, 1500));

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add payment method');
      console.error('Error adding payment method:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Card Details
        </label>
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
          className="p-3 border border-gray-300 dark:border-gray-600 rounded-md"
        />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Add Payment Method'
        )}
      </button>
    </form>
  );
}

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export default function PaymentMethodsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Track page visit
    updateAppStateCookie({
      lastVisitedPage: '/payment-methods'
    });

    // Fetch payment methods
    const fetchPaymentMethods = async () => {
      setIsLoading(true);
      
      try {
        // This would be a real API call in production
        // For demo purposes, we'll create mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock payment methods
        const mockPaymentMethods: PaymentMethod[] = [
          {
            id: 'pm_1',
            brand: 'visa',
            last4: '4242',
            expMonth: 12,
            expYear: 2028,
            isDefault: true
          },
          {
            id: 'pm_2',
            brand: 'mastercard',
            last4: '8210',
            expMonth: 10,
            expYear: 2026,
            isDefault: false
          }
        ];
        
        setPaymentMethods(mockPaymentMethods);
      } catch (error) {
        console.error('Failed to fetch payment methods:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchPaymentMethods();
    }
  }, [user]);

  const handleSetDefault = (id: string) => {
    // In a real app, this would call an API to set the default payment method
    setPaymentMethods(
      paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
    
    setSuccessMessage('Default payment method updated successfully');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDelete = (id: string) => {
    // In a real app, this would call an API to delete the payment method
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    
    setSuccessMessage('Payment method removed successfully');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleAddSuccess = () => {
    // In a real app, this would refresh the payment methods list
    // For demo purposes, we'll add a mock payment method
    const newMethod: PaymentMethod = {
      id: `pm_${Math.floor(Math.random() * 1000)}`,
      brand: 'visa',
      last4: '1234',
      expMonth: 8,
      expYear: 2029,
      isDefault: false
    };
    
    setPaymentMethods([...paymentMethods, newMethod]);
    setIsAddingNew(false);
    
    setSuccessMessage('Payment method added successfully');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const getBrandIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return (
          <svg className="h-8 w-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="6" fill="#1A1F71" />
            <path d="M18 32H14L10 16H14L18 32Z" fill="#FFFFFF" />
            <path d="M29 16C28.1 16 26.5 16.5 26 18L22 32H26L26.5 30H30.5L31 32H35L31 16H29ZM27.5 26L29 21L30 26H27.5Z" fill="#FFFFFF" />
            <path d="M21 24L22 20C20.5 19 18 18 16 18L16 18.5C19 20 21 22 21 24Z" fill="#FFFFFF" />
            <path d="M39 32H35L32 16H36L39 32Z" fill="#FFFFFF" />
          </svg>
        );
      case 'mastercard':
        return (
          <svg className="h-8 w-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="6" fill="#16366F" />
            <circle cx="16" cy="24" r="10" fill="#EB001B" />
            <circle cx="32" cy="24" r="10" fill="#F79E1B" />
            <path d="M24 31C27.3137 31 30 27.866 30 24C30 20.134 27.3137 17 24 17C20.6863 17 18 20.134 18 24C18 27.866 20.6863 31 24 31Z" fill="#FF5F00" />
          </svg>
        );
      default:
        return (
          <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payment Methods</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your saved payment methods
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                href="/subscription/management"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Subscription
              </Link>
            </div>
          </div>

          {/* Success message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-md"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    {successMessage}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Your Payment Methods</h2>
              </div>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {paymentMethods.map((method) => (
                  <li key={method.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getBrandIcon(method.brand)}
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} ending in {method.last4}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Expires {method.expMonth.toString().padStart(2, '0')}/{method.expYear}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {method.isDefault ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                            Default
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetDefault(method.id)}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500"
                          >
                            Set as default
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(method.id)}
                          className="text-sm text-red-600 dark:text-red-400 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
                
                {paymentMethods.length === 0 && !isAddingNew && (
                  <li className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No payment methods</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Add a payment method to manage your subscription.
                    </p>
                  </li>
                )}
              </ul>
              
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                {isAddingNew ? (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add New Payment Method</h3>
                      <button
                        onClick={() => setIsAddingNew(false)}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                    <Elements stripe={stripePromise}>
                      <AddPaymentMethodForm onSuccess={handleAddSuccess} />
                    </Elements>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingNew(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Payment Method
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
