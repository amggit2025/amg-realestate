'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { pageview } from '@/lib/analytics'

/**
 * Analytics Tracking Component (Internal)
 * يتتبع تغييرات الصفحات تلقائياً
 */
function AnalyticsTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
      pageview(url)
    }
  }, [pathname, searchParams])

  return null
}

/**
 * Analytics Provider Component
 * Wraps analytics tracking with Suspense boundary
 */
export default function AnalyticsProvider() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTracking />
    </Suspense>
  )
}
