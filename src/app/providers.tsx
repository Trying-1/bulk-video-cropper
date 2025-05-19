'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ToastProvider';
import { WorkflowProvider } from '@/contexts/WorkflowContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WorkflowProvider>
        <>
          <ToastProvider />
          {children}
        </>
      </WorkflowProvider>
    </AuthProvider>
  )
}
