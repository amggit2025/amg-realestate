'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { HomeIcon, BuildingOfficeIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface SearchResult {
  id: string
  title: string
  type: 'project' | 'service' | 'page'
  description: string
  url: string
  icon?: React.ReactNode
}

// Mock search data - في التطبيق الحقيقي سيأتي من API
const searchData: SearchResult[] = [
  {
    id: '1',
    title: 'كمبوند النخيل الجديد',
    type: 'project',
    description: 'مشروع سكني متكامل في القاهرة الجديدة',
    url: '/projects/1',
    icon: <HomeIcon className="w-5 h-5" />
  },
  {
    id: '2',
    title: 'خدمات البناء والتشييد',
    type: 'service',
    description: 'نقدم خدمات البناء والتشييد بأعلى جودة',
    url: '/services/construction',
    icon: <BuildingOfficeIcon className="w-5 h-5" />
  },
  {
    id: '3',
    title: 'خدمات التشطيب',
    type: 'service',
    description: 'تشطيب الوحدات السكنية والتجارية',
    url: '/services/finishing',
    icon: <WrenchScrewdriverIcon className="w-5 h-5" />
  },
  {
    id: '4',
    title: 'من نحن',
    type: 'page',
    description: 'تعرف على شركة AMG العقارية وخبرتنا',
    url: '/about',
  },
  {
    id: '5',
    title: 'تواصل معنا',
    type: 'page',
    description: 'طرق التواصل مع فريق AMG العقارية',
    url: '/contact',
  }
]

interface SearchProps {
  placeholder?: string
  className?: string
  onResultClick?: (result: SearchResult) => void
}

export default function Search({ 
  placeholder = 'ابحث في المشاريع والخدمات...', 
  className = '',
  onResultClick 
}: SearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Search functionality
  useEffect(() => {
    if (query.length > 1) {
      const filteredResults = searchData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filteredResults)
      setIsOpen(true)
      setSelectedIndex(-1)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query])

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  const handleResultClick = (result: SearchResult) => {
    setQuery('')
    setIsOpen(false)
    onResultClick?.(result)
    // Navigate to result URL
    window.location.href = result.url
  }

  const clearSearch = () => {
    setQuery('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'project': return 'مشروع'
      case 'service': return 'خدمة'
      case 'page': return 'صفحة'
      default: return ''
    }
  }

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'project': return 'bg-blue-100 text-blue-800'
      case 'service': return 'bg-green-100 text-green-800'
      case 'page': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pr-12 pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon />
          </button>
        )}
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${
                  index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleResultClick(result)}
              >
                <div className="flex items-start gap-3">
                  {result.icon && (
                    <div className="flex-shrink-0 mt-1 text-blue-600">
                      {result.icon}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {result.title}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(result.type)}`}>
                        {getTypeLabel(result.type)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {result.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results */}
      <AnimatePresence>
        {isOpen && query.length > 1 && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-6 text-center"
          >
            <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">لا توجد نتائج</h4>
            <p className="text-sm text-gray-600">
              لم نجد أي نتائج تطابق "{query}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
