'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth, withAuth } from '@/lib/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import { logger } from '@/lib/logger'
import { 
  BuildingOffice2Icon,
  PhotoIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  HomeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

type PropertyType = 'APARTMENT' | 'VILLA' | 'OFFICE' | 'COMMERCIAL' | 'LAND'
type PropertyPurpose = 'SALE' | 'RENT'
type Currency = 'EGP' | 'USD'
type PropertyStatus = 'ACTIVE' | 'INACTIVE' | 'SOLD' | 'RENTED' | 'PENDING'

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
  status: PropertyStatus
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

const statusOptions = [
  { value: 'ACTIVE', label: 'نشط', color: 'text-green-600' },
  { value: 'INACTIVE', label: 'غير نشط', color: 'text-gray-600' },
  { value: 'PENDING', label: 'قيد المراجعة', color: 'text-yellow-600' },
  { value: 'SOLD', label: 'مباع', color: 'text-red-600' },
  { value: 'RENTED', label: 'مؤجر', color: 'text-blue-600' },
]

function EditPropertyPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])

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
    status: 'ACTIVE',
    features: '',
    additionalDetails: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  })

  // تحميل بيانات العقار
  useEffect(() => {
    if (propertyId && isAuthenticated) {
      fetchProperty()
    }
  }, [propertyId, isAuthenticated])

  // التحقق من المصادقة
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if (response.ok) {
        const property = await response.json()
        
        // التأكد من أن المستخدم يملك هذا العقار
        if (property.userId !== user?.id) {
          router.push('/dashboard')
          return
        }

        setFormData({
          title: property.title || '',
          description: property.description || '',
          price: property.price?.toString() || '',
          currency: property.currency || 'EGP',
          negotiable: property.negotiable || false,
          area: property.area?.toString() || '',
          bedrooms: property.bedrooms?.toString() || '',
          bathrooms: property.bathrooms?.toString() || '',
          floors: property.floors?.toString() || '',
          floor: property.floor?.toString() || '',
          parking: property.parking || false,
          furnished: property.furnished || false,
          city: property.city || '',
          district: property.district || '',
          address: property.address || '',
          propertyType: property.propertyType || 'APARTMENT',
          purpose: property.purpose || 'SALE',
          status: property.status || 'ACTIVE',
          features: property.features || '',
          additionalDetails: property.additionalDetails || '',
          contactName: property.contactName || '',
          contactPhone: property.contactPhone || '',
          contactEmail: property.contactEmail || '',
        })

        // استخراج URLs الصور من PropertyImage objects
        const imageUrls = property.images ? property.images.map((img: any) => img.url) : []
        setExistingImages(imageUrls)
      } else {
        setError('لم يتم العثور على العقار')
        router.push('/dashboard')
      }
    } catch (error) {
      logger.error('Error fetching property:', error)
      setError('خطأ في تحميل بيانات العقار')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setImages(selectedFiles)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const formDataToSend = new FormData()
      
      // إضافة بيانات النموذج
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString())
      })

      // إضافة الصور الجديدة
      images.forEach((image, index) => {
        formDataToSend.append(`images`, image)
      })

      // إضافة الصور الموجودة
      formDataToSend.append('existingImages', JSON.stringify(existingImages))

      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        body: formDataToSend,
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.message || 'حدث خطأ في تحديث العقار')
      }
    } catch (error) {
      logger.error('Error updating property:', error)
      setError('حدث خطأ في تحديث العقار')
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
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
          <span className="text-blue-600 font-medium">تعديل العقار</span>
        </motion.nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-800 bg-gray-100 px-4 py-2 rounded-lg transition-colors">
              <ArrowLeftIcon className="w-5 h-5 ml-2" />
              العودة للداشبورد
            </Link>
            <div className="text-sm text-gray-500">
              تعديل العقار • {formData.title || 'بدون عنوان'}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">تعديل العقار</h1>
            <p className="text-lg opacity-90">قم بتحديث بيانات عقارك</p>
          </div>
        </motion.div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center"
          >
            <CheckCircleIcon className="w-5 h-5 ml-2" />
            تم تحديث العقار بنجاح! جاري التوجيه...
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center"
          >
            <XCircleIcon className="w-5 h-5 ml-2" />
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* القسم 1: المعلومات الأساسية */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <h2 className="text-xl font-bold text-gray-800">المعلومات الأساسية</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان العقار *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: شقة 3 غرف في التجمع الخامس"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حالة العقار *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف العقار *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="اكتب وصف مفصل للعقار..."
                />
              </div>
            </div>
          </motion.div>

          {/* القسم 2: التفاصيل والسعر */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <h2 className="text-xl font-bold text-gray-800">التفاصيل والسعر</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع العقار *
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {propertyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الغرض *
                </label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {purposes.map((purpose) => (
                    <option key={purpose.value} value={purpose.value}>
                      {purpose.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المساحة (م²) *
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="1500000"
                />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {currencies.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="parking"
                    checked={formData.parking}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">موقف سيارة</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="furnished"
                    checked={formData.furnished}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">مؤثث</span>
                </label>
              </div>
            </div>
          </motion.div>

          {/* القسم 3: الموقع */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <h2 className="text-xl font-bold text-gray-800">الموقع</h2>
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
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="القاهرة"
                />
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
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="التجمع الخامس"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان التفصيلي
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="شارع التسعين الشمالي، بجوار مول كايرو فستيفال"
                />
              </div>
            </div>
          </motion.div>

          {/* القسم 4: الصور */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <h2 className="text-xl font-bold text-gray-800">الصور</h2>
            </div>

            {/* الصور الموجودة */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">الصور الحالية:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`صورة العقار ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setExistingImages(prev => prev.filter((_, i) => i !== index))
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* رفع صور جديدة */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
              <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="mb-4">
                <label className="cursor-pointer">
                  <span className="text-purple-600 hover:text-purple-500 font-medium">
                    اختر صور جديدة
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <span className="text-gray-500"> أو اسحب الصور هنا</span>
              </div>
              <p className="text-sm text-gray-500">
                يمكنك رفع حتى 10 صور • PNG, JPG, GIF حتى 10MB
              </p>
            </div>

            {images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">الصور الجديدة المحددة:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`معاينة ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImages(prev => prev.filter((_, i) => i !== index))
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* القسم 5: معلومات إضافية */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                5
              </div>
              <h2 className="text-xl font-bold text-gray-800">معلومات إضافية</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المميزات الخاصة
                </label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="مثال: قريب من المدارس، إطلالة على النيل، حديقة خاصة..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تفاصيل إضافية
                </label>
                <textarea
                  name="additionalDetails"
                  value={formData.additionalDetails}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50/50 focus:bg-white"
                  placeholder="مثال:&#10;• موعد التسليم: خلال 3 أشهر&#10;• شروط الدفع: نقداً أو بالتقسيط&#10;• ملحوظات خاصة: متاح للمعاينة في أي وقت&#10;• أي تفاصيل أخرى تراها مهمة..."
                />
                <p className="mt-2 text-sm text-purple-600">💡 اذكر معلومات مثل موعد التسليم، شروط الدفع، الصيانة، القرب من الخدمات، أو أي ميزة خاصة</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم جهة الاتصال *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="أحمد محمد"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="01012345678"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>
            </div>
          </motion.div>

          {/* أزرار الحفظ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-4 justify-end"
          >
            <Link href="/dashboard">
              <button
                type="button"
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                إلغاء
              </button>
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  حفظ التغييرات
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}

export default withAuth(EditPropertyPage)