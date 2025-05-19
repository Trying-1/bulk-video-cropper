'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { updateAppStateCookie } from '@/utils/cookies';
import { isFeatureEnabled } from '@/config/features';

// This would be configured in your environment variables
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  recommended?: boolean;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    features: [
      '5 videos per month',
      'Basic video cropping',
      '720p output quality',
      'Small watermark'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    currency: 'USD',
    recommended: true,
    features: [
      '50 videos per month',
      'Advanced cropping options',
      '1080p HD output quality',
      'No watermark',
      'Priority support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29.99,
    currency: 'USD',
    features: [
      'Unlimited videos',
      'All Premium features',
      '4K output quality',
      'Batch processing',
      '24/7 dedicated support'
    ]
  }
];

function CheckoutForm({ selectedPlan, onSuccess }: { selectedPlan: Plan, onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch payment intent when the component mounts or when selected plan changes
  useEffect(() => {
    if (selectedPlan && selectedPlan.price > 0 && user) {
      const fetchPaymentIntent = async () => {
        try {
          const response = await fetch('/api/stripe/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              planId: selectedPlan.id,
              userId: user.uid,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to create payment intent');
          }

          const data = await response.json();
          setClientSecret(data.clientSecret);
        } catch (error) {
          console.error('Error creating payment intent:', error);
          setFormError(error instanceof Error ? error.message : 'Failed to initialize payment');
        }
      };

      fetchPaymentIntent();
    }
  }, [selectedPlan, user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      return;
    }
    
    setIsProcessing(true);
    setFormError(null);
    
    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }
      
      // Use the client secret from the payment intent to process the payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.displayName || 'Unnamed User',
            email: user?.email,
          },
        },
      });
      
      if (error) {
        throw new Error(error.message || 'Payment failed');
      }
      
      if (paymentIntent?.status === 'succeeded') {
        // Track payment attempt in cookies for analytics
        updateAppStateCookie({
          lastPaymentAttempt: {
            plan: selectedPlan.id,
            timestamp: new Date().toISOString()
          }
        });
        
        // Payment successful, notify parent component
        onSuccess();
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setFormError(error instanceof Error ? error.message : 'An error occurred during payment processing');
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
      
      {formError && (
        <div className="text-red-500 text-sm">
          {formError}
        </div>
      )}
      
      <Button 
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
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
          `Pay ${selectedPlan.currency} ${selectedPlan.price}`
        )}
      </Button>
    </form>
  );
}

export default function StreamlinedPaymentFlow({ returnUrl = '/editor' }: { returnUrl?: string }) {
  const router = useRouter();
  const [step, setStep] = useState<'select-plan' | 'payment' | 'confirmation'>('select-plan');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showComingSoon, setShowComingSoon] = useState<boolean>(false);
  const [comingSoonPlan, setComingSoonPlan] = useState<string>('');
  
  // Check if payments are enabled via feature flag
  const paymentsEnabled = isFeatureEnabled('ENABLE_PAYMENTS');
  
  // Check for plan parameter in URL when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const planId = params.get('plan');
      
      if (planId) {
        const matchedPlan = plans.find(p => p.id === planId);
        if (matchedPlan) {
          setSelectedPlan(matchedPlan);
          // If payments are disabled or it's the free plan, go directly to confirmation
          if (!paymentsEnabled || matchedPlan.id === 'free') {
            setStep('confirmation');
          } else {
            setStep('payment');
          }
        }
      }
    }
  }, [paymentsEnabled]);
  
  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    
    // For free plan, skip to confirmation
    if (plan.id === 'free') {
      setStep('confirmation');
    } else if (!paymentsEnabled) {
      // For premium plans when payments are disabled, show a coming soon message
      setSelectedPlan(plan);
      // Show coming soon modal
      setComingSoonPlan(plan.name);
      setShowComingSoon(true);
    } else {
      // Normal payment flow when enabled
      setStep('payment');
    }
    
    // Store the selected plan name for the success page
    if (typeof window !== 'undefined') {
      localStorage.setItem('selected_plan_name', plan.name);
    }
    
    // Track selection in cookies
    updateAppStateCookie({
      lastPaymentAttempt: {
        plan: plan.id,
        timestamp: new Date().toISOString()
      }
    });
  };
  
  const handlePaymentSuccess = () => {
    setStep('confirmation');
    
    // In a real application, you would update the user's subscription in your backend
  };
  
  const handleContinue = () => {
    router.push(returnUrl);
  };
  
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };
  
  return (
    <div className="max-w-3xl mx-auto relative">
      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
            <div className="absolute top-2 right-2">
              <button 
                onClick={() => setShowComingSoon(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-center">
              <div className="mb-4 inline-flex p-3 bg-blue-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Premium Features Coming Soon!
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                <span className="font-semibold">{comingSoonPlan}</span> subscription is not available in the MVP release. We're working hard to bring you premium features in a future update.
              </p>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Sign up for our newsletter to be notified when premium features launch.
              </p>
              
              <div className="flex space-x-3 justify-center">
                <Button
                  onClick={() => setShowComingSoon(false)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Continue with Free Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
              step === 'select-plan' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}>
              1
            </div>
            <div className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Select Plan</div>
          </div>
          <div className="h-0.5 w-16 bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
              step === 'payment' ? 'bg-blue-500 text-white' : step === 'confirmation' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}>
              2
            </div>
            <div className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Payment</div>
          </div>
          <div className="h-0.5 w-16 bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex items-center">
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
              step === 'confirmation' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}>
              3
            </div>
            <div className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Confirmation</div>
          </div>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {step === 'select-plan' && (
          <motion.div
            key="select-plan"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Choose Your Plan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`relative overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg ${
                    plan.recommended ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                        Recommended
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{plan.name}</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      {formatCurrency(plan.price, plan.currency)}
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> / month</span>
                    </p>
                    
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      onClick={() => handlePlanSelect(plan)}
                      className={`w-full ${
                        plan.recommended 
                          ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                          : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600'
                      }`}
                    >
                      Select Plan
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {step === 'payment' && selectedPlan && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment</h2>
              <button 
                onClick={() => setStep('select-plan')}
                className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Change Plan
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{selectedPlan.name} Plan</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Monthly subscription</p>
                </div>
                <p className="font-bold text-gray-900 dark:text-white">
                  {formatCurrency(selectedPlan.price, selectedPlan.currency)}
                </p>
              </div>
              
              <div className="flex justify-between items-center font-medium">
                <p className="text-gray-900 dark:text-white">Total</p>
                <p className="text-gray-900 dark:text-white">{formatCurrency(selectedPlan.price, selectedPlan.currency)}</p>
              </div>
            </div>
            
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                selectedPlan={selectedPlan} 
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          </motion.div>
        )}
        
        {step === 'confirmation' && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center py-8">
              <div className="bg-green-100 dark:bg-green-900 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                <svg className="h-10 w-10 text-green-500 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Payment Successful!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Thank you for your purchase. Your subscription is now active.
              </p>
              
              <Button
                onClick={handleContinue}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Continue to Editor
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
