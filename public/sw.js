/**
 * AMG Real Estate - Service Worker for PWA
 * يوفر Offline Support و Caching Strategy
 */

const CACHE_VERSION = 'v1.0.0'
const CACHE_NAME = `amg-real-estate-${CACHE_VERSION}`

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.webmanifest',
]

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache First - للأصول الثابتة
  CACHE_FIRST: 'cache-first',
  // Network First - للمحتوى الديناميكي
  NETWORK_FIRST: 'network-first',
  // Stale While Revalidate - للصور
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Service Worker: Caching static assets')
      return cache.addAll(STATIC_ASSETS)
    }).then(() => {
      console.log('✅ Service Worker: Installation complete')
      return self.skipWaiting()
    })
  )
})

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('🗑️ Service Worker: Deleting old cache:', name)
            return caches.delete(name)
          })
      )
    }).then(() => {
      console.log('✅ Service Worker: Activation complete')
      return self.clients.claim()
    })
  )
})

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip Chrome extensions and non-http(s) requests
  if (!url.protocol.startsWith('http')) return

  // Determine strategy based on request type
  if (url.pathname.startsWith('/api/')) {
    // API requests - Network First
    event.respondWith(networkFirst(request))
  } else if (
    url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/i) ||
    url.hostname === 'images.unsplash.com' ||
    url.hostname === 'res.cloudinary.com'
  ) {
    // Images - Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request))
  } else if (
    url.pathname.match(/\.(js|css|woff|woff2|ttf|eot)$/i) ||
    url.pathname.startsWith('/_next/static/')
  ) {
    // Static assets - Cache First
    event.respondWith(cacheFirst(request))
  } else {
    // HTML pages - Network First with offline fallback
    event.respondWith(networkFirstWithOffline(request))
  }
})

/**
 * Cache First Strategy
 * يفحص الـ cache أولاً، إذا لم يجد يجلب من الشبكة
 */
async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) {
    return cached
  }

  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.error('Cache First failed:', error)
    return new Response('Network error', { status: 408 })
  }
}

/**
 * Network First Strategy
 * يحاول الشبكة أولاً، إذا فشل يرجع للـ cache
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cached = await caches.match(request)
    if (cached) {
      return cached
    }
    throw error
  }
}

/**
 * Network First with Offline Fallback
 * للصفحات HTML - يعرض صفحة offline إذا فشلت الشبكة
 */
async function networkFirstWithOffline(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cached = await caches.match(request)
    if (cached) {
      return cached
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/offline')
      if (offlinePage) {
        return offlinePage
      }
    }
    
    return new Response('Offline - No cached version available', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

/**
 * Stale While Revalidate Strategy
 * يرجع الـ cache فوراً ويحدثه في الخلفية
 */
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request)
  
  const fetchPromise = fetch(request).then(async (response) => {
    if (response.ok) {
      // Clone the response BEFORE doing anything else
      const responseToCache = response.clone()
      const cache = await caches.open(CACHE_NAME)
      await cache.put(request, responseToCache)
    }
    return response
  }).catch(() => {
    // Return cached version if fetch fails
    return cached
  })

  return cached || fetchPromise
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        )
      })
    )
  }
})

// Sync event for background sync
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Background sync:', event.tag)
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData())
  }
})

async function syncData() {
  // Implement your background sync logic here
  console.log('📡 Syncing data in background...')
}

console.log('✨ AMG Real Estate Service Worker loaded')
