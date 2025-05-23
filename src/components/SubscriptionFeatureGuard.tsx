/**
 * Subscription Feature Guard Component
 * 
 * This component conditionally renders its children based on subscription feature access,
 * without using intrusive popups or guides. It maintains a clean interface while
 * securely enforcing subscription limits.
 */

'use client';

import React from 'react';
import { useFeatureAccess } from '@/hooks/useSecureSubscription';

interface SubscriptionFeatureGuardProps {
  /** The feature to check access for */
  feature: string;
  /** The content to show when the user has access */
  children: React.ReactNode;
  /** Optional content to show when the user doesn't have access */
  fallback?: React.ReactNode;
  /** Optional admin override */
  adminOverride?: boolean;
  /** Optional user ID - will be extracted from auth context in a real implementation */
  userId?: string;
}

/**
 * Component that conditionally enables features based on availability
 * Maintains a clean interface without popups or guides
 */
const SubscriptionFeatureGuard: React.FC<SubscriptionFeatureGuardProps> = ({
  feature,
  children,
  fallback = null,
  adminOverride = false,
  userId
}) => {
  // Check if the user has access to this feature
  const { accessResults, isLoading } = useFeatureAccess([feature], userId);
  
  // If loading, show a minimal loading indicator (no popup)
  if (isLoading) {
    return (
      <div className="inline-flex items-center space-x-2">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // If the user has access or admin override, render the children
  if (accessResults[feature] || adminOverride) {
    return <>{children}</>;
  }
  
  // Otherwise, render the fallback content (or nothing)
  return <>{fallback}</>;
};

/**
 * Feature availability button that shows when a feature is coming soon
 * Provides a non-intrusive way to guide users
 */
export const ComingSoonFeatureButton: React.FC<{
  feature: string;
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
  label: string;
  userId?: string;
}> = ({ feature, onClick, className = "", icon, label, userId }) => {
  return (
    <SubscriptionFeatureGuard
      feature={feature}
      userId={userId}
      fallback={
        <button 
          className={`opacity-50 cursor-not-allowed flex items-center gap-2 ${className}`}
          disabled
          title="Coming soon"
        >
          {icon}
          <span className="relative">
            {label}
            <span className="absolute -top-1 -right-4 text-xs text-yellow-500">✦</span>
          </span>
        </button>
      }
    >
      <button
        onClick={onClick}
        className={`flex items-center gap-2 ${className}`}
      >
        {icon}
        <span>{label}</span>
      </button>
    </SubscriptionFeatureGuard>
  );
};

/**
 * Subscription limits display component
 * Shows current limitations without popups
 */
export const SubscriptionLimitsInfo: React.FC<{
  currentVideoCount: number;
  userId?: string;
  className?: string;
}> = ({ currentVideoCount, userId, className = "" }) => {
  // Directly use hook without wrapping in another component
  const { accessResults } = useFeatureAccess([
    'extendedVideoLimit',
    'extendedDurationLimit',
    'noWatermark'
  ], userId);
  
  const hasExtendedLimit = accessResults['extendedVideoLimit'];
  const hasExtendedDuration = accessResults['extendedDurationLimit'];
  const hasNoWatermark = accessResults['noWatermark'];
  
  return (
    <div className={`text-sm text-gray-600 ${className}`}>
      <div className="flex items-center gap-1">
        <span className="font-medium">Videos:</span> 
        <span>{currentVideoCount} / {hasExtendedLimit ? '∞' : '5'}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium">Max Duration:</span>
        <span>{hasExtendedDuration ? '5 min' : '1 min'}</span>
      </div>
      <div className="text-xs text-gray-400 mt-1">
        Videos may include a small watermark
      </div>
    </div>
  );
};

export default SubscriptionFeatureGuard;
