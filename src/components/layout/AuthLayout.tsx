'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface AuthLayoutProps {
  children: React.ReactNode
  type: 'login' | 'register'
}

// صور العقارات للعرض في الخلفية
const backgroundImages = [
  {
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075',
    title: 'فيلا فاخرة',
    location: 'القاهرة الجديدة'
  },
  {
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053',
    title: 'شقة عصرية',
    location: 'الشيخ زايد'
  },
  {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070',
    title: 'قصر ملكي',
    location: 'التجمع الخامس'
  },
  {
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071',
    title: 'فيلا مودرن',
    location: 'العين السخنة'
  }
]

// إحصائيات الشركة
const stats = [
  { number: '500+', label: 'عقار متاح' },
  { number: '1000+', label: 'عميل سعيد' },
  { number: '50+', label: 'مشروع منجز' },
]

export default function AuthLayout({ children, type }: AuthLayoutProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  // تغيير الصورة كل 5 ثواني
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const currentImage = backgroundImages[currentImageIndex]

  return (
    <div className="min-h-screen flex">
      {/* الجانب الأيسر - الصورة (مخفي في الموبايل) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        {/* صور الخلفية المتحركة */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <Image
              src={currentImage.url}
              alt={currentImage.title}
              fill
              className="object-cover"
              priority
              onLoad={() => setIsImageLoaded(true)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30" />

        {/* المحتوى فوق الصورة */}
        <div className="relative z-10 flex flex-col justify-between p-8 xl:p-12 w-full">

          {/* المحتوى الرئيسي */}
          <div className="my-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                {type === 'login' ? (
                  <>
                    مرحباً بعودتك
                    <br />
                    <span className="text-blue-400">إلى منزلك</span>
                  </>
                ) : (
                  <>
                    ابدأ رحلتك
                    <br />
                    <span className="text-blue-400">نحو منزل أحلامك</span>
                  </>
                )}
              </h2>
              
              <p className="text-white/80 text-lg max-w-md leading-relaxed">
                {type === 'login' 
                  ? 'سجل دخولك لإدارة عقاراتك ومتابعة طلباتك واكتشاف العروض الحصرية.'
                  : 'انضم إلى آلاف العملاء الذين وجدوا منزل أحلامهم معنا. سجل الآن واحصل على مميزات حصرية.'
                }
              </p>
            </motion.div>

            {/* معلومات العقار الحالي */}
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 max-w-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden relative">
                  <Image
                    src={currentImage.url}
                    alt={currentImage.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{currentImage.title}</h3>
                  <p className="text-white/70 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {currentImage.location}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* الإحصائيات والـ Dots في الأسفل */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6">
            {/* الإحصائيات */}
            <div className="flex gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl xl:text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-white/60 text-xs">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Dots للتنقل بين الصور */}
            <div className="flex gap-2">
              {backgroundImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-white w-8' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* الجانب الأيمن - الفورم */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col">
        {/* Header للموبايل */}
        <div className="lg:hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">A</span>
              </div>
              <span className="text-white font-bold">AMG Real Estate</span>
            </Link>
            <Link href="/" className="text-white/80 text-sm">
              العودة ←
            </Link>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-white">
              {type === 'login' ? 'مرحباً بعودتك' : 'إنشاء حساب جديد'}
            </h2>
            <p className="text-white/80 text-sm mt-1">
              {type === 'login' ? 'سجل دخولك للمتابعة' : 'انضم إلى مجتمع AMG'}
            </p>
          </div>
        </div>

        {/* الفورم */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-8 xl:p-12 bg-gray-50 lg:bg-white">
          <div className="w-full max-w-md">
            {/* Header للديسكتوب */}
            <div className="hidden lg:block mb-8">
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl xl:text-3xl font-bold text-gray-900"
              >
                {type === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 mt-2"
              >
                {type === 'login' 
                  ? 'أدخل بياناتك للوصول إلى حسابك'
                  : 'أكمل البيانات التالية لإنشاء حسابك'
                }
              </motion.p>
            </div>

            {/* محتوى الفورم */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {children}
            </motion.div>

            {/* التبديل بين Login/Register */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-600">
                {type === 'login' ? (
                  <>
                    ليس لديك حساب؟{' '}
                    <Link href="/auth/register" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                      إنشاء حساب جديد
                    </Link>
                  </>
                ) : (
                  <>
                    لديك حساب بالفعل؟{' '}
                    <Link href="/auth/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                      تسجيل الدخول
                    </Link>
                  </>
                )}
              </p>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 pt-8 border-t border-gray-200 text-center"
            >
              <p className="text-gray-500 text-sm">
                بالمتابعة، أنت توافق على{' '}
                <Link href="/terms" className="text-blue-600 hover:underline">شروط الخدمة</Link>
                {' '}و{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">سياسة الخصوصية</Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
