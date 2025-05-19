import { db } from './firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';

/**
 * Database indexes configuration for Firestore
 * These indexes help optimize query performance
 */
export const COLLECTIONS = {
  USERS: 'users',
  VIDEOS: 'videos',
  PROCESSING_HISTORY: 'processing_history',
  USER_ACTIVITY: 'user_activity',
  DAILY_STATS: 'daily_stats',
};

export const INDEXES = {
  // Video indexes
  USER_VIDEOS_BY_STATUS: { 
    collection: COLLECTIONS.VIDEOS,
    fields: ['userId', 'status']
  },
  USER_VIDEOS_BY_DATE: { 
    collection: COLLECTIONS.VIDEOS,
    fields: ['userId', 'createdAt']
  },
  USER_VIDEOS_BY_SIZE: { 
    collection: COLLECTIONS.VIDEOS,
    fields: ['userId', 'originalSize']
  },
  
  // Processing history indexes
  HISTORY_BY_USER_DATE: { 
    collection: COLLECTIONS.PROCESSING_HISTORY,
    fields: ['userId', 'timestamp']
  },
  
  // User activity indexes
  ACTIVITY_BY_USER_ACTION: { 
    collection: COLLECTIONS.USER_ACTIVITY,
    fields: ['userId', 'action']
  },
  ACTIVITY_BY_ACTION_DATE: { 
    collection: COLLECTIONS.USER_ACTIVITY,
    fields: ['action', 'timestamp']
  },
  
  // Daily stats indexes
  STATS_BY_DATE: { 
    collection: COLLECTIONS.DAILY_STATS,
    fields: ['date']
  }
};

/**
 * Helper function to populate default values for development/testing
 * This should only be used in non-production environments
 */
export async function setupDevDatabaseIndexes(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    console.warn('Refusing to setup dev database in production environment');
    return;
  }
  
  console.log('Setting up development database indexes...');
  console.log('Note: In production, indexes should be managed via Firebase console or CLI');
}

/**
 * Helper function to clean up database data for development purposes
 * This should only be used in non-production environments
 */
export async function cleanupDevDatabase(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    console.warn('Refusing to cleanup database in production environment');
    return;
  }
  
  const shouldProceed = confirm(
    'WARNING: This will delete all data in the development database. Are you sure you want to proceed?'
  );
  
  if (!shouldProceed) return;
  
  try {
    const batch = writeBatch(db);
    const collections = Object.values(COLLECTIONS);
    
    for (const collectionName of collections) {
      const querySnapshot = await getDocs(collection(db, collectionName));
      querySnapshot.forEach(document => {
        batch.delete(doc(db, collectionName, document.id));
      });
    }
    
    await batch.commit();
    console.log('Database cleanup completed successfully');
  } catch (error) {
    console.error('Error cleaning up database:', error);
  }
}

/**
 * Firestore index creation instructions (manual setup required)
 * These indexes need to be created in the Firebase console or via the Firebase CLI
 * 
 * 1. videos: Composite index on userId (ASC) and createdAt (DESC)
 * 2. videos: Composite index on userId (ASC) and status (ASC)
 * 3. processing_history: Composite index on userId (ASC) and timestamp (DESC)
 * 4. user_activity: Composite index on userId (ASC) and action (ASC)
 * 5. user_activity: Composite index on action (ASC) and timestamp (DESC)
 * 6. daily_stats: Index on date (ASC)
 */
