'use client'

import { useState, useEffect, useRef, use } from 'react'
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
  AlertCircle, ArrowRight
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

export default function EditPropertyRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
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
    images: [] as string[],
    imageFiles: [] as File[],
    name: '',
    phone: '',
    email: '',
    preferredTime: '',
    services: [] as string[],
    serviceType: '',
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load existing request data
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/auth/login?redirect=/list-your-property/edit/${id}`)
      return
    }

    if (user) {
      loadRequestData()
    }
  }, [user, authLoading, id])

  const loadRequestData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/user/property-requests/${id}`, {
        credentials: 'include',
        cache: 'no-store',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء تحميل البيانات')
      }

      const request = data.data

      // Check if request is editable
      if (request.status !== 'PENDING') {
        setError('لا يمكن تعديل هذا الطلب بعد بدء المراجعة')
        return
      }

      // Populate form with existing data
      setFormData({
        propertyType: request.propertyType || '',
        purpose: request.purpose || 'sale',
        governorate: request.governorate || '',
        city: request.city || '',
        area: request.area?.toString() || '',
        price: request.price?.toString() || '',
        bedrooms: request.bedrooms?.toString() || '',
        bathrooms: request.bathrooms?.toString() || '',
        features: Array.isArray(request.features) ? request.features : [],
        description: request.description || '',
        images: Array.isArray(request.images) ? request.images : [],
        imageFiles: [],
        name: request.ownerName || '',
        phone: request.ownerPhone || '',
        email: request.ownerEmail || '',
        preferredTime: '',
        services: request.serviceType ? [request.serviceType] : [],
        serviceType: request.serviceType || '',
      })

      setIsLoading(false)
    } catch (error) {
      console.error('Error loading request:', error)
      setError(error instanceof Error ? error.message : 'حدث خطأ أثناء تحميل البيانات')
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      const newFileUrls: string[] = []

      newFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newFileUrls.push(reader.result as string)
          if (newFileUrls.length === newFiles.length) {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, ...newFileUrls],
              imageFiles: [...prev.imageFiles, ...newFiles]
            }))
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageFiles: prev.imageFiles.filter((_, i) => i !== index)
    }))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length > 0) {
      const newFileUrls: string[] = []
      
      imageFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newFileUrls.push(reader.result as string)
          if (newFileUrls.length === imageFiles.length) {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, ...newFileUrls],
              imageFiles: [...prev.imageFiles, ...imageFiles]
            }))
          }
        }
        reader.readAsDataURL(file)
      })
    }
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
      submitData.append('ownerName', formData.name)
      submitData.append('ownerPhone', formData.phone)
      submitData.append('ownerEmail', formData.email)
      submitData.append('serviceType', formData.services[0] || 'marketing')

      // Handle images: keep existing URLs, add new files
      const existingImages = formData.images.filter(img => img.startsWith('http'))
      const newImageFiles = formData.imageFiles

      if (newImageFiles.length > 0) {
        newImageFiles.forEach((file) => {
          submitData.append('newImages', file)
        })
      }

      submitData.append('existingImages', JSON.stringify(existingImages))

      // Submit to API
      const response = await fetch(`/api/user/property-requests/${id}`, {
        method: 'PUT',
        body: submitData,
        credentials: 'include',
      })

      const result = await response.json()

      if (!response.ok) {
        const errorDetails = result.details ? ` (${result.details})` : ''
        throw new Error(result.error + errorDetails || 'حدث خطأ أثناء التحديث')
      }

      // Redirect to my requests
      router.push('/dashboard/my-requests')

    } catch (error) {
      console.error('Update error:', error)
      setIsSubmitting(false)
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء تحديث الطلب. الرجاء المحاولة مرة أخرى')
    }
  }

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1e3a5f] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-lg w-full text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-500" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">خطأ</h2>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
          <Link
            href="/dashboard/my-requests"
            className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#152c4a] transition-all"
          >
            <ArrowRight size={20} />
            العودة إلى طلباتي
          </Link>
        </div>
      </div>
    )
  }

  if (!user) return null

  // Steps Data
  const steps = [
    { id: 1, title: 'بيانات العقار', icon: <Building2 size={24} /> },
    { id: 2, title: 'صور العقار', icon: <Camera size={24} /> },
    { id: 3, title: 'معلومات التواصل', icon: <Phone size={24} /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20" dir="rtl">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#1e3a5f] via-[#2d5a8f] to-[#1e3a5f] overflow-hidden pt-24 pb-20">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              تعديل بيانات عقارك
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              قم بتحديث معلومات عقارك بكل سهولة
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-10 relative z-10">
        
        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex justify-between items-center max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                    ${currentStep >= step.id
                      ? 'bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] text-white shadow-lg scale-110'
                      : 'bg-gray-200 text-gray-400'
                    }
                  `}>
                    {step.icon}
                  </div>
                  <div className={`text-sm font-bold text-center ${currentStep >= step.id ? 'text-[#1e3a5f]' : 'text-gray-400'}`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-4 rounded transition-all duration-300 ${currentStep > step.id ? 'bg-[#1e3a5f]' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          
          {/* Step 1: Property Details */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100"
            >
              {/* Property Type */}
              <div className="mb-10">
                <label className="block text-sm font-bold text-gray-700 mb-4">نوع العقار</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {propertyTypes.map((type, index) => (
                    <motion.button
                      key={type.id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
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
                      type="button"
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
                      placeholder="1,000,000"
                      className="w-full pr-12 pl-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2">عدد الغرف</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    placeholder="3"
                    className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2">عدد الحمامات</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    placeholder="2"
                    className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Features */}
              <div className="mb-10">
                <label className="block text-sm font-bold text-gray-700 mb-4">المميزات</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {featuresList.map((feature) => (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={() => {
                        const newFeatures = formData.features.includes(feature.id)
                          ? formData.features.filter(f => f !== feature.id)
                          : [...formData.features, feature.id]
                        setFormData({ ...formData, features: newFeatures })
                      }}
                      className={`
                        p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-3
                        ${formData.features.includes(feature.id)
                          ? 'border-[#d4af37] bg-[#d4af37]/10 shadow-md'
                          : 'border-gray-200 hover:border-[#d4af37]/50'
                        }
                      `}
                    >
                      <div className={formData.features.includes(feature.id) ? 'text-[#d4af37]' : 'text-gray-600'}>
                        {feature.icon}
                      </div>
                      <span className={`font-bold ${formData.features.includes(feature.id) ? 'text-[#1e3a5f]' : 'text-gray-700'}`}>
                        {feature.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الوصف</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="اكتب وصف مفصل للعقار..."
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none resize-none"
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Images */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">صور العقار</h2>

              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-4 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
                  ${isDragging
                    ? 'border-[#d4af37] bg-[#d4af37]/5 scale-105'
                    : 'border-gray-300 hover:border-[#d4af37]/50 hover:bg-gray-50'
                  }
                `}
              >
                <Upload className="mx-auto text-[#d4af37] mb-4" size={48} />
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">اسحب الصور هنا</h3>
                <p className="text-gray-600">أو انقر للاختيار من جهازك</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Image Preview Grid */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                        <Image
                          src={image}
                          alt={`صورة ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">معلومات التواصل</h2>

              <div className="grid md:grid-cols-2 gap-6 mb-10">
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2">الاسم</label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37]" size={20} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="أحمد محمد"
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
                      placeholder="01234567890"
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
                      placeholder="example@email.com"
                      className="w-full pr-12 pl-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
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
                          : [service.id]
                        setFormData({ ...formData, services: newServices, serviceType: service.id })
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
        </AnimatePresence>

        {/* Navigation Buttons */}
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
            className="flex-1 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                جاري الحفظ...
              </>
            ) : currentStep === 3 ? (
              <>حفظ التعديلات <CheckCircle2 size={20} /></>
            ) : (
              <>التالي <ChevronLeft size={20} /></>
            )}
          </button>
        </div>
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
