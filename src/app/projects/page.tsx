'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPinIcon, 
  HomeIcon, 
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { ImageLoader } from '@/components/ui'

// TypeScript interfaces
interface Project {
  id: string
  title: string
  location: string
  type: string
  price: string
  minPrice?: string
  maxPrice?: string
  currency?: string
  bedrooms: number
  area: number
  description: string
  image: string
  features: string[]
  deliveryDate: string
  developer: string
  hasFullDetails: boolean
  featured?: boolean
}

const LOCATIONS = ['الكل', 'العاصمة الإدارية', 'القاهرة الجديدة', 'الساحل الشمالي', 'العلمين الجديدة', 'الشيخ زايد']
const TYPES = ['الكل', 'سكني', 'تجارى', 'إداري', 'طبي', 'ساحلي']
const PRICES = ['الكل', 'أقل من 3 مليون', '3 - 5 مليون', '5 - 10 مليون', 'أكثر من 10 مليون']

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('الكل')
  const [selectedType, setSelectedType] = useState('الكل')
  const [selectedPrice, setSelectedPrice] = useState('الكل')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/projects`)
      const data = await response.json()
      if (data.success) {
        setProjects(data.data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.location.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesLocation = selectedLocation === 'الكل' || project.location.includes(selectedLocation)
      const matchesType = selectedType === 'الكل' || project.type === selectedType
      
      let matchesPrice = true
      const price = parseFloat(project.price)
      if (selectedPrice === 'أقل من 3 مليون') matchesPrice = price < 3000000
      if (selectedPrice === '3 - 5 مليون') matchesPrice = price >= 3000000 && price <= 5000000
      if (selectedPrice === '5 - 10 مليون') matchesPrice = price > 5000000 && price <= 10000000
      if (selectedPrice === 'أكثر من 10 مليون') matchesPrice = price > 10000000

      return matchesSearch && matchesLocation && matchesType && matchesPrice
    })
  }, [projects, searchQuery, selectedLocation, selectedType, selectedPrice])

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[500px] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2070&q=80"
            alt="Projects Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-gray-50/90" />
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 font-heading tracking-tight leading-tight">
              اكتشف <span className="text-primary-400">مستقبلك</span> العقاري
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed font-light">
              نقدم لك مجموعة مختارة من أرقى المشاريع العقارية في مصر، مصممة لتلبي طموحاتك في السكن والاستثمار
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث عن مشروع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
              />
            </div>

            {/* Location Filter */}
            <div className="relative">
              <MapPinIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
              >
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <BuildingOfficeIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
              >
                {TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="relative">
              <CurrencyDollarIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
              >
                {PRICES.map(price => (
                  <option key={price} value={price}>{price}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            نتائج البحث ({filteredProjects.length})
          </h2>
          <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Squares2X2Icon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <ListBulletIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative w-20 h-20 mb-6">
              <motion.div
                className="absolute inset-0 border-4 border-gray-100 rounded-full"
              />
              <motion.div
                className="absolute inset-0 border-4 border-t-primary-600 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-4 border-4 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <motion.p
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
              className="text-gray-500 font-medium text-lg"
            >
              جاري تحميل المشاريع...
            </motion.p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6"}>
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link href={`/projects/${project.id}`}>
                    <div className={`group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 ${viewMode === 'list' ? 'flex flex-col md:flex-row h-auto md:h-64' : 'h-full flex flex-col'}`}>
                      {/* Image */}
                      <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-full md:w-2/5 h-64 md:h-full' : 'aspect-[4/3]'}`}>
                        <ImageLoader
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                        
                        {/* Badges */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm bg-primary-600/90">
                            {project.type}
                          </span>
                          {project.featured && (
                            <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm bg-amber-500/90">
                              مميز
                            </span>
                          )}
                        </div>

                        {/* Price on Image (Grid View) */}
                        {viewMode === 'grid' && (
                          <div className="absolute bottom-4 right-4 text-white">
                            <p className="text-xs opacity-90 mb-1">يبدأ من</p>
                            <p className="text-xl font-bold">{parseInt(project.price).toLocaleString()} {project.currency}</p>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className={`p-6 flex flex-col ${viewMode === 'list' ? 'w-full md:w-3/5 justify-center' : 'flex-1'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                            {project.title}
                          </h3>
                        </div>
                        
                        <div className="flex items-center text-gray-500 text-sm mb-4">
                          <MapPinIcon className="w-4 h-4 ml-1" />
                          {project.location}
                        </div>

                        {viewMode === 'list' && (
                          <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                            {project.description}
                          </p>
                        )}

                        <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100 mt-auto">
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">المساحة</p>
                            <p className="font-semibold text-gray-900">{project.area} م²</p>
                          </div>
                          <div className="text-center border-r border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">غرف</p>
                            <p className="font-semibold text-gray-900">{project.bedrooms}</p>
                          </div>
                          <div className="text-center border-r border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">الاستلام</p>
                            <p className="font-semibold text-gray-900">{project.deliveryDate}</p>
                          </div>
                        </div>

                        {viewMode === 'grid' && (
                          <div className="mt-2">
                            <span className="flex items-center justify-center w-full bg-gray-900 text-white py-3 rounded-xl font-semibold group-hover:bg-primary-600 transition-all duration-300 shadow-md group-hover:shadow-lg">
                              عرض التفاصيل
                              <svg className="w-4 h-4 mr-2 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </span>
                          </div>
                        )}

                        {viewMode === 'list' && (
                          <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-100">
                            <div className="text-primary-600 font-bold text-xl">
                              {parseInt(project.price).toLocaleString()} {project.currency}
                            </div>
                            <div className="flex gap-2">
                              <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors">
                                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                              </button>
                              <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                <PhoneIcon className="w-5 h-5" />
                              </button>
                              <span className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm font-semibold group-hover:bg-primary-600 group-hover:text-white transition-colors flex items-center">
                                التفاصيل
                                <svg className="w-4 h-4 mr-1 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-500">جرب تغيير خيارات البحث أو الفلترة</p>
            <button 
              onClick={() => {
                setSearchQuery('')
                setSelectedLocation('الكل')
                setSelectedType('الكل')
                setSelectedPrice('الكل')
              }}
              className="mt-6 text-primary-600 font-semibold hover:underline"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
