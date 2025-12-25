'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import {
  CalendarIcon,
  ClockIcon,
  HomeIcon,
  MapPinIcon,
  PlusIcon,
  XCircleIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'

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
  cancelledAt?: string
  cancellationReason?: string
  createdAt: string
  property?: {
    id: string
    title: string
    address: string
    city: string
    propertyType: string
  }
  listing?: {
    id: string
    title: string
    address: string
    city: string
    propertyType: string
  }
}

export default function UserAppointmentsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchAppointments()
  }, [user, router])

  const fetchAppointments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/appointments?userId=${user?.id}`)
      const result = await response.json()

      if (result.success) {
        setAppointments(result.appointments)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
      showMessage('error', 'حدث خطأ أثناء جلب المواعيد')
    } finally {
      setIsLoading(false)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return

    try {
      const response = await fetch(`/api/appointments/${selectedAppointment.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        showMessage('success', 'تم إلغاء الموعد بنجاح')
        fetchAppointments()
        setShowCancelModal(false)
        setSelectedAppointment(null)
      } else {
        showMessage('error', result.message || 'حدث خطأ')
      }
    } catch (error) {
      showMessage('error', 'حدث خطأ أثناء إلغاء الموعد')
    }
  }

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
      case 'NO_SHOW': return '⚠️ لم تحضر'
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

  const upcomingAppointments = appointments.filter(a => {
    const appDate = new Date(a.appointmentDate)
    return appDate >= new Date() && (a.status === 'PENDING' || a.status === 'CONFIRMED')
  })

  const pastAppointments = appointments.filter(a => {
    const appDate = new Date(a.appointmentDate)
    return appDate < new Date() || a.status === 'CANCELLED' || a.status === 'COMPLETED'
  })

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📅 مواعيدي</h1>
          <p className="text-gray-600">إدارة مواعيد معاينة العقارات الخاصة بك</p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-md border-r-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي المواعيد</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{appointments.length}</p>
              </div>
              <CalendarIcon className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-md border-r-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">المواعيد القادمة</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{upcomingAppointments.length}</p>
              </div>
              <ClockIcon className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-md border-r-4 border-gray-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">المواعيد السابقة</p>
                <p className="text-3xl font-bold text-gray-600 mt-1">{pastAppointments.length}</p>
              </div>
              <CalendarIcon className="w-12 h-12 text-gray-500 opacity-20" />
            </div>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد مواعيد</h3>
            <p className="text-gray-600 mb-6">لم تقم بحجز أي موعد معاينة بعد</p>
            <button
              onClick={() => router.push('/listings')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>تصفح العقارات</span>
            </button>
          </div>
        ) : (
          <>
            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">المواعيد القادمة</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingAppointments.map((appointment) => {
                    const property = appointment.property || appointment.listing
                    return (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-green-500"
                      >
                        <div className="p-6">
                          {/* Status Badge */}
                          <div className="flex items-center justify-between mb-4">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(appointment.status)}`}>
                              {getStatusText(appointment.status)}
                            </span>
                            <span className="text-xs text-gray-500">
                              #{appointment.id.slice(0, 8).toUpperCase()}
                            </span>
                          </div>

                          {/* Property Info */}
                          <div className="mb-4">
                            <div className="flex items-start gap-2 mb-2">
                              <HomeIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                              <div>
                                <h3 className="font-bold text-gray-900">{property?.title || 'عقار'}</h3>
                                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                  <MapPinIcon className="w-4 h-4" />
                                  <span>{property?.city}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Date & Time */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <CalendarIcon className="w-5 h-5 text-blue-500" />
                              <span>{new Date(appointment.appointmentDate).toLocaleDateString('ar-EG')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <ClockIcon className="w-5 h-5 text-blue-500" />
                              <span>{appointment.timeSlot}</span>
                            </div>
                          </div>

                          {/* Admin Notes */}
                          {appointment.adminNotes && (
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                              <p className="text-xs text-gray-600 mb-1">ملاحظات الإدارة:</p>
                              <p className="text-sm text-gray-800">{appointment.adminNotes}</p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-4 border-t border-gray-100">
                            <button
                              onClick={() => {
                                setSelectedAppointment(appointment)
                                setShowDetailsModal(true)
                              }}
                              className="flex-1 px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                            >
                              <EyeIcon className="w-4 h-4" />
                              <span>التفاصيل</span>
                            </button>
                            {appointment.status === 'PENDING' && (
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appointment)
                                  setShowCancelModal(true)
                                }}
                                className="flex-1 px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                              >
                                <XCircleIcon className="w-4 h-4" />
                                <span>إلغاء</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">المواعيد السابقة</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastAppointments.map((appointment) => {
                    const property = appointment.property || appointment.listing
                    return (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden opacity-75"
                      >
                        <div className="p-6">
                          {/* Status Badge */}
                          <div className="flex items-center justify-between mb-4">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(appointment.status)}`}>
                              {getStatusText(appointment.status)}
                            </span>
                            <span className="text-xs text-gray-500">
                              #{appointment.id.slice(0, 8).toUpperCase()}
                            </span>
                          </div>

                          {/* Property Info */}
                          <div className="mb-4">
                            <div className="flex items-start gap-2 mb-2">
                              <HomeIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                              <div>
                                <h3 className="font-bold text-gray-900">{property?.title || 'عقار'}</h3>
                                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                  <MapPinIcon className="w-4 h-4" />
                                  <span>{property?.city}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Date & Time */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <CalendarIcon className="w-5 h-5 text-gray-400" />
                              <span>{new Date(appointment.appointmentDate).toLocaleDateString('ar-EG')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <ClockIcon className="w-5 h-5 text-gray-400" />
                              <span>{appointment.timeSlot}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="pt-4 border-t border-gray-100">
                            <button
                              onClick={() => {
                                setSelectedAppointment(appointment)
                                setShowDetailsModal(true)
                              }}
                              className="w-full px-4 py-2 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                            >
                              <EyeIcon className="w-4 h-4" />
                              <span>عرض التفاصيل</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}

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
                  {/* Status */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">الحالة</h3>
                    <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(selectedAppointment.status)}`}>
                      {getStatusText(selectedAppointment.status)}
                    </span>
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
                        <span className="font-medium">رقم الحجز:</span>
                        <span>#{selectedAppointment.id.slice(0, 8).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedAppointment.notes && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">ملاحظاتك</h3>
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

                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                  {selectedAppointment.status === 'PENDING' && (
                    <button
                      onClick={() => {
                        setShowDetailsModal(false)
                        setShowCancelModal(true)
                      }}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      إلغاء الموعد
                    </button>
                  )}
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
                  <p className="text-gray-600 mb-6">
                    هل أنت متأكد من رغبتك في إلغاء هذا الموعد؟ لن تتمكن من التراجع عن هذا الإجراء.
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={handleCancelAppointment}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      نعم، إلغاء الموعد
                    </button>
                    <button
                      onClick={() => setShowCancelModal(false)}
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
    </div>
  )
}
