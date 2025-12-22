'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { logger } from '@/lib/logger'
import {
  UserGroupIcon,
  ShieldCheckIcon,
  ClockIcon,
  GlobeAltIcon,
  ChartBarIcon,
  EyeIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

interface Admin {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  role: string
  permissions: any
  active: boolean
  lastLogin: string | null
  lastLoginIp: string | null
  createdAt: string
  activitiesCount: number
  sessionsCount: number
}

interface AdminStats {
  total: number
  active: number
  inactive: number
  superAdmins: number
  admins: number
  moderators: number
  loggedInLast7Days: number
  loggedInLast30Days: number
}

interface AdminActivity {
  id: string
  action: string
  targetType: string | null
  targetId: string | null
  details: any
  ipAddress: string | null
  createdAt: string
  admin: {
    username: string
    firstName: string
    lastName: string
  }
}

interface AdminSession {
  id: string
  ipAddress: string | null
  device: string | null
  browser: string | null
  os: string | null
  location: string | null
  isActive: boolean
  lastActivity: string
  createdAt: string
  admin: {
    username: string
    firstName: string
    lastName: string
  }
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [stats, setStats] = useState<AdminStats>({
    total: 0,
    active: 0,
    inactive: 0,
    superAdmins: 0,
    admins: 0,
    moderators: 0,
    loggedInLast7Days: 0,
    loggedInLast30Days: 0,
  })
  const [activities, setActivities] = useState<AdminActivity[]>([])
  const [sessions, setSessions] = useState<AdminSession[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'sessions'>('overview')
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'MODERATOR',
    active: true,
    permissions: {
      properties: { view: true, create: false, edit: false, delete: false, approve: false },
      users: { view: true, create: false, edit: false, delete: false },
      projects: { view: true, create: false, edit: false, delete: false },
      portfolio: { view: true, create: false, edit: false, delete: false },
      services: { view: true, create: false, edit: false, delete: false },
      inquiries: { view: true, create: false, edit: false, delete: false },
      newsletter: { view: true, create: false, delete: false },
      reports: { view: true, export: false },
      admins: { view: false, create: false, edit: false, delete: false },
      testimonials: { view: false, create: false, edit: false, delete: false },
      'general-info': { view: false, create: false, edit: false, delete: false },
      about: { view: false, create: false, edit: false, delete: false },
    },
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [statsRes, activitiesRes, sessionsRes] = await Promise.all([
        fetch('/api/admin/admin-stats'),
        fetch('/api/admin/activities?limit=50'),
        fetch('/api/admin/sessions?isActive=true'),
      ])

      const statsData = await statsRes.json()
      const activitiesData = await activitiesRes.json()
      const sessionsData = await sessionsRes.json()

      if (statsData.success) {
        setAdmins(statsData.data.admins)
        setStats(statsData.data.stats)
      }

      if (activitiesData.success) {
        setActivities(activitiesData.data)
      }

      if (sessionsData.success) {
        setSessions(sessionsData.data)
      }
    } catch (error) {
      logger.error('Error fetching data:', error)
      showMessage('error', 'حدث خطأ أثناء جلب البيانات')
    } finally {
      setIsLoading(false)
    }
  }

  const terminateSession = async (sessionId: string) => {
    if (!confirm('هل أنت متأكد من إنهاء هذه الجلسة؟')) return

    try {
      const response = await fetch(`/api/admin/sessions?sessionId=${sessionId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        showMessage('success', 'تم إنهاء الجلسة بنجاح')
        fetchData()
      }
    } catch (error) {
      showMessage('error', 'حدث خطأ أثناء إنهاء الجلسة')
    }
  }

  const handleAddAdmin = async () => {
    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        showMessage('success', 'تم إضافة المشرف بنجاح')
        setShowAddModal(false)
        resetForm()
        fetchData()
      } else {
        showMessage('error', result.message || 'حدث خطأ أثناء إضافة المشرف')
      }
    } catch (error) {
      showMessage('error', 'حدث خطأ أثناء إضافة المشرف')
    }
  }

  const handleEditAdmin = async () => {
    if (!selectedAdmin) return

    logger.log('📤 Sending update request...');
    logger.log('Admin ID:', selectedAdmin.id);
    logger.log('Form Data:', formData);

    try {
      const response = await fetch('/api/admin/admins', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedAdmin.id,
          ...formData,
          password: formData.password || undefined, // فقط إذا تم تغييرها
        }),
      })

      const result = await response.json()
      logger.log('📥 Response:', result);

      if (result.success) {
        showMessage('success', 'تم تحديث المشرف بنجاح')
        setShowEditModal(false)
        setSelectedAdmin(null)
        resetForm()
        // إعادة جلب البيانات من السيرفر لتحديث القائمة
        await fetchData()
      } else {
        showMessage('error', result.message || 'حدث خطأ أثناء تحديث المشرف')
      }
    } catch (error) {
      console.error('❌ Error:', error);
      showMessage('error', 'حدث خطأ أثناء تحديث المشرف')
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشرف؟ هذا الإجراء لا يمكن التراجع عنه.')) return

    try {
      const response = await fetch(`/api/admin/admins?id=${adminId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        showMessage('success', 'تم حذف المشرف بنجاح')
        fetchData()
      } else {
        showMessage('error', result.message || 'حدث خطأ أثناء حذف المشرف')
      }
    } catch (error) {
      showMessage('error', 'حدث خطأ أثناء حذف المشرف')
    }
  }

  const openEditModal = (admin: Admin) => {
    console.log('🔧 Opening edit modal for admin:', admin.username);
    console.log('📋 Current permissions from server:', admin.permissions);
    
    setSelectedAdmin(admin)
    setFormData({
      username: admin.username,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      password: '',
      role: admin.role,
      active: admin.active,
      permissions: (admin.permissions as any) || {
        properties: { view: true, create: false, edit: false, delete: false, approve: false },
        users: { view: true, create: false, edit: false, delete: false },
        projects: { view: true, create: false, edit: false, delete: false },
        portfolio: { view: true, create: false, edit: false, delete: false },
        services: { view: true, create: false, edit: false, delete: false },
        inquiries: { view: true, create: false, edit: false, delete: false },
        newsletter: { view: true, create: false, delete: false },
        reports: { view: true, export: false },
        admins: { view: false, create: false, edit: false, delete: false },
      },
    })
    
    console.log('✅ Form data set with permissions:', (admin.permissions as any));
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      role: 'MODERATOR',
      active: true,
      permissions: {
        properties: { view: true, create: false, edit: false, delete: false, approve: false },
        users: { view: true, create: false, edit: false, delete: false },
        projects: { view: true, create: false, edit: false, delete: false },
        portfolio: { view: true, create: false, edit: false, delete: false },
        services: { view: true, create: false, edit: false, delete: false },
        inquiries: { view: true, create: false, edit: false, delete: false },
        newsletter: { view: true, create: false, delete: false },
        reports: { view: true, export: false },
        admins: { view: false, create: false, edit: false, delete: false },
        testimonials: { view: false, create: false, edit: false, delete: false },
        'general-info': { view: false, create: false, edit: false, delete: false },
        about: { view: false, create: false, edit: false, delete: false },
      },
    })
  }

  const togglePermission = (module: string, permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...(prev.permissions as any)[module],
          [permission]: !(prev.permissions as any)[module][permission],
        },
      },
    }))
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const getRoleText = (role: string) => {
    const roleMap: Record<string, string> = {
      SUPER_ADMIN: 'مدير عام',
      ADMIN: 'مشرف',
      MODERATOR: 'مراقب',
    }
    return roleMap[role] || role
  }

  const getRoleColor = (role: string) => {
    const colorMap: Record<string, string> = {
      SUPER_ADMIN: 'bg-purple-100 text-purple-800',
      ADMIN: 'bg-blue-100 text-blue-800',
      MODERATOR: 'bg-green-100 text-green-800',
    }
    return colorMap[role] || 'bg-gray-100 text-gray-800'
  }

  const getActionText = (action: string) => {
    const actionMap: Record<string, string> = {
      LOGIN: 'تسجيل دخول',
      LOGOUT: 'تسجيل خروج',
      CREATE: 'إضافة',
      UPDATE: 'تعديل',
      DELETE: 'حذف',
      APPROVE: 'موافقة',
      REJECT: 'رفض',
      VIEW: 'عرض',
    }
    return actionMap[action] || action
  }

  const getActionColor = (action: string) => {
    const colorMap: Record<string, string> = {
      LOGIN: 'bg-green-100 text-green-800',
      LOGOUT: 'bg-gray-100 text-gray-800',
      CREATE: 'bg-blue-100 text-blue-800',
      UPDATE: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800',
      APPROVE: 'bg-green-100 text-green-800',
      REJECT: 'bg-red-100 text-red-800',
      VIEW: 'bg-gray-100 text-gray-800',
    }
    return colorMap[action] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة المشرفين</h1>
          <p className="text-gray-600 mt-1">إدارة حسابات المشرفين والصلاحيات والنشاطات</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-lg"
          >
            <UserGroupIcon className="w-5 h-5" />
            إضافة مشرف جديد
          </button>
          <UserGroupIcon className="w-12 h-12 text-blue-600" />
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">إجمالي المشرفين</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
              <p className="text-blue-100 text-xs mt-1">{stats.active} نشط</p>
            </div>
            <UserGroupIcon className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">مديرين عامين</p>
              <p className="text-3xl font-bold mt-2">{stats.superAdmins}</p>
              <p className="text-purple-100 text-xs mt-1">صلاحيات كاملة</p>
            </div>
            <ShieldCheckIcon className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">دخول آخر 7 أيام</p>
              <p className="text-3xl font-bold mt-2">{stats.loggedInLast7Days}</p>
              <p className="text-green-100 text-xs mt-1">مشرف نشط</p>
            </div>
            <ClockIcon className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">الجلسات النشطة</p>
              <p className="text-3xl font-bold mt-2">{sessions.length}</p>
              <p className="text-orange-100 text-xs mt-1">جلسة حالية</p>
            </div>
            <GlobeAltIcon className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex gap-2 p-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📊 نظرة عامة
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'activities'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📜 سجل النشاطات
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'sessions'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🌐 الجلسات النشطة
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">قائمة المشرفين</h3>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">جاري التحميل...</p>
                </div>
              ) : admins.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  لا يوجد مشرفين
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المشرف</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الدور</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">آخر دخول</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النشاطات</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الجلسات</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {admins.map((admin) => (
                        <tr key={admin.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {admin.firstName} {admin.lastName}
                              </div>
                              <div className="text-sm text-gray-500">@{admin.username}</div>
                              <div className="text-xs text-gray-400">{admin.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(admin.role)}`}>
                              {getRoleText(admin.role)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {admin.active ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <CheckCircleIcon className="w-5 h-5" />
                                <span className="text-sm">نشط</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-red-600">
                                <XCircleIcon className="w-5 h-5" />
                                <span className="text-sm">معطل</span>
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {admin.lastLogin ? (
                              <div>
                                <div>{new Date(admin.lastLogin).toLocaleDateString('ar-EG')}</div>
                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                  <GlobeAltIcon className="w-3 h-3" />
                                  {admin.lastLoginIp || 'غير معروف'}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">لم يسجل دخول بعد</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <ChartBarIcon className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-semibold text-blue-600">{admin.activitiesCount}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <GlobeAltIcon className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-semibold text-green-600">{admin.sessionsCount}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(admin)}
                                className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                              >
                                تعديل
                              </button>
                              {admin.role !== 'SUPER_ADMIN' && (
                                <button
                                  onClick={() => handleDeleteAdmin(admin.id)}
                                  className="text-red-600 hover:text-red-800 font-semibold text-sm"
                                >
                                  حذف
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">سجل النشاطات الأخيرة</h3>
              {activities.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  لا توجد نشاطات
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(activity.action)}`}>
                              {getActionText(activity.action)}
                            </span>
                            {activity.targetType && (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                {activity.targetType}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-900">
                            <span className="font-semibold">
                              {activity.admin.firstName} {activity.admin.lastName}
                            </span>
                            <span className="text-gray-500"> (@{activity.admin.username})</span>
                          </div>
                          {activity.ipAddress && (
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <GlobeAltIcon className="w-3 h-3" />
                              {activity.ipAddress}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 text-left">
                          {new Date(activity.createdAt).toLocaleString('ar-EG')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">الجلسات النشطة الحالية</h3>
              {sessions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  لا توجد جلسات نشطة
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {session.admin.firstName} {session.admin.lastName}
                          </div>
                          <div className="text-sm text-gray-600">@{session.admin.username}</div>
                        </div>
                        {session.isActive && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            نشطة
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        {session.device && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">📱 الجهاز:</span>
                            <span className="font-medium">{session.device}</span>
                          </div>
                        )}
                        {session.browser && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">🌐 المتصفح:</span>
                            <span className="font-medium">{session.browser}</span>
                          </div>
                        )}
                        {session.os && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">💻 النظام:</span>
                            <span className="font-medium">{session.os}</span>
                          </div>
                        )}
                        {session.ipAddress && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">🌍 IP:</span>
                            <span className="font-mono text-xs">{session.ipAddress}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">🕐 آخر نشاط:</span>
                          <span className="text-xs">{new Date(session.lastActivity).toLocaleString('ar-EG')}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => terminateSession(session.id)}
                        className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <XMarkIcon className="w-4 h-4" />
                        إنهاء الجلسة
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-xl font-bold">➕ إضافة مشرف جديد</h2>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-white hover:text-gray-200">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">اسم المستخدم *</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="admin123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="admin@amg-invest.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم الأول *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أحمد"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">اسم العائلة *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="محمد"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الدور *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="MODERATOR">مراقب - MODERATOR</option>
                    <option value="ADMIN">مشرف - ADMIN</option>
                    <option value="SUPER_ADMIN">مدير عام - SUPER_ADMIN</option>
                  </select>
                </div>
              </div>

              {/* Permissions */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🔐 الصلاحيات</h3>
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(formData.permissions).map(([module, perms]: [string, any]) => (
                    <div key={module} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3 capitalize">{module}</h4>
                      <div className="flex flex-wrap gap-3">
                        {Object.entries(perms).map(([perm, value]: [string, any]) => (
                          <label key={perm} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() => togglePermission(module, perm)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 capitalize">{perm}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-semibold text-gray-700">الحساب نشط</label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddAdmin}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  إضافة المشرف
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-xl font-bold">✏️ تعديل مشرف</h2>
              <button onClick={() => { setShowEditModal(false); setSelectedAdmin(null); resetForm(); }} className="text-white hover:text-gray-200">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">اسم المستخدم</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم الأول</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">اسم العائلة</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور الجديدة (اتركها فارغة إذا لم ترد التغيير)</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الدور</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    disabled={selectedAdmin?.role === 'SUPER_ADMIN'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
                  >
                    <option value="MODERATOR">مراقب - MODERATOR</option>
                    <option value="ADMIN">مشرف - ADMIN</option>
                    <option value="SUPER_ADMIN">مدير عام - SUPER_ADMIN</option>
                  </select>
                  {selectedAdmin?.role === 'SUPER_ADMIN' && (
                    <p className="text-xs text-gray-500 mt-1">
                      لا يمكن تغيير دور السوبر أدمن
                    </p>
                  )}
                </div>
              </div>

              {/* Permissions */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🔐 الصلاحيات</h3>
                
                {/* تحذير للسوبر أدمن */}
                {selectedAdmin?.role === 'SUPER_ADMIN' && (
                  <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚠️</span>
                      <div>
                        <p className="text-sm font-semibold text-yellow-800">
                          السوبر أدمن يمتلك جميع الصلاحيات تلقائياً
                        </p>
                        <p className="text-xs text-yellow-700 mt-1">
                          لا يمكن تعديل صلاحيات السوبر أدمن - له صلاحيات كاملة على النظام بأكمله
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(formData.permissions).map(([module, perms]: [string, any]) => (
                    <div key={module} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3 capitalize">{module}</h4>
                      <div className="flex flex-wrap gap-3">
                        {Object.entries(perms).map(([perm, value]: [string, any]) => (
                          <label key={perm} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() => togglePermission(module, perm)}
                              disabled={selectedAdmin?.role === 'SUPER_ADMIN'}
                              className="w-4 h-4 text-green-600 rounded focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <span className="text-sm text-gray-700 capitalize">{perm}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <label className="text-sm font-semibold text-gray-700">الحساب نشط</label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  onClick={() => { setShowEditModal(false); setSelectedAdmin(null); resetForm(); }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleEditAdmin}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                >
                  حفظ التعديلات
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}