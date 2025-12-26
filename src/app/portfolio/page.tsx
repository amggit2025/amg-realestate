'use client'

export const dynamic = 'force-dynamic'

import { logger } from '@/lib/logger'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SearchLoadingState } from '@/components/ui'
import { 
  HomeIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
  CubeTransparentIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  ArrowUpRightIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

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
    color: 'from-orange-400 to-red-500',
    icon: WrenchScrewdriverIcon
  },
  { 
    id: 'finishing', 
    name: 'التشطيبات الداخلية', 
    description: 'أعمال التشطيب والديكور الداخلي',
    color: 'from-purple-400 to-indigo-500',
    icon: PaintBrushIcon
  },
  { 
    id: 'furniture', 
    name: 'الأثاث والديكور', 
    description: 'تصميم وتنفيذ الأثاث المخصص',
    color: 'from-pink-400 to-rose-500',
    icon: CubeTransparentIcon
  },
  { 
    id: 'kitchens', 
    name: 'المطابخ', 
    description: 'تصميم وتنفيذ المطابخ العصرية',
    color: 'from-emerald-400 to-teal-500',
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
  const [showFilters, setShowFilters] = useState(false)

  // Parallax Effect
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

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
          logger.error('خطأ في تحميل الأعمال:', data.message)
        }
      } catch (error) {
        logger.error('خطأ في الاتصال:', error)
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-800">جاري تجهيز المعرض...</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Immersive Hero Section */}
      <section className="relative h-[85vh] overflow-hidden flex items-center justify-center">
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"
            alt="Portfolio Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-gray-50 z-10" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ opacity }}
          >
            <span className="inline-block py-2 px-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8 tracking-wide">
              ✨ إبداع بلا حدود
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight tracking-tight">
              نصنع <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">المستقبل</span> <br />
              في كل مشروع
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              تصفح معرض أعمالنا واكتشف كيف نحول الرؤى الطموحة إلى واقع ملموس بأعلى معايير الجودة والإتقان.
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 text-white/50"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* 2. Advanced Filter Bar */}
      <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto md:flex-wrap pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-gray-900 text-white shadow-md ring-2 ring-gray-900 ring-offset-2'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <HomeIcon className="w-4 h-4" />
                الكل
              </button>
              {portfolioCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-md ring-2 ring-offset-2 ring-gray-200`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search & Filter Toggle */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64 group">
                <input
                  type="text"
                  placeholder="بحث..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 rounded-full text-sm transition-all duration-300"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-full transition-colors ${showFilters ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <FunnelIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 flex items-center gap-4 border-t border-gray-100 mt-4">
                  <span className="text-sm font-medium text-gray-500">ترتيب حسب:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-50 border-none text-sm font-semibold text-gray-700 rounded-lg focus:ring-0 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <option value="recent">الأحدث</option>
                    <option value="popular">الأكثر شعبية</option>
                    <option value="rating">الأعلى تقييماً</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 3. Modern Grid Layout */}
      <section className="py-20 container mx-auto px-4">
        {isSearching ? (
          <SearchLoadingState />
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
                >
                  <Link href={`/portfolio/${project.slug}`} className="block h-full flex flex-col">
                    {/* Image Container */}
                    <div className="relative h-72 overflow-hidden">
                      {project.image ? (
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <BuildingOffice2Icon className="w-16 h-16 text-gray-300" />
                        </div>
                      )}
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Category Tag */}
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold shadow-lg transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                          {portfolioCategories.find(c => c.id === project.category)?.name}
                        </span>
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="p-8 flex-1 flex flex-col relative">
                      {/* Floating Action Button */}
                      <div className="absolute -top-6 left-8 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 transform scale-0 group-hover:scale-100 transition-all duration-300 delay-100">
                        <ArrowUpRightIcon className="w-6 h-6" />
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      
                      <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                        {project.description}
                      </p>

                      <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="w-4 h-4" />
                          <span className="font-medium text-gray-600">{project.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{project.completionDate}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && !isSearching && (
          <div className="text-center py-32">
            <div className="inline-block p-6 rounded-full bg-gray-100 mb-6">
              <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-500 mb-8">لم نجد أي مشاريع تطابق بحثك الحالي</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              عرض كل المشاريع
            </button>
          </div>
        )}
      </section>

      {/* 4. Stats Strip */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'مشروع مكتمل', value: '+200', icon: '🏢' },
              { label: 'عميل سعيد', value: '+500', icon: '😊' },
              { label: 'سنة خبرة', value: '+15', icon: '⭐' },
              { label: 'جائزة تميز', value: '12', icon: '🏆' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
              هل لديك مشروع <br />
              <span className="text-blue-600">في ذهنك؟</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              دعنا نساعدك في تحويل أفكارك إلى واقع. فريقنا من الخبراء جاهز للبدء في مشروعك القادم.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-full text-lg font-bold hover:bg-blue-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              ابدأ مشروعك الآن
              <ArrowUpRightIcon className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
        
        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-50"></div>
      </section>
    </div>
  )
}
