'use client'

export const dynamic = 'force-dynamic'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HomeIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
  CubeIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PhoneIcon,
  StarIcon,
  XMarkIcon,
  BuildingOffice2Icon,
  CubeTransparentIcon,
  MegaphoneIcon,
  SparklesIcon,
  ArrowDownIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

// Icon mapping
const iconMap: any = {
  BuildingOfficeIcon,
  PaintBrushIcon,
  HomeIcon,
  MegaphoneIcon,
  BuildingOffice2Icon,
  WrenchScrewdriverIcon,
  CubeTransparentIcon,
  CubeIcon,
  CheckCircleIcon,
  StarIcon,
}

// Enhanced Color Mapping (Genius Theme)
const colorMap: { [key: string]: { gradient: string, bg: string, text: string, border: string, shadow: string, glow: string, lightBg: string } } = {
  blue: {
    gradient: 'from-blue-600 to-cyan-500',
    bg: 'bg-blue-600',
    lightBg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    shadow: 'shadow-blue-500/20',
    glow: 'shadow-blue-500/40'
  },
  orange: {
    gradient: 'from-orange-500 to-red-500',
    bg: 'bg-orange-600',
    lightBg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-200',
    shadow: 'shadow-orange-500/20',
    glow: 'shadow-orange-500/40'
  },
  purple: {
    gradient: 'from-purple-600 to-indigo-500',
    bg: 'bg-purple-600',
    lightBg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200',
    shadow: 'shadow-purple-500/20',
    glow: 'shadow-purple-500/40'
  },
  green: {
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-600',
    lightBg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    shadow: 'shadow-emerald-500/20',
    glow: 'shadow-emerald-500/40'
  },
  red: {
    gradient: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-600',
    lightBg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-200',
    shadow: 'shadow-rose-500/20',
    glow: 'shadow-rose-500/40'
  },
  gray: {
    gradient: 'from-slate-600 to-gray-500',
    bg: 'bg-slate-600',
    lightBg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    shadow: 'shadow-slate-500/20',
    glow: 'shadow-slate-500/40'
  }
}

export default function ServicePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [service, setService] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${slug}`)
        if (response.ok) {
          const data = await response.json()
          setService(data.service)
        } else {
          // Handle not found or error
          console.error('Service not found')
        }
      } catch (error) {
        console.error('Error fetching service:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">الخدمة غير موجودة</h1>
        <Link href="/services" className="text-primary-600 hover:underline">
          العودة للخدمات
        </Link>
      </div>
    )
  }

  const colors = colorMap[service.color] || colorMap.blue
  const Icon = iconMap[service.iconName] || BuildingOfficeIcon

  return (
    <div className="min-h-screen bg-gray-50 selection:bg-primary-500 selection:text-white overflow-x-hidden">
      
      {/* Hero Section - Parallax & Immersive */}
      <div className="relative h-[70vh] min-h-[600px] bg-gray-900 overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={service.heroImage || '/images/placeholder.jpg'}
            alt={service.title}
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-gray-50" />
        </motion.div>

        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-lg ${colors.glow}`}>
              <Icon className={`w-5 h-5 text-white`} />
              <span className="text-white font-medium tracking-wide">{service.title}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-heading leading-tight drop-shadow-lg">
              {service.title}
            </h1>
            
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light mb-10 drop-shadow-md">
              {service.description}
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className={`px-10 py-4 bg-gradient-to-r ${colors.gradient} text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 mx-auto`}
            >
              <span>اطلب الخدمة الآن</span>
              <ArrowRightIcon className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        >
          <ArrowDownIcon className="w-8 h-8" />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Content) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Stats Grid */}
            {service.stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(service.stats).map(([key, value]: [string, any], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center group hover:border-primary-200 transition-colors"
                  >
                    <div className={`text-3xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-2`}>
                      {typeof value === 'object' ? value.number : value}
                    </div>
                    <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                      {key === 'clients' ? 'عميل سعيد' : key === 'projects' ? 'مشروع مكتمل' : key}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Features Section */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <SparklesIcon className={`w-8 h-8 ${colors.text}`} />
                مميزات الخدمة
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.features?.map((feature: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-xl ${colors.lightBg} flex items-center justify-center shrink-0`}>
                      <CheckCircleIcon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
                {/* Fallback features if none exist */}
                {!service.features && [1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                    <div className={`w-12 h-12 rounded-xl ${colors.lightBg} flex items-center justify-center shrink-0`}>
                      <CheckCircleIcon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">ميزة تنافسية {i + 1}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">نقدم أفضل الحلول المبتكرة لضمان نجاح مشروعك بأعلى معايير الجودة.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery Section */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 overflow-hidden">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">معرض الأعمال</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className={`relative rounded-2xl overflow-hidden ${i === 0 ? 'col-span-2 row-span-2 h-96' : 'h-48'}`}
                  >
                    <Image
                      src={`https://images.unsplash.com/photo-${1600000000000 + i}?auto=format&fit=crop&w=800&q=80`}
                      alt="Gallery Item"
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Contact Card */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">مهتم بهذه الخدمة؟</h3>
              <p className="text-gray-600 mb-8">املأ النموذج أدناه وسيقوم فريقنا بالتواصل معك في أقرب وقت.</p>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="الاسم" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="01xxxxxxxxx" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تفاصيل الطلب</label>
                  <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="اكتب تفاصيل مشروعك..." />
                </div>
                
                <button type="submit" className={`w-full py-4 bg-gradient-to-r ${colors.gradient} text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1`}>
                  إرسال الطلب
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-full ${colors.lightBg} flex items-center justify-center`}>
                    <PhoneIcon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">اتصل بنا مباشرة</p>
                    <p className="font-bold text-gray-900" dir="ltr">+20 100 000 0000</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modal (Placeholder) */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">طلب خدمة: {service.title}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">سيتم تفعيل نموذج الطلب المتكامل قريباً.</p>
              <button onClick={() => setIsModalOpen(false)} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold">
                إغلاق
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
