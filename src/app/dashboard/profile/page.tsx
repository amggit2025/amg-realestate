'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
  CameraIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  ClockIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline'
import { useAuth, withAuth } from '@/lib/AuthContext'

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  userType: string
  verified: boolean
  emailVerified: boolean
  phoneVerified: boolean
  createdAt: string
  avatar?: string
}

function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userType: 'INDIVIDUAL',
    verified: false,
    emailVerified: false,
    phoneVerified: false,
    createdAt: ''
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        userType: user.userType || 'INDIVIDUAL',
        verified: user.verified || false,
        emailVerified: (user as any).emailVerified || false,
        phoneVerified: (user as any).phoneVerified || false,
        createdAt: user.createdAt || '',
        avatar: user.avatar
      })
    }
  }, [user])

  const handleSave = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'update_profile',
          data: {
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            phone: profileData.phone,
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        alert('تم تحديث الملف الشخصي بنجاح')
        window.location.reload()
        setIsEditing(false)
      } else {
        const error = await response.json()
        alert(error.message || 'حدث خطأ أثناء التحديث')
      }
    } catch (error) {
      logger.error('Error updating profile:', error)
      alert('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'BROKER': return 'وسيط عقاري'
      case 'DEVELOPER': return 'مطور عقاري'
      case 'AGENCY': return 'وكالة عقارية'
      case 'INDIVIDUAL': return 'مستخدم فردي'
      default: return 'غير محدد'
    }
  }

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case 'BROKER': return <ShieldCheckIcon className="h-5 w-5" />
      case 'DEVELOPER': return <BuildingOfficeIcon className="h-5 w-5" />
      case 'AGENCY': return <BuildingOfficeIcon className="h-5 w-5" />
      case 'INDIVIDUAL': return <UserIcon className="h-5 w-5" />
      default: return <UserIcon className="h-5 w-5" />
    }
  }

  const getUserTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'BROKER': return 'from-blue-500 to-blue-600'
      case 'DEVELOPER': return 'from-purple-500 to-purple-600'
      case 'AGENCY': return 'from-green-500 to-green-600'
      case 'INDIVIDUAL': return 'from-gray-500 to-gray-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Header with Cover */}
        <motion.div 
          className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl overflow-hidden mb-8 mt-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>
          
          <div className="relative px-8 py-12">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
              {/* Profile Avatar & Info */}
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                {/* Avatar with Animation */}
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                    {profileData.avatar ? (
                      <img 
                        src={profileData.avatar} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-5xl">
                          {profileData.firstName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Verified Badge */}
                  {profileData.verified && (
                    <motion.div 
                      className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      <CheckCircleIcon className="h-6 w-6" />
                    </motion.div>
                  )}
                </motion.div>
                
                {/* Name & Type */}
                <div className="text-center md:text-right text-white">
                  <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 justify-center md:justify-start">
                    {profileData.firstName} {profileData.lastName}
                    {profileData.verified && (
                      <SparklesIcon className="h-7 w-7 text-yellow-300" />
                    )}
                  </h1>
                  
                  <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${getUserTypeBadgeColor(profileData.userType)} text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-3`}>
                    {getUserTypeIcon(profileData.userType)}
                    {getUserTypeLabel(profileData.userType)}
                  </div>
                  
                  <div className="flex items-center gap-4 justify-center md:justify-start text-white/90">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="text-sm">
                        عضو منذ {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' }) : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Edit Button */}
              <motion.button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-xl flex items-center gap-2 transform hover:scale-105"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <PencilIcon className="h-5 w-5" />
                {isEditing ? 'إلغاء التعديل' : 'تعديل الملف الشخصي'}
              </motion.button>
            </div>
          </div>
        </motion.div>


        {/* Profile Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Personal Information Card */}
          <motion.div 
            className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <UserIcon className="h-5 w-5 text-white" />
                </div>
                المعلومات الشخصية
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <IdentificationIcon className="h-4 w-4 text-gray-500" />
                    الاسم الأول
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({...prev, firstName: e.target.value}))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="أدخل الاسم الأول"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      <p className="text-gray-900 font-medium">{profileData.firstName}</p>
                    </div>
                  )}
                </div>
                
                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <IdentificationIcon className="h-4 w-4 text-gray-500" />
                    الاسم الأخير
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({...prev, lastName: e.target.value}))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="أدخل الاسم الأخير"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      <p className="text-gray-900 font-medium">{profileData.lastName}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Email Field */}
              <div className="group">
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <EnvelopeIcon className="h-4 w-4 text-gray-500" />
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <div className="px-4 py-3 bg-gray-50 rounded-xl flex items-center justify-between">
                    <p className="text-gray-900 font-medium">{profileData.email}</p>
                    <div className="flex items-center gap-2">
                      {profileData.emailVerified ? (
                        <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          <CheckCircleIcon className="h-4 w-4" />
                          موثق
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                          <XCircleIcon className="h-4 w-4" />
                          غير موثق
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Phone Field */}
              <div className="group">
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 text-gray-500" />
                  رقم الهاتف
                </label>
                <div className="relative">
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({...prev, phone: e.target.value}))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="01xxxxxxxxx"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      <p className="text-gray-900 font-medium">{profileData.phone || 'غير محدد'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            {isEditing && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
                <motion.button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <ClockIcon className="h-5 w-5 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5" />
                      حفظ التغييرات
                    </>
                  )}
                </motion.button>
                <motion.button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  إلغاء
                </motion.button>
              </div>
            )}
          </motion.div>
          
          {/* Sidebar - Account Stats & Verification */}
          <div className="space-y-6">
            
            {/* Verification Status Card */}
            <motion.div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                    <ShieldCheckIcon className="h-5 w-5 text-white" />
                  </div>
                  حالة التوثيق
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Main Verification */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <span className="text-sm font-semibold text-gray-700">حالة الحساب</span>
                  {profileData.verified ? (
                    <span className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      <CheckCircleIcon className="h-5 w-5" />
                      موثق
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      <XCircleIcon className="h-5 w-5" />
                      غير موثق
                    </span>
                  )}
                </div>
                
                {/* Email Verification */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                  <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4" />
                    البريد الإلكتروني
                  </span>
                  {profileData.emailVerified ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircleIcon className="h-6 w-6 text-red-600" />
                  )}
                </div>
              </div>
              
              {!profileData.verified && (
                <div className="p-4 bg-yellow-50 border-t border-yellow-200">
                  <p className="text-yellow-800 text-sm font-medium">
                    💡 لتوثيق حسابك، يرجى التواصل مع فريق الدعم.
                  </p>
                </div>
              )}
            </motion.div>
            
            {/* Account Info Card */}
            <motion.div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg">
                    <ClockIcon className="h-5 w-5 text-white" />
                  </div>
                  معلومات الحساب
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm font-semibold text-gray-700">نوع الحساب</span>
                  <span className={`bg-gradient-to-r ${getUserTypeBadgeColor(profileData.userType)} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                    {getUserTypeLabel(profileData.userType)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm font-semibold text-gray-700">تاريخ الانضمام</span>
                  <span className="text-sm text-gray-600 font-medium">
                    {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString('ar-EG') : 'غير محدد'}
                  </span>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAuth(ProfilePage)