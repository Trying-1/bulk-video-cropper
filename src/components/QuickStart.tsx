'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { updateAppStateCookie, getAppStateCookie } from '@/utils/cookies';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: () => void;
}

export default function QuickStart() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // QuickStart popup disabled per user preference for clean interface without popups
    // This keeps track of user's login but doesn't show the popup
    const currentTime = new Date();
    
    // Update cookie data without showing popup
    updateAppStateCookie({
      quickStartShown: true,
      lastInteraction: currentTime.toISOString(),
      lastLogin: currentTime.toISOString() // Update last login time
    });
    
    // Popup remains hidden (isVisible stays false)
    setIsVisible(false);
  }, []);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const steps: Step[] = [
    {
      title: 'Welcome to Bulk Video Cropper',
      description: 'Quickly crop videos for social media in just a few steps',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      action: () => setCurrentStep(1)
    },
    {
      title: 'Upload Your Videos',
      description: 'Select one or more videos to crop for social media',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      ),
      action: () => setCurrentStep(2)
    },
    {
      title: 'Choose Your Crop',
      description: 'Select from common aspect ratios or customize your own',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 4a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1H5zm1 2h8v8H6V6z" clipRule="evenodd" />
        </svg>
      ),
      action: () => setCurrentStep(3)
    },
    {
      title: 'Process & Download',
      description: 'Process your videos and download the results',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      ),
      action: () => {
        // Direct user to the editor page to start their journey
        navigateTo(user ? '/editor' : '/auth?source=quickstart&returnUrl=/editor');
      }
    }
  ];

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-md w-full"
    >
      <div className="absolute top-3 right-3">
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-4">
          {steps[currentStep].icon}
          <h3 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
            {steps[currentStep].title}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          {steps[currentStep].description}
        </p>
      </div>

      {/* Step indicators */}
      <div className="flex justify-center mb-6">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full mx-1 ${
              index === currentStep ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
          className={`px-4 py-2 rounded-lg font-medium ${
            currentStep > 0
              ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }`}
          disabled={currentStep === 0}
        >
          Back
        </button>
        <button
          onClick={steps[currentStep].action}
          className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
        >
          {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
        </button>
      </div>
    </motion.div>
  );
}
