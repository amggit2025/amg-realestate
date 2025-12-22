/**
 * Performance Optimization Hooks
 * React hooks مخصصة لتحسين الأداء
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { debounce, throttle } from '@/lib/performance-monitoring'

/**
 * Hook للكشف عن ظهور العنصر في viewport
 * مفيد للـ lazy loading
 */
export function useIntersectionObserver(
  options?: IntersectionObserverInit
): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [options])

  return [ref, isVisible]
}

/**
 * Hook للـ debounced value
 * مفيد للـ search inputs
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook للـ throttled callback
 * مفيد للـ scroll handlers
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const throttledCallback = useMemo(
    () => throttle(callback, delay),
    [callback, delay]
  )

  return throttledCallback as T
}

/**
 * Hook للـ window size مع debounce
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = debounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }, 150)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

/**
 * Hook للـ scroll position مع throttle
 */
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = throttle(() => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      })
    }, 100)

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollPosition
}

/**
 * Hook للـ media query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia(query)
    
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

/**
 * Hook للـ lazy loading images
 */
export function useLazyLoad(threshold = 0.1) {
  const [isLoaded, setIsLoaded] = useState(false)
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          setIsLoaded(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [isLoaded, threshold])

  return { ref, isLoaded }
}

/**
 * Hook للـ prefetch data
 */
export function usePrefetch<T>(
  fetcher: () => Promise<T>,
  condition: boolean = true
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!condition) return

    setIsLoading(true)
    fetcher()
      .then((result) => {
        setData(result)
        setError(null)
      })
      .catch((err) => {
        setError(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [condition])

  return { data, isLoading, error }
}

/**
 * Hook للـ idle callback
 * تنفيذ الكود عندما يكون المتصفح في حالة idle
 */
export function useIdleCallback(callback: () => void, deps: any[] = []) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('requestIdleCallback' in window)) {
      // Fallback for browsers that don't support requestIdleCallback
      const timeoutId = setTimeout(callback, 1)
      return () => clearTimeout(timeoutId)
    }

    const idleCallbackId = requestIdleCallback(callback)
    return () => cancelIdleCallback(idleCallbackId)
  }, deps)
}
