import { MotionProps } from 'framer-motion'

// إعدادات محسنة للـ animations في Chrome
export const chromeOptimizedProps = {
  // الـ viewport settings المحسنة
  viewport: { 
    once: true, 
    amount: 0.2,
    margin: "0px 0px -50px 0px" // تحسين trigger point
  },
  
  // الـ transition settings المحسنة
  transition: {
    duration: 0.6,
    ease: "easeOut" as const,
    staggerChildren: 0.1
  },
  
  // Style properties لتحسين الأداء
  style: {
    transform: 'translateZ(0)',
    willChange: 'transform, opacity' as const
  }
}

// دالة لدمج الإعدادات المحسنة مع motion props موجودة
export function enhanceMotionProps(existingProps: MotionProps): MotionProps {
  return {
    ...existingProps,
    viewport: {
      ...chromeOptimizedProps.viewport,
      ...existingProps.viewport
    },
    transition: {
      ...chromeOptimizedProps.transition,
      ...existingProps.transition
    },
    style: {
      ...chromeOptimizedProps.style,
      ...existingProps.style
    }
  }
}

// Animation variants محسنة لـ Chrome
export const chromeAnimationVariants = {
  // Fade in from bottom
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    viewport: chromeOptimizedProps.viewport,
    transition: chromeOptimizedProps.transition,
    style: chromeOptimizedProps.style
  },
  
  // Scale animation
  fadeInScale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    viewport: chromeOptimizedProps.viewport,
    transition: chromeOptimizedProps.transition,
    style: chromeOptimizedProps.style
  },
  
  // Slide from left
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    viewport: chromeOptimizedProps.viewport,
    transition: chromeOptimizedProps.transition,
    style: chromeOptimizedProps.style
  }
}
