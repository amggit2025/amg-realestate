'use client'

export const dynamic = 'force-dynamic'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { logger } from '@/lib/logger'
import Image from 'next/image'
import Link from 'next/link'
import { 
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  CalendarDaysIcon,
  ShareIcon,
  XMarkIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  Square2StackIcon,
  PhotoIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline'
import { HeartIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'

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
  features: string | null
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

const colors = {
  primary: 'from-violet-600 to-indigo-600',
  secondary: 'from-pink-500 to-rose-500',
  accent: 'from-amber-400 to-orange-500',
  success: 'from-emerald-500 to-teal-500',
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

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/public/${propertyId}`)
        if (response.ok) {
          const data = await response.json()
          setProperty(data.property)
        } else {
          logger.error('Failed to fetch property details')
          router.push('/listings')
        }
      } catch (error) {
        logger.error('Error fetching property:', error)
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId, router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0
    }).format(price)
  }

  const getPropertyTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'APARTMENT': 'شقة',
      'VILLA': 'فيلا',
      'HOUSE': 'منزل',
      'OFFICE': 'مكتب',
      'COMMERCIAL': 'تجاري',
      'LAND': 'أرض'
    }
    return types[type] || type
  }

  const getPurposeLabel = (purpose: string) => {
    return purpose === 'SALE' ? 'للبيع' : 'للإيجار'
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: property?.title,
        text: `شاهد هذا العقار المميز: ${property?.title}`,
        url: window.location.href
      })
    } catch (error) {
      console.log('Error sharing:', error)
    }
  }

  const handleContact = (type: 'phone' | 'whatsapp') => {
    if (!property?.user.phone) return

    const phoneNumber = property.user.phone
    if (type === 'phone') {
      window.location.href = `tel:${phoneNumber}`
    } else {
      const message = `مرحباً، أنا مهتم بالعقار: ${property.title} (${formatPrice(property.price)})`
      const cleanPhone = phoneNumber.replace(/[^0-9]/g, '')
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank')
    }
  }

  const getFeaturesList = () => {
    if (!property?.features) return []
    
    if (Array.isArray(property.features)) return property.features

    try {
      const parsed = JSON.parse(property.features)
      if (Array.isArray(parsed)) return parsed
    } catch (e) {
      // Not JSON
    }

    return property.features.split(',').map(f => f.trim()).filter(Boolean)
  }

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!property) return
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!property) return
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">جاري تحميل تفاصيل العقار...</p>
        </div>
      </div>
    )
  }

  if (!property) return null

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans pt-24">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumb & Actions */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-indigo-600">الرئيسية</Link>
            <span>/</span>
            <Link href="/listings" className="hover:text-indigo-600">العقارات</Link>
            <span>/</span>
            <span className="text-slate-800 font-medium truncate max-w-[200px]">{property.title}</span>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all text-sm font-medium"
            >
              <ShareIcon className="w-4 h-4" />
              مشاركة
            </button>
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-medium ${
                isFavorite 
                  ? 'bg-rose-50 border-rose-200 text-rose-600' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-rose-600'
              }`}
            >
              <HeartIcon className="w-4 h-4" />
              {isFavorite ? 'مفضلة' : 'حفظ'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Right Column: Slider & Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Image Slider */}
            <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-100">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-900 group">
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={property.images[currentImageIndex]?.url || '/images/placeholder.jpg'}
                      alt={property.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Slider Controls */}
                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={prevImage}
                    className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm transition-all"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm transition-all"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Fullscreen Button */}
                <button 
                  onClick={() => setShowImageModal(true)}
                  className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                >
                  <ArrowsPointingOutIcon className="w-5 h-5" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {property.images.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-2 scrollbar-hide">
                  {property.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                        currentImageIndex === index ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">تفاصيل العقار</h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </div>
              
              {property.additionalDetails && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">تفاصيل إضافية</h3>
                  <p className="text-slate-600">{property.additionalDetails}</p>
                </div>
              )}
            </div>

            {/* Features */}
            {getFeaturesList().length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">المميزات والخدمات</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {getFeaturesList().map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Placeholder */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 overflow-hidden">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">الموقع</h2>
              <div className="flex items-center gap-2 text-slate-600 mb-6">
                <MapPinIcon className="w-5 h-5 text-indigo-500" />
                <span>{property.address}، {property.district}، {property.city}</span>
              </div>
              <div className="relative h-64 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
                <div className="text-center">
                  <MapPinIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500">الخريطة غير متاحة حالياً</p>
                </div>
              </div>
            </div>

          </div>

          {/* Left Column: Sidebar Info (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Main Info Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 sticky top-24">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${
                  property.purpose === 'SALE' ? colors.success : colors.primary
                }`}>
                  {getPurposeLabel(property.purpose)}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                  {getPropertyTypeLabel(property.propertyType)}
                </span>
                {property.negotiable && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                    قابل للتفاوض
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">
                {property.title}
              </h1>
              
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                <MapPinIcon className="w-4 h-4" />
                {property.city}، {property.district}
              </div>

              <div className="mb-6">
                <p className="text-slate-400 text-xs mb-1">السعر المطلوب</p>
                <div className="text-3xl font-bold text-indigo-600 flex items-center gap-1">
                  {formatPrice(property.price)}
                </div>
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                  <Square2StackIcon className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
                  <p className="text-xs text-slate-500">المساحة</p>
                  <p className="font-bold text-slate-800">{property.area} م²</p>
                </div>
                {property.bedrooms && (
                  <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                    <span className="text-lg block mb-1">🛏️</span>
                    <p className="text-xs text-slate-500">غرف</p>
                    <p className="font-bold text-slate-800">{property.bedrooms}</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                    <span className="text-lg block mb-1">🚿</span>
                    <p className="text-xs text-slate-500">حمام</p>
                    <p className="font-bold text-slate-800">{property.bathrooms}</p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 my-6"></div>

              {/* Agent Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 flex items-center gap-1">
                    {property.user.firstName} {property.user.lastName}
                    {property.user.verified && (
                      <ShieldCheckIcon className="w-4 h-4 text-blue-500" title="موثوق" />
                    )}
                  </h3>
                  <p className="text-slate-500 text-xs">
                    {property.user.userType === 'AGENT' ? 'وكيل عقاري' : 'المالك'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => handleContact('phone')}
                  className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
                >
                  <PhoneIcon className="w-5 h-5" />
                  <span>اتصال</span>
                </button>
                
                <button 
                  onClick={() => handleContact('whatsapp')}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  <span>واتساب</span>
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                  <CalendarDaysIcon className="w-3 h-3" />
                  نشر في {new Date(property.createdAt).toLocaleDateString('ar-EG')}
                </p>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100">
              <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2 text-sm">
                <ShieldCheckIcon className="w-5 h-5" />
                نصائح السلامة
              </h3>
              <ul className="space-y-2 text-xs text-indigo-800/80">
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0"></span>
                  لا تقم بتحويل أي أموال قبل معاينة العقار.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0"></span>
                  تأكد من صحة أوراق الملكية.
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>

      {/* Image Modal (Lightbox) */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setShowImageModal(false)}
          >
            <button 
              onClick={() => setShowImageModal(false)}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 z-50"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>

            <div className="relative w-full h-full max-w-7xl mx-auto p-4 flex items-center justify-center" onClick={e => e.stopPropagation()}>
              <div className="relative w-full h-[80vh]">
                <Image
                  src={property.images[currentImageIndex].url}
                  alt={property.title}
                  fill
                  className="object-contain"
                />
              </div>
              
              {/* Modal Navigation */}
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <span className="text-white font-medium bg-black/50 px-4 py-1 rounded-full backdrop-blur-sm">
                {currentImageIndex + 1} / {property.images.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
