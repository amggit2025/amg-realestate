'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ChromeOptimizedMotion } from '@/components/ui/ChromeOptimizedMotion'

interface HeroStats {
  yearsOfExperience: number
  completedProjects: number
  happyClients: number
  clientSatisfaction: number
  heroImage?: string
  heroImagePublicId?: string
}

export default function Hero() {
  const [stats, setStats] = useState<HeroStats>({
    yearsOfExperience: 15,
    completedProjects: 200,
    happyClients: 500,
    clientSatisfaction: 98,
    heroImage: ''
  })

  useEffect(() => {
    // جلب الإحصائيات من API
    fetch('/api/hero-stats')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setStats({
            yearsOfExperience: data.data.yearsOfExperience,
            completedProjects: data.data.completedProjects,
            happyClients: data.data.happyClients,
            clientSatisfaction: data.data.clientSatisfaction,
            heroImage: data.data.heroImage || ''
          })
        }
      })
      .catch(err => console.error('Error fetching hero stats:', err))
  }, [])
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Real Estate Background Image */}
      <div className="absolute inset-0">
        <Image
          src={stats.heroImage || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2560&q=95"}
          alt="AMG Real Estate - Luxury Modern Architecture"
          fill
          className="object-cover brightness-105 saturate-110"
          priority
          quality={95}
          sizes="100vw"
        />
        {/* Overlay خفيف جداً */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-blue-900/35 to-slate-900/40" />
      </div>
      
      {/* Geometric Pattern Overlay - أخف */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="heroPattern" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="1"/>
              <circle cx="40" cy="40" r="2" fill="white" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroPattern)" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <ChromeOptimizedMotion
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="chrome-stagger-fix"
        >
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl">
            <span className="block text-white drop-shadow-lg">مستقبل</span>
            <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent drop-shadow-xl">
              العقارات
            </span>
            <span className="block text-white drop-shadow-lg">يبدأ هنا</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-medium">
            نحن نبني أحلامك ونحول رؤيتك إلى واقع ملموس. مع AMG، استثمارك العقاري في أيدٍ أمينة.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/projects"
              className="group bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-xl"
            >
              <span className="flex items-center gap-2">
                استكشف مشاريعنا
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link
              href="/contact"
              className="group bg-white/20 backdrop-blur-md border-2 border-white/50 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-white/30 hover:scale-105 shadow-xl"
            >
              تواصل معنا
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2 drop-shadow-lg">{stats.yearsOfExperience}+</div>
              <div className="text-sm text-white font-medium">سنة خبرة</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-2 drop-shadow-lg">{stats.completedProjects}+</div>
              <div className="text-sm text-white font-medium">مشروع منجز</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2 drop-shadow-lg">{stats.happyClients}+</div>
              <div className="text-sm text-white font-medium">عميل سعيد</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2 drop-shadow-lg">{stats.clientSatisfaction}%</div>
              <div className="text-sm text-white font-medium">رضا العملاء</div>
            </div>
          </div>
        </ChromeOptimizedMotion>
      </div>

      {/* Scroll Down Arrow */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <svg 
          className="w-8 h-8 text-white/80 hover:text-white transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  )
}
