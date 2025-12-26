'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FirstVisitLoader() {
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Mark component as mounted (client-side only)
    setIsMounted(true)
    
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('amg-visited')
    
    if (!hasVisited) {
      // First visit!
      setIsFirstVisit(true)
      
      // Mark as visited
      localStorage.setItem('amg-visited', 'true')
      
      // Hide loader after 3 seconds
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 3000)
      
      return () => clearTimeout(timer)
    } else {
      // Not first visit - hide immediately
      setIsFirstVisit(false)
      setIsLoading(false)
    }
  }, [])

  // Prevent hydration mismatch - don't render anything on server
  if (!isMounted) return null
  
  // Don't show loader if not first visit
  if (!isFirstVisit) return null

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center z-[9999]"
        >
          {/* Animated Background Circles */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
            />
          </div>

          <div className="relative text-center z-10">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 1,
                type: "spring",
                stiffness: 100
              }}
              className="mb-8"
            >
              {/* Building Icon */}
              <div className="w-32 h-32 mx-auto relative">
                {/* House Base */}
                <motion.div
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white rounded-lg shadow-2xl"
                />
                
                {/* House Roof */}
                <motion.div
                  initial={{ scale: 0, originY: 1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="absolute bottom-16 left-1/2 transform -translate-x-1/2"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '20px solid transparent',
                    borderRight: '20px solid transparent',
                    borderBottom: '20px solid #fbbf24',
                  }}
                />

                {/* Door */}
                <motion.div
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.4, delay: 1.3 }}
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-10 bg-amber-600 rounded-t-lg"
                />

                {/* Windows */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.5 }}
                  className="absolute bottom-12 left-6 w-4 h-4 bg-amber-300 rounded"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.6 }}
                  className="absolute bottom-12 right-6 w-4 h-4 bg-amber-300 rounded"
                />
              </div>
            </motion.div>

            {/* Company Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                AMG
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full mb-4" />
              <p className="text-xl text-blue-100 font-light">
                للحلول العقارية
              </p>
            </motion.div>

            {/* Loading Dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="flex justify-center items-center gap-2 mt-8"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-3 h-3 bg-white rounded-full"
                />
              ))}
            </motion.div>

            {/* Welcome Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.3 }}
              className="text-blue-100 mt-4 text-sm"
            >
              مرحباً بك في عالم AMG العقاري
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
