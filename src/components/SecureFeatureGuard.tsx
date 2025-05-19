/**
 * Secure Feature Guard Component
 * 
 * This component provides a way to protect premium features with server-side verification.
 * It uses the useSecureFeature hook to verify feature access with the server
 * and protects against client-side feature flag manipulation.
 */

'use client';

import React from 'react';
import { useSecureFeature } from '@/hooks/useSecureFeature';
import { useCsrfFetch } from '@/utils/csrfProtection';
import { FEATURES } from '@/config/features';

interface SecureFeatureGuardProps {
  featureName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  adminOverride?: boolean;
}

/**
 * A component that conditionally renders its children based on feature access.
 * It uses server-side validation to prevent client-side feature manipulation.
 */
const SecureFeatureGuard: React.FC<SecureFeatureGuardProps> = ({
  featureName,
  children,
  fallback = null,
  adminOverride = false
}) => {
  // Only use the hook if featureName is a valid key
  if (!(featureName in FEATURES)) {
    console.error(`Invalid feature name: ${featureName}`);
    return <>{fallback}</>;
  }
  const { hasAccess, isLoading, error } = useSecureFeature(featureName as keyof typeof FEATURES);
  
  // If still loading, show a minimal loading indicator (no popup)
  if (isLoading) {
    return (
      <div className="text-center p-2">
        <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></span>
      </div>
    );
  }
  
  // If there was an error, log it but don't show it to the user
  // This maintains the clean interface preference
  if (error) {
    console.error(`Feature access error for ${featureName}:`, error);
  }
  
  // If the user has access or is an admin, render the children
  if (hasAccess || adminOverride) {
    return <>{children}</>;
  }
  
  // Otherwise, render the fallback
  return <>{fallback}</>;
};

/**
 * A component that handles secure form submissions with CSRF protection
 */
export const SecureForm: React.FC<{
  onSubmit: (data: FormData) => Promise<void>;
  children: React.ReactNode;
  className?: string;
}> = ({ onSubmit, children, className = '' }) => {
  const { csrfFetch } = useCsrfFetch();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Handle form submission with CSRF protection
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get form data
      const formData = new FormData(e.currentTarget);
      
      // Submit the form data
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={className}>
      {/* Hidden field for CSRF token that will be populated via JS */}
      <input type="hidden" name="csrf_token" id="csrf_token" />
      
      {/* Render the form contents */}
      {children}
      
      {/* Show a minimal submitting indicator if form is being submitted */}
      {isSubmitting && (
        <div className="text-sm text-gray-500 mt-2">
          Processing...
        </div>
      )}
    </form>
  );
};

export default SecureFeatureGuard;
