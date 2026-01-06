'use client'

export const dynamic = 'force-dynamic'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { logger } from '@/lib/logger'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  HomeIcon,
  CurrencyDollarIcon,
  EyeIcon,
  PhoneIcon,
  TagIcon,
  FunnelIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import { ChatBubbleLeftRightIcon, StarIcon } from '@heroicons/react/24/solid'

// واجهة بيانات العقارات
interface Property {
  id: string
  title: string
  description: string
  propertyType: string
  purpose: string
  city: string
  district: string
  address: string
  price: number
  area: number
  bedrooms: number
  bathrooms: number
  negotiable?: boolean
  images: Array<{
    id: string
    url: string
  }>
  user: {
    firstName: string
    lastName: string
    phone?: string
    email?: string
  }
  createdAt: string
}

const colors = {
  primary: 'from-violet-600 to-indigo-600',
  secondary: 'from-pink-500 to-rose-500',
  accent: 'from-amber-400 to-orange-500',
  dark: 'bg-slate-900',
  light: 'bg-slate-50',
  card: 'bg-white',
  text: 'text-slate-800',
  textLight: 'text-slate-500'
}

export default function ListingsPage() {
  // Get search parameters from URL
  const searchParams = useSearchParams()
  const urlLocation = searchParams?.get('location') || ''
  const urlType = searchParams?.get('type') || ''
  
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [searchTerm, setSearchTerm] = useState(urlLocation)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    propertyType: urlType,
    purpose: '',
    minPrice: '',
    maxPrice: '',
    city: urlLocation
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProperties, setTotalProperties] = useState(0)
  const [contactingProperty, setContactingProperty] = useState<string | null>(null)
  const itemsPerPage = 12

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filters.propertyType && { propertyType: filters.propertyType }),
        ...(filters.purpose && { purpose: filters.purpose }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.city && { city: filters.city })
      })

      console.log('🔍 Fetching properties with params:', params.toString())

      const response = await fetch(`/api/properties/public?${params}`)
      
      console.log('📡 Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Properties loaded:', data.properties?.length || 0)
        setProperties(data.properties || [])
        setTotalPages(data.totalPages || 1)
        setTotalProperties(data.total || 0)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ Server error:', response.status, errorData)
        logger.error('فشل في تحميل العقارات - الخطأ:', errorData.error || response.statusText)
        setProperties([])
      }
    } catch (error) {
      console.error('❌ Network error:', error)
      logger.error('خطأ في الاتصال بالسيرفر:', error)
      setProperties([])
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties()
    }, searchTerm ? 500 : 0)

    return () => clearTimeout(timer)
  }, [currentPage, filters, searchTerm])

  useEffect(() => {
    if (currentPage > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentPage])

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
    setCurrentPage(1)
  }

  const handleSearch = () => {
    setCurrentPage(1)
    setLoading(false)
    fetchProperties()
  }

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

  const handleContact = async (contactType: 'phone' | 'message', property: Property) => {
    setContactingProperty(property.id)
    
    try {
      const phoneNumber = property.user.phone || '01000000000'
      
      if (contactType === 'phone') {
        window.location.href = `tel:${phoneNumber}`
      } else {
        const message = `مرحباً، أنا مهتم بالعقار: ${property.title} (${formatPrice(property.price)})`
        const cleanPhone = phoneNumber.replace(/[^0-9]/g, '')
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank')
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error contacting:', error)
    } finally {
      setContactingProperty(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pt-28">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] bg-slate-900 flex flex-col">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000&auto=format&fit=crop"
            alt="Real Estate Listings"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-slate-50"></div>
        </div>

        {/* Content */}
        <div className="relative flex-1 container mx-auto px-4 flex flex-col items-center justify-center text-center z-10 pt-32 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-sm font-medium mb-6">
              اكتشف منزل أحلامك
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              عقارات مميزة <br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${colors.primary}`}>
                لنمط حياة استثنائي
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
              تصفح آلاف العقارات المتاحة للبيع والإيجار في أرقى المناطق، 
              واختر ما يناسب طموحاتك وميزانيتك.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full max-w-4xl relative z-50"
          >
            <div className="bg-white p-2 rounded-[2rem] shadow-2xl shadow-indigo-500/20 border border-white/50 backdrop-blur-xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-6 w-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="ابحث بالمنطقة، المدينة، أو اسم المشروع..."
                  className="w-full h-14 pr-12 pl-4 bg-slate-50 border-none rounded-[1.5rem] text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all text-lg"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`h-14 px-6 rounded-[1.5rem] border border-slate-200 flex items-center gap-2 font-medium transition-all ${showFilters ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  <AdjustmentsHorizontalIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">تصفية</span>
                </button>
                
                <button
                  onClick={handleSearch}
                  className={`h-14 px-8 rounded-[1.5rem] bg-gradient-to-r ${colors.primary} text-white font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2`}
                >
                  <span>بحث</span>
                </button>
              </div>
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500">نوع العقار</label>
                      <select
                        value={filters.propertyType}
                        onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      >
                        <option value="">الكل</option>
                        <option value="APARTMENT">شقة</option>
                        <option value="VILLA">فيلا</option>
                        <option value="HOUSE">منزل</option>
                        <option value="OFFICE">مكتب</option>
                        <option value="COMMERCIAL">تجاري</option>
                        <option value="LAND">أرض</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500">الغرض</label>
                      <select
                        value={filters.purpose}
                        onChange={(e) => handleFilterChange('purpose', e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      >
                        <option value="">الكل</option>
                        <option value="SALE">للبيع</option>
                        <option value="RENT">للإيجار</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500">السعر (من)</label>
                      <input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        placeholder="0"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500">السعر (إلى)</label>
                      <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        placeholder="لا يوجد حد"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12 -mt-20 relative z-10">
        {/* Stats Bar */}
        {!loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-slate-600 font-medium">
                تم العثور على <span className="text-indigo-600 font-bold text-lg">{totalProperties}</span> عقار
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>ترتيب حسب:</span>
              <select className="bg-transparent font-medium text-slate-800 outline-none cursor-pointer">
                <option>الأحدث</option>
                <option>الأعلى سعراً</option>
                <option>الأقل سعراً</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* Loading Spinner */}
        {loading && initialLoad ? (
          <div className="min-h-[500px] flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Outer Ring */}
              <div className="w-24 h-24 rounded-full border-4 border-indigo-100"></div>
              {/* Spinning Ring */}
              <div className="absolute w-24 h-24 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
              {/* Inner Icon */}
              <HomeIcon className="absolute w-8 h-8 text-indigo-600 animate-bounce" />
            </div>
            <h3 className="mt-8 text-xl font-bold text-slate-800">جاري التحميل</h3>
            <p className="text-slate-500 mt-2">نبحث لك عن أفضل الخيارات...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-slate-100">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <HomeIcon className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">لا توجد نتائج</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              لم نتمكن من العثور على عقارات تطابق معايير البحث الخاصة بك. 
              حاول تغيير الفلاتر أو البحث عن منطقة أخرى.
            </p>
            <button 
              onClick={() => {
                setSearchTerm('')
                setFilters({ propertyType: '', purpose: '', minPrice: '', maxPrice: '', city: '' })
              }}
              className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors"
            >
              مسح جميع الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-[2rem] overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 border border-slate-100 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative h-72 overflow-hidden">
                  <Link href={`/listings/${property.id}`}>
                    <Image
                      src={property.images[0]?.url || '/images/placeholder.jpg'}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </Link>
                  
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-md ${
                      property.purpose === 'SALE' 
                        ? 'bg-emerald-500/90' 
                        : 'bg-blue-500/90'
                    }`}>
                      {getPurposeLabel(property.purpose)}
                    </span>
                    {property.negotiable && (
                      <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-amber-500/90 shadow-lg backdrop-blur-md">
                        قابل للتفاوض
                      </span>
                    )}
                  </div>

                  <div className="absolute top-4 left-4">
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all duration-300">
                      <StarIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between shadow-lg">
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-0.5">السعر</p>
                        <p className="text-lg font-bold text-indigo-600">
                          {formatPrice(property.price)}
                        </p>
                      </div>
                      <span className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <TagIcon className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 mb-3 bg-indigo-50 w-fit px-3 py-1 rounded-lg">
                    <HomeIcon className="w-4 h-4" />
                    {getPropertyTypeLabel(property.propertyType)}
                  </div>

                  <Link href={`/listings/${property.id}`}>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {property.title}
                    </h3>
                  </Link>

                  <div className="flex items-center text-slate-500 text-sm mb-6">
                    <MapPinIcon className="w-4 h-4 ml-1 text-slate-400" />
                    {property.city}، {property.district}
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-100 mb-6">
                    <div className="text-center">
                      <p className="text-slate-400 text-xs mb-1">المساحة</p>
                      <p className="font-bold text-slate-700">{property.area} م²</p>
                    </div>
                    <div className="text-center border-r border-slate-100">
                      <p className="text-slate-400 text-xs mb-1">غرف</p>
                      <p className="font-bold text-slate-700">{property.bedrooms}</p>
                    </div>
                    <div className="text-center border-r border-slate-100">
                      <p className="text-slate-400 text-xs mb-1">حمامات</p>
                      <p className="font-bold text-slate-700">{property.bathrooms}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link href={`/listings/${property.id}`} className="flex-1">
                      <button className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 group/btn">
                        <span>التفاصيل</span>
                        <EyeIcon className="w-5 h-5 group-hover/btn:text-indigo-600 transition-colors" />
                      </button>
                    </Link>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleContact('phone', property)}
                        className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm hover:shadow-emerald-500/30"
                      >
                        <PhoneIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleContact('message', property)}
                        className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm hover:shadow-blue-500/30"
                      >
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <div className="bg-white p-2 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors font-medium"
              >
                السابق
              </button>
              
              <div className="flex items-center gap-1 px-2 border-x border-slate-100">
                {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                  const pageNumber = index + 1; // Simplified for demo
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-10 h-10 rounded-xl font-bold transition-all ${
                        currentPage === pageNumber
                          ? `bg-gradient-to-r ${colors.primary} text-white shadow-lg shadow-indigo-500/30`
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors font-medium"
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}