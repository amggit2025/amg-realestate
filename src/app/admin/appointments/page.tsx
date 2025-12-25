'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  HomeIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import { PermissionGuard } from '@/components/admin/PermissionGuard'

interface Appointment {
  id: string
  contactName: string
  contactEmail: string
  contactPhone: string
  appointmentDate: string
  timeSlot: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'
  notes?: string
  adminNotes?: string
  confirmedAt?: string
  confirmedBy?: string
  cancelledAt?: string
  cancellationReason?: string
  createdAt: string
  updatedAt: string
  user?: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  property?: {
    title: string
    address: string
    city: string
    propertyType: string
  }
  listing?: {
    title: string
    address: string
    city: string
    propertyType: string
  }
}

interface Stats {
  total: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
  today: number
  upcoming: number
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    today: 0,
    upcoming: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [cancellationReason, setCancellationReason] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [lastFetchedCount, setLastFetchedCount] = useState<number>(0)
  const [showNewAppointmentToast, setShowNewAppointmentToast] = useState(false)
  const itemsPerPage = 10

  useEffect(() => {
    fetchAppointments()
    // تحديث تلقائي كل 30 ثانية
    const interval = setInterval(() => {
      fetchAppointments(true) // silent fetch (without loading indicator)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchAppointments = async (silent = false) => {
    if (!silent) setIsLoading(true)
    try {
      const response = await fetch('/api/appointments')
      const result = await response.json()

      if (result.success) {
        const newAppointments = result.appointments
        
        // التحقق من وجود مواعيد جديدة
        if (lastFetchedCount > 0 && newAppointments.length > lastFetchedCount) {
          const newCount = newAppointments.length - lastFetchedCount
          setShowNewAppointmentToast(true)
          showMessage('success', `📅 تم استلام ${newCount} موعد${newCount > 1 ? ' جديد' : ' جديد'}!`)
          // تشغيل صوت إشعار (اختياري)
          try {
            const audio = new Audio('/sounds/notification.mp3')
            audio.volume = 0.3
            audio.play().catch(() => {}) // تجاهل الخطأ إذا لم يكن هناك ملف صوتي
          } catch {}
          // إخفاء Toast بعد 5 ثواني
          setTimeout(() => setShowNewAppointmentToast(false), 5000)
        }
        
        setLastFetchedCount(newAppointments.length)
        setAppointments(newAppointments)
        calculateStats(newAppointments)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
      if (!silent) showMessage('error', 'حدث خطأ أثناء جلب المواعيد')
    } finally {
      if (!silent) setIsLoading(false)
    }
  }

  const calculateStats = (data: Appointment[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    setStats({
      total: data.length,
      pending: data.filter(a => a.status === 'PENDING').length,
      confirmed: data.filter(a => a.status === 'CONFIRMED').length,
      completed: data.filter(a => a.status === 'COMPLETED').length,
      cancelled: data.filter(a => a.status === 'CANCELLED').length,
      today: data.filter(a => {
        const appDate = new Date(a.appointmentDate)
        return appDate >= today && appDate < tomorrow
      }).length,
      upcoming: data.filter(a => {
        const appDate = new Date(a.appointmentDate)
        return appDate >= now && (a.status === 'PENDING' || a.status === 'CONFIRMED')
      }).length,
    })
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleConfirmAppointment = async () => {
    if (!selectedAppointment) return

    try {
      const response = await fetch(`/api/appointments/${selectedAppointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'CONFIRMED',
          adminNotes,
          confirmedBy: 'Admin' // TODO: Get from session
        }),
      })

      const result = await response.json()

      if (result.success) {
        showMessage('success', 'تم تأكيد الموعد بنجاح')
        fetchAppointments()
        setShowConfirmModal(false)
        setSelectedAppointment(null)
        setAdminNotes('')
      } else {
        showMessage('error', result.message || 'حدث خطأ')
      }
    } catch (error) {
      showMessage('error', 'حدث خطأ أثناء تأكيد الموعد')
    }
  }

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return

    try {
      const response = await fetch(`/api/appointments/${selectedAppointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'CANCELLED',
          cancellationReason,
        }),
      })

      const result = await response.json()

      if (result.success) {
        showMessage('success', 'تم إلغاء الموعد')
        fetchAppointments()
        setShowCancelModal(false)
        setSelectedAppointment(null)
        setCancellationReason('')
      } else {
        showMessage('error', result.message || 'حدث خطأ')
      }
    } catch (error) {
      showMessage('error', 'حدث خطأ أثناء إلغاء الموعد')
    }
  }

  const handleCompleteAppointment = async (appointment: Appointment) => {
    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'COMPLETED',
        }),
      })

      const result = await response.json()

      if (result.success) {
        showMessage('success', 'تم تسجيل الموعد كمكتمل')
        fetchAppointments()
      } else {
        showMessage('error', result.message || 'حدث خطأ')
      }
    } catch (error) {
      showMessage('error', 'حدث خطأ')
    }
  }

  // Filter and search
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch =
      appointment.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.contactPhone.includes(searchQuery) ||
      (appointment.property?.title || appointment.listing?.title || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus

    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage)
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'CONFIRMED': return 'bg-green-100 text-green-800 border-green-300'
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-300'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'NO_SHOW': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '⏳ قيد المراجعة'
      case 'CONFIRMED': return '✅ مؤكد'
      case 'CANCELLED': return '❌ ملغي'
      case 'COMPLETED': return '✔️ مكتمل'
      case 'NO_SHOW': return '⚠️ لم يحضر'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <PermissionGuard module="appointments" permission="view">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Floating New Appointment Toast */}
        <AnimatePresence>
          {showNewAppointmentToast && (
            <motion.div
              initial={{ opacity: 0, y: -100, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -100, x: '-50%' }}
              className="fixed top-4 left-1/2 z-50 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3"
            >
              <span className="text-2xl animate-bounce">🔔</span>
              <span className="font-semibold">موعد جديد وصل الآن!</span>
              <button 
                onClick={() => setShowNewAppointmentToast(false)}
                className="ml-2 text-white/80 hover:text-white"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">📅 إدارة المواعيد</h1>
            <p className="text-gray-600">إدارة مواعيد معاينة العقارات</p>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={() => fetchAppointments()}
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

        {/* Real-time indicator */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span>تحديث تلقائي كل 30 ثانية</span>
        </div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-md border-r-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي المواعيد</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <CalendarIcon className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-md border-r-4 border-yellow-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">قيد المراجعة</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
              </div>
              <ClockIcon className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-md border-r-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">مؤكدة</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.confirmed}</p>
              </div>
              <CheckCircleIcon className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-md border-r-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">مكتملة</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.completed}</p>
              </div>
              <CheckCircleIcon className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-md border-r-4 border-red-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">ملغاة</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.cancelled}</p>
              </div>
              <XCircleIcon className="w-12 h-12 text-red-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-md border-r-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">اليوم</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{stats.today}</p>
              </div>
              <CalendarIcon className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-md border-r-4 border-indigo-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">قادمة</p>
                <p className="text-3xl font-bold text-indigo-600 mt-1">{stats.upcoming}</p>
              </div>
              <ClockIcon className="w-12 h-12 text-indigo-500 opacity-20" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="بحث بالاسم، البريد، الهاتف، أو العقار..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FunnelIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">جميع الحالات</option>
                <option value="PENDING">⏳ قيد المراجعة</option>
                <option value="CONFIRMED">✅ مؤكدة</option>
                <option value="COMPLETED">✔️ مكتملة</option>
                <option value="CANCELLED">❌ ملغاة</option>
                <option value="NO_SHOW">⚠️ لم يحضر</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : paginatedAppointments.length === 0 ? (
            <div className="text-center py-20">
              <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">لا توجد مواعيد</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">العميل</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">العقار</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">التاريخ والوقت</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedAppointments.map((appointment) => {
                      const property = appointment.property || appointment.listing
                      return (
                        <motion.tr
                          key={appointment.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {/* Client Info */}
                          <td className="px-6 py-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <UserIcon className="w-4 h-4 text-gray-400" />
                                <p className="font-medium text-gray-900">{appointment.contactName}</p>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <PhoneIcon className="w-4 h-4" />
                                <span>{appointment.contactPhone}</span>
                              </div>
                            </div>
                          </td>

                          {/* Property Info */}
                          <td className="px-6 py-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <HomeIcon className="w-4 h-4 text-gray-400" />
                                <p className="font-medium text-gray-900">{property?.title || 'غير محدد'}</p>
                              </div>
                              {property && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MapPinIcon className="w-4 h-4" />
                                  <span>{property.city}</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Date & Time */}
                          <td className="px-6 py-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <CalendarIcon className="w-4 h-4 text-gray-400" />
                                <p className="text-sm font-medium text-gray-900">
                                  {new Date(appointment.appointmentDate).toLocaleDateString('ar-EG')}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <ClockIcon className="w-4 h-4" />
                                <span>{appointment.timeSlot}</span>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(appointment.status)}`}>
                              {getStatusText(appointment.status)}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appointment)
                                  setShowDetailsModal(true)
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="عرض التفاصيل"
                              >
                                <EyeIcon className="w-5 h-5" />
                              </button>

                              {appointment.status === 'PENDING' && (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedAppointment(appointment)
                                      setShowConfirmModal(true)
                                    }}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="تأكيد"
                                  >
                                    <CheckCircleIcon className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedAppointment(appointment)
                                      setShowCancelModal(true)
                                    }}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="إلغاء"
                                  >
                                    <XCircleIcon className="w-5 h-5" />
                                  </button>
                                </>
                              )}

                              {appointment.status === 'CONFIRMED' && (
                                <button
                                  onClick={() => handleCompleteAppointment(appointment)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="تسجيل كمكتمل"
                                >
                                  <CheckCircleIcon className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    عرض {((currentPage - 1) * itemsPerPage) + 1} إلى {Math.min(currentPage * itemsPerPage, filteredAppointments.length)} من {filteredAppointments.length}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      السابق
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      التالي
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Details Modal */}
        <AnimatePresence>
          {showDetailsModal && selectedAppointment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDetailsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">تفاصيل الموعد</h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Client Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">بيانات العميل</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">الاسم:</span>
                        <span>{selectedAppointment.contactName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">البريد:</span>
                        <span>{selectedAppointment.contactEmail}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">الهاتف:</span>
                        <span>{selectedAppointment.contactPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Property Info */}
                  {(selectedAppointment.property || selectedAppointment.listing) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">بيانات العقار</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <HomeIcon className="w-5 h-5 text-gray-400" />
                          <span className="font-medium">العقار:</span>
                          <span>{(selectedAppointment.property || selectedAppointment.listing)?.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="w-5 h-5 text-gray-400" />
                          <span className="font-medium">العنوان:</span>
                          <span>{(selectedAppointment.property || selectedAppointment.listing)?.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="w-5 h-5 text-gray-400" />
                          <span className="font-medium">المدينة:</span>
                          <span>{(selectedAppointment.property || selectedAppointment.listing)?.city}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Appointment Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">بيانات الموعد</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">التاريخ:</span>
                        <span>{formatDate(selectedAppointment.appointmentDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">الوقت:</span>
                        <span>{selectedAppointment.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">الحالة:</span>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedAppointment.status)}`}>
                          {getStatusText(selectedAppointment.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedAppointment.notes && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">ملاحظات العميل</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700">{selectedAppointment.notes}</p>
                      </div>
                    </div>
                  )}

                  {selectedAppointment.adminNotes && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">ملاحظات الإدارة</h3>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-gray-700">{selectedAppointment.adminNotes}</p>
                      </div>
                    </div>
                  )}

                  {selectedAppointment.cancellationReason && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">سبب الإلغاء</h3>
                      <div className="bg-red-50 rounded-lg p-4">
                        <p className="text-gray-700">{selectedAppointment.cancellationReason}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    إغلاق
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm Modal */}
        <AnimatePresence>
          {showConfirmModal && selectedAppointment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowConfirmModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl max-w-md w-full"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">تأكيد الموعد</h2>
                  <p className="text-gray-600 mb-4">
                    هل تريد تأكيد موعد <strong>{selectedAppointment.contactName}</strong>؟
                  </p>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ملاحظات (اختياري)
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="أي ملاحظات للعميل..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleConfirmAppointment}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      تأكيد الموعد
                    </button>
                    <button
                      onClick={() => {
                        setShowConfirmModal(false)
                        setAdminNotes('')
                      }}
                      className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cancel Modal */}
        <AnimatePresence>
          {showCancelModal && selectedAppointment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCancelModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl max-w-md w-full"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">إلغاء الموعد</h2>
                  <p className="text-gray-600 mb-4">
                    هل تريد إلغاء موعد <strong>{selectedAppointment.contactName}</strong>؟
                  </p>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      سبب الإلغاء <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      placeholder="يرجى ذكر سبب الإلغاء..."
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleCancelAppointment}
                      disabled={!cancellationReason.trim()}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      إلغاء الموعد
                    </button>
                    <button
                      onClick={() => {
                        setShowCancelModal(false)
                        setCancellationReason('')
                      }}
                      className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      رجوع
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PermissionGuard>
  )
}
