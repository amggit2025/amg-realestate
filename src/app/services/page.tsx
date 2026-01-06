'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  WrenchScrewdriverIcon,
  PaintBrushIcon,
  CubeTransparentIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  PhoneIcon,
  StarIcon,
  UserGroupIcon,
  ClockIcon,
  BuildingOffice2Icon,
  MegaphoneIcon,
  HomeIcon,
  SparklesIcon,
  ShieldCheckIcon,
  TrophyIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'

// Icon mapping
const iconMap: { [key: string]: any } = {
  WrenchScrewdriverIcon,
  PaintBrushIcon,
  CubeTransparentIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  MegaphoneIcon,
  HomeIcon
}

// Color mapping with enhanced gradients for "Genius" look
const colorMap: { [key: string]: { gradient: string, bg: string, text: string, border: string, shadow: string, glow: string } } = {
  blue: {
    gradient: 'from-blue-600 to-cyan-500',
    bg: 'bg-blue-50/50',
    text: 'text-blue-600',
    border: 'border-blue-200/50',
    shadow: 'shadow-blue-500/10',
    glow: 'group-hover:shadow-blue-500/30'
  },
  orange: {
    gradient: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50/50',
    text: 'text-orange-600',
    border: 'border-orange-200/50',
    shadow: 'shadow-orange-500/10',
    glow: 'group-hover:shadow-orange-500/30'
  },
  purple: {
    gradient: 'from-purple-600 to-indigo-500',
    bg: 'bg-purple-50/50',
    text: 'text-purple-600',
    border: 'border-purple-200/50',
    shadow: 'shadow-purple-500/10',
    glow: 'group-hover:shadow-purple-500/30'
  },
  green: {
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50/50',
    text: 'text-emerald-600',
    border: 'border-emerald-200/50',
    shadow: 'shadow-emerald-500/10',
    glow: 'group-hover:shadow-emerald-500/30'
  },
  red: {
    gradient: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50/50',
    text: 'text-rose-600',
    border: 'border-rose-200/50',
    shadow: 'shadow-rose-500/10',
    glow: 'group-hover:shadow-rose-500/30'
  },
  gray: {
    gradient: 'from-slate-600 to-gray-500',
    bg: 'bg-slate-50/50',
    text: 'text-slate-600',
    border: 'border-slate-200/50',
    shadow: 'shadow-slate-500/10',
    glow: 'group-hover:shadow-slate-500/30'
  }
}

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services')
        if (response.ok) {
          const data = await response.json()
          setServices(data.services || [])
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 selection:bg-primary-500 selection:text-white overflow-x-hidden pt-28">
      
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Hero Section - Immersive */}
      <div className="relative h-[60vh] min-h-[500px] bg-gray-900 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
            alt="Services Hero"
            fill
            className="object-cover opacity-60 scale-105 animate-slow-zoom"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-50" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <SparklesIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-white/90 text-sm font-medium tracking-wide">نبتكر لأجلك</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 font-heading leading-tight tracking-tight">
              خدمات عقارية <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
                بمعايير عالمية
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light mb-12">
              نجمع بين الخبرة العريقة والحلول المبتكرة لنقدم لك تجربة استثنائية تفوق التوقعات.
            </p>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 text-white/50"
            >
              <ArrowDownIcon className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Services Grid - The "Genius" Layout */}
      <div className="container mx-auto px-4 py-24 relative z-10 -mt-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white/50 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-6"></div>
            <p className="text-gray-600 font-medium text-lg">جاري تجهيز الخدمات...</p>
          </div>
        ) : (
          <>
            {/* First Row - 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {services.slice(0, 3).map((service, index) => {
                const Icon = iconMap[service.iconName] || BuildingOfficeIcon
                const colors = colorMap[service.color] || colorMap.blue

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    whileHover={{ y: -10 }}
                    className={`group relative bg-white rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-full ${colors.glow}`}
                  >
                    {/* Image Section with Overlay */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={service.heroImage || '/images/placeholder.jpg'}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />
                      
                      {/* Floating Icon Badge */}
                      <div className={`absolute top-6 right-6 ${colors.bg} backdrop-blur-md p-4 rounded-2xl shadow-lg border ${colors.border} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-8 h-8 ${colors.text}`} />
                      </div>

                      {/* Title Overlay on Image */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
                          {service.title}
                        </h3>
                        <div className={`h-1 w-12 bg-gradient-to-r ${colors.gradient} rounded-full group-hover:w-24 transition-all duration-500`} />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 flex-1 flex flex-col bg-white relative z-10">
                      <p className="text-gray-600 text-base mb-8 leading-relaxed line-clamp-3 flex-1 font-light">
                        {service.description}
                      </p>

                      {/* Action Button - Modern & Sleek */}
                      <Link 
                        href={`/services/${service.slug}`}
                        className={`group/btn relative w-full inline-flex items-center justify-center px-6 py-4 bg-gray-50 text-gray-900 font-bold rounded-xl overflow-hidden transition-all duration-300 hover:text-white shadow-sm hover:shadow-lg border border-gray-100`}
                      >
                        <span className={`absolute inset-0 w-full h-full bg-gradient-to-r ${colors.gradient} opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 ease-out`} />
                        <span className="relative flex items-center gap-2">
                          <span>اكتشف المزيد</span>
                          <ArrowRightIcon className="w-5 h-5 group-hover/btn:-translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Second Row - 2 Cards Centered */}
            <div className="flex flex-col md:flex-row justify-center gap-8">
              {services.slice(3, 5).map((service, index) => {
                const Icon = iconMap[service.iconName] || BuildingOfficeIcon
                const colors = colorMap[service.color] || colorMap.blue

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: (index + 3) * 0.15 }}
                    whileHover={{ y: -10 }}
                    className={`group relative bg-white rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-full w-full md:max-w-md ${colors.glow}`}
                  >
                    {/* Image Section */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={service.heroImage || '/images/placeholder.jpg'}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />
                      
                      <div className={`absolute top-6 right-6 ${colors.bg} backdrop-blur-md p-4 rounded-2xl shadow-lg border ${colors.border} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-8 h-8 ${colors.text}`} />
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
                          {service.title}
                        </h3>
                        <div className={`h-1 w-12 bg-gradient-to-r ${colors.gradient} rounded-full group-hover:w-24 transition-all duration-500`} />
                      </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col bg-white relative z-10">
                      <p className="text-gray-600 text-base mb-8 leading-relaxed line-clamp-3 flex-1 font-light">
                        {service.description}
                      </p>

                      <Link 
                        href={`/services/${service.slug}`}
                        className={`group/btn relative w-full inline-flex items-center justify-center px-6 py-4 bg-gray-50 text-gray-900 font-bold rounded-xl overflow-hidden transition-all duration-300 hover:text-white shadow-sm hover:shadow-lg border border-gray-100`}
                      >
                        <span className={`absolute inset-0 w-full h-full bg-gradient-to-r ${colors.gradient} opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 ease-out`} />
                        <span className="relative flex items-center gap-2">
                          <span>اكتشف المزيد</span>
                          <ArrowRightIcon className="w-5 h-5 group-hover/btn:-translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Why Choose Us - Bento Grid Style */}
      <div className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-primary-600 font-bold tracking-wider uppercase text-sm mb-4 block">لماذا نحن؟</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">التميز هو معيارنا الوحيد</h2>
            <p className="text-gray-500 text-lg font-light">نلتزم بتقديم تجربة استثنائية تجمع بين الجودة والاحترافية في كل خطوة.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: TrophyIcon,
                title: 'خبرة وريادة',
                desc: 'سنوات من التميز في السوق العقاري المصري، نقدم خلالها حلولاً مبتكرة.',
                bg: 'bg-blue-50',
                text: 'text-blue-600'
              },
              {
                icon: UserGroupIcon,
                title: 'فريق متخصص',
                desc: 'نخبة من الخبراء والاستشاريين لضمان أفضل النتائج لمشروعك.',
                bg: 'bg-purple-50',
                text: 'text-purple-600'
              },
              {
                icon: ShieldCheckIcon,
                title: 'موطوقية وأمان',
                desc: 'نلتزم بأعلى معايير الشفافية والمصداقية في جميع تعاملاتنا.',
                bg: 'bg-emerald-50',
                text: 'text-emerald-600'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -5 }}
                className="relative p-10 rounded-[2.5rem] bg-gray-50 hover:bg-white hover:shadow-2xl transition-all duration-500 border border-gray-100 group overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${feature.bg} rounded-bl-[100px] -mr-10 -mt-10 opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out`} />
                
                <div className={`relative w-16 h-16 ${feature.bg} ${feature.text} rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform duration-300 shadow-sm`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - Modern Glass */}
      <div className="container mx-auto px-4 py-24">
        <div className="relative rounded-[3rem] overflow-hidden p-12 md:p-24 text-center">
          <Image
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2070&auto=format&fit=crop"
            alt="CTA Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              هل أنت مستعد لبدء <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">رحلة النجاح؟</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 font-light">
              فريقنا جاهز للرد على استفساراتك وتقديم الاستشارة المناسبة لاحتياجاتك.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/contact"
                className="px-10 py-4 bg-white text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg hover:shadow-white/20"
              >
                تواصل معنا الآن
              </Link>
              <Link
                href="/projects"
                className="px-10 py-4 bg-transparent border border-white/30 text-white rounded-2xl font-bold hover:bg-white/10 transition-all hover:scale-105 backdrop-blur-md"
              >
                تصفح المشاريع
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
