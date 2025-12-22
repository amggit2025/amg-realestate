'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  registerServiceWorker,
  isPWA,
  setInstallPrompt,
  getInstallPrompt,
  showInstallPrompt,
  isOnline,
  onNetworkChange,
  BeforeInstallPromptEvent,
} from '@/lib/pwa'

interface PWAContextType {
  isInstalled: boolean
  canInstall: boolean
  isOffline: boolean
  installApp: () => Promise<'accepted' | 'dismissed' | null>
}

const PWAContext = createContext<PWAContextType>({
  isInstalled: false,
  canInstall: false,
  isOffline: false,
  installApp: async () => null,
})

export function usePWA() {
  return useContext(PWAContext)
}

export function PWAProvider({ children }: { children: ReactNode }) {
  const [isInstalled, setIsInstalled] = useState(false)
  const [canInstall, setCanInstall] = useState(false)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // Check if app is installed
    setIsInstalled(isPWA())
    setIsOffline(!isOnline())

    // Register service worker
    registerServiceWorker()

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      setCanInstall(true)
    }

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setCanInstall(false)
      setInstallPrompt(null)
    }

    // Listen for network changes
    const cleanup = onNetworkChange(setIsOffline)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      cleanup()
    }
  }, [])

  const installApp = async () => {
    const result = await showInstallPrompt()
    if (result === 'accepted') {
      setCanInstall(false)
    }
    return result
  }

  return (
    <PWAContext.Provider value={{ isInstalled, canInstall, isOffline, installApp }}>
      {children}
    </PWAContext.Provider>
  )
}
