'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useRef, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ImageLoader } from '@/components/ui'
import { 
  MapPin, 
  BedDouble, 
  Maximize, 
  ArrowRight, 
  ChevronLeft,
  ChevronRight,
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
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const cardWidth = container.firstElementChild?.clientWidth || 0
      const gap = 24 // gap-6 is 1.5rem = 24px
      const scrollAmount = cardWidth + gap
      
      const currentScroll = container.scrollLeft
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      })
    }
  }

  if (loading) {
    return (
      <div className="flex gap-6 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="min-w-[350px] md:min-w-[400px] bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 h-[500px] animate-pulse">
            <div className="h-80 bg-gray-200" />
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
    <div className="relative group/container md:px-16">
      {/* Navigation Buttons */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-4 rounded-full shadow-xl text-gray-800 hover:bg-blue-600 hover:text-white transition-all duration-300 opacity-0 group-hover/container:opacity-100 translate-x-4 group-hover/container:translate-x-0 disabled:opacity-0 hidden md:block border border-gray-100"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-4 rounded-full shadow-xl text-gray-800 hover:bg-blue-600 hover:text-white transition-all duration-300 opacity-0 group-hover/container:opacity-100 -translate-x-4 group-hover/container:translate-x-0 disabled:opacity-0 hidden md:block border border-gray-100"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-12"
        style={{ scrollBehavior: 'smooth' }}
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="min-w-[85%] md:min-w-[calc(33.333%-16px)] snap-center group relative h-[420px] rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
          >
            <Link href={`/projects/${project.id}`} className="block h-full w-full">
              {/* Image Background */}
              <div className="absolute inset-0">
                <ImageLoader isLoading={imageLoadingStates[project.id]} />
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  onLoad={() => handleImageLoad(project.id)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity duration-300" />
              </div>

              {/* Top Badges */}
              <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
                <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">
                  {project.type}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-sm ${
                  project.status === 'متاح' ? 'bg-green-500' : 'bg-amber-500'
                }`}>
                  {project.status}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
                    {project.title}
                  </h3>
                  <div className="flex items-center text-gray-100 text-sm font-medium drop-shadow-md">
                    <MapPin className="w-4 h-4 ml-1 text-blue-400" />
                    {project.location}
                  </div>
                </div>

                {/* Features */}
                <div className="flex items-center gap-4 mb-6 text-sm text-gray-200 border-t border-white/20 pt-4 drop-shadow-md">
                  {project.bedrooms && (
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-blue-400" />
                      <span>{project.bedrooms} غرف</span>
                    </div>
                  )}
                  {project.area && (
                    <div className="flex items-center gap-2">
                      <Maximize className="w-4 h-4 text-blue-400" />
                      <span>{project.area} م²</span>
                    </div>
                  )}
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-300 mb-1 font-medium drop-shadow-md">يبدأ من</p>
                    <p className="text-xl font-bold text-white drop-shadow-lg">
                      {formatPrice(project)} <span className="text-xs font-normal text-gray-300">{project.currency || 'EGP'}</span>
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-600/30 border border-white/10">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default memo(FeaturedProjects)
