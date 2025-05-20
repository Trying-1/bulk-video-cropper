/**
 * Utility for monitoring internet connection status
 */

// Event callbacks
type ConnectionCallback = () => void;
const onlineCallbacks: ConnectionCallback[] = [];
const offlineCallbacks: ConnectionCallback[] = [];

/**
 * Initialize connection monitoring and set up event listeners
 */
export function initConnectionMonitoring(): void {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Set up event listeners for online/offline events
    window.addEventListener('online', () => {
      console.log('Connection restored');
      onlineCallbacks.forEach(callback => callback());
    });
    
    window.addEventListener('offline', () => {
      console.log('Connection lost');
      offlineCallbacks.forEach(callback => callback());
    });
  }
}

/**
 * Register a callback to be called when the connection goes online
 * @param callback Function to call when connection is restored
 */
export function onConnectionRestored(callback: ConnectionCallback): void {
  onlineCallbacks.push(callback);
}

/**
 * Register a callback to be called when the connection is lost
 * @param callback Function to call when connection is lost
 */
export function onConnectionLost(callback: ConnectionCallback): void {
  offlineCallbacks.push(callback);
}

/**
 * Remove a callback from the online callback list
 * @param callback Callback to remove
 */
export function removeOnlineCallback(callback: ConnectionCallback): void {
  const index = onlineCallbacks.indexOf(callback);
  if (index > -1) {
    onlineCallbacks.splice(index, 1);
  }
}

/**
 * Remove a callback from the offline callback list
 * @param callback Callback to remove
 */
export function removeOfflineCallback(callback: ConnectionCallback): void {
  const index = offlineCallbacks.indexOf(callback);
  if (index > -1) {
    offlineCallbacks.splice(index, 1);
  }
}

/**
 * Check if the user is currently online
 * @returns Boolean indicating if the user is online
 */
export function isOnline(): boolean {
  if (typeof navigator !== 'undefined') {
    return navigator.onLine;
  }
  return true; // Default to true in non-browser environments
}
