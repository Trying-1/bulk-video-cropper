'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function ClientNavigation() {
  const pathname = usePathname();
  
  // Hide navigation on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  
  return <Navigation />;
}
