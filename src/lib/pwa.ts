/**
 * PWA Utilities
 * أدوات للتعامل مع Progressive Web App features
 */

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Register Service Worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('Service Worker not supported')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })

    console.log('✅ Service Worker registered:', registration.scope)

    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (!newWorker) return

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          console.log('🆕 New Service Worker available')
          // Notify user about update
          if (window.confirm('تحديث جديد متاح! هل تريد التحديث الآن؟')) {
            newWorker.postMessage({ type: 'SKIP_WAITING' })
            window.location.reload()
          }
        }
      })
    })

    return registration
  } catch (error) {
    console.error('❌ Service Worker registration failed:', error)
    return null
  }
}

/**
 * Unregister Service Worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const success = await registration.unregister()
    console.log('Service Worker unregistered:', success)
    return success
  } catch (error) {
    console.error('Failed to unregister Service Worker:', error)
    return false
  }
}

/**
 * Check if app is installed as PWA
 */
export function isPWA(): boolean {
  if (typeof window === 'undefined') return false

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  )
}

/**
 * Check if PWA install is available
 */
export function canInstallPWA(): boolean {
  if (typeof window === 'undefined') return false
  return 'BeforeInstallPromptEvent' in window
}

/**
 * Get install prompt
 */
let deferredPrompt: BeforeInstallPromptEvent | null = null

export function setInstallPrompt(prompt: BeforeInstallPromptEvent | null) {
  deferredPrompt = prompt
}

export function getInstallPrompt(): BeforeInstallPromptEvent | null {
  return deferredPrompt
}

/**
 * Show install prompt
 */
export async function showInstallPrompt(): Promise<'accepted' | 'dismissed' | null> {
  if (!deferredPrompt) {
    console.log('Install prompt not available')
    return null
  }

  try {
    await deferredPrompt.prompt()
    const choiceResult = await deferredPrompt.userChoice
    
    console.log('Install prompt result:', choiceResult.outcome)
    deferredPrompt = null
    
    return choiceResult.outcome
  } catch (error) {
    console.error('Error showing install prompt:', error)
    return null
  }
}

/**
 * Clear all caches
 */
export async function clearAllCaches(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return
  }

  try {
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map((name) => caches.delete(name)))
    console.log('✅ All caches cleared')
  } catch (error) {
    console.error('❌ Failed to clear caches:', error)
  }
}

/**
 * Get cache size
 */
export async function getCacheSize(): Promise<number> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return 0
  }

  try {
    const cacheNames = await caches.keys()
    let totalSize = 0

    for (const name of cacheNames) {
      const cache = await caches.open(name)
      const keys = await cache.keys()
      
      for (const request of keys) {
        const response = await cache.match(request)
        if (response) {
          const blob = await response.blob()
          totalSize += blob.size
        }
      }
    }

    return totalSize
  } catch (error) {
    console.error('Failed to calculate cache size:', error)
    return 0
  }
}

/**
 * Format cache size
 */
export function formatCacheSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Check network status
 */
export function isOnline(): boolean {
  if (typeof window === 'undefined') return true
  return navigator.onLine
}

/**
 * Listen to online/offline events
 */
export function onNetworkChange(
  callback: (online: boolean) => void
): () => void {
  if (typeof window === 'undefined') return () => {}

  const handleOnline = () => callback(true)
  const handleOffline = () => callback(false)

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}

/**
 * Request persistent storage
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof window === 'undefined' || !('storage' in navigator)) {
    return false
  }

  try {
    if (navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persist()
      console.log('Persistent storage:', isPersisted)
      return isPersisted
    }
    return false
  } catch (error) {
    console.error('Failed to request persistent storage:', error)
    return false
  }
}

/**
 * Check if storage is persisted
 */
export async function isStoragePersisted(): Promise<boolean> {
  if (typeof window === 'undefined' || !('storage' in navigator)) {
    return false
  }

  try {
    if (navigator.storage && navigator.storage.persisted) {
      return await navigator.storage.persisted()
    }
    return false
  } catch (error) {
    console.error('Failed to check storage persistence:', error)
    return false
  }
}
