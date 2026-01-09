'use client'

export const dynamic = 'force-dynamic'

import { useParams, notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { logger } from '@/lib/logger'
import { motion } from 'framer-motion'
import { 
  ArrowRightIcon, 
  MapPinIcon, 
  CalendarIcon, 
  UserIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  TagIcon,
  WrenchScrewdriverIcon,
  LightBulbIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

interface PortfolioItem {
  id: string
  slug: string
  title: string
  description: string
  fullDescription?: string
  category: string
  status: string
  location: string
  client?: string
  duration?: string
  area?: string
  budget?: string
  completionDate?: string
  mainImage: string
  images: { id: string; url: string; publicId?: string; alt: string }[]
  likes: number
  views: number
  rating: number
  features: string[]
  tags: string[]
  challenges: string[]
  solutions: string[]
  technologies: string[]
  teamMembers: string[]
  clientTestimonial?: string | { comment: string; clientName?: string; rating?: number }
  featured: boolean
  published: boolean
}

export default function PortfolioDetailPage() {
  const params = useParams()
  const [project, setProject] = useState<PortfolioItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/portfolio/${params.slug}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setProject(result.data)
          }
        }
      } catch (error) {
        logger.error('Error:', error)
      }
      setLoading(false)
    }

    if (params.slug) {
      fetchProject()
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل المشروع...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-36 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">المشروع غير موجود</h1>
          <Link href="/portfolio" className="text-orange-500 hover:underline">
            العودة لمعرض الأعمال
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section with Breadcrumb */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 pt-36 pb-16">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-white/80 mb-8">
            <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
            <ArrowRightIcon className="w-4 h-4" />
            <Link href="/portfolio" className="hover:text-white transition-colors">معرض الأعمال</Link>
            <ArrowRightIcon className="w-4 h-4" />
            <span className="text-white">{project.title}</span>
          </nav>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{project.title}</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">{project.description}</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Image Slider */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="relative">
                {/* Main Slider Container */}
                <div className="aspect-video relative bg-gray-200 overflow-hidden">
                  {project.images && project.images.length > 0 ? (
                    <>
                      {/* Current Image */}
                      <Image
                        src={project.images[selectedImageIndex]?.url || project.mainImage}
                        alt={project.images[selectedImageIndex]?.alt || project.title}
                        fill
                        className="object-cover transition-all duration-500"
                      />
                      
                      {/* Navigation Arrows */}
                      {project.images.length > 1 && (
                        <>
                          <button
                            onClick={() => setSelectedImageIndex(prev => 
                              prev > 0 ? prev - 1 : project.images.length - 1
                            )}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
                          >
                            <ChevronRightIcon className="w-6 h-6" />
                          </button>

                          <button
                            onClick={() => setSelectedImageIndex(prev => 
                              prev < project.images.length - 1 ? prev + 1 : 0
                            )}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
                          >
                            <ChevronLeftIcon className="w-6 h-6" />
                          </button>
                        </>
                      )}

                      {/* Image Counter */}
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {selectedImageIndex + 1} / {project.images.length}
                      </div>

                      {/* Fullscreen Button */}
                      <button
                        onClick={() => setIsGalleryOpen(true)}
                        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </button>

                    </>
                  ) : project.mainImage ? (
                    <Image
                      src={project.mainImage}
                      alt={project.title}
                      fill
                      className="object-cover"
                      onClick={() => setIsGalleryOpen(true)}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-xl">
                      لا توجد صورة متاحة
                    </div>
                  )}
                </div>
                
                {/* Dots Indicator */}
                {project.images && project.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {project.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === selectedImageIndex 
                            ? 'bg-white scale-125' 
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Thumbnail Strip */}
              {project.images && project.images.length > 1 && (
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {project.images.map((image, index) => (
                      image.url && (
                        <button
                          key={image.id} 
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-12 relative rounded-lg overflow-hidden transition-all duration-300 ${
                            index === selectedImageIndex 
                              ? 'ring-2 ring-orange-500 scale-105' 
                              : 'ring-1 ring-gray-200 hover:ring-orange-300'
                          }`}
                        >
                          <Image
                            src={image.url}
                            alt={image.alt || `${project.title} - صورة ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      )
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Project Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                وصف المشروع
              </h2>
              
              <div className="prose prose-lg max-w-none">
                {project.fullDescription ? (
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {project.fullDescription}
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed">{project.description}</p>
                )}
              </div>
            </motion.div>

            {/* Features Section */}
            {project.features && project.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                  مميزات المشروع
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Technologies Used */}
            {project.technologies && project.technologies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                  التقنيات المستخدمة
                </h2>
                
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index} 
                      className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Challenges & Solutions */}
            {((project.challenges && project.challenges.length > 0) || (project.solutions && project.solutions.length > 0)) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Challenges */}
                  {project.challenges && project.challenges.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <WrenchScrewdriverIcon className="w-6 h-6 text-red-500" />
                        التحديات
                      </h3>
                      
                      <div className="space-y-3">
                        {project.challenges.map((challenge, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 text-sm">{challenge}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Solutions */}
                  {project.solutions && project.solutions.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <LightBulbIcon className="w-6 h-6 text-green-500" />
                        الحلول
                      </h3>
                      
                      <div className="space-y-3">
                        {project.solutions.map((solution, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{solution}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                </div>
              </motion.div>
            )}

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
            
            {/* Project Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">معلومات المشروع</h3>
              
              <div className="space-y-4">
                
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">الحالة</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${{
                    'completed': 'bg-green-100 text-green-800',
                    'in-progress': 'bg-yellow-100 text-yellow-800', 
                    'planned': 'bg-blue-100 text-blue-800'
                  }[project.status] || 'bg-gray-100 text-gray-800'}`}>
                    {project.status === 'completed' ? 'مكتمل' : 
                     project.status === 'in-progress' ? 'قيد التنفيذ' : 
                     project.status === 'planned' ? 'مخطط' : project.status}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3">
                  <MapPinIcon className="w-5 h-5 text-orange-500" />
                  <div>
                    <span className="text-gray-600 text-sm">الموقع</span>
                    <div className="text-gray-900 font-medium">{project.location}</div>
                  </div>
                </div>

                {/* Client */}
                {project.client && (
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-5 h-5 text-orange-500" />
                    <div>
                      <span className="text-gray-600 text-sm">العميل</span>
                      <div className="text-gray-900 font-medium">{project.client}</div>
                    </div>
                  </div>
                )}

                {/* Duration */}
                {project.duration && (
                  <div className="flex items-center gap-3">
                    <ClockIcon className="w-5 h-5 text-orange-500" />
                    <div>
                      <span className="text-gray-600 text-sm">المدة</span>
                      <div className="text-gray-900 font-medium">{project.duration}</div>
                    </div>
                  </div>
                )}

                {/* Area */}
                {project.area && (
                  <div className="flex items-center gap-3">
                    <BuildingOfficeIcon className="w-5 h-5 text-orange-500" />
                    <div>
                      <span className="text-gray-600 text-sm">المساحة</span>
                      <div className="text-gray-900 font-medium">{project.area}</div>
                    </div>
                  </div>
                )}

                {/* Budget */}
                {project.budget && (
                  <div className="flex items-center gap-3">
                    <CurrencyDollarIcon className="w-5 h-5 text-orange-500" />
                    <div>
                      <span className="text-gray-600 text-sm">الميزانية</span>
                      <div className="text-gray-900 font-medium">{project.budget}</div>
                    </div>
                  </div>
                )}

                {/* Completion Date */}
                {project.completionDate && (
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-orange-500" />
                    <div>
                      <span className="text-gray-600 text-sm">سنة الإنجاز</span>
                      <div className="text-gray-900 font-medium">{project.completionDate}</div>
                    </div>
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-8 pt-6 border-t">
                <Link 
                  href="/contact" 
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                >
                  تواصل معنا
                </Link>

                <Link 
                  href="/portfolio" 
                  className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  العودة لمعرض الأعمال
                </Link>
              </div>
            </motion.div>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TagIcon className="w-5 h-5 text-orange-500" />
                  الكلمات المفتاحية
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Team Members */}
            {project.teamMembers && project.teamMembers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5 text-orange-500" />
                  فريق العمل
                </h3>
                
                <div className="space-y-2">
                  {project.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {member.charAt(0)}
                      </div>
                      <span className="text-gray-700">{member}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            </div>
          </div>
          
        </div>

        {/* Client Testimonial */}
        {project.clientTestimonial && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 mt-16 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-6">شهادة العميل</h2>
            
            <div className="max-w-3xl mx-auto">
              <div className="text-6xl text-white/30 mb-4">"</div>
              <p className="text-xl text-white/90 leading-relaxed italic mb-6">
                {typeof project.clientTestimonial === 'string' 
                  ? project.clientTestimonial 
                  : project.clientTestimonial.comment}
              </p>
              
              {/* Client Info */}
              {typeof project.clientTestimonial === 'object' && project.clientTestimonial.clientName && (
                <div className="text-white/80 mb-4">
                  - {project.clientTestimonial.clientName}
                </div>
              )}
              
              {/* Rating */}
              <div className="flex justify-center">
                {[...Array(5)].map((_, i) => {
                  const rating = typeof project.clientTestimonial === 'object' && project.clientTestimonial.rating 
                    ? project.clientTestimonial.rating 
                    : project.rating;
                  return (
                    <StarIconSolid 
                      key={i} 
                      className={`w-6 h-6 ${i < Math.floor(rating) ? 'text-yellow-300' : 'text-white/30'}`} 
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

      </div>

      {/* Image Gallery Modal */}
      {isGalleryOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
        >
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4">
            
            {/* Main Image */}
            <div className="relative max-w-5xl max-h-full">
              <Image
                src={project.images[selectedImageIndex]?.url || project.mainImage}
                alt={project.images[selectedImageIndex]?.alt || project.title}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              
              {/* Image Info */}
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white p-3 rounded-lg">
                <div className="text-lg font-medium">صورة {selectedImageIndex + 1} من {project.images.length}</div>
                <div className="text-sm opacity-80">{project.title}</div>
              </div>
            </div>

            {/* Navigation Arrows */}
            {project.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(prev => 
                    prev > 0 ? prev - 1 : project.images.length - 1
                  )}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-colors"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>

                <button
                  onClick={() => setSelectedImageIndex(prev => 
                    prev < project.images.length - 1 ? prev + 1 : 0
                  )}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-colors"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Thumbnail Navigation */}
            {project.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm p-3 rounded-lg">
                {project.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-12 relative rounded overflow-hidden border-2 transition-colors ${
                      index === selectedImageIndex ? 'border-orange-500' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `${project.title} - صورة ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

          </div>
        </motion.div>
      )}

    </div>
  )
}