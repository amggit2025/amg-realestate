'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { 
  ArrowRight, 
  Eye, 
  Heart, 
  Star,
  Trophy,
  Sparkles,
  Play,
  MapPin,
  ExternalLink,
  TrendingUp
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, memo, useRef } from 'react'

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

const FALLBACK_ITEMS: FeaturedPortfolioItem[] = [
  {
    id: '1',
    title: 'برج النخبة السكني',
    description: 'تصميم وتنفيذ برج سكني فاخر في قلب العاصمة الإدارية، يتميز بإطلالات بانورامية وتشطيبات عالمية.',
    category: 'سكني',
    location: 'العاصمة الإدارية',
    client: 'شركة التطوير العقاري',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    slug: 'elite-tower',
    views: 1250,
    likes: 85,
    rating: 4.9,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'مول الأفق التجاري',
    description: 'مجمع تجاري متكامل يضم أرقى العلامات التجارية، مصمم بأحدث تقنيات البناء الذكي.',
    category: 'تجاري',
    location: 'القاهرة الجديدة',
    client: 'مجموعة الأفق',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    slug: 'horizon-mall',
    views: 980,
    likes: 62,
    rating: 4.8,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'فيلا البحيرة',
    description: 'فيلا خاصة بتصميم مودرن فريد، تطل مباشرة على البحيرة مع حدائق واسعة ومسبح خاص.',
    category: 'سكني',
    location: 'الساحل الشمالي',
    client: 'عميل خاص',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    slug: 'lake-villa',
    views: 1500,
    likes: 120,
    rating: 5.0,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'مقر شركة تك',
    description: 'تصميم داخلي وتنفيذ لمقر شركة تكنولوجيا عالمية، يركز على بيئة العمل الإبداعية.',
    category: 'إداري',
    location: 'القرية الذكية',
    client: 'Tech Corp',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    slug: 'tech-hq',
    views: 850,
    likes: 45,
    rating: 4.7,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'منتجع الواحة الفاخر',
    description: 'منتجع سياحي متكامل يجمع بين الرفاهية والطبيعة الخلابة على شاطئ البحر الأحمر.',
    category: 'سياحي',
    location: 'الغردقة',
    client: 'مجموعة الواحة',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    slug: 'oasis-resort',
    views: 2100,
    likes: 180,
    rating: 4.9,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    title: 'مجمع الياسمين السكني',
    description: 'مجمع سكني متكامل الخدمات يضم فيلات وشقق فاخرة في بيئة آمنة وهادئة.',
    category: 'سكني',
    location: 'التجمع الخامس',
    client: 'شركة الياسمين',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    slug: 'yasmine-compound',
    views: 1800,
    likes: 95,
    rating: 4.8,
    featured: true,
    createdAt: new Date().toISOString()
  }
]

const FALLBACK_STATS: PortfolioStats = {
  totalProjects: 150,
  totalViews: 50000,
  averageRating: 4.9,
  featuredCount: 12
}

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = '' }: { value: number, suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (isVisible) {
      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setDisplayValue(value)
          clearInterval(timer)
        } else {
          setDisplayValue(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isVisible, value])

  return <div ref={ref}>{displayValue.toLocaleString()}{suffix}</div>
}

const PortfolioShowcase = () => {
  const [items, setItems] = useState<FeaturedPortfolioItem[]>([])
  const [stats, setStats] = useState<PortfolioStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const categories = ['all', 'سكني', 'تجاري', 'إداري', 'سياحي']

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, statsRes] = await Promise.all([
          fetch('/api/portfolio/featured'),
          fetch('/api/portfolio-stats')
        ])

        if (itemsRes.ok) {
          const data = await itemsRes.json()
          if (data.data && data.data.length > 0) {
            setItems(data.data)
          } else {
            setItems(FALLBACK_ITEMS)
          }
        } else {
          setItems(FALLBACK_ITEMS)
        }

        if (statsRes.ok) {
          const data = await statsRes.json()
          setStats(data.data || FALLBACK_STATS)
        } else {
          setStats(FALLBACK_STATS)
        }
      } catch (error) {
        console.error('Error fetching portfolio data:', error)
        setItems(FALLBACK_ITEMS)
        setStats(FALLBACK_STATS)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => item.category === activeCategory)

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="flex justify-center gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-10 w-24 bg-gray-200 rounded-full"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-[400px] bg-gray-200 rounded-3xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 relative overflow-hidden bg-slate-950">
      {/* Artistic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950" />
      
      {/* Animated Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Subtle Grid Pattern with Mask */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2 mb-8 shadow-lg shadow-purple-500/10"
          >
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="text-white/90 text-sm font-medium tracking-wide">معرض أعمالنا المميزة</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-bold text-white mb-8 leading-tight"
          >
            إبداعات تتحدث عن <br />
            <span className="relative inline-block">
              <span className="absolute -inset-2 blur-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-50"></span>
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-sm">
                نفسها
              </span>
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto mb-10"
          >
            استكشف مجموعة من أرقى المشاريع العقارية التي نفذناها بأعلى معايير الجودة والتميز
          </motion.p>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {category === 'all' ? 'جميع المشاريع' : category}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Stats Row */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {[
              { label: 'مشروع مكتمل', value: stats.totalProjects, icon: Trophy, color: 'from-yellow-400 to-orange-500' },
              { label: 'مشاهدة', value: stats.totalViews, icon: Eye, color: 'from-blue-400 to-cyan-500' },
              { label: 'تقييم العملاء', value: stats.averageRating, icon: Star, color: 'from-pink-400 to-rose-500', suffix: '/5' },
              { label: 'مشروع مميز', value: stats.featuredCount, icon: Sparkles, color: 'from-purple-400 to-indigo-500' }
            ].map((stat, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl" style={{ background: `linear-gradient(135deg, ${stat.color.replace('from-', '').replace('to-', ', ')})` }} />
                <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Projects Grid - Modern Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.slice(0, 6).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="group relative"
            >
              <Link href={`/portfolio/${item.slug}`} className="block">
                <div className="relative h-[450px] rounded-3xl overflow-hidden bg-slate-900 border border-white/5 group-hover:border-white/20 transition-colors duration-500">
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-20 pointer-events-none" />

                  {/* Image */}
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                  
                  {/* Glowing Border on Hover */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-500/30 transition-all duration-500" />
                  
                  {/* Top Badge */}
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20">
                      {item.category}
                    </span>
                    {item.featured && (
                      <span className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold rounded-full flex items-center gap-1 shadow-lg">
                        <Star className="w-3 h-3 fill-current" />
                        مميز
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    {/* Rating & Stats */}
                    <div className="flex items-center gap-4 mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-white text-sm font-medium">{item.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-300">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">{item.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-300">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{item.likes}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-300 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{item.location}</span>
                    </div>

                    {/* Description - Shows on hover */}
                    <p className="text-gray-400 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 mb-4">
                      {item.description}
                    </p>

                    {/* CTA Button */}
                    <div className="flex items-center gap-2 text-blue-400 font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-150">
                      <span>عرض التفاصيل</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Play Button for Video Projects (Optional Visual) */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform scale-75 group-hover:scale-100 transition-transform duration-500">
                      <ExternalLink className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Link href="/portfolio">
            <button className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40">
              {/* Animated Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-[length:200%_100%] animate-gradient" />
              <div className="absolute inset-[2px] bg-slate-900 rounded-[14px] group-hover:bg-transparent transition-colors duration-300" />
              
              <span className="relative z-10 text-white">استكشف جميع المشاريع</span>
              <ArrowRight className="w-5 h-5 relative z-10 text-white group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  )
}

export default memo(PortfolioShowcase)


