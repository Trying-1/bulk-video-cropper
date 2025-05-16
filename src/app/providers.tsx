'use client';

import React from 'react';

// Removed authentication context
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
