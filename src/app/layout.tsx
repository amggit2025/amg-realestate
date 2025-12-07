import type { Metadata } from "next";
import type { Viewport } from 'next'
import { Cairo } from 'next/font/google'
import Script from 'next/script'
import "./globals.css";
import "./chrome-fixes.css";
import { baseMetadata, generateStructuredData } from '@/lib/metadata'
import { AuthProvider } from '@/lib/AuthContext'
import LayoutWrapper from '@/components/layout/LayoutWrapper'

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
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        <title>AMG Real Estate</title>
        <meta name="description" content="AMG Real Estate - أفضل الحلول العقارية في مصر" />
      </head>
      <body suppressHydrationWarning className={cairo.className}>
        <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
        
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
      </body>
    </html>
  );
}
