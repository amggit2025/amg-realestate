'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LoadingScreen from '@/components/ui/LoadingScreen'
import { WhatsAppButton } from '@/components/ui'

interface LayoutWrapperProps {
  children: React.ReactNode
}

function LayoutContent({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  
  // Check if it's an admin route
  const isAdminRoute = pathname?.startsWith('/admin')
  
  // Check if it's an auth route (login, register, etc.)
  const isAuthRoute = pathname?.startsWith('/auth')
  
  if (isAdminRoute || isAuthRoute) {
    // Admin & Auth routes - بدون Header/Footer/LoadingScreen
    return <main>{children}</main>
  }
  
  // Regular website routes - مع Header/Footer
  return (
    <LoadingScreen minDuration={3000} showOnRefresh={true}>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton 
        phoneNumber="201234567890"
        message="مرحباً، أريد الاستفسار عن خدمات AMG العقارية"
      />
    </LoadingScreen>
  )
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <Suspense fallback={<main>{children}</main>}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  )
}
