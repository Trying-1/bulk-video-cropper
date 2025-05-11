'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive media queries
 * @param query CSS media query string
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Default to false on the server or during initial client render
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Create a media query list
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);
    
    // Define listener function
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add listener for changes
    media.addEventListener('change', listener);
    
    // Clean up
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]); // Re-run if query changes
  
  return matches;
}
