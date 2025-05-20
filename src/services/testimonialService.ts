import { db } from '@/config/firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit, Timestamp, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Testimonial type definition
export interface Testimonial {
  id: string;
  name: string;
  role?: string; // Optional role field
  message: string;
  email: string;
  userId?: string; // Optional - linked to authenticated user if available
  approved: boolean; // Testimonials need approval before display
  featured: boolean; // Special testimonials can be featured
  createdAt: Date;
  updatedAt: Date;
}

// Collection name
const TESTIMONIALS_COLLECTION = 'testimonials';

/**
 * Create a new testimonial
 * @param testimonialData Testimonial data without ID and timestamps
 * @returns The created testimonial with ID and timestamps
 */
export const createTestimonial = async (
  name: string,
  role: string | undefined,
  message: string,
  email: string,
  userId?: string
): Promise<Testimonial> => {
  try {
    const testimonialId = uuidv4();
    const now = new Date();
    
    const testimonial: Testimonial = {
      id: testimonialId,
      name,
      role,
      message,
      email,
      userId,
      approved: false, // New testimonials start unapproved
      featured: false,
      createdAt: now,
      updatedAt: now
    };

    // Save to Firestore
    await setDoc(doc(db, TESTIMONIALS_COLLECTION, testimonialId), {
      ...testimonial,
      // Convert undefined role to null for Firestore compatibility
      role: role || null,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now)
    });

    return testimonial;
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
};

/**
 * Get approved testimonials for public display
 * @param featuredOnly Whether to get only featured testimonials
 * @param count Maximum number of testimonials to retrieve
 * @returns Array of approved testimonials
 */
export const getApprovedTestimonials = async (featuredOnly: boolean = false, count: number = 10): Promise<Testimonial[]> => {
  try {
    // Create base query for approved testimonials
    let testimonialQuery = query(
      collection(db, TESTIMONIALS_COLLECTION),
      where('approved', '==', true),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    
    // Add featured filter if requested
    if (featuredOnly) {
      testimonialQuery = query(
        collection(db, TESTIMONIALS_COLLECTION),
        where('approved', '==', true),
        where('featured', '==', true),
        orderBy('createdAt', 'desc'),
        limit(count)
      );
    }

    const testimonialDocs = await getDocs(testimonialQuery);
    return testimonialDocs.docs.map(mapTestimonialDoc);
  } catch (error) {
    console.error('Error getting approved testimonials:', error);
    return [];
  }
};

/**
 * Get testimonials submitted by a specific user
 * @param userId User ID to get testimonials for
 * @returns Array of testimonials submitted by the user
 */
export const getUserTestimonials = async (userId: string): Promise<Testimonial[]> => {
  try {
    const testimonialQuery = query(
      collection(db, TESTIMONIALS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const testimonialDocs = await getDocs(testimonialQuery);
    return testimonialDocs.docs.map(mapTestimonialDoc);
  } catch (error) {
    console.error('Error getting user testimonials:', error);
    return [];
  }
};

// Helper function to map Firestore document to Testimonial type
const mapTestimonialDoc = (doc: QueryDocumentSnapshot<DocumentData>): Testimonial => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    role: data.role,
    message: data.message,
    email: data.email,
    userId: data.userId,
    approved: data.approved,
    featured: data.featured,
    createdAt: (data.createdAt as Timestamp).toDate(),
    updatedAt: (data.updatedAt as Timestamp).toDate()
  };
};
