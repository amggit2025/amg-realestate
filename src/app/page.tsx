'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Search, 
  ArrowRight, 
  Building2, 
  Key, 
  TrendingUp, 
  ShieldCheck, 
  MapPin,
  Home
} from 'lucide-react'

// Components
import FeaturedProjects from '@/components/features/FeaturedProjects'
import PortfolioShowcase from '@/components/features/PortfolioShowcase'
import Testimonials from '@/components/features/Testimonials'
import CallToAction from '@/components/features/CallToAction'

export default function HomePage() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  
  // Search state
  const [searchLocation, setSearchLocation] = useState('')
  const [searchType, setSearchType] = useState('')
  
  // Handle search
  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchLocation) params.append('location', searchLocation)
    if (searchType) params.append('type', searchType)
    
    const queryString = params.toString()
    // البحث يروح لصفحة العقارات (listings) مش المشاريع (projects)
    window.location.href = `/listings${queryString ? `?${queryString}` : ''}`
  }
  
  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }
  
  return (
    <main className="bg-white overflow-hidden">
      {/* 1. Genius Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white z-10" />
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2560&q=95"
            alt="Luxury Home"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-4 pt-20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6">
                ✨ اكتشف مستقبل العقارات
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight tracking-tight">
                استثمارك الأمـن <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">
                  لمستقبل أفضـل
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
                نقدم لك تجربة عقارية استثنائية تجمع بين الفخامة والراحة. اكتشف مجموعة حصرية من أرقى العقارات في مصر.
              </p>
            </motion.div>

            {/* Smart Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white p-2 rounded-2xl shadow-2xl max-w-4xl mx-auto transform hover:scale-[1.01] transition-transform duration-300"
            >
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative group">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="الموقع (مثال: التجمع الخامس)" 
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full h-14 pr-12 pl-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100 text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
                <div className="flex-1 relative group">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <Home className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <select 
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-full h-14 pr-12 pl-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100 text-gray-900 appearance-none cursor-pointer transition-all"
                  >
                    <option value="">نوع العقار</option>
                    <option value="RESIDENTIAL">شقة سكنية</option>
                    <option value="COMMERCIAL">مكتب إداري</option>
                    <option value="MIXED_USE">مختلط</option>
                  </select>
                </div>
                <button 
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 hover:shadow-xl active:scale-95"
                >
                  <Search className="w-5 h-5" />
                  بحث
                </button>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16"
            >
              {[
                { label: 'عميل سعيد', value: '+500' },
                { label: 'مشروع مكتمل', value: '+200' },
                { label: 'سنة خبرة', value: '+15' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Bento Grid Services Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">خدماتنا المتكاملة</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">نقدم حلولاً عقارية شاملة تلبي كافة احتياجاتك، من البحث عن العقار المثالي وحتى استلام المفتاح.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Large Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-blue-600/20">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">التطوير العقاري</h3>
                <p className="text-gray-600 mb-6 max-w-md">نطور مشاريع سكنية وتجارية بمعايير عالمية، نركز على الجودة والابتكار في التصميم لنقدم لك أسلوب حياة فريد.</p>
                <Link href="/projects" className="inline-flex items-center text-blue-600 font-semibold hover:gap-2 transition-all">
                  عرض مشاريعنا <ArrowRight className="w-4 h-4 mr-2" />
                </Link>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/50 to-transparent" />
            </motion.div>

            {/* Tall Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden md:row-span-2 flex flex-col justify-between group"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">الاستثمار العقاري</h3>
                <p className="text-gray-300 mb-6">فرص استثمارية مدروسة بعناية لتحقيق أعلى عائد على الاستثمار.</p>
              </div>
              <Link href="/contact" className="relative z-10 w-full py-4 bg-white text-gray-900 rounded-xl font-bold text-center hover:bg-gray-100 transition-colors">
                استشر خبير
              </Link>
            </motion.div>

            {/* Medium Card 1 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 group"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 text-orange-600 group-hover:scale-110 transition-transform">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">الوساطة العقارية</h3>
              <p className="text-gray-600 text-sm">نساعدك في بيع أو شراء عقارك بأفضل الأسعار في السوق.</p>
            </motion.div>

            {/* Medium Card 2 */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 text-green-600 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">إدارة الأملاك</h3>
              <p className="text-gray-600 text-sm">خدمات إدارة شاملة تحافظ على قيمة عقارك وتضمن عائداً مستمراً.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Featured Projects */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">مشاريع مميزة</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">أحدث العقارات المضافة</h2>
            </div>
            <Link href="/projects" className="hidden md:flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
              عرض كل المشاريع <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <FeaturedProjects />
          
          <div className="mt-12 text-center md:hidden">
            <Link href="/projects" className="inline-flex items-center gap-2 text-blue-600 font-medium">
              عرض كل المشاريع <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Portfolio Showcase */}
      <PortfolioShowcase />

      {/* 5. Testimonials */}
      <Testimonials />

      {/* 6. Call To Action */}
      <CallToAction />
    </main>
  )
}
