import { NextResponse } from 'next/server';
import { db } from '@/config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { initializeFirebaseAdmin } from '@/config/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export async function POST(request: Request) {
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
    
    // Verify admin status
    const adminDoc = await getFirestore().collection('users').doc(uid).get();
    if (!adminDoc.exists || adminDoc.data()?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Parse request body
    const { userId, subscription } = await request.json();
    
    // Validate input
    if (!userId || !['free', 'premium', 'pro'].includes(subscription)) {
      return NextResponse.json(
        { error: 'Invalid request data' }, 
        { status: 400 }
      );
    }
    
    // Update user subscription
    const userRef = doc(db, 'users', userId);
    
    // Check if user exists
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }
    
    // Update subscription
    await updateDoc(userRef, { 
      subscription, 
      updatedAt: new Date(),
      updatedBy: uid
    });
    
    // Log the action
    await getFirestore().collection('admin_audit_logs').add({
      action: 'update_subscription',
      adminId: uid,
      userId,
      oldValue: userDoc.data().subscription,
      newValue: subscription,
      timestamp: new Date()
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
