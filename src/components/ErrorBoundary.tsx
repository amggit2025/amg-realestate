'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service (e.g., Sentry)
    console.error('Error Boundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // يمكن إرسال الخطأ لخدمة مثل Sentry هنا
    // sendToErrorReporting(error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
    
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <ExclamationTriangleIcon className="h-16 w-16 text-red-600" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
              عذراً! حدث خطأ غير متوقع
            </h1>

            {/* Description */}
            <p className="text-center text-gray-600 mb-8 text-lg">
              نعتذر عن الإزعاج. حدث خطأ أثناء عرض هذه الصفحة.
            </p>

            {/* Error details (development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  تفاصيل الخطأ (Development):
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-red-600 font-mono bg-red-50 p-3 rounded break-all">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs text-gray-600">
                      <summary className="cursor-pointer hover:text-gray-900 font-medium mb-2">
                        Stack Trace
                      </summary>
                      <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-64 text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
              >
                <ArrowPathIcon className="h-5 w-5" />
                المحاولة مرة أخرى
              </button>
              
              <a
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                <HomeIcon className="h-5 w-5" />
                العودة للرئيسية
              </a>
            </div>

            {/* Support message */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                إذا استمرت المشكلة، يرجى{' '}
                <a href="/contact" className="text-blue-600 hover:underline font-medium">
                  التواصل مع الدعم الفني
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
