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
  const [otherServices, setOtherServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Form states
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${slug}`)
        if (response.ok) {
          const data = await response.json()
          setService(data.service)
          
          // Fetch other services
          const allServicesResponse = await fetch('/api/services')
          if (allServicesResponse.ok) {
            const allServicesData = await allServicesResponse.json()
            // Filter out the current service
            const filtered = allServicesData.services.filter((s: any) => s.slug !== slug).slice(0, 3)
            setOtherServices(filtered)
          }
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
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setSubmitError('')
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    
    try {
      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          serviceSlug: slug,
          serviceTitle: service?.title
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSubmitSuccess(true)
        setFormData({ name: '', email: '', phone: '', message: '' })
        setTimeout(() => {
          setIsModalOpen(false)
          setSubmitSuccess(false)
        }, 3000)
      } else {
        setSubmitError(data.error || 'حدث خطأ أثناء إرسال الطلب')
      }
    } catch (error) {
      setSubmitError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
                {Array.isArray(service.stats) ? (
                  // Handle Array format (from Database)
                  service.stats.map((stat: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center group hover:border-primary-200 transition-colors"
                    >
                      <div className={`text-3xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-2`}>
                        {stat.number}
                      </div>
                      <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  // Handle Object format (Legacy/Mock)
                  Object.entries(service.stats).map(([key, value]: [string, any], index) => (
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
                        {key === 'clients' ? 'عميل سعيد' : key === 'projects' ? 'مشروع مكتمل' : key === 'satisfaction' ? 'نسبة رضا' : key}
                      </div>
                    </motion.div>
                  ))
                )}
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

            {/* Gallery Section - Only show if there are portfolio items */}
            {service.portfolioItems && service.portfolioItems.length > 0 && (
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">معرض الأعمال</h2>
                  <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                    {service.portfolioItems.length} مشاريع
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {service.portfolioItems.slice(0, 8).map((item: any) => (
                    <Link
                      key={item.id}
                      href={`/portfolio/${item.slug}`}
                    >
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-gray-100"
                      >
                        <Image
                          src={item.images?.[0]?.url || '/images/placeholder.jpg'}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                          <h3 className="text-white font-bold text-sm line-clamp-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            {item.title}
                          </h3>
                          <p className="text-gray-300 text-xs mt-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                            {item.location}
                          </p>
                        </div>
                        
                        {/* Zoom Icon */}
                        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Contact Card */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">مهتم بهذه الخدمة؟</h3>
              <p className="text-gray-600 mb-8">املأ النموذج أدناه وسيقوم فريقنا بالتواصل معك في أقرب وقت.</p>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" 
                    placeholder="الاسم" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" 
                    placeholder="01xxxxxxxxx" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تفاصيل الطلب</label>
                  <textarea 
                    rows={4} 
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" 
                    placeholder="اكتب تفاصيل مشروعك..." 
                  />
                </div>
                
                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {submitError}
                  </div>
                )}
                
                {submitSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                    ✅ تم إرسال طلبك بنجاح! سنتواصل معك قريباً.
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full py-4 bg-gradient-to-r ${colors.gradient} text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
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
              
              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="w-10 h-10 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">تم إرسال طلبك بنجاح!</h4>
                  <p className="text-gray-600">سيتواصل معك فريقنا في أقرب وقت ممكن.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل *</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" 
                      placeholder="أدخل اسمك الكامل" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني (اختياري)</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" 
                      placeholder="example@email.com" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" 
                      placeholder="01xxxxxxxxx" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">تفاصيل الطلب *</label>
                    <textarea 
                      rows={5} 
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" 
                      placeholder="اكتب تفاصيل مشروعك أو استفسارك هنا..." 
                    />
                  </div>
                  
                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                      {submitError}
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Other Services Section */}
      {!loading && otherServices.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">خدمات أخرى قد تهمك</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">استكشف المزيد من خدماتنا المتميزة</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {otherServices.map((otherService, index) => {
                const Icon = iconMap[otherService.icon] || BuildingOfficeIcon
                const colors = colorMap[otherService.color] || colorMap.blue
                
                return (
                  <motion.div
                    key={otherService.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <Link href={`/services/${otherService.slug}`}>
                      <div className={`relative h-full bg-white rounded-2xl border ${colors.border} p-8 hover:shadow-2xl ${colors.shadow} transition-all duration-300 hover:-translate-y-2`}>
                        {/* Icon */}
                        <div className={`w-16 h-16 ${colors.lightBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`w-8 h-8 ${colors.text}`} />
                        </div>
                        
                        {/* Content */}
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:${colors.text} transition-colors">
                          {otherService.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
                          {otherService.description}
                        </p>
                        
                        {/* CTA */}
                        <div className={`flex items-center gap-2 ${colors.text} font-semibold group-hover:gap-4 transition-all`}>
                          <span>تفاصيل أكثر</span>
                          <ArrowRightIcon className="w-5 h-5" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-all hover:scale-105"
              >
                <span>عرض جميع الخدمات</span>
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
