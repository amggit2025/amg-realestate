// تحسينات الأداء لـ Chrome و Framer Motion

export const chromePerformanceOptimizations = {
  // تحسين الحركات للـ Chrome
  optimizeForChrome() {
    if (typeof window !== 'undefined') {
      // إضافة class للـ body بعد التحميل
      document.body.classList.add('animations-ready')
      
      // تحسين الـ scroll performance
      const observerOptions = {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
      
      return observerOptions
    }
  },

  // تحديد إذا كان المتصفح Chrome
  isChrome() {
    if (typeof window !== 'undefined') {
      return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
    }
    return false
  },

  // تحسين الـ motion settings لـ Chrome
  getChromeMotionConfig() {
    return {
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "tween"
      },
      initial: { 
        opacity: 0, 
        y: 20,
        scale: 0.95
      },
      animate: { 
        opacity: 1, 
        y: 0,
        scale: 1
      },
      whileInView: {
        opacity: 1,
        y: 0,
        scale: 1
      },
      viewport: {
        once: true,
        amount: 0.3
      }
    }
  },

  // تحسين الـ stagger للحركات المتعددة
  getStaggerConfig(delay = 0.1) {
    return {
      animate: {
        transition: {
          staggerChildren: delay,
          delayChildren: 0.1
        }
      }
    }
  },

  // تحسين hover animations
  getHoverConfig() {
    return {
      whileHover: { 
        scale: 1.05,
        transition: { duration: 0.3, ease: "easeOut" }
      },
      whileTap: { 
        scale: 0.95,
        transition: { duration: 0.1 }
      }
    }
  }
}

// تحسينات خاصة بالـ intersection observer للـ scroll animations
export class OptimizedIntersectionObserver {
  private observer: IntersectionObserver | null = null
  
  constructor(callback: IntersectionObserverCallback) {
    if (typeof window !== 'undefined') {
      this.observer = new IntersectionObserver(callback, {
        rootMargin: '50px 0px',
        threshold: [0.1, 0.3, 0.5]
      })
    }
  }

  observe(element: Element) {
    if (this.observer) {
      this.observer.observe(element)
    }
  }

  unobserve(element: Element) {
    if (this.observer) {
      this.observer.unobserve(element)
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}

// دالة لتحسين الأداء العام
export const initPerformanceOptimizations = () => {
  if (typeof window !== 'undefined') {
    // تحسين Chrome
    if (chromePerformanceOptimizations.isChrome()) {
      document.documentElement.classList.add('is-chrome')
    }

    // تأخير تحميل الحركات
    setTimeout(() => {
      document.body.classList.add('animations-ready')
    }, 100)

    // تحسين الـ scroll performance
    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      document.body.classList.add('is-scrolling')
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        document.body.classList.remove('is-scrolling')
      }, 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }
}
