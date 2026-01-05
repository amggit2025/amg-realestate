'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ShoppingBagIcon, 
  StarIcon, 
  ArrowRightIcon, 
  EnvelopeIcon,
  CheckCircleIcon,
  PlayIcon
} from '@heroicons/react/24/solid'
import { 
  TruckIcon, 
  ShieldCheckIcon, 
  CreditCardIcon, 
  ArrowPathIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

// Mock Data for Preview
const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: 'كنبة مودرن إيطالي',
    price: '25,000',
    category: 'أثاث منزلي',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    rating: 4.9
  },
  {
    id: 2,
    name: 'مكتب مدير تنفيذي',
    price: '18,500',
    category: 'أثاث مكتبي',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
    rating: 4.8
  },
  {
    id: 3,
    name: 'وحدة إضاءة معلقة',
    price: '3,200',
    category: 'ديكور',
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80',
    rating: 4.7
  },
  {
    id: 4,
    name: 'كرسي استرخاء جلد',
    price: '12,000',
    category: 'أثاث منزلي',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
    rating: 4.9
  }
]

const BRANDS = [
  'IKEA', 'Herman Miller', 'Ashley', 'Roche Bobois', 'Natuzzi', 'Kartell', 'Vitra', 'Knoll'
]

export default function StorePage() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => setSubscribed(false), 3000)
      setEmail('')
    }
  }

  return (
    <main className="min-h-screen bg-white selection:bg-amber-500 selection:text-white">
      
      {/* 1. Cinematic Hero Section */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        {/* Background Parallax */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />
          <Image
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=85"
            alt="Luxury Interior"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 text-sm font-medium mb-8">
              <SparklesIcon className="w-4 h-4" />
              <span>قريباً الافتتاح الكبير</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight leading-tight">
              أعد تعريف <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">
                مساحتك الخاصة
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              متجر AMG الإلكتروني. وجهتك الأولى للأثاث الفاخر، الديكور العصري، وحلول التشطيب المتكاملة.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  أخبرني عند الإطلاق
                  <EnvelopeIcon className="w-5 h-5" />
                </span>
              </button>
              
              <Link 
                href="/services"
                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all"
              >
                تصفح خدماتنا الحالية
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-xs tracking-widest uppercase">اكتشف المزيد</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
        </motion.div>
      </section>

      {/* 2. Brands Ticker (Infinite Scroll) */}
      <section className="py-10 bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="flex gap-16 animate-scroll whitespace-nowrap">
          {[...BRANDS, ...BRANDS, ...BRANDS].map((brand, i) => (
            <span key={i} className="text-2xl font-bold text-slate-700 uppercase tracking-widest select-none">
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* 3. Bento Grid Categories */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">تصفح الأقسام</h2>
            <p className="text-slate-500 text-lg">كل ما يحتاجه منزلك في مكان واحد</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-[1200px] md:h-[800px]">
            {/* Large Item - Furniture */}
            <Link href="/store/products?category=furniture" className="md:col-span-2 md:row-span-2">
              <motion.div 
                whileHover={{ scale: 0.98 }}
                className="relative rounded-3xl overflow-hidden group cursor-pointer h-full"
              >
                <Image 
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80" 
                  alt="Furniture" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <span className="text-amber-400 font-medium mb-2 block">الأكثر طلباً</span>
                  <h3 className="text-4xl font-bold text-white mb-2">الأثاث المنزلي</h3>
                  <p className="text-gray-300 mb-6 max-w-md">تشكيلة واسعة من غرف النوم، المعيشة، والسفرة بتصاميم عالمية.</p>
                  <span className="inline-flex items-center gap-2 text-white font-bold border-b border-amber-500 pb-1">
                    استكشف المجموعة <ArrowRightIcon className="w-4 h-4" />
                  </span>
                </div>
              </motion.div>
            </Link>

            {/* Medium Item - Kitchens */}
            <Link href="/store/products?category=kitchens" className="md:col-span-2">
              <motion.div 
                whileHover={{ scale: 0.98 }}
                className="relative rounded-3xl overflow-hidden group cursor-pointer h-full"
              >
                <Image 
                  src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80" 
                  alt="Kitchens" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-1">المطابخ العصرية</h3>
                  <p className="text-gray-300 text-sm">تصاميم ذكية وعملية</p>
                </div>
              </motion.div>
            </Link>

            {/* Small Item - Office */}
            <Link href="/store/products?category=office" className="block">
              <motion.div 
                whileHover={{ scale: 0.98 }}
                className="relative rounded-3xl overflow-hidden group cursor-pointer h-full"
              >
                <Image 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" 
                  alt="Office" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-xl font-bold text-white">المكاتب</h3>
                </div>
              </motion.div>
            </Link>

            {/* Small Item - Decor */}
            <Link href="/store/products?category=decor" className="block">
              <motion.div 
                whileHover={{ scale: 0.98 }}
                className="relative rounded-3xl overflow-hidden group cursor-pointer h-full"
              >
                <Image 
                  src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80" 
                  alt="Decor" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-xl font-bold text-white">الديكور</h3>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Featured Products Preview */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-2">وصل حديثاً</h2>
              <p className="text-slate-500">نظرة خاطفة على منتجاتنا الحصرية</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-slate-900 font-bold hover:text-amber-600 transition-colors">
              عرض الكل <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURED_PRODUCTS.map((product) => (
              <div key={product.id} className="group">
                <div className="relative aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden mb-6">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900">
                    جديد
                  </div>
                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all shadow-xl hover:bg-amber-500 hover:text-white">
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                      <StarIcon className="w-4 h-4" />
                      {product.rating}
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm mb-2">{product.category}</p>
                  <p className="text-xl font-black text-slate-900">{product.price} ج.م</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Features / Trust Indicators */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: TruckIcon, title: 'شحن سريع وآمن', desc: 'تغطية شاملة لجميع المحافظات' },
              { icon: ShieldCheckIcon, title: 'ضمان حقيقي', desc: 'ضمان شامل على عيوب الصناعة' },
              { icon: CreditCardIcon, title: 'طرق دفع متعددة', desc: 'كاش، فيزا، وتقسيط مريح' },
              { icon: ArrowPathIcon, title: 'سياسة استرجاع', desc: '14 يوم استرجاع مجاني' },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-amber-500">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Newsletter / Coming Soon CTA */}
      <section id="newsletter" className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=85')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              كن أول من يعلم
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              سجل بريدك الإلكتروني الآن واحصل على خصم حصري <span className="text-amber-400 font-bold">15%</span> عند الافتتاح، بالإضافة إلى أولوية الوصول للمنتجات الجديدة.
            </p>

            <form onSubmit={handleSubscribe} className="relative max-w-md mx-auto">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-5 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:bg-white/20 transition-all backdrop-blur-md"
                required
              />
              <button
                type="submit"
                className="absolute left-2 top-2 bottom-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-6 rounded-full transition-colors flex items-center gap-2"
              >
                {subscribed ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    تم التسجيل
                  </>
                ) : (
                  <>
                    اشتراك
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
            <p className="text-gray-500 text-sm mt-6">
              نحترم خصوصيتك. لا رسائل مزعجة أبداً.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
