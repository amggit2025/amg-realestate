/**
 * Image Loading Strategy
 * استراتيجية محسّنة لتحميل الصور بناءً على الأولوية
 */

export type ImagePriority = 'high' | 'medium' | 'low'

export interface OptimizedImageProps {
  src: string
  alt: string
  priority?: ImagePriority
  className?: string
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
}

/**
 * تحديد جودة الصورة بناءً على الأولوية
 */
export function getImageQuality(priority: ImagePriority): number {
  switch (priority) {
    case 'high':
      return 95 // Hero images, main banners
    case 'medium':
      return 75 // Feature images, cards
    case 'low':
      return 70 // Thumbnails, avatars
    default:
      return 75
  }
}

/**
 * تحديد sizes attribute بناءً على نوع الصورة
 */
export function getImageSizes(type: 'hero' | 'card' | 'thumbnail' | 'full'): string {
  switch (type) {
    case 'hero':
      return '100vw'
    case 'card':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    case 'thumbnail':
      return '(max-width: 768px) 50vw, 25vw'
    case 'full':
      return '100vw'
    default:
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  }
}

/**
 * تحديد هل يجب تحميل الصورة مباشرة (priority)
 */
export function shouldPrioritize(priority: ImagePriority, position: number): boolean {
  if (priority === 'high') return true
  if (priority === 'medium' && position <= 3) return true
  return false
}

/**
 * Lazy loading configuration
 */
export const lazyLoadConfig = {
  rootMargin: '50px', // Start loading 50px before entering viewport
  threshold: 0.01, // Trigger when 1% visible
}

/**
 * Image formats priority
 */
export const imageFormats = ['avif', 'webp', 'jpg'] as const

/**
 * Device sizes for responsive images
 */
export const deviceSizes = [640, 750, 828, 1080, 1200, 1920]

/**
 * Image sizes for different breakpoints
 */
export const imageSizes = [16, 32, 48, 64, 96, 128, 256, 384]
