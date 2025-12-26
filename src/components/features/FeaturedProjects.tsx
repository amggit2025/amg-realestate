'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ImageLoader } from '@/components/ui'
import { 
  MapPin, 
  BedDouble, 
  Maximize, 
  ArrowRight, 
  Star, 
  CheckCircle2,
  Building2
} from 'lucide-react'

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

function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchFeaturedProjects()
  }, [])

  const fetchFeaturedProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects/featured')
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response')
      }
      
      const data = await response.json()
      setProjects(data.data || [])
    } catch (err) {
      console.error('Error fetching featured projects:', err)
      setError('حدث خطأ أثناء تحميل المشاريع')
    } finally {
      setLoading(false)
    }
  }

  const handleImageLoad = (id: string) => {
    setImageLoadingStates(prev => ({ ...prev, [id]: false }))
  }

  const formatPrice = (project: Project) => {
    if (project.minPrice && project.maxPrice) {
      return `${Number(project.minPrice).toLocaleString()} - ${Number(project.maxPrice).toLocaleString()}`
    }
    return Number(project.price).toLocaleString()
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 h-[400px] animate-pulse">
            <div className="h-64 bg-gray-200" />
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) return null

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">لا توجد مشاريع مميزة حالياً</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col"
        >
          {/* Image Container */}
          <div className="relative h-72 overflow-hidden">
            <ImageLoader isLoading={imageLoadingStates[project.id]} />
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              onLoad={() => handleImageLoad(project.id)}
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-white/90 backdrop-blur-md text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {project.type}
              </span>
            </div>

            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
                project.status === 'متاح' ? 'bg-green-500' : 'bg-amber-500'
              }`}>
                {project.status}
              </span>
            </div>

            {/* Price Tag */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg">
              <p className="text-blue-600 font-bold text-sm">
                {formatPrice(project)} <span className="text-xs font-normal text-gray-500">{project.currency || 'EGP'}</span>
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {project.title}
              </h3>
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="w-4 h-4 ml-1" />
                {project.location}
              </div>
            </div>

            {/* Features */}
            <div className="flex items-center gap-4 mb-6 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
              {project.bedrooms && (
                <div className="flex items-center gap-1.5">
                  <BedDouble className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">{project.bedrooms} غرف</span>
                </div>
              )}
              {project.area && (
                <div className="flex items-center gap-1.5 border-r border-gray-200 pr-4 mr-4">
                  <Maximize className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">{project.area} م²</span>
                </div>
              )}
            </div>

            <div className="mt-auto">
              <Link 
                href={`/projects/${project.id}`}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors group/btn"
              >
                عرض التفاصيل
                <ArrowRight className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default memo(FeaturedProjects)
