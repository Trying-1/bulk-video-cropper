'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
  description?: string;
}

export default function ComingSoonModal({
  isOpen,
  onClose,
  featureName = 'Premium',
  description = 'This feature is not available in the MVP release. We\'re working hard to bring you premium features in a future update.'
}: ComingSoonModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            // Close when clicking the backdrop
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
          >
            <div className="absolute top-2 right-2">
              <button 
                onClick={onClose}
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
                {featureName} Coming Soon!
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {description}
              </p>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Sign up for our newsletter to be notified when premium features launch.
              </p>
              
              <div className="flex space-x-3 justify-center">
                <Button
                  onClick={onClose}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Continue with Free Plan
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook to easily use the Coming Soon modal anywhere in the app
 */
export function useComingSoon() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState({
    featureName: 'Premium',
    description: 'This feature is not available in the MVP release. We\'re working hard to bring you premium features in a future update.'
  });

  const showComingSoon = (props?: {
    featureName?: string;
    description?: string;
  }) => {
    if (props) {
      setModalProps({
        featureName: props.featureName || modalProps.featureName,
        description: props.description || modalProps.description
      });
    }
    setIsOpen(true);
  };

  const hideComingSoon = () => setIsOpen(false);

  const ComingSoonModalComponent = () => (
    <ComingSoonModal
      isOpen={isOpen}
      onClose={hideComingSoon}
      featureName={modalProps.featureName}
      description={modalProps.description}
    />
  );

  return {
    showComingSoon,
    hideComingSoon,
    ComingSoonModal: ComingSoonModalComponent
  };
}
