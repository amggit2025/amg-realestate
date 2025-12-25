'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { logger } from '@/lib/logger'
import {
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import { PermissionGuard } from '@/components/admin/PermissionGuard'

interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  inquiryType: 'PROPERTY' | 'PROJECT' | 'SERVICE' | 'GENERAL'
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  property?: {
    id: string
    title: string
  }
}

interface Stats {
  total: number
  pending: number
  inProgress: number
  resolved: number
  closed: number
  today: number
  thisWeek: number
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [stats, setStats] = useState<Stats>({ 
    total: 0, 
    pending: 0, 
    inProgress: 0, 
    resolved: 0, 
    closed: 0,
    today: 0,
    thisWeek: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [lastFetchedCount, setLastFetchedCount] = useState<number>(0)
  const [showNewInquiryToast, setShowNewInquiryToast] = useState(false)
  const itemsPerPage = 10

  useEffect(() => {
    fetchInquiries()
    // تحديث تلقائي كل 30 ثانية
    const interval = setInterval(() => {
      fetchInquiries(true) // silent fetch
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchInquiries = async (silent = false) => {
    if (!silent) setIsLoading(true)
    try {
      const response = await fetch('/api/admin/inquiries')
      const result = await response.json()
      
      if (result.success) {
        const newInquiries = result.data
        
        // التحقق من وجود استفسارات جديدة
        if (lastFetchedCount > 0 && result.stats.pending > lastFetchedCount) {
          const newCount = result.stats.pending - lastFetchedCount
          setShowNewInquiryToast(true)
          showMessage('success', `💬 تم استلام ${newCount} استفسار${newCount > 1 ? ' جديد' : ' جديد'}!`)
          // تشغيل صوت إشعار
          try {
            const audio = new Audio('/sounds/notification.mp3')
            audio.volume = 0.3
            audio.play().catch(() => {})
          } catch {}
          setTimeout(() => setShowNewInquiryToast(false), 5000)
        }
        
        setLastFetchedCount(result.stats.pending)
        setInquiries(newInquiries)
        setStats(result.stats)
      }
    } catch (error) {
      logger.error('Error fetching inquiries:', error)
      if (!silent) showMessage('error', 'حدث خطأ أثناء جلب البيانات')
    } finally {
      if (!silent) setIsLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      const result = await response.json()

      if (result.success) {
        showMessage('success', 'تم تحديث الحالة بنجاح')
        fetchInquiries()
      } else {
        showMessage('error', result.message || 'فشل التحديث')
      }
    } catch (error) {
      showMessage('error', 'حدث خطأ أثناء التحديث')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الاستفسار؟')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        showMessage('success', 'تم الحذف بنجاح')
        setSelectedInquiry(null)
        fetchInquiries()
      } else {
        showMessage('error', result.message || 'فشل الحذف')
      }
    } catch (error) {
      showMessage('error', 'حدث خطأ أثناء الحذف')
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: 'في الانتظار',
      IN_PROGRESS: 'قيد المعالجة',
      RESOLVED: 'تم الحل',
      CLOSED: 'مغلق',
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      RESOLVED: 'bg-green-100 text-green-800',
      CLOSED: 'bg-gray-100 text-gray-800',
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  const getTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
      PROPERTY: '🏠 عقار',
      PROJECT: '🏗️ مشروع',
      SERVICE: '⚙️ خدمة',
      GENERAL: '💬 عام',
    }
    return typeMap[type] || type
  }

  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      PROPERTY: 'bg-purple-100 text-purple-800',
      PROJECT: 'bg-orange-100 text-orange-800',
      SERVICE: 'bg-teal-100 text-teal-800',
      GENERAL: 'bg-gray-100 text-gray-800',
    }
    return colorMap[type] || 'bg-gray-100 text-gray-800'
  }

  // Filter logic
  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus
    const matchesType = filterType === 'all' || inquiry.inquiryType === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  // Pagination
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage)
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-6">
      {/* Floating New Inquiry Toast */}
      <AnimatePresence>
        {showNewInquiryToast && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -100, x: '-50%' }}
            className="fixed top-4 left-1/2 z-50 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <span className="text-2xl animate-bounce">💬</span>
            <span className="font-semibold">استفسار جديد وصل الآن!</span>
            <button 
              onClick={() => setShowNewInquiryToast(false)}
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الاستفسارات</h1>
          <p className="text-gray-600 mt-1">عرض وإدارة استفسارات العملاء</p>
          {/* Real-time indicator */}
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span>تحديث تلقائي كل 30 ثانية</span>
          </div>
        </div>
        
        {/* Refresh Button */}
        <button
          onClick={() => fetchInquiries()}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <motion.svg
            animate={isLoading ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: 'linear' }}
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </motion.svg>
          <span>{isLoading ? 'جاري التحديث...' : 'تحديث'}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <EnvelopeIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">في الانتظار</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
            </div>
            <ClockIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">قيد المعالجة</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.inProgress}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">تم الحل</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.resolved}</p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مغلق</p>
              <p className="text-3xl font-bold text-gray-600 mt-2">{stats.closed}</p>
            </div>
            <XCircleIcon className="w-8 h-8 text-gray-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">اليوم</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.today}</p>
            </div>
            <div className="text-2xl">📅</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">هذا الأسبوع</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.thisWeek}</p>
            </div>
            <div className="text-2xl">📊</div>
          </div>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث بالاسم أو البريد أو الموضوع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">جميع الحالات</option>
            <option value="PENDING">في الانتظار</option>
            <option value="IN_PROGRESS">قيد المعالجة</option>
            <option value="RESOLVED">تم الحل</option>
            <option value="CLOSED">مغلق</option>
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">جميع الأنواع</option>
            <option value="PROPERTY">عقار</option>
            <option value="PROJECT">مشروع</option>
            <option value="SERVICE">خدمة</option>
            <option value="GENERAL">عام</option>
          </select>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">جاري التحميل...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-12 text-center">
            <EnvelopeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">لا توجد استفسارات</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المرسل
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      النوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الموضوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                          <div className="text-sm text-gray-500">{inquiry.email}</div>
                          {inquiry.phone && (
                            <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <PhoneIcon className="w-3 h-3" />
                              {inquiry.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(inquiry.inquiryType)}`}>
                          {getTypeText(inquiry.inquiryType)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {inquiry.subject}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative inline-block">
                          <select
                            value={inquiry.status}
                            onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                            className={`appearance-none text-xs font-bold rounded-lg px-4 py-2 pr-8 cursor-pointer transition-all duration-200 border-2 ${
                              inquiry.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100' :
                              inquiry.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' :
                              inquiry.status === 'RESOLVED' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' :
                              'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <option value="PENDING">⏱️ في الانتظار</option>
                            <option value="IN_PROGRESS">🔄 قيد المعالجة</option>
                            <option value="RESOLVED">✅ تم الحل</option>
                            <option value="CLOSED">🔒 مغلق</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(inquiry.createdAt).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                        <button
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="text-blue-600 hover:text-blue-900"
                          title="عرض التفاصيل"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <PermissionGuard module="inquiries" permission="delete">
                          <button
                            onClick={() => handleDelete(inquiry.id)}
                            className="text-red-600 hover:text-red-900"
                            title="حذف"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </PermissionGuard>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    عرض <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> إلى{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredInquiries.length)}
                    </span>{' '}
                    من <span className="font-medium">{filteredInquiries.length}</span> نتيجة
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      السابق
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      التالي
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedInquiry(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">تفاصيل الاستفسار</h2>
                  <p className="text-sm text-gray-500 mt-1">ID: {selectedInquiry.id.slice(0, 8)}</p>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Type & Status */}
                <div className="flex gap-3">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getTypeColor(selectedInquiry.inquiryType)}`}>
                    {getTypeText(selectedInquiry.inquiryType)}
                  </span>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedInquiry.status)}`}>
                    {getStatusText(selectedInquiry.status)}
                  </span>
                </div>

                {/* Sender Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">معلومات المرسل</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">👤</span>
                      <span className="font-medium">{selectedInquiry.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <EnvelopeIcon className="w-4 h-4 text-gray-600" />
                      <a href={`mailto:${selectedInquiry.email}`} className="text-blue-600 hover:underline">
                        {selectedInquiry.email}
                      </a>
                    </div>
                    {selectedInquiry.phone && (
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4 text-gray-600" />
                        <a href={`tel:${selectedInquiry.phone}`} className="text-blue-600 hover:underline">
                          {selectedInquiry.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">الموضوع</h3>
                  <p className="text-gray-700">{selectedInquiry.subject}</p>
                </div>

                {/* Message */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">الرسالة</h3>
                  <div className="bg-blue-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {selectedInquiry.message}
                  </div>
                </div>

                {/* Property Info */}
                {selectedInquiry.property && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">العقار المرتبط</h3>
                    <p className="text-gray-700">{selectedInquiry.property.title}</p>
                  </div>
                )}

                {/* Dates */}
                <div className="flex gap-6 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">تاريخ الإرسال:</span>{' '}
                    {new Date(selectedInquiry.createdAt).toLocaleString('ar-EG')}
                  </div>
                  <div>
                    <span className="font-medium">آخر تحديث:</span>{' '}
                    {new Date(selectedInquiry.updatedAt).toLocaleString('ar-EG')}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <PermissionGuard module="inquiries" permission="edit">
                    <button
                      onClick={() => handleStatusChange(selectedInquiry.id, 'RESOLVED')}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                    >
                      وضع علامة "تم الحل"
                    </button>
                  </PermissionGuard>
                  <PermissionGuard module="inquiries" permission="delete">
                    <button
                      onClick={() => handleDelete(selectedInquiry.id)}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                    >
                      حذف
                    </button>
                  </PermissionGuard>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}