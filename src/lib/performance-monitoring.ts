/**
 * Performance Monitoring Utilities
 * أدوات لقياس وتحسين أداء التطبيق
 */

/**
 * Measure component render time
 */
export function measureRenderTime(componentName: string, callback: () => void) {
  if (typeof window === 'undefined') return callback()
  
  const start = performance.now()
  callback()
  const end = performance.now()
  
  const renderTime = end - start
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎯 ${componentName} rendered in ${renderTime.toFixed(2)}ms`)
  }
  
  return renderTime
}

/**
 * Track page load performance
 */
export function trackPageLoad() {
  if (typeof window === 'undefined') return
  
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (perfData) {
      const metrics = {
        dns: perfData.domainLookupEnd - perfData.domainLookupStart,
        tcp: perfData.connectEnd - perfData.connectStart,
        ttfb: perfData.responseStart - perfData.requestStart,
        download: perfData.responseEnd - perfData.responseStart,
        domInteractive: perfData.domInteractive - perfData.fetchStart,
        domComplete: perfData.domComplete - perfData.fetchStart,
        loadComplete: perfData.loadEventEnd - perfData.fetchStart,
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Page Load Metrics:', metrics)
      }
      
      return metrics
    }
  })
}

/**
 * Measure API call performance
 */
export async function measureApiCall<T>(
  apiName: string,
  apiCall: () => Promise<T>
): Promise<T> {
  const start = performance.now()
  
  try {
    const result = await apiCall()
    const end = performance.now()
    const duration = end - start
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🌐 API ${apiName} completed in ${duration.toFixed(2)}ms`)
    }
    
    return result
  } catch (error) {
    const end = performance.now()
    const duration = end - start
    
    console.error(`❌ API ${apiName} failed after ${duration.toFixed(2)}ms`, error)
    throw error
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Calculate First Contentful Paint (FCP)
 */
export function getFCP(): Promise<number | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null)
      return
    }
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          observer.disconnect()
          resolve(entry.startTime)
          return
        }
      }
    })
    
    observer.observe({ entryTypes: ['paint'] })
    
    // Timeout after 10 seconds
    setTimeout(() => {
      observer.disconnect()
      resolve(null)
    }, 10000)
  })
}

/**
 * Calculate Largest Contentful Paint (LCP)
 */
export function getLCP(): Promise<number | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null)
      return
    }
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      observer.disconnect()
      resolve(lastEntry.startTime)
    })
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] })
    
    // Timeout after 10 seconds
    setTimeout(() => {
      observer.disconnect()
      resolve(null)
    }, 10000)
  })
}

/**
 * Calculate Cumulative Layout Shift (CLS)
 */
export function getCLS(): Promise<number> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(0)
      return
    }
    
    let cls = 0
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          cls += (entry as any).value
        }
      }
    })
    
    observer.observe({ entryTypes: ['layout-shift'] })
    
    // Measure for 5 seconds
    setTimeout(() => {
      observer.disconnect()
      resolve(cls)
    }, 5000)
  })
}

/**
 * Get all Web Vitals
 */
export async function getWebVitals() {
  const [fcp, lcp, cls] = await Promise.all([
    getFCP(),
    getLCP(),
    getCLS(),
  ])
  
  return {
    fcp,
    lcp,
    cls,
  }
}
