'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { logger } from '@/lib/logger'
import { 
  ClockIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  UserPlusIcon,
  BuildingOfficeIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  KeyIcon,
  CheckBadgeIcon,
  DevicePhoneMobileIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon
} from '@heroicons/react/24/outline'
import { withAuth } from '@/lib/AuthContext'
import Link from 'next/link'

interface Activity {
  id: string
  type: string
  entityType: string | null
  entityId: string | null
  title: string
  description: string | null
  metadata: any
  createdAt: string
  icon: string
  color: string
  bgColor: string
}

interface Stats {
  total: number
  byType: Record<string, number>
  last7Days: number
  last30Days: number
}

function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Filters
  const [filterType, setFilterType] = useState<string>('ALL')
  const [dateRange, setDateRange] = useState<string>('ALL')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalActivities, setTotalActivities] = useState(0)
  const itemsPerPage = 20

  // خريطة الأيقونات
  const iconMap: Record<string, any> = {
    'ArrowRightOnRectangleIcon': ArrowRightOnRectangleIcon,
    'ArrowLeftOnRectangleIcon': ArrowLeftOnRectangleIcon,
    'UserPlusIcon': UserPlusIcon,
    'BuildingOfficeIcon': BuildingOfficeIcon,
    'PencilSquareIcon': PencilSquareIcon,
    'TrashIcon': TrashIcon,
    'EyeIcon': EyeIcon,
    'HeartIcon': HeartIcon,
    'ChatBubbleLeftRightIcon': ChatBubbleLeftRightIcon,
    'UserCircleIcon': UserCircleIcon,
    'KeyIcon': KeyIcon,
    'CheckBadgeIcon': CheckBadgeIcon,
    'DevicePhoneMobileIcon': DevicePhoneMobileIcon,
    'InformationCircleIcon': InformationCircleIcon
  }

  // جلب الأنشطة
  const fetchActivities = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        limit: itemsPerPage.toString(),
        offset: ((currentPage - 1) * itemsPerPage).toString(),
        stats: 'true'
      })

      if (filterType !== 'ALL') {
        params.append('type', filterType)
      }

      if (dateRange !== 'ALL') {
        const days = parseInt(dateRange)
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)
        params.append('startDate', startDate.toISOString())
      }

      const response = await fetch(`/api/user/activities?${params}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setActivities(data.data.activities || [])
        setTotalActivities(data.data.total || 0)
        setTotalPages(Math.ceil((data.data.total || 0) / itemsPerPage))
        
        if (data.data.stats) {
          setStats(data.data.stats)
        }
        setError('')
      } else {
        setError('حدث خطأ أثناء جلب الأنشطة')
      }
    } catch (error) {
      logger.error('Error fetching activities:', error)
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [currentPage, filterType, dateRange])

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const now = new Date()
    const activityDate = new Date(dateString)
    const diffMs = now.getTime() - activityDate.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 1) {
      return 'الآن'
    } else if (diffMinutes < 60) {
      return `منذ ${diffMinutes} دقيقة`
    } else if (diffHours < 24) {
      return `منذ ${diffHours} ساعة`
    } else if (diffDays < 7) {
      return `منذ ${diffDays} يوم`
    } else {
      return activityDate.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  // الحصول على label نوع النشاط
  const getActivityTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'LOGIN': 'تسجيل دخول',
      'LOGOUT': 'تسجيل خروج',
      'REGISTER': 'تسجيل حساب',
      'PROPERTY_CREATE': 'إضافة عقار',
      'PROPERTY_UPDATE': 'تحديث عقار',
      'PROPERTY_DELETE': 'حذف عقار',
      'PROPERTY_VIEW': 'عرض عقار',
      'PROPERTY_FAVORITE': 'إضافة مفضلة',
      'PROPERTY_UNFAVORITE': 'إزالة مفضلة',
      'INQUIRY_CREATE': 'استفسار',
      'PROFILE_UPDATE': 'تحديث ملف',
      'PASSWORD_CHANGE': 'تغيير كلمة مرور',
      'EMAIL_VERIFY': 'تفعيل بريد',
      'PHONE_VERIFY': 'تفعيل هاتف'
    }
    
    return labels[type] || type
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 mb-6 text-sm">
          <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <HomeIcon className="w-4 h-4 ml-1" />
            الرئيسية
          </Link>
          <ChevronLeftIcon className="w-4 h-4 text-gray-400" />
          <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
            الداشبورد
          </Link>
          <ChevronLeftIcon className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-medium">سجل الأنشطة</span>
        </nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ClockIcon className="w-8 h-8 text-blue-600" />
                سجل الأنشطة
              </h1>
              <p className="text-gray-600 mt-2">
                سجل كامل بجميع أنشطتك وتفاعلاتك على المنصة
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentPage(1)
                fetchActivities()
              }}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              تحديث
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">إجمالي الأنشطة</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <ClockIcon className="w-12 h-12 text-blue-200 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm mb-1">آخر 7 أيام</p>
                  <p className="text-3xl font-bold">{stats.last7Days || 0}</p>
                </div>
                <ChartBarIcon className="w-12 h-12 text-green-200 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm mb-1">آخر 30 يوم</p>
                  <p className="text-3xl font-bold">{stats.last30Days || 0}</p>
                </div>
                <CalendarIcon className="w-12 h-12 text-purple-200 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm mb-1">أنواع الأنشطة</p>
                  <p className="text-3xl font-bold">{Object.keys(stats.byType || {}).length}</p>
                </div>
                <FunnelIcon className="w-12 h-12 text-orange-200 opacity-50" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">تصفية الأنشطة</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع النشاط
              </label>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">جميع الأنشطة</option>
                <option value="LOGIN">تسجيل دخول</option>
                <option value="PROPERTY_CREATE">إضافة عقار</option>
                <option value="PROPERTY_UPDATE">تحديث عقار</option>
                <option value="PROPERTY_DELETE">حذف عقار</option>
                <option value="PROPERTY_VIEW">عرض عقار</option>
                <option value="PROPERTY_FAVORITE">المفضلة</option>
                <option value="INQUIRY_CREATE">استفسارات</option>
                <option value="PROFILE_UPDATE">تحديث الملف</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الفترة الزمنية
              </label>
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">كل الأوقات</option>
                <option value="1">آخر 24 ساعة</option>
                <option value="7">آخر 7 أيام</option>
                <option value="30">آخر 30 يوم</option>
                <option value="90">آخر 90 يوم</option>
              </select>
            </div>
          </div>

          {(filterType !== 'ALL' || dateRange !== 'ALL') && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">الفلاتر النشطة:</span>
              {filterType !== 'ALL' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {getActivityTypeLabel(filterType)}
                  <button
                    onClick={() => setFilterType('ALL')}
                    className="mr-2 hover:text-blue-900"
                  >
                    ✕
                  </button>
                </span>
              )}
              {dateRange !== 'ALL' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  آخر {dateRange} يوم
                  <button
                    onClick={() => setDateRange('ALL')}
                    className="mr-2 hover:text-green-900"
                  >
                    ✕
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setFilterType('ALL')
                  setDateRange('ALL')
                  setCurrentPage(1)
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                مسح الفلاتر
              </button>
            </div>
          )}
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Activities List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          {loading ? (
            <div className="text-center py-20">
              <ArrowPathIcon className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">جاري تحميل الأنشطة...</p>
            </div>
          ) : activities.length > 0 ? (
            <>
              <div className="divide-y divide-gray-100">
                {activities.map((activity, index) => {
                  const IconComponent = iconMap[activity.icon] || InformationCircleIcon
                  
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 p-3 rounded-xl ${activity.bgColor}`}>
                          <IconComponent className={`w-6 h-6 ${activity.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="text-base font-semibold text-gray-900 mb-1">
                                {activity.title}
                              </h4>
                              {activity.description && (
                                <p className="text-sm text-gray-600 mb-2">
                                  {activity.description}
                                </p>
                              )}
                              
                              {/* Metadata */}
                              {activity.metadata && (
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  {activity.type === 'PROPERTY_CREATE' && activity.metadata.propertyType && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                      📍 {activity.metadata.propertyType}
                                    </span>
                                  )}
                                  {activity.metadata.city && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                      🏙️ {activity.metadata.city}
                                    </span>
                                  )}
                                  {activity.metadata.price && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                                      💰 {new Intl.NumberFormat('ar-EG').format(activity.metadata.price)} جنيه
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Date */}
                            <div className="text-left flex-shrink-0">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                <ClockIcon className="w-3 h-3 ml-1" />
                                {formatDate(activity.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      عرض {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalActivities)} من {totalActivities}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1 || loading}
                        className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRightIcon className="w-4 h-4" />
                        السابق
                      </button>

                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum
                          if (totalPages <= 5) {
                            pageNum = i + 1
                          } else if (currentPage <= 3) {
                            pageNum = i + 1
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i
                          } else {
                            pageNum = currentPage - 2 + i
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              disabled={loading}
                              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'border border-gray-300 hover:bg-gray-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages || loading}
                        className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        التالي
                        <ChevronLeftIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <ClockIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                لا توجد أنشطة
              </h3>
              <p className="text-gray-500">
                {filterType !== 'ALL' || dateRange !== 'ALL' 
                  ? 'لا توجد أنشطة تطابق الفلاتر المحددة' 
                  : 'لم تقم بأي نشاط بعد'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

// Missing icons import
import { ChartBarIcon, CalendarIcon } from '@heroicons/react/24/outline'

export default withAuth(ActivitiesPage)
