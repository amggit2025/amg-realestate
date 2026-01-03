'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { motion } from 'framer-motion'
import { logger } from '@/lib/logger'
import { useToastContext } from '@/lib/ToastContext'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  HeartIcon,
  StarIcon,
  PhotoIcon,
  Cog6ToothIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { PermissionGuard } from '@/components/admin/PermissionGuard'

// نوع البيانات للعمل في معرض الأعمال
interface PortfolioItem {
  id: string
  slug: string
  title: string
  description: string
  category: 'CONSTRUCTION' | 'FINISHING' | 'FURNITURE' | 'KITCHENS'
  location: string
  client: string
  budget: string
  completionDate: string
  mainImage: string
  likes: number
  views: number
  rating: number
  published: boolean
  featured: boolean
  createdAt: string
}

// تصنيفات معرض الأعمال
const portfolioCategories = [
  { id: 'CONSTRUCTION', name: 'التشييد والبناء', color: 'orange' },
  { id: 'FINISHING', name: 'التشطيبات الداخلية', color: 'purple' },
  { id: 'FURNITURE', name: 'الأثاث والديكور', color: 'red' },
  { id: 'KITCHENS', name: 'المطابخ', color: 'green' }
]

export default function AdminPortfolioPage() {
  const router = useRouter()
  const toast = useToastContext()
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [currentPage, setCurrentPage] = useState('portfolio')
  const [adminRole] = useState('ADMIN') // يمكن جلبه من السيشن لاحقاً
  const [projects, setProjects] = useState<any[]>([])
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'CONSTRUCTION',
    location: '',
    client: '',
    duration: '',
    area: '',
    budget: '',
    completionDate: '',
    mainImage: '/images/placeholder.jpg',
    projectId: '',
    showInProject: false
  })
  const [submitting, setSubmitting] = useState(false)

  // تحميل الأعمال من قاعدة البيانات
  const fetchPortfolioItems = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/portfolio')
      const data = await response.json()
      
      if (data.success) {
        setPortfolioItems(data.portfolioItems || [])
        setFilteredItems(data.portfolioItems || [])
      } else {
        setError(data.message || 'حدث خطأ في تحميل الأعمال')
      }
    } catch (error) {
      logger.error('خطأ في تحميل الأعمال:', error)
      setError('حدث خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  // تحميل المشاريع
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects')
      const data = await response.json()
      if (data.success) {
        setProjects(data.projects || [])
      }
    } catch (error) {
      logger.error('خطأ في تحميل المشاريع:', error)
    }
  }

  useEffect(() => {
    fetchPortfolioItems()
    fetchProjects()
  }, [])

  // توليد slug من العنوان
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[أ-ي]/g, (char) => {
        const arabicToLatin: { [key: string]: string } = {
          'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
          'د': 'd', 'ذ': 'th', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's',
          'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
          'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y'
        }
        return arabicToLatin[char] || char
      })
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
  }

  // تحديث البيانات
  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // توليد slug تلقائياً عند تغيير العنوان
      ...(field === 'title' && typeof value === 'string' && { slug: generateSlug(value) })
    }))
  }

  // إضافة عمل جديد
  const handleAddPortfolioItem = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.slug || !formData.description) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('تم إضافة العمل بنجاح!')
        setShowAddForm(false)
        setFormData({
          title: '',
          slug: '',
          description: '',
          category: 'CONSTRUCTION',
          location: '',
          client: '',
          duration: '',
          area: '',
          budget: '',
          completionDate: '',
          mainImage: '/images/placeholder.jpg',
          projectId: '',
          showInProject: false
        })
        fetchPortfolioItems()
      } else {
        toast.error('حدث خطأ في إضافة العمل: ' + data.message)
      }
    } catch (error) {
      logger.error('خطأ في إضافة العمل:', error)
      toast.error('حدث خطأ في الاتصال بالخادم')
    } finally {
      setSubmitting(false)
    }
  }

  // حذف عمل
  const handleDeleteClick = (id: string) => {
    setItemToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const deletePortfolioItem = async () => {
    if (!itemToDelete) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/portfolio/${itemToDelete}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('تم حذف العمل بنجاح')
        fetchPortfolioItems()
      } else {
        toast.error('حدث خطأ في حذف العمل: ' + data.message)
      }
    } catch (error) {
      logger.error('خطأ في حذف العمل:', error)
      toast.error('حدث خطأ في الاتصال بالخادم')
    } finally {
      setDeleting(false)
      setDeleteConfirmOpen(false)
      setItemToDelete(null)
    }
  }

  // تبديل حالة النشر
  const togglePublished = async (id: string, published: boolean) => {
    try {
      const response = await fetch(`/api/admin/portfolio/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ published: !published })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchPortfolioItems()
      } else {
        toast.error('حدث خطأ في تحديث حالة النشر: ' + data.message)
      }
    } catch (error) {
      logger.error('خطأ في تحديث حالة النشر:', error)
      toast.error('حدث خطأ في الاتصال بالخادم')
    }
  }

  // تبديل حالة المميز
  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/admin/portfolio/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ featured: !featured })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchPortfolioItems()
      } else {
        toast.error('حدث خطأ في تحديث حالة المميز: ' + data.message)
      }
    } catch (error) {
      logger.error('خطأ في تحديث حالة المميز:', error)
      toast.error('حدث خطأ في الاتصال بالخادم')
    }
  }

  // فلترة الأعمال
  useEffect(() => {
    let filtered = portfolioItems

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredItems(filtered)
  }, [portfolioItems, selectedCategory, searchTerm])

  useEffect(() => {
    fetchPortfolioItems()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* عنوان الصفحة */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة معرض الأعمال</h1>
        <p className="text-gray-600">إدارة وتنظيم أعمال الشركة المختلفة</p>
      </div>

      {/* شريط الأدوات */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          {/* البحث والفلترة */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="البحث في الأعمال..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-80"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">جميع التصنيفات</option>
              {portfolioCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* الأزرار */}
          <div className="flex gap-3">
            <PermissionGuard module="portfolio" permission="create">
              <button
                onClick={() => router.push('/admin/portfolio/add')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                إضافة عمل جديد
              </button>
            </PermissionGuard>
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{portfolioItems.length}</div>
            <div className="text-sm text-blue-600">إجمالي الأعمال</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {portfolioItems.filter(p => p.published).length}
            </div>
            <div className="text-sm text-green-600">منشور</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {portfolioItems.filter(p => p.featured).length}
            </div>
            <div className="text-sm text-yellow-600">مميز</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {filteredItems.length}
            </div>
            <div className="text-sm text-purple-600">نتائج البحث</div>
          </div>
        </div>
      </div>

      {/* رسالة الخطأ */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* قائمة الأعمال */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد أعمال</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== 'all' ? 
                'لا توجد أعمال تطابق معايير البحث' : 
                'لم يتم إضافة أي أعمال بعد'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العمل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التصنيف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العميل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإحصائيات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {item.title.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        portfolioCategories.find(c => c.id === item.category)?.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                        portfolioCategories.find(c => c.id === item.category)?.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                        portfolioCategories.find(c => c.id === item.category)?.color === 'red' ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {portfolioCategories.find(c => c.id === item.category)?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <HeartIcon className="w-4 h-4 text-red-500" />
                          <span>{item.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <EyeIcon className="w-4 h-4 text-blue-500" />
                          <span>{item.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-4 h-4 text-yellow-500" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.published ? 'منشور' : 'مسودة'}
                        </span>
                        {item.featured && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            مميز
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <PermissionGuard module="portfolio" permission="edit">
                          <button
                            onClick={() => router.push(`/admin/portfolio/edit/${item.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="تعديل العمل"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        </PermissionGuard>
                        <PermissionGuard module="portfolio" permission="edit">
                          <button
                            onClick={() => togglePublished(item.id, item.published)}
                            className={`${item.published ? 'text-gray-600 hover:text-gray-900' : 'text-green-600 hover:text-green-900'}`}
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                        </PermissionGuard>
                        <PermissionGuard module="portfolio" permission="edit">
                          <button
                            onClick={() => toggleFeatured(item.id, item.featured)}
                            className={`${item.featured ? 'text-yellow-600 hover:text-yellow-900' : 'text-gray-600 hover:text-gray-900'}`}
                          >
                            <StarIcon className="w-4 h-4" />
                          </button>
                        </PermissionGuard>
                        <PermissionGuard module="portfolio" permission="delete">
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            disabled={deleting}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </PermissionGuard>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* نموذج إضافة عمل جديد */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">إضافة عمل جديد</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddPortfolioItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* العنوان */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان العمل *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* الـ Slug */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الرابط (Slug) *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleFormChange('slug', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      يُولد تلقائياً من العنوان أو يمكنك تخصيصه
                    </p>
                  </div>

                  {/* التصنيف */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التصنيف *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {portfolioCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* الموقع */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الموقع *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleFormChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* العميل */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العميل *
                    </label>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={(e) => handleFormChange('client', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* المدة */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مدة التنفيذ
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => handleFormChange('duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="مثال: 6 أشهر"
                    />
                  </div>

                  {/* المساحة */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المساحة
                    </label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) => handleFormChange('area', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="مثال: 200 م²"
                    />
                  </div>

                  {/* الميزانية */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الميزانية
                    </label>
                    <input
                      type="text"
                      value={formData.budget}
                      onChange={(e) => handleFormChange('budget', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="مثال: 500 ألف جنيه"
                    />
                  </div>

                  {/* تاريخ الانتهاء */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاريخ الانتهاء
                    </label>
                    <input
                      type="text"
                      value={formData.completionDate}
                      onChange={(e) => handleFormChange('completionDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="مثال: يناير 2024"
                    />
                  </div>

                  {/* الوصف */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الوصف *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* ربط بمشروع */}
                  <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏗️ ربط هذا العمل بمشروع (اختياري)
                    </label>
                    <select
                      value={formData.projectId}
                      onChange={(e) => handleFormChange('projectId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                    >
                      <option value="">لا يوجد مشروع مرتبط</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.title}
                        </option>
                      ))}
                    </select>
                    
                    {formData.projectId && (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.showInProject}
                          onChange={(e) => handleFormChange('showInProject', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          عرض هذا العمل في صفحة المشروع
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                {/* أزرار الحفظ والإلغاء */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? 'جاري الحفظ...' : 'حفظ العمل'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={deletePortfolioItem}
        title="تأكيد الحذف"
        message="هل أنت متأكد من حذف هذا العمل؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        cancelText="إلغاء"
        type="danger"
        loading={deleting}
      />
    </div>
  )
}