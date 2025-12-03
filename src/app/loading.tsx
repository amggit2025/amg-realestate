'use client'

import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center z-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative text-center">
        {/* Main Loading Animation */}
        <div className="mb-8">
          {/* House Building Animation */}
          <motion.div
            className="relative w-32 h-32 mx-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* House Base */}
            <motion.div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-16 bg-gradient-to-b from-blue-500 to-blue-600 rounded-lg shadow-lg"
              initial={{ scaleY: 0, originY: 1 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
            
            {/* House Roof */}
            <motion.div
              className="absolute bottom-18 left-1/2 transform -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '16px solid transparent',
                borderRight: '16px solid transparent',
                borderBottom: '12px solid #ef4444',
              }}
              initial={{ scale: 0, originY: 1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
            />
            
            {/* Door */}
            <motion.div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-amber-700 rounded-t-lg"
              initial={{ scaleY: 0, originY: 1 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, delay: 1.5, ease: "easeOut" }}
            />
            
            {/* Windows */}
            <motion.div
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2 translate-x-4 w-3 h-3 bg-yellow-300 rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 2 }}
            />
            <motion.div
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-x-4 w-3 h-3 bg-yellow-300 rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 2.2 }}
            />
            
            {/* Chimney Smoke */}
            <motion.div
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 translate-x-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, delay: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="text-gray-400 text-sm">💨</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AMG Real Estate</h1>
          <p className="text-lg text-gray-600">مجموعة أحمد الملاح العقارية</p>
        </motion.div>

        {/* Loading Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mb-6"
        >
          <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, delay: 1, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <motion.p
            className="text-gray-500 text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            جاري تحميل موقعنا الإلكتروني...
          </motion.p>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Key Icon */}
          <motion.div
            className="absolute top-1/4 left-1/4 text-2xl"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, -5, 5, 0] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 2.5 
            }}
          >
            🗝️
          </motion.div>
          
          {/* Building Icon */}
          <motion.div
            className="absolute top-1/3 right-1/4 text-2xl"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0] 
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 3 
            }}
          >
            🏢
          </motion.div>
          
          {/* Home Icon */}
          <motion.div
            className="absolute bottom-1/4 left-1/3 text-xl"
            animate={{ 
              y: [0, -8, 0],
              scale: [1, 1.1, 1] 
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 3.5 
            }}
          >
            🏡
          </motion.div>
        </div>

        {/* Particles Effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${20 + (i * 10)}%`,
                top: `${30 + (i * 5)}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2 + 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
