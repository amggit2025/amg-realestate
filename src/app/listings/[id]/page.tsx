'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  MapPinIcon,
  HomeIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  CalendarIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  XMarkIcon,
  CheckCircleIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { generatePropertyWhatsAppLink } from '@/lib/whatsapp'

interface Property {
  id: string
  title: string
  description: string
  propertyType: string
  purpose: string
  status: string
  city: string
  district: string
  address: string
  price: number
  currency: string
  negotiable?: boolean
  area: number
  bedrooms?: number
  bathrooms?: number
  floors?: number
  floor?: number
  yearBuilt?: number
  features: string[]
  additionalDetails?: string
  images: Array<{
    id: string
    url: string
  }>
  user: {
    id: string
    firstName: string
    lastName: string
    phone?: string
    email?: string
    userType: string
    verified: boolean
  }
  views: number
  createdAt: string
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [showInquiryModal, setShowInquiryModal] = useState(false)
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [submittingInquiry, setSubmittingInquiry] = useState(false)

  // جلب بيانات العقار
  useEffect(() => {
    fetchProperty()
  }, [propertyId])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/public/${propertyId}`, {
        credentials: 'include'
      })
      
      if (!response.ok) {
        console.error('Failed to fetch property, status:', response.status)
        setLoading(false)
        return
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response is not JSON:', await response.text())
        setLoading(false)
        return
      }

      const data = await response.json()
      
      // تحويل features من string إلى array إذا لزم الأمر
      const propertyData = data.property
      if (propertyData.features && typeof propertyData.features === 'string') {
        propertyData.features = propertyData.features
          .split(',')
          .map((f: string) => f.trim())
          .filter((f: string) => f.length > 0)
      } else if (!propertyData.features) {
        propertyData.features = []
      }
      setProperty(propertyData)
    } catch (error) {
      console.error('Error fetching property:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    const formatter = new Intl.NumberFormat('ar-EG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    return `${formatter.format(price)} ${currency === 'EGP' ? 'ج.م' : '$'}`
  }

  const getPropertyTypeText = (type: string) => {
    const types: Record<string, string> = {
      APARTMENT: 'شقة',
      VILLA: 'فيلا',
      OFFICE: 'مكتب',
      COMMERCIAL: 'تجاري',
      LAND: 'أرض',
      PENTHOUSE: 'بنتهاوس',
      DUPLEX: 'دوبلكس',
      STUDIO: 'استوديو'
    }
    return types[type] || type
  }

  const getPurposeText = (purpose: string) => {
    return purpose === 'SALE' ? 'للبيع' : 'للإيجار'
  }

  const getStatusText = (status: string) => {
    const statuses: Record<string, string> = {
      ACTIVE: 'متاح',
      PENDING: 'معلق',
      SOLD: 'مباع',
      RENTED: 'مؤجر'
    }
    return statuses[status] || status
  }

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      )
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: property?.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('تم نسخ رابط العقار!')
    }
  }

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.message) {
      alert('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    setSubmittingInquiry(true)

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: inquiryForm.name,
          email: inquiryForm.email,
          phone: inquiryForm.phone,
          subject: `استفسار عن ${property?.title}`,
          message: inquiryForm.message,
          inquiryType: 'PROPERTY',
          propertyId: property?.id,
          userId: property?.user.id,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('✅ تم إرسال استفسارك بنجاح! سيتم التواصل معك قريباً.')
        setShowInquiryModal(false)
        setInquiryForm({ name: '', email: '', phone: '', message: '' })
      } else {
        alert(data.message || 'حدث خطأ أثناء إرسال الاستفسار')
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error)
      alert('حدث خطأ أثناء إرسال الاستفسار. يرجى المحاولة مرة أخرى.')
    } finally {
      setSubmittingInquiry(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <HomeIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">العقار غير موجود</h2>
          <p className="text-gray-600 mb-6">الرجاء التحقق من الرابط والمحاولة مرة أخرى</p>
          <Link href="/listings">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
              العودة للإعلانات
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600 transition-colors">الرئيسية</Link>
              <ChevronLeftIcon className="w-4 h-4" />
              <Link href="/listings" className="hover:text-blue-600 transition-colors">الإعلانات</Link>
              <ChevronLeftIcon className="w-4 h-4" />
              <span className="text-blue-600 font-semibold">تفاصيل العقار</span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 rounded-full bg-gray-100 hover:bg-red-50 transition-colors"
                title="إضافة للمفضلة"
              >
                {isFavorite ? (
                  <HeartSolidIcon className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-gray-600" />
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 transition-colors"
                title="مشاركة"
              >
                <ShareIcon className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl"
            >
              {/* Main Image */}
              <div className="relative h-96 md:h-[500px] bg-gray-900">
                {property.images.length > 0 ? (
                  <>
                    <Image
                      src={property.images[currentImageIndex].url}
                      alt={property.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    
                    {/* Navigation Arrows */}
                    {property.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                        >
                          <ChevronRightIcon className="w-6 h-6 text-gray-800" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                        >
                          <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>

                    {/* Expand Button */}
                    <button
                      onClick={() => setShowImageModal(true)}
                      className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                    >
                      <SparklesIcon className="w-5 h-5 text-gray-800" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <HomeIcon className="w-32 h-32 text-white/30" />
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {property.images.length > 1 && (
                <div className="p-4 bg-gray-50 border-t">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {property.images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? 'border-blue-600 ring-2 ring-blue-300'
                            : 'border-gray-200 hover:border-blue-400'
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt={`صورة ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            >
              {/* Title & Badges */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {getPurposeText(property.purpose)}
                    </span>
                    <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {getPropertyTypeText(property.propertyType)}
                    </span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                      {getStatusText(property.status)}
                    </span>
                    {property.user.verified && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <CheckCircleIcon className="w-4 h-4" />
                        معلن موثق
                      </span>
                    )}
                  </div>
                  
                  {/* Views Badge - مميز */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
                  >
                    <EyeIcon className="w-5 h-5" />
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-medium opacity-90">المشاهدات</span>
                      <span className="text-lg font-bold leading-none">{property.views.toLocaleString('ar-EG')}</span>
                    </div>
                  </motion.div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {property.title}
                </h1>

                <div className="flex items-center text-gray-600 mb-4">
                  <MapPinIcon className="w-5 h-5 ml-2 text-blue-600" />
                  <span className="text-lg">
                    {property.address || `${property.district}, ${property.city}`}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {formatPrice(property.price, property.currency)}
                  </div>
                  {property.purpose === 'RENT' && (
                    <span className="text-xl text-gray-500 font-medium">/شهرياً</span>
                  )}
                  {property.negotiable && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg"
                    >
                      <span className="text-xl">💰</span>
                      قابل للتفاوض
                    </motion.span>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HomeIcon className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">المساحة</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{property.area} م²</p>
                </div>

                {property.bedrooms && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🛏️</span>
                      <span className="text-sm text-gray-600">غرف النوم</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
                  </div>
                )}

                {property.bathrooms && (
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🚿</span>
                      <span className="text-sm text-gray-600">الحمامات</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{property.bathrooms}</p>
                  </div>
                )}

                {property.floors && (
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🏢</span>
                      <span className="text-sm text-gray-600">عدد الأدوار</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{property.floors}</p>
                  </div>
                )}

                {property.floor && (
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🔢</span>
                      <span className="text-sm text-gray-600">الدور</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{property.floor}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                  وصف العقار
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>

              {/* Additional Details */}
              {property.additionalDetails && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    تفاصيل إضافية
                  </h2>
                  <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-xl p-6 border-2 border-purple-200">
                    <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">
                      {property.additionalDetails}
                    </p>
                  </div>
                </div>
              )}

              {/* Features */}
              {property.features && Array.isArray(property.features) && property.features.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-blue-600" />
                    المميزات
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200"
                      >
                        <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-800 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 sticky top-24"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">تواصل مع المعلن</h3>

              {/* Owner Info */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {property.user.firstName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">
                      {property.user.firstName} {property.user.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {property.user.userType === 'BROKER' ? 'وسيط عقاري' :
                       property.user.userType === 'DEVELOPER' ? 'مطور عقاري' :
                       property.user.userType === 'AGENCY' ? 'وكالة عقارية' : 'مالك'}
                    </p>
                  </div>
                  {property.user.verified && (
                    <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                  )}
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                {/* Phone Button */}
                {property.user.phone && (
                  <a href={`tel:${property.user.phone}`} className="block">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                    >
                      <PhoneIcon className="w-5 h-5" />
                      اتصل الآن
                    </motion.button>
                  </a>
                )}

                {/* WhatsApp Button */}
                <a 
                  href={generatePropertyWhatsAppLink({
                    title: property.title,
                    price: property.price,
                    currency: property.currency,
                    propertyType: property.propertyType,
                    purpose: property.purpose,
                    city: property.city,
                    district: property.district,
                    area: property.area,
                    bedrooms: property.bedrooms,
                    bathrooms: property.bathrooms,
                    url: typeof window !== 'undefined' ? window.location.href : undefined
                  })}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.75-1.866-.75-1.866-1.008-2.313-.248-.428-.512-.37-.704-.377-.18-.007-.384-.007-.584-.007s-.527.074-.804.372c-.277.297-1.057 1.033-1.057 2.521s1.082 2.924 1.232 3.122c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    </svg>
                    تواصل عبر واتساب
                  </motion.button>
                </a>

                {/* Inquiry Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowInquiryModal(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  إرسال استفسار
                </motion.button>
              </div>

              {/* Property Info */}
              <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <span>تاريخ النشر: {new Date(property.createdAt).toLocaleDateString('ar-EG')}</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && property.images.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={property.images[currentImageIndex].url}
              alt={property.title}
              fill
              className="object-contain"
            />

            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
                >
                  <ChevronRightIcon className="w-8 h-8 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
                >
                  <ChevronLeftIcon className="w-8 h-8 text-white" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {showInquiryModal && property && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <EnvelopeIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">إرسال استفسار</h3>
                    <p className="text-sm text-white/80 mt-1">سنتواصل معك في أقرب وقت</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInquiryModal(false)}
                  className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Property Info */}
            <div className="p-4 bg-gray-50 border-b">
              <div className="flex items-center gap-3">
                {property.images[0] && (
                  <img
                    src={property.images[0].url}
                    alt={property.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{property.title}</h4>
                  <p className="text-sm text-gray-600">
                    {property.city} - {formatPrice(property.price, property.currency)}
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleInquirySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الاسم <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                  placeholder="أدخل اسمك الكامل"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={inquiryForm.email}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الرسالة <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  placeholder="اكتب استفسارك هنا..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInquiryModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submittingInquiry}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {submittingInquiry ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <EnvelopeIcon className="w-5 h-5" />
                      إرسال الاستفسار
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
