'use client'

export const dynamic = 'force-dynamic'

import { logger } from '@/lib/logger'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  MapPinIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
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

// تم إزالة خيارات الفلاتر لتبسيط الواجهة

export default function ProjectsPage() {
  // Get search parameters from URL
  const searchParams = useSearchParams()
  const urlLocation = searchParams?.get('location') || ''
  const urlType = searchParams?.get('type') || ''
  
  // حالات البيانات والتحميل
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // تم إزالة حالات البحث والفلترة لتبسيط الواجهة
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({})

  // Filter projects based on URL parameters
  const filteredProjects = useMemo(() => {
    let filtered = projects
    
    // Filter by location
    if (urlLocation) {
      filtered = filtered.filter(project => 
        project.location.toLowerCase().includes(urlLocation.toLowerCase())
      )
    }
    
    // Filter by type
    if (urlType) {
      filtered = filtered.filter(project => 
        project.type === urlType
      )
    }
    
    return filtered
  }, [projects, urlLocation, urlType])

  // جلب البيانات من API
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
        // Initialize loading states for images
        const loadingStates = data.data.reduce((acc: any, project: Project) => ({ 
          ...acc, 
          [project.id]: true 
        }), {})
        setImageLoadingStates(loadingStates)
      } else {
        setError(data.message || 'خطأ في جلب المشاريع')
      }
    } catch (error) {
      logger.error('Error fetching projects:', error)
      setError('خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  const handleImageLoad = (projectId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [projectId]: false }))
  }

  // تم إزالة تصفية البحث لتبسيط الواجهة

  return (
    <div className="min-h-screen pt-20 pb-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mb-16 rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-blue-900/90">
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 to-blue-900/85"></div>
          </div>
          
          <div className="relative text-center py-24 px-6">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              مشاريعنا المميزة
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8 drop-shadow-md">
              اكتشف مجموعة متنوعة من مشاريعنا العقارية المتميزة في أفضل المواقع
            </p>
          </div>
        </motion.div>



        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">جاري تحميل المشاريع...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchProjects}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          </motion.div>
        )}

        {/* Search Info Banner */}
        {(urlLocation || urlType) && !loading && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-blue-800">
              <strong>نتائج البحث:</strong>
              {urlLocation && ` الموقع: "${urlLocation}"`}
              {urlType && ` نوع العقار: "${urlType}"`}
              <span className="mr-2">({filteredProjects.length} نتيجة)</span>
            </p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <BuildingOfficeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  {urlLocation || urlType
                    ? 'لا توجد مشاريع تطابق البحث'
                    : 'لا توجد مشاريع متاحة حاليًا'}
                </p>
              </div>
            ) : (
              filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="relative h-64 overflow-hidden">
                <ImageLoader 
                  isLoading={imageLoadingStates[project.id]} 
                  className="rounded-t-2xl"
                />
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  onLoad={() => handleImageLoad(project.id)}
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {project.type}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {project.title}
                </h3>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPinIcon className="w-4 h-4 ml-1" />
                  <span className="text-sm">{project.location}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <HomeIcon className="w-4 h-4 ml-1 text-blue-600" />
                    <span>{project.bedrooms} غرف</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <BuildingOfficeIcon className="w-4 h-4 ml-1 text-green-600" />
                    <span>{project.area} م²</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-lg font-bold text-blue-600">
                    {project.minPrice && project.maxPrice 
                      ? `يبدأ من ${parseFloat(project.minPrice).toLocaleString()} إلى ${parseFloat(project.maxPrice).toLocaleString()} ${project.currency || 'ج.م'}`
                      : project.minPrice 
                        ? `يبدأ من ${parseFloat(project.minPrice).toLocaleString()} ${project.currency || 'ج.م'}`
                        : project.price 
                          ? `${parseInt(project.price).toLocaleString()} ج.م`
                          : 'السعر غير محدد'}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-full text-center transition-all duration-300 text-sm font-semibold"
                  >
                    التفاصيل
                  </Link>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all duration-300 text-sm font-semibold">
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    واتساب
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all duration-300 text-sm font-semibold">
                    <PhoneIcon className="w-4 h-4" />
                    اتصال
                  </button>
                </div>
              </div>
            </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
