'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { logger } from '@/lib/logger'
import {
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useToastContext } from '@/lib/ToastContext'

interface ServiceRequest {
  id: string
  name: string
  email: string
  phone: string
  serviceType: string
  projectType?: string
  budget?: string
  timeline?: string
  message?: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  adminNotes?: string
  respondedAt?: string
  createdAt: string
  updatedAt: string
}

export default function ServiceRequestsPage() {
  const toast = useToastContext()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [newStatus, setNewStatus] = useState<string>('')
  const [lastFetchedCount, setLastFetchedCount] = useState<number>(0)
  const [showNewRequestToast, setShowNewRequestToast] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  useEffect(() => {
    fetchRequests()
    // تحديث تلقائي كل 30 ثانية
    const interval = setInterval(() => {
      fetchRequests(true) // silent fetch
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchRequests = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      const response = await fetch('/api/admin/service-requests', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        const newRequests = data.requests || []
        const pendingCount = newRequests.filter((r: ServiceRequest) => r.status === 'PENDING').length
        
        // التحقق من وجود طلبات جديدة
        if (lastFetchedCount > 0 && pendingCount > lastFetchedCount) {
          const newCount = pendingCount - lastFetchedCount
          setShowNewRequestToast(true)
          showMessage('success', `📋 تم استلام ${newCount} طلب استشارة${newCount > 1 ? ' جديد' : ' جديد'}!`)
          // تشغيل صوت إشعار
          try {
            const audio = new Audio('/sounds/notification.mp3')
            audio.volume = 0.3
            audio.play().catch(() => {})
          } catch {}
          setTimeout(() => setShowNewRequestToast(false), 5000)
        }
        
        setLastFetchedCount(pendingCount)
        setRequests(newRequests)
      }
    } catch (error) {
      logger.error('Error fetching service requests:', error)
      if (!silent) showMessage('error', 'حدث خطأ أثناء جلب البيانات')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const handleUpdateStatus = async (requestId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/service-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          status,
          adminNotes: adminNotes || undefined,
          respondedAt: new Date().toISOString()
        })
      })

      if (response.ok) {
        fetchRequests()
        setShowModal(false)
        setSelectedRequest(null)
        setAdminNotes('')
      }
    } catch (error) {
      logger.error('Error updating request:', error)
    }
  }

  const handleDeleteClick = (requestId: string) => {
    setRequestToDelete(requestId)
    setDeleteConfirmOpen(true)
  }

  const handleDelete = async () => {
    if (!requestToDelete) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/service-requests/${requestToDelete}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        toast.success('تم حذف الطلب بنجاح')
        fetchRequests()
        setDeleteConfirmOpen(false)
        setRequestToDelete(null)
      } else {
        toast.error('فشل حذف الطلب')
      }
    } catch (error) {
      logger.error('Error deleting request:', error)
      toast.error('حدث خطأ أثناء حذف الطلب')
    } finally {
      setDeleting(false)
    }
  }

  const openModal = (request: ServiceRequest) => {
    setSelectedRequest(request)
    setAdminNotes(request.adminNotes || '')
    setNewStatus(request.status)
    setShowModal(true)
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: ClockIcon, label: 'قيد الانتظار' },
      IN_PROGRESS: { bg: 'bg-blue-100', text: 'text-blue-800', icon: ClockIcon, label: 'قيد المعالجة' },
      COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon, label: 'مكتمل' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircleIcon, label: 'ملغي' }
    }
    const badge = badges[status as keyof typeof badges] || badges.PENDING
    const Icon = badge.icon

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        <Icon className="w-4 h-4" />
        {badge.label}
      </span>
    )
  }

  const filteredRequests = requests
    .filter(req => filter === 'all' || req.status === filter)
    .filter(req => 
      searchQuery === '' ||
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.phone.includes(searchQuery) ||
      req.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'PENDING').length,
    inProgress: requests.filter(r => r.status === 'IN_PROGRESS').length,
    completed: requests.filter(r => r.status === 'COMPLETED').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Floating New Request Toast */}
      <AnimatePresence>
        {showNewRequestToast && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -100, x: '-50%' }}
            className="fixed top-4 left-1/2 z-50 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <span className="text-2xl animate-bounce">📋</span>
            <span className="font-semibold">طلب استشارة جديد!</span>
            <button 
              onClick={() => setShowNewRequestToast(false)}
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
          <h1 className="text-3xl font-bold text-gray-900">طلبات الاستشارات المجانية</h1>
          <p className="text-gray-600 mt-2">إدارة ومتابعة طلبات الاستشارات من صفحة الخدمات</p>
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
          onClick={() => fetchRequests()}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <motion.svg
            animate={loading ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: 'linear' }}
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </motion.svg>
          <span>{loading ? 'جاري التحديث...' : 'تحديث'}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{stats.total}</div>
          <div className="text-blue-100 mt-1">إجمالي الطلبات</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{stats.pending}</div>
          <div className="text-yellow-100 mt-1">قيد الانتظار</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{stats.inProgress}</div>
          <div className="text-purple-100 mt-1">قيد المعالجة</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{stats.completed}</div>
          <div className="text-green-100 mt-1">مكتملة</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="بحث بالاسم، البريد، التليفون، أو نوع الخدمة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">الكل</option>
              <option value="PENDING">قيد الانتظار</option>
              <option value="IN_PROGRESS">قيد المعالجة</option>
              <option value="COMPLETED">مكتملة</option>
              <option value="CANCELLED">ملغية</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الخدمة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نوع المشروع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    لا توجد طلبات
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        {format(new Date(request.createdAt), 'dd MMM yyyy', { locale: ar })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(request.createdAt), 'HH:mm', { locale: ar })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{request.name}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <a
                          href={`mailto:${request.email}`}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                        >
                          <EnvelopeIcon className="w-3 h-3" />
                          {request.email}
                        </a>
                        <a
                          href={`tel:${request.phone}`}
                          className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800"
                        >
                          <PhoneIcon className="w-3 h-3" />
                          {request.phone}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{request.serviceType}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {request.projectType || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(request)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          عرض
                        </button>
                        <button
                          onClick={() => handleDeleteClick(request.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">تفاصيل الطلب</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">معلومات العميل</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">الاسم:</span> {selectedRequest.name}</div>
                  <div><span className="font-medium">البريد:</span> {selectedRequest.email}</div>
                  <div><span className="font-medium">التليفون:</span> {selectedRequest.phone}</div>
                </div>
              </div>

              {/* Request Info */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">تفاصيل الطلب</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">الخدمة:</span> {selectedRequest.serviceType}</div>
                  {selectedRequest.projectType && (
                    <div><span className="font-medium">نوع المشروع:</span> {selectedRequest.projectType}</div>
                  )}
                  {selectedRequest.budget && (
                    <div><span className="font-medium">الميزانية:</span> {selectedRequest.budget}</div>
                  )}
                  {selectedRequest.timeline && (
                    <div><span className="font-medium">الجدول الزمني:</span> {selectedRequest.timeline}</div>
                  )}
                  {selectedRequest.message && (
                    <div>
                      <span className="font-medium">الرسالة:</span>
                      <p className="mt-1 text-gray-700">{selectedRequest.message}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Update */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تحديث الحالة
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PENDING">قيد الانتظار</option>
                  <option value="IN_PROGRESS">قيد المعالجة</option>
                  <option value="COMPLETED">مكتمل</option>
                  <option value="CANCELLED">ملغي</option>
                </select>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات الإدارة
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="أضف ملاحظات داخلية..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedRequest.id, newStatus)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                حفظ التغييرات
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="حذف طلب استشارة"
        message="هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        cancelText="إلغاء"
        type="danger"
        isLoading={deleting}
      />
    </div>
  )
}
