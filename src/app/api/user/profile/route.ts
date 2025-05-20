import { NextResponse } from 'next/server';
import { db } from '@/config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { initializeFirebaseAdmin } from '@/config/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { z } from 'zod';

// Define validation schema using Zod
const profileUpdateSchema = z.object({
  displayName: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(), 
  photoURL: z.string().url().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    notifications: z.boolean().optional(),
    newsletter: z.boolean().optional(),
  }).optional(),
  bio: z.string().max(500).optional(),
  company: z.string().max(100).optional(),
  website: z.string().url().optional(),
});

export async function PUT(request: Request) {
  try {
    // Initialize Firebase Admin if not already initialized
    initializeFirebaseAdmin();
    
    // Get session token from cookies
    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify the ID token
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Parse request body
    const data = await request.json();
    
    // Validate input with Zod
    try {
      profileUpdateSchema.parse(data);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid profile data', details: error },
        { status: 400 }
      );
    }
    
    // Update user profile
    const userRef = doc(db, 'users', uid);
    
    // Check if user exists
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }
    
    // Only update allowed fields (prevents privilege escalation)
    const allowedUpdates: any = {};
    
    if (data.displayName) allowedUpdates.displayName = data.displayName;
    if (data.photoURL) allowedUpdates.photoURL = data.photoURL;
    if (data.preferences) allowedUpdates.preferences = data.preferences;
    if (data.bio) allowedUpdates.bio = data.bio;
    if (data.company) allowedUpdates.company = data.company;
    if (data.website) allowedUpdates.website = data.website;
    
    // Email change requires additional verification
    if (data.email && data.email !== userDoc.data()?.email) {
      // In a real app, this would start an email verification process
      // For this example, we'll just note it in the response
      return NextResponse.json(
        { 
          warning: 'Email changes require verification. Please check your inbox to verify your new email.',
          success: true
        }
      );
    }
    
    // Add metadata
    allowedUpdates.updatedAt = new Date();
    
    // Update profile
    await updateDoc(userRef, allowedUpdates);
    
    // Log the action for audit purposes
    await getFirestore().collection('user_activity_logs').add({
      action: 'profile_update',
      userId: uid,
      updatedFields: Object.keys(allowedUpdates),
      timestamp: new Date()
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
