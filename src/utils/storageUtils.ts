/**
 * Utility functions for handling browser storage (localStorage, sessionStorage, cookies)
 * to optimize performance and user experience in the admin dashboard.
 * 
 * This module implements various caching strategies and preference storage mechanisms
 * to reduce server calls and provide a better user experience.
 */

/**
 * Storage keys used throughout the application.
 * 
 * Keys are organized by storage purpose:
 * - Analytics data (persists with TTL)
 * - User preferences (persists indefinitely)
 * - Session-specific data (cleared on session end)
 */
export const STORAGE_KEYS = {
  // Analytics data in localStorage (persists with expiration)
  ADMIN_USER_ANALYTICS: 'bvc_admin_user_analytics',        // User behavior metrics
  ADMIN_BUSINESS_ANALYTICS: 'bvc_admin_business_analytics', // Business/revenue metrics
  ADMIN_CONTENT_ANALYTICS: 'bvc_admin_content_analytics',   // Content usage patterns
  ADMIN_TECHNICAL_ANALYTICS: 'bvc_admin_technical_analytics', // System performance data
  ADMIN_DASHBOARD_METRICS: 'bvc_admin_dashboard_metrics',   // Summary statistics
  
  // User preferences in localStorage (persists indefinitely)
  ADMIN_ACTIVE_TAB: 'bvc_admin_active_tab',                // Selected tab in analytics
  ADMIN_TESTIMONIALS_FILTER: 'bvc_admin_testimonials_filter', // Filter settings for testimonials
  ADMIN_TESTIMONIALS_SORT: 'bvc_admin_testimonials_sort',     // Sort order for testimonials
  ADMIN_TESTIMONIALS_SEARCH: 'bvc_admin_testimonials_search', // Last search query for testimonials
  
  // Dashboard state in localStorage
  ADMIN_DASHBOARD_TIMERANGE: 'bvc_admin_dashboard_timerange', // Selected time period
  
  // Session Storage keys (cleared when browser session ends)
  ADMIN_CURRENT_ANALYTICS_SLICE: 'bvc_admin_current_analytics_slice', // Current view of analytics data
  
  // Cache TTL (expiry time in milliseconds)
  CACHE_TTL: 60 * 60 * 1000, // 1 hour in milliseconds
};

/**
 * Interface for data cached with an expiration timestamp.
 * Used to implement Time-To-Live (TTL) for cached items.
 */
interface CachedData<T> {
  data: T;
  expiry: number;
}

/**
 * Saves data to localStorage with an expiration timestamp.
 * 
 * @param key - The storage key to save data under
 * @param data - The data to be stored
 * @param ttl - Time-to-live in milliseconds (defaults to 1 hour)
 */
export const saveToLocalStorage = <T>(key: string, data: T, ttl = STORAGE_KEYS.CACHE_TTL): void => {
  try {
    const item: CachedData<T> = {
      data,
      expiry: new Date().getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
};

/**
 * Retrieves data from localStorage with expiration check.
 * Returns null if the data doesn't exist or has expired.
 * 
 * @param key - The storage key to retrieve data from
 * @returns The stored data or null if expired/not found
 */
export const getFromLocalStorage = <T>(key: string): T | null => {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    
    const item: CachedData<T> = JSON.parse(itemStr);
    const now = new Date().getTime();
    
    // Check if the item has expired
    if (now > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.data;
  } catch (error) {
    console.error(`Error retrieving from localStorage (${key}):`, error);
    return null;
  }
};

/**
 * Saves data to sessionStorage (persists only for current browser session).
 * 
 * @param key - The storage key to save data under
 * @param data - The data to be stored
 */
export const saveToSessionStorage = <T>(key: string, data: T): void => {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to sessionStorage (${key}):`, error);
  }
};

/**
 * Retrieves data from sessionStorage.
 * 
 * @param key - The storage key to retrieve data from
 * @returns The stored data or null if not found
 */
export const getFromSessionStorage = <T>(key: string): T | null => {
  try {
    const itemStr = sessionStorage.getItem(key);
    if (!itemStr) return null;
    return JSON.parse(itemStr);
  } catch (error) {
    console.error(`Error retrieving from sessionStorage (${key}):`, error);
    return null;
  }
};

/**
 * Sets a browser cookie with specified expiration.
 * Uses SameSite=Strict for improved security.
 * 
 * @param name - The name of the cookie
 * @param value - The cookie value
 * @param days - Number of days until expiration (default: 7)
 */
export const setCookie = (name: string, value: string, days: number = 7): void => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
};

/**
 * Retrieves a browser cookie by name.
 * 
 * @param name - The name of the cookie to retrieve
 * @returns The cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  
  return null;
};

/**
 * Clears all admin-related stored data from localStorage and sessionStorage.
 * Used during logout or when performing a complete data refresh.
 * 
 * Note: Only clears items with keys starting with 'bvc_admin_'
 */
export const clearAdminStoredData = (): void => {
  // Clear localStorage items
  Object.values(STORAGE_KEYS).forEach(key => {
    if (typeof key === 'string' && key.startsWith('bvc_admin_')) {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    }
  });
  
  // Clear cookies if needed
  // You can add specific cookie clearing logic here if required
};
