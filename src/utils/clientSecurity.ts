/**
 * Client-side security utilities for input sanitization and protection
 * These utilities help prevent XSS and other injection attacks
 */

import React from 'react';

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input The user input to sanitize
 * @returns Sanitized string safe for rendering
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Replace potentially dangerous characters with their HTML entities
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validates if a string contains potential XSS payloads
 * @param input The input to check
 * @returns True if the input appears safe, false if potential XSS detected
 */
export const isInputSafe = (input: string): boolean => {
  if (!input || typeof input !== 'string') {
    return true;
  }
  
  // Check for common XSS patterns
  const xssPatterns = [
    /<script\b[^>]*>/i,
    /<\/script>/i,
    /javascript:/i,
    /on\w+=/i,
    /data:/i
  ];
  
  return !xssPatterns.some(pattern => pattern.test(input));
};

/**
 * Creates a safe URL by validating and sanitizing
 * Helps prevent JavaScript injection in URLs
 * @param url The URL to sanitize
 * @returns Safe URL or empty string if dangerous
 */
export const sanitizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  // Trim whitespace
  url = url.trim();
  
  // Check for JavaScript protocol (common attack vector)
  if (url.toLowerCase().startsWith('javascript:')) {
    return '';
  }
  
  // Only allow http, https, mailto, tel protocols
  const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
  const urlProtocol = url.split(':')[0].toLowerCase() + ':';
  
  if (url.includes(':') && !allowedProtocols.includes(urlProtocol)) {
    return '';
  }
  
  // If no protocol, assume it's a relative URL which is safe
  if (!url.includes(':')) {
    return url;
  }
  
  try {
    // Create a URL object to validate it
    // This will throw an error for invalid URLs
    new URL(url);
    return url;
  } catch (e) {
    return '';
  }
};

/**
 * Applies security best practices for text rendered to the DOM
 * @param Component The React component using this HOC
 * @returns Enhanced component with security practices
 */
export const withInputSanitization = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WithSanitization: React.FC<P> = (props: P) => {
    // Sanitize all string props
    const sanitizedProps = Object.entries(props).reduce((acc, [key, value]) => {
      if (typeof value === 'string') {
        acc[key] = sanitizeInput(value);
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    return React.createElement(Component, sanitizedProps as P);
  };
  
  WithSanitization.displayName = `WithSanitization(${Component.displayName || Component.name || 'Component'})`;
  
  return WithSanitization;
};

/**
 * Safe HTML rendering for trusted content
 * Only use this for content you control, never for user-generated content
 * @param html The HTML content to render
 * @returns Object with __html property containing the HTML
 */
export const createSafeHtml = (html: string) => {
  if (!html || typeof html !== 'string') {
    return { __html: '' };
  }
  
  // For trusted content only - do not use with user inputs
  return { __html: html };
};

/**
 * Validates form input against common security risks
 * @param input The form input to validate
 * @param type The type of input being validated
 * @returns Validation result with status and message
 */
export const validateSecureInput = (
  input: string, 
  type: 'text' | 'email' | 'username' | 'password' | 'url'
): { valid: boolean; message?: string } => {
  if (!input || typeof input !== 'string') {
    return { valid: false, message: 'Input cannot be empty' };
  }
  
  // Check for XSS attempts first
  if (!isInputSafe(input)) {
    return { valid: false, message: 'Input contains invalid characters' };
  }
  
  // Type-specific validations
  switch (type) {
    case 'email':
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return { 
        valid: emailRegex.test(input),
        message: emailRegex.test(input) ? undefined : 'Please enter a valid email address'
      };
      
    case 'url':
      try {
        new URL(input);
        return { valid: true };
      } catch (e) {
        return { valid: false, message: 'Please enter a valid URL' };
      }
      
    case 'username':
      // Alphanumeric, underscore, dash only; 3-20 characters
      const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
      return {
        valid: usernameRegex.test(input),
        message: usernameRegex.test(input) ? undefined : 'Username must be 3-20 characters (letters, numbers, _ or -)'
      };
      
    case 'password':
      // At least 8 characters, with combination of letters, numbers, and symbols
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      return {
        valid: passwordRegex.test(input),
        message: passwordRegex.test(input) ? undefined : 'Password must be at least 8 characters with letters, numbers, and symbols'
      };
      
    case 'text':
    default:
      // For general text, just check for reasonable length
      const tooLong = input.length > 1000;
      return {
        valid: !tooLong,
        message: tooLong ? 'Text is too long (maximum 1000 characters)' : undefined
      };
  }
};
