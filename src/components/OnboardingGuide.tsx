'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { updateAppStateCookie, getAppStateCookie } from '@/utils/cookies';

export default function OnboardingGuide() {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);
  const router = useRouter();
  const { user, subscription } = useAuth();

  useEffect(() => {
    // Check if user has seen the onboarding guide before
    const appState = getAppStateCookie();
    const hasSeenOnboarding = appState?.hasSeenOnboarding;
    
    if (!hasSeenOnboarding) {
      // Show onboarding guide after a delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Update cookie to indicate onboarding has been shown
        updateAppStateCookie({
          hasSeenOnboarding: true,
          onboardingShownAt: new Date().toISOString()
        });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const onboardingSteps = [
    {
      title: 'Welcome to Bulk Video Cropper',
      content: 'Easily crop and prepare videos for social media in just a few clicks.',
      image: '/images/onboarding/welcome.svg', // These would be added to your public/images folder
      cta: 'Next',
      action: () => setStep(1)
    },
    {
      title: 'Upload Your Videos',
      content: 'Select multiple videos to batch process. Our tool handles bulk uploads with ease.',
      image: '/images/onboarding/upload.svg',
      cta: 'Next',
      action: () => setStep(2)
    },
    {
      title: 'Choose Aspect Ratios',
      content: 'Select from popular social media formats or create custom crops for your content.',
      image: '/images/onboarding/crop.svg',
      cta: 'Next',
      action: () => setStep(3)
    },
    {
      title: 'Process and Download',
      content: 'Process your videos with a click and download the results instantly.',
      image: '/images/onboarding/download.svg',
      cta: user ? 'Get Started' : 'Sign Up for Free',
      action: () => {
        if (user) {
          router.push('/editor');
        } else {
          router.push('/auth?source=onboarding&returnUrl=/editor');
        }
        setIsVisible(false);
      }
    }
  ];

  const handleClose = () => {
    setIsVisible(false);
    // Record that the user dismissed the onboarding
    updateAppStateCookie({
      onboardingDismissed: true,
      onboardingDismissedAt: new Date().toISOString()
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm dark:bg-gray-900 dark:bg-opacity-90"></div>
        </div>

        {/* Modal */}
        <motion.div
          className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Onboarding Content */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                {/* Placeholder for image */}
                <div className="w-48 h-48 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {step === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />}
                    {step === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    
                    {step === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />}
                    
                    {step === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />}
                    
                    {step === 3 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />}
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {onboardingSteps[step].title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  {onboardingSteps[step].content}
                </p>

                {/* Navigation dots */}
                <div className="flex justify-center space-x-2 mb-6">
                  {onboardingSteps.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 w-2 rounded-full ${
                        index === step ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      onClick={() => setStep(index)}
                    />
                  ))}
                </div>

                <div className="flex space-x-4 justify-center">
                  {step > 0 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={onboardingSteps[step].action}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    {onboardingSteps[step].cta}
                  </button>
                  {step < onboardingSteps.length - 1 && (
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Skip
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
