'use client';

import { db } from '@/config/firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { 
  AdminSettings, defaultAdminSettings,
  SubscriptionPlan, defaultSubscriptionPlans,
  PromotionCode, defaultPromotionCodes,
  AdminUser, defaultAdminUsers, AdminRole, Permission, rolePermissions
} from '@/models/admin';

/**
 * Initialize admin settings if they don't exist
 */
export const initializeAdminSettings = async (userId: string): Promise<void> => {
  const settingsRef = doc(db, 'admin/settings/general');
  const settingsDoc = await getDoc(settingsRef);
  
  if (!settingsDoc.exists()) {
    await setDoc(settingsRef, {
      ...defaultAdminSettings,
      lastUpdated: Timestamp.now(),
      updatedBy: userId
    });
    console.log('Admin settings initialized');
  }
};

/**
 * Initialize subscription plans if they don't exist
 */
export const initializeSubscriptionPlans = async (): Promise<void> => {
  const plansRef = collection(db, 'subscriptionPlans');
  const plansSnapshot = await getDocs(plansRef);
  
  if (plansSnapshot.empty) {
    const planPromises = defaultSubscriptionPlans.map(async (plan) => {
      const planRef = doc(plansRef, plan.name.toLowerCase());
      await setDoc(planRef, {
        ...plan,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        promotionExpiry: plan.promotionExpiry ? Timestamp.fromDate(new Date(plan.promotionExpiry as string)) : null
      });
    });
    
    await Promise.all(planPromises);
    console.log('Subscription plans initialized');
  }
};

/**
 * Initialize promotion codes if they don't exist
 */
export const initializePromotionCodes = async (userId: string): Promise<void> => {
  const promoRef = collection(db, 'promotionCodes');
  const promoSnapshot = await getDocs(promoRef);
  
  if (promoSnapshot.empty) {
    const promoPromises = defaultPromotionCodes.map(async (promo) => {
      const promoDocRef = doc(promoRef, promo.code.toLowerCase());
      await setDoc(promoDocRef, {
        ...promo,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: userId,
        startDate: Timestamp.fromDate(new Date(promo.startDate as string)),
        endDate: Timestamp.fromDate(new Date(promo.endDate as string))
      });
    });
    
    await Promise.all(promoPromises);
    console.log('Promotion codes initialized');
  }
};

/**
 * Initialize admin users if they don't exist
 */
export const initializeAdminUsers = async (userId: string): Promise<void> => {
  const adminUsersRef = collection(db, 'adminUsers');
  const adminSnapshot = await getDocs(adminUsersRef);
  
  if (adminSnapshot.empty) {
    const adminPromises = defaultAdminUsers.map(async (admin) => {
      // Create an admin user with the current user's ID as the super admin
      if (admin.role === AdminRole.SUPER_ADMIN) {
        const adminDocRef = doc(adminUsersRef, userId);
        await setDoc(adminDocRef, {
          ...admin,
          id: userId,
          createdAt: Timestamp.now(),
          lastLogin: Timestamp.now()
        });
      } else {
        // For other admin roles, use their email as the document ID
        const adminDocRef = doc(adminUsersRef, admin.email.replace('@', '-').replace('.', '-'));
        await setDoc(adminDocRef, {
          ...admin,
          id: adminDocRef.id,
          createdAt: Timestamp.now(),
          lastLogin: null,
          createdBy: userId
        });
      }
    });
    
    await Promise.all(adminPromises);
    console.log('Admin users initialized');
  }
};

/**
 * Check if a user is an admin
 */
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const adminDocRef = doc(db, 'adminUsers', userId);
    const adminDoc = await getDoc(adminDocRef);
    return adminDoc.exists();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Initialize all admin collections
 */
export const initializeAdminCollections = async (userId: string): Promise<void> => {
  // First check if the user is already an admin
  const isAdmin = await isUserAdmin(userId);
  
  // If not, make them a super admin (first user to access admin functionality)
  if (!isAdmin) {
    const adminUsersRef = collection(db, 'adminUsers');
    const adminSnapshot = await getDocs(adminUsersRef);
    
    // Only do this if there are no admin users at all (first time setup)
    if (adminSnapshot.empty) {
      const adminDocRef = doc(adminUsersRef, userId);
      await setDoc(adminDocRef, {
        id: userId,
        email: 'admin@bulkvidcropper.com', // This should be replaced with the actual user email
        displayName: 'System Administrator',
        role: AdminRole.SUPER_ADMIN,
        permissions: rolePermissions[AdminRole.SUPER_ADMIN],
        lastLogin: Timestamp.now(),
        active: true,
        createdAt: Timestamp.now(),
        notes: 'Primary system administrator account'
      });
      console.log('Created super admin user');
    }
  }
  
  // Initialize other collections
  await initializeAdminSettings(userId);
  await initializeSubscriptionPlans();
  await initializePromotionCodes(userId);
};

/**
 * Get user permissions
 */
export const getUserPermissions = async (userId: string): Promise<Permission[]> => {
  if (!userId) return [];
  
  try {
    const adminDocRef = doc(db, 'adminUsers', userId);
    const adminDoc = await getDoc(adminDocRef);
    
    if (adminDoc.exists()) {
      return adminDoc.data().permissions as Permission[];
    }
    
    return [];
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return [];
  }
};
