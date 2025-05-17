import { db } from '@/config/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { User } from '@/types/user';

// Default user data
const getDefaultUserData = (uid: string, email: string | null, username: string): User => ({
  uid,
  email,
  username,
  createdAt: new Date(),
  subscription: 'free',
  usedQuota: 0,
  nextRenewal: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(), // 1 month from now
});

// Create a new user in Firestore
export const createUser = async (uid: string, email: string | null, username: string): Promise<User> => {
  try {
    const userData = getDefaultUserData(uid, email, username);
    await setDoc(doc(db, 'users', uid), userData);
    return userData;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};



// Get user data from Firestore
export const getUserData = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      
      // Convert Firestore timestamp to Date if necessary
      if (userData.createdAt && typeof userData.createdAt !== 'object') {
        userData.createdAt = new Date(userData.createdAt);
      }
      
      return userData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Update user's used quota
export const updateUsedQuota = async (uid: string, newUsedQuota: number): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      usedQuota: newUsedQuota
    });
  } catch (error) {
    console.error('Error updating used quota:', error);
    throw error;
  }
};

// Increment user's used quota
export const incrementUsedQuota = async (uid: string, increment: number = 1): Promise<void> => {
  try {
    const userData = await getUserData(uid);
    if (userData) {
      const newUsedQuota = userData.usedQuota + increment;
      await updateUsedQuota(uid, newUsedQuota);
    }
  } catch (error) {
    console.error('Error incrementing used quota:', error);
    throw error;
  }
};

// Update user's subscription
export const updateSubscription = async (
  uid: string, 
  subscription: 'free' | 'premium' | 'pro'
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      subscription,
      nextRenewal: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(), // 1 month from now
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

// Define video data type
interface VideoData {
  id: string;
  title?: string;
  thumbnailUrl?: string;
  createdAt: string | Date;
  fileSize?: number;
  duration?: number;
  status?: 'processing' | 'completed' | 'failed';
  userId: string;
  [key: string]: any; // For other properties that might exist
}

// Get user's recent videos
export const getUserRecentVideos = async (uid: string, limit: number = 5): Promise<VideoData[]> => {
  try {
    const videosQuery = query(
      collection(db, 'videos'),
      where('userId', '==', uid)
    );
    
    const videosSnapshot = await getDocs(videosQuery);
    const videos = videosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as VideoData[];
    
    // Sort by createdAt in descending order and limit
    return videos
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt || 0);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting user videos:', error);
    return [];
  }
};

// Get user's video processing stats
export const getUserStats = async (uid: string): Promise<{
  totalVideosProcessed: number;
  totalSizeProcessed: number; // in bytes
}> => {
  try {
    const videosQuery = query(
      collection(db, 'videos'),
      where('userId', '==', uid)
    );
    
    const videosSnapshot = await getDocs(videosQuery);
    const videos = videosSnapshot.docs.map(doc => doc.data());
    
    const totalVideosProcessed = videos.length;
    const totalSizeProcessed = videos.reduce((total, video) => total + (video.fileSize || 0), 0);
    
    return {
      totalVideosProcessed,
      totalSizeProcessed
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      totalVideosProcessed: 0,
      totalSizeProcessed: 0
    };
  }
};
