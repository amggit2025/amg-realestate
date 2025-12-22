'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, memo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ImageLoader } from '@/components/ui'

// TypeScript interface for project
interface Project {
  id: string
  title: string
  location: string
  type: string
  price: string
  minPrice?: string
  maxPrice?: string
  currency?: string
  bedrooms?: number
  area?: number
  description: string
  image: string
  features: string[]
  deliveryDate: string
  developer: string
  hasFullDetails: boolean
  featured?: boolean
  status: string
}

// بيانات احتياطية في حالة عدم توفر مشاريع من قاعدة البيانات
const getFallbackProjects = (): Project[] => [
  {
    id: 'fallback-1',
    title: 'كمبوند النرجس الجديدة',
    location: 'العاصمة الإدارية الجديدة',
    type: 'شقق سكنية',
    price: '2,500,000',
    currency: 'EGP',
    bedrooms: 3,
    area: 150,
    description: 'كمبوند سكني راقي في قلب العاصمة الإدارية الجديدة',
    image: '/images/placeholder.jpg',
    features: ['مسابح', 'حدائق', 'أمن وحراسة', 'نادي صحي'],
    deliveryDate: '2025',
    developer: 'AMG للتطوير العقاري',
    hasFullDetails: true,
    featured: true,
    status: 'متاح'
  },
  {
    id: 'fallback-2', 
    title: 'فيلا النخيل',
    location: 'الشيخ زايد',
    type: 'فيلات',
    price: '4,200,000',
    currency: 'EGP',
    bedrooms: 4,
    area: 300,
    description: 'فيلا فاخرة بتصميم عصري في الشيخ زايد',
    image: '/images/placeholder.jpg',
    features: ['حديقة خاصة', 'جراج', 'تكييف مركزي'],
    deliveryDate: '2024',
    developer: 'AMG للتطوير العقاري',
    hasFullDetails: true,
    featured: true,
    status: 'متاح'
  }
]

function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({})

  // جلب المشاريع المميزة من API
  useEffect(() => {
    fetchFeaturedProjects()
  }, [])

  const fetchFeaturedProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects/featured')
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response is not JSON:', await response.text())
        throw new Error('Server returned non-JSON response')
      }
      
      const data = await response.json()

      if (data.success) {
        setProjects(data.data || [])
        // Initialize loading states for images
        const loadingStates = (data.data || []).reduce((acc: any, project: Project) => ({ 
          ...acc, 
          [project.id]: true 
        }), {})
        setImageLoadingStates(loadingStates)
      } else {
        setError(data.message || 'خطأ في جلب المشاريع')
        setProjects([])
      }
    } catch (error) {
      console.error('Error fetching featured projects:', error)
      setError('خطأ في الاتصال بالخادم')
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleImageLoad = (projectId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [projectId]: false }))
  }

  // Function to format price with range if available
  const formatPrice = (project: Project) => {
    if (project.minPrice && project.maxPrice && project.minPrice !== project.maxPrice) {
      return `يبدأ من ${parseInt(project.minPrice).toLocaleString()} إلى ${parseInt(project.maxPrice).toLocaleString()}`
    }
    return `${parseInt(project.price).toLocaleString()}`
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            مشاريعنا المميزة
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            اكتشف أفضل
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> مشاريعنا</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            مجموعة منتقاة من أجود مشاريعنا العقارية المميزة
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">جاري تحميل المشاريع المميزة...</p>
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
                onClick={fetchFeaturedProjects}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          </motion.div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {projects.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0V9a2 2 0 012-2h2a2 2 0 012 2v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد مشاريع مميزة</h3>
                <p className="text-gray-500">لم يتم تحديد أي مشاريع مميزة لعرضها في الصفحة الرئيسية</p>
              </div>
            ) : (
              projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100/50 backdrop-blur-sm"
                >
                  {/* Project Image with Enhanced Design */}
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    <ImageLoader 
                      isLoading={imageLoadingStates[project.id]} 
                      className="rounded-t-2xl"
                    />
                    <Image
                      src={project.image}
                      alt={project.title}
                      onLoad={() => handleImageLoad(project.id)}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-100 group-hover:brightness-105"
                    />
                    
                    {/* Elegant Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-500" />
                    
                    {/* Floating Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-xl backdrop-blur-md border ${
                        project.status === 'متاح' 
                          ? 'bg-emerald-500/95 text-white border-emerald-300/30' 
                          : 'bg-amber-500/95 text-white border-amber-300/30'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    {/* Type Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600/95 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl border border-blue-400/30">
                        {project.type}
                      </span>
                    </div>

                    {/* Featured Badge - Always Visible */}
                    <div className="absolute bottom-4 right-4">
                      <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-1.5 rounded-full text-xs font-bold shadow-xl">
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        مميز
                      </div>
                    </div>

                    {/* Price Display on Image */}
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-white/95 backdrop-blur-md text-gray-900 px-3 py-2 rounded-xl shadow-xl border border-white/20">
                        <div className="text-sm font-bold text-blue-600">
                          {formatPrice(project)}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          {project.currency || 'جنيه مصري'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compact Info Section */}
                  <div className="p-5">
                    {/* Title & Location */}
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-900 mb-1.5 truncate group-hover:text-blue-600 transition-colors duration-300">
                        {project.title}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm">
                        <svg className="w-4 h-4 ml-1.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium truncate">{project.location}</span>
                      </div>
                    </div>

                    {/* Compact Property Details */}
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      {project.area && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          <span className="font-semibold">{project.area}م²</span>
                        </div>
                      )}
                      {project.bedrooms && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          </svg>
                          <span className="font-semibold">{project.bedrooms} غرف</span>
                        </div>
                      )}
                    </div>

                    {/* Modern CTA Button */}
                    <Link
                      href={`/projects/${project.id}`}
                      className="group/btn flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                    >
                      <span>عرض التفاصيل</span>
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
          >
            <span>عرض جميع المشاريع</span>
            <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors duration-300">
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default memo(FeaturedProjects)
