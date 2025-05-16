'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { processRedirectResult } from '@/services/auth';

const AuthRedirectHandler = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        // Only process if not already processing
        if (isProcessing) return;
        
        setIsProcessing(true);
        console.log('Checking for redirect result...');
        
        // Process the redirect result
        const user = await processRedirectResult();
        
        // If we have a user from redirect, send them to the editor
        if (user) {
          console.log('Successfully signed in after redirect, redirecting to editor...');
          
          // Show a success message
          const message = document.createElement('div');
          message.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50';
          message.innerHTML = `
            <div class="flex items-center">
              <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span>Sign-in successful! Redirecting...</span>
            </div>
          `;
          document.body.appendChild(message);
          
          // Wait a moment before redirecting
          setTimeout(() => {
            window.location.href = '/editor';
          }, 1000);
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    // Run once on component mount
    handleRedirectResult();
  }, [router, isProcessing]);

  // This component doesn't render anything visible
  // It just handles the redirect result
  return null;
};

export default AuthRedirectHandler;
