'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  ArrowPathIcon
} from '@heroicons/react/24/outline'

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

interface RecentActivitiesProps {
  limit?: number
  showStats?: boolean
  className?: string
}

export default function RecentActivities({ 
  limit = 10, 
  showStats = false, 
  className = '' 
}: RecentActivitiesProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [stats, setStats] = useState<Record<string, number> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
        limit: limit.toString(),
        offset: '0'
      })

      if (showStats) {
        params.append('stats', 'true')
      }

      const response = await fetch(`/api/user/activities?${params}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setActivities(data.data.activities || [])
        if (data.data.stats) {
          setStats(data.data.stats)
        }
        setError('')
      } else {
        setError('حدث خطأ أثناء جلب الأنشطة')
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [limit, showStats])

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
        month: 'short',
        day: 'numeric'
      })
    }
  }

  if (loading && activities.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ClockIcon className="h-5 w-5 ml-2 text-gray-500" />
            النشاط الأخير
          </h3>
        </div>
        <div className="text-center py-8">
          <ArrowPathIcon className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600 text-sm">جاري تحميل الأنشطة...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ClockIcon className="h-5 w-5 ml-2 text-gray-500" />
          النشاط الأخير
        </h3>
        {activities.length > 0 && (
          <button
            onClick={fetchActivities}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center transition-colors"
            disabled={loading}
          >
            <ArrowPathIcon className={`h-4 w-4 ml-1 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex-shrink-0">
          {error}
        </div>
      )}

      {/* Activities List - مع Scroll */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activities.length > 0 ? (
          <>
            <div className="space-y-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 px-1">
              {activities.map((activity, index) => {
                const IconComponent = iconMap[activity.icon] || InformationCircleIcon
                
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* Activity Icon */}
                    <div className={`flex-shrink-0 p-2 rounded-full ${activity.bgColor}`}>
                      <IconComponent className={`h-4 w-4 ${activity.color}`} />
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.title}
                        </p>
                        <span className="text-xs text-gray-500 flex-shrink-0 mr-2">
                          {formatDate(activity.createdAt)}
                        </span>
                      </div>
                      
                      {activity.description && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {activity.description}
                        </p>
                      )}

                      {/* Metadata */}
                      {activity.metadata && (
                        <div className="mt-2">
                          {activity.type === 'PROPERTY_CREATE' && activity.metadata.propertyType && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {activity.metadata.propertyType}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* View All Button - ثابت في الأسفل */}
            {activities.length >= limit && (
              <div className="mt-4 pt-4 border-t border-gray-200 text-center flex-shrink-0">
                <a href="/dashboard/activities" className="inline-block text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors hover:underline">
                  عرض جميع الأنشطة ←
                </a>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 flex-1 flex flex-col items-center justify-center">
            <ClockIcon className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-600 text-sm">لا توجد أنشطة حديثة</p>
            <p className="text-gray-500 text-xs mt-1">
              ستظهر هنا أنشطتك الأخيرة عند استخدام الموقع
            </p>
          </div>
        )}
      </div>

      {/* Stats Summary (إن كان مطلوب) */}
      {showStats && stats && Object.keys(stats).length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 flex-shrink-0">
          <h4 className="text-sm font-medium text-gray-700 mb-3">إحصائيات آخر 30 يوم</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(stats).slice(0, 4).map(([type, count]) => (
              <div key={type} className="text-center">
                <div className="text-lg font-semibold text-gray-900">{count}</div>
                <div className="text-xs text-gray-500">
                  {getActivityTypeLabel(type)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// دالة مساعدة لترجمة أنواع الأنشطة
function getActivityTypeLabel(type: string): string {
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