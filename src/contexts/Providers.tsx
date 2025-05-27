'use client';

import React from 'react';
import { AuthProvider } from './AuthContext';
import { ToastProvider } from '@/components/ToastProvider';
import { AnalyticsProvider } from './AnalyticsProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Combined providers component for the application
 * Wraps all context providers in a single component for clean usage in layout
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <AnalyticsProvider>
        <ToastProvider />
        {children}
      </AnalyticsProvider>
    </AuthProvider>
  );
}
