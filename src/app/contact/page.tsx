'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import ContactForm from '@/components/features/ContactForm'
import FreeMap from '@/components/ui/FreeMap'
import { logger } from '@/lib/logger'
import { 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  ArrowLongLeftIcon
} from '@heroicons/react/24/outline'
import { COMPANY_INFO } from '@/lib/constants'
import SEOHead from '@/components/SEOHead'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface SocialLinksData {
  facebook?: string
  instagram?: string
  linkedin?: string
  tiktok?: string;
  twitter?: string;
  youtube?: string;
  whatsapp?: string;
  snapchat?: string;
}

export default function ContactPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLinksData>({})
  const containerRef = useRef(null)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 150])

  useEffect(() => {
    fetchSocialLinks()
  }, [])

  const fetchSocialLinks = async () => {
    try {
      const response = await fetch('/api/social-links')
      const result = await response.json()
      
      if (result.success && result.data) {
        setSocialLinks(result.data)
      }
    } catch (error) {
      logger.error('Error fetching social links:', error)
    }
  }

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'اتصل بنا',
      value: COMPANY_INFO.phone,
      subValue: 'متاح 24/7 لخدمتكم',
      action: `tel:${COMPANY_INFO.phone}`,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: EnvelopeIcon,
      title: 'راسلنا',
      value: COMPANY_INFO.email,
      subValue: 'نرد خلال 24 ساعة',
      action: `mailto:${COMPANY_INFO.email}`,
      color: 'bg-amber-50 text-amber-600'
    },
    {
      icon: MapPinIcon,
      title: 'زرنا',
      value: COMPANY_INFO.address,
      subValue: 'القاهرة الجديدة، مصر',
      action: '#map',
      color: 'bg-emerald-50 text-emerald-600'
    }
  ]

  return (
    <>
      <SEOHead 
        title="تواصل معنا - مجموعة أحمد الملاح"
        description="تواصل مع فريق مجموعة أحمد الملاح للاستفسار عن خدماتنا العقارية والمقاولات. نحن هنا لمساعدتك."
      />

      <main ref={containerRef} className="bg-slate-50 min-h-screen">
        
        {/* 1. Luxury Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <motion.div 
            style={{ y: heroY }}
            className="absolute inset-0 z-0"
          >
            <Image
              src="/images/contact-hero-luxury.jpg"
              alt="Contact Us"
              fill
              className="object-cover brightness-[0.6]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/30 to-slate-50" />
          </motion.div>

          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                تواصل <span className="text-amber-400">معنا</span>
              </h1>
              <p className="text-xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
                نحن هنا للاستماع إليك. سواء كان لديك استفسار عن مشروع، أو ترغب في استشارة عقارية، فريقنا جاهز لخدمتك.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 2. Floating Contact Cards */}
        <section className="relative z-20 -mt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.action}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 group"
                >
                  <div className={`w-16 h-16 ${info.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <info.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{info.title}</h3>
                  <p className="text-lg font-medium text-slate-700 mb-1 dir-ltr text-right">{info.value}</p>
                  <p className="text-sm text-slate-400">{info.subValue}</p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Main Content: Form & Map */}
        <section className="py-10 pb-32">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-16">
              
              {/* Left: Contact Form */}
              <div className="lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-slate-100"
                >
                  <div className="mb-10">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">أرسل لنا رسالة</h2>
                    <p className="text-slate-500">
                      املأ النموذج أدناه وسنقوم بالرد عليك في أقرب وقت ممكن.
                    </p>
                  </div>
                  
                  <ContactForm className="space-y-6" />
                </motion.div>
              </div>

              {/* Right: Map & Info */}
              <div className="lg:w-1/2 space-y-12">
                {/* Map */}
                <motion.div
                  id="map"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="h-[400px] rounded-3xl overflow-hidden shadow-lg border-4 border-white relative"
                >
                  <FreeMap className="h-full w-full" />
                  {/* Overlay Card */}
                  <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg max-w-xs z-[1000]">
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">مقرنا الرئيسي</h4>
                        <p className="text-xs text-slate-600 mt-1">{COMPANY_INFO.address}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Working Hours */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10" />
                  
                  <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      <ClockIcon className="w-6 h-6 text-amber-400" />
                    </div>
                    <h3 className="text-2xl font-bold">ساعات العمل</h3>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className="text-slate-300">السبت - الخميس</span>
                      <span className="font-bold text-white">9:00 ص - 10:00 م</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className="text-slate-300">الجمعة</span>
                      <span className="font-bold text-amber-400">مغلق (عطلة رسمية)</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-4">
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                      <ChatBubbleLeftRightIcon className="w-5 h-5" />
                      خدمة العملاء متاحة عبر الهاتف طوال أيام الأسبوع
                    </p>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

      </main>
    </>
  )
}