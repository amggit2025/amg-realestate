'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  MapPin,
  User,
  ThumbsUp,
  Award,
  Smile
} from 'lucide-react'
import { useState, useEffect, memo } from 'react'
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

function Testimonials() {
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
    <section className="relative py-32 bg-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Content & Stats */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="flex items-center gap-2 text-blue-400 font-semibold tracking-wider uppercase text-sm mb-4">
                <span className="w-8 h-[2px] bg-blue-400"></span>
                آراء عملائنا
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                قصص نجاح <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  نعتز بها
                </span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                نحن لا نبني مجرد مبانٍ، بل نبني علاقات طويلة الأمد. اكتشف لماذا يثق بنا عملاؤنا لتحقيق أحلامهم العقارية.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { 
                  value: `${stats.happyClients.toLocaleString()}+`, 
                  label: 'عميل سعيد', 
                  icon: Smile,
                  color: 'text-yellow-400'
                },
                { 
                  value: `${stats.satisfactionRate}%`, 
                  label: 'نسبة الرضا', 
                  icon: ThumbsUp,
                  color: 'text-green-400'
                },
                { 
                  value: `${stats.averageRating}/5`, 
                  label: 'متوسط التقييم', 
                  icon: Star,
                  color: 'text-orange-400'
                },
                { 
                  value: `${stats.yearsOfExperience}+`, 
                  label: 'سنوات الخبرة', 
                  icon: Award,
                  color: 'text-purple-400'
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                >
                  <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Testimonial Slider */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] opacity-30 blur-2xl" />
            
            <div className="relative bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12">
              <Quote className="w-16 h-16 text-blue-500/20 absolute top-8 right-8" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex gap-1 mb-8">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < activeTestimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                      />
                    ))}
                  </div>

                  <blockquote className="text-xl md:text-2xl text-white leading-relaxed mb-8">
                    "{activeTestimonial.content}"
                  </blockquote>

                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-blue-500/30">
                      {activeTestimonial.image ? (
                        <Image
                          src={activeTestimonial.image}
                          alt={activeTestimonial.clientName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                          {activeTestimonial.clientName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">{activeTestimonial.clientName}</div>
                      <div className="text-blue-400 text-sm">{activeTestimonial.position}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-4 mt-12 pt-8 border-t border-white/10">
                <button 
                  onClick={prevTestimonial}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextTestimonial}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(Testimonials)

