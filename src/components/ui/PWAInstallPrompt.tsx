'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, ArrowDownTrayIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'
import { usePWA } from '@/components/PWAProvider'

export default function PWAInstallPrompt() {
  const { canInstall, isInstalled, installApp } = usePWA()
  const [showPrompt, setShowPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if user dismissed before
    const isDismissed = localStorage.getItem('pwa-install-dismissed')
    if (isDismissed) {
      setDismissed(true)
      return
    }

    // Show prompt after 10 seconds if can install
    if (canInstall && !isInstalled) {
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [canInstall, isInstalled])

  const handleInstall = async () => {
    const result = await installApp()
    if (result) {
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDismissed(true)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (!canInstall || isInstalled || dismissed || !showPrompt) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-6 text-white">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="إغلاق"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <DevicePhoneMobileIcon className="w-8 h-8" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <h3 className="text-lg font-bold mb-1">
                حمّل التطبيق الآن
              </h3>
              <p className="text-sm text-white/90 mb-4">
                احصل على تجربة أسرع وأفضل مع إمكانية العمل بدون إنترنت
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleInstall}
                  className="flex-1 bg-white text-blue-600 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  <span>تثبيت</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2.5 text-sm font-medium hover:bg-white/10 rounded-xl transition-colors"
                >
                  لاحقاً
                </button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-semibold">⚡ أسرع</div>
                <div className="text-white/70">تحميل فوري</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">🔌 Offline</div>
                <div className="text-white/70">بدون نت</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">📲 سهل</div>
                <div className="text-white/70">من الشاشة</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
