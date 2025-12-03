'use client'

import { useParams, notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  ArrowRightIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon,
  HeartIcon,
  EyeIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

// Portfolio categories for reference
const portfolioCategories = [
  { id: 'residential', title: 'مشاريع سكنية', color: 'orange' },
  { id: 'commercial', title: 'مشاريع تجارية', color: 'purple' },
  { id: 'villa', title: 'فيلات', color: 'red' },
  { id: 'apartment', title: 'شقق', color: 'green' }
]

// TypeScript interface for portfolio item
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
  images: { id: string; url: string; alt: string }[]
  likes: number
  views: number
  rating: number
  features: string[]
  tags: string[]
  challenges: string[]
  solutions: string[]
  technologies: string[]
  teamMembers: string[]
  clientTestimonial?: string
  featured: boolean
  published: boolean
}

export default function ProjectDetailsPage() {
  const params = useParams()
  const slug = params.slug as string
  
  // State management
  const [portfolioItem, setPortfolioItem] = useState<PortfolioItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  
  // Fetch portfolio item data
  useEffect(() => {
    const fetchPortfolioItem = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/portfolio/${slug}`)
        const data = await response.json()

        if (data.success) {
          setPortfolioItem(data.data)
        } else {
          setError(data.message || 'خطأ في جلب العمل')
        }
      } catch (error) {
        console.error('Error fetching portfolio item:', error)
        setError('خطأ في الاتصال بالخادم')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPortfolioItem()
    }
  }, [slug])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">جاري تحميل تفاصيل العمل...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              href="/portfolio"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              العودة لمعرض الأعمال
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // إذا لم يوجد العمل
  if (!portfolioItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">العمل غير موجود</h1>
          <Link
            href="/portfolio"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            العودة لمعرض الأعمال
          </Link>
        </div>
      </div>
    )
  }

  const project = portfolioItem

  // الحصول على معلومات الفئة
  const category = portfolioCategories.find(cat => cat.id === project.category)
  
  // ألوان الفئات
  const colorClasses = {
    orange: {
      bg: 'bg-orange-600',
      text: 'text-orange-600',
      border: 'border-orange-600'
    },
    purple: {
      bg: 'bg-purple-600', 
      text: 'text-purple-600',
      border: 'border-purple-600'
    },
    red: {
      bg: 'bg-red-600',
      text: 'text-red-600', 
      border: 'border-red-600'
    },
    green: {
      bg: 'bg-green-600',
      text: 'text-green-600',
      border: 'border-green-600'
    }
  }
  
  const colors = colorClasses[category?.color as keyof typeof colorClasses] || colorClasses.orange

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">الرئيسية</Link>
          <ChevronRightIcon className="w-4 h-4" />
          <Link href="/portfolio" className="hover:text-blue-600">معرض الأعمال</Link>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{project.title}</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-12">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Main Image */}
          <div className="relative h-96">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🏗️</div>
                <div className="text-2xl font-bold">{project.title}</div>
                <div className="text-lg opacity-80 mt-2">{category?.title}</div>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="p-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${colors.bg} text-white`}>
                <span className="font-medium">{category?.title}</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <HeartIcon className="w-4 h-4" />
                  <span>{project.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" />
                  <span>{project.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4" />
                  <span>{project.rating}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Project Details */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {project.title}
                </h1>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  {project.description}
                </p>
                {project.fullDescription && (
                  <div className="text-gray-600 leading-relaxed">
                    <p>{project.fullDescription}</p>
                  </div>
                )}
              </div>

              {/* Project Meta */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <MapPinIcon className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-600">الموقع</div>
                      <div className="font-medium text-gray-900">{project.location}</div>
                    </div>
                  </div>

                  {project.client && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <UserIcon className="w-6 h-6 text-blue-600" />
                      <div>
                        <div className="text-sm text-gray-600">العميل</div>
                        <div className="font-medium text-gray-900">{project.client}</div>
                      </div>
                    </div>
                  )}

                  {project.completionDate && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <CalendarIcon className="w-6 h-6 text-blue-600" />
                      <div>
                        <div className="text-sm text-gray-600">تاريخ الإنجاز</div>
                        <div className="font-medium text-gray-900">{project.completionDate}</div>
                      </div>
                    </div>
                  )}

                  {project.duration && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <ClockIcon className="w-6 h-6 text-blue-600" />
                      <div>
                        <div className="text-sm text-gray-600">مدة التنفيذ</div>
                        <div className="font-medium text-gray-900">{project.duration}</div>
                      </div>
                    </div>
                  )}

                  {project.area && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-6 h-6 text-blue-600">📐</div>
                      <div>
                        <div className="text-sm text-gray-600">المساحة</div>
                        <div className="font-medium text-gray-900">{project.area}</div>
                      </div>
                    </div>
                  )}

                  {project.budget && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
                      <div>
                        <div className="text-sm text-gray-600">الميزانية</div>
                        <div className="font-medium text-gray-900">{project.budget}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      {project.features && project.features.length > 0 && (
        <section className="container mx-auto px-4 mb-12">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">المميزات</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Portfolio */}
      <section className="container mx-auto px-4 mb-12">
        <div className="text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <span>العودة لمعرض الأعمال</span>
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}