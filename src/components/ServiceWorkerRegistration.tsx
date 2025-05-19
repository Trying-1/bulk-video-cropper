'use client';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

/**
 * Service Worker Registration Component
 * 
 * This component registers the service worker for caching and offline support
 * It's designed to be included in the layout once and work silently in the background
 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Only register service worker in production and if browser supports it
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
            
            // Listen for new service worker installation
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker == null) return;
              
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // New content is available - no need to show toast as per user preference
                    console.log('New content is available, page will update when refreshed');
                  } else {
                    // Content is cached for offline use
                    console.log('Content is cached for offline use');
                  }
                }
              };
            };
          })
          .catch(error => {
            console.error('Error during service worker registration:', error);
          });
      });
      
      // Detect when app goes online/offline
      window.addEventListener('online', () => {
        // App is back online - no need to show toast as per user preference
        console.log('App is back online');
      });
      
      window.addEventListener('offline', () => {
        // Only log to console as per user preference for clean UI without notifications
        console.log('App is offline');
      });
    }
  }, []);

  // This component doesn't render anything
  return null;
}
