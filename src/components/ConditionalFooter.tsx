'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Define paths where the footer should be hidden
  const footerHiddenPaths = [
    '/auth',      // Auth page
    '/editor',    // Editor page
    '/profile',   // Profile page
  ];

  // Check if current path starts with any of the hidden paths
  const shouldHideFooter = footerHiddenPaths.some(path => 
    pathname?.startsWith(path)
  );

  // Only render the Footer if it shouldn't be hidden
  return !shouldHideFooter ? <Footer /> : null;
}
