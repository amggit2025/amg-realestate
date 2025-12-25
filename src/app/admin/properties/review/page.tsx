'use client'

import { useState, useEffect } from 'react'
import { logger } from '@/lib/logger'
import { 
  BuildingOfficeIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
  ClockIcon,
  ArrowPathIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { PermissionGuard } from '@/components/admin/PermissionGuard'

interface PropertyUser {
  id: string
  name: string
  email: string
  phone: string | null
  userType: string
}

interface PropertyStats {
  favorites: number
  inquiries: number
}

interface Property {
  id: string
  title: string
  description: string
  price: string
  currency: string
  area: number
  bedrooms: number | null
  bathrooms: number | null
  city: string
  district: string
  propertyType: string
  purpose: string
  status: string
  reviewStatus: string
  rejectionReason: string | null
  reviewedBy: string | null
  reviewedAt: string | null
  views: number
  createdAt: string
  updatedAt: string
  user: PropertyUser
  mainImage: string | null
  imagesCount: number
  stats: PropertyStats
}

interface ReviewStats {
  pending: number
  approved: number
  rejected: number
  needsEdit: number
}

interface PropertiesResponse {
  success: boolean
  message: string
  data: {
    properties: Property[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    stats: ReviewStats
  }
}

export default function AdminPropertiesReviewPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState<string>('PENDING')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showPropertyModal, setShowPropertyModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'needs_edit' | 'revert_to_pending'>('approve')
  const [rejectionReason, setRejectionReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastFetchedCount, setLastFetchedCount] = useState<number>(0)
  const [showNewPropertyToast, setShowNewPropertyToast] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  // جلب العقارات
  const fetchProperties = async (page = 1, status = filterStatus, silent = false) => {
    try {
      if (!silent) setLoading(true)
      
      // الحصول على session token
      const session = localStorage.getItem('amg_admin_session')
      if (!session) {
        setError('لا يوجد session للمصادقة')
        return
      }
      
      const sessionData = JSON.parse(session)
      
      const response = await fetch(`/api/admin/properties/review?reviewStatus=${status}&page=${page}&limit=20`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${sessionData.token || 'admin-session'}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data: PropertiesResponse = await response.json()
        const newProperties = data.data.properties
        
        // التحقق من وجود عقارات جديدة للمراجعة
        if (status === 'PENDING' && lastFetchedCount > 0 && data.data.stats.pending > lastFetchedCount) {
          const newCount = data.data.stats.pending - lastFetchedCount
          setShowNewPropertyToast(true)
          showMessage('success', `🏠 تم استلام ${newCount} عقار${newCount > 1 ? ' جديد' : ' جديد'} للمراجعة!`)
          // تشغيل صوت إشعار
          try {
            const audio = new Audio('/sounds/notification.mp3')
            audio.volume = 0.3
            audio.play().catch(() => {})
          } catch {}
          setTimeout(() => setShowNewPropertyToast(false), 5000)
        }
        
        if (status === 'PENDING') {
          setLastFetchedCount(data.data.stats.pending)
        }
        
        setProperties(newProperties)
        setStats(data.data.stats)
        setCurrentPage(page)
        setError('')
      } else {
        if (!silent) setError('حدث خطأ أثناء جلب العقارات')
      }
    } catch (error) {
      logger.error('Error fetching properties:', error)
      if (!silent) setError('حدث خطأ في الاتصال')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  // تحديث حالة المراجعة
  const updateReviewStatus = async (action?: string) => {
    if (!selectedProperty) return

    try {
      setIsSubmitting(true)
      
      // الحصول على session token
      const session = localStorage.getItem('amg_admin_session')
      if (!session) {
        setError('لا يوجد session للمصادقة')
        return
      }
      
      const sessionData = JSON.parse(session)
      
      const response = await fetch('/api/admin/properties/review', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.token || 'admin-session'}`
        },
        credentials: 'include',
        body: JSON.stringify({
          propertyId: selectedProperty.id,
          action: action || reviewAction,
          rejectionReason: rejectionReason || undefined
        })
      })

      if (response.ok) {
        fetchProperties(currentPage, filterStatus) // إعادة جلب البيانات
        setShowReviewModal(false)
        setShowPropertyModal(false)
        setRejectionReason('')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'حدث خطأ أثناء التحديث')
      }
    } catch (error) {
      logger.error('Error updating review:', error)
      setError('حدث خطأ في الاتصال')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetchProperties(1, filterStatus)
    // تحديث تلقائي كل 30 ثانية
    const interval = setInterval(() => {
      fetchProperties(currentPage, filterStatus, true) // silent fetch
    }, 30000)
    return () => clearInterval(interval)
  }, [filterStatus])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-100'
      case 'APPROVED': return 'text-green-600 bg-green-100'
      case 'REJECTED': return 'text-red-600 bg-red-100'
      case 'NEEDS_EDIT': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'في انتظار المراجعة'
      case 'APPROVED': return 'تمت الموافقة'
      case 'REJECTED': return 'مرفوض'
      case 'NEEDS_EDIT': return 'يحتاج تعديل'
      default: return status
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading && properties.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل العقارات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Floating New Property Toast */}
        <AnimatePresence>
          {showNewPropertyToast && (
            <motion.div
              initial={{ opacity: 0, y: -100, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -100, x: '-50%' }}
              className="fixed top-4 left-1/2 z-50 bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3"
            >
              <span className="text-2xl animate-bounce">🏠</span>
              <span className="font-semibold">عقار جديد للمراجعة!</span>
              <button 
                onClick={() => setShowNewPropertyToast(false)}
                className="ml-2 text-white/80 hover:text-white"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Toast */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-40 px-6 py-3 rounded-lg shadow-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BuildingOfficeIcon className="h-8 w-8 ml-3 text-blue-600" />
                مراجعة العقارات
              </h1>
              <p className="text-gray-600 mt-2">مراجعة والموافقة على إعلانات العقارات</p>
            </div>
            <button
              onClick={() => fetchProperties(currentPage, filterStatus)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              disabled={loading}
            >
              <ArrowPathIcon className={`h-5 w-5 ml-2 ${loading ? 'animate-spin' : ''}`} />
              تحديث
            </button>
          </div>
          
          {/* Real-time indicator */}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span>تحديث تلقائي كل 30 ثانية</span>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-lg p-6 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                filterStatus === 'PENDING' ? 'ring-2 ring-yellow-500' : ''
              }`}
              onClick={() => setFilterStatus('PENDING')}
            >
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  <p className="text-gray-600">في انتظار المراجعة</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`bg-white rounded-lg p-6 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                filterStatus === 'APPROVED' ? 'ring-2 ring-green-500' : ''
              }`}
              onClick={() => setFilterStatus('APPROVED')}
            >
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                  <p className="text-gray-600">تمت الموافقة</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`bg-white rounded-lg p-6 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                filterStatus === 'REJECTED' ? 'ring-2 ring-red-500' : ''
              }`}
              onClick={() => setFilterStatus('REJECTED')}
            >
              <div className="flex items-center">
                <XCircleIcon className="h-8 w-8 text-red-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                  <p className="text-gray-600">مرفوض</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`bg-white rounded-lg p-6 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                filterStatus === 'NEEDS_EDIT' ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setFilterStatus('NEEDS_EDIT')}
            >
              <div className="flex items-center">
                <PencilSquareIcon className="h-8 w-8 text-blue-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.needsEdit}</p>
                  <p className="text-gray-600">يحتاج تعديل</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'PENDING', label: 'في انتظار المراجعة', icon: ClockIcon, color: 'yellow' },
              { key: 'APPROVED', label: 'تمت الموافقة', icon: CheckCircleIcon, color: 'green' },
              { key: 'REJECTED', label: 'مرفوض', icon: XCircleIcon, color: 'red' },
              { key: 'NEEDS_EDIT', label: 'يحتاج تعديل', icon: PencilSquareIcon, color: 'blue' },
              { key: 'ALL', label: 'جميع العقارات', icon: BuildingOfficeIcon, color: 'gray' }
            ].map(({ key, label, icon: Icon, color }) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === key
                    ? `bg-${color}-100 text-${color}-700 border-${color}-300`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } border`}
              >
                <Icon className="h-4 w-4 ml-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 ml-2" />
            {error}
          </div>
        )}

        {/* Properties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Property Image */}
              <div className="relative h-48">
                {property.mainImage ? (
                  <img
                    src={property.mainImage}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <BuildingOfficeIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.reviewStatus)}`}>
                    {getStatusLabel(property.reviewStatus)}
                  </span>
                </div>

                {/* Images Count */}
                {property.imagesCount > 1 && (
                  <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    {property.imagesCount} صور
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {property.description}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">السعر:</span>
                    <span className="font-semibold text-blue-600">
                      {property.price} {property.currency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">المساحة:</span>
                    <span className="text-sm">{property.area} م²</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">النوع:</span>
                    <span className="text-sm">{getPropertyTypeLabel(property.propertyType)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">الموقع:</span>
                    <span className="text-sm">{property.city}</span>
                  </div>
                </div>

                {/* User Info */}
                <div className="border-t pt-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">المعلن:</span>
                    <span className="text-sm font-medium">{property.user.name}</span>
                  </div>
                  <div className="text-xs text-gray-400 text-left">
                    {formatDate(property.createdAt)}
                  </div>
                </div>

                {/* Rejection Reason */}
                {property.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mt-0.5 ml-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-800">سبب الرفض/التعديل:</p>
                        <p className="text-xs text-red-600">{property.rejectionReason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedProperty(property)
                      setShowPropertyModal(true)
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center"
                  >
                    <EyeIcon className="h-4 w-4 ml-1" />
                    عرض التفاصيل
                  </button>
                  
                  {property.reviewStatus === 'PENDING' && (
                    <button
                      onClick={() => {
                        setSelectedProperty(property)
                        setReviewAction('approve')
                        setShowReviewModal(true)
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center"
                    >
                      <CheckCircleIcon className="h-4 w-4 ml-1" />
                      مراجعة
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {properties.length === 0 && !loading && (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا توجد عقارات بالحالة المحددة</p>
          </div>
        )}

        {/* Property Details Modal */}
        <AnimatePresence>
          {showPropertyModal && selectedProperty && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">تفاصيل العقار</h2>
                    <button
                      onClick={() => setShowPropertyModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircleIcon className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Property Content */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">{selectedProperty.title}</h3>
                        <p className="text-gray-600 mb-4">{selectedProperty.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">السعر</label>
                            <p className="text-blue-600 font-semibold">{selectedProperty.price} {selectedProperty.currency}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">المساحة</label>
                            <p>{selectedProperty.area} م²</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الغرف</label>
                            <p>{selectedProperty.bedrooms || 'غير محدد'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">دورات المياه</label>
                            <p>{selectedProperty.bathrooms || 'غير محدد'}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold mb-4">معلومات المعلن</h4>
                        <div className="space-y-2">
                          <p><strong>الاسم:</strong> {selectedProperty.user.name}</p>
                          <p><strong>البريد الإلكتروني:</strong> {selectedProperty.user.email}</p>
                          {selectedProperty.user.phone && (
                            <p><strong>الهاتف:</strong> {selectedProperty.user.phone}</p>
                          )}
                          <p><strong>نوع المستخدم:</strong> {selectedProperty.user.userType}</p>
                        </div>

                        <div className="mt-6">
                          <h4 className="text-lg font-semibold mb-2">حالة المراجعة</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProperty.reviewStatus)}`}>
                            {getStatusLabel(selectedProperty.reviewStatus)}
                          </span>

                          {selectedProperty.rejectionReason && (
                            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                              <p className="text-sm font-medium text-red-800">سبب الرفض/التعديل:</p>
                              <p className="text-sm text-red-600">{selectedProperty.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-6 border-t">
                      {selectedProperty.reviewStatus === 'PENDING' && (
                        <>
                          <PermissionGuard module="properties" permission="approve">
                            <button
                              onClick={() => {
                                setReviewAction('approve')
                                setShowReviewModal(true)
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                            >
                              <CheckCircleIcon className="h-5 w-5 ml-2" />
                              موافقة
                            </button>
                          </PermissionGuard>
                          <PermissionGuard module="properties" permission="edit">
                            <button
                              onClick={() => {
                                setReviewAction('needs_edit')
                                setShowReviewModal(true)
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                            >
                              <PencilSquareIcon className="h-5 w-5 ml-2" />
                              يحتاج تعديل
                            </button>
                          </PermissionGuard>
                          <PermissionGuard module="properties" permission="approve">
                            <button
                              onClick={() => {
                                setReviewAction('reject')
                                setShowReviewModal(true)
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                            >
                              <XCircleIcon className="h-5 w-5 ml-2" />
                              رفض
                            </button>
                          </PermissionGuard>
                        </>
                      )}
                      
                      {selectedProperty.reviewStatus !== 'PENDING' && (
                        <button
                          onClick={() => updateReviewStatus('revert_to_pending')}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                        >
                          <ArrowPathIcon className="h-5 w-5 ml-2" />
                          إعادة للمراجعة
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Review Action Modal */}
        <AnimatePresence>
          {showReviewModal && selectedProperty && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-lg max-w-md w-full"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">
                      {reviewAction === 'approve' && 'الموافقة على العقار'}
                      {reviewAction === 'reject' && 'رفض العقار'}
                      {reviewAction === 'needs_edit' && 'طلب تعديل العقار'}
                    </h3>
                    <button
                      onClick={() => setShowReviewModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircleIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-600">
                      هل أنت متأكد من {reviewAction === 'approve' ? 'الموافقة على' : reviewAction === 'reject' ? 'رفض' : 'طلب تعديل'} العقار "{selectedProperty.title}"؟
                    </p>

                    {(reviewAction === 'reject' || reviewAction === 'needs_edit') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {reviewAction === 'reject' ? 'سبب الرفض' : 'تفاصيل التعديل المطلوب'} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={4}
                          placeholder={reviewAction === 'reject' ? 'اكتب سبب رفض العقار...' : 'اكتب التعديلات المطلوبة...'}
                        />
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => updateReviewStatus()}
                        disabled={isSubmitting || ((reviewAction === 'reject' || reviewAction === 'needs_edit') && !rejectionReason.trim())}
                        className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors flex items-center justify-center ${
                          reviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                          reviewAction === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                          'bg-blue-600 hover:bg-blue-700'
                        } disabled:opacity-50`}
                      >
                        {isSubmitting ? (
                          <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            {reviewAction === 'approve' && <CheckCircleIcon className="h-5 w-5 ml-2" />}
                            {reviewAction === 'reject' && <XCircleIcon className="h-5 w-5 ml-2" />}
                            {reviewAction === 'needs_edit' && <PencilSquareIcon className="h-5 w-5 ml-2" />}
                            تأكيد
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setShowReviewModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        disabled={isSubmitting}
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}