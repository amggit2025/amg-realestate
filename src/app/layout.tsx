import type { Metadata } from "next";
import type { Viewport } from 'next'
import "./globals.css";
import "./chrome-fixes.css";
import { baseMetadata, generateStructuredData } from '@/lib/metadata'
import { AuthProvider } from '@/lib/AuthContext'
import LayoutWrapper from '@/components/layout/LayoutWrapper'

// Note: metadata moved to individual pages for client component

// ...existing code...
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script src="/chrome-performance-fixed.js" async />
        <title>AMG Real Estate</title>
        <meta name="description" content="AMG Real Estate - أفضل الحلول العقارية في مصر" />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
