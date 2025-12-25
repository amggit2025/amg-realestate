'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  HomeIcon, 
  PhotoIcon, 
  UserIcon, 
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid'

// أنواع العقارات
const propertyTypes = [
  { value: 'APARTMENT', label: 'شقة', icon: '🏢' },
  { value: 'VILLA', label: 'فيلا', icon: '🏡' },
  { value: 'TOWNHOUSE', label: 'تاون هاوس', icon: '🏘️' },
  { value: 'DUPLEX', label: 'دوبلكس', icon: '🏠' },
  { value: 'PENTHOUSE', label: 'بنتهاوس', icon: '🌆' },
  { value: 'LAND', label: 'أرض', icon: '🌍' },
  { value: 'OFFICE', label: 'مكتب', icon: '🏛️' },
  { value: 'COMMERCIAL', label: 'محل تجاري', icon: '🏪' },
  { value: 'WAREHOUSE', label: 'مخزن', icon: '📦' },
  { value: 'BUILDING', label: 'مبنى كامل', icon: '🏗️' },
]

// المحافظات
const governorates = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'البحر الأحمر', 'البحيرة',
  'الفيوم', 'الغربية', 'الإسماعيلية', 'المنوفية', 'المنيا', 'القليوبية',
  'الوادي الجديد', 'السويس', 'أسوان', 'أسيوط', 'بني سويف', 'بورسعيد',
  'دمياط', 'الشرقية', 'جنوب سيناء', 'كفر الشيخ', 'مطروح', 'الأقصر',
  'قنا', 'شمال سيناء', 'سوهاج'
]

// المميزات
const allFeatures = [
  'حديقة خاصة', 'حمام سباحة', 'جراج', 'مصعد', 'أمن وحراسة', 'تكييف مركزي',
  'غاز طبيعي', 'إنترنت', 'قريب من المترو', 'قريب من المدارس', 'قريب من المولات',
  'تشطيب سوبر لوكس', 'تشطيب لوكس', 'نصف تشطيب', 'على الطوب الأحمر',
  'فيو مفتوح', 'واجهة بحرية', 'واجهة قبلية', 'دور أرضي', 'روف'
]

// أنواع الخدمات
const serviceTypes = [
  { 
    value: 'MARKETING_ONLY', 
    label: 'تسويق العقار فقط',
    description: 'نقوم بتسويق عقارك عبر منصاتنا وقنواتنا المختلفة',
    icon: '📢'
  },
  { 
    value: 'MARKETING_AND_VISIT', 
    label: 'تسويق ومعاينة',
    description: 'معاينة العقار وتصويره احترافياً ثم تسويقه',
    icon: '📸'
  },
  { 
    value: 'VALUATION', 
    label: 'تقييم العقار',
    description: 'تقييم سعر عقارك بناءً على السوق الحالي',
    icon: '💰'
  },
]

interface FormData {
  // بيانات العقار
  propertyType: string
  purpose: 'SALE' | 'RENT' | ''
  area: string
  price: string
  currency: string
  governorate: string
  city: string
  district: string
  address: string
  bedrooms: string
  bathrooms: string
  floors: string
  floor: string
  yearBuilt: string
  features: string[]
  description: string
  
  // الصور
  images: string[]
  
  // بيانات المالك
  ownerName: string
  ownerPhone: string
  ownerEmail: string
  preferredTime: string
  
  // الخدمة
  serviceType: string
}

const initialFormData: FormData = {
  propertyType: '',
  purpose: '',
  area: '',
  price: '',
  currency: 'EGP',
  governorate: '',
  city: '',
  district: '',
  address: '',
  bedrooms: '',
  bathrooms: '',
  floors: '',
  floor: '',
  yearBuilt: '',
  features: [],
  description: '',
  images: [],
  ownerName: '',
  ownerPhone: '',
  ownerEmail: '',
  preferredTime: '',
  serviceType: ''
}

export default function ListYourPropertyPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [requestId, setRequestId] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadingImages, setUploadingImages] = useState(false)

  const steps = [
    { number: 1, title: 'العقار', icon: HomeIcon },
    { number: 2, title: 'الصور', icon: PhotoIcon },
    { number: 3, title: 'التواصل', icon: UserIcon },
    { number: 4, title: 'تأكيد', icon: CheckCircleIcon },
  ]

  // التحقق من صحة البيانات
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (stepNumber === 1) {
      if (!formData.propertyType) newErrors.propertyType = 'اختر نوع العقار'
      if (!formData.purpose) newErrors.purpose = 'اختر الغرض'
      if (!formData.area) newErrors.area = 'أدخل المساحة'
      if (!formData.price) newErrors.price = 'أدخل السعر'
      if (!formData.governorate) newErrors.governorate = 'اختر المحافظة'
      if (!formData.city) newErrors.city = 'أدخل المدينة'
      if (!formData.district) newErrors.district = 'أدخل المنطقة'
      if (!formData.description) newErrors.description = 'أدخل وصف العقار'
    }

    if (stepNumber === 2) {
      if (formData.images.length === 0) newErrors.images = 'أضف صورة واحدة على الأقل'
    }

    if (stepNumber === 3) {
      if (!formData.ownerName) newErrors.ownerName = 'أدخل اسمك'
      if (!formData.ownerPhone) newErrors.ownerPhone = 'أدخل رقم هاتفك'
      if (!formData.ownerEmail) newErrors.ownerEmail = 'أدخل بريدك الإلكتروني'
      if (!formData.serviceType) newErrors.serviceType = 'اختر نوع الخدمة'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  // رفع الصور
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImages(true)
    const newImages: string[] = []

    for (const file of Array.from(files)) {
      try {
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)
        formDataUpload.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'amg_properties')

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formDataUpload }
        )

        const data = await res.json()
        if (data.secure_url) {
          newImages.push(data.secure_url)
        }
      } catch (error) {
        console.error('Error uploading image:', error)
      }
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }))
    setUploadingImages(false)
  }

  // حذف صورة
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // إرسال النموذج
  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/listing-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        setIsSuccess(true)
        setRequestId(data.requestId)
        setStep(4)
      } else {
        setErrors({ submit: data.error || 'حدث خطأ أثناء الإرسال' })
      }
    } catch (error) {
      setErrors({ submit: 'حدث خطأ في الاتصال' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // تبديل ميزة
  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-16 lg:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        </div>
        <div className="relative container mx-auto px-4">
          <div className="text-center text-white">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl lg:text-5xl font-bold mb-4"
            >
              🏠 اعرض عقارك للتسويق مع AMG
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto"
            >
              نساعدك في بيع أو تأجير عقارك بأفضل سعر وفي أسرع وقت
            </motion.p>
            
            {/* المميزات */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              {['تسويق احترافي', 'تصوير عقاري', 'تقييم مجاني', 'فريق مبيعات متخصص'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <CheckCircleSolid className="w-5 h-5 text-green-300" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className={`flex flex-col items-center ${step >= s.number ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    step > s.number 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : step === s.number 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'border-gray-300'
                  }`}>
                    {step > s.number ? (
                      <CheckCircleSolid className="w-6 h-6" />
                    ) : (
                      <s.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className="text-sm mt-2 hidden sm:block">{s.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 sm:w-24 h-1 mx-2 rounded ${
                    step > s.number ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: بيانات العقار */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-lg p-6 lg:p-8"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <HomeIcon className="w-7 h-7 text-blue-600" />
                  بيانات العقار
                </h2>

                {/* نوع العقار */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    نوع العقار <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {propertyTypes.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, propertyType: type.value }))}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${
                          formData.propertyType === type.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{type.icon}</div>
                        <div className="text-sm font-medium">{type.label}</div>
                      </button>
                    ))}
                  </div>
                  {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
                </div>

                {/* الغرض */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    الغرض <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, purpose: 'SALE' }))}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.purpose === 'SALE'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">💰</div>
                      <div className="font-medium">للبيع</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, purpose: 'RENT' }))}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.purpose === 'RENT'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">🔑</div>
                      <div className="font-medium">للإيجار</div>
                    </button>
                  </div>
                  {errors.purpose && <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>}
                </div>

                {/* المساحة والسعر */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المساحة (م²) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.area}
                      onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                      placeholder="150"
                    />
                    {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      السعر المطلوب <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                        placeholder="1500000"
                      />
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                        className="px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                      >
                        <option value="EGP">ج.م</option>
                        <option value="USD">$</option>
                      </select>
                    </div>
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </div>
                </div>

                {/* الموقع */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المحافظة <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.governorate}
                      onChange={(e) => setFormData(prev => ({ ...prev, governorate: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                    >
                      <option value="">اختر المحافظة</option>
                      {governorates.map(gov => (
                        <option key={gov} value={gov}>{gov}</option>
                      ))}
                    </select>
                    {errors.governorate && <p className="text-red-500 text-sm mt-1">{errors.governorate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المدينة <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                      placeholder="التجمع الخامس"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المنطقة <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                      placeholder="اللوتس"
                    />
                    {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                  </div>
                </div>

                {/* العنوان التفصيلي */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان التفصيلي (اختياري)
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                    placeholder="شارع 90، عمارة 5"
                  />
                </div>

                {/* تفاصيل إضافية */}
                {formData.propertyType && formData.propertyType !== 'LAND' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">غرف النوم</label>
                      <input
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                        placeholder="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الحمامات</label>
                      <input
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                        placeholder="2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الدور</label>
                      <input
                        type="number"
                        value={formData.floor}
                        onChange={(e) => setFormData(prev => ({ ...prev, floor: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">سنة البناء</label>
                      <input
                        type="number"
                        value={formData.yearBuilt}
                        onChange={(e) => setFormData(prev => ({ ...prev, yearBuilt: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                        placeholder="2020"
                      />
                    </div>
                  </div>
                )}

                {/* المميزات */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">المميزات</label>
                  <div className="flex flex-wrap gap-2">
                    {allFeatures.map(feature => (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => toggleFeature(feature)}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${
                          formData.features.includes(feature)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>

                {/* الوصف */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف العقار <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 resize-none"
                    placeholder="اكتب وصفاً تفصيلياً للعقار، المميزات، حالة التشطيب، القرب من الخدمات..."
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* زر التالي */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <span>التالي</span>
                    <ArrowLeftIcon className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: الصور */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-lg p-6 lg:p-8"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <PhotoIcon className="w-7 h-7 text-blue-600" />
                  صور العقار
                </h2>

                <p className="text-gray-600 mb-6">
                  أضف صوراً واضحة للعقار (يفضل 5-10 صور). الصور الجيدة تزيد من فرص البيع!
                </p>

                {/* منطقة رفع الصور */}
                <div className="mb-6">
                  <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
                    uploadingImages ? 'bg-blue-50 border-blue-300' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploadingImages ? (
                        <>
                          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                          <p className="text-blue-600">جاري رفع الصور...</p>
                        </>
                      ) : (
                        <>
                          <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mb-3" />
                          <p className="text-gray-600 mb-2">اضغط لرفع الصور أو اسحبها هنا</p>
                          <p className="text-sm text-gray-400">PNG, JPG, WEBP (حد أقصى 10MB لكل صورة)</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploadingImages}
                    />
                  </label>
                  {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
                </div>

                {/* عرض الصور المرفوعة */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-xl overflow-hidden">
                          <Image
                            src={img}
                            alt={`صورة ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            الرئيسية
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-sm text-gray-500 mb-6">
                  تم رفع {formData.images.length} صورة
                </p>

                {/* أزرار التنقل */}
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <ArrowRightIcon className="w-5 h-5" />
                    <span>السابق</span>
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <span>التالي</span>
                    <ArrowLeftIcon className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: بيانات التواصل */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-lg p-6 lg:p-8"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <UserIcon className="w-7 h-7 text-blue-600" />
                  بيانات التواصل
                </h2>

                {/* بيانات المالك */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم الكامل <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.ownerName}
                        onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                        className="w-full pr-11 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                        placeholder="أحمد محمد"
                      />
                    </div>
                    {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.ownerPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, ownerPhone: e.target.value }))}
                        className="w-full pr-11 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                        placeholder="+20 10 1234 5678"
                      />
                    </div>
                    {errors.ownerPhone && <p className="text-red-500 text-sm mt-1">{errors.ownerPhone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.ownerEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, ownerEmail: e.target.value }))}
                        className="w-full pr-11 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                        placeholder="example@email.com"
                      />
                    </div>
                    {errors.ownerEmail && <p className="text-red-500 text-sm mt-1">{errors.ownerEmail}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الوقت المفضل للتواصل
                    </label>
                    <div className="relative">
                      <ClockIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={formData.preferredTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                        className="w-full pr-11 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                      >
                        <option value="">أي وقت</option>
                        <option value="morning">صباحاً (9ص - 12م)</option>
                        <option value="afternoon">ظهراً (12م - 5م)</option>
                        <option value="evening">مساءً (5م - 9م)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* نوع الخدمة */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    الخدمة المطلوبة <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {serviceTypes.map(service => (
                      <button
                        key={service.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, serviceType: service.value }))}
                        className={`p-4 rounded-xl border-2 text-right transition-all ${
                          formData.serviceType === service.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{service.icon}</div>
                        <div className="font-semibold mb-1">{service.label}</div>
                        <div className="text-sm text-gray-500">{service.description}</div>
                      </button>
                    ))}
                  </div>
                  {errors.serviceType && <p className="text-red-500 text-sm mt-1">{errors.serviceType}</p>}
                </div>

                {errors.submit && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    {errors.submit}
                  </div>
                )}

                {/* أزرار التنقل */}
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <ArrowRightIcon className="w-5 h-5" />
                    <span>السابق</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>جاري الإرسال...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>إرسال الطلب</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: التأكيد */}
            {step === 4 && isSuccess && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircleSolid className="w-14 h-14 text-green-600" />
                </motion.div>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  تم إرسال طلبك بنجاح! 🎉
                </h2>
                
                <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                  شكراً لك! سيقوم فريقنا بمراجعة طلبك والتواصل معك خلال 24 ساعة.
                </p>

                <div className="bg-gray-50 rounded-xl p-4 mb-8 inline-block">
                  <p className="text-sm text-gray-500 mb-1">رقم الطلب</p>
                  <p className="text-xl font-mono font-bold text-blue-600">{requestId}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <HomeIcon className="w-5 h-5" />
                    العودة للرئيسية
                  </Link>
                  <Link
                    href="/projects"
                    className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold transition-colors"
                  >
                    تصفح المشاريع
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
