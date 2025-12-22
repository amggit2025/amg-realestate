// ======================================================
// 🛠️ Logger Utility - Safe Console for Production
// ======================================================

/**
 * Safe console logger that only logs in development
 * Use this instead of console.log/error/warn in client components
 */

const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args)
    }
  },
  
  error: (...args: any[]) => {
    if (isDev) {
      console.error(...args)
    }
  },
  
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args)
    }
  },
  
  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args)
    }
  },
  
  debug: (...args: any[]) => {
    if (isDev) {
      console.debug(...args)
    }
  }
}

// For production error tracking (can be extended with Sentry, etc.)
export const trackError = (error: any, context?: string) => {
  if (isDev) {
    console.error(context ? `[${context}]` : '', error)
  }
  // TODO: Add production error tracking service (Sentry, LogRocket, etc.)
}
