'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { logger } from '@/lib/logger'
import { useToastContext } from '@/lib/ToastContext'
import {
  WrenchScrewdriverIcon,
  PaintBrushIcon,
  CubeTransparentIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XMarkIcon,
  MegaphoneIcon,
  HomeIcon
} from '@heroicons/react/24/outline'
import { PermissionGuard } from '@/components/admin/PermissionGuard'

// Helper to get icon component by name
const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    BuildingOfficeIcon,
    PaintBrushIcon,
    HomeIcon,
    MegaphoneIcon,
    BuildingOffice2Icon,
    WrenchScrewdriverIcon,
    CubeTransparentIcon
  }
  return icons[iconName] || BuildingOfficeIcon
}

interface Service {
  id: string
  slug: string
  title: string
  description: string
  heroImage: string
  features: any[]
  stats: any[]
  gallery: string[]
  formOptions: any
  color: string
  iconName: string
  published: boolean
  featured: boolean
  order: number
  _count?: {
    portfolioItems: number
  }
}

export default function AdminServicesPage() {
  const router = useRouter()
  const toast = useToastContext()
  const [currentPage, setCurrentPage] = useState('services')
  const [adminRole] = useState('ADMIN')
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setServices(data.services || [])
      } else {
        logger.error('Failed to fetch services:', response.status)
      }
    } catch (error) {
      logger.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (serviceId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return

    setDeleting(serviceId)
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setServices(services.filter(s => s.id !== serviceId))
        toast.success('تم حذف الخدمة بنجاح')
      } else {
        const data = await response.json()
        toast.error('فشل حذف الخدمة', data.error)
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء الحذف')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* عنوان الصفحة */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الخدمات</h1>
        <p className="text-gray-600">إدارة وتنظيم خدمات الشركة المختلفة</p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">إجمالي الخدمات</p>
                  <p className="text-3xl font-bold text-gray-900">{services.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">الخدمات النشطة</p>
                  <p className="text-3xl font-bold text-green-600">
                    {services.filter(s => s.published).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">إجمالي المعرض</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {services.reduce((sum, s) => sum + (s._count?.portfolioItems || 0), 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <WrenchScrewdriverIcon className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">الخدمات المميزة</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {services.filter(s => s.featured).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* قائمة الخدمات */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">الخدمات المتاحة</h2>
                <button 
                  onClick={() => router.push('/admin/services/add')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <PlusIcon className="w-5 h-5" />
                  إضافة خدمة جديدة
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-gray-500">
                جاري التحميل...
              </div>
            ) : services.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                لا توجد خدمات حالياً
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {services.map((service) => {
                  const IconComponent = getIconComponent(service.iconName)
                  
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                    >
                      {/* أيقونة الخدمة */}
                      <div className={`w-14 h-14 bg-${service.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                        <IconComponent className={`w-7 h-7 text-${service.color}-600`} />
                      </div>

                      {/* معلومات الخدمة */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                      {/* الإحصائيات */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-700">
                          {service._count?.portfolioItems || 0} عمل
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          service.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {service.published ? 'منشور' : 'مخفي'}
                        </span>
                      </div>

                      {/* الأزرار */}
                      <div className="flex items-center gap-2">
                        <PermissionGuard module="services" permission="edit">
                          <button 
                            onClick={() => router.push(`/admin/services/edit/${service.id}`)}
                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-1"
                          >
                            <PencilIcon className="w-4 h-4" />
                            تعديل
                          </button>
                        </PermissionGuard>
                        <button 
                          onClick={() => router.push(`/services/${service.slug}`)}
                          className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <PermissionGuard module="services" permission="delete">
                          <button 
                            onClick={() => handleDelete(service.id)}
                            disabled={deleting === service.id}
                            className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </PermissionGuard>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

          {/* ملاحظة */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">صفحة إدارة الخدمات جاهزة</h3>
                <p className="text-blue-800">
                  هذه الصفحة جاهزة لإضافة المزيد من الوظائف حسب احتياجاتك. يمكنك الآن إخباري بما تريد إضافته خطوة بخطوة.
                </p>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
