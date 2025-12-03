// ======================================================
// 🎯 Chrome Optimized Motion - تحسينات الحركة لكروم
// ======================================================
// مكون محسن للحركات في متصفح Chrome

'use client'

import { motion, MotionProps } from 'framer-motion'
import { forwardRef } from 'react'

// Chrome optimized animations
export const chromeAnimations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  slideInFromLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  slideInFromRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: 'easeOut' }
  }
}

// Chrome optimized motion component
interface ChromeOptimizedMotionProps extends MotionProps {
  children: React.ReactNode
  className?: string
}

export const ChromeOptimizedMotion = forwardRef<HTMLDivElement, ChromeOptimizedMotionProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

ChromeOptimizedMotion.displayName = 'ChromeOptimizedMotion'

export default ChromeOptimizedMotion