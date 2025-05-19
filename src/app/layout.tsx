import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bulk Video Cropper | Fast & Easy Video Editing for Social Media',
  description: 'Crop multiple videos at once with precision. Perfect for Instagram, TikTok, YouTube and all social media platforms. Free online tool, no watermarks.',
  keywords: 'video cropper, bulk video editor, crop videos online, social media video tool, instagram video cropper, tiktok video editor, batch video processing',
  authors: [{ name: 'Bulk Video Cropper Team' }],
  openGraph: {
    title: 'Bulk Video Cropper | Fast & Easy Video Editing for Social Media',
    description: 'Crop multiple videos at once with precision. Perfect for Instagram, TikTok, YouTube and all social media platforms.',
    url: 'https://bulkvidcropper.com',
    siteName: 'Bulk Video Cropper',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bulk Video Cropper - Crop multiple videos at once',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Video Cropper | Fast & Easy Video Editing',
    description: 'Crop multiple videos at once with precision. Perfect for all social media platforms.',
    images: ['/twitter-image.jpg'],
  },
}

import { Providers } from '@/contexts/Providers';
import ClientNavigation from '../components/ClientNavigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import dynamic from 'next/dynamic';

// Dynamically import CookieConsent with no SSR to avoid hydration mismatch
// since it uses localStorage which is only available in the browser
const CookieConsent = dynamic(() => import('@/components/CookieConsent'), {
  ssr: false,
});

// All guide popups removed as per user preference for clean interface without notifications
// - QuickStart removed
// - WorkflowGuide removed
// - OnboardingGuide removed

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ErrorBoundary>
            {/* Hide navigation on admin pages */}
            <ClientNavigation />
            {/* All guide popups removed for cleaner user experience */}
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-0">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
            {/* Cookie consent banner for first-time visitors */}
            <CookieConsent />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  )
}
