// Chrome-optimized motion settings
export const chromeMotionConfig = {
  // Reduce motion complexity for better performance
  transition: {
    type: 'tween',
    ease: 'easeOut', 
    duration: 0.2
  },
  
  // Optimized hover animations
  whileHover: {
    scale: 1.02,
    transition: { duration: 0.15 }
  },
  
  whileTap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
}

// Reduced motion for Chrome performance
export const reducedMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15 }
}

// Optimized stagger animations
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2 }
  }
}
