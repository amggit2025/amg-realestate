'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PortfolioGridSkeleton, SearchLoadingState } from '@/components/ui'
import { 
  HomeIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
  CubeTransparentIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  CalendarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
// import { portfolioProjects, portfolioCategories } from '@/lib/portfolio-data' // مُعطل مؤقتاً

// نوع البيانات للعمل
interface PortfolioProject {
  id: string
  slug: string
  title: string
  category: string
  image: string
  images: string[]
  description: string
  completionDate: string
  location: string
  client: string
  duration: string
  area: string
  budget: string
  features: string[]
  likes: number
  views: number
  rating: number
  status: string
  tags: string[]
  fullDescription?: string
  challenges?: string[]
  solutions?: string[]
  technologies?: string[]
  teamMembers?: string[]
  clientTestimonial?: {
    comment: string
    rating: number
    clientName: string
    clientTitle: string
  }
  featured?: boolean
}

// تصنيفات معرض الأعمال
const portfolioCategories = [
  { 
    id: 'construction', 
    name: 'التشييد والبناء', 
    description: 'مشاريع البناء والإنشاءات السكنية والتجارية',
    color: 'orange',
    icon: WrenchScrewdriverIcon
  },
  { 
    id: 'finishing', 
    name: 'التشطيبات الداخلية', 
    description: 'أعمال التشطيب والديكور الداخلي',
    color: 'purple',
    icon: PaintBrushIcon
  },
  { 
    id: 'furniture', 
    name: 'الأثاث والديكور', 
    description: 'تصميم وتنفيذ الأثاث المخصص',
    color: 'red',
    icon: CubeTransparentIcon
  },
  { 
    id: 'kitchens', 
    name: 'المطابخ', 
    description: 'تصميم وتنفيذ المطابخ العصرية',
    color: 'green',
    icon: BuildingOffice2Icon
  }
]

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [isSearching, setIsSearching] = useState(false)
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(true)

  // تحميل البيانات من API
  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/portfolio')
        const data = await response.json()
        
        if (data.success) {
          setPortfolioProjects(data.portfolioItems || [])
        } else {
          console.error('خطأ في تحميل الأعمال:', data.message)
        }
      } catch (error) {
        console.error('خطأ في الاتصال:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolioItems()
  }, [])

  // Search with debounce
  useEffect(() => {
    if (searchTerm) {
      setIsSearching(true)
      const debounceTimer = setTimeout(() => {
        setIsSearching(false)
      }, 800)
      return () => clearTimeout(debounceTimer)
    }
  }, [searchTerm])

  const filteredProjects = useMemo(() => {
    return portfolioProjects
      .filter(project => {
        const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
        const matchesSearch = searchTerm === '' || 
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.location?.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
      })
      .sort((a, b) => {
        switch(sortBy) {
          case 'recent':
            return new Date(b.completionDate || '').getTime() - new Date(a.completionDate || '').getTime()
          case 'popular':
            return b.likes - a.likes
          case 'views':
            return b.views - a.views
          case 'rating':
            return b.rating - a.rating
          default:
            return new Date(b.completionDate || '').getTime() - new Date(a.completionDate || '').getTime()
        }
      })
  }, [portfolioProjects, selectedCategory, searchTerm, sortBy])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل الأعمال...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section with Background Image */}
        <section className="relative py-16 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200')`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-blue-800/80 to-purple-900/75"></div>
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 to-transparent rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/10 to-transparent rounded-full -ml-24 -mb-24"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              {/* Title Section */}
              <div className="mb-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full mb-6"
                >
                  <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span className="font-semibold">أعمال مميزة ومبدعة</span>
                </motion.div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                  معرض 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300"> أعمالنا</span>
                </h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-95 leading-relaxed">
                  استكشف مجموعة متنوعة من مشاريعنا المتميزة في مختلف مجالات العقارات والإنشاءات
                </p>
              </div>

              {/* Stats Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              >
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0V9a2 2 0 012-2h2a2 2 0 012 2v12" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-3xl font-black mb-1">{portfolioProjects.length}+</div>
                  <div className="text-white/90 font-semibold">مشروع مكتمل</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="text-3xl font-black mb-1">4.8/5</div>
                  <div className="text-white/90 font-semibold">تقييم العملاء</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-3xl font-black mb-1">100+</div>
                  <div className="text-white/90 font-semibold">عميل راضي</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                تصفح المشاريع
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                تصفح حسب 
                <span className="text-blue-600"> الفئة</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                اختر الفئة التي تهمك لاستعراض المشاريع المتخصصة واكتشف تنوع أعمالنا
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              <button
                onClick={() => setSelectedCategory('all')}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-lg scale-105 border-2 border-white/30'
                    : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md hover:scale-105 border-2 border-transparent'
                }`}
              >
                <HomeIcon className={`w-5 h-5 ${selectedCategory === 'all' ? 'text-white' : ''}`} />
                <span className={`${selectedCategory === 'all' ? 'text-white font-bold' : ''}`}>
                  جميع المشاريع
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  selectedCategory === 'all' 
                    ? 'bg-white/30 text-white border border-white/50' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {portfolioProjects.length}
                </span>
              </button>

              {portfolioCategories.map((category) => {
                const projectCount = portfolioProjects.filter(p => p.category === category.id).length
                const IconComponent = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white shadow-lg scale-105 border-2 border-white/30'
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md hover:scale-105 border-2 border-transparent'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${selectedCategory === category.id ? 'text-white' : ''}`} />
                    <span className={`${selectedCategory === category.id ? 'text-white font-bold' : ''}`}>
                      {category.name}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      selectedCategory === category.id 
                        ? 'bg-white/30 text-white border border-white/50' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {projectCount}
                    </span>
                  </button>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="pb-8">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md w-full">
                  <input
                    type="text"
                    placeholder="ابحث في المشاريع..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-12 py-3 rounded-xl border-2 border-gray-300 text-gray-800 font-semibold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
                  />
                  <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full lg:w-auto">
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-3">
                    <label className="text-gray-700 font-bold whitespace-nowrap text-lg">ترتيب حسب:</label>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none px-4 py-3 pr-10 rounded-xl border-2 border-blue-200 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer min-w-[180px] hover:border-blue-300 transition-colors"
                      >
                        <option value="recent" className="font-semibold text-gray-800">الأحدث</option>
                        <option value="popular" className="font-semibold text-gray-800">الأكثر إعجاباً</option>
                        <option value="views" className="font-semibold text-gray-800">الأكثر مشاهدة</option>
                        <option value="rating" className="font-semibold text-gray-800">الأعلى تقييماً</option>
                      </select>
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Results Count */}
                  <div className="text-sm text-white bg-blue-600 font-bold px-4 py-3 rounded-xl whitespace-nowrap shadow-md">
                    {filteredProjects.length} مشروع
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            {isSearching ? (
              <SearchLoadingState />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link
                      href={`/portfolio/${project.slug}`}
                      className="group block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                    >
                      {/* Project Image */}
                      <div className="relative h-64 overflow-hidden">
                        {project.image || (project.images && project.images.length > 0) ? (
                          <Image
                            src={project.image || project.images[0]}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                            <div className="text-center text-white">
                              <div className="text-4xl mb-2">🏗️</div>
                              <div className="font-bold">{project.title}</div>
                              <div className="text-sm opacity-80 mt-1">
                                {portfolioCategories.find(cat => cat.id === project.category)?.name}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                          {portfolioCategories.find(cat => cat.id === project.category)?.name}
                        </div>
                      </div>
                      
                      {/* Project Info */}
                      <div className="p-6">
                        <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                          {project.description}
                        </p>
                        
                        {/* Quick Info */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPinIcon className="w-4 h-4 text-blue-500" />
                            <span>{project.location}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4 text-purple-500" />
                              <span>{project.completionDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-orange-500">•</span>
                              <span>{project.area}</span>
                            </div>
                          </div>
                        </div>

                        {/* Budget Badge */}
                        <div className="mb-4">
                          <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                            💰 {project.budget}
                          </span>
                        </div>

                        {/* Action Button */}
                        <div className="group-hover:bg-blue-600 group-hover:text-white bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-center font-medium transition-all duration-300">
                          عرض تفاصيل المشروع
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Empty State */}
            {filteredProjects.length === 0 && !isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">لا توجد مشاريع</h3>
                <p className="text-gray-600">لم يتم العثور على مشاريع تطابق معايير البحث الخاصة بك</p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }}
                  className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  مسح المرشحات
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Client Testimonials Section */}
        {filteredProjects.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  شهادات عملائنا
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  اكتشف ما يقوله عملاؤنا عن تجربتهم معنا
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    id: 1,
                    name: 'أحمد محمد',
                    title: 'مهندس معماري',
                    rating: 5,
                    comment: 'تجربة رائعة مع AMG Real Estate. فريق محترف وخدمة متميزة في كل التفاصيل.',
                    project: 'فيلا فاخرة'
                  },
                  {
                    id: 2,
                    name: 'سارة علي',
                    title: 'مديرة تسويق',
                    rating: 5,
                    comment: 'جودة عالية في التنفيذ والالتزام بالمواعيد. أنصح بالتعامل معهم دون تردد.',
                    project: 'تشطيب شقة'
                  },
                  {
                    id: 3,
                    name: 'محمد رضا',
                    title: 'رجل أعمال',
                    rating: 5,
                    comment: 'خدمة استثنائية وأسعار منافسة. تم تسليم المشروع في الوقت المحدد بأعلى جودة.',
                    project: 'مطبخ مودرن'
                  }
                ].map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIconSolid key={i} className="w-5 h-5 text-yellow-400" />
                      ))}
                    </div>

                    {/* Comment */}
                    <blockquote className="text-gray-700 leading-relaxed mb-6">
                      &ldquo;{testimonial.comment}&rdquo;
                    </blockquote>

                    {/* Client Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.title}</div>
                        <div className="text-xs text-blue-600 font-medium">{testimonial.project}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
  )
}
