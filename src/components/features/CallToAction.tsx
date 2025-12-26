'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  MessageCircle,
  Calendar
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface FooterInfo {
  title: string
  subtitle: string
  yearsExperience: number
  happyClients: number
  completedProjects: number
  contactPhone: string
  contactEmail: string
  address: string
  whatsapp?: string
}

export default function CallToAction() {
  const [footerInfo, setFooterInfo] = useState<FooterInfo>({
    title: "🏆 AMG Real Estate - شريكك الموثوق في عالم العقارات",
    subtitle: "ابدأ رحلتك العقارية معنا اليوم",
    yearsExperience: 15,
    happyClients: 5000,
    completedProjects: 200,
    contactPhone: "+20 100 123 4567",
    contactEmail: "info@amg-invest.com",
    address: "القاهرة الجديدة",
  })

  useEffect(() => {
    const fetchFooterInfo = async () => {
      try {
        const response = await fetch('/api/footer-info')
        const data = await response.json()
        if (data.success && data.data) {
          setFooterInfo(data.data)
        }
      } catch (error) {
        console.error('Error fetching footer info:', error)
      }
    }

    fetchFooterInfo()
  }, [])

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-purple-900/95 z-10" />
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80')] bg-cover bg-center bg-no-repeat bg-fixed opacity-30 grayscale mix-blend-overlay"
        />
      </div>

      {/* Animated Shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-500/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-right"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-blue-300 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                مستعدون لخدمتك
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                هل أنت جاهز <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  لتحقيق حلمك؟
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                سواء كنت تبحث عن منزل أحلامك أو فرصة استثمارية مميزة، فريقنا من الخبراء مستعد لمساعدتك في كل خطوة.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <button className="group relative inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold overflow-hidden transition-all hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:-translate-y-1">
                    <span className="relative z-10">تواصل معنا الآن</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                
                <Link href="/book-appointment">
                  <button className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all hover:-translate-y-1">
                    <Calendar className="w-5 h-5" />
                    <span>حجز موعد</span>
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Contact Cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid gap-6"
            >
              {/* Phone Card */}
              <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">اتصل بنا مباشرة</div>
                    <div className="text-xl font-bold text-white font-mono" dir="ltr">{footerInfo.contactPhone}</div>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">راسلنا عبر البريد</div>
                    <div className="text-xl font-bold text-white">{footerInfo.contactEmail}</div>
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/30">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">تفضل بزيارتنا</div>
                    <div className="text-xl font-bold text-white">{footerInfo.address}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-20 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { label: 'سنة خبرة', value: `+${footerInfo.yearsExperience}` },
              { label: 'عميل راضي', value: `+${footerInfo.happyClients}` },
              { label: 'مشروع منجز', value: `+${footerInfo.completedProjects}` },
              { label: 'جائزة تميز', value: '+12' },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
