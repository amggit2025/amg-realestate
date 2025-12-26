// Admin Projects Management Page
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { logger } from '@/lib/logger'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  PhotoIcon,
  EyeIcon 
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { PermissionGuard } from '@/components/admin/PermissionGuard'

interface Project {
  id: string
  title: string
  location: string
  type: string
  price: string
  developer: string
  status: string
  featured: boolean
  published: boolean
  createdAt: string
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [seedLoading, setSeedLoading] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/projects')
      const data = await response.json()

      if (data.success) {
        setProjects(data.data)
      } else {
        setError(data.message || 'خطأ في جلب المشاريع')
      }
    } catch (error) {
      logger.error('Error fetching projects:', error)
      setError('خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  const addSampleProjects = async () => {
    try {
      setSeedLoading(true)
      const response = await fetch('/api/seed/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()

      if (data.success) {
        alert('تم إضافة المشاريع التجريبية بنجاح!')
        fetchProjects() // إعادة تحميل المشاريع
      } else {
        alert('خطأ: ' + data.message)
      }
    } catch (error) {
      logger.error('Error adding sample projects:', error)
      alert('خطأ في إضافة المشاريع التجريبية')
    } finally {
      setSeedLoading(false)
    }
  }

  const deleteProject = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        setProjects(prev => prev.filter(p => p.id !== id))
        alert('تم حذف المشروع بنجاح')
      } else {
        alert(data.message || 'خطأ في حذف المشروع')
      }
    } catch (error) {
      logger.error('Error deleting project:', error)
      alert('خطأ في الاتصال بالخادم')
    }
  }

  const toggleProjectStatus = async (id: string, field: 'featured' | 'published', currentValue: boolean) => {
    try {
      const newValue = !currentValue
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🔄 Toggle Project Status')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('Project ID:', id)
      console.log('Field:', field)
      console.log('Current Value:', currentValue)
      console.log('New Value:', newValue)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      
      const payload = { [field]: newValue }
      console.log('📤 Sending payload:', JSON.stringify(payload, null, 2))
      
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      console.log('📡 Response status:', response.status, response.statusText)
      
      const responseText = await response.text()
      console.log('📥 Response text:', responseText)
      
      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error('❌ Failed to parse response as JSON')
        throw new Error('Invalid JSON response from server')
      }
      
      console.log('📋 Response data:', JSON.stringify(data, null, 2))

      if (data.success) {
        console.log('✅ Successfully updated project status')
        setProjects(prev => prev.map(p => 
          p.id === id ? { ...p, [field]: newValue } : p
        ))
        console.log('✅ Local state updated')
      } else {
        console.error('❌ API returned error:', data.message)
        alert(`خطأ: ${data.message}`)
      }
    } catch (error) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.error('💥 Error updating project')
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.error('Error object:', error)
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      alert(`خطأ في الاتصال: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المشاريع</h1>
              <p className="text-gray-600">إدارة وتحديث المشاريع العقارية</p>
            </div>
            <div className="flex gap-3">
              <PermissionGuard module="projects" permission="create">
                <button
                  onClick={addSampleProjects}
                  disabled={seedLoading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {seedLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <PhotoIcon className="w-5 h-5" />
                  )}
                  {seedLoading ? 'جاري الإضافة...' : 'إضافة مشاريع تجريبية'}
                </button>
              </PermissionGuard>
              <PermissionGuard module="projects" permission="create">
                <Link
                  href="/admin/projects/add"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <PlusIcon className="w-5 h-5" />
                  مشروع جديد
                </Link>
              </PermissionGuard>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">جاري تحميل المشاريع...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchProjects}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  إعادة المحاولة
                </button>
              </div>
            </div>
          )}

          {/* Projects Table */}
          {!loading && !error && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">المشروع</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الموقع</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">السعر</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">المطور</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الحالة</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {projects.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center">
                          <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 text-lg">لا توجد مشاريع حاليًا</p>
                          <Link
                            href="/admin/projects/add"
                            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            إضافة مشروع جديد
                          </Link>
                        </td>
                      </tr>
                    ) : (
                      projects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">{project.title}</div>
                              <div className="text-sm text-gray-500">{project.type}</div>
                              <div className="flex items-center gap-2 mt-1">
                                {project.featured && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                    مميز
                                  </span>
                                )}
                                {project.published && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                    منشور
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-900">{project.location}</td>
                          <td className="px-6 py-4 text-gray-900">{project.price} جنيه</td>
                          <td className="px-6 py-4 text-gray-900">{project.developer}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              project.status === 'UNDER_CONSTRUCTION' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {project.status === 'COMPLETED' ? 'مكتمل' :
                               project.status === 'UNDER_CONSTRUCTION' ? 'تحت الإنشاء' : 'تحت التخطيط'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/projects/${project.id}`}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                title="عرض"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </Link>
                              <PermissionGuard module="projects" permission="edit">
                                <Link
                                  href={`/admin/projects/edit/${project.id}`}
                                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                  title="تحرير"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </Link>
                              </PermissionGuard>
                              <PermissionGuard module="projects" permission="delete">
                                <button
                                  onClick={() => deleteProject(project.id)}
                                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                                  title="حذف"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </PermissionGuard>
                              <div className="border-r border-gray-300 mx-2 h-4"></div>
                              <PermissionGuard module="projects" permission="edit">
                                <button
                                  onClick={() => toggleProjectStatus(project.id, 'featured', project.featured)}
                                  className={`text-xs px-2 py-1 rounded ${
                                    project.featured 
                                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                  title={project.featured ? 'إلغاء التميز' : 'جعل مميز'}
                                >
                                  {project.featured ? '★' : '☆'}
                                </button>
                              </PermissionGuard>
                              <PermissionGuard module="projects" permission="edit">
                                <button
                                  onClick={() => toggleProjectStatus(project.id, 'published', project.published)}
                                  className={`text-xs px-2 py-1 rounded ${
                                    project.published 
                                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                                  }`}
                                  title={project.published ? 'إلغاء النشر' : 'نشر'}
                                >
                                  {project.published ? '✓' : '✗'}
                                </button>
                              </PermissionGuard>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
  )
}
