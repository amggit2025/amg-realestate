'use client'

import { motion } from 'framer-motion'
import { 
  BuildingOffice2Icon,
  ArrowRightIcon,
  EyeIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// نوع البيانات للعمل المميز
interface FeaturedPortfolioItem {
  id: string
  title: string
  description: string
  category: string
  location: string
  client: string
  image: string
  slug: string
  views: number
  likes: number
  rating: number
  featured: boolean
  completionDate?: string
  createdAt: string
}

// نوع البيانات للإحصائيات
interface PortfolioStats {
  totalProjects: number
  totalViews: number
  averageRating: number
  featuredCount: number
}

// بيانات احتياطية في حالة عدم توفر الاتصال
const getFallbackProjects = (): FeaturedPortfolioItem[] => [
  {
    id: 'fallback-1',
    title: 'فيلا فاخرة - القاهرة الجديدة',
    description: 'تصميم وتنفيذ فيلا عصرية بأحدث المواصفات',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80',
    category: 'التشييد والبناء',
    location: 'القاهرة الجديدة',
    client: 'عميل خاص',
    slug: 'villa-new-cairo',
    views: 1200,
    likes: 89,
    rating: 4.8,
    featured: true,
    completionDate: '2024',
    createdAt: new Date().toISOString()
  },
  {
    id: 'fallback-2',
    title: 'مجمع سكني - العاصمة الإدارية',
    description: 'مجمع سكني متكامل الخدمات',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    category: 'التشييد والبناء',
    location: 'العاصمة الإدارية',
    client: 'شركة التطوير',
    slug: 'residential-compound',
    views: 2100,
    likes: 156,
    rating: 4.9,
    featured: true,
    completionDate: '2024',
    createdAt: new Date().toISOString()
  },
  {
    id: 'fallback-3',
    title: 'تشطيب شقة دوبلكس عصرية',
    description: 'تشطيب داخلي بأعلى معايير الجودة',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    category: 'التشطيبات الداخلية',
    location: 'الزمالك',
    client: 'عميل خاص',
    slug: 'duplex-apartment',
    views: 890,
    likes: 67,
    rating: 4.7,
    featured: true,
    completionDate: '2023',
    createdAt: new Date().toISOString()
  }
]

const getFallbackStats = (): PortfolioStats => ({
  totalProjects: 50,
  totalViews: 12000,
  averageRating: 4.8,
  featuredCount: 3
})

export default function PortfolioShowcase() {
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedPortfolioItem[]>([])
  const [stats, setStats] = useState<PortfolioStats>(getFallbackStats())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // جلب الأعمال المميزة عند تحميل المكون
  useEffect(() => {
    fetchFeaturedPortfolio()
    fetchPortfolioStats()
  }, [])

  const fetchPortfolioStats = async () => {
    try {
      const response = await fetch('/api/portfolio-stats')
      const data = await response.json()
      
      if (data.success && data.data) {
        setStats({
          totalProjects: data.data.totalProjects,
          totalViews: data.data.totalViews,
          averageRating: data.data.averageRating,
          featuredCount: featuredProjects.length
        })
      }
    } catch (error) {
      console.error('خطأ في جلب إحصائيات معرض الأعمال:', error)
    }
  }

  const fetchFeaturedPortfolio = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/portfolio/featured')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('🔍 API Response:', data)

      if (data.success) {
        console.log('✅ Projects loaded:', data.data)
        setFeaturedProjects(data.data || getFallbackProjects())
        setStats(data.stats || getFallbackStats())
      } else {
        console.error('خطأ في جلب الأعمال المميزة:', data.message)
        setFeaturedProjects(getFallbackProjects())
        setStats(getFallbackStats())
        setError(data.message)
      }
    } catch (error) {
      console.error('خطأ في الاتصال:', error)
      setFeaturedProjects(getFallbackProjects())
      setStats(getFallbackStats())
      setError('خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  // حساب الإحصائيات الديناميكية
  const quickStats = [
    { 
      label: 'مشروع منجز', 
      value: stats.totalProjects > 0 ? `${stats.totalProjects}+` : '50+', 
      icon: BuildingOffice2Icon 
    },
    { 
      label: 'عميل راضي', 
      value: stats.totalProjects > 0 ? `${Math.round(stats.totalProjects * 2.5)}+` : '125+', 
      icon: HeartIcon 
    },
    { 
      label: 'تقييم عام', 
      value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '4.8', 
      icon: StarIcon 
    },
    { 
      label: 'مشاهدة', 
      value: stats.totalViews > 1000 ? `${Math.round(stats.totalViews / 1000)}K+` : `${stats.totalViews}+`, 
      icon: EyeIcon 
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-blue-100 text-blue-800 px-6 py-2 rounded-full text-sm font-semibold mb-4">
            <BuildingOffice2Icon className="w-4 h-4" />
            معرض أعمالنا المميزة
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            إبداعات معمارية استثنائية
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            استكشف مجموعة مُختارة من أفضل أعمالنا التي تعكس التميز والجودة في كل التفاصيل
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">حدث خطأ في تحميل الأعمال المميزة</p>
            <button 
              onClick={fetchFeaturedPortfolio}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Featured Projects Grid */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 mb-12"
          >
            {featuredProjects.map((project, index) => (
            <Link href={`/portfolio/${project.slug}`} key={project.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {project.category}
                    </span>
                  </div>
                  {project.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <StarIcon className="w-3 h-3" />
                        مميز
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                    <h3 className="text-white font-bold text-lg mb-2">{project.title}</h3>
                    <p className="text-white/90 text-sm mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-white/80 text-sm">
                        <div className="flex items-center gap-1">
                          <EyeIcon className="w-4 h-4" />
                          {project.views >= 1000 ? `${Math.round(project.views / 1000)}K` : project.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <HeartIcon className="w-4 h-4" />
                          {project.likes}
                        </div>
                      </div>
                      <div className="text-white/80 text-xs">
                        {project.location}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
            ))}
          </motion.div>
        )}

        {/* Stats Section */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg mb-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </motion.div>
              )
              })}
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>استكشف جميع المشاريع</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-gray-100 text-gray-800 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              تواصل معنا
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
