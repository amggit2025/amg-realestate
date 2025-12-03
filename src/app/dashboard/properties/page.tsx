'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  PlusIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  BuildingOfficeIcon,
  HomeIcon,
  MapPinIcon,
  BanknotesIcon,
  PencilIcon,
  TrashIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { useAuth, withAuth } from '@/lib/AuthContext'
import Link from 'next/link'

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
  mainImage?: string
  _count: {
    favorites: number
    inquiries: number
  }
  createdAt: string
}

interface PropertyStats {
  total: number
  active: number
  sold: number
  rented: number
  pending: number
  totalViews: number
  totalFavorites: number
  totalInquiries: number
}

function MyPropertiesPage() {
  const { user } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [stats, setStats] = useState<PropertyStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingProperty, setDeletingProperty] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  // جلب العقارات
  const fetchProperties = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/properties', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties)
        
        // حساب الإحصائيات من البيانات المسترجعة
        const totalProperties = data.properties.length
        const activeProperties = data.properties.filter((p: any) => p.status === 'ACTIVE').length
        const soldProperties = data.properties.filter((p: any) => p.status === 'SOLD').length
        const rentedProperties = data.properties.filter((p: any) => p.status === 'RENTED').length
        const pendingProperties = data.properties.filter((p: any) => p.status === 'PENDING').length
        const totalViews = data.properties.reduce((sum: number, p: any) => sum + p.views, 0)
        const totalFavorites = data.properties.reduce((sum: number, p: any) => sum + p._count.favorites, 0)
        const totalInquiries = data.properties.reduce((sum: number, p: any) => sum + p._count.inquiries, 0)
        
        setStats({
          total: totalProperties,
          active: activeProperties,
          sold: soldProperties,
          rented: rentedProperties,
          pending: pendingProperties,
          totalViews,
          totalFavorites,
          totalInquiries
        })
      } else {
        setError('حدث خطأ أثناء جلب العقارات')
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
      setError('حدث خطأ في الاتصال')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  // دالة حذف العقار
  const handleDeleteProperty = async (propertyId: string) => {
    setShowDeleteConfirm(propertyId)
  }

  // تأكيد حذف العقار
  const confirmDeleteProperty = async (propertyId: string) => {
    setDeletingProperty(propertyId)
    try {
      console.log('محاولة حذف العقار:', propertyId)
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      console.log('استجابة الحذف:', response.status)

      if (response.ok) {
        // إزالة العقار من القائمة وإعادة حساب الإحصائيات
        setProperties(prev => prev.filter(p => p.id !== propertyId))
        setShowDeleteConfirm(null)
        alert('تم حذف العقار بنجاح')
        
        // إعادة حساب الإحصائيات
        fetchProperties()
      } else {
        const errorData = await response.json()
        console.error('خطأ في الحذف:', errorData)
        alert(errorData.message || 'حدث خطأ في حذف العقار')
      }
    } catch (error) {
      console.error('خطأ في شبكة الاتصال:', error)
      alert('حدث خطأ في الاتصال بالخادم')
    } finally {
      setDeletingProperty(null)
    }
  }

  // دالة للحصول على أيقونة نوع العقار
  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'APARTMENT':
        return <BuildingOfficeIcon className="w-6 h-6" />
      case 'VILLA':
        return <HomeIcon className="w-6 h-6" />
      default:
        return <BuildingOfficeIcon className="w-6 h-6" />
    }
  }

  // دالة للحصول على لون حالة العقار
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'SOLD':
        return 'bg-red-100 text-red-800'
      case 'RENTED':
        return 'bg-blue-100 text-blue-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // دالة للحصول على نص الحالة
  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'نشط'
      case 'SOLD':
        return 'تم البيع'
      case 'RENTED':
        return 'تم التأجير'
      case 'PENDING':
        return 'قيد المراجعة'
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="container mx-auto px-4">
        
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
          <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
            الداشبورد
          </Link>
          <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-medium">عقاراتي</span>
        </motion.nav>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                عقاراتي
              </h1>
              <p className="text-gray-600">
                إدارة جميع العقارات التي أضفتها
              </p>
            </div>
            <Link href="/dashboard/add-property">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg"
              >
                <PlusIcon className="w-5 h-5" />
                إضافة عقار جديد
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* الإحصائيات */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-gray-600">إجمالي العقارات</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-gray-600">عقارات نشطة</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{stats.totalViews}</div>
              <div className="text-gray-600">إجمالي المشاهدات</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-orange-600">{stats.totalInquiries}</div>
              <div className="text-gray-600">الاستفسارات</div>
            </div>
          </motion.div>
        )}

        {/* رسالة خطأ */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* قائمة العقارات */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {properties.length === 0 ? (
            <div className="text-center py-20">
              <BuildingOfficeIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                لا توجد عقارات بعد
              </h3>
              <p className="text-gray-500 mb-6">
                ابدأ بإضافة أول عقار لك
              </p>
              <Link href="/dashboard/add-property">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
                  إضافة عقار جديد
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        {getPropertyTypeIcon(property.propertyType)}
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {property.title}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{property.city}, {property.district}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.status)}`}>
                          {getStatusText(property.status)}
                        </span>
                        <div className="flex gap-1">
                          <Link 
                            href={`/dashboard/properties/${property.id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg inline-block"
                            title="تعديل العقار"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDeleteProperty(property.id)}
                            disabled={deletingProperty === property.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            title="حذف العقار"
                          >
                            {deletingProperty === property.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <TrashIcon className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {property.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <BanknotesIcon className="w-5 h-5 text-green-600" />
                        <span className="font-semibold">
                          {property.price} {property.currency}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">المساحة:</span>
                        <span>{property.area} م²</span>
                      </div>
                      {property.bedrooms && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">غرف:</span>
                          <span>{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">حمامات:</span>
                          <span>{property.bathrooms}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <EyeIcon className="w-4 h-4" />
                          <span>{property.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HeartIcon className="w-4 h-4" />
                          <span>{property._count.favorites}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                          <span>{property._count.inquiries}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        {new Date(property.createdAt).toLocaleDateString('ar-EG')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

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

export default withAuth(MyPropertiesPage)