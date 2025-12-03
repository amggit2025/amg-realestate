'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  children: React.ReactNode
  minDuration?: number
  showOnRefresh?: boolean
}

// Fixed positions for particles to avoid hydration errors
const PARTICLE_POSITIONS = [
  { left: '15%', top: '20%' },
  { left: '85%', top: '30%' },
  { left: '25%', top: '70%' },
  { left: '75%', top: '60%' },
  { left: '45%', top: '15%' },
  { left: '65%', top: '80%' },
  { left: '10%', top: '50%' },
  { left: '90%', top: '40%' },
]

// Enhanced Loading Component
function AMGLoader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-gray-100 to-stone-100 z-[9999] flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="bgGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="0.5"/>
                <circle cx="30" cy="30" r="0.5" fill="rgba(148,163,184,0.2)"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bgGrid)" />
          </svg>
        </div>
        
        {/* Professional floating elements with fixed positions */}
        {PARTICLE_POSITIONS.map((position, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-slate-300/40 rounded-full"
            style={{
              left: position.left,
              top: position.top,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* المحتوى في منتصف الصفحة تماماً */}
      <div className="relative text-center text-slate-700 z-10">
        {/* Logo Animation - يظهر فوراً ويفضل لوحده ثانية واحدة */}
        <motion.div
          className="mb-16"
          initial={{ scale: 1, opacity: 1 }}  
          animate={{ scale: [1, 1.1, 1] }}    
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Company Name */}
          <motion.h1
            className="text-8xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 bg-clip-text text-transparent"
            initial={{ opacity: 1 }}  
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ backgroundSize: '200% 200%' }}
          >
            AMG
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 1 }}  
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="text-3xl font-light text-slate-600 mb-3">Real Estate</p>
            <p className="text-xl text-slate-500">مجموعة أحمد الملاح العقارية</p>
          </motion.div>
        </motion.div>

        {/* House Building Animation - يبدأ بعد ثانية واحدة من اللوجو */}
        <motion.div
          className="relative w-48 h-48 mx-auto mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}  
        >
          {/* Building Base */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-28 h-24 bg-white/90 backdrop-blur-sm rounded-lg border border-slate-300/50 shadow-lg"
            initial={{ scaleY: 0, transformOrigin: 'bottom' }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}  
          />
          
          {/* Roof */}
          <motion.div
            className="absolute bottom-30 left-1/2 transform -translate-x-1/2"
            style={{
              width: '0',
              height: '0',
              borderLeft: '24px solid transparent',
              borderRight: '24px solid transparent',
              borderBottom: '20px solid #dc2626',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
            initial={{ scale: 0, transformOrigin: 'bottom' }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5, ease: "easeOut" }}  
          />
          
          {/* Windows */}
          <motion.div
            className="absolute bottom-18 left-1/2 transform -translate-x-1/2 translate-x-8 w-5 h-5 bg-amber-400 rounded border border-slate-300/60 shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0.8, 1],
              boxShadow: [
                '0 0 0px rgba(245, 158, 11, 0)',
                '0 0 20px rgba(245, 158, 11, 0.4)',
                '0 0 10px rgba(245, 158, 11, 0.2)',
                '0 0 20px rgba(245, 158, 11, 0.4)'
              ]
            }}
            transition={{ duration: 2, delay: 1.8, repeat: Infinity, ease: "easeInOut" }}  
          />
          <motion.div
            className="absolute bottom-18 left-1/2 transform -translate-x-1/2 -translate-x-8 w-5 h-5 bg-amber-400 rounded border border-slate-300/60 shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0.8, 1],
              boxShadow: [
                '0 0 0px rgba(245, 158, 11, 0)',
                '0 0 20px rgba(245, 158, 11, 0.4)',
                '0 0 10px rgba(245, 158, 11, 0.2)',
                '0 0 20px rgba(245, 158, 11, 0.4)'
              ]
            }}
            transition={{ duration: 2, delay: 2.0, repeat: Infinity, ease: "easeInOut" }}  
          />
          
          {/* Door */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-6 h-12 bg-amber-700 rounded-t-lg border border-slate-300/50 shadow-sm"
            initial={{ scaleY: 0, transformOrigin: 'bottom' }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.4, delay: 1.7, ease: "easeOut" }}  
          />
        </motion.div>

        {/* Loading Progress - يبدأ مع اللوجو */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}  
          className="mb-12"
        >
          <div className="w-96 h-3 bg-slate-200/70 rounded-full mx-auto overflow-hidden backdrop-blur-sm border border-slate-300/30">
            <motion.div
              className="h-full bg-gradient-to-r from-slate-600 via-slate-700 to-slate-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, delay: 1.2, ease: "easeInOut" }}  
            />
          </div>
        </motion.div>

        {/* Loading Text - يبدأ مع اللوجو */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}  
        >
          <motion.p
            className="text-2xl font-medium mb-6 text-slate-600"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            جاري تحضير تجربة عقارية مميزة
          </motion.p>
          
          {/* Dots */}
          <div className="flex justify-center space-x-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-4 h-4 bg-slate-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2 + 1,  
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoadingScreen({ 
  children, 
  minDuration = 3000, // رجعناها 3 ثواني بس
  showOnRefresh = true 
}: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [shouldShow, setShouldShow] = useState(true)

  useEffect(() => {
    const startTime = Date.now()
    
    const finishLoading = () => {
      const elapsed = Date.now() - startTime
      const remainingTime = Math.max(0, minDuration - elapsed)
      
      setTimeout(() => {
        setIsLoading(false)
      }, remainingTime)
    }

    // مش نستنى حاجة، نبدأ العد العكسي فوراً
    const timer = setTimeout(finishLoading, 100)
    
    return () => clearTimeout(timer)
  }, [minDuration])

  if (!shouldShow) return <>{children}</>

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="amg-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <AMGLoader />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.8, delay: isLoading ? 0 : 0.2 }}
        style={{ display: isLoading ? 'none' : 'block' }}  
      >
        {children}
      </motion.div>
    </>
  )
}
