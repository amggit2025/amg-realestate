'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiIcon, SignalSlashIcon } from '@heroicons/react/24/outline'
import { usePWA } from '../PWAProvider'

export default function OnlineStatusIndicator() {
  const { isOffline } = usePWA()
  const [showNotification, setShowNotification] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    if (isOffline && !wasOffline) {
      // Just went offline
      setShowNotification(true)
      setWasOffline(true)
    } else if (!isOffline && wasOffline) {
      // Just went back online
      setShowNotification(true)
      setWasOffline(false)
      
      // Auto hide after 3 seconds when back online
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [isOffline, wasOffline])

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className={`px-6 py-3 rounded-full shadow-lg flex items-center gap-3 ${
              isOffline
                ? 'bg-red-500 text-white'
                : 'bg-green-500 text-white'
            }`}
          >
            {isOffline ? (
              <>
                <SignalSlashIcon className="w-5 h-5" />
                <span className="font-medium">غير متصل بالإنترنت</span>
              </>
            ) : (
              <>
                <WifiIcon className="w-5 h-5" />
                <span className="font-medium">متصل بالإنترنت</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
