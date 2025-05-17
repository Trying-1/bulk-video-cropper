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
}

// Generic cookie functions
export const setCookie = (name: string, value: any, options: any = {}) => {
  Cookies.set(name, value, {
    expires: 7, // 7 days
    ...options,
  });
};

export const getCookie = (name: string) => {
  return Cookies.get(name);
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
  const session = getCookie(COOKIE_USER_SESSION);
  return session ? JSON.parse(session) : null;
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

export const updateAppStateCookie = (partialState: Partial<AppState>) => {
  const currentState = getAppStateCookie() || {};
  setAppStateCookie({ ...currentState, ...partialState });
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
