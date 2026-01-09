'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { 
  Building2, Camera, Phone, CheckCircle2, ChevronRight, ChevronLeft,
  User, Mail, Clock, Home, TrendingUp, Users, Award, 
  MapPin, DollarSign, Ruler, Upload, X, Star, Info, Trees,
  Droplets, Car, Dumbbell, Shield, Wifi, MessageCircle, Share2,
  Facebook, Twitter, Send, Key, Building, Warehouse, Landmark, Briefcase, Store,
  LogIn
} from 'lucide-react'

// --- Constants & Data ---

const propertyTypes = [
  { id: 'apartment', label: 'شقة', icon: <Building2 size={32} /> },
  { id: 'villa', label: 'فيلا', icon: <Home size={32} /> },
  { id: 'townhouse', label: 'تاون هاوس', icon: <Building size={32} /> },
  { id: 'duplex', label: 'دوبلكس', icon: <Warehouse size={32} /> },
  { id: 'penthouse', label: 'بنتهاوس', icon: <Landmark size={32} /> },
  { id: 'land', label: 'أرض', icon: <MapPin size={32} /> },
  { id: 'office', label: 'مكتب', icon: <Briefcase size={32} /> },
  { id: 'shop', label: 'محل تجاري', icon: <Store size={32} /> },
]

const featuresList = [
  { id: 'garden', label: 'حديقة', icon: <Trees size={18} /> },
  { id: 'pool', label: 'مسبح', icon: <Droplets size={18} /> },
  { id: 'garage', label: 'جراج', icon: <Car size={18} /> },
  { id: 'gym', label: 'صالة رياضية', icon: <Dumbbell size={18} /> },
  { id: 'security', label: 'حراسة أمنية', icon: <Shield size={18} /> },
  { id: 'wifi', label: 'إنترنت', icon: <Wifi size={18} /> },
]

const governorates = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'الشرقية', 'الدقهلية', 
  'القليوبية', 'المنوفية', 'البحيرة', 'أسيوط', 'سوهاج'
]

const timeSlots = [
  { id: 'morning', label: 'صباحاً', time: '9 ص - 12 م', icon: '🌅' },
  { id: 'afternoon', label: 'ظهراً', time: '12 م - 5 م', icon: '☀️' },
  { id: 'evening', label: 'مساءً', time: '5 م - 9 م', icon: '🌙' },
]

const serviceTypes = [
  {
    id: 'marketing',
    title: 'تسويق فقط',
    description: 'نقوم بتسويق عقارك على جميع المنصات والوصول لأكبر عدد من المهتمين',
    icon: <TrendingUp size={32} />,
    features: ['نشر على 10+ منصة', 'تسويق رقمي متقدم', 'تقارير أسبوعية'],
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'marketing_photo',
    title: 'تسويق + تصوير احترافي',
    description: 'تسويق شامل مع جلسة تصوير احترافية لعقارك',
    icon: <Camera size={32} />,
    features: ['تصوير احترافي', 'جولة افتراضية', 'تسويق مميز', 'تحرير احترافي'],
    color: 'from-purple-500 to-purple-600',
    recommended: true,
  },
  {
    id: 'valuation',
    title: 'تقييم عقاري',
    description: 'احصل على تقييم دقيق لسعر عقارك من خبراء متخصصين',
    icon: <CheckCircle2 size={32} />,
    features: ['تقييم من خبراء', 'تقرير مفصل', 'تحليل السوق', 'استشارة مجانية'],
    color: 'from-green-500 to-green-600',
  },
]

// --- Components ---

const StatCard = ({ value, label, icon }: { value: number, label: string, icon: React.ReactNode }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20"
    >
      <div className="text-[#d4af37]">{icon}</div>
      <div>
        <div className="text-2xl font-bold text-white">{count}+</div>
        <div className="text-sm text-white/80">{label}</div>
      </div>
    </motion.div>
  )
}

const FloatingIcon = ({ icon, delay, x, y, duration }: { icon: React.ReactNode, delay: number, x: string, y: string, duration: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.1, 0.3, 0.1],
      scale: [1, 1.2, 1],
      x: [0, 20, 0],
      y: [0, -30, 0]
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      repeatType: "reverse"
    }}
    className="absolute text-white/20 pointer-events-none"
    style={{ left: x, top: y }}
  >
    {icon}
  </motion.div>
)

const Confetti = () => {
  const colors = ['#d4af37', '#1e3a5f', '#10b981', '#f59e0b', '#ef4444']
  const [particles, setParticles] = useState<any[]>([])

  useEffect(() => {
    setParticles(Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -20,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      duration: Math.random() * 2 + 3,
    })))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: particle.x,
            y: particle.y,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 100,
            rotate: particle.rotation * 4,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            ease: "linear",
          }}
          style={{
            position: 'absolute',
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: '50%',
          }}
        />
      ))}
    </div>
  )
}

// --- Main Page Component ---

export default function ListYourPropertyPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [formData, setFormData] = useState({
    propertyType: '',
    purpose: 'sale',
    governorate: '',
    city: '',
    area: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    features: [] as string[],
    description: '',
    images: [] as string[], // Storing base64 strings for preview
    imageFiles: [] as File[], // Storing actual files for upload
    name: '',
    phone: '',
    email: '',
    preferredTime: '',
    services: [] as string[],
    requestId: '', // Store request ID from API
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Prevent any auto-redirect
  useEffect(() => {
    // Block any redirect attempts
    setShouldRedirect(false)
  }, [])

  // Auto-fill user info if logged in
  useEffect(() => {
    if (user && !formData.name) {
      setFormData(prev => ({
        ...prev,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || '',
      }))
    }
  }, [user])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1e3a5f] mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#2d5a8f] to-[#0f2441] flex items-center justify-center p-4 overflow-hidden z-[9999]">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#d4af37] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#1e3a5f] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-32 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center relative z-10 border border-white/50"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-br from-[#1e3a5f] to-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ring-4 ring-white/50"
          >
            <LogIn className="text-white" size={40} strokeWidth={2.5} />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-[#1e3a5f] mb-4 tracking-tight"
          >
            يجب تسجيل الدخول
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-2xl p-6 mb-8 border border-blue-100/50"
          >
            <p className="text-gray-700 text-lg leading-relaxed font-medium">
              لعرض عقارك والاستفادة من خدماتنا المميزة، يرجى تسجيل الدخول أو إنشاء حساب جديد
            </p>
          </motion.div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/auth/login?redirect=/list-your-property"
                className="group relative w-full bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <LogIn size={22} className="relative z-10" />
                <span className="relative z-10">تسجيل الدخول</span>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                href="/auth/register?redirect=/list-your-property"
                className="group relative w-full bg-gradient-to-r from-[#d4af37] to-[#f0c866] text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-yellow-600/20 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <User size={22} className="relative z-10" />
                <span className="relative z-10">إنشاء حساب جديد</span>
              </Link>
            </motion.div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400 font-medium">أو</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link
                href="/"
                className="group w-full border-2 border-gray-200 text-gray-600 py-4 rounded-xl font-bold hover:border-[#1e3a5f] hover:text-[#1e3a5f] hover:bg-blue-50/50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Home size={20} className="group-hover:scale-110 transition-transform" />
                العودة للصفحة الرئيسية
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 pt-6 border-t border-gray-100"
          >
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <span className="text-xl">💡</span>
              <span><strong>نصيحة:</strong> التسجيل يستغرق دقيقة واحدة فقط!</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // Handlers
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newImages: string[] = []
    const newFiles: File[] = []

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        newFiles.push(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string)
            if (newImages.length === files.length) {
              setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newImages],
                imageFiles: [...prev.imageFiles, ...newFiles]
              }))
            }
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Prepare FormData for API submission
      const submitData = new FormData()
      
      // Add all form fields
      submitData.append('propertyType', formData.propertyType)
      submitData.append('purpose', formData.purpose)
      submitData.append('governorate', formData.governorate)
      submitData.append('city', formData.city)
      submitData.append('area', formData.area)
      submitData.append('price', formData.price)
      submitData.append('bedrooms', formData.bedrooms || '0')
      submitData.append('bathrooms', formData.bathrooms || '0')
      submitData.append('features', JSON.stringify(formData.features))
      submitData.append('description', formData.description)
      submitData.append('name', formData.name)
      submitData.append('phone', formData.phone)
      submitData.append('email', formData.email)
      submitData.append('preferredTime', formData.preferredTime)
      submitData.append('services', JSON.stringify(formData.services))
      
      // Add image files
      formData.imageFiles.forEach((file) => {
        submitData.append('images', file)
      })

      // Submit to API
      const response = await fetch('/api/properties/submit', {
        method: 'POST',
        body: submitData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'حدث خطأ أثناء الإرسال')
      }

      // Store request ID for success page
      setFormData(prev => ({ 
        ...prev, 
        requestId: result.data?.requestId || `AMG-${Math.floor(Math.random() * 100000)}` 
      }))

      setIsSubmitting(false)
      handleNext()

    } catch (error) {
      console.error('Submission error:', error)
      setIsSubmitting(false)
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال الطلب. الرجاء المحاولة مرة أخرى')
    }
  }

  // Steps Data
  const steps = [
    { id: 1, title: 'بيانات العقار', icon: <Building2 size={24} /> },
    { id: 2, title: 'صور العقار', icon: <Camera size={24} /> },
    { id: 3, title: 'معلومات التواصل', icon: <Phone size={24} /> },
    { id: 4, title: 'تأكيد', icon: <CheckCircle2 size={24} /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#1e3a5f] via-[#2d5a8f] to-[#1e3a5f] overflow-hidden pt-36 pb-32">
        <FloatingIcon icon={<Building2 size={80} />} delay={0} x="10%" y="50px" duration={8} />
        <FloatingIcon icon={<Home size={60} />} delay={1} x="85%" y="100px" duration={10} />
        <FloatingIcon icon={<Key size={50} />} delay={0.5} x="15%" y="70%" duration={9} />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-8 py-3">
                <span className="text-2xl font-bold text-white">AMG Real Estate</span>
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              اعرض عقارك للتسويق مع AMG
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
              نساعدك في تسويق وبيع عقارك بأفضل الأسعار مع فريق محترف ومتخصص
            </p>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <StatCard value={500} label="عقار تم بيعه" icon={<Building2 size={32} />} />
              <StatCard value={1200} label="عميل راضٍ" icon={<Users size={32} />} />
              <StatCard value={15} label="سنة خبرة" icon={<Award size={32} />} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="relative -mt-16 z-20 container mx-auto px-4 mb-12">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="relative">
            {/* Progress Line Background */}
            <div className="absolute top-6 right-0 left-0 h-1 bg-gray-200 rounded-full mx-8 md:mx-16"></div>
            
            {/* Animated Progress Line */}
            <motion.div
              className="absolute top-6 right-0 h-1 bg-gradient-to-l from-[#1e3a5f] to-[#d4af37] rounded-full mx-8 md:mx-16"
              initial={{ width: 0 }}
              animate={{ 
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
              }}
              transition={{ duration: 0.5 }}
            ></motion.div>

            <div className="relative flex justify-between">
              {steps.map((step) => {
                const isCompleted = currentStep > step.id
                const isCurrent = currentStep === step.id
                
                return (
                  <div key={step.id} className="flex flex-col items-center relative z-10">
                    <motion.div
                      animate={{
                        scale: isCurrent ? 1.1 : 1,
                        boxShadow: isCurrent ? '0 0 20px rgba(212, 175, 55, 0.5)' : '0 0 0 rgba(0,0,0,0)'
                      }}
                      className={`
                        w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300
                        ${isCompleted ? 'bg-green-500 border-green-500' : ''}
                        ${isCurrent ? 'bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] border-[#d4af37]' : ''}
                        ${!isCompleted && !isCurrent ? 'bg-white border-gray-300' : ''}
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="text-white w-6 h-6 md:w-8 md:h-8" />
                      ) : (
                        <div className={`${isCurrent ? 'text-white' : 'text-gray-400'}`}>
                          {step.icon}
                        </div>
                      )}
                    </motion.div>
                    <div className={`mt-3 text-xs md:text-sm font-bold ${isCurrent ? 'text-[#1e3a5f]' : 'text-gray-500'}`}>
                      {step.title}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 pb-24">
        <AnimatePresence mode="wait">
          
          {/* Step 1: Property Details */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-gray-100"
            >
              <h3 className="text-2xl font-bold text-[#1e3a5f] mb-8">تفاصيل العقار</h3>
              
              {/* Property Type */}
              <div className="mb-10">
                <label className="block text-sm font-bold text-gray-700 mb-4">نوع العقار</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {propertyTypes.map((type, index) => (
                    <motion.button
                      key={type.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setFormData({ ...formData, propertyType: type.id })}
                      className={`
                        relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3
                        ${formData.propertyType === type.id
                          ? 'border-[#d4af37] bg-gradient-to-br from-[#1e3a5f]/5 to-[#d4af37]/5 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-[#d4af37]/50 hover:shadow-md'
                        }
                      `}
                    >
                      <div className={`${formData.propertyType === type.id ? 'text-[#d4af37]' : 'text-gray-600'}`}>
                        {type.icon}
                      </div>
                      <div className={`font-bold ${formData.propertyType === type.id ? 'text-[#1e3a5f]' : 'text-gray-700'}`}>
                        {type.label}
                      </div>
                      {formData.propertyType === type.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#d4af37] rounded-full flex items-center justify-center">
                          <CheckCircle2 size={14} className="text-white" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Purpose */}
              <div className="mb-10">
                <label className="block text-sm font-bold text-gray-700 mb-4">الغرض</label>
                <div className="inline-flex rounded-2xl bg-gray-100 p-1.5">
                  {['sale', 'rent'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setFormData({ ...formData, purpose: p })}
                      className={`
                        px-8 py-3 rounded-xl font-bold transition-all duration-300
                        ${formData.purpose === p
                          ? 'bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] text-white shadow-lg'
                          : 'text-gray-600 hover:text-[#1e3a5f]'
                        }
                      `}
                    >
                      {p === 'sale' ? 'للبيع' : 'للإيجار'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location & Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2">المحافظة</label>
                  <div className="relative">
                    <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37]" size={20} />
                    <select
                      value={formData.governorate}
                      onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                      className="w-full pr-12 pl-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none bg-white appearance-none"
                    >
                      <option value="">اختر المحافظة</option>
                      {governorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2">المدينة / المنطقة</label>
                  <div className="relative">
                    <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37]" size={20} />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="مثال: التجمع الخامس"
                      className="w-full pr-12 pl-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2">المساحة (م²)</label>
                  <div className="relative">
                    <Ruler className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37]" size={20} />
                    <input
                      type="number"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="200"
                      className="w-full pr-12 pl-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2">السعر (ج.م)</label>
                  <div className="relative">
                    <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37]" size={20} />
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="2,500,000"
                      className="w-full pr-12 pl-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-10">
                <label className="block text-sm font-bold text-gray-700 mb-4">المميزات</label>
                <div className="flex flex-wrap gap-3">
                  {featuresList.map((feature) => (
                    <button
                      key={feature.id}
                      onClick={() => {
                        const newFeatures = formData.features.includes(feature.id)
                          ? formData.features.filter(f => f !== feature.id)
                          : [...formData.features, feature.id]
                        setFormData({ ...formData, features: newFeatures })
                      }}
                      className={`
                        flex items-center gap-2 px-5 py-3 rounded-full border-2 transition-all duration-300 font-medium
                        ${formData.features.includes(feature.id)
                          ? 'border-[#d4af37] bg-[#d4af37] text-white shadow-md'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-[#d4af37]/50'
                        }
                      `}
                    >
                      {feature.icon}
                      <span>{feature.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">وصف العقار</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="اكتب وصف تفصيلي للعقار..."
                  rows={5}
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none resize-none"
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Images */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-gray-100"
            >
              <div className="bg-gradient-to-r from-[#1e3a5f]/5 to-[#d4af37]/5 border-r-4 border-[#d4af37] rounded-2xl p-6 mb-8 flex items-start gap-4">
                <Info className="text-[#d4af37] flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-[#1e3a5f] mb-2">نصيحة احترافية</h4>
                  <p className="text-gray-600">صور احترافية وواضحة تزيد من فرص البيع بنسبة 80%. تأكد من التقاط صور في إضاءة جيدة.</p>
                </div>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  handleFileSelect(e.dataTransfer.files)
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative border-3 border-dashed rounded-3xl p-12 transition-all duration-300 cursor-pointer text-center
                  ${isDragging
                    ? 'border-[#d4af37] bg-[#d4af37]/10 scale-[1.02]'
                    : 'border-gray-300 hover:border-[#d4af37]/50 hover:bg-gray-50'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
                <div className="w-24 h-24 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] rounded-3xl flex items-center justify-center mx-auto shadow-xl mb-6">
                  <Upload className="text-white" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-3">
                  {isDragging ? 'أفلت الصور هنا' : 'اسحب الصور أو انقر للتحميل'}
                </h3>
                <p className="text-gray-600">يمكنك تحميل عدة صور (JPG, PNG)</p>
              </div>

              {formData.images.length > 0 && (
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-100">
                      <Image src={img} alt={`Property ${idx}`} fill className="object-cover" />
                      {idx === 0 && (
                        <div className="absolute top-2 right-2 bg-[#d4af37] text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                          <Star size={12} fill="white" /> الرئيسية
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== idx),
                            imageFiles: prev.imageFiles.filter((_, i) => i !== idx)
                          }))
                        }}
                        className="absolute top-2 left-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Contact Info */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-gray-100"
            >
              <h3 className="text-2xl font-bold text-[#1e3a5f] mb-8">معلومات التواصل</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل</label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37]" size={20} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pr-12 pl-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37]" size={20} />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pr-12 pl-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="relative md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37]" size={20} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pr-12 pl-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
                  <Clock className="text-[#d4af37]" size={24} /> الوقت المفضل للتواصل
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setFormData({ ...formData, preferredTime: slot.id })}
                      className={`
                        p-6 rounded-2xl border-2 transition-all duration-300 text-center
                        ${formData.preferredTime === slot.id
                          ? 'border-[#d4af37] bg-gradient-to-br from-[#1e3a5f]/5 to-[#d4af37]/5 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-[#d4af37]/50'
                        }
                      `}
                    >
                      <div className="text-4xl mb-3">{slot.icon}</div>
                      <div className="font-bold text-lg text-[#1e3a5f]">{slot.label}</div>
                      <div className="text-sm text-gray-600">{slot.time}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-6">اختر الخدمات المطلوبة</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {serviceTypes.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => {
                        const newServices = formData.services.includes(service.id)
                          ? formData.services.filter(s => s !== service.id)
                          : [...formData.services, service.id]
                        setFormData({ ...formData, services: newServices })
                      }}
                      className={`
                        relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer
                        ${formData.services.includes(service.id)
                          ? 'border-[#d4af37] shadow-xl scale-105'
                          : 'border-gray-200 hover:border-[#d4af37]/50'
                        }
                      `}
                    >
                      {service.recommended && (
                        <div className="absolute -top-3 right-6 bg-gradient-to-r from-[#d4af37] to-[#f0c866] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                          الأكثر طلباً ⭐
                        </div>
                      )}
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} text-white mb-4 shadow-lg`}>
                        {service.icon}
                      </div>
                      <h4 className="font-bold text-xl text-[#1e3a5f] mb-2">{service.title}</h4>
                      <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                      <div className="space-y-2">
                        {service.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="text-green-500 flex-shrink-0" size={16} />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto"
            >
              <Confetti />
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-2xl mb-6"
                >
                  <CheckCircle2 className="text-white" size={64} />
                </motion.div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-4">تم إرسال طلبك بنجاح! 🎉</h2>
                <p className="text-xl text-gray-600 mb-8">شكراً لثقتك في AMG Real Estate. سنتواصل معك قريباً</p>

                <div className="inline-block bg-gradient-to-r from-[#1e3a5f]/5 to-[#d4af37]/5 border-2 border-[#d4af37] rounded-2xl px-8 py-4 mb-8">
                  <div className="text-sm text-gray-600 mb-1">رقم الطلب</div>
                  <div className="text-2xl font-bold text-[#1e3a5f]">{formData.requestId || `AMG-${Math.floor(Math.random() * 100000)}`}</div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 mb-8 text-right">
                  <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
                    <Home className="text-[#d4af37]" /> ملخص العقار
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div><span className="text-gray-500 block text-sm">نوع العقار</span><span className="font-bold text-[#1e3a5f]">{propertyTypes.find(t => t.id === formData.propertyType)?.label}</span></div>
                    <div><span className="text-gray-500 block text-sm">الغرض</span><span className="font-bold text-[#1e3a5f]">{formData.purpose === 'sale' ? 'للبيع' : 'للإيجار'}</span></div>
                    <div><span className="text-gray-500 block text-sm">الموقع</span><span className="font-bold text-[#1e3a5f]">{formData.city}, {formData.governorate}</span></div>
                    <div><span className="text-gray-500 block text-sm">السعر</span><span className="font-bold text-[#1e3a5f]">{formData.price} ج.م</span></div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <Link href="/" className="flex-1 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 hover:shadow-xl transition-all">
                    <Home size={20} /> العودة للرئيسية
                  </Link>
                  <Link href="/projects" className="flex-1 bg-white border-2 border-[#1e3a5f] text-[#1e3a5f] font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                    <Building size={20} /> تصفح المشاريع
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="max-w-5xl mx-auto mt-8 flex gap-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`
                flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300
                ${currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                }
              `}
            >
              <ChevronRight size={20} /> السابق
            </button>
            
            <button
              onClick={currentStep === 3 ? handleSubmit : handleNext}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300"
            >
              {isSubmitting ? (
                'جاري الإرسال...'
              ) : currentStep === 3 ? (
                <>إرسال الطلب <Send size={20} /></>
              ) : (
                <>التالي <ChevronLeft size={20} /></>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Floating WhatsApp */}
      <motion.a
        href="https://wa.me/201000000000"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 left-6 z-50 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:shadow-green-500/50 transition-all duration-300"
      >
        <MessageCircle className="text-white w-8 h-8" />
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75"></span>
      </motion.a>

    </div>
  )
}
