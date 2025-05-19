/**
 * Network Recovery Utility
 * 
 * Provides automatic retry mechanisms for network requests and API calls
 * with exponential backoff to improve application resilience.
 */

import { logError } from './errorHandling';

/**
 * Options for retryable functions
 */
interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryableStatusCodes?: number[];
  onRetry?: (error: any, attempt: number) => void;
}

/**
 * Type for any asynchronous function that can be retried
 */
type RetryableFunction<T> = (...args: any[]) => Promise<T>;

/**
 * Creates a retryable version of any async function with improved error handling
 */
export function withRetry<T>(fn: RetryableFunction<T>, options: RetryOptions = {}): RetryableFunction<T> {
  const {
    maxRetries = 3,
    initialDelay = 500, // 500ms
    maxDelay = 10000, // 10 seconds
    backoffFactor = 2,
    retryableStatusCodes = [408, 429, 500, 502, 503, 504],
    onRetry = (error, attempt) => console.log(`Retrying after error (attempt ${attempt}):`, error)
  } = options;

  return async (...args: any[]): Promise<T> => {
    let lastError: any;
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        return await fn(...args);
      } catch (error: any) {
        lastError = error;
        attempt++;
        
        // Break if we've reached max retries
        if (attempt > maxRetries) break;
        
        // Check if error is retryable
        let shouldRetry = false;
        
        // Network errors should be retried
        if (error instanceof TypeError && error.message.includes('network')) {
          shouldRetry = true;
        }
        
        // HTTP errors with specific status codes should be retried
        if (error.status && retryableStatusCodes.includes(error.status)) {
          shouldRetry = true;
        }
        
        // Firebase specific errors that should be retried
        if (error.code && [
          'auth/network-request-failed',
          'auth/timeout',
          'storage/retry-limit-exceeded',
          'firestore/unavailable',
          'firestore/resource-exhausted'
        ].includes(error.code)) {
          shouldRetry = true;
        }
        
        // If not retryable, rethrow
        if (!shouldRetry) throw error;
        
        // Call onRetry callback
        onRetry(error, attempt);
        
        // Calculate delay with exponential backoff and jitter
        const delayWithJitter = Math.min(
          maxDelay,
          initialDelay * Math.pow(backoffFactor, attempt - 1) * (0.8 + Math.random() * 0.4)
        );
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delayWithJitter));
      }
    }

    // If we've exhausted all retries, log the error and rethrow
    logError(lastError, {
      functionName: fn.name || 'anonymous',
      attemptsMade: attempt,
      args: JSON.stringify(args.map(arg => 
        typeof arg === 'object' ? '[Object]' : arg
      ))
    });
    throw lastError;
  };
}

/**
 * Creates a debounced version of any function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, waitMs);
  };
}

/**
 * Creates a throttled version of any function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;
  
  return function(...args: Parameters<T>): void {
    lastArgs = args;
    
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
        
        if (lastArgs && lastArgs !== args) {
          func(...lastArgs);
          lastArgs = null;
        }
      }, limitMs);
    }
  };
}

/**
 * Network connection status monitor
 * Provides methods to check and react to network status changes
 */
export class NetworkMonitor {
  private static instance: NetworkMonitor;
  private isOnline: boolean = navigator.onLine;
  private listeners: Array<(online: boolean) => void> = [];

  private constructor() {
    window.addEventListener('online', this.handleConnectionChange.bind(this));
    window.addEventListener('offline', this.handleConnectionChange.bind(this));
  }

  public static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor();
    }
    return NetworkMonitor.instance;
  }

  private handleConnectionChange() {
    this.isOnline = navigator.onLine;
    this.listeners.forEach(listener => listener(this.isOnline));
  }

  public addListener(listener: (online: boolean) => void): () => void {
    this.listeners.push(listener);
    // Return a function to remove the listener
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }
}
