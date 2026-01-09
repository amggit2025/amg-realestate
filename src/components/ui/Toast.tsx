'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XMarkIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastNotificationProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastNotification({ toast, onRemove }: ToastNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, toast.duration || 4000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />
      case 'error':
        return <ExclamationCircleIcon className="w-6 h-6 text-red-600" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-6 h-6 text-amber-600" />
      case 'info':
        return <InformationCircleIcon className="w-6 h-6 text-blue-600" />
    }
  }

  const getBorderClass = () => {
    switch (toast.type) {
      case 'success': return 'border-l-green-500'
      case 'error': return 'border-l-red-500'
      case 'warning': return 'border-l-amber-500'
      case 'info': return 'border-l-blue-500'
    }
  }

  const getIconBg = () => {
    switch (toast.type) {
        case 'success': return 'bg-green-100'
        case 'error': return 'bg-red-100'
        case 'warning': return 'bg-amber-100'
        case 'info': return 'bg-blue-100'
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`min-w-[320px] max-w-md w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-4 pointer-events-auto border border-gray-100 border-l-4 flex items-start gap-4 ${getBorderClass()}`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getIconBg()}`}>
        {getIcon()}
      </div>
      
      <div className="flex-1 pt-0.5">
        <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1">{toast.title}</h3>
        {toast.message && (
          <p className="text-xs text-gray-500 leading-relaxed">{toast.message}</p>
        )}
      </div>

      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 left-6 z-[200] flex flex-col gap-3 pointer-events-none items-start max-h-[70vh] overflow-visible pr-4 pb-4">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            toast={toast}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev.slice(-4), { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const success = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message, duration: 3000 })
  }, [addToast])

  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message, duration: 5000 })
  }, [addToast])

  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message, duration: 4000 })
  }, [addToast])

  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message, duration: 3000 })
  }, [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}
