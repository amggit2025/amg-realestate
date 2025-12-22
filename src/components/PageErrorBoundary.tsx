'use client'

import React from 'react'
import ErrorBoundary from './ErrorBoundary'

interface PageErrorBoundaryProps {
  children: React.ReactNode
  pageName?: string
}

/**
 * Error Boundary مخصص لصفحات معينة
 * يمكن تخصيص رسالة الخطأ حسب الصفحة
 */
export default function PageErrorBoundary({ children, pageName }: PageErrorBoundaryProps) {
  const handleReset = () => {
    // إعادة تحميل الصفحة
    window.location.reload()
  }

  return (
    <ErrorBoundary onReset={handleReset}>
      {children}
    </ErrorBoundary>
  )
}
