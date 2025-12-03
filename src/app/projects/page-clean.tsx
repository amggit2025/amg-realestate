'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
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

export default function ProjectsPage() {
  // حالات البيانات والتحميل
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({})

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
        
        // Initialize image loading states
        const loadingStates: Record<string, boolean> = {}
        data.data.forEach((project: Project) => {
          loadingStates[project.id] = true
        })
        setImageLoadingStates(loadingStates)
      } else {
        setError(data.message || 'خطأ في جلب المشاريع')
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError('خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  const handleImageLoad = (projectId: string) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [projectId]: false
    }))
  }

  // Format price range
  const formatPrice = (project: Project): string => {
    const formatCurrency = (price: string, currency: string = 'EGP') => {
      const numPrice = parseFloat(price)
      if (numPrice >= 1000000) {
        return `${(numPrice / 1000000).toFixed(1)} مليون ${currency === 'EGP' ? 'ج.م' : currency}`
      }
      return `${numPrice.toLocaleString()} ${currency === 'EGP' ? 'ج.م' : currency}`
    }

    if (project.minPrice && project.maxPrice) {
      return `يبدأ من ${formatCurrency(project.minPrice, project.currency)} إلى ${formatCurrency(project.maxPrice, project.currency)}`
    } else if (project.price) {
      return `يبدأ من ${formatCurrency(project.price, project.currency)}`
    }
    return 'السعر عند الاستفسار'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              مشاريعنا العقارية
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              استكشف مجموعة متميزة من المشاريع العقارية الحديثة والفاخرة في أفضل المناطق
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* Projects Grid */}
          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {projects.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <BuildingOfficeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">لا توجد مشاريع متاحة حاليًا</p>
                </div>
              ) : (
                projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
                  >
                    {/* Project Image */}
                    <div className="relative h-64 overflow-hidden">
                      {imageLoadingStates[project.id] && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onLoad={() => handleImageLoad(project.id)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Featured Badge */}
                      {project.featured && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                          ⭐ مميز
                        </div>
                      )}
                    </div>

                    {/* Project Content */}
                    <div className="p-6">
                      {/* Project Title & Location */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </h3>
                        <div className="flex items-center text-gray-600">
                          <MapPinIcon className="w-4 h-4 ml-1 flex-shrink-0" />
                          <span className="text-sm">{project.location}</span>
                        </div>
                      </div>

                      {/* Project Details */}
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <HomeIcon className="w-4 h-4 ml-2 flex-shrink-0" />
                          <span>{project.bedrooms} غرف</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <BuildingOfficeIcon className="w-4 h-4 ml-2 flex-shrink-0" />
                          <span>{project.area} م²</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-center text-blue-600 font-bold">
                          <CurrencyDollarIcon className="w-5 h-5 ml-1 flex-shrink-0" />
                          <span className="text-lg">{formatPrice(project)}</span>
                        </div>
                      </div>

                      {/* Features */}
                      {project.features && project.features.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {project.features.slice(0, 2).map((feature, idx) => (
                              <span
                                key={idx}
                                className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium"
                              >
                                {feature}
                              </span>
                            ))}
                            {project.features.length > 2 && (
                              <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                                +{project.features.length - 2} المزيد
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Developer & Delivery */}
                      <div className="text-sm text-gray-600 mb-4 space-y-1">
                        <p><span className="font-medium">المطور:</span> {project.developer}</p>
                        {project.deliveryDate && (
                          <p><span className="font-medium">التسليم:</span> {project.deliveryDate}</p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link
                          href={`/projects/${project.id}`}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-center text-sm font-semibold shadow-md hover:shadow-lg"
                        >
                          عرض التفاصيل
                        </Link>
                        <button className="p-2 border border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors group/btn">
                          <PhoneIcon className="w-5 h-5" />
                        </button>
                        <button className="p-2 border border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors group/btn">
                          <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
