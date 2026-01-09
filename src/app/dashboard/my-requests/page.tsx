'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Building2, Clock, CheckCircle2, XCircle, Eye, Edit, Trash2,
  MapPin, DollarSign, Phone, Mail, Calendar, AlertCircle, Plus,
  ArrowRight, Filter, Search
} from 'lucide-react'

interface PropertyRequest {
  id: string
  propertyType: string
  purpose: string
  area: number
  price: number
  governorate: string
  city: string
  ownerName: string
  ownerPhone: string
  ownerEmail: string
  status: string
  serviceType: string
  images: string[] | string
  createdAt: string
  description: string
}

export default function MyPropertyRequestsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [requests, setRequests] = useState<PropertyRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('ALL')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/dashboard/my-requests')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchRequests()
    }
  }, [user])

  const fetchRequests = async () => {
    try {
      console.log('🔍 Fetching property requests...')
      const response = await fetch('/api/user/property-requests', {
        credentials: 'include', // Important: include cookies
        cache: 'no-store',
      })
      const data = await response.json()
      
      console.log('📦 API Response:', data)
      
      if (data.success) {
        setRequests(data.data || [])
        console.log('✅ Loaded requests:', data.data?.length || 0)
      } else {
        console.error('❌ API Error:', data.error)
      }
    } catch (error) {
      console.error('❌ Fetch Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return

    try {
      const response = await fetch(`/api/user/property-requests/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء الحذف')
      }

      // Refresh the list
      fetchRequests()
      alert('تم حذف الطلب بنجاح')
    } catch (error) {
      console.error('Error deleting request:', error)
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء حذف الطلب')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode; bg: string }> = {
      PENDING: { label: 'قيد الانتظار', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: <Clock size={14} /> },
      REVIEWING: { label: 'قيد المراجعة', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: <Eye size={14} /> },
      VISIT_SCHEDULED: { label: 'تم جدولة المعاينة', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200', icon: <Calendar size={14} /> },
      APPROVED: { label: 'تمت الموافقة', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: <CheckCircle2 size={14} /> },
      REJECTED: { label: 'مرفوض', color: 'text-red-600', bg: 'bg-red-50 border-red-200', icon: <XCircle size={14} /> },
      COMPLETED: { label: 'مكتمل', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200', icon: <CheckCircle2 size={14} /> },
    }

    const config = statusConfig[status] || statusConfig.PENDING
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.bg} ${config.color} shadow-sm`}>
        {config.icon}
        {config.label}
      </span>
    )
  }

  const filteredRequests = filterStatus === 'ALL' 
    ? requests 
    : requests.filter(r => r.status === filterStatus)

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1e3a5f] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">جاري تحميل طلباتك...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20" dir="rtl">
      {/* Hero Header */}
      <div className="bg-[#1e3a5f] text-white pt-36 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f]/20 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#1e3a5f]/90"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">طلبات العقارات</h1>
                <p className="text-blue-100 text-lg">تابع حالة طلباتك وتواصل مع فريقنا بسهولة</p>
              </div>
              
              <Link
                href="/list-your-property"
                className="group flex items-center gap-2 bg-[#d4af37] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#c5a028] transition-all shadow-lg hover:shadow-[#d4af37]/30 transform hover:-translate-y-1"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                إضافة عقار جديد
              </Link>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <div className="text-3xl font-bold mb-1">{requests.length}</div>
                <div className="text-sm text-blue-200">إجمالي الطلبات</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <div className="text-3xl font-bold mb-1 text-amber-400">
                  {requests.filter(r => r.status === 'PENDING').length}
                </div>
                <div className="text-sm text-blue-200">قيد الانتظار</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <div className="text-3xl font-bold mb-1 text-blue-400">
                  {requests.filter(r => r.status === 'REVIEWING').length}
                </div>
                <div className="text-sm text-blue-200">قيد المراجعة</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <div className="text-3xl font-bold mb-1 text-emerald-400">
                  {requests.filter(r => r.status === 'APPROVED').length}
                </div>
                <div className="text-sm text-blue-200">تمت الموافقة</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex items-center gap-2 text-gray-500 font-medium">
              <Filter size={18} />
              <span>تصفية حسب الحالة:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['ALL', 'PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    filterStatus === status
                      ? 'bg-[#1e3a5f] text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {status === 'ALL' ? 'الكل' : 
                   status === 'PENDING' ? 'قيد الانتظار' :
                   status === 'REVIEWING' ? 'قيد المراجعة' :
                   status === 'APPROVED' ? 'مقبول' : 'مرفوض'}
                </button>
              ))}
            </div>
          </div>

          {/* Requests List */}
          <AnimatePresence mode="wait">
            {filteredRequests.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center"
              >
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="text-blue-300" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {filterStatus === 'ALL' ? 'لا توجد طلبات بعد' : 'لا توجد طلبات بهذه الحالة'}
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {filterStatus === 'ALL' 
                    ? 'ابدأ رحلتك العقارية معنا واعرض عقارك الأول للبيع أو الإيجار بكل سهولة'
                    : 'جرب تغيير خيارات التصفية أو أضف عقاراً جديداً'}
                </p>
                {filterStatus === 'ALL' && (
                  <Link
                    href="/list-your-property"
                    className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#152c4a] transition-all shadow-lg hover:shadow-xl"
                  >
                    <Plus size={20} />
                    ابدأ الآن
                  </Link>
                )}
              </motion.div>
            ) : (
              <div className="grid gap-6">
                {filteredRequests.map((request, index) => {
                  // Parse images safely
                  const images = Array.isArray(request.images) 
                    ? request.images 
                    : (typeof request.images === 'string' ? JSON.parse(request.images || '[]') : [])
                  const firstImage = images[0]
                  
                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row">
                        
                        {/* Image Section */}
                        <div className="relative w-full md:w-72 aspect-video md:aspect-auto bg-gray-100 overflow-hidden">
                          {firstImage && typeof firstImage === 'string' && firstImage.startsWith('http') ? (
                            <Image
                              src={firstImage}
                              alt={request.propertyType}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                              <Building2 className="text-gray-300" size={40} />
                            </div>
                          )}
                          <div className="absolute top-3 right-3 md:hidden">
                            {getStatusBadge(request.status)}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-xl font-bold text-[#1e3a5f]">
                                    {request.propertyType} لل{request.purpose === 'sale' ? 'بيع' : 'إيجار'}
                                  </h3>
                                  <div className="hidden md:block">
                                    {getStatusBadge(request.status)}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                  <MapPin size={14} />
                                  {request.governorate}، {request.city}
                                </div>
                              </div>
                              <div className="text-left">
                                <div className="text-xl font-bold text-[#d4af37]">
                                  {request.price.toLocaleString('ar-EG')} <span className="text-sm font-normal text-gray-500">جنيه</span>
                                </div>
                                <div className="text-sm text-gray-400 mt-1">
                                  {request.area} متر مربع
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                              <div className="bg-gray-50 rounded-lg p-3 text-center">
                                <div className="text-xs text-gray-500 mb-1">نوع الخدمة</div>
                                <div className="font-bold text-[#1e3a5f] text-sm">
                                  {request.serviceType === 'marketing' ? 'تسويق فقط' : 
                                   request.serviceType === 'marketing_photo' ? 'تسويق + تصوير' : 'تقييم'}
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3 text-center">
                                <div className="text-xs text-gray-500 mb-1">تاريخ الطلب</div>
                                <div className="font-bold text-[#1e3a5f] text-sm">
                                  {new Date(request.createdAt).toLocaleDateString('ar-EG')}
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3 text-center">
                                <div className="text-xs text-gray-500 mb-1">عدد الصور</div>
                                <div className="font-bold text-[#1e3a5f] text-sm">
                                  {images.length} صور
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex gap-3">
                              {request.status === 'PENDING' && (
                                <>
                                  <Link
                                    href={`/list-your-property/edit/${request.id}`}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-gray-600 hover:text-[#1e3a5f] hover:bg-gray-50 rounded-lg transition-colors"
                                  >
                                    <Edit size={16} />
                                    تعديل
                                  </Link>
                                  <button
                                    onClick={() => handleDelete(request.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={16} />
                                    حذف
                                  </button>
                                </>
                              )}
                            </div>
                            
                            <Link
                              href={`/dashboard/my-requests/${request.id}`}
                              className="flex items-center gap-2 px-6 py-2.5 bg-[#1e3a5f] text-white rounded-lg font-bold hover:bg-[#152c4a] transition-all shadow-md hover:shadow-lg group/btn"
                            >
                              <span>التفاصيل</span>
                              <ArrowRight size={16} className="group-hover/btn:-translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
