import Cookies from 'js-cookie';

// Cookie keys
export const COOKIE_EDITOR_SETTINGS = 'bulkvid_editor_settings';
export const COOKIE_USER_SESSION = 'bulkvid_user_session';
export const COOKIE_APP_STATE = 'bulkvid_app_state';

// Types for stored data
export interface EditorSettings {
  aspectRatio: string;
  useCurrentCropForAll: boolean;
  lastUploadDirectory?: string;
}

export interface UserSession {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  lastLogin: number; // timestamp
}

export interface AppState {
  lastVisitedPage?: string;
  hasCompletedOnboarding?: boolean;
  preferredView?: 'grid' | 'list';
  uploadHistory?: string[]; // Array of recently uploaded file names
  cachedUserData?: any; // Cached user profile data
  cachedRecentVideos?: any[]; // Cached recent videos
  cachedUserStats?: any; // Cached user stats
  authStatus?: 'authenticated' | 'unauthenticated'; // User authentication status
  
  // Workflow optimization properties
  hasSeenOnboarding?: boolean; // Whether the user has seen the onboarding guide
  onboardingShownAt?: string; // Timestamp when onboarding was shown
  onboardingDismissed?: boolean; // Whether the user dismissed the onboarding
  onboardingDismissedAt?: string; // Timestamp when onboarding was dismissed
  quickStartShown?: boolean; // Whether the quick start guide was shown
  lastInteraction?: string; // Timestamp of last user interaction
  paymentPageVisited?: string; // Timestamp when payment page was visited
  lastLogin?: string; // Timestamp of the user's last login
  lastPaymentAttempt?: { // Details of the last payment attempt
    plan: string;
    timestamp: string;
  };
  
  // Enhanced workflow tracking
  workflowStage?: string; // Current stage in the user workflow
  completedWorkflowActions?: string[]; // Actions the user has completed
  workflowLastUpdated?: string; // When the workflow was last updated
  videoUploads?: number; // Count of video uploads
  videoProcesses?: number; // Count of videos processed
  
  // Video usage tracking for subscription plans
  videoUsage?: {
    // Current upload session tracking
    currentUploadSession: {
      count: number; // Number of videos in current upload session
      startedAt: string; // Timestamp when session started
    };
    // Monthly usage tracking
    monthlyUsage: {
      count: number; // Total videos processed this month
      lastResetDate: string; // When the monthly counter was last reset
      processingHistory: Array<{
        videoId: string;
        processedAt: string;
        fileSize: number; // in MB
        duration: number; // in seconds
      }>;
    };
    // All-time stats
    totalProcessed: number;
    lastProcessedAt?: string;
  };
  
  featureDiscovery?: { // Features the user has discovered and used
    [feature: string]: {
      discovered: boolean;
      used: boolean;
      firstUsedAt?: string;
    };
  };
}

// Generic cookie functions with enhanced security and error handling
export function setCookie(name: string, value: any, options: any = {}) {
  try {
    // Enhanced security options for cookies
    const secureOptions = {
      expires: 7, // 7 days default expiration
      secure: window.location.protocol === 'https:', // Secure in production
      sameSite: 'strict' as 'strict', // Prevent CSRF
      ...options
    };
    
    // Validate data before storing
    if (value === undefined || value === null) {
      console.warn(`Attempted to set cookie ${name} with null/undefined value`);
      return;
    }
    
    Cookies.set(name, JSON.stringify(value), secureOptions);
  } catch (error) {
    console.error(`Error setting cookie ${name}:`, error);
    // Attempt to set a simpler version if JSON stringification fails
    try {
      const fallbackValue = typeof value === 'object' ? 
        JSON.stringify({ error: 'Original data too complex', timestamp: Date.now() }) : 
        String(value);
      Cookies.set(name, fallbackValue, { expires: 1, ...options });
    } catch (fallbackError) {
      console.error(`Critical failure setting cookie ${name}:`, fallbackError);
    }
  }
}

export const getCookie = (name: string) => {
  try {
    return Cookies.get(name);
  } catch (error) {
    console.error(`Error getting cookie ${name}:`, error);
    return null;
  }
};

export const removeCookie = (name: string) => {
  Cookies.remove(name);
};

// Editor settings related functions
export const setEditorSettingsCookie = (settings: EditorSettings) => {
  setCookie(COOKIE_EDITOR_SETTINGS, JSON.stringify(settings));
};

export const getEditorSettingsCookie = (): EditorSettings | null => {
  const settings = getCookie(COOKIE_EDITOR_SETTINGS);
  return settings ? JSON.parse(settings) : null;
};

// User session related functions
export const setUserSessionCookie = (session: UserSession) => {
  setCookie(COOKIE_USER_SESSION, JSON.stringify(session), { 
    secure: true,
    sameSite: 'strict'
  });
};

export const getUserSessionCookie = (): UserSession | null => {
  try {
    const cookie = getCookie(COOKIE_USER_SESSION);
    if (!cookie) return null;
    
    const sessionData = JSON.parse(cookie);
    
    // Validate required session fields
    if (!sessionData.uid || !sessionData.email) {
      console.warn('Invalid session cookie found - missing required fields');
      return null;
    }
    
    // Check session expiration (7 days)
    const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    if (sessionData.lastLogin && Date.now() - sessionData.lastLogin > SESSION_MAX_AGE) {
      console.log('Session expired, clearing cookie');
      clearUserSessionCookie();
      return null;
    }
    
    return sessionData;
  } catch (error) {
    console.error('Error parsing user session cookie:', error);
    clearUserSessionCookie(); // Clear invalid cookie
    return null;
  }
};

export const clearUserSessionCookie = () => {
  removeCookie(COOKIE_USER_SESSION);
};

// App state related functions
export const setAppStateCookie = (state: AppState) => {
  setCookie(COOKIE_APP_STATE, JSON.stringify(state));
};

export const getAppStateCookie = (): AppState | null => {
  const state = getCookie(COOKIE_APP_STATE);
  return state ? JSON.parse(state) : null;
};

export const updateAppStateCookie = (partialState: any) => {
  const currentState = getAppStateCookie() || {};
  setAppStateCookie({ ...currentState, ...partialState } as AppState);
};

// Default values
export const DEFAULT_EDITOR_SETTINGS: EditorSettings = {
  aspectRatio: '16:9',
  useCurrentCropForAll: false
};

export const DEFAULT_APP_STATE: AppState = {
  hasCompletedOnboarding: false,
  preferredView: 'grid',
  uploadHistory: []
};
