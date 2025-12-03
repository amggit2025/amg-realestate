'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  style?: React.CSSProperties
  onLoadingComplete?: () => void
  fallbackSrc?: string
}

// Generate a simple blur data URL
const generateBlurDataURL = (w: number = 400, h: number = 300) => {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>`
  ).toString('base64')}`
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  style,
  onLoadingComplete,
  fallbackSrc = '/images/project-placeholder.svg'
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  const handleLoad = () => {
    setIsLoading(false)
    onLoadingComplete?.()
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setHasError(false)
    }
  }

  const imageProps = {
    src: currentSrc,
    alt: alt || 'AMG Real Estate',
    quality,
    priority,
    onLoad: handleLoad,
    onError: handleError,
    className: `transition-opacity duration-300 ${
      isLoading ? 'opacity-0' : 'opacity-100'
    } ${className}`,
    style,
    sizes: sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    placeholder: blurDataURL ? 'blur' as const : placeholder,
    ...(blurDataURL && { blurDataURL }),
    ...(!blurDataURL && placeholder === 'blur' && {
      blurDataURL: generateBlurDataURL(width, height)
    })
  }

  return (
    <div className="relative overflow-hidden">
      {/* Loading Skeleton */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
          style={{ width: width || '100%', height: height || '100%' }}
        />
      )}
      
      {/* Error State */}
      {hasError && (
        <div 
          className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400"
          style={{ width: width || '100%', height: height || '100%' }}
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
          </svg>
        </div>
      )}

      {/* Actual Image */}
      {fill ? (
        <Image
          {...imageProps}
          fill
        />
      ) : (
        <Image
          {...imageProps}
          width={width || 400}
          height={height || 300}
        />
      )}
    </div>
  )
}

// Wrapper component for easier usage
export function ResponsiveImage(props: OptimizedImageProps) {
  return (
    <div className="relative w-full h-full">
      <OptimizedImage {...props} />
    </div>
  )
}

// Gallery Image component
export function GalleryImage({
  src,
  alt,
  className = '',
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      placeholder="blur"
      quality={80}
      className={`rounded-lg hover:scale-105 transition-transform duration-300 ${className}`}
      {...props}
    />
  )
}

// Hero Image component
export function HeroImage({
  src,
  alt,
  className = '',
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      priority
      quality={90}
      placeholder="blur"
      className={`object-cover ${className}`}
      {...props}
    />
  )
}
