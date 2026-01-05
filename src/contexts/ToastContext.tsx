'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(7)
    const newToast: Toast = { id, message, type }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="pointer-events-auto"
            >
              <div className={`
                flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border-2 backdrop-blur-xl min-w-[320px] max-w-md
                ${toast.type === 'success' ? 'bg-gradient-to-r from-emerald-500 to-green-600 border-emerald-400 text-white' : ''}
                ${toast.type === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-600 border-red-400 text-white' : ''}
                ${toast.type === 'info' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-400 text-white' : ''}
              `}>
                {/* Icon */}
                <div className="flex-shrink-0">
                  {toast.type === 'success' && <CheckCircleIcon className="w-7 h-7" />}
                  {toast.type === 'error' && <XCircleIcon className="w-7 h-7" />}
                  {toast.type === 'info' && <InformationCircleIcon className="w-7 h-7" />}
                </div>
                
                {/* Message */}
                <p className="flex-1 font-bold text-sm leading-tight">
                  {toast.message}
                </p>
                
                {/* Close Button */}
                <button
                  onClick={() => hideToast(toast.id)}
                  className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
