'use client'

export const dynamic = 'force-dynamic'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { logger } from '@/lib/logger'
import { 
  ChartBarIcon,
  EyeIcon,
  UserIcon,
  PlusIcon,
  BuildingOfficeIcon,
  HomeIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'
import { useAuth, withAuth } from '@/lib/AuthContext'
import Link from 'next/link'
import RecentActivities from '@/components/features/RecentActivities'
import EmailVerificationBanner from '@/components/features/EmailVerificationBanner'

// تعريف نوع البيانات للعقار
interface Property {
  id: string
  title: string
  description: string
  price: number
  currency: string
  area: number
  bedrooms?: number
  bathrooms?: number
  city: string
  district: string
  propertyType: string
  purpose: string
  status: string
  views: number
  images?: Array<{ url: string }>
  _count: {
    favorites: number
    inquiries: number
  }
  createdAt: string
}

function DashboardPage() {
  const { user, stats } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loadingProperties, setLoadingProperties] = useState(true)
  const [deletingProperty, setDeletingProperty] = useState<string | null>(null)
  const [toggleStatus, setToggleStatus] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  // Filters & Search States
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('ALL')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [filterCity, setFilterCity] = useState<string>('ALL')

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const propertiesPerPage = 10

  // جلب عقارات المستخدم
  useEffect(() => {
    fetchUserProperties()
  }, [])

  // Filter & Search Effect
  useEffect(() => {
    let filtered = [...properties]

    // Search Filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.district.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Type Filter
    if (filterType !== 'ALL') {
      filtered = filtered.filter(p => p.propertyType === filterType)
    }

    // Status Filter
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(p => p.status === filterStatus)
    }

    // City Filter
    if (filterCity !== 'ALL') {
      filtered = filtered.filter(p => p.city === filterCity)
    }

    setFilteredProperties(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [properties, searchQuery, filterType, filterStatus, filterCity])

  // Get unique cities for filter
  const uniqueCities = Array.from(new Set(properties.map(p => p.city)))

  // Pagination calculations
  const indexOfLastProperty = currentPage * propertiesPerPage
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty)
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage)

  const fetchUserProperties = async () => {
    try {
      const response = await fetch('/api/properties', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties || [])
      }
    } catch (error) {
      logger.error('Error fetching properties:', error)
    } finally {
      setLoadingProperties(false)
    }
  }

  // دالة حذف العقار
  const handleDeleteProperty = async (propertyId: string) => {
    setShowDeleteConfirm(propertyId)
  }

  // تأكيد حذف العقار
  const confirmDeleteProperty = async (propertyId: string) => {
    setDeletingProperty(propertyId)
    try {
      logger.log('محاولة حذف العقار:', propertyId)
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      logger.log('استجابة الحذف:', response.status)

      if (response.ok) {
        // إزالة العقار من القائمة
        setProperties(prev => prev.filter(p => p.id !== propertyId))
        setShowDeleteConfirm(null)
        alert('تم حذف العقار بنجاح')
      } else {
        const errorData = await response.json()
        logger.error('خطأ في الحذف:', errorData)
        alert(errorData.message || 'حدث خطأ في حذف العقار')
      }
    } catch (error) {
      logger.error('خطأ في شبكة الاتصال:', error)
      alert('حدث خطأ في الاتصال بالخادم')
    } finally {
      setDeletingProperty(null)
    }
  }

  // دالة تبديل حالة العقار
  const handleToggleStatus = async (propertyId: string, currentStatus: string) => {
    setToggleStatus(propertyId)
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    
    try {
      logger.log('محاولة تغيير حالة العقار:', propertyId, 'من', currentStatus, 'إلى', newStatus)
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      logger.log('استجابة تغيير الحالة:', response.status)

      if (response.ok) {
        // تحديث حالة العقار في القائمة
        setProperties(prev => 
          prev.map(p => 
            p.id === propertyId 
              ? { ...p, status: newStatus }
              : p
          )
        )
        alert('تم تغيير حالة العقار بنجاح')
      } else {
        const errorData = await response.json()
        logger.error('خطأ في تغيير الحالة:', errorData)
        alert(errorData.message || 'حدث خطأ في تغيير حالة العقار')
      }
    } catch (error) {
      logger.error('خطأ في شبكة الاتصال:', error)
      alert('حدث خطأ في الاتصال بالخادم')
    } finally {
      setToggleStatus(null)
    }
  }

  // دالة لتنسيق السعر
  const formatPrice = (price: number, currency: string) => {
    const formatter = new Intl.NumberFormat('ar-EG')
    return `${formatter.format(price)} ${currency === 'EGP' ? 'ج.م' : '$'}`
  }

  // دالة لترجمة نوع العقار
  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      APARTMENT: 'شقة',
      VILLA: 'فيلا',
      OFFICE: 'مكتب',
      COMMERCIAL: 'تجاري',
      LAND: 'أرض',
    }
    return types[type] || type
  }

  // دالة لترجمة حالة العقار
  const getStatusLabel = (status: string) => {
    const statuses: Record<string, string> = {
      ACTIVE: 'نشط',
      SOLD: 'مباع',
      RENTED: 'مؤجر',
      PENDING: 'معلق',
      INACTIVE: 'غير نشط',
    }
    return statuses[status] || status
  }

  // دالة لألوان حالة العقار
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-800',
      SOLD: 'bg-red-100 text-red-800',
      RENTED: 'bg-blue-100 text-blue-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  // حساب الإحصائيات من العقارات الحقيقية
  const realStats = {
    totalProperties: properties.length,
    activeProperties: properties.filter(p => p.status === 'ACTIVE').length,
    totalViews: properties.reduce((sum, p) => sum + p.views, 0),
    totalInquiries: properties.reduce((sum, p) => sum + p._count.inquiries, 0),
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="container mx-auto px-4">
        {/* Email Verification Banner */}
        {user && !user.emailVerified && (
          <EmailVerificationBanner 
            email={user.email}
            isVerified={user.emailVerified}
            onVerificationSuccess={() => {
              // إعادة تحميل بيانات المستخدم
              window.location.reload()
            }}
          />
        )}

        {/* Breadcrumb Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2 mb-6 text-sm"
        >
          <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <HomeIcon className="w-4 h-4 ml-1" />
            الرئيسية
          </Link>
          <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-medium">الداشبورد</span>
        </motion.nav>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mb-16 rounded-3xl overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-teal-900/90">
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/85 to-teal-900/85"></div>
          </div>
          
          {/* Content */}
          <div className="relative text-center py-20 px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                مرحباً {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8 drop-shadow-md">
                إدارة حسابك وإعلاناتك العقارية بكل سهولة
              </p>
              
              {/* Dashboard Features */}
              <div className="flex justify-center items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <ChartBarIcon className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">إحصائيات</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <EyeIcon className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">المشاهدات</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <UserIcon className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">الملف الشخصي</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">{realStats.totalProperties}</div>
              <div className="mr-3 text-blue-600">🏠</div>
            </div>
            <p className="text-gray-600 text-sm mt-1">إجمالي العقارات</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-green-600">{realStats.activeProperties}</div>
              <div className="mr-3 text-green-600">✅</div>
            </div>
            <p className="text-gray-600 text-sm mt-1">العقارات النشطة</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-purple-600">{realStats.totalViews}</div>
              <div className="mr-3 text-purple-600">👁️</div>
            </div>
            <p className="text-gray-600 text-sm mt-1">إجمالي المشاهدات</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-orange-600">{realStats.totalInquiries}</div>
              <div className="mr-3 text-orange-600">📞</div>
            </div>
            <p className="text-gray-600 text-sm mt-1">الاستفسارات</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions - ارتفاع ثابت */}
          <div className="bg-white rounded-lg shadow p-6 h-[500px] flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-4">إجراءات سريعة</h2>
            <div className="space-y-3 flex-1">
              <Link href="/dashboard/add-property">
                <button className="w-full text-right p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-300">
                  <div className="flex items-center">
                    <PlusIcon className="w-5 h-5 text-blue-600 ml-3" />
                    <span className="font-medium">إضافة عقار جديد</span>
                  </div>
                </button>
              </Link>
              <Link href="/dashboard/properties">
                <button className="w-full text-right p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-300">
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="w-5 h-5 text-green-600 ml-3" />
                    <span className="font-medium">عرض عقاراتي</span>
                  </div>
                </button>
              </Link>
              <Link href="/dashboard/my-requests">
                <button className="w-full text-right p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors duration-300">
                  <div className="flex items-center">
                    <ClipboardDocumentListIcon className="w-5 h-5 text-amber-600 ml-3" />
                    <span className="font-medium">طلبات التسويق</span>
                  </div>
                </button>
              </Link>
              <Link href="/dashboard/settings">
                <button className="w-full text-right p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-300">
                  <div className="flex items-center">
                    <UserIcon className="w-5 h-5 text-purple-600 ml-3" />
                    <span className="font-medium">إعدادات الحساب</span>
                  </div>
                </button>
              </Link>
            </div>
          </div>

          {/* Recent Activities - ارتفاع ثابت مع scroll */}
          <div className="h-[500px]">
            <RecentActivities 
              limit={5} 
              showStats={false}
              className="shadow h-full"
            />
          </div>

          {/* Profile Summary - ارتفاع ثابت */}
          <div className="bg-white rounded-lg shadow p-6 h-[500px] flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-4">ملف الحساب</h2>
            <div className="text-center flex-1 flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">
                    {user?.firstName?.charAt(0) || 'م'}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900">
                  {user ? `${user.firstName} ${user.lastName}` : 'المستخدم'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {user?.userType === 'BROKER' ? 'وسيط عقاري' : 
                   user?.userType === 'DEVELOPER' ? 'مطور عقاري' : 
                   user?.userType === 'AGENCY' ? 'وكالة عقارية' : 'مستخدم فردي'}
                </p>
                <p className="text-gray-600 text-sm">
                  عضو منذ {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">الحالة</span>
                  <span className={`font-medium ${user?.verified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {user?.verified ? 'موثق' : 'غير موثق'}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">الإيميل</span>
                  <span className={`font-medium text-xs ${user?.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                    {user?.emailVerified ? '✓ موثق' : '✗ غير موثق'}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-600">إجمالي العقارات</span>
                  <span className="font-medium text-blue-600">{properties.length}</span>
                </div>
                
                <Link href="/dashboard/profile">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                    عرض الملف الشخصي
                  </button>
                </Link>
                <Link href="/dashboard/appointments">
                  <button className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                    <CalendarDaysIcon className="w-4 h-4" />
                    مواعيد المعاينات
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* My Properties */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          {/* Properties Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-gray-900">عقاراتي</h2>
              <div className="flex items-center text-sm text-gray-500 mr-4">
                <span>•</span>
                <span className="mr-2">إجمالي {filteredProperties.length} عقار</span>
              </div>
            </div>
            <Link href="/dashboard/add-property">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                إضافة عقار جديد
              </button>
            </Link>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Search Box */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="ابحث بالعنوان أو المدينة أو المنطقة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">كل الأنواع</option>
                <option value="APARTMENT">شقة</option>
                <option value="VILLA">فيلا</option>
                <option value="OFFICE">مكتب</option>
                <option value="COMMERCIAL">تجاري</option>
                <option value="LAND">أرض</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">كل الحالات</option>
                <option value="ACTIVE">نشط</option>
                <option value="INACTIVE">غير نشط</option>
                <option value="SOLD">مباع</option>
                <option value="RENTED">مؤجر</option>
                <option value="PENDING">معلق</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loadingProperties ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <BuildingOfficeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  لا توجد عقارات بعد
                </h3>
                <p className="text-gray-500 mb-6">
                  ابدأ بإضافة أول عقار لك
                </p>
                <Link href="/dashboard/add-property">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700">
                    إضافة عقار جديد
                  </button>
                </Link>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <BuildingOfficeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  لا توجد نتائج
                </h3>
                <p className="text-gray-500 mb-6">
                  جرب تغيير معايير البحث أو الفلاتر
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setFilterType('ALL')
                    setFilterStatus('ALL')
                    setFilterCity('ALL')
                  }}
                  className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700"
                >
                  إعادة تعيين الفلاتر
                </button>
              </div>
            ) : (
              <>
                <table className="w-full text-sm text-right">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">الصورة</th>
                      <th className="px-6 py-3">العنوان</th>
                      <th className="px-6 py-3">النوع</th>
                      <th className="px-6 py-3">السعر</th>
                      <th className="px-6 py-3">الحالة</th>
                      <th className="px-6 py-3">المشاهدات</th>
                      <th className="px-6 py-3">الاستفسارات</th>
                      <th className="px-6 py-3">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProperties.map((property) => (
                      <tr key={property.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4">
                          {property.images && property.images.length > 0 ? (
                            <img 
                              src={property.images[0].url} 
                              alt={property.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <BuildingOfficeIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div className="max-w-xs truncate" title={property.title}>
                          {property.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {property.district}, {property.city}
                        </div>
                      </td>
                      <td className="px-6 py-4">{getPropertyTypeLabel(property.propertyType)}</td>
                      <td className="px-6 py-4 font-semibold">
                        {formatPrice(property.price, property.currency)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(property.status)}`}>
                          {getStatusLabel(property.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">{property.views}</td>
                      <td className="px-6 py-4">{property._count.inquiries}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2 gap-2">
                          <Link 
                            href={`/dashboard/properties/${property.id}/edit`}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors inline-block"
                          >
                            تعديل
                          </Link>
                          <button 
                            onClick={() => handleDeleteProperty(property.id)}
                            disabled={deletingProperty === property.id}
                            className="text-red-600 hover:text-red-800 text-xs font-medium bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingProperty === property.id ? 'جاري الحذف...' : 'حذف'}
                          </button>
                          <button 
                            onClick={() => handleToggleStatus(property.id, property.status)}
                            disabled={toggleStatus === property.id}
                            className={`text-xs font-medium px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                              property.status === 'ACTIVE' 
                                ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' 
                                : 'text-green-600 bg-green-50 hover:bg-green-100'
                            }`}
                          >
                            {toggleStatus === property.id ? (
                              <div className="flex items-center gap-1">
                                <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                                جاري التغيير...
                              </div>
                            ) : (
                              property.status === 'ACTIVE' ? 'إلغاء تفعيل' : 'تفعيل'
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t pt-6">
                  <div className="text-sm text-gray-600">
                    عرض {indexOfFirstProperty + 1} - {Math.min(indexOfLastProperty, filteredProperties.length)} من {filteredProperties.length} عقار
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      السابق
                    </button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'border-2 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      التالي
                    </button>
                  </div>
                </div>
              )}
            </>
            )}
          </div>
        </div>

        {/* Modal تأكيد الحذف */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                تأكيد حذف العقار
              </h3>
              <p className="text-gray-600 mb-6">
                هل أنت متأكد من رغبتك في حذف هذا العقار؟ هذا الإجراء لا يمكن التراجع عنه.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={deletingProperty === showDeleteConfirm}
                >
                  إلغاء
                </button>
                <button
                  onClick={() => confirmDeleteProperty(showDeleteConfirm)}
                  disabled={deletingProperty === showDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {deletingProperty === showDeleteConfirm ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      جاري الحذف...
                    </>
                  ) : (
                    'تأكيد الحذف'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default withAuth(DashboardPage)
