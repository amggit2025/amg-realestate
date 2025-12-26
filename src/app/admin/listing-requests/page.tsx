'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { 
  HomeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ArrowPathIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline'

// ترجمة الحالات
const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'قيد الانتظار', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  REVIEWING: { label: 'قيد المراجعة', color: 'text-blue-700', bg: 'bg-blue-100' },
  VISIT_SCHEDULED: { label: 'تم جدولة معاينة', color: 'text-purple-700', bg: 'bg-purple-100' },
  APPROVED: { label: 'تمت الموافقة', color: 'text-green-700', bg: 'bg-green-100' },
  REJECTED: { label: 'مرفوض', color: 'text-red-700', bg: 'bg-red-100' },
  COMPLETED: { label: 'مكتمل', color: 'text-gray-700', bg: 'bg-gray-100' },
}

// ترجمة أنواع العقارات
const propertyTypeLabels: Record<string, string> = {
  APARTMENT: 'شقة',
  VILLA: 'فيلا',
  TOWNHOUSE: 'تاون هاوس',
  DUPLEX: 'دوبلكس',
  PENTHOUSE: 'بنتهاوس',
  LAND: 'أرض',
  OFFICE: 'مكتب',
  COMMERCIAL: 'محل تجاري',
  WAREHOUSE: 'مخزن',
  BUILDING: 'مبنى كامل',
}

// ترجمة الغرض
const purposeLabels: Record<string, string> = {
  SALE: 'للبيع',
  RENT: 'للإيجار',
}

// ترجمة نوع الخدمة
const serviceTypeLabels: Record<string, string> = {
  MARKETING_ONLY: 'تسويق فقط',
  MARKETING_AND_VISIT: 'تسويق ومعاينة',
  VALUATION: 'تقييم العقار',
}

interface ListingRequest {
  id: string
  propertyType: string
  purpose: string
  area: number
  price: number
  currency: string
  governorate: string
  city: string
  district: string
  address?: string
  bedrooms?: number
  bathrooms?: number
  floor?: number
  yearBuilt?: number
  features?: string[]
  description: string
  images: string[]
  ownerName: string
  ownerPhone: string
  ownerEmail: string
  preferredTime?: string
  serviceType: string
  status: string
  adminNotes?: string
  assignedTo?: string
  visitDate?: string
  visitNotes?: string
  createdAt: string
  updatedAt: string
}

interface Stats {
  total: number
  byStatus: {
    pending: number
    reviewing: number
    visitScheduled: number
    approved: number
    rejected: number
    completed: number
  }
}

export default function ListingRequestsPage() {
  const [requests, setRequests] = useState<ListingRequest[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<ListingRequest | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Real-time notifications
  const [showNewRequestToast, setShowNewRequestToast] = useState(false)
  const [newRequestCount, setNewRequestCount] = useState(0)
  const lastFetchedCount = useRef<number>(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('')
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Get token from localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken') || ''
    }
    return ''
  }

  // Show message
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  // Fetch requests
  const fetchRequests = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      if (propertyTypeFilter) params.append('propertyType', propertyTypeFilter)
      params.append('page', page.toString())
      params.append('limit', '10')

      const res = await fetch(`/api/listing-requests?${params}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })

      if (res.ok) {
        const data = await res.json()
        const newRequests = data.requests
        const totalCount = data.pagination.total
        
        // التحقق من وجود طلبات جديدة
        if (lastFetchedCount.current > 0 && totalCount > lastFetchedCount.current) {
          const newCount = totalCount - lastFetchedCount.current
          setNewRequestCount(newCount)
          setShowNewRequestToast(true)
          showMessage('success', `🏠 تم استلام ${newCount} طلب${newCount > 1 ? ' جديد' : ' جديد'} لعرض عقار!`)
          
          // تشغيل صوت إشعار
          try {
            const audio = new Audio('/sounds/notification.mp3')
            audio.volume = 0.3
            audio.play().catch(() => {})
          } catch {}
          
          // إخفاء Toast بعد 5 ثواني
          setTimeout(() => setShowNewRequestToast(false), 5000)
        }
        
        lastFetchedCount.current = totalCount
        setRequests(newRequests)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
      if (!silent) showMessage('error', 'حدث خطأ أثناء جلب الطلبات')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [statusFilter, propertyTypeFilter, page])

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/listing-requests/stats', {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })

      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }, [])

  useEffect(() => {
    fetchRequests()
    fetchStats()
    
    // تحديث تلقائي كل 30 ثانية
    const interval = setInterval(() => {
      fetchRequests(true) // silent fetch
      fetchStats()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [fetchRequests, fetchStats])

  // Update status
  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/listing-requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status })
      })

      if (res.ok) {
        fetchRequests()
        fetchStats()
        if (selectedRequest?.id === id) {
          setSelectedRequest({ ...selectedRequest, status })
        }
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  // Delete request
  const deleteRequest = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return

    try {
      const res = await fetch(`/api/listing-requests/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })

      if (res.ok) {
        fetchRequests()
        fetchStats()
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error('Error deleting request:', error)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Format price
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ar-EG').format(price) + ' ' + (currency === 'EGP' ? 'ج.م' : '$')
  }

  // Filter requests by search
  const filteredRequests = requests.filter(req => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      req.ownerName.toLowerCase().includes(query) ||
      req.ownerPhone.includes(query) ||
      req.ownerEmail.toLowerCase().includes(query) ||
      req.city.toLowerCase().includes(query) ||
      req.district.toLowerCase().includes(query)
    )
  })

  return (
    <div className="p-6">
      {/* Floating New Request Toast */}
      <AnimatePresence>
        {showNewRequestToast && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -100, x: '-50%' }}
            className="fixed top-4 left-1/2 z-50 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <span className="text-2xl animate-bounce">🏠</span>
            <span className="font-semibold">
              {newRequestCount > 1 
                ? `${newRequestCount} طلبات جديدة لعرض عقارات!` 
                : 'طلب جديد لعرض عقار وصل الآن!'}
            </span>
            <button 
              onClick={() => setShowNewRequestToast(false)}
              className="ml-2 text-white/80 hover:text-white"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
              message.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircleIcon className="w-5 h-5" />
            ) : (
              <XCircleIcon className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🏠 طلبات عرض العقارات</h1>
          <p className="text-gray-600">إدارة طلبات أصحاب العقارات للتسويق</p>
        </div>
        
        {/* Refresh Button */}
        <button
          onClick={() => fetchRequests()}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <motion.div
            animate={loading ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: 'linear' }}
          >
            <ArrowPathIcon className="w-5 h-5 text-gray-600" />
          </motion.div>
          <span>{loading ? 'جاري التحديث...' : 'تحديث'}</span>
        </button>
      </div>

      {/* Real-time indicator */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span>تحديث تلقائي كل 30 ثانية</span>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">إجمالي الطلبات</div>
          </div>
          <div className="bg-yellow-50 rounded-xl shadow-sm p-4 border border-yellow-100">
            <div className="text-3xl font-bold text-yellow-600">{stats.byStatus.pending}</div>
            <div className="text-sm text-yellow-700">قيد الانتظار</div>
          </div>
          <div className="bg-blue-50 rounded-xl shadow-sm p-4 border border-blue-100">
            <div className="text-3xl font-bold text-blue-600">{stats.byStatus.reviewing}</div>
            <div className="text-sm text-blue-700">قيد المراجعة</div>
          </div>
          <div className="bg-purple-50 rounded-xl shadow-sm p-4 border border-purple-100">
            <div className="text-3xl font-bold text-purple-600">{stats.byStatus.visitScheduled}</div>
            <div className="text-sm text-purple-700">معاينة مجدولة</div>
          </div>
          <div className="bg-green-50 rounded-xl shadow-sm p-4 border border-green-100">
            <div className="text-3xl font-bold text-green-600">{stats.byStatus.approved}</div>
            <div className="text-sm text-green-700">تمت الموافقة</div>
          </div>
          <div className="bg-gray-50 rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="text-3xl font-bold text-gray-600">{stats.byStatus.completed}</div>
            <div className="text-sm text-gray-700">مكتمل</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="بحث بالاسم، الهاتف، البريد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">كل الحالات</option>
            {Object.entries(statusLabels).map(([value, { label }]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {/* Property Type Filter */}
          <select
            value={propertyTypeFilter}
            onChange={(e) => { setPropertyTypeFilter(e.target.value); setPage(1) }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">كل الأنواع</option>
            {Object.entries(propertyTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">جاري التحميل...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-8 text-center">
            <HomeIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد طلبات</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">العقار</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">المالك</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">الموقع</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">السعر</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">الخدمة</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">الحالة</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">التاريخ</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {request.images && Array.isArray(request.images) && request.images.length > 0 && typeof request.images[0] === 'string' && request.images[0].startsWith('http') && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={request.images[0]}
                              alt=""
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">
                            {propertyTypeLabels[request.propertyType]}
                          </div>
                          <div className="text-sm text-gray-500">
                            {purposeLabels[request.purpose]} • {request.area} م²
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">{request.ownerName}</div>
                      <div className="text-sm text-gray-500">{request.ownerPhone}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-gray-900">{request.city}</div>
                      <div className="text-sm text-gray-500">{request.district}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-900">
                        {formatPrice(request.price, request.currency)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-700">
                        {serviceTypeLabels[request.serviceType]}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusLabels[request.status]?.bg} ${statusLabels[request.status]?.color}`}>
                        {statusLabels[request.status]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setSelectedRequest(request); setIsModalOpen(true) }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="عرض التفاصيل"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteRequest(request.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              صفحة {page} من {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">تفاصيل الطلب</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Images */}
                {selectedRequest.images && Array.isArray(selectedRequest.images) && selectedRequest.images.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">صور العقار</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {selectedRequest.images.filter((img): img is string => typeof img === 'string' && img.startsWith('http')).map((img, i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden">
                          <Image
                            src={img}
                            alt={`صورة ${i + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Property Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-3">بيانات العقار</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">النوع:</span>
                        <span className="font-medium">{propertyTypeLabels[selectedRequest.propertyType]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">الغرض:</span>
                        <span className="font-medium">{purposeLabels[selectedRequest.purpose]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">المساحة:</span>
                        <span className="font-medium">{selectedRequest.area} م²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">السعر:</span>
                        <span className="font-medium">{formatPrice(selectedRequest.price, selectedRequest.currency)}</span>
                      </div>
                      {selectedRequest.bedrooms && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">غرف النوم:</span>
                          <span className="font-medium">{selectedRequest.bedrooms}</span>
                        </div>
                      )}
                      {selectedRequest.bathrooms && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">الحمامات:</span>
                          <span className="font-medium">{selectedRequest.bathrooms}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-3">بيانات المالك</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-medium">{selectedRequest.ownerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        <a href={`tel:${selectedRequest.ownerPhone}`} className="text-blue-600 hover:underline">
                          {selectedRequest.ownerPhone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                        <a href={`mailto:${selectedRequest.ownerEmail}`} className="text-blue-600 hover:underline">
                          {selectedRequest.ownerEmail}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPinIcon className="w-4 h-4 text-gray-400" />
                        <span>{selectedRequest.governorate}، {selectedRequest.city}، {selectedRequest.district}</span>
                      </div>
                      {selectedRequest.preferredTime && (
                        <div className="flex items-center gap-2 text-sm">
                          <ClockIcon className="w-4 h-4 text-gray-400" />
                          <span>يفضل التواصل: {selectedRequest.preferredTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">الوصف</h3>
                  <p className="text-gray-600 whitespace-pre-line">{selectedRequest.description}</p>
                </div>

                {/* Features */}
                {selectedRequest.features && selectedRequest.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">المميزات</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.features.map((feature, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Actions */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-semibold mb-3">تغيير الحالة</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(statusLabels).map(([value, { label, bg, color }]) => (
                      <button
                        key={value}
                        onClick={() => updateStatus(selectedRequest.id, value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedRequest.status === value
                            ? `${bg} ${color} ring-2 ring-offset-2`
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}
