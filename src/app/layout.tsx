import type { Metadata } from "next";
import type { Viewport } from 'next'
import { Cairo } from 'next/font/google'
import Script from 'next/script'
import "./globals.css";
import "./chrome-fixes.css";
import { baseMetadata, generateStructuredData } from '@/lib/metadata'
import { AuthProvider } from '@/lib/AuthContext'
import LayoutWrapper from '@/components/layout/LayoutWrapper'
import ErrorBoundary from '@/components/ErrorBoundary'
import AnalyticsProvider from '@/components/AnalyticsProvider'
import { PWAProvider } from '@/components/PWAProvider'
import PWAInstallPrompt from '@/components/ui/PWAInstallPrompt'
import OnlineStatusIndicator from '@/components/ui/OnlineStatusIndicator'
import NewsletterPopup from '@/components/features/NewsletterPopup'
import LiveChat from '@/components/features/LiveChat'

// Optimize Cairo font loading
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700'], // Only weights we actually use
  display: 'swap',
  preload: true,
  variable: '--font-cairo',
  adjustFontFallback: true,
})

// Note: metadata moved to individual pages for client component

// ...existing code...
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth" suppressHydrationWarning className={cairo.variable}>
      <head>
        {/* Preconnect to external resources - Critical for performance */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        
        {/* PWA & Favicon */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/images/logo/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/logo/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/logo/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/logo/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/logo/favicon-16x16.png" />
        
        {/* SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
        
        <title>AMG Real Estate</title>
        <meta name="description" content="AMG Real Estate - أفضل الحلول العقارية في مصر" />
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                  send_page_view: false
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body suppressHydrationWarning className={cairo.className}>
        <ErrorBoundary>
          <PWAProvider>
            <AuthProvider>
              <AnalyticsProvider />
              <OnlineStatusIndicator />
              <PWAInstallPrompt />
              <NewsletterPopup />
              <LiveChat />
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </AuthProvider>
          </PWAProvider>
        
        {/* Optimized Chrome performance script */}
        <Script
          id="chrome-performance"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined') {
                  window.addEventListener('load', function() {
                    if ('requestIdleCallback' in window) {
                      requestIdleCallback(function() {
                        document.body.classList.add('loaded');
                      });
                    }
                  });
                }
              })();
            `
          }}
        />
        </ErrorBoundary>
      </body>
    </html>
  );
}
