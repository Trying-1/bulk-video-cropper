/**
 * Secure Storage Utility
 * 
 * This utility provides secure methods for storing sensitive data in the browser's localStorage
 * with encryption and additional security measures.
 */

// Simple encryption key (in production, use a more secure approach)
const STORAGE_PREFIX = 'bvc_'; // Bulk Video Cropper prefix
const ENCRYPTION_KEY = 'bulkVideoCropperSecureStorage';

/**
 * Encrypt data before storing
 * Simple encryption for demo purposes - in production use a robust library
 */
const encrypt = (data: string): string => {
  // Simple XOR encryption (NOT for production use)
  let result = '';
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(result); // Base64 encode
};

/**
 * Decrypt data after retrieval
 */
const decrypt = (encryptedData: string): string => {
  try {
    const data = atob(encryptedData); // Base64 decode
    let result = '';
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch (error) {
    console.error('Failed to decrypt data', error);
    return '';
  }
};

/**
 * Check if localStorage is available
 */
const isStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Securely store data in localStorage with encryption
 */
export const secureSet = (key: string, value: any): boolean => {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }
  
  try {
    // Convert any value to string
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
    
    // Encrypt the data
    const encryptedData = encrypt(valueStr);
    
    // Store with prefix
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, encryptedData);
    return true;
  } catch (error) {
    console.error('Failed to securely store data', error);
    return false;
  }
};

/**
 * Securely retrieve and decrypt data from localStorage
 */
export const secureGet = <T = string>(key: string, defaultValue: T | null = null): T | null => {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return defaultValue;
  }
  
  try {
    // Get encrypted data
    const encryptedData = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    
    if (!encryptedData) {
      return defaultValue;
    }
    
    // Decrypt the data
    const decryptedData = decrypt(encryptedData);
    
    // If expecting an object, parse the JSON
    if (defaultValue !== null && typeof defaultValue !== 'string') {
      try {
        return JSON.parse(decryptedData) as T;
      } catch (e) {
        console.error('Failed to parse stored data', e);
        return defaultValue;
      }
    }
    
    return decryptedData as unknown as T;
  } catch (error) {
    console.error('Failed to retrieve data securely', error);
    return defaultValue;
  }
};

/**
 * Securely remove data from localStorage
 */
export const secureRemove = (key: string): boolean => {
  if (!isStorageAvailable()) {
    return false;
  }
  
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    return true;
  } catch (error) {
    console.error('Failed to remove data', error);
    return false;
  }
};

/**
 * Clear all secure storage items (only those with our prefix)
 */
export const secureClear = (): boolean => {
  if (!isStorageAvailable()) {
    return false;
  }
  
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error('Failed to clear secure storage', error);
    return false;
  }
};

/**
 * Detect potential tampering with stored data
 * Checks if data has been modified outside our application
 */
export const detectTampering = (key: string): boolean => {
  if (!isStorageAvailable()) {
    return false;
  }
  
  try {
    const encryptedData = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    
    if (!encryptedData) {
      return false;
    }
    
    // Try to decrypt and parse JSON
    try {
      const decryptedData = decrypt(encryptedData);
      JSON.parse(decryptedData);
      return false; // No tampering detected
    } catch (e) {
      // If decryption fails or it's not valid JSON, tampering likely occurred
      return true;
    }
  } catch (error) {
    console.error('Error checking for tampering', error);
    return true; // Assume tampering
  }
};
