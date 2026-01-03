'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { logger } from '@/lib/logger'
import {
  UserCircleIcon,
  KeyIcon,
  ClockIcon,
  ChartBarIcon,
  ComputerDesktopIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useToastContext } from '@/lib/ToastContext'

interface Admin {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  role: string
  createdAt: string
  lastLogin: string | null
  lastLoginIp: string | null
}

interface Session {
  id: string
  device: string | null
  browser: string | null
  os: string | null
  ipAddress: string | null
  location: string | null
  isActive: boolean
  lastActivity: string
  createdAt: string
}

interface Activity {
  id: string
  action: string
  targetType: string | null
  targetId: string | null
  details: any
  createdAt: string
}

interface Stats {
  totalActivities: number
  todayActivities: number
  activeSessions: number
}

export default function SettingsPage() {
  const toast = useToastContext()
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [stats, setStats] = useState<Stats>({ totalActivities: 0, todayActivities: 0, activeSessions: 0 })
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'sessions' | 'activity'>('profile')
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Profile form
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
  })

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [adminRes, sessionsRes, activitiesRes] = await Promise.all([
        fetch('/api/auth/admin/me'),
        fetch('/api/admin/sessions?current=true'),
        fetch('/api/admin/activities?current=true&limit=10'),
      ])

      if (adminRes.ok) {
        const adminData = await adminRes.json()
        setAdmin(adminData.admin)
        setProfileForm({
          firstName: adminData.admin?.firstName || '',
          lastName: adminData.admin?.lastName || '',
          email: adminData.admin?.email || '',
          username: adminData.admin?.username || '',
        })
      }

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json()
        setSessions(sessionsData.data || [])
        setStats(prev => ({ ...prev, activeSessions: sessionsData.data?.length || 0 }))
      }

      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json()
        setActivities(activitiesData.data || [])
        setStats(prev => ({ 
          ...prev, 
          totalActivities: activitiesData.total || 0,
          todayActivities: activitiesData.todayCount || 0,
        }))
      }
    } catch (error) {
      logger.error('Error fetching data:', error)
      showMessage('error', 'حدث خطأ أثناء جلب البيانات')
    } finally {
      setIsLoading(false)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleUpdateProfile = async () => {
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      })

      const data = await res.json()

      if (res.ok) {
        showMessage('success', 'تم تحديث الملف الشخصي بنجاح')
        fetchData()
      } else {
        showMessage('error', data.message || 'حدث خطأ أثناء التحديث')
      }
    } catch (error) {
      showMessage('error', 'حدث خطأ أثناء التحديث')
    }
  }

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('error', 'كلمات المرور الجديدة غير متطابقة')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      showMessage('error', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        showMessage('success', 'تم تغيير كلمة المرور بنجاح')
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        showMessage('error', data.message || 'حدث خطأ أثناء تغيير كلمة المرور')
      }
    } catch (error) {
      showMessage('error', 'حدث خطأ أثناء تغيير كلمة المرور')
    }
  }

  const handleDeleteSessionClick = (sessionId: string) => {
    setSessionToDelete(sessionId)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/sessions/${sessionToDelete}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('تم حذف الجلسة بنجاح')
        fetchData()
        setDeleteConfirmOpen(false)
        setSessionToDelete(null)
      } else {
        toast.error('حدث خطأ أثناء حذف الجلسة')
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف الجلسة')
    } finally {
      setDeleting(false)
    }
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return '🔐 سوبر أدمن'
      case 'ADMIN': return '👤 مشرف'
      case 'MODERATOR': return '📝 محرر'
      default: return role
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN': return '🔓'
      case 'LOGOUT': return '🔒'
      case 'CREATE': return '➕'
      case 'UPDATE': return '✏️'
      case 'DELETE': return '🗑️'
      case 'APPROVE': return '✅'
      case 'REJECT': return '❌'
      default: return '📝'
    }
  }

  const getActionName = (action: string) => {
    const names: any = {
      LOGIN: 'تسجيل دخول',
      LOGOUT: 'تسجيل خروج',
      CREATE: 'إنشاء',
      UPDATE: 'تحديث',
      DELETE: 'حذف',
      APPROVE: 'موافقة',
      REJECT: 'رفض',
    }
    return names[action] || action
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">⚙️ الإعدادات</h1>
          <p className="text-gray-600 mt-1">إدارة حسابك والإعدادات الشخصية</p>
        </div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircleIcon className="w-5 h-5" />
              ) : (
                <ExclamationTriangleIcon className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              {/* Admin Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-3">
                  <UserCircleIcon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-center font-bold text-gray-900">
                  {admin?.firstName} {admin?.lastName}
                </h3>
                <p className="text-center text-sm text-gray-500 mt-1">{admin?.username}@</p>
                <div className="text-center mt-2">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    {getRoleName(admin?.role || '')}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">إجمالي الأنشطة</span>
                  <span className="font-bold text-gray-900">{stats.totalActivities}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-600">أنشطة اليوم</span>
                  <span className="font-bold text-blue-900">{stats.todayActivities}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-green-600">الجلسات النشطة</span>
                  <span className="font-bold text-green-900">{stats.activeSessions}</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'profile'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <UserCircleIcon className="w-5 h-5" />
                  <span className="font-medium">الملف الشخصي</span>
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'password'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <KeyIcon className="w-5 h-5" />
                  <span className="font-medium">كلمة المرور</span>
                </button>
                <button
                  onClick={() => setActiveTab('sessions')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'sessions'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ComputerDesktopIcon className="w-5 h-5" />
                  <span className="font-medium">الجلسات النشطة</span>
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'activity'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ChartBarIcon className="w-5 h-5" />
                  <span className="font-medium">آخر الأنشطة</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <UserCircleIcon className="w-6 h-6" />
                    الملف الشخصي
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        الاسم الأول
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        اسم العائلة
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        اسم المستخدم
                      </label>
                      <input
                        type="text"
                        value={profileForm.username}
                        onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">تاريخ التسجيل:</span>
                        <span className="font-semibold text-gray-900 mr-2">
                          {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString('ar-EG') : '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">آخر دخول:</span>
                        <span className="font-semibold text-gray-900 mr-2">
                          {admin?.lastLogin ? new Date(admin.lastLogin).toLocaleString('ar-EG') : '-'}
                        </span>
                      </div>
                      {admin?.lastLoginIp && (
                        <div>
                          <span className="text-gray-600">آخر IP:</span>
                          <span className="font-semibold text-gray-900 mr-2">{admin.lastLoginIp}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleUpdateProfile}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                    >
                      حفظ التغييرات
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <KeyIcon className="w-6 h-6" />
                    تغيير كلمة المرور
                  </h2>

                  <div className="max-w-md space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        كلمة المرور الحالية
                      </label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        كلمة المرور الجديدة
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">يجب أن تكون 6 أحرف على الأقل</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        تأكيد كلمة المرور الجديدة
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleChangePassword}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                      >
                        تغيير كلمة المرور
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Sessions Tab */}
              {activeTab === 'sessions' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <ComputerDesktopIcon className="w-6 h-6" />
                    الجلسات النشطة ({sessions.length})
                  </h2>

                  <div className="space-y-4">
                    {sessions.length > 0 ? (
                      sessions.map((session) => (
                        <div
                          key={session.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <ComputerDesktopIcon className="w-5 h-5 text-blue-600" />
                                <h3 className="font-semibold text-gray-900">
                                  {session.device || 'جهاز غير معروف'}
                                </h3>
                              </div>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>📱 المتصفح: {session.browser || 'غير معروف'}</p>
                                <p>💻 النظام: {session.os || 'غير معروف'}</p>
                                <p>🌐 IP: {session.ipAddress || 'غير معروف'}</p>
                                {session.location && <p>📍 الموقع: {session.location}</p>}
                                <p>🕐 آخر نشاط: {new Date(session.lastActivity).toLocaleString('ar-EG')}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteSessionClick(session.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <ComputerDesktopIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>لا توجد جلسات نشطة</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <ChartBarIcon className="w-6 h-6" />
                    آخر الأنشطة
                  </h2>

                  <div className="space-y-3">
                    {activities.length > 0 ? (
                      activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{getActionIcon(activity.action)}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900">
                                  {getActionName(activity.action)}
                                </span>
                                {activity.targetType && (
                                  <span className="text-sm text-gray-500">
                                    • {activity.targetType}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                {new Date(activity.createdAt).toLocaleString('ar-EG')}
                              </p>
                              {activity.details && Object.keys(activity.details).length > 0 && (
                                <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                  {JSON.stringify(activity.details, null, 2)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <ClockIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>لا توجد أنشطة حديثة</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confirm Delete Session Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteSession}
        title="حذف جلسة"
        message="هل تريد حذف هذه الجلسة؟ سيتم تسجيل الخروج من هذا الجهاز."
        confirmText="حذف"
        cancelText="إلغاء"
        type="warning"
        isLoading={deleting}
      />
    </div>
  )
}