'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
}

interface ErrorFallbackProps {
  error?: Error
  resetErrorBoundary: () => void
}

function DefaultErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[400px] flex items-center justify-center p-8"
    >
      <div className="text-center max-w-lg">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="w-24 h-24 mx-auto mb-6 text-red-500"
        >
          <ExclamationTriangleIcon />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          عذراً، حدث خطأ غير متوقع!
        </h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          واجهنا مشكلة تقنية مؤقتة. نعمل على حلها الآن.
          يرجى المحاولة مرة أخرى أو تحديث الصفحة.
        </p>

        {error && process.env.NODE_ENV === 'development' && (
          <motion.details
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-left bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
          >
            <summary className="cursor-pointer font-medium text-red-800 mb-2">
              تفاصيل الخطأ (للمطورين)
            </summary>
            <pre className="text-xs text-red-700 overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </motion.details>
        )}

        <div className="space-y-3">
          <motion.button
            onClick={resetErrorBoundary}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 mx-auto transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowPathIcon className="w-5 h-5" />
            المحاولة مرة أخرى
          </motion.button>

          <motion.button
            onClick={() => window.location.href = '/'}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold mx-auto block transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            العودة للرئيسية
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-sm text-gray-500"
        >
          إذا استمرت المشكلة، يرجى{' '}
          <a 
            href="/contact" 
            className="text-blue-600 hover:text-blue-700 underline"
          >
            التواصل معنا
          </a>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // يمكن إضافة logging هنا
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // يمكن إضافة error reporting service هنا
    // مثل Sentry أو LogRocket
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent 
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      )
    }

    return this.props.children
  }
}

// Hook for error boundary in functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack: string }) => {
    console.error('Error caught by error handler:', error, errorInfo)
    // يمكن إضافة error reporting هنا
  }
}
