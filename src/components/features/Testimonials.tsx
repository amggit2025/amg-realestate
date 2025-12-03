'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { StarIcon } from '@heroicons/react/24/solid'
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface TestimonialStats {
  happyClients: number
  satisfactionRate: number
  averageRating: number
  yearsOfExperience: number
}

interface Testimonial {
  id: string
  content: string
  clientName: string
  position: string
  location?: string
  image?: string
  rating: number
  featured: boolean
  published: boolean
  order: number
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<TestimonialStats>({
    happyClients: 5000,
    satisfactionRate: 99,
    averageRating: 4.9,
    yearsOfExperience: 15
  })

  useEffect(() => {
    // جلب الآراء من الـ database
    const fetchTestimonials = async () => {
      try {
        // @ts-ignore
        const res = await fetch('/api/testimonials?featured=true&published=true')
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setTestimonials(data)
          }
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error)
      } finally {
        setLoading(false)
      }
    }

    // جلب الإحصائيات من API
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/testimonial-stats')
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.data) {
            setStats({
              happyClients: data.data.happyClients,
              satisfactionRate: data.data.satisfactionRate,
              averageRating: data.data.averageRating,
              yearsOfExperience: data.data.yearsOfExperience
            })
          }
        }
      } catch (err) {
        console.error('Error fetching testimonial stats:', err)
      }
    }

    fetchTestimonials()
    fetchStats()
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  if (loading || testimonials.length === 0) {
    return null
  }

  const activeTestimonial = testimonials[currentIndex]

  return (
    <section className="relative py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-4 py-2 rounded-full text-xs font-bold mb-4 shadow-sm"
          >
            <StarIcon className="w-4 h-4 text-orange-500" />
            آراء عملائنا
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            ماذا يقول
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent"> عملاؤنا</span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            آراء حقيقية من عملاء سعداء بخدماتنا المتميزة
          </p>
        </motion.div>

        {/* Main Testimonial Card */}
        <div className="max-w-2xl mx-auto mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="relative pt-16"
            >
              {/* Client Image - Floating on top */}
              <div className="absolute left-1/2 top-0 transform -translate-x-1/2 z-20">
                {activeTestimonial.image ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full blur-md opacity-30"></div>
                    <div className="relative w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                      <Image
                        src={activeTestimonial.image}
                        alt={activeTestimonial.clientName}
                        width={112}
                        height={112}
                        className="rounded-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full blur-md opacity-30"></div>
                    <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-xl relative z-10">
                      {activeTestimonial.clientName.charAt(0)}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="bg-white rounded-3xl shadow-lg p-8 pt-20 relative">
                {/* Decorative corners */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-orange-400 rounded-tl-2xl"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-orange-400 rounded-br-2xl"></div>

                {/* Testimonial Text */}
                <blockquote className="text-sm md:text-base text-gray-600 leading-relaxed mb-6 text-center italic px-4">
                  "{activeTestimonial.content}"
                </blockquote>

                {/* Client Name */}
                <div className="text-center mb-3">
                  <h4 className="text-lg md:text-xl font-bold text-blue-800">
                    {activeTestimonial.clientName}
                  </h4>
                  <p className="text-sm text-gray-500 font-medium">
                    {activeTestimonial.position}
                  </p>
                  {activeTestimonial.location && (
                    <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mt-1">
                      <MapPinIcon className="w-3 h-3" />
                      {activeTestimonial.location}
                    </div>
                  )}
                </div>

                {/* Rating Stars */}
                <div className="flex justify-center gap-1">
                  {[...Array(activeTestimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevTestimonial}
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-orange-50 hover:shadow-lg transition-all group"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors" />
          </motion.button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex 
                    ? 'w-8 h-2 bg-gradient-to-r from-orange-500 to-amber-500' 
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextTestimonial}
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-orange-50 hover:shadow-lg transition-all group"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors" />
          </motion.button>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {[
            { 
              value: `${stats.happyClients.toLocaleString()}+`, 
              label: 'عميل سعيد', 
              color: 'from-blue-500 to-cyan-500',
              icon: '😊'
            },
            { 
              value: `${stats.satisfactionRate}%`, 
              label: 'نسبة الرضا', 
              color: 'from-green-500 to-emerald-500',
              icon: '✓'
            },
            { 
              value: `${stats.averageRating}/5`, 
              label: 'التقييم', 
              color: 'from-yellow-500 to-amber-500',
              icon: '⭐'
            },
            { 
              value: `${stats.yearsOfExperience}+`, 
              label: 'سنة خبرة', 
              color: 'from-purple-500 to-pink-500',
              icon: '🏆'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 text-center shadow-md hover:shadow-lg transition-all border border-white/50">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className={`text-2xl md:text-3xl font-black mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 font-semibold text-xs md:text-sm">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  )
}
