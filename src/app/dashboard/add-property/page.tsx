'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/AuthContext'
import { logger } from '@/lib/logger'
import { 
  BuildingOffice2Icon,
  PhotoIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  HomeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type PropertyType = 'APARTMENT' | 'VILLA' | 'OFFICE' | 'COMMERCIAL' | 'LAND'
type PropertyPurpose = 'SALE' | 'RENT'
type Currency = 'EGP' | 'USD'

interface PropertyFormData {
  title: string
  description: string
  price: string
  currency: Currency
  negotiable: boolean
  area: string
  bedrooms: string
  bathrooms: string
  floors: string
  floor: string
  parking: boolean
  furnished: boolean
  city: string
  district: string
  address: string
  propertyType: PropertyType
  purpose: PropertyPurpose
  features: string
  additionalDetails: string
  contactName: string
  contactPhone: string
  contactEmail: string
}

const propertyTypes = [
  { value: 'APARTMENT', label: 'شقة', icon: HomeIcon },
  { value: 'VILLA', label: 'فيلا', icon: BuildingOffice2Icon },
  { value: 'OFFICE', label: 'مكتب', icon: BuildingOffice2Icon },
  { value: 'COMMERCIAL', label: 'تجاري', icon: BuildingOffice2Icon },
  { value: 'LAND', label: 'أرض', icon: MapPinIcon },
]

const purposes = [
  { value: 'SALE', label: 'للبيع' },
  { value: 'RENT', label: 'للإيجار' },
]

const currencies = [
  { value: 'EGP', label: 'جنيه مصري' },
  { value: 'USD', label: 'دولار أمريكي' },
]

export default function AddPropertyPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: '',
    currency: 'EGP',
    negotiable: false,
    area: '',
    bedrooms: '',
    bathrooms: '',
    floors: '',
    floor: '',
    parking: false,
    furnished: false,
    city: '',
    district: '',
    address: '',
    propertyType: 'APARTMENT',
    purpose: 'SALE',
    features: '',
    additionalDetails: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  })

  // تأثير للتحقق من المصادقة
  useEffect(() => {
    logger.log('🔐 AddProperty: Authentication check - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'user:', user ? user.email : 'null')
    if (!isLoading && !isAuthenticated) {
      logger.log('⏭️ AddProperty: Redirecting to login page')
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router, user])

  // تحديث بيانات الاتصال عند تحميل بيانات المستخدم
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        contactName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '',
        contactPhone: user.phone || '',
        contactEmail: user.email || '',
      }))
    }
  }, [user])

  // Validate all required fields initially
  useEffect(() => {
    const requiredFields = ['title', 'description', 'price', 'area', 'city', 'district', 'address', 'contactName', 'contactPhone', 'contactEmail']
    const initialErrors: Record<string, string> = {}
    
    requiredFields.forEach(field => {
      const value = formData[field as keyof PropertyFormData] as string
      const isTouched = touched[field]
      
      // Only show errors for touched fields or empty required fields
      if (isTouched && (!value || value === '')) {
        switch (field) {
          case 'title': initialErrors[field] = 'عنوان العقار مطلوب'; break
          case 'description': initialErrors[field] = 'وصف العقار مطلوب'; break
          case 'price': initialErrors[field] = 'السعر مطلوب'; break
          case 'area': initialErrors[field] = 'المساحة مطلوبة'; break
          case 'city': initialErrors[field] = 'المدينة مطلوبة'; break
          case 'district': initialErrors[field] = 'المنطقة مطلوبة'; break
          case 'address': initialErrors[field] = 'العنوان مطلوب'; break
          case 'contactName': initialErrors[field] = 'اسم جهة التواصل مطلوب'; break
          case 'contactPhone': initialErrors[field] = 'رقم الهاتف مطلوب'; break
          case 'contactEmail': initialErrors[field] = 'البريد الإلكتروني مطلوب'; break
        }
      }
    })
    
    setFieldErrors(initialErrors)
  }, [formData, touched])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحقق من بيانات تسجيل الدخول...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated (after loading is complete)
  if (!isAuthenticated) {
    return null // useEffect will handle redirect
  }

  // Real-time validation function
  const validateField = (name: string, value: string) => {
    let error = ''
    
    switch (name) {
      case 'title':
        if (!value.trim()) error = 'عنوان العقار مطلوب'
        break
      case 'description':
        if (!value.trim()) error = 'وصف العقار مطلوب'
        else if (value.length < 10) error = 'وصف العقار يجب أن يكون 10 أحرف على الأقل'
        break
      case 'price':
        if (!value.trim()) error = 'السعر مطلوب'
        else if (!/^\d+(\.\d{1,2})?$/.test(value)) error = 'السعر غير صحيح - يجب أن يكون رقم'
        break
      case 'area':
        if (!value.trim()) error = 'المساحة مطلوبة'
        else if (!/^\d+$/.test(value)) error = 'المساحة غير صحيحة - يجب أن تكون رقم'
        break
      case 'city':
        if (!value.trim()) error = 'المدينة مطلوبة'
        break
      case 'district':
        if (!value.trim()) error = 'المنطقة مطلوبة'
        break
      case 'address':
        if (!value.trim()) error = 'العنوان مطلوب'
        break
      case 'contactName':
        if (!value.trim()) error = 'اسم جهة التواصل مطلوب'
        break
      case 'contactPhone':
        if (!value.trim()) error = 'رقم الهاتف مطلوب'
        else if (value.length < 10) error = 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل'
        break
      case 'contactEmail':
        if (!value.trim()) error = 'البريد الإلكتروني مطلوب'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'البريد الإلكتروني غير صحيح'
        break
    }
    
    setFieldErrors(prev => ({ ...prev, [name]: error }))
    return error === ''
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }))
    
    // Real-time validation for all text fields
    if (type !== 'checkbox') {
      validateField(name, String(newValue))
    }
  }

  // Validate on blur (when user leaves the field)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name, String(value))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files)
      if (fileList.length + images.length > 10) {
        setError('يمكنك رفع 10 صور كحد أقصى')
        return
      }
      setImages(prev => [...prev, ...fileList])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    logger.log('Form submitted, user:', user ? 'Authenticated' : 'Not authenticated')
    
    if (!user) {
      setError('يجب تسجيل الدخول أولاً')
      return
    }

    setLoading(true)
    setError('')

    try {
      logger.log('Starting property submission...')
      logger.log('Form data before validation:', formData)
      
      // Client-side validation
      const requiredFields = {
        title: 'عنوان العقار',
        description: 'وصف العقار',
        price: 'السعر',
        area: 'المساحة',
        city: 'المدينة',
        district: 'المنطقة',
        address: 'العنوان',
        contactName: 'اسم جهة التواصل',
        contactPhone: 'رقم الهاتف',
        contactEmail: 'البريد الإلكتروني'
      }

      for (const [field, label] of Object.entries(requiredFields)) {
        const value = formData[field as keyof PropertyFormData]
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          logger.log(`Validation failed for field: ${field}, value:`, value)
          throw new Error(`${label} مطلوب`)
        }
      }

      // Validate price format
      if (!/^\d+(\.\d{1,2})?$/.test(formData.price)) {
        throw new Error('السعر غير صحيح - يجب أن يكون رقم')
      }

      // Validate area format
      if (!/^\d+$/.test(formData.area.trim())) {
        throw new Error('المساحة غير صحيحة - يجب أن تكون رقم')
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.contactEmail.trim())) {
        throw new Error('البريد الإلكتروني غير صحيح')
      }

      // Create FormData for file upload
      const submitData = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          submitData.append(key, value ? 'true' : 'false')
        } else {
          submitData.append(key, value.toString())
        }
      })

      // Add images
      images.forEach((image, index) => {
        submitData.append('images', image)
      })

      logger.log('Sending request to API with data:', Object.fromEntries(submitData.entries()))
      
      const response = await fetch('/api/properties', {
        method: 'POST',
        body: submitData,
      })

      logger.log('API Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        
        // Handle validation errors specifically
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const validationErrors = errorData.errors.map((err: any) => 
            `${err.path?.join('.')}: ${err.message}`
          ).join('\n')
          throw new Error(`بيانات غير صحيحة:\n${validationErrors}`)
        }
        
        throw new Error(errorData.message || 'حدث خطأ في إضافة العقار')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard/properties')
      }, 2000)

    } catch (error) {
      logger.error('Error adding property:', error)
      logger.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      })
      setError(error instanceof Error ? error.message : 'حدث خطأ غير متوقع')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-4"
        >
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تم إضافة العقار بنجاح!</h2>
          <p className="text-gray-600 mb-4">سيتم توجيهك إلى صفحة عقاراتك...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2 mb-6 text-sm"
        >
          <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <HomeIcon className="w-4 h-4 ml-1" />
            الرئيسية
          </Link>
          <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
            الداشبورد
          </Link>
          <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-medium">إضافة عقار جديد</span>
        </motion.nav>

        {/* Modern Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-3xl shadow-2xl mb-8"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full -translate-x-12 -translate-y-12"></div>
          </div>
          
          {/* Content */}
          <div className="relative px-8 py-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex items-center justify-center mb-6"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <BuildingOffice2Icon className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              إضافة عقار جديد
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              أضف عقارك واجعله مرئياً لآلاف العملاء المحتملين في جميع أنحاء مصر
            </motion.p>
            
            {/* Stats/Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex justify-center items-center gap-8 flex-wrap"
            >
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                <span className="text-2xl">🏠</span>
                <span className="text-white font-medium">عقارات متنوعة</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                <span className="text-2xl">👥</span>
                <span className="text-white font-medium">آلاف المشترين</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                <span className="text-2xl">⚡</span>
                <span className="text-white font-medium">نشر فوري</span>
              </div>
            </motion.div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full blur-sm"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/20 rounded-full blur-sm"></div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3"
          >
            <XCircleIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-red-700">
              {error.split('\n').map((line, index) => (
                <p key={index} className={index > 0 ? 'mt-1' : ''}>{line}</p>
              ))}
            </div>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">المعلومات الأساسية</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  عنوان العقار *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white ${
                    touched.title && fieldErrors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="مثال: شقة للبيع في المعادي"
                />
                {touched.title && fieldErrors.title && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1 flex items-center gap-1"
                  >
                    <XCircleIcon className="w-4 h-4" />
                    {fieldErrors.title}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  نوع العقار *
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الغرض *
                </label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                >
                  {purposes.map(purpose => (
                    <option key={purpose.value} value={purpose.value}>{purpose.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  المساحة (متر مربع) *
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white ${
                    touched.area && fieldErrors.area ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="150"
                />
                {touched.area && fieldErrors.area && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1 flex items-center gap-1"
                  >
                    <XCircleIcon className="w-4 h-4" />
                    {fieldErrors.area}
                  </motion.p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                وصف العقار * <span className="text-gray-500 text-xs">(10 أحرف على الأقل)</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white ${
                  touched.description && fieldErrors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="اكتب وصفاً تفصيلياً للعقار... (10 أحرف على الأقل)"
              />
              {touched.description && fieldErrors.description && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <XCircleIcon className="w-4 h-4" />
                  {fieldErrors.description}
                </motion.p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                {formData.description.length} حرف {formData.description.length < 10 && `(الحد الأدنى 10 أحرف)`}
              </p>
            </div>
          </motion.div>

          {/* Price and Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">التفاصيل والسعر</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر *
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    touched.price && fieldErrors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="500000"
                />
                {touched.price && fieldErrors.price && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1 flex items-center gap-1"
                  >
                    <XCircleIcon className="w-4 h-4" />
                    {fieldErrors.price}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العملة *
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {currencies.map(currency => (
                    <option key={currency.value} value={currency.value}>{currency.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عدد الغرف
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عدد الحمامات
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عدد الأدوار <span className="text-gray-500 text-xs">(للفيلا/المبنى)</span>
                </label>
                <input
                  type="number"
                  name="floors"
                  value={formData.floors}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الدور <span className="text-gray-500 text-xs">(للشقق)</span>
                </label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="5"
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">💰</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">السعر قابل للتفاوض</p>
                    <p className="text-sm text-gray-600">اسمح للمشترين بالتفاوض على السعر</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="negotiable"
                    checked={formData.negotiable}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="parking"
                    checked={formData.parking}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="mr-2 text-sm text-gray-700">جراج</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="furnished"
                    checked={formData.furnished}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="mr-2 text-sm text-gray-700">مفروش</span>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">الموقع</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدينة *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    touched.city && fieldErrors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="القاهرة"
                />
                {touched.city && fieldErrors.city && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1 flex items-center gap-1"
                  >
                    <XCircleIcon className="w-4 h-4" />
                    {fieldErrors.city}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المنطقة *
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    touched.district && fieldErrors.district ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="المعادي"
                />
                {touched.district && fieldErrors.district && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1 flex items-center gap-1"
                  >
                    <XCircleIcon className="w-4 h-4" />
                    {fieldErrors.district}
                  </motion.p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان التفصيلي *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  touched.address && fieldErrors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="شارع 9، المعادي الجديدة"
              />
              {touched.address && fieldErrors.address && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1 flex items-center gap-1"
                >
                  <XCircleIcon className="w-4 h-4" />
                  {fieldErrors.address}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <PhotoIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">صور العقار</h3>
            </div>
            
            <div className="border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center hover:from-blue-100 hover:to-indigo-100 transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PhotoIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-lg text-gray-700 mb-2 font-semibold">
                إضافة صور العقار
              </div>
              <div className="text-sm text-gray-600 mb-6">
                <label className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium bg-white px-4 py-2 rounded-full border border-blue-200 hover:border-blue-300 transition-all">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  📸 اختر الصور
                </label>
                <span className="mx-2 text-gray-400">أو</span>
                <span className="text-gray-500">اسحبها هنا</span>
              </div>
              <p className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full inline-block">
                PNG, JPG, GIF • حتى 10 صور • حد أقصى 5MB لكل صورة
              </p>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-semibold text-gray-700">الصور المختارة</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {images.length} من 10
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative group"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-28 object-cover rounded-xl border-2 border-gray-200 group-hover:border-blue-300 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                      >
                        ×
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          صورة رئيسية
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">⭐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">المميزات الإضافية</h3>
            </div>
            
            <textarea
              name="features"
              value={formData.features}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="مثال: قريب من المترو، إطلالة على النيل، تشطيب سوبر لوكس..."
            />
          </motion.div>

          {/* Additional Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">📝</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">تفاصيل إضافية</h3>
                <p className="text-sm text-gray-600">أضف أي معلومات إضافية تريد أن يعرفها المشترون</p>
              </div>
            </div>
            
            <textarea
              name="additionalDetails"
              value={formData.additionalDetails}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-gray-50 focus:bg-white"
              placeholder="مثال: &#10;• موعد التسليم: خلال 3 أشهر&#10;• شروط الدفع: نقداً أو بالتقسيط&#10;• ملحوظات خاصة: متاح للمعاينة في أي وقت&#10;• أي تفاصيل أخرى تراها مهمة..."
            />
            <div className="mt-3 flex items-start gap-2 text-sm text-gray-600 bg-purple-50 p-3 rounded-lg border border-purple-100">
              <span className="text-purple-500">💡</span>
              <div>
                <p className="font-medium text-purple-900">نصيحة:</p>
                <p>اذكر معلومات مثل موعد التسليم، شروط الدفع، الصيانة، القرب من الخدمات، أو أي ميزة خاصة</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">📞</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">معلومات التواصل</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم جهة التواصل *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    touched.contactName && fieldErrors.contactName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {touched.contactName && fieldErrors.contactName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1 flex items-center gap-1"
                  >
                    <XCircleIcon className="w-4 h-4" />
                    {fieldErrors.contactName}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف * <span className="text-gray-500 text-xs">(10 أرقام على الأقل)</span>
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    touched.contactPhone && fieldErrors.contactPhone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {touched.contactPhone && fieldErrors.contactPhone && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1 flex items-center gap-1"
                  >
                    <XCircleIcon className="w-4 h-4" />
                    {fieldErrors.contactPhone}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    touched.contactEmail && fieldErrors.contactEmail ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {touched.contactEmail && fieldErrors.contactEmail && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1 flex items-center gap-1"
                  >
                    <XCircleIcon className="w-4 h-4" />
                    {fieldErrors.contactEmail}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center"
          >
            <button
              type="submit"
              disabled={loading || Object.values(fieldErrors).some(error => error !== '') || !formData.title || !formData.description || !formData.price || !formData.area || !formData.city || !formData.district || !formData.address || !formData.contactName || !formData.contactPhone || !formData.contactEmail}
              className={`px-12 py-4 rounded-2xl flex items-center gap-3 text-lg font-semibold shadow-lg transform transition-all duration-200 ${
                loading || Object.values(fieldErrors).some(error => error !== '') || !formData.title || !formData.description || !formData.price || !formData.area || !formData.city || !formData.district || !formData.address || !formData.contactName || !formData.contactPhone || !formData.contactEmail
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-xl'
              }`}
            >
              {loading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              )}
              <span>{loading ? 'جاري الإضافة...' : '🚀 إضافة العقار'}</span>
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}