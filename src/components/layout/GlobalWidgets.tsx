'use client'

import { usePathname } from 'next/navigation'
import NewsletterPopup from '@/components/features/NewsletterPopup'
import LiveChat from '@/components/features/LiveChat'
import AIAssistant from '@/components/features/AIAssistant'

/**
 * هذا المكون يعرض الـ popups والـ widgets فقط في الصفحات العادية
 * ويخفيها في صفحات Admin و Auth
 */
export default function GlobalWidgets() {
  const pathname = usePathname()
  
  // إخفاء في صفحات Admin و Auth
  const isAdminRoute = pathname?.startsWith('/admin')
  const isAuthRoute = pathname?.startsWith('/auth')
  
  if (isAdminRoute || isAuthRoute) {
    return null
  }
  
  return (
    <>
      <NewsletterPopup />
      <LiveChat />
      <AIAssistant />
    </>
  )
}
