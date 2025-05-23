'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ToastProvider';
import { WorkflowProvider } from '@/contexts/WorkflowContext';
import CookieConsent from '@/components/CookieConsent';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WorkflowProvider>
        <>
          <ToastProvider />
          {children}
          <CookieConsent />
        </>
      </WorkflowProvider>
    </AuthProvider>
  )
}
