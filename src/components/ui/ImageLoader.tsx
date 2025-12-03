'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface ImageLoaderProps {
  isLoading: boolean
  className?: string
}

export default function ImageLoader({ isLoading, className = "" }: ImageLoaderProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center z-10 ${className}`}
        >
          {/* Loading Animation */}
          <div className="relative flex flex-col items-center">
            {/* دائرة متحركة */}
            <div className="relative w-10 h-10 mb-2">
              <motion.div
                className="absolute inset-0 border-2 border-transparent border-t-blue-500 border-r-blue-400 rounded-full"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              
              {/* أيقونة الصورة في المنتصف */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h14V5H5zm4.5 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM18 17l-4-4-3 3-3-3-3 3h13z"/>
                  </svg>
                </motion.div>
              </div>
            </div>

            {/* نقاط متحركة صغيرة */}
            <div className="flex gap-1">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-1 h-1 bg-blue-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: index * 0.15,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
