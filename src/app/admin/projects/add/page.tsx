'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { logger } from '@/lib/logger'
import { 
  ArrowLeftIcon,
  PlusIcon,
  PhotoIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'


// Types
interface ProjectFormData {
  title: string
  description: string
  location: string
  developer: string
  projectType: 'RESIDENTIAL' | 'COMMERCIAL' | 'MIXED_USE' | 'ADMINISTRATIVE'
  status: 'PLANNING' | 'UNDER_CONSTRUCTION' | 'COMPLETED' | 'ON_HOLD'
  totalUnits: number | null
  availableUnits: number | null
  minPrice: number | null
  maxPrice: number | null
  currency: 'EGP' | 'USD' | 'EUR'
  deliveryDate: string | null
  area: number | null
  bedrooms: number | null
  features: string[]
  specifications: any
  paymentPlan: any[]
  locationDetails: any
  contactName: string
  contactPhone: string
  contactEmail: string
}

interface ProjectImage {
  id?: string
  url: string
  publicId?: string // 🗑️ Cloudinary public ID للحذف التلقائي
  alt: string
  order: number
  isMain: boolean
}

// Available project features
const availableFeatures = [
  'حمام سباحة',
  'جيم ومركز لياقة',
  'حديقة ومناطق خضراء',
  'أمن وحراسة 24 ساعة',
  'جراج مغطى',
  'مصعد',
  'انترنت عالي السرعة',
  'غرفة أطفال',
  'مولد كهربائي احتياطي',
  'تكييف مركزي',
  'شرفة أو بلكونة',
  'مطبخ مجهز',
  'نادي اجتماعي',
  'ملعب أطفال',
  'مراكز تسوق قريبة',
  'مواصلات عامة',
  'مدارس وجامعات قريبة',
  'مستشفيات قريبة',
  'موقع متميز',
  'إطلالة بحرية',
  'إطلالة على حديقة',
  'قريب من المطار',
  'منطقة هادئة',
  'خدمة صيانة'
]

const initialFormData: ProjectFormData = {
  title: '',
  description: '',
  location: '',
  developer: '',
  projectType: 'RESIDENTIAL',
  status: 'PLANNING',
  totalUnits: null,
  availableUnits: null,
  minPrice: null,
  maxPrice: null,
  currency: 'EGP',
  deliveryDate: null,
  area: null,
  bedrooms: null,
  features: [],
  specifications: {},
  paymentPlan: [],
  locationDetails: { nearby: [] },
  contactName: '',
  contactPhone: '',
  contactEmail: ''
}

export default function AddProjectPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData)
  const [images, setImages] = useState<ProjectImage[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [newImageUrl, setNewImageUrl] = useState('')

  const projectTypes = [
    { value: 'RESIDENTIAL', label: 'سكني' },
    { value: 'COMMERCIAL', label: 'تجاري' },
    { value: 'MIXED_USE', label: 'مختلط' },
    { value: 'ADMINISTRATIVE', label: 'إداري' }
  ]

  const projectStatuses = [
    { value: 'PLANNING', label: 'في التخطيط' },
    { value: 'UNDER_CONSTRUCTION', label: 'قيد الإنشاء' },
    { value: 'COMPLETED', label: 'مكتمل' },
    { value: 'ON_HOLD', label: 'متوقف مؤقتاً' }
  ]

  const currencies = [
    { value: 'EGP', label: 'جنيه مصري' },
    { value: 'USD', label: 'دولار أمريكي' },
    { value: 'EUR', label: 'يورو' }
  ]

  const handleInputChange = (
    field: keyof ProjectFormData,
    value: string | number | null | string[]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  // رفع الصورة إلى Cloudinary
  const uploadImage = async (file: File) => {
    try {
      setUploading(true)
      setError(null)
      
      console.log('📤 Starting upload for:', file.name, file.type, file.size)
      
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      console.log('📥 Response status:', response.status)
      
      const data = await response.json()
      
      console.log('📥 Response data:', data)

      if (data.success) {
        const newImage: ProjectImage = {
          url: data.data.url,
          publicId: data.data.public_id,
          alt: `صورة المشروع ${images.length + 1}`,
          order: images.length + 1,
          isMain: images.length === 0
        }
        console.log('✅ Image added:', newImage.url)
        setImages(prev => [...prev, newImage])
        setSuccess('تم رفع الصورة بنجاح!')
        setTimeout(() => setSuccess(null), 3000)
      } else {
        console.error('❌ Upload failed:', data.message)
        setError(data.message || 'خطأ في رفع الصورة')
        setTimeout(() => setError(null), 5000)
      }
    } catch (error) {
      console.error('❌ Upload error:', error)
      logger.error('Error uploading image:', error)
      setError('خطأ في رفع الصورة - تحقق من اتصال الإنترنت')
      setTimeout(() => setError(null), 5000)
    } finally {
      setUploading(false)
    }
  }

  // التعامل مع اختيار الملف
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadImage(file)
    }
  }

  // إضافة صورة بالرابط
  const addImageByUrl = () => {
    if (newImageUrl.trim()) {
      const newImage: ProjectImage = {
        url: newImageUrl.trim(),
        alt: `صورة المشروع ${images.length + 1}`,
        order: images.length + 1,
        isMain: images.length === 0
      }
      setImages(prev => [...prev, newImage])
      setNewImageUrl('')
    }
  }

  const updateImage = (index: number, field: keyof ProjectImage, value: string | number | boolean) => {
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, [field]: value } : img
    ))
  }

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index)
      // Reorder images and ensure we have a main image
      return newImages.map((img, i) => ({
        ...img,
        order: i + 1,
        isMain: i === 0 && newImages.length > 0
      }))
    })
  }

  const setMainImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isMain: i === index
    })))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'اسم المشروع مطلوب'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'وصف المشروع مطلوب'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'موقع المشروع مطلوب'
    }

    if (!formData.developer.trim()) {
      newErrors.developer = 'اسم المطور مطلوب'
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = 'اسم جهة الاتصال مطلوب'
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'رقم الهاتف مطلوب'
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'البريد الإلكتروني مطلوب'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const submitData = {
        ...formData,
        images: images.map(img => ({
          url: img.url,
          alt: img.alt,
          isMain: img.isMain,
          order: img.order
        }))
      }

      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/projects')
      } else {
        setError(data.message || 'حدث خطأ أثناء إنشاء المشروع')
      }
    } catch (error) {
      logger.error('Error creating project:', error)
      setError('حدث خطأ أثناء إنشاء المشروع')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 space-x-reverse mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/admin/projects')}
            className="p-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">إضافة مشروع جديد</h1>
                <p className="text-gray-600 mt-1">أضف مشروع عقاري جديد لشركة AMG</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">المعلومات الأساسية</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المشروع *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اسم المشروع"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    موقع المشروع *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="المدينة، المنطقة"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المطور *
                  </label>
                  <input
                    type="text"
                    value={formData.developer}
                    onChange={(e) => handleInputChange('developer', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اسم الشركة المطورة"
                  />
                  {errors.developer && <p className="text-red-500 text-sm mt-1">{errors.developer}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع المشروع
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => handleInputChange('projectType', e.target.value as any)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {projectTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    حالة المشروع
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as any)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {projectStatuses.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ التسليم
                  </label>
                  <input
                    type="date"
                    value={formData.deliveryDate || ''}
                    onChange={(e) => handleInputChange('deliveryDate', e.target.value || null)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف المشروع *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="وصف شامل للمشروع..."
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    مميزات المشروع
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto border border-gray-200 rounded-xl p-4">
                    {availableFeatures.map((feature) => (
                      <div key={feature} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`feature-${feature}`}
                          checked={formData.features.includes(feature)}
                          onChange={() => handleFeatureToggle(feature)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`feature-${feature}`}
                          className="mr-3 text-sm text-gray-700 cursor-pointer"
                        >
                          {feature}
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    تم اختيار {formData.features.length} من {availableFeatures.length} مميزة
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">تفاصيل إضافية</h2>
              
              <div className="space-y-6">
                {/* Nearby Places */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الأماكن القريبة
                  </label>
                  <div className="space-y-2">
                    {formData.locationDetails.nearby.map((place: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={place}
                          onChange={(e) => {
                            const newNearby = [...formData.locationDetails.nearby]
                            newNearby[index] = e.target.value
                            setFormData(prev => ({
                              ...prev,
                              locationDetails: {
                                ...prev.locationDetails,
                                nearby: newNearby
                              }
                            }))
                          }}
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="مثال: مول كايرو فيستيفال - 15 دقيقة"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newNearby = formData.locationDetails.nearby.filter((_: any, i: number) => i !== index)
                            setFormData(prev => ({
                              ...prev,
                              locationDetails: {
                                ...prev.locationDetails,
                                nearby: newNearby
                              }
                            }))
                          }}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          locationDetails: {
                            ...prev.locationDetails,
                            nearby: [...prev.locationDetails.nearby, '']
                          }
                        }))
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <PlusIcon className="w-4 h-4" />
                      إضافة مكان قريب
                    </button>
                  </div>
                </div>

                {/* Payment Plan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    خطة الدفع
                  </label>
                  <div className="space-y-2">
                    {formData.paymentPlan.map((step: any, index: number) => (
                      <div key={index} className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={step.step || ''}
                          onChange={(e) => {
                            const newPlan = [...formData.paymentPlan]
                            newPlan[index] = { ...newPlan[index], step: e.target.value }
                            setFormData(prev => ({ ...prev, paymentPlan: newPlan }))
                          }}
                          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="مرحلة الدفع"
                        />
                        <input
                          type="text"
                          value={step.percentage || ''}
                          onChange={(e) => {
                            const newPlan = [...formData.paymentPlan]
                            newPlan[index] = { ...newPlan[index], percentage: e.target.value }
                            setFormData(prev => ({ ...prev, paymentPlan: newPlan }))
                          }}
                          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="النسبة (مثال: 10%)"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={step.description || ''}
                            onChange={(e) => {
                              const newPlan = [...formData.paymentPlan]
                              newPlan[index] = { ...newPlan[index], description: e.target.value }
                              setFormData(prev => ({ ...prev, paymentPlan: newPlan }))
                            }}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="الوصف"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newPlan = formData.paymentPlan.filter((_: any, i: number) => i !== index)
                              setFormData(prev => ({ ...prev, paymentPlan: newPlan }))
                            }}
                            className="p-2 text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          paymentPlan: [...prev.paymentPlan, { step: '', percentage: '', description: '' }]
                        }))
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <PlusIcon className="w-4 h-4" />
                      إضافة مرحلة دفع
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">تفاصيل الأسعار والوحدات</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المساحة (م²)
                  </label>
                  <input
                    type="number"
                    value={formData.area || ''}
                    onChange={(e) => handleInputChange('area', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="المساحة بالمتر المربع"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد غرف النوم
                  </label>
                  <input
                    type="number"
                    value={formData.bedrooms || ''}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="عدد غرف النوم"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    إجمالي الوحدات
                  </label>
                  <input
                    type="number"
                    value={formData.totalUnits || ''}
                    onChange={(e) => handleInputChange('totalUnits', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="عدد الوحدات الكلي"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوحدات المتاحة
                  </label>
                  <input
                    type="number"
                    value={formData.availableUnits || ''}
                    onChange={(e) => handleInputChange('availableUnits', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="عدد الوحدات المتاحة"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العملة
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value as any)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {currencies.map(currency => (
                      <option key={currency.value} value={currency.value}>{currency.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    أقل سعر
                  </label>
                  <input
                    type="number"
                    value={formData.minPrice || ''}
                    onChange={(e) => handleInputChange('minPrice', e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أقل سعر للوحدة"
                    min="0"
                    max="9999999999.99"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    أعلى سعر
                  </label>
                  <input
                    type="number"
                    value={formData.maxPrice || ''}
                    onChange={(e) => handleInputChange('maxPrice', e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أعلى سعر للوحدة"
                    min="0"
                    max="9999999999.99"
                    step="0.01"
                  />
                    placeholder="أعلى سعر للوحدة"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">معلومات التواصل</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم جهة الاتصال *
                  </label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="الاسم"
                  />
                  {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="رقم الهاتف"
                  />
                  {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="البريد الإلكتروني"
                  />
                  {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">صور المشروع</h2>
                
                {/* رفع الصور */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* رفع ملف */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رفع صورة من الجهاز
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex items-center justify-center w-full h-12 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                        {uploading ? (
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm text-gray-600">جاري الرفع...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <PhotoIcon className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-600">اختر صورة للرفع</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* إضافة رابط */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      أو أضف رابط صورة
                    </label>
                    <div className="flex space-x-2 space-x-reverse">
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addImageByUrl}
                        disabled={!newImageUrl.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <PlusIcon className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* رسائل النجاح والخطأ */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 space-x-reverse p-3 bg-green-50 text-green-700 rounded-lg border border-green-200"
                  >
                    <CheckIcon className="w-5 h-5" />
                    <span>{success}</span>
                  </motion.div>
                )}
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 space-x-reverse p-3 bg-red-50 text-red-700 rounded-lg border border-red-200"
                  >
                    <XMarkIcon className="w-5 h-5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* عرض الصور المضافة */}
                {images.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-800">الصور المضافة ({images.length})</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {images.map((image, index) => (
                        <div key={`image-${index}-${image.url}`} className="flex items-center space-x-3 space-x-reverse p-3 bg-gray-50 rounded-lg">
                          <img
                            src={image.url}
                            alt={image.alt || `صورة ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/placeholder.jpg'
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 space-x-reverse mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                صورة {index + 1}
                              </span>
                              {image.isMain && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
                                  رئيسية
                                </span>
                              )}
                            </div>
                            <input
                              type="text"
                              value={image.alt}
                              onChange={(e) => updateImage(index, 'alt', e.target.value)}
                              className="w-full text-xs p-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              placeholder="وصف الصورة (اختياري)"
                            />
                          </div>
                          <div className="flex items-center space-x-1 space-x-reverse">
                            {!image.isMain && (
                              <button
                                type="button"
                                onClick={() => setMainImage(index)}
                                className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                                title="تعيين كصورة رئيسية"
                              >
                                <CheckIcon className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                              title="حذف الصورة"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4 space-x-reverse pt-6">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/admin/projects')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </motion.button>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 space-x-reverse"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>حفظ المشروع</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
    </div>
  )
}

