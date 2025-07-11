import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { APP_IDENTITY, APP_URLS } from '@/config/branding'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(APP_URLS.baseUrl),
  title: `${APP_IDENTITY.name} | Fast & Easy Video Editing for Social Media`,
  description: 'Crop multiple videos at once with precision. Perfect for Instagram, TikTok, YouTube and all social media platforms. Free online tool, no watermarks.',
  keywords: 'video cropper, bulk video editor, crop videos online, social media video tool, instagram video cropper, tiktok video editor, batch video processing',
  authors: [{ name: `${APP_IDENTITY.name} Team` }],
  openGraph: {
    title: `${APP_IDENTITY.name} | Fast & Easy Video Editing for Social Media`,
    description: 'Crop multiple videos at once with precision. Perfect for Instagram, TikTok, YouTube and all social media platforms.',
    url: APP_URLS.baseUrl,
    siteName: APP_IDENTITY.name,
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
    title: `${APP_IDENTITY.name} | Fast & Easy Video Editing`,
    description: 'Crop multiple videos at once with precision. Perfect for all social media platforms.',
    images: ['/twitter-image.jpg'],
  },
}

import { Providers } from '@/contexts/Providers';
import ClientNavigation from '../components/ClientNavigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import ConditionalFooter from '@/components/ConditionalFooter';
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
            {/* Conditional footer - hidden on auth, editor, and profile pages */}
            <ConditionalFooter />
            {/* Cookie consent banner for first-time visitors */}
            <CookieConsent />
          </ErrorBoundary>
        </Providers>
        
        {/* MoneyTag Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/monetag-sw.js')
                    .then(function(registration) {
                      console.log('MoneyTag SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('MoneyTag SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
