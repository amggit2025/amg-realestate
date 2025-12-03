'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { 
  MagnifyingGlassIcon,
  XMarkIcon,
  MapPinIcon,
  HomeIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon as MagnifyingGlassIconSolid } from '@heroicons/react/24/solid'

interface SearchResult {
  id: string
  title: string
  type: 'project' | 'service' | 'page'
  description: string
  url: string
  location?: string
  price?: string
  image?: string
}

interface AdvancedSearchProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
}

export default function AdvancedSearch({ 
  placeholder = "ابحث في المشاريع، الخدمات...",
  onSearch,
  className = ""
}: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // بيانات وهمية للبحث
  const mockData: SearchResult[] = [
    {
      id: '1',
      title: 'كمبوند النخيل الجديد',
      type: 'project',
      description: 'مشروع سكني متكامل في القاهرة الجديدة',
      url: '/projects/1',
      location: 'القاهرة الجديدة',
      price: '2,500,000 ج.م',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: '2',
      title: 'خدمات التشطيب',
      type: 'service',
      description: 'تشطيب شقق وفيلل بأعلى جودة',
      url: '/services/finishing',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: '3',
      title: 'خدمات التسويق العقاري',
      type: 'service',
      description: 'تسويق العقارات بطرق حديثة ومبتكرة',
      url: '/services/marketing',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: '4',
      title: 'خدمات البناء والتشييد',
      type: 'service',
      description: 'بناء وتشييد المباني السكنية والتجارية',
      url: '/services/construction',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: '5',
      title: 'معرض الأعمال',
      type: 'page',
      description: 'استعرض جميع مشاريعنا المنجزة',
      url: '/portfolio'
    }
  ]

  // البحث مع تأخير
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    const searchTimer = setTimeout(() => {
      const filteredResults = mockData.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.location?.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filteredResults)
      setIsLoading(false)
      setSelectedIndex(-1)
    }, 300)

    return () => clearTimeout(searchTimer)
  }, [query])

  // إغلاق البحث عند النقر خارجه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // التنقل بالكيبورد
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev)
          break
        case 'Enter':
          event.preventDefault()
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleSelectResult(results[selectedIndex])
          }
          break
        case 'Escape':
          setIsOpen(false)
          inputRef.current?.blur()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, results])

  const handleSelectResult = (result: SearchResult) => {
    setIsOpen(false)
    setQuery('')
    window.location.href = result.url
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <BuildingOfficeIcon className="w-4 h-4 text-blue-500" />
      case 'service':
        return <HomeIcon className="w-4 h-4 text-green-500" />
      case 'page':
        return <MagnifyingGlassIcon className="w-4 h-4 text-purple-500" />
      default:
        return <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case 'project':
        return 'مشروع'
      case 'service':
        return 'خدمة'
      case 'page':
        return 'صفحة'
      default:
        return ''
    }
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* حقل البحث */}
      <div className="relative">
        <motion.div
          className={`relative flex items-center bg-white rounded-lg border-2 transition-all duration-300 ${
            isOpen ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
          }`}
          whileFocus={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-center w-12 h-12">
            <MagnifyingGlassIconSolid className="w-5 h-5 text-gray-400" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="flex-1 px-2 py-3 text-right bg-transparent border-none outline-none text-gray-800 placeholder-gray-500"
          />

          {query && (
            <button
              onClick={handleClear}
              className="flex items-center justify-center w-8 h-8 mr-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </motion.div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <motion.div
              className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}
      </div>

      {/* نتائج البحث */}
      <AnimatePresence>
        {isOpen && (query.length >= 2 || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full bg-white rounded-lg border border-gray-200 shadow-xl z-50 max-h-96 overflow-y-auto"
          >
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((result, index) => (
                  <motion.button
                    key={result.id}
                    onClick={() => handleSelectResult(result)}
                    className={`w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      index === selectedIndex ? 'bg-blue-50' : ''
                    }`}
                    whileHover={{ x: -4 }}
                  >
                    <div className="flex items-center gap-3">
                      {result.image && (
                        <img
                          src={result.image}
                          alt={result.title}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(result.type)}
                          <span className="text-xs text-gray-500">
                            {getTypeName(result.type)}
                          </span>
                        </div>
                        
                        <h4 className="font-semibold text-gray-800 text-sm truncate">
                          {result.title}
                        </h4>
                        
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {result.description}
                        </p>
                        
                        {(result.location || result.price) && (
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            {result.location && (
                              <div className="flex items-center gap-1">
                                <MapPinIcon className="w-3 h-3" />
                                <span>{result.location}</span>
                              </div>
                            )}
                            {result.price && (
                              <div className="flex items-center gap-1">
                                <CurrencyDollarIcon className="w-3 h-3" />
                                <span>{result.price}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : query.length >= 2 && !isLoading ? (
              <div className="py-8 text-center">
                <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-500 mb-1">لا توجد نتائج</h3>
                <p className="text-xs text-gray-400">جرب كلمات مختلفة للبحث</p>
              </div>
            ) : null}

            {/* اقتراحات البحث */}
            {query.length === 0 && (
              <div className="py-4 px-4 border-t border-gray-100">
                <h4 className="text-xs font-medium text-gray-500 mb-3">البحث الشائع</h4>
                <div className="flex flex-wrap gap-2">
                  {['شقق للبيع', 'فيلل', 'تشطيب', 'تسويق عقاري'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
