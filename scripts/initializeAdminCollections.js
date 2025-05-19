// Initialize Admin Collections Script
// Run this script using: node scripts/initializeAdminCollections.js

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  Timestamp 
} = require('firebase/firestore');

// Your Firebase configuration - hardcoded from .env.local
const firebaseConfig = {
  apiKey: "AIzaSyA5tqFU4eKLlAhQ3OCLM9qM68dRWTvC0t4",
  authDomain: "bulk-video-cropper.firebaseapp.com",
  projectId: "bulk-video-cropper",
  storageBucket: "bulk-video-cropper.firebasestorage.app",
  messagingSenderId: "585356566436",
  appId: "1:585356566436:web:6b00a36a6f35d8f0a96b31",
  measurementId: "G-HL7HBT0Q3S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Admin Settings
const adminSettings = {
  appName: 'Bulk Video Cropper',
  maxVideoSizeInMB: 500,
  maxVideoCount: 10,
  allowedFileTypes: ['mp4', 'mov', 'avi', 'webm'],
  maintenanceMode: false,
  maintenanceMessage: 'The system is currently under maintenance. Please try again later.',
  requireEmailVerification: true,
  loginAttemptLimit: 5,
  supportEmail: 'support@bulkvidcropper.com',
  contactFormEnabled: true,
  socialLinks: {
    twitter: 'https://twitter.com/bulkvidcropper',
    instagram: 'https://instagram.com/bulkvidcropper',
  },
  lastUpdated: Timestamp.now(),
  updatedBy: 'system-init'
};

// Default admin user
const adminUser = {
  email: 'admin@bulkvidcropper.com',
  displayName: 'System Administrator',
  role: 'super_admin',
  permissions: [
    'view_users', 'edit_users', 'delete_users',
    'view_subscriptions', 'edit_subscriptions', 'create_promotions',
    'moderate_content', 'delete_content',
    'view_settings', 'edit_settings',
    'view_analytics', 'export_data'
  ],
  lastLogin: Timestamp.now(),
  active: true,
  createdAt: Timestamp.now(),
  notes: 'Primary system administrator account'
};

// Subscription Plans
const subscriptionPlans = [
  {
    name: 'Free',
    description: 'Basic video cropping for personal use',
    features: [
      'Crop up to 3 videos per day',
      '5 mins max video length',
      'Standard quality export',
      'Basic aspect ratios'
    ],
    priceMonthly: 0,
    priceYearly: 0,
    currency: 'USD',
    isActive: true,
    trialDays: 0,
    maxVideoStorage: 1,
    maxProcessingHours: 1,
    priority: 1,
    hasPromotion: false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    name: 'Pro',
    description: 'Enhanced features for content creators',
    features: [
      'Unlimited video crops',
      '30 mins max video length',
      'HD quality export',
      'All aspect ratios',
      'Batch processing',
      'Priority processing'
    ],
    priceMonthly: 9.99,
    priceYearly: 99.99,
    currency: 'USD',
    isActive: true,
    trialDays: 7,
    maxVideoStorage: 20,
    maxProcessingHours: 10,
    priority: 2,
    hasPromotion: false,
    promotionCode: 'PRO15',
    discountPercentage: 15,
    displayOriginalPrice: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    name: 'Premium',
    description: 'Professional video cropping for businesses',
    features: [
      'Everything in Pro',
      'Unlimited video length',
      '4K quality export',
      'Advanced filters and effects',
      'Cloud storage integration',
      'Team accounts',
      'API access'
    ],
    priceMonthly: 29.99,
    priceYearly: 299.99,
    currency: 'USD',
    isActive: true,
    trialDays: 14,
    maxVideoStorage: 100,
    maxProcessingHours: 50,
    priority: 3,
    hasPromotion: true,
    promotionCode: 'SUMMER20',
    discountPercentage: 20,
    promotionExpiry: Timestamp.fromDate(new Date('2025-08-31T23:59:59.999Z')),
    displayOriginalPrice: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

// Promotion codes
const promotionCodes = [
  {
    code: 'SUMMER20',
    description: 'Summer promotion - 20% off Premium plan',
    discountPercentage: 20,
    currency: 'USD',
    isActive: true,
    applicablePlans: ['premium'],
    startDate: Timestamp.fromDate(new Date('2025-05-01')),
    endDate: Timestamp.fromDate(new Date('2025-08-31')),
    maxUses: 1000,
    currentUses: 0,
    displayOnPricingPage: true,
    promotionalText: 'Limited time offer - 20% off',
    badgeText: '20% OFF',
    badgeColor: '#ff6b6b',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: 'system-init'
  },
  {
    code: 'PRO15',
    description: '15% off Pro plan',
    discountPercentage: 15,
    currency: 'USD',
    isActive: false,
    applicablePlans: ['pro'],
    startDate: Timestamp.fromDate(new Date('2025-05-01')),
    endDate: Timestamp.fromDate(new Date('2025-12-31')),
    maxUses: 500,
    currentUses: 0,
    displayOnPricingPage: false,
    promotionalText: 'Special offer - 15% off Pro plan',
    badgeText: '15% OFF',
    badgeColor: '#4dabf7',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: 'system-init'
  }
];

// Function to initialize all admin collections
async function initializeAdminCollections() {
  try {
    console.log('Starting admin collections initialization...');

    // Create admin settings
    const adminCollection = collection(db, 'admin');
    const settingsDoc = doc(adminCollection, 'settings');
    await setDoc(settingsDoc, adminSettings);
    console.log('✅ Admin settings initialized');

    // Create admin user
    const adminUserRef = doc(db, 'adminUsers', 'admin');
    await setDoc(adminUserRef, adminUser);
    console.log('✅ Admin user initialized');

    // Create subscription plans
    for (const plan of subscriptionPlans) {
      const planRef = doc(db, 'subscriptionPlans', plan.name.toLowerCase());
      await setDoc(planRef, plan);
    }
    console.log('✅ Subscription plans initialized');

    // Create promotion codes
    for (const promo of promotionCodes) {
      const promoRef = doc(db, 'promotionCodes', promo.code.toLowerCase());
      await setDoc(promoRef, promo);
    }
    console.log('✅ Promotion codes initialized');

    console.log('🎉 All admin collections successfully initialized!');
  } catch (error) {
    console.error('Error initializing admin collections:', error);
  }
}

// Run the initialization
initializeAdminCollections();
