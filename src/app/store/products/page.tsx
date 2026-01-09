'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'
import { useWishlist } from '@/contexts/WishlistContext'
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  HeartIcon,
  ShoppingBagIcon,
  StarIcon,
  XMarkIcon,
  ChevronDownIcon,
  FunnelIcon,
  SparklesIcon,
  ArrowLongLeftIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

// Mock Products Data (Expanded & Enhanced)
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'كنبة مودرن إيطالي فاخرة',
    price: 25000,
    oldPrice: 32000,
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    rating: 4.9,
    reviews: 124,
    stock: 8,
    featured: true,
    badge: 'الأكثر مبيعاً'
  },
  {
    id: 2,
    name: 'مكتب مدير تنفيذي خشب زان',
    price: 18500,
    category: 'office',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
    rating: 4.8,
    reviews: 89,
    stock: 5,
    featured: true,
    badge: 'جديد'
  },
  {
    id: 3,
    name: 'وحدة إضاءة معلقة كريستال',
    price: 3200,
    oldPrice: 4500,
    category: 'decor',
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80',
    rating: 4.7,
    reviews: 56,
    stock: 15,
    featured: false
  },
  {
    id: 4,
    name: 'كرسي استرخاء جلد طبيعي',
    price: 12000,
    oldPrice: 15000,
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
    rating: 4.9,
    reviews: 201,
    stock: 3,
    featured: true,
    badge: 'عرض خاص'
  },
  {
    id: 5,
    name: 'مطبخ ألمونيوم عصري كامل',
    price: 45000,
    category: 'kitchens',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80',
    rating: 4.9,
    reviews: 78,
    stock: 2,
    featured: true
  },
  {
    id: 6,
    name: 'طقم غرفة نوم كلاسيك',
    price: 32000,
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80',
    rating: 4.6,
    reviews: 145,
    stock: 4,
    featured: false
  },
  {
    id: 7,
    name: 'مكتبة حائط خشب طبيعي',
    price: 8500,
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80',
    rating: 4.5,
    reviews: 67,
    stock: 10,
    featured: false
  },
  {
    id: 8,
    name: 'سجادة تركية فاخرة',
    price: 5500,
    category: 'decor',
    image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80',
    rating: 4.8,
    reviews: 92,
    stock: 20,
    featured: false
  },
  {
    id: 9,
    name: 'مرآة حائط ذهبية كبيرة',
    price: 2800,
    category: 'decor',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80',
    rating: 4.4,
    reviews: 34,
    stock: 12,
    featured: false
  },
  {
    id: 10,
    name: 'كرسي مكتب جلد أسود',
    price: 4200,
    category: 'office',
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80',
    rating: 4.7,
    reviews: 156,
    stock: 18,
    featured: false
  },
  {
    id: 11,
    name: 'طاولة طعام رخام وخشب',
    price: 15000,
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
    rating: 4.8,
    reviews: 88,
    stock: 6,
    featured: false
  },
  {
    id: 12,
    name: 'تكييف سبليت 2.25 حصان',
    price: 12500,
    category: 'ac',
    image: 'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&q=80',
    rating: 4.9,
    reviews: 234,
    stock: 25,
    featured: true,
    badge: 'توفير طاقة'
  },
  {
    id: 13,
    name: 'رف كتب معدني أسود',
    price: 3500,
    category: 'office',
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80',
    rating: 4.5,
    reviews: 45,
    stock: 14,
    featured: false
  },
  {
    id: 14,
    name: 'لوحة فنية تجريدية كبيرة',
    price: 2200,
    category: 'decor',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
    rating: 4.3,
    reviews: 28,
    stock: 30,
    featured: false
  },
  {
    id: 15,
    name: 'طقم كنب مودرن 3+2+1',
    price: 38000,
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
    rating: 4.9,
    reviews: 167,
    stock: 3,
    featured: true
  },
  {
    id: 16,
    name: 'مطبخ خشب زان كلاسيك',
    price: 52000,
    category: 'kitchens',
    image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&q=80',
    rating: 5.0,
    reviews: 56,
    stock: 1,
    featured: true
  },
  {
    id: 17,
    name: 'مصباح أرضي حديث LED',
    price: 1800,
    category: 'decor',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    rating: 4.6,
    reviews: 73,
    stock: 22,
    featured: false
  },
  {
    id: 18,
    name: 'طاولة قهوة زجاج وخشب',
    price: 6500,
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800&q=80',
    rating: 4.7,
    reviews: 94,
    stock: 9,
    featured: false
  },
  {
    id: 19,
    name: 'باب خشب زان مصري فاخر',
    price: 8500,
    category: 'wood',
    image: 'https://images.unsplash.com/photo-1615875221248-d3af61d63e99?w=800&q=80',
    rating: 4.8,
    reviews: 112,
    stock: 7,
    featured: false
  },
  {
    id: 20,
    name: 'مكتب طالب مع كرسي',
    price: 4800,
    category: 'office',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
    rating: 4.5,
    reviews: 65,
    stock: 16,
    featured: false
  }
]

const CATEGORIES = [
  { id: 'all', name: 'الكل', count: MOCK_PRODUCTS.length },
  { id: 'furniture', name: 'أثاث منزلي', count: MOCK_PRODUCTS.filter(p => p.category === 'furniture').length },
  { id: 'office', name: 'مكاتب', count: MOCK_PRODUCTS.filter(p => p.category === 'office').length },
  { id: 'kitchens', name: 'مطابخ', count: MOCK_PRODUCTS.filter(p => p.category === 'kitchens').length },
  { id: 'decor', name: 'ديكور', count: MOCK_PRODUCTS.filter(p => p.category === 'decor').length },
  { id: 'ac', name: 'تكييفات', count: MOCK_PRODUCTS.filter(p => p.category === 'ac').length },
]

const SORT_OPTIONS = [
  { id: 'featured', name: 'المميزة أولاً' },
  { id: 'price-low', name: 'السعر: الأقل' },
  { id: 'price-high', name: 'السعر: الأعلى' },
  { id: 'rating', name: 'الأعلى تقييماً' },
  { id: 'newest', name: 'وصل حديثاً' },
]

// Popular Searches
const POPULAR_SEARCHES = [
  'كنبة مودرن',
  'مكتب خشب',
  'سرير نفر ونص',
  'طقم طعام',
  'خزانة ملابس',
  'طاولة قهوة'
]

// Recent Searches Storage Key
const RECENT_SEARCHES_KEY = 'amg-store-recent-searches'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('featured')
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [quickViewProduct, setQuickViewProduct] = useState<typeof MOCK_PRODUCTS[0] | null>(null)

  const itemsPerPage = 12

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading recent searches:', e)
      }
    }
  }, [])

  // Save search to recent searches
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  }

  // Handle search submit
  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      saveRecentSearch(query.trim())
      setSearchQuery(query.trim())
      setSearchFocused(false)
    }
  }

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  }

  // Get search suggestions based on current query
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return []
    
    const query = searchQuery.toLowerCase()
    return MOCK_PRODUCTS
      .filter(p => p.name.toLowerCase().includes(query))
      .slice(0, 5)
      .map(p => p.name)
  }, [searchQuery])

  // Update category when URL param changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  // Filtering and Sorting Logic
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = MOCK_PRODUCTS

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Filter by rating
    filtered = filtered.filter(p => p.rating >= minRating)

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        default:
          return 0
      }
    })

    return sorted
  }, [selectedCategory, searchQuery, priceRange, minRating, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const toggleWishlist = (product: typeof MOCK_PRODUCTS[0]) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      showToast('تم حذف المنتج من المفضلة', 'success')
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: (product as any).originalPrice || undefined,
        image: product.image,
        category: product.category,
        rating: product.rating,
        inStock: product.stock > 0
      })
      showToast('تم إضافة المنتج إلى المفضلة', 'success')
    }
  }

  const handleQuickAddToCart = (product: typeof MOCK_PRODUCTS[0]) => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      },
      1
    )
    showToast(`تمت إضافة ${product.name} إلى السلة!`, 'success')
  }

  const resetFilters = () => {
    setSelectedCategory('all')
    setPriceRange([0, 100000])
    setMinRating(0)
    setSearchQuery('')
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-28">
      
      {/* 1. Page Header (Premium Banner) */}
      <div className="relative h-64 bg-slate-900 overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        <div className="container mx-auto px-4 relative h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <SparklesIcon className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-widest">المجموعة الكاملة</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              تسوق بتميز
            </h1>
            <p className="text-gray-300 max-w-xl text-lg font-light leading-relaxed">
              اكتشف تشكيلتنا الحصرية من الأثاث والديكور العصري الذي يجمع بين الفخامة والعملية.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-20 space-y-8">
              {/* Categories */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-50">
                  <h3 className="font-bold text-slate-900">التصنيفات</h3>
                </div>
                <div className="p-3">
                  {CATEGORIES.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all mb-1 ${
                        selectedCategory === category.id
                          ? 'bg-slate-900 text-amber-400 font-bold shadow-md'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="text-sm">{category.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedCategory === category.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range - Enhanced */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-900">نطاق السعر</h3>
                  {(priceRange[0] > 0 || priceRange[1] < 100000) && (
                    <button
                      onClick={() => setPriceRange([0, 100000])}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                    >
                      إعادة تعيين
                    </button>
                  )}
                </div>
                
                {/* Min Price Slider */}
                <div className="mb-4">
                  <label className="text-xs text-gray-600 mb-2 block">من</label>
                  <input
                    type="range"
                    min="0"
                    max={priceRange[1] - 1000}
                    step="1000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full h-2 bg-gradient-to-r from-amber-200 to-amber-500 rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                </div>
                
                {/* Max Price Slider */}
                <div className="mb-4">
                  <label className="text-xs text-gray-600 mb-2 block">إلى</label>
                  <input
                    type="range"
                    min={priceRange[0] + 1000}
                    max="100000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gradient-to-r from-amber-200 to-amber-500 rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                </div>
                
                {/* Price Display */}
                <div className="flex justify-between items-center gap-2">
                  <div className="flex-1 text-center bg-gradient-to-br from-amber-50 to-orange-50 px-3 py-2 rounded-xl border border-amber-100">
                    <div className="text-[10px] text-gray-500 font-medium mb-0.5">من</div>
                    <div className="text-sm text-slate-900 font-black">
                      {priceRange[0].toLocaleString()} ج.م
                    </div>
                  </div>
                  
                  <div className="text-gray-400">-</div>
                  
                  <div className="flex-1 text-center bg-gradient-to-br from-amber-50 to-orange-50 px-3 py-2 rounded-xl border border-amber-100">
                    <div className="text-[10px] text-gray-500 font-medium mb-0.5">إلى</div>
                    <div className="text-sm text-slate-900 font-black">
                      {priceRange[1] === 100000 ? '+100,000' : priceRange[1].toLocaleString()} ج.م
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-slate-900 mb-4">تقييم الجودة</h3>
                <div className="space-y-1">
                  {[4, 3, 2, 1].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
                        minRating === rating ? 'bg-amber-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <StarSolidIcon key={i} className={`w-4 h-4 ${i < rating ? '' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-slate-900 font-medium pt-1">& Up</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
              
              {/* Enhanced Search with Dropdown */}
              <div className="relative w-full sm:max-w-md">
                <MagnifyingGlassIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="text"
                  placeholder="ابحث عن اسم المنتج..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit(searchQuery)
                    }
                  }}
                  className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-amber-500 focus:ring-0 rounded-xl py-3 pr-12 pl-12 text-sm transition-all shadow-inner"
                />
                
                {/* Clear Search Button */}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors z-10"
                  >
                    <XMarkIcon className="w-4 h-4 text-gray-500" />
                  </button>
                )}

                {/* Search Dropdown */}
                <AnimatePresence>
                  {searchFocused && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setSearchFocused(false)}
                      />

                      {/* Dropdown Content */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-30 max-h-96 overflow-hidden"
                      >
                        {/* Search Suggestions (if typing) */}
                        {searchQuery && searchSuggestions.length > 0 && (
                          <div className="border-b border-gray-100">
                            <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">
                              اقتراحات البحث
                            </div>
                            {searchSuggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  handleSearchSubmit(suggestion)
                                }}
                                className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 group"
                              >
                                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 group-hover:text-amber-500" />
                                <span className="text-sm text-slate-900">{suggestion}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Recent Searches */}
                        {!searchQuery && recentSearches.length > 0 && (
                          <div className="border-b border-gray-100">
                            <div className="px-4 py-2 flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-500 uppercase">
                                عمليات البحث الأخيرة
                              </span>
                              <button
                                onClick={clearRecentSearches}
                                className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                              >
                                مسح الكل
                              </button>
                            </div>
                            {recentSearches.map((search, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  handleSearchSubmit(search)
                                }}
                                className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 group"
                              >
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm text-slate-900">{search}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Popular Searches */}
                        {!searchQuery && (
                          <div>
                            <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">
                              عمليات بحث شائعة
                            </div>
                            <div className="px-4 pb-4 flex flex-wrap gap-2">
                              {POPULAR_SEARCHES.map((search, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    handleSearchSubmit(search)
                                  }}
                                  className="px-3 py-1.5 bg-gray-100 hover:bg-slate-900 hover:text-amber-400 text-gray-700 rounded-full text-sm font-medium transition-colors"
                                >
                                  {search}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                {/* Mobile Filter Trigger */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl font-bold text-sm"
                >
                  <FunnelIcon className="w-5 h-5" />
                  تصنيف
                </button>

                {/* Sort Dropdown */}
                <div className="relative flex-1 sm:flex-none sm:w-48">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 text-slate-900 font-medium text-sm rounded-xl py-3 px-4 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 cursor-pointer hover:border-gray-300 transition-colors"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Results Count & Active Filters - Enhanced */}
            {(searchQuery || selectedCategory !== 'all' || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 100000) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                {/* Results Count Bar */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center">
                      <SparklesIcon className="w-5 h-5 text-slate-900" />
                    </div>
                    <div>
                      <div className="text-2xl font-black">
                        {filteredAndSortedProducts.length}
                      </div>
                      <div className="text-xs text-gray-300">
                        {filteredAndSortedProducts.length === 1 ? 'منتج متاح' : 'منتجات متاحة'}
                      </div>
                    </div>
                  </div>

                  {/* Clear All Filters */}
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                      setMinRating(0)
                      setPriceRange([0, 100000])
                    }}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    مسح الكل
                  </button>
                </div>

                {/* Active Filters Chips */}
                <div className="bg-white border-x border-b border-gray-100 rounded-b-2xl p-4">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase pt-2 shrink-0">الفلاتر النشطة:</span>
                    <div className="flex flex-wrap gap-2">
                      {/* Search Query Chip */}
                      {searchQuery && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="group flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 px-3 py-2 rounded-xl text-sm font-medium"
                        >
                          <MagnifyingGlassIcon className="w-4 h-4 text-blue-600" />
                          <span className="max-w-[150px] truncate">{searchQuery}</span>
                          <button
                            onClick={() => setSearchQuery('')}
                            className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                          >
                            <XMarkIcon className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      )}

                      {/* Category Chip */}
                      {selectedCategory !== 'all' && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-purple-900 px-3 py-2 rounded-xl text-sm font-medium"
                        >
                          <FunnelIcon className="w-4 h-4 text-purple-600" />
                          <span>{CATEGORIES.find(c => c.id === selectedCategory)?.name}</span>
                          <button
                            onClick={() => setSelectedCategory('all')}
                            className="hover:bg-purple-100 rounded-full p-0.5 transition-colors"
                          >
                            <XMarkIcon className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      )}

                      {/* Price Range Chip */}
                      {(priceRange[0] > 0 || priceRange[1] < 100000) && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-900 px-3 py-2 rounded-xl text-sm font-medium"
                        >
                          <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>
                            {priceRange[0].toLocaleString()} - {priceRange[1] === 100000 ? '+100K' : priceRange[1].toLocaleString()} ج.م
                          </span>
                          <button
                            onClick={() => setPriceRange([0, 100000])}
                            className="hover:bg-amber-100 rounded-full p-0.5 transition-colors"
                          >
                            <XMarkIcon className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      )}

                      {/* Rating Chip */}
                      {minRating > 0 && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-900 px-3 py-2 rounded-xl text-sm font-medium"
                        >
                          <div className="flex text-amber-400">
                            {[...Array(minRating)].map((_, i) => (
                              <StarSolidIcon key={i} className="w-3.5 h-3.5" />
                            ))}
                          </div>
                          <span>& Up</span>
                          <button
                            onClick={() => setMinRating(0)}
                            className="hover:bg-green-100 rounded-full p-0.5 transition-colors"
                          >
                            <XMarkIcon className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Products Grid */}
            <div className="min-h-[600px]">
              <AnimatePresence mode='wait'>
                {paginatedProducts.length > 0 ? (
                  <motion.div 
                    layout
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4"
                  >
                    {paginatedProducts.map((product, index) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        key={product.id}
                        className="group bg-white rounded-2xl border border-gray-100 hover:border-amber-200 overflow-hidden hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col"
                      >
                        {/* Image Container */}
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-3 right-3 flex flex-col gap-2 pointer-events-none z-10">
                            {/* Discount Badge */}
                            {product.oldPrice && product.oldPrice > product.price && (
                              <span className="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg">
                                خصم {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                              </span>
                            )}
                            {/* Stock Badge */}
                            {product.stock <= 5 && (
                              <span className="bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg">
                                مخزون قليل: {product.stock}
                              </span>
                            )}
                            {/* Featured Badge */}
                            {product.featured && (
                              <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg">
                                مميز
                              </span>
                            )}
                            {/* Custom Badge */}
                            {product.badge && !product.oldPrice && (
                              <span className="bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg">
                                {product.badge}
                              </span>
                            )}
                          </div>

                          {/* Quick Actions (Hover) */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12 flex items-center justify-center gap-2 z-10">
                             
                              {/* Wishlist Button */}
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  toggleWishlist(product)
                                }}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md transition-all ${
                                  isInWishlist(product.id)
                                    ? 'bg-red-500 text-white shadow-lg scale-110' 
                                    : 'bg-white/20 text-white hover:bg-white hover:text-red-500'
                                }`}
                                title={isInWishlist(product.id) ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                              >
                                {isInWishlist(product.id) ? (
                                   <HeartSolidIcon className="w-5 h-5" />
                                ) : (
                                   <HeartIcon className="w-5 h-5" />
                                )}
                              </button>

                              {/* Quick View Button */}
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  setQuickViewProduct(product)
                                }}
                                className="w-10 h-10 rounded-xl bg-white/20 text-white hover:bg-white hover:text-amber-500 flex items-center justify-center backdrop-blur-md transition-all"
                                title="نظرة سريعة"
                              >
                                <EyeIcon className="w-5 h-5" />
                              </button>

                              {/* View Details Button */}
                              <Link
                                href={`/store/products/${product.id}`}
                                className="bg-white text-slate-900 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-2 shadow-lg"
                              >
                                التفاصيل
                              </Link>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex-1 flex flex-col">
                          {/* Rating & Reviews */}
                          <div className="flex items-center gap-2 mb-2">
                             <div className="flex text-amber-400">
                                <StarSolidIcon className="w-3.5 h-3.5" />
                             </div>
                             <span className="text-xs font-bold text-slate-700">{product.rating}</span>
                             <span className="text-[10px] text-gray-400">({product.reviews} ريفيو)</span>
                          </div>
                          
                          {/* Category */}
                          <div className="text-[10px] text-gray-500 mb-1 font-medium bg-gray-50 self-start px-2 py-0.5 rounded-md">
                            {CATEGORIES.find(c => c.id === product.category)?.name || product.category}
                          </div>

                          {/* Title */}
                          <Link href={`/store/products/${product.id}`} className="mb-2">
                            <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-amber-600 transition-colors line-clamp-2 min-h-[2.5em]">
                              {product.name}
                            </h3>
                          </Link>
                          
                          {/* Price */}
                          <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex flex-col">
                              {product.oldPrice && product.oldPrice > product.price && (
                                <span className="text-xs text-gray-400 line-through mb-0.5 block">
                                  {product.oldPrice.toLocaleString()} ج.م
                                </span>
                              )}
                              <span className={`text-slate-900 font-black text-lg ${product.oldPrice ? 'text-red-600' : ''}`}>
                                {product.price.toLocaleString()} <span className="text-[10px] font-medium text-gray-400">ج.م</span>
                              </span>
                            </div>
                            
                            {/* Add to Cart */}
                            <button 
                              onClick={(e) => {
                                e.preventDefault()
                                handleQuickAddToCart(product)
                              }}
                              className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-amber-400 hover:text-slate-900 transition-all shadow-lg hover:shadow-amber-500/20 hover:scale-105 active:scale-95"
                              title="إضافة للسلة"
                            >
                              <ShoppingBagIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl border border-dashed border-gray-200"
                  >
                    <ShoppingBagIcon className="w-16 h-16 text-gray-200 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">لا توجد منتجات مطابقة</h3>
                    <p className="text-gray-500 mb-6">جرب تغيير معايير البحث أو الفلاتر</p>
                    <button
                       onClick={resetFilters}
                       className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors"
                    >
                      عرض كل المنتجات
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pagination (Styled) */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-amber-500 hover:text-amber-600 disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all font-bold"
                >
                  <ArrowLongLeftIcon className="w-5 h-5 rotate-180" />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                      currentPage === i + 1
                        ? 'bg-slate-900 text-amber-400 shadow-lg scale-110'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-amber-500 hover:text-amber-600 disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all font-bold"
                >
                  <ArrowLongLeftIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-900 text-white">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <AdjustmentsHorizontalIcon className="w-5 h-5" />
                  تصنيف وتصفية
                </h2>
                <button onClick={() => setMobileFiltersOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* Mobile Categories */}
                <div>
                  <h3 className="font-bold text-slate-900 mb-4">التصنيفات</h3>
                  <div className="space-y-2">
                    {CATEGORIES.map(category => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id)
                          setMobileFiltersOpen(false)
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                          selectedCategory === category.id
                            ? 'bg-amber-50 text-amber-700 font-bold border border-amber-200'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                       <span>{category.name}</span>
                       {selectedCategory === category.id && <CheckCircleIcon className="w-5 h-5" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Reset */}
                <button
                  onClick={() => {
                    resetFilters()
                    setMobileFiltersOpen(false)
                  }}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-colors"
                >
                  إعادة تعيين الكل
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 left-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-slate-900 transition-colors backdrop-blur-sm"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              {/* Image Section */}
              <div className="md:w-1/2 relative min-h-[300px] md:min-h-[500px] bg-gray-50">
                <Image
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  fill
                  className="object-cover"
                />
                {quickViewProduct.featured && (
                  <span className="absolute top-4 right-4 bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10">
                    مميز
                  </span>
                )}
              </div>

              {/* Details Section */}
              <div className="md:w-1/2 p-8 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-amber-400">
                     {[...Array(5)].map((_, i) => (
                       <StarSolidIcon key={i} className={`w-4 h-4 ${i < Math.floor(quickViewProduct.rating) ? 'text-amber-400' : 'text-gray-200'}`} />
                     ))}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{quickViewProduct.rating}</span>
                  <span className="text-sm text-gray-500">({quickViewProduct.reviews} تقييم)</span>
                </div>

                <div className="text-sm font-bold text-amber-600 mb-2 uppercase tracking-wide">
                  {CATEGORIES.find(c => c.id === quickViewProduct.category)?.name || quickViewProduct.category}
                </div>

                <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
                  {quickViewProduct.name}
                </h2>

                <div className="mb-6">
                   {quickViewProduct.oldPrice && quickViewProduct.oldPrice > quickViewProduct.price && (
                      <div className="text-lg text-gray-400 line-through font-medium mb-1">
                        {quickViewProduct.oldPrice.toLocaleString()} ج.م
                      </div>
                   )}
                   <div className="flex items-center gap-3">
                     <span className={`text-4xl font-black text-slate-900 ${quickViewProduct.oldPrice ? 'text-red-600' : ''}`}>
                       {quickViewProduct.price.toLocaleString()}
                     </span>
                     <span className="text-lg text-gray-500 font-medium">جنيه مصري</span>
                     {quickViewProduct.oldPrice && (
                       <span className="bg-rose-100 text-rose-600 text-sm font-bold px-3 py-1 rounded-full">
                         وفر {Math.round(((quickViewProduct.oldPrice - quickViewProduct.price) / quickViewProduct.oldPrice) * 100)}%
                       </span>
                     )}
                   </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-8">
                  هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة. لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى.
                </p>
                
                {/* Stock Status */}
                <div className="mb-8 p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                  <span className="font-bold text-slate-900">حالة التوفر:</span>
                  {quickViewProduct.stock > 0 ? (
                    <span className={`font-bold ${quickViewProduct.stock <= 5 ? 'text-orange-500' : 'text-green-600'}`}>
                       {quickViewProduct.stock <= 5 ? `متبقي ${quickViewProduct.stock} فقط - اطلب الآن!` : 'متوفر في المخزون'}
                    </span>
                  ) : (
                    <span className="text-red-500 font-bold">نفذت الكمية</span>
                  )}
                </div>

                <div className="mt-auto space-y-3">
                  <button
                    onClick={() => {
                        handleQuickAddToCart(quickViewProduct)
                        setQuickViewProduct(null)
                    }}
                    disabled={quickViewProduct.stock === 0}
                    className="w-full bg-slate-900 text-white hover:bg-slate-800 disabled:bg-gray-300 disabled:cursor-not-allowed py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
                  >
                    <ShoppingBagIcon className="w-6 h-6" />
                    <span>{quickViewProduct.stock === 0 ? 'نفذت الكمية' : 'إضافة إلى السلة'}</span>
                  </button>
                  
                  <Link
                    href={`/store/products/${quickViewProduct.id}`}
                    className="w-full bg-white border-2 border-slate-900 text-slate-900 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                  >
                    عرض التفاصيل الكاملة
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  )
}

function CheckCircleIcon(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
