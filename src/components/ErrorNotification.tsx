'use client';

import React, { useState, useEffect } from 'react';

interface ErrorNotificationProps {
  message: string | null;
  onDismiss?: () => void;
  duration?: number; // Auto-dismiss after duration (ms), 0 for no auto-dismiss
  type?: 'error' | 'warning' | 'info';
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  message,
  onDismiss,
  duration = 5000, // Default 5 seconds
  type = 'error'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (message) {
      setIsVisible(true);
      
      // Auto-dismiss after duration if specified
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          if (onDismiss) onDismiss();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [message, duration, onDismiss]);
  
  if (!message || !isVisible) return null;
  
  // Determine styles based on notification type
  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-amber-100 border-amber-500 text-amber-800';
      case 'info':
        return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'error':
      default:
        return 'bg-red-100 border-red-500 text-red-800';
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  return (
    <div 
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${getTypeStyles()} shadow-lg max-w-md animate-fade-in`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === 'error' ? 'text-red-500 hover:bg-red-200 focus:ring-red-500' :
                type === 'warning' ? 'text-amber-500 hover:bg-amber-200 focus:ring-amber-500' :
                'text-blue-500 hover:bg-blue-200 focus:ring-blue-500'
              }`}
              onClick={() => {
                setIsVisible(false);
                if (onDismiss) onDismiss();
              }}
              aria-label="Dismiss"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorNotification;
