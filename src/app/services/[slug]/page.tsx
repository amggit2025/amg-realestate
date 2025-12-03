'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  CubeTransparentIcon
} from '@heroicons/react/24/outline'
import SEOHead from '@/components/SEOHead'

// Icon mapping
const iconMap: any = {
  BuildingOfficeIcon,
  PaintBrushIcon,
  HomeIcon,
  MegaphoneIcon: PhoneIcon,
  BuildingOffice2Icon,
  WrenchScrewdriverIcon,
  CubeTransparentIcon,
  CubeIcon,
  CheckCircleIcon,
  StarIcon,
}

// Color classes mapping
const colorClasses: any = {
  blue: {
    bg: 'bg-blue-600',
    hover: 'hover:bg-blue-700',
    text: 'text-blue-600',
    border: 'border-blue-600',
    gradient: 'from-blue-600'
  },
  green: {
    bg: 'bg-green-600',
    hover: 'hover:bg-green-700',
    text: 'text-green-600',
    border: 'border-green-600',
    gradient: 'from-green-600'
  },
  orange: {
    bg: 'bg-orange-600',
    hover: 'hover:bg-orange-700',
    text: 'text-orange-600',
    border: 'border-orange-600',
    gradient: 'from-orange-600'
  },
  purple: {
    bg: 'bg-purple-600',
    hover: 'hover:bg-purple-700',
    text: 'text-purple-600',
    border: 'border-purple-600',
    gradient: 'from-purple-600'
  },
  amber: {
    bg: 'bg-amber-600',
    hover: 'hover:bg-amber-700',
    text: 'text-amber-600',
    border: 'border-amber-600',
    gradient: 'from-amber-600'
  },
  red: {
    bg: 'bg-red-600',
    hover: 'hover:bg-red-700',
    text: 'text-red-600',
    border: 'border-red-600',
    gradient: 'from-red-600'
  },
  gray: {
    bg: 'bg-gray-600',
    hover: 'hover:bg-gray-700',
    text: 'text-gray-600',
    border: 'border-gray-600',
    gradient: 'from-gray-600'
  }
}

interface Service {
  id: string
  slug: string
  title: string
  description: string
  heroImage: string
  features: Array<{
    title: string
    description: string
    iconName: string
  }>
  stats: Array<{
    number: string
    label: string
    iconName: string
  }>
  gallery: string[]
  formOptions: {
    projectTypes: string[]
    budgetRanges: string[]
    timelines: string[]
  }
  color: string
  iconName: string
  published: boolean
  featured: boolean
  portfolioItems?: Array<{
    id: string
    title: string
    description: string
    location: string
    category: string
    images: Array<{ url: string }>
  }>
}

export default function ServicePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [service, setService] = useState<Service | null>(null)
  const [otherServices, setOtherServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    serviceType: '',
    projectType: '',
    budget: '',
    timeline: ''
  })

  useEffect(() => {
    fetchService()
    fetchOtherServices()
  }, [slug])

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/services/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setService(data.service)
        setFormData(prev => ({
          ...prev,
          serviceType: data.service.title
        }))
      } else {
        // Service not found
        setService(null)
      }
    } catch (error) {
      console.error('Error fetching service:', error)
      setService(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchOtherServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        setOtherServices(data.services.filter((s: Service) => s.slug !== slug))
      }
    } catch (error) {
      console.error('Error fetching other services:', error)
    }
  }

  const handleOpenModal = (option: string = '') => {
    setSelectedOption(option)
    if (option) {
      setFormData(prev => ({
        ...prev,
        projectType: option
      }))
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          subject: `طلب خدمة: ${formData.serviceType}${selectedOption ? ` - ${selectedOption}` : ''}`,
          type: 'service_request'
        }),
      })

      if (response.ok) {
        alert('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.')
        setIsModalOpen(false)
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          serviceType: service?.title || '',
          projectType: '',
          budget: '',
          timeline: ''
        })
      } else {
        alert('حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.')
      }
    } catch (error) {
      alert('حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">الخدمة غير موجودة</h1>
          <p className="text-gray-600 mb-8">عذراً، الخدمة التي تبحث عنها غير متوفرة</p>
          <Link 
            href="/services" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowRightIcon className="w-5 h-5" />
            العودة للخدمات
          </Link>
        </div>
      </div>
    )
  }

  const Icon = iconMap[service.iconName] || BuildingOfficeIcon
  const colors = colorClasses[service.color] || colorClasses.blue

  return (
    <>
      <SEOHead
        title={`${service.title} | AMG Real Estate`}
        description={service.description}
        ogImage={service.heroImage}
      />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            {service.heroImage && (
              <Image
                src={service.heroImage}
                alt={service.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/90"></div>
          </div>
          
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`inline-flex items-center justify-center w-24 h-24 ${colors.bg} rounded-full mb-8 shadow-2xl`}
            >
              <Icon className="w-12 h-12" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              {service.title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              {service.description}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <button
                onClick={() => handleOpenModal()}
                className={`${colors.bg} ${colors.hover} text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105`}
              >
                اطلب الخدمة الآن
              </button>
              <Link
                href="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
              >
                تواصل معنا
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        {service.stats && service.stats.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {service.stats.map((stat, index) => {
                  const StatIcon = iconMap[stat.iconName] || CheckCircleIcon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="text-center"
                    >
                      <div className={`inline-flex items-center justify-center w-16 h-16 ${colors.bg} rounded-xl mb-4`}>
                        <StatIcon className="w-8 h-8 text-white" />
                      </div>
                      <div className={`text-4xl font-bold ${colors.text} mb-2`}>{stat.number}</div>
                      <div className="text-gray-600 font-medium">{stat.label}</div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        {service.features && service.features.length > 0 && (
          <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                مميزات الخدمة
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {service.features.map((feature, index) => {
                  const FeatureIcon = iconMap[feature.iconName] || CheckCircleIcon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                    >
                      <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                        <FeatureIcon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Portfolio Gallery Section */}
        {service.portfolioItems && service.portfolioItems.length > 0 && (
          <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  معرض أعمالنا
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  اكتشف مشاريعنا السابقة في مجال {service.title}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {service.portfolioItems.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                  >
                    <div className="relative h-64 overflow-hidden bg-gray-200">
                      {project.images && project.images.length > 0 && (
                        <Image
                          src={project.images[0].url}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <CheckCircleIcon className="w-4 h-4" />
                          {project.category}
                        </span>
                        {project.location && (
                          <span className="flex items-center gap-1">
                            <PhoneIcon className="w-4 h-4" />
                            {project.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  href="/portfolio"
                  className={`inline-flex items-center gap-2 ${colors.bg} ${colors.hover} text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105`}
                >
                  عرض جميع الأعمال
                  <ArrowRightIcon className="w-5 h-5 rotate-180" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Request Form Options */}
        {service.formOptions && (
          <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    احصل على استشارة مجانية
                  </h2>
                  <p className="text-gray-600 text-lg">
                    اختر نوع المشروع المناسب لك وسنتواصل معك في أقرب وقت
                  </p>
                </div>

                {service.formOptions.projectTypes && service.formOptions.projectTypes.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {service.formOptions.projectTypes.map((projectType, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        onClick={() => handleOpenModal(projectType)}
                        className={`p-6 border-2 ${colors.border} rounded-2xl hover:bg-gray-50 transition-all duration-300 group text-right`}
                      >
                        <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {projectType}
                        </h3>
                        <p className={`text-sm ${colors.text} font-semibold`}>
                          اطلب الخدمة ←
                        </p>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Other Services Section */}
        {otherServices.length > 0 && (
          <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                خدماتنا الأخرى
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {otherServices.slice(0, 4).map((otherService) => {
                  const OtherIcon = iconMap[otherService.iconName] || BuildingOfficeIcon
                  const otherColors = colorClasses[otherService.color] || colorClasses.blue
                  
                  return (
                    <Link
                      key={otherService.id}
                      href={`/services/${otherService.slug}`}
                      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                    >
                      <div className={`w-16 h-16 ${otherColors.bg} rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                        <OtherIcon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                        {otherService.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {otherService.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                        <span>اكتشف المزيد</span>
                        <ArrowRightIcon className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Link>
                  )
                })}
              </div>
              
              <div className="text-center mt-12">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  جميع خدماتنا
                  <ArrowRightIcon className="w-5 h-5 rotate-180" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className={`py-24 bg-gradient-to-r ${colors.gradient} to-gray-900`}>
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              هل أنت مستعد للبدء؟
            </h2>
            
            <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
              تواصل معنا الآن للحصول على استشارة مجانية وعرض سعر مخصص لاحتياجاتك
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => handleOpenModal()}
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-3 justify-center"
              >
                <PhoneIcon className="w-6 h-6" />
                اطلب الخدمة الآن
              </button>
              
              <Link
                href="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 inline-flex items-center gap-3 justify-center"
              >
                تواصل معنا
                <ArrowRightIcon className="w-5 h-5 rotate-180" />
              </Link>
            </div>
          </div>
        </section>

        {/* Service Request Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">طلب خدمة {service.title}</h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {selectedOption && (
                  <div className={`mb-6 p-4 ${colors.bg} bg-opacity-10 rounded-xl border-2 ${colors.border}`}>
                    <p className="font-semibold text-gray-900">
                      نوع المشروع: <span className={colors.text}>{selectedOption}</span>
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الاسم الكامل *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        رقم الهاتف *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="example@email.com"
                    />
                  </div>

                  {service.formOptions?.budgetRanges && service.formOptions.budgetRanges.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الميزانية المتوقعة
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">اختر نطاق الميزانية</option>
                        {service.formOptions.budgetRanges.map((range, index) => (
                          <option key={index} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {service.formOptions?.timelines && service.formOptions.timelines.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الإطار الزمني المتوقع
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">اختر الإطار الزمني</option>
                        {service.formOptions.timelines.map((timeline, index) => (
                          <option key={index} value={timeline}>{timeline}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تفاصيل إضافية
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="أخبرنا المزيد عن مشروعك..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-1 px-6 py-3 ${colors.bg} ${colors.hover} text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </>
  )
}
