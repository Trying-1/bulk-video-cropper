/**
 * Security Monitoring Utility
 * 
 * This utility provides a non-intrusive way to monitor and log security events
 * without disturbing the user experience with popups or notifications.
 */

// Define security event types
export enum SecurityEventType {
  AUTH_ATTEMPT = 'auth_attempt',
  AUTH_SUCCESS = 'auth_success',
  AUTH_FAILURE = 'auth_failure',
  PERMISSION_DENIED = 'permission_denied',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  FILE_VALIDATION_FAILURE = 'file_validation_failure',
  FEATURE_ACCESS_DENIED = 'feature_access_denied',
  STORAGE_TAMPERING = 'storage_tampering',
  CSRF_VALIDATION_FAILURE = 'csrf_validation_failure',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
}

// Security event interface
export interface SecurityEvent {
  type: SecurityEventType;
  timestamp: number;
  userId?: string;
  ip?: string;
  userAgent?: string;
  details?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Maximum number of events to keep in local storage
const MAX_LOCAL_EVENTS = 100;

/**
 * Log a security event
 * 
 * This function logs security events silently without interrupting the user
 * In production, this would send events to a backend service
 */
export const logSecurityEvent = async (
  eventType: SecurityEventType,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
  details?: Record<string, any>,
  userId?: string
): Promise<void> => {
  const event: SecurityEvent = {
    type: eventType,
    timestamp: Date.now(),
    userId,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    details,
    severity,
  };
  
  // Log to console in development mode
  if (process.env.NODE_ENV !== 'production') {
    console.log('[SECURITY EVENT]', event);
  }
  
  // In a real app, send to a backend API
  // But for our demo, we'll just store locally in a way that doesn't affect the UI
  if (typeof window !== 'undefined') {
    try {
      // Retrieve existing events
      const existingEventsStr = localStorage.getItem('security_events');
      let events: SecurityEvent[] = [];
      
      if (existingEventsStr) {
        events = JSON.parse(existingEventsStr);
      }
      
      // Add new event
      events.push(event);
      
      // Limit the number of stored events
      if (events.length > MAX_LOCAL_EVENTS) {
        events = events.slice(-MAX_LOCAL_EVENTS);
      }
      
      // Save back to localStorage
      localStorage.setItem('security_events', JSON.stringify(events));
    } catch (error) {
      // Silently fail - don't disrupt user experience
      console.error('Failed to log security event:', error);
    }
  }
  
  // In a production app, this would include sending to a server endpoint
  // if (process.env.NODE_ENV === 'production') {
  //   try {
  //     await fetch('/api/security/log', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(event),
  //     });
  //   } catch (error) {
  //     // Silently fail - don't disrupt user experience
  //   }
  // }
};

/**
 * Get all logged security events
 * For admin/debugging purposes only
 */
export const getSecurityEvents = (): SecurityEvent[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const eventsStr = localStorage.getItem('security_events');
    if (!eventsStr) {
      return [];
    }
    
    return JSON.parse(eventsStr);
  } catch (error) {
    console.error('Failed to retrieve security events:', error);
    return [];
  }
};

/**
 * Clear all security events
 * For admin purposes only
 */
export const clearSecurityEvents = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.removeItem('security_events');
  } catch (error) {
    console.error('Failed to clear security events:', error);
  }
};

/**
 * Track suspicious activities without interrupting the user experience
 * This is designed to be called from various parts of the application
 */
export const trackSuspiciousActivity = (
  activityType: string,
  details?: Record<string, any>
): void => {
  logSecurityEvent(
    SecurityEventType.SUSPICIOUS_ACTIVITY,
    'medium',
    {
      activityType,
      ...details,
    }
  );
};

/**
 * Utility to detect and log multiple failed authentication attempts
 * Works silently without displaying intrusive notifications
 */
export class AuthAttemptTracker {
  private static attempts: Record<string, { count: number, firstAttempt: number }> = {};
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  
  /**
   * Track an authentication attempt
   * Returns true if too many failed attempts
   */
  static trackFailedAttempt(identifier: string): boolean {
    const now = Date.now();
    
    // Initialize or reset if window expired
    if (!this.attempts[identifier] || now - this.attempts[identifier].firstAttempt > this.WINDOW_MS) {
      this.attempts[identifier] = {
        count: 1,
        firstAttempt: now,
      };
      return false;
    }
    
    // Increment attempt count
    this.attempts[identifier].count += 1;
    
    // Check if too many attempts
    if (this.attempts[identifier].count > this.MAX_ATTEMPTS) {
      // Log security event
      logSecurityEvent(
        SecurityEventType.SUSPICIOUS_ACTIVITY,
        'high',
        {
          reason: 'too_many_auth_failures',
          identifier,
          attemptCount: this.attempts[identifier].count,
        }
      );
      
      return true;
    }
    
    return false;
  }
  
  /**
   * Record a successful authentication to reset the counter
   */
  static recordSuccess(identifier: string): void {
    delete this.attempts[identifier];
  }
}
