'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface CompactSearchProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
}

const CompactSearch: React.FC<CompactSearchProps> = ({
  placeholder = "ابحث...",
  onSearch,
  className
}) => {
  const [query, setQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (!query) {
          setIsExpanded(false)
        }
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [query])

  const handleFocus = () => {
    setIsExpanded(true)
    setIsFocused(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch?.(query.trim())
    }
  }

  const handleClear = () => {
    setQuery('')
    if (!isFocused) {
      setIsExpanded(false)
    }
    inputRef.current?.focus()
  }

  const handleSearchIconClick = () => {
    if (!isExpanded) {
      setIsExpanded(true)
      setTimeout(() => inputRef.current?.focus(), 100)
    } else if (query.trim()) {
      onSearch?.(query.trim())
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <motion.form
        onSubmit={handleSubmit}
        className="relative"
        initial={false}
        animate={{
          width: isExpanded ? '240px' : '32px'
        }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <div className="relative flex items-center">
          {/* Search Icon Button */}
          <button
            type="button"
            onClick={handleSearchIconClick}
            className={`
              relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200
              ${isExpanded 
                ? 'bg-white/95 text-gray-500 hover:text-blue-600' 
                : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-blue-600 shadow-sm hover:shadow'
              }
            `}
          >
            <MagnifyingGlassIcon className="w-3.5 h-3.5" />
          </button>

          {/* Expandable Input */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '100%' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute left-0 top-0 w-full"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={() => setIsFocused(false)}
                  placeholder={placeholder}
                  className={`
                    w-full h-8 pl-10 pr-3 text-xs bg-white/95 border border-gray-200/80
                    rounded-full placeholder-gray-400 text-gray-700
                    focus:outline-none focus:ring-1 focus:ring-blue-400/50 focus:border-blue-300
                    hover:border-gray-300/80 transition-all duration-200
                    ${isFocused ? 'shadow-md' : 'shadow-sm'}
                  `}
                />

                {/* Clear Button */}
                {query && (
                  <motion.button
                    type="button"
                    onClick={handleClear}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-300 hover:bg-gray-400 text-white flex items-center justify-center transition-colors duration-200"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.form>

      {/* Search Results Preview (Optional) */}
      <AnimatePresence>
        {isExpanded && query && isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 max-w-sm"
          >
            <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
              نتائج البحث عن "{query}"
            </div>
            <div className="px-3 py-2">
              <div className="text-xs text-gray-400 text-center">
                اضغط Enter للبحث
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CompactSearch
