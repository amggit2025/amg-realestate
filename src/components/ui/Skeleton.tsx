'use client'

import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  variant?: 'rectangular' | 'circular' | 'text'
  width?: string | number
  height?: string | number
  lines?: number
}

export function Skeleton({ 
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1
}: SkeletonProps) {
  const baseClasses = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full'
      case 'text':
        return 'rounded'
      case 'rectangular':
      default:
        return 'rounded-lg'
    }
  }

  const getSize = () => {
    const style: any = {}
    if (width) style.width = typeof width === 'number' ? `${width}px` : width
    if (height) style.height = typeof height === 'number' ? `${height}px` : height
    return style
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }, (_, index) => (
          <motion.div
            key={index}
            className={`${baseClasses} ${getVariantClasses()} h-4`}
            style={{ 
              width: index === lines - 1 ? '75%' : '100%',
              ...getSize()
            }}
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.1,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={getSize()}
      animate={{
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
      }}
    />
  )
}

// Pre-built skeleton components
export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
      <Skeleton variant="rectangular" height={200} className="mb-4" />
      <Skeleton variant="text" height={24} className="mb-2" />
      <Skeleton variant="text" lines={2} className="mb-4" />
      <div className="flex justify-between items-center">
        <Skeleton variant="text" width={100} height={20} />
        <Skeleton variant="rectangular" width={80} height={32} />
      </div>
    </div>
  )
}

export function ServiceCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton variant="text" width={150} height={24} />
      </div>
      <Skeleton variant="text" lines={3} className="mb-4" />
      <Skeleton variant="rectangular" width="100%" height={40} />
    </div>
  )
}

export function TestimonialSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" width={60} height={60} />
        <div className="flex-1">
          <Skeleton variant="text" width={120} height={20} className="mb-2" />
          <Skeleton variant="text" width={80} height={16} />
        </div>
      </div>
      <Skeleton variant="text" lines={3} />
    </div>
  )
}

export function PortfolioGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }, (_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function BlogPostSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <Skeleton variant="rectangular" height={200} />
      <div className="p-6">
        <Skeleton variant="text" height={28} className="mb-3" />
        <Skeleton variant="text" lines={3} className="mb-4" />
        <div className="flex items-center gap-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1">
            <Skeleton variant="text" width={100} height={16} className="mb-1" />
            <Skeleton variant="text" width={80} height={14} />
          </div>
        </div>
      </div>
    </div>
  )
}
