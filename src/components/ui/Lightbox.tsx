'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface LightboxProps {
  images: string[]
  isOpen: boolean
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  title?: string
}

export default function Lightbox({ 
  images, 
  isOpen, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrev, 
  title 
}: LightboxProps) {
  const [imageLoading, setImageLoading] = useState(false)

  const handleNext = () => {
    setImageLoading(true)
    onNext()
    setTimeout(() => setImageLoading(false), 500)
  }

  const handlePrev = () => {
    setImageLoading(true)
    onPrev()
    setTimeout(() => setImageLoading(false), 500)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowRight') handleNext()
    if (e.key === 'ArrowLeft') handlePrev()
  }

  // Keyboard navigation
  if (typeof window !== 'undefined') {
    document.addEventListener('keydown', handleKeyDown as any)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center text-white z-10">
            <div className="flex items-center gap-4">
              {title && <h3 className="text-xl font-semibold">{title}</h3>}
              <span className="text-white/80 bg-white/10 px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Main Image */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full h-full max-w-7xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full"
                />
              </div>
            )}
            
            <Image
              src={images[currentIndex]}
              alt={`صورة ${currentIndex + 1}`}
              fill
              className="object-contain"
              onLoad={() => setImageLoading(false)}
              priority
            />
          </motion.div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setImageLoading(true)
                    // You'd need to implement setCurrentIndex in parent
                    setTimeout(() => setImageLoading(false), 300)
                  }}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 ${
                    index === currentIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                  } transition-all`}
                >
                  <Image
                    src={image}
                    alt={`صورة مصغرة ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
