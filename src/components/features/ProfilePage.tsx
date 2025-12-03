// ======================================================
// 👤 AMG Real Estate - Profile Page
// ======================================================
'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  CalendarIcon,
  PencilIcon,
  CameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftEllipsisIcon,
  HomeIcon,
  ChevronRightIcon,
  KeyIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid'
import { useAuth } from '@/lib/AuthContext'

// أنواع البيانات
interface UserProfile {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string | null
  avatar: string | null
  userType: 'INDIVIDUAL' | 'COMPANY'
  verified: boolean
  emailVerified: boolean
  phoneVerified: boolean
  active: boolean
  memberSince: string
  lastUpdated: string
  stats: {
    properties: {
      total: number
      active: number
      pending: number
      sold: number
      rented: number
      totalViews: number
      totalFavorites: number
      totalInquiries: number
    }
    favorites: number
    inquiries: number
  }
  recentProperties: Array<{
    id: string
    title: string
    status: string
    views: number
    favorites: number
    inquiries: number
    createdAt: string
  }>
}

interface ProfileFormData {
  firstName: string
  lastName: string
  phone: string
  userType: 'INDIVIDUAL' | 'COMPANY'
}

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    userType: 'INDIVIDUAL'
  })
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [submitting, setSubmitting] = useState(false)

  // جلب بيانات الملف الشخصي
  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/profile')
      const data = await response.json()

      if (data.success) {
        setProfile(data.data)
        setProfileForm({
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          phone: data.data.phone || '',
          userType: data.data.userType
        })
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('❌ Profile fetch error:', error)
      setMessage({ type: 'error', text: 'فشل في جلب بيانات الملف الشخصي' })
    } finally {
      setLoading(false)
    }
  }

  // تحديث الملف الشخصي
  const updateProfile = async () => {
    try {
      setSubmitting(true)
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          data: profileForm
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage({ type: 'success', text: data.message })
        setIsEditing(false)
        await fetchProfile()
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('❌ Profile update error:', error)
      setMessage({ type: 'error', text: 'فشل في تحديث الملف الشخصي' })
    } finally {
      setSubmitting(false)
    }
  }

  // تغيير كلمة المرور
  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'كلمات المرور غير متطابقة' })
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_password',
          data: passwordForm
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage({ type: 'success', text: data.message })
        setIsChangingPassword(false)
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('❌ Password change error:', error)
      setMessage({ type: 'error', text: 'فشل في تغيير كلمة المرور' })
    } finally {
      setSubmitting(false)
    }
  }

  // تحميل البيانات عند بداية التحميل
  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  // إخفاء الرسائل بعد وقت
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  // التحقق من تسجيل الدخول
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <UserIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-xl font-semibold text-gray-700 mb-2">يجب تسجيل الدخول</h1>
          <p className="text-gray-500 mb-6">يرجى تسجيل الدخول للوصول إلى ملفك الشخصي</p>
          <Link 
            href="/auth/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    )
  }

  // شاشة التحميل
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    )
  }

  // إذا لم يتم جلب البيانات
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-xl font-semibold text-gray-700 mb-2">خطأ في تحميل البيانات</h1>
          <p className="text-gray-500 mb-6">تعذر تحميل بيانات الملف الشخصي</p>
          <button 
            onClick={fetchProfile}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    )
  }

  // حساب معدل النشاط
  const getActivityScore = () => {
    const { properties, favorites, inquiries } = profile.stats
    const score = (properties.total * 10) + (favorites * 2) + (inquiries * 5)
    return Math.min(score, 100)
  }

  // تبويبات الصفحة
  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: UserIcon },
    { id: 'properties', label: 'عقاراتي', icon: HomeIcon },
    { id: 'settings', label: 'الإعدادات', icon: PencilIcon },
    { id: 'security', label: 'الأمان', icon: ShieldCheckIcon }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">الملف الشخصي</h1>
              <p className="text-gray-600">إدارة معلوماتك الشخصية وإعداداتك</p>
            </div>
          </div>
        </div>
      </div>

      {/* رسائل التنبيه */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircleIcon className="h-5 w-5" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        </motion.div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Profile Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  {profile.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={profile.fullName}
                      width={100}
                      height={100}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <CameraIcon className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{profile.fullName}</h2>
                <p className="text-gray-600 flex items-center justify-center gap-1">
                  {profile.userType === 'COMPANY' ? (
                    <BuildingOfficeIcon className="h-4 w-4" />
                  ) : (
                    <UserCircleIcon className="h-4 w-4" />
                  )}
                  {profile.userType === 'COMPANY' ? 'شركة' : 'فرد'}
                </p>
              </div>

              {/* Status Badges */}
              <div className="space-y-2 mb-6">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  profile.verified ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {profile.verified ? (
                    <CheckCircleSolid className="h-4 w-4" />
                  ) : (
                    <ExclamationTriangleIcon className="h-4 w-4" />
                  )}
                  <span className="text-sm">
                    {profile.verified ? 'محقق' : 'غير محقق'}
                  </span>
                </div>
                
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  profile.emailVerified ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'
                }`}>
                  <EnvelopeIcon className="h-4 w-4" />
                  <span className="text-sm">
                    {profile.emailVerified ? 'البريد محقق' : 'البريد غير محقق'}
                  </span>
                </div>

                {profile.phone && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    profile.phoneVerified ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'
                  }`}>
                    <PhoneIcon className="h-4 w-4" />
                    <span className="text-sm">
                      {profile.phoneVerified ? 'الهاتف محقق' : 'الهاتف غير محقق'}
                    </span>
                  </div>
                )}
              </div>

              {/* Activity Score */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">معدل النشاط</h3>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getActivityScore()}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{getActivityScore()}% نشط</p>
              </div>

              {/* Member Since */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4" />
                <span>عضو منذ {new Date(profile.memberSince).toLocaleDateString('ar-EG')}</span>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs Navigation */}
            <div className="bg-white rounded-t-xl shadow-sm">
              <div className="flex border-b">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-xl shadow-sm">
              {/* نظرة عامة */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6"
                >
                  {/* إحصائيات العقارات */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">إحصائيات العقارات</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <HomeIcon className="h-5 w-5 text-blue-600" />
                          <span className="text-sm text-blue-600 font-medium">إجمالي العقارات</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">{profile.stats.properties.total}</p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <EyeIcon className="h-5 w-5 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">المشاهدات</span>
                        </div>
                        <p className="text-2xl font-bold text-green-900">{profile.stats.properties.totalViews}</p>
                      </div>

                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <HeartIcon className="h-5 w-5 text-red-600" />
                          <span className="text-sm text-red-600 font-medium">الإعجابات</span>
                        </div>
                        <p className="text-2xl font-bold text-red-900">{profile.stats.properties.totalFavorites}</p>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-purple-600" />
                          <span className="text-sm text-purple-600 font-medium">الاستفسارات</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-900">{profile.stats.properties.totalInquiries}</p>
                      </div>
                    </div>

                    {/* تفاصيل حالة العقارات */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-sm text-gray-600">نشطة</p>
                        <p className="text-lg font-semibold text-green-600">{profile.stats.properties.active}</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-sm text-gray-600">في الانتظار</p>
                        <p className="text-lg font-semibold text-yellow-600">{profile.stats.properties.pending}</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-sm text-gray-600">مباعة</p>
                        <p className="text-lg font-semibold text-blue-600">{profile.stats.properties.sold}</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-sm text-gray-600">مؤجرة</p>
                        <p className="text-lg font-semibold text-purple-600">{profile.stats.properties.rented}</p>
                      </div>
                    </div>
                  </div>

                  {/* أحدث العقارات */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">أحدث عقاراتك</h3>
                      <Link 
                        href="/dashboard/properties"
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                      >
                        <span>عرض الكل</span>
                        <ChevronRightIcon className="h-4 w-4" />
                      </Link>
                    </div>

                    {profile.recentProperties.length > 0 ? (
                      <div className="space-y-3">
                        {profile.recentProperties.map((property) => (
                          <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div>
                              <h4 className="font-medium text-gray-900">{property.title}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(property.createdAt).toLocaleDateString('ar-EG')}
                              </p>
                            </div>
                            <div className="text-left">
                              <p className={`text-sm px-2 py-1 rounded ${
                                property.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                property.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {property.status === 'ACTIVE' ? 'نشط' : 
                                 property.status === 'PENDING' ? 'في الانتظار' : property.status}
                              </p>
                              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                <span>{property.views} مشاهدة</span>
                                <span>{property.favorites} إعجاب</span>
                                <span>{property.inquiries} استفسار</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <HomeIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>لم تضف أي عقارات بعد</p>
                        <Link 
                          href="/dashboard/properties/new"
                          className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
                        >
                          أضف عقارك الأول
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* عقاراتي */}
              {activeTab === 'properties' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">إدارة العقارات</h3>
                    <Link 
                      href="/dashboard/properties/new"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      إضافة عقار جديد
                    </Link>
                  </div>

                  {/* إحصائيات سريعة */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-semibold mb-2">إجمالي العقارات</h4>
                      <p className="text-3xl font-bold">{profile.stats.properties.total}</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-semibold mb-2">إجمالي المشاهدات</h4>
                      <p className="text-3xl font-bold">{profile.stats.properties.totalViews}</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                      <h4 className="text-lg font-semibold mb-2">إجمالي الاستفسارات</h4>
                      <p className="text-3xl font-bold">{profile.stats.properties.totalInquiries}</p>
                    </div>
                  </div>

                  <div className="text-center py-8">
                    <Link 
                      href="/dashboard"
                      className="text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2"
                    >
                      <HomeIcon className="h-5 w-5" />
                      <span>انتقل إلى لوحة التحكم لإدارة العقارات</span>
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* الإعدادات */}
              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6"
                >
                  <div className="max-w-2xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">إعدادات الحساب</h3>

                    {!isEditing ? (
                      <div className="space-y-6">
                        {/* معلومات أساسية */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-4">المعلومات الأساسية</h4>
                          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">الاسم الأول:</span>
                              <span className="font-medium">{profile.firstName}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">الاسم الأخير:</span>
                              <span className="font-medium">{profile.lastName}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">البريد الإلكتروني:</span>
                              <span className="font-medium">{profile.email}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">رقم الهاتف:</span>
                              <span className="font-medium">{profile.phone || 'غير محدد'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">نوع الحساب:</span>
                              <span className="font-medium">
                                {profile.userType === 'COMPANY' ? 'شركة' : 'فرد'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <PencilIcon className="h-5 w-5" />
                          <span>تعديل المعلومات</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <h4 className="font-medium text-gray-900">تعديل المعلومات الأساسية</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              الاسم الأول *
                            </label>
                            <input
                              type="text"
                              value={profileForm.firstName}
                              onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              الاسم الأخير *
                            </label>
                            <input
                              type="text"
                              value={profileForm.lastName}
                              onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            رقم الهاتف
                          </label>
                          <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="مثال: 01234567890"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            نوع الحساب *
                          </label>
                          <select
                            value={profileForm.userType}
                            onChange={(e) => setProfileForm({ ...profileForm, userType: e.target.value as 'INDIVIDUAL' | 'COMPANY' })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="INDIVIDUAL">فرد</option>
                            <option value="COMPANY">شركة</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-4">
                          <button
                            onClick={updateProfile}
                            disabled={submitting}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {submitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                          </button>
                          <button
                            onClick={() => {
                              setIsEditing(false)
                              setProfileForm({
                                firstName: profile.firstName,
                                lastName: profile.lastName,
                                phone: profile.phone || '',
                                userType: profile.userType
                              })
                            }}
                            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* الأمان */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6"
                >
                  <div className="max-w-2xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">إعدادات الأمان</h3>

                    {!isChangingPassword ? (
                      <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">كلمة المرور</h4>
                              <p className="text-sm text-gray-600">آخر تحديث: {new Date(profile.lastUpdated).toLocaleDateString('ar-EG')}</p>
                            </div>
                            <button
                              onClick={() => setIsChangingPassword(true)}
                              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <KeyIcon className="h-4 w-4" />
                              <span>تغيير كلمة المرور</span>
                            </button>
                          </div>
                        </div>

                        {/* حالة التحقق */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-4">حالة التحقق</h4>
                          <div className="space-y-3">
                            <div className={`flex items-center justify-between p-3 rounded-lg ${
                              profile.emailVerified ? 'bg-green-50' : 'bg-red-50'
                            }`}>
                              <div className="flex items-center gap-2">
                                <EnvelopeIcon className={`h-5 w-5 ${
                                  profile.emailVerified ? 'text-green-600' : 'text-red-600'
                                }`} />
                                <span className="font-medium">البريد الإلكتروني</span>
                              </div>
                              <span className={`text-sm ${
                                profile.emailVerified ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {profile.emailVerified ? 'محقق' : 'غير محقق'}
                              </span>
                            </div>

                            {profile.phone && (
                              <div className={`flex items-center justify-between p-3 rounded-lg ${
                                profile.phoneVerified ? 'bg-green-50' : 'bg-red-50'
                              }`}>
                                <div className="flex items-center gap-2">
                                  <PhoneIcon className={`h-5 w-5 ${
                                    profile.phoneVerified ? 'text-green-600' : 'text-red-600'
                                  }`} />
                                  <span className="font-medium">رقم الهاتف</span>
                                </div>
                                <span className={`text-sm ${
                                  profile.phoneVerified ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {profile.phoneVerified ? 'محقق' : 'غير محقق'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <h4 className="font-medium text-gray-900">تغيير كلمة المرور</h4>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              كلمة المرور الحالية *
                            </label>
                            <input
                              type="password"
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              كلمة المرور الجديدة *
                            </label>
                            <input
                              type="password"
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="يجب أن تكون على الأقل 8 أحرف"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              تأكيد كلمة المرور الجديدة *
                            </label>
                            <input
                              type="password"
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <button
                            onClick={changePassword}
                            disabled={submitting}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {submitting ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
                          </button>
                          <button
                            onClick={() => {
                              setIsChangingPassword(false)
                              setPasswordForm({
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: ''
                              })
                            }}
                            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                          >
                            إلغاء
                          </button>
                        </div>

                        {/* نصائح الأمان */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h5 className="font-medium text-blue-900 mb-2">نصائح لكلمة مرور قوية:</h5>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• استخدم على الأقل 8 أحرف</li>
                            <li>• امزج بين الحروف الكبيرة والصغيرة</li>
                            <li>• أضف أرقام ورموز خاصة</li>
                            <li>• تجنب استخدام معلومات شخصية</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage