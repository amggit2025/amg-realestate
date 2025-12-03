// ======================================================
// 📊 AMG Real Estate - Advanced Admin Dashboard
// ======================================================
'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  UsersIcon,
  HomeIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftEllipsisIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon
} from '@heroicons/react/24/outline'

// Charts will be implemented with simple data visualization components

// أنواع البيانات
interface Statistics {
  overview: {
    totalUsers: number
    totalProperties: number
    totalActivities: number
    totalInquiries: number
    totalViews: number
    totalFavorites: number
    averagePrice: number
  }
  growth: {
    usersThisMonth: number
    propertiesThisMonth: number
    activitiesLast7Days: number
    userGrowthRate: number
    propertyGrowthRate: number
  }
  kpis: {
    conversionRate: number
    userEngagementRate: number
    verificationRate: number
    averagePropertiesPerUser: number
  }
  users: {
    byType: Record<string, number>
    verified: number
    active: number
    growthChart: Array<{ createdAt: string; _count: { createdAt: number } }>
  }
  properties: {
    byStatus: Record<string, number>
    byType: Record<string, number>
    byCities: Array<{ city: string; _count: { city: number } }>
    topViewed: Array<{ id: string; title: string; views: number; createdAt: string }>
    growthChart: Array<{ createdAt: string; _count: { createdAt: number } }>
  }
  activities: {
    byType: Record<string, number>
    recent: Array<{
      id: string
      type: string
      title: string
      description: string
      user: { firstName: string; lastName: string; email: string }
      createdAt: string
    }>
    mostActive: Array<{
      userId: string
      _count: { userId: number }
      user: { id: string; firstName: string; lastName: string; email: string }
    }>
  }
  inquiries: {
    byStatus: Record<string, number>
    monthlyChart: Array<{ createdAt: string; _count: { createdAt: number } }>
    total: number
  }
  comparisons: {
    lastMonthUsers: number
    lastMonthProperties: number
    last7DaysActivities: number
  }
}

const AdvancedAdminDashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [refreshing, setRefreshing] = useState(false)

  // جلب الإحصائيات
  const fetchStatistics = async () => {
    try {
      setLoading(true)
      
      // الحصول على session token
      const session = localStorage.getItem('amg_admin_session')
      if (!session) {
        throw new Error('لا يوجد token للمصادقة')
      }
      
      const sessionData = JSON.parse(session)
      
      const response = await fetch('/api/admin/statistics', {
        headers: {
          'Authorization': `Bearer ${sessionData.token || 'admin-session'}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()

      if (data.success) {
        setStatistics(data.data)
        setError('')
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('❌ Statistics fetch error:', error)
      setError('فشل في جلب الإحصائيات')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // تحديث الإحصائيات
  const refreshStatistics = async () => {
    setRefreshing(true)
    await fetchStatistics()
  }

  // تحميل البيانات عند بداية التحميل
  useEffect(() => {
    fetchStatistics()
  }, [])

  // Utility function لتنسيق الأرقام
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'مليون'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'ألف'
    }
    return num.toLocaleString('ar-EG')
  }

  // Utility function لتنسيق العملة
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // شاشة التحميل
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الإحصائيات المتقدمة...</p>
        </div>
      </div>
    )
  }

  // شاشة الخطأ
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-xl font-semibold text-gray-700 mb-2">خطأ في تحميل البيانات</h1>
          <p className="text-gray-500 mb-6">{error}</p>
          <button 
            onClick={fetchStatistics}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    )
  }

  if (!statistics) return null

  // تبويبات Dashboard
  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: ChartBarIcon },
    { id: 'users', label: 'المستخدمون', icon: UsersIcon },
    { id: 'properties', label: 'العقارات', icon: HomeIcon },
    { id: 'activities', label: 'الأنشطة', icon: GlobeAltIcon },
    { id: 'analytics', label: 'التحليلات', icon: ArrowTrendingUpIcon }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم المتقدمة</h1>
              <p className="text-gray-600">إحصائيات شاملة ومؤشرات أداء تفصيلية</p>
            </div>
            <button
              onClick={refreshStatistics}
              disabled={refreshing}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {refreshing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <ArrowUpIcon className="h-4 w-4" />
              )}
              <span>{refreshing ? 'جاري التحديث...' : 'تحديث'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* KPI Cards - العرض السريع */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* إجمالي المستخدمين */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(statistics.overview.totalUsers)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {statistics.growth.userGrowthRate >= 0 ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ${
                    statistics.growth.userGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(statistics.growth.userGrowthRate)}% هذا الشهر
                  </span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          {/* إجمالي العقارات */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي العقارات</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(statistics.overview.totalProperties)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {statistics.growth.propertyGrowthRate >= 0 ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ${
                    statistics.growth.propertyGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(statistics.growth.propertyGrowthRate)}% هذا الشهر
                  </span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <HomeIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          {/* إجمالي المشاهدات */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المشاهدات</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(statistics.overview.totalViews)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-blue-600">
                    {Math.round(statistics.kpis.userEngagementRate)}% معدل التفاعل
                  </span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <EyeIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          {/* معدل التحويل */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">معدل التحويل</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.kpis.conversionRate.toFixed(1)}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    {statistics.overview.totalInquiries} استفسار
                  </span>
                </div>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <ChartBarIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-t-xl shadow-sm border">
          <div className="flex border-b overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-xl shadow-sm border-t-0 border">
          {/* نظرة عامة */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* مؤشرات الأداء الرئيسية */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">مؤشرات الأداء الرئيسية</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <UsersIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">معدل التحقق</p>
                          <p className="text-sm text-gray-600">نسبة المستخدمين المحققين</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">{statistics.kpis.verificationRate.toFixed(1)}%</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <HomeIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">متوسط العقارات لكل مستخدم</p>
                          <p className="text-sm text-gray-600">معدل النشاط العقاري</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-green-600">{statistics.kpis.averagePropertiesPerUser}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">معدل الاستفسارات</p>
                          <p className="text-sm text-gray-600">نسبة الاستفسارات للعقارات</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-purple-600">{statistics.kpis.conversionRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* الإحصائيات السريعة */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">إحصائيات سريعة</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
                      <HeartIcon className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{formatNumber(statistics.overview.totalFavorites)}</p>
                      <p className="text-sm opacity-90">إعجابات</p>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg">
                      <CalendarIcon className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{statistics.growth.activitiesLast7Days}</p>
                      <p className="text-sm opacity-90">نشاط هذا الأسبوع</p>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg">
                      <CurrencyDollarIcon className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-xl font-bold">{formatCurrency(statistics.overview.averagePrice)}</p>
                      <p className="text-sm opacity-90">متوسط السعر</p>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg">
                      <ClockIcon className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{statistics.users.active}</p>
                      <p className="text-sm opacity-90">مستخدم نشط</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* الأنشطة الأخيرة */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">آخر الأنشطة</h3>
                <div className="space-y-3">
                  {statistics.activities.recent.slice(0, 5).map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <GlobeAltIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <p className="text-sm text-gray-600">
                            {activity.user.firstName} {activity.user.lastName}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.createdAt).toLocaleDateString('ar-EG')}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* المستخدمون */}
          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* إحصائيات المستخدمين */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">توزيع المستخدمين</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      {Object.entries(statistics.users.byType).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full ${type === 'INDIVIDUAL' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                            <span>{type === 'INDIVIDUAL' ? 'أفراد' : 'شركات'}</span>
                          </div>
                          <span className="font-bold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* إحصائيات التحقق */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">حالة التحقق</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                        <span className="font-medium">محقق</span>
                      </div>
                      <span className="text-xl font-bold text-green-600">{statistics.users.verified}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
                        <span className="font-medium">غير محقق</span>
                      </div>
                      <span className="text-xl font-bold text-yellow-600">
                        {statistics.overview.totalUsers - statistics.users.verified}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <ClockIcon className="h-6 w-6 text-blue-500" />
                        <span className="font-medium">نشط</span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">{statistics.users.active}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* المستخدمون الأكثر نشاطاً */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">المستخدمون الأكثر نشاطاً</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {statistics.activities.mostActive.slice(0, 6).map((activeUser, index) => (
                    <div key={activeUser.userId} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <UserIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {activeUser.user?.firstName} {activeUser.user?.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{activeUser.user?.email}</p>
                        </div>
                      </div>
                      <p className="text-right">
                        <span className="text-xl font-bold text-blue-600">{activeUser._count.userId}</span>
                        <span className="text-sm text-gray-600 mr-1">نشاط</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* العقارات */}
          {activeTab === 'properties' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* توزيع العقارات حسب الحالة */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">توزيع العقارات حسب الحالة</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      {Object.entries(statistics.properties.byStatus).map(([status, count]) => {
                        const statusNames: Record<string, string> = {
                          'ACTIVE': 'نشطة',
                          'PENDING': 'في الانتظار', 
                          'SOLD': 'مباعة',
                          'RENTED': 'مؤجرة',
                          'DRAFT': 'مسودة'
                        }
                        const colors: Record<string, string> = {
                          'ACTIVE': 'bg-green-500',
                          'PENDING': 'bg-yellow-500',
                          'SOLD': 'bg-blue-500', 
                          'RENTED': 'bg-purple-500',
                          'DRAFT': 'bg-gray-500'
                        }
                        return (
                          <div key={status} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full ${colors[status]}`}></div>
                              <span>{statusNames[status] || status}</span>
                            </div>
                            <span className="font-bold">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* أفضل المدن */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">أفضل المدن</h3>
                  <div className="space-y-3">
                    {statistics.properties.byCities.slice(0, 8).map((city, index) => (
                      <div key={city.city} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <MapPinIcon className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">{city.city}</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">{city._count.city}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* العقارات الأكثر مشاهدة */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">العقارات الأكثر مشاهدة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {statistics.properties.topViewed.map((property) => (
                    <div key={property.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{property.title}</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <EyeIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{formatNumber(property.views)} مشاهدة</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(property.createdAt).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* الأنشطة */}
          {activeTab === 'activities' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* توزيع الأنشطة */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">توزيع الأنشطة</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      {Object.entries(statistics.activities.byType).map(([type, count]) => {
                        const typeNames: Record<string, string> = {
                          'PROPERTY_CREATE': 'إضافة عقار',
                          'PROPERTY_UPDATE': 'تحديث عقار', 
                          'PROPERTY_VIEW': 'مشاهدة عقار',
                          'LOGIN': 'تسجيل دخول',
                          'PROFILE_UPDATE': 'تحديث ملف شخصي'
                        }
                        const maxCount = Math.max(...Object.values(statistics.activities.byType))
                        const percentage = (count / maxCount) * 100
                        return (
                          <div key={type} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>{typeNames[type] || type}</span>
                              <span className="font-bold">{count}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* الأنشطة الأخيرة */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">الأنشطة الأخيرة</h3>
                  <div className="max-h-80 overflow-y-auto space-y-3">
                    {statistics.activities.recent.map((activity, index) => (
                      <div key={activity.id} className="p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{activity.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {activity.user.firstName} {activity.user.lastName}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {new Date(activity.createdAt).toLocaleDateString('ar-EG')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* التحليلات */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* نمو المستخدمين */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">نمو المستخدمين (30 يوم)</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-2">نمو المستخدمين الجدد</p>
                      <p className="text-3xl font-bold text-blue-600">{statistics.growth.usersThisMonth}</p>
                      <p className="text-sm text-gray-500">مستخدم جديد هذا الشهر</p>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                        <span className="text-green-600">{statistics.growth.userGrowthRate.toFixed(1)}% نمو</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* نمو العقارات */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">نمو العقارات (30 يوم)</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-2">نمو العقارات الجديدة</p>
                      <p className="text-3xl font-bold text-green-600">{statistics.growth.propertiesThisMonth}</p>
                      <p className="text-sm text-gray-500">عقار جديد هذا الشهر</p>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                        <span className="text-green-600">{statistics.growth.propertyGrowthRate.toFixed(1)}% نمو</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* مقاييس الأداء المتقدمة */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">مقاييس الأداء المتقدمة</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl">
                    <h4 className="font-medium mb-2">معدل التفاعل</h4>
                    <p className="text-3xl font-bold">{statistics.kpis.userEngagementRate.toFixed(1)}%</p>
                    <p className="text-sm opacity-90 mt-1">نشاط المستخدمين الأسبوعي</p>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl">
                    <h4 className="font-medium mb-2">معدل التحقق</h4>
                    <p className="text-3xl font-bold">{statistics.kpis.verificationRate.toFixed(1)}%</p>
                    <p className="text-sm opacity-90 mt-1">من إجمالي المستخدمين</p>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl">
                    <h4 className="font-medium mb-2">متوسط العقارات</h4>
                    <p className="text-3xl font-bold">{statistics.kpis.averagePropertiesPerUser}</p>
                    <p className="text-sm opacity-90 mt-1">لكل مستخدم</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdvancedAdminDashboard