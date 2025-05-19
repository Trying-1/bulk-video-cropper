import { db } from '@/config/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, orderBy, limit, addDoc, Timestamp, DocumentData, QueryDocumentSnapshot, startAfter, collectionGroup } from 'firebase/firestore';
import { User, SubscriptionData, SubscriptionTier, UserStats } from '@/models/User';
import { VideoData, VideoProcessingStatus, ProcessingResult } from '@/models/Video';
import { ProcessingHistory, UserActivity, DailyUsageStats } from '@/models/Analytics';

/**
 * Optimized DatabaseService for efficient data access patterns and caching
 */
export class DatabaseService {
  private static COLLECTIONS = {
    USERS: 'users',
    VIDEOS: 'videos',
    PROCESSING_HISTORY: 'processing_history',
    USER_ACTIVITY: 'user_activity',
    DAILY_STATS: 'daily_stats',
  };

  private static INDEXES = {
    VIDEOS_BY_USER_STATUS: 'userIdWithStatus',
    VIDEOS_BY_USER_DATE: 'userIdWithCreatedAt',
    VIDEOS_BY_USER_SIZE: 'userIdWithSize',
    ACTIVITY_BY_USER_ACTION: 'userIdWithAction',
    ACTIVITY_BY_ACTION_TIME: 'actionWithTimestamp',
    HISTORY_BY_USER_TIME: 'userIdWithTimestamp',
  };
  
  // Cache system to reduce database reads
  private static cache: Map<string, {
    data: any,
    expiresAt: number
  }> = new Map();
  
  private static getCacheKey(collection: string, id: string): string {
    return `${collection}_${id}`;
  }
  
  private static getCachedItem<T>(collection: string, id: string): T | null {
    const key = this.getCacheKey(collection, id);
    const cached = this.cache.get(key);
    
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data as T;
    }
    
    this.cache.delete(key);
    return null;
  }
  
  private static setCachedItem(collection: string, id: string, data: any, ttlMs: number = 5 * 60 * 1000): void {
    const key = this.getCacheKey(collection, id);
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs
    });
  }
  
  private static invalidateCache(collection: string, id: string): void {
    const key = this.getCacheKey(collection, id);
    this.cache.delete(key);
  }
  
  /**
   * Convert Firestore timestamps to JavaScript Date objects recursively
   */
  private static convertTimestamps(obj: any): any {
    if (!obj) return obj;
    
    if (obj instanceof Timestamp) {
      return obj.toDate();
    }
    
    if (typeof obj === 'object') {
      for (const key in obj) {
        obj[key] = this.convertTimestamps(obj[key]);
      }
    }
    
    return obj;
  }
  
  /**
   * USER OPERATIONS
   */
  
  public static async getUser(uid: string): Promise<User | null> {
    // Try to get from cache first
    const cachedUser = this.getCachedItem<User>(this.COLLECTIONS.USERS, uid);
    if (cachedUser) return cachedUser;
    
    try {
      const userDoc = await getDoc(doc(db, this.COLLECTIONS.USERS, uid));
      
      if (userDoc.exists()) {
        const userData = this.convertTimestamps(userDoc.data()) as User;
        // Cache the user for future requests
        this.setCachedItem(this.COLLECTIONS.USERS, uid, userData);
        return userData;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }
  
  public static async createUser(userData: Partial<User>): Promise<User> {
    if (!userData.uid) throw new Error('User ID is required');
    
    const now = new Date();
    const newUser: User = {
      uid: userData.uid,
      email: userData.email || null,
      username: userData.username || `user_${userData.uid.substring(0, 8)}`,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      createdAt: now,
      updatedAt: now,
      isOnboarded: false,
      subscription: {
        tier: 'free' as SubscriptionTier,
        status: 'active',
        startDate: now,
        nextBillingDate: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()),
      },
      preferences: {
        theme: 'system',
        defaultAspectRatio: '16:9',
        notificationsEnabled: true,
        exportQuality: 'standard',
        saveOriginals: true,
        preferredVideoFormat: 'mp4',
        autoApplyLastSettings: true,
      },
      stats: {
        totalVideosProcessed: 0,
        totalSizeProcessed: 0,
        loginCount: 1,
        lastLoginDate: now,
        completedWorkflowSteps: [],
      },
      quota: {
        used: 0,
        total: 100 * 1024 * 1024, // 100MB for free users
        resetDate: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()),
      },
      ...userData
    };
    
    await setDoc(doc(db, this.COLLECTIONS.USERS, newUser.uid), newUser);
    
    // Cache the new user
    this.setCachedItem(this.COLLECTIONS.USERS, newUser.uid, newUser);
    
    // Log user creation activity
    await this.logUserActivity(newUser.uid, 'login', { isNewUser: true });
    
    return newUser;
  }
  
  public static async updateUser(uid: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, this.COLLECTIONS.USERS, uid);
      
      // Include update timestamp
      const updatedFields = {
        ...updates,
        updatedAt: new Date()
      };
      
      await updateDoc(userRef, updatedFields);
      
      // Invalidate cached user
      this.invalidateCache(this.COLLECTIONS.USERS, uid);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
  
  public static async updateSubscription(
    uid: string, 
    tier: SubscriptionTier,
    stripeData?: {
      customerId: string;
      subscriptionId: string;
    }
  ): Promise<void> {
    try {
      const user = await this.getUser(uid);
      
      if (!user) throw new Error('User not found');
      
      const now = new Date();
      const nextBillingDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      
      // Calculate new quota based on subscription tier
      let quota = 100 * 1024 * 1024; // Default 100MB
      
      if (tier === 'premium') {
        quota = 2 * 1024 * 1024 * 1024; // 2GB
      } else if (tier === 'pro') {
        quota = 10 * 1024 * 1024 * 1024; // 10GB
      }
      
      const subscriptionData: SubscriptionData = {
        tier,
        status: 'active',
        startDate: now,
        nextBillingDate,
        stripeCustomerId: stripeData?.customerId,
        stripeSubscriptionId: stripeData?.subscriptionId,
      };
      
      await this.updateUser(uid, {
        subscription: subscriptionData,
        quota: {
          ...user.quota,
          total: quota,
          resetDate: nextBillingDate,
        }
      });
      
      // Log subscription change
      await this.logUserActivity(uid, 'upgrade', { 
        previousTier: user.subscription.tier,
        newTier: tier,
        hasStripeData: !!stripeData
      });
      
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }
  
  public static async incrementVideoStats(uid: string, videoSize: number): Promise<void> {
    try {
      const user = await this.getUser(uid);
      if (!user) throw new Error('User not found');
      
      // Atomic update for stats and quota
      const userRef = doc(db, this.COLLECTIONS.USERS, uid);
      
      await updateDoc(userRef, {
        'stats.totalVideosProcessed': user.stats.totalVideosProcessed + 1,
        'stats.totalSizeProcessed': user.stats.totalSizeProcessed + videoSize,
        'stats.lastActivityDate': new Date(),
        'quota.used': user.quota.used + videoSize,
        'updatedAt': new Date()
      });
      
      this.invalidateCache(this.COLLECTIONS.USERS, uid);
    } catch (error) {
      console.error('Error incrementing video stats:', error);
      throw error;
    }
  }
  
  /**
   * VIDEO OPERATIONS
   */
  
  public static async saveVideo(videoData: Partial<VideoData>): Promise<string> {
    try {
      if (!videoData.userId) throw new Error('User ID is required');
      
      const now = new Date();
      
      // Create composite index fields for efficient queries
      const indexFields = {
        userIdWithStatus: `${videoData.userId}_${videoData.status || 'pending'}`,
        userIdWithCreatedAt: `${videoData.userId}_${now.getTime()}`,
        userIdWithSize: `${videoData.userId}_${videoData.originalSize || 0}`,
      };
      
      const newVideo: VideoData = {
        id: videoData.id || `vid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        userId: videoData.userId,
        originalFileName: videoData.originalFileName || 'unnamed.mp4',
        originalUrl: videoData.originalUrl || '',
        originalSize: videoData.originalSize || 0,
        createdAt: now,
        updatedAt: now,
        status: videoData.status || 'pending',
        metadata: videoData.metadata || {
          width: 0,
          height: 0,
          duration: 0,
          hasAudio: false,
        },
        isPublic: videoData.isPublic || false,
        indexFields,
        ...videoData
      };
      
      // Save to videos collection
      const videoRef = doc(db, this.COLLECTIONS.VIDEOS, newVideo.id);
      await setDoc(videoRef, newVideo);
      
      // Also add to user's videos subcollection for better data organization
      await setDoc(doc(db, `${this.COLLECTIONS.USERS}/${videoData.userId}/videos`, newVideo.id), newVideo);
      
      return newVideo.id;
    } catch (error) {
      console.error('Error saving video:', error);
      throw error;
    }
  }
  
  public static async getVideo(videoId: string): Promise<VideoData | null> {
    // Try cache first
    const cachedVideo = this.getCachedItem<VideoData>(this.COLLECTIONS.VIDEOS, videoId);
    if (cachedVideo) return cachedVideo;
    
    try {
      const videoDoc = await getDoc(doc(db, this.COLLECTIONS.VIDEOS, videoId));
      
      if (videoDoc.exists()) {
        const videoData = this.convertTimestamps(videoDoc.data()) as VideoData;
        this.setCachedItem(this.COLLECTIONS.VIDEOS, videoId, videoData);
        return videoData;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting video:', error);
      return null;
    }
  }
  
  public static async updateVideoStatus(
    videoId: string, 
    status: VideoProcessingStatus, 
    result?: ProcessingResult
  ): Promise<void> {
    try {
      const videoRef = doc(db, this.COLLECTIONS.VIDEOS, videoId);
      const video = await this.getVideo(videoId);
      
      if (!video) throw new Error('Video not found');
      
      const updates: Partial<VideoData> = {
        status,
        updatedAt: new Date(),
        processingResult: result,
      };
      
      // Update the index field for status-based queries
      if (status) {
        updates.indexFields = {
          ...video.indexFields,
          userIdWithStatus: `${video.userId}_${status}`
        };
      }
      
      await updateDoc(videoRef, updates);
      
      // Also update in user's subcollection
      const userVideoRef = doc(db, `${this.COLLECTIONS.USERS}/${video.userId}/videos`, videoId);
      await updateDoc(userVideoRef, updates);
      
      // Invalidate cached video
      this.invalidateCache(this.COLLECTIONS.VIDEOS, videoId);
      
      // If processing completed successfully, log it and update user stats
      if (status === 'completed' && result?.success) {
        await this.logProcessingHistory(video.userId, videoId, {
          inputSize: video.originalSize,
          outputSize: result.outputSize || 0,
          processingTime: result.processingTime || 0,
          success: true,
          processingOptions: video.processingOptions
        });
        
        // Update user's stats
        if (result.outputSize) {
          await this.incrementVideoStats(video.userId, result.outputSize);
        }
      } else if (status === 'failed') {
        // Log failed processing
        await this.logProcessingHistory(video.userId, videoId, {
          inputSize: video.originalSize,
          outputSize: 0,
          processingTime: result?.processingTime || 0,
          success: false,
          errorMessage: result?.error
        });
      }
    } catch (error) {
      console.error('Error updating video status:', error);
      throw error;
    }
  }
  
  public static async getUserVideos(
    userId: string, 
    options: {
      status?: VideoProcessingStatus,
      limit?: number,
      pageToken?: QueryDocumentSnapshot<DocumentData>,
      orderByField?: 'createdAt' | 'updatedAt' | 'originalSize',
      orderDirection?: 'asc' | 'desc'
    } = {}
  ): Promise<{
    videos: VideoData[],
    nextPageToken?: QueryDocumentSnapshot<DocumentData>
  }> {
    try {
      const { 
        status, 
        limit: queryLimit = 10, 
        pageToken, 
        orderByField = 'createdAt',
        orderDirection = 'desc'
      } = options;
      
      // Build query
      let videosQuery = query(
        collection(db, `${this.COLLECTIONS.USERS}/${userId}/videos`),
        orderBy(orderByField, orderDirection),
        limit(queryLimit)
      );
      
      // Add status filter if specified
      if (status) {
        videosQuery = query(
          videosQuery,
          where('status', '==', status)
        );
      }
      
      // Add pagination if token provided
      if (pageToken) {
        videosQuery = query(videosQuery, startAfter(pageToken));
      }
      
      const querySnapshot = await getDocs(videosQuery);
      const videos: VideoData[] = [];
      
      querySnapshot.forEach((doc) => {
        videos.push(this.convertTimestamps(doc.data()) as VideoData);
      });
      
      // Get the last visible document for pagination
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      
      return {
        videos,
        nextPageToken: lastVisible
      };
    } catch (error) {
      console.error('Error getting user videos:', error);
      return { videos: [] };
    }
  }
  
  /**
   * ANALYTICS OPERATIONS
   */
  
  private static async logProcessingHistory(
    userId: string,
    videoId: string,
    data: {
      inputSize: number;
      outputSize: number;
      processingTime: number;
      success: boolean;
      processingOptions?: any;
      errorMessage?: string;
    }
  ): Promise<void> {
    try {
      const now = new Date();
      const dateOnlyString = now.toISOString().split('T')[0]; // YYYY-MM-DD
      
      const historyData: ProcessingHistory = {
        id: `process_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        userId,
        videoId,
        timestamp: now,
        processingTime: data.processingTime,
        inputSize: data.inputSize,
        outputSize: data.outputSize,
        processingOptions: data.processingOptions,
        success: data.success,
        errorMessage: data.errorMessage,
        indexFields: {
          userIdWithTimestamp: `${userId}_${now.getTime()}`,
          dateOnly: dateOnlyString
        }
      };
      
      // Add to processing history collection
      await addDoc(collection(db, this.COLLECTIONS.PROCESSING_HISTORY), historyData);
      
      // Update daily stats
      await this.updateDailyStats(dateOnlyString, {
        totalProcessed: 1,
        totalStorageUsed: data.outputSize,
        conversionRate: data.success ? 1 : 0
      });
    } catch (error) {
      console.error('Error logging processing history:', error);
    }
  }
  
  public static async logUserActivity(
    userId: string,
    action: UserActivity['action'],
    details?: any
  ): Promise<void> {
    try {
      const now = new Date();
      
      const activityData: UserActivity = {
        id: `activity_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        userId,
        action,
        timestamp: now,
        details,
        indexFields: {
          userIdWithAction: `${userId}_${action}`,
          actionWithTimestamp: `${action}_${now.getTime()}`
        }
      };
      
      // Add to user activity collection
      await addDoc(collection(db, this.COLLECTIONS.USER_ACTIVITY), activityData);
      
      // For login activity, increment login count
      if (action === 'login') {
        const user = await this.getUser(userId);
        if (user) {
          await this.updateUser(userId, {
            stats: {
              ...user.stats,
              loginCount: (user.stats.loginCount || 0) + 1,
              lastLoginDate: now
            }
          });
        }
      }
      
      // Update daily stats
      const dateOnlyString = now.toISOString().split('T')[0];
      if (action === 'login') {
        await this.updateDailyStats(dateOnlyString, { totalUsers: 1 });
      } else if (action === 'upload') {
        await this.updateDailyStats(dateOnlyString, { totalUploads: 1 });
      } else if (action === 'upgrade') {
        await this.updateDailyStats(dateOnlyString, { 
          subscriptionsStarted: 1,
          upgradeRate: 1
        });
      }
    } catch (error) {
      console.error('Error logging user activity:', error);
    }
  }
  
  private static async updateDailyStats(
    dateString: string,
    updates: Partial<DailyUsageStats>
  ): Promise<void> {
    try {
      const statsRef = doc(db, this.COLLECTIONS.DAILY_STATS, dateString);
      
      // Try to get existing stats for the day
      const statsDoc = await getDoc(statsRef);
      
      if (statsDoc.exists()) {
        const currentStats = statsDoc.data() as DailyUsageStats;
        
        const updatedStats: Partial<DailyUsageStats> = {};
        
        // Update each stat by adding the new value
        for (const [key, value] of Object.entries(updates)) {
          if (typeof value === 'number') {
            updatedStats[key as keyof DailyUsageStats] = 
              ((currentStats[key as keyof DailyUsageStats] as number) || 0) + value;
          }
        }
        
        await updateDoc(statsRef, updatedStats);
      } else {
        // Create new stats document for the day
        const newStats: DailyUsageStats = {
          date: dateString,
          totalUploads: 0,
          totalProcessed: 0,
          totalUsers: 0,
          totalNewUsers: 0,
          totalStorageUsed: 0,
          avgProcessingTime: 0,
          conversionRate: 0,
          upgradeRate: 0,
          returningUsers: 0,
          avgSessionDuration: 0,
          revenue: 0,
          subscriptionsStarted: 0,
          subscriptionsCancelled: 0,
          ...updates
        };
        
        await setDoc(statsRef, newStats);
      }
    } catch (error) {
      console.error('Error updating daily stats:', error);
    }
  }
  
  /**
   * QUERY OPTIMIZATIONS
   */
  
  /**
   * Get user stats summary with optimized query patterns
   */
  public static async getUserStatsSummary(uid: string): Promise<UserStats> {
    try {
      const user = await this.getUser(uid);
      
      if (!user) throw new Error('User not found');
      
      return user.stats;
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }
  
  /**
   * Get user's processing history with pagination
   */
  public static async getUserProcessingHistory(
    userId: string,
    options: {
      limit?: number,
      pageToken?: QueryDocumentSnapshot<DocumentData>
    } = {}
  ): Promise<{
    history: ProcessingHistory[],
    nextPageToken?: QueryDocumentSnapshot<DocumentData>
  }> {
    try {
      const { limit: queryLimit = 10, pageToken } = options;
      
      // Query using the composite index
      let historyQuery = query(
        collection(db, this.COLLECTIONS.PROCESSING_HISTORY),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(queryLimit)
      );
      
      if (pageToken) {
        historyQuery = query(historyQuery, startAfter(pageToken));
      }
      
      const querySnapshot = await getDocs(historyQuery);
      const historyItems: ProcessingHistory[] = [];
      
      querySnapshot.forEach((doc) => {
        historyItems.push(this.convertTimestamps(doc.data()) as ProcessingHistory);
      });
      
      // Get the last visible document for pagination
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      
      return {
        history: historyItems,
        nextPageToken: lastVisible
      };
    } catch (error) {
      console.error('Error getting processing history:', error);
      return { history: [] };
    }
  }
  
  /**
   * Get application-wide statistics for admin dashboard
   */
  public static async getAppStats(
    dateRange: {
      startDate: Date,
      endDate: Date
    }
  ): Promise<DailyUsageStats[]> {
    try {
      const startDateStr = dateRange.startDate.toISOString().split('T')[0];
      const endDateStr = dateRange.endDate.toISOString().split('T')[0];
      
      const statsQuery = query(
        collection(db, this.COLLECTIONS.DAILY_STATS),
        where('date', '>=', startDateStr),
        where('date', '<=', endDateStr),
        orderBy('date', 'asc')
      );
      
      const querySnapshot = await getDocs(statsQuery);
      const stats: DailyUsageStats[] = [];
      
      querySnapshot.forEach((doc) => {
        stats.push(doc.data() as DailyUsageStats);
      });
      
      return stats;
    } catch (error) {
      console.error('Error getting app stats:', error);
      return [];
    }
  }
}
