'use client'

import { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Building2, Clock, CheckCircle2, XCircle, Eye, Edit, Trash2,
  MapPin, DollarSign, Phone, Mail, Calendar, AlertCircle, ArrowRight,
  User, Home, Ruler, BedDouble, Bath, Sparkles, Camera, TrendingUp
} from 'lucide-react'

interface PropertyRequest {
  id: string
  propertyType: string
  purpose: string
  area: number
  price: number
  governorate: string
  city: string
  district: string
  address?: string
  ownerName: string
  ownerPhone: string
  ownerEmail: string
  status: string
  serviceType: string
  images: string[]
  features: any
  bedrooms?: number
  bathrooms?: number
  description: string
  adminNotes?: string
  visitDate?: string
  visitNotes?: string
  createdAt: string
  updatedAt: string
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  PENDING: { label: 'قيد الانتظار', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: <Clock size={20} /> },
  REVIEWING: { label: 'قيد المراجعة', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: <Eye size={20} /> },
  VISIT_SCHEDULED: { label: 'تم جدولة المعاينة', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200', icon: <Calendar size={20} /> },
  APPROVED: { label: 'تمت الموافقة', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: <CheckCircle2 size={20} /> },
  REJECTED: { label: 'مرفوض', color: 'text-red-600', bg: 'bg-red-50 border-red-200', icon: <XCircle size={20} /> },
  COMPLETED: { label: 'مكتمل', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200', icon: <CheckCircle2 size={20} /> },
}

const propertyTypeLabels: Record<string, string> = {
  APARTMENT: 'شقة',
  apartment: 'شقة',
  VILLA: 'فيلا',
  villa: 'فيلا',
  TOWNHOUSE: 'تاون هاوس',
  townhouse: 'تاون هاوس',
  DUPLEX: 'دوبلكس',
  duplex: 'دوبلكس',
  PENTHOUSE: 'بنتهاوس',
  penthouse: 'بنتهاوس',
  LAND: 'أرض',
  land: 'أرض',
  OFFICE: 'مكتب',
  office: 'مكتب',
  COMMERCIAL: 'محل تجاري',
  shop: 'محل تجاري',
}

const serviceTypeLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  MARKETING_ONLY: { label: 'تسويق فقط', icon: <TrendingUp size={18} />, color: 'text-blue-600 bg-blue-50' },
  marketing: { label: 'تسويق فقط', icon: <TrendingUp size={18} />, color: 'text-blue-600 bg-blue-50' },
  MARKETING_AND_VISIT: { label: 'تسويق + تصوير', icon: <Camera size={18} />, color: 'text-purple-600 bg-purple-50' },
  marketing_photo: { label: 'تسويق + تصوير', icon: <Camera size={18} />, color: 'text-purple-600 bg-purple-50' },
  VALUATION: { label: 'تقييم عقاري', icon: <Sparkles size={18} />, color: 'text-green-600 bg-green-50' },
  valuation: { label: 'تقييم عقاري', icon: <Sparkles size={18} />, color: 'text-green-600 bg-green-50' },
}

export default function PropertyRequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [request, setRequest] = useState<PropertyRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/auth/login?redirect=/dashboard/my-requests/${id}`)
    }
  }, [user, authLoading, router, id])

  useEffect(() => {
    if (user) {
      fetchRequest()
    }
  }, [user, id])

  const fetchRequest = async () => {
    try {
      const response = await fetch(`/api/user/property-requests/${id}`, {
        credentials: 'include',
        cache: 'no-store',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء جلب البيانات')
      }

      setRequest(data.data)
    } catch (error) {
      console.error('Error fetching request:', error)
      setError(error instanceof Error ? error.message : 'حدث خطأ غير متوقع')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return

    try {
      const response = await fetch(`/api/user/property-requests/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'حدث خطأ أثناء الحذف')
      }

      router.push('/dashboard/my-requests')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء الحذف')
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1e3a5f] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">جاري تحميل التفاصيل...</p>
        </div>
      </div>
    )
  }

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

  if (!request || !user) return null

  const status = statusConfig[request.status] || statusConfig.PENDING
  const propertyType = propertyTypeLabels[request.propertyType] || request.propertyType
  const serviceType = serviceTypeLabels[request.serviceType] || { label: request.serviceType, icon: <TrendingUp size={18} />, color: 'text-gray-600 bg-gray-50' }
  const images = Array.isArray(request.images) ? request.images : []

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20" dir="rtl">
      {/* Hero Header */}
      <div className="bg-[#1e3a5f] text-white pt-36 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f]/20 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/dashboard/my-requests"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowRight size={18} />
              العودة إلى طلباتي
            </Link>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {propertyType} لل{request.purpose === 'SALE' || request.purpose === 'sale' ? 'بيع' : 'إيجار'}
                </h1>
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin size={16} />
                  {request.city}، {request.governorate}
                </div>
              </div>
              
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${status.bg} ${status.color} font-bold`}>
                {status.icon}
                {status.label}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Images Gallery */}
              {images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={images[selectedImage]}
                      alt={`صورة ${selectedImage + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {images.length > 1 && (
                    <div className="p-4 flex gap-2 overflow-x-auto">
                      {images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                            selectedImage === index ? 'border-[#d4af37] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <Image src={img} alt={`صورة ${index + 1}`} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Property Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <h2 className="text-xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
                  <Home size={20} className="text-[#d4af37]" />
                  تفاصيل العقار
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Ruler className="mx-auto text-[#1e3a5f] mb-2" size={24} />
                    <div className="text-2xl font-bold text-[#1e3a5f]">{request.area}</div>
                    <div className="text-sm text-gray-500">متر مربع</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <DollarSign className="mx-auto text-[#d4af37] mb-2" size={24} />
                    <div className="text-2xl font-bold text-[#1e3a5f]">{request.price.toLocaleString('ar-EG')}</div>
                    <div className="text-sm text-gray-500">جنيه مصري</div>
                  </div>
                  
                  {request.bedrooms && (
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <BedDouble className="mx-auto text-[#1e3a5f] mb-2" size={24} />
                      <div className="text-2xl font-bold text-[#1e3a5f]">{request.bedrooms}</div>
                      <div className="text-sm text-gray-500">غرف نوم</div>
                    </div>
                  )}
                  
                  {request.bathrooms && (
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <Bath className="mx-auto text-[#1e3a5f] mb-2" size={24} />
                      <div className="text-2xl font-bold text-[#1e3a5f]">{request.bathrooms}</div>
                      <div className="text-sm text-gray-500">حمامات</div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-bold text-[#1e3a5f] mb-3">الوصف</h3>
                  <p className="text-gray-600 leading-relaxed">{request.description}</p>
                </div>

                {request.address && (
                  <div className="border-t border-gray-100 pt-6 mt-6">
                    <h3 className="font-bold text-[#1e3a5f] mb-3">العنوان</h3>
                    <p className="text-gray-600 flex items-center gap-2">
                      <MapPin size={16} className="text-[#d4af37]" />
                      {request.address}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Admin Notes (if any) */}
              {request.adminNotes && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-blue-50 border border-blue-200 rounded-2xl p-6"
                >
                  <h2 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <AlertCircle size={20} />
                    ملاحظات الإدارة
                  </h2>
                  <p className="text-blue-700">{request.adminNotes}</p>
                </motion.div>
              )}

              {/* Visit Info (if scheduled) */}
              {request.visitDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-purple-50 border border-purple-200 rounded-2xl p-6"
                >
                  <h2 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                    <Calendar size={20} />
                    موعد المعاينة
                  </h2>
                  <p className="text-purple-700 text-lg font-medium">
                    {new Date(request.visitDate).toLocaleDateString('ar-EG', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {request.visitNotes && (
                    <p className="text-purple-600 mt-2">{request.visitNotes}</p>
                  )}
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Service Type */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="font-bold text-[#1e3a5f] mb-4">نوع الخدمة</h3>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${serviceType.color} font-bold`}>
                  {serviceType.icon}
                  {serviceType.label}
                </div>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
                  <User size={18} className="text-[#d4af37]" />
                  بيانات التواصل
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">الاسم</div>
                      <div className="font-medium text-[#1e3a5f]">{request.ownerName}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Phone size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">الهاتف</div>
                      <div className="font-medium text-[#1e3a5f]" dir="ltr">{request.ownerPhone}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Mail size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">البريد الإلكتروني</div>
                      <div className="font-medium text-[#1e3a5f] text-sm">{request.ownerEmail}</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Timeline */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-[#d4af37]" />
                  التواريخ
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">تاريخ الإرسال</span>
                    <span className="font-medium text-[#1e3a5f]">
                      {new Date(request.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">آخر تحديث</span>
                    <span className="font-medium text-[#1e3a5f]">
                      {new Date(request.updatedAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              {request.status === 'PENDING' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <Link
                    href={`/list-your-property/edit/${request.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#152c4a] transition-all shadow-md"
                  >
                    <Edit size={18} />
                    تعديل الطلب
                  </Link>
                  
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center justify-center gap-2 bg-white border-2 border-red-500 text-red-500 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={18} />
                    حذف الطلب
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
