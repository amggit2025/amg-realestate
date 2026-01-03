'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { logger } from '@/lib/logger'
import { useToastContext } from '@/lib/ToastContext'
import {
  ArrowLeftIcon,
  PhotoIcon,
  PlusIcon,
  XMarkIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

// تصنيفات معرض الأعمال
const portfolioCategories = [
  { id: 'CONSTRUCTION', name: 'التشييد والبناء' },
  { id: 'FINISHING', name: 'التشطيبات الداخلية' },
  { id: 'FURNITURE', name: 'الأثاث والديكور' },
  { id: 'KITCHENS', name: 'المطابخ' }
]

interface PortfolioItemData {
  id: string
  title: string
  slug: string
  description: string
  fullDescription: string
  category: string
  location: string
  client: string
  duration: string
  area: string
  budget: string
  completionDate: string
  mainImage: string
  mainImagePublicId?: string
  features: string[]
  tags: string[]
  challenges: string[]
  solutions: string[]
  technologies: string[]
  teamMembers: string[]
  clientTestimonial: {
    comment: string
    rating: number
    clientName: string
    clientTitle: string
  }
  published: boolean
  featured: boolean
  serviceId?: string
  showInServiceGallery?: boolean
  projectId?: string
  showInProject?: boolean
  images: { id: string, url: string, publicId?: string, order: number }[]
}

export default function EditPortfolioPage() {
  const router = useRouter()
  const params = useParams()
  const portfolioId = params.id as string
  const toast = useToastContext()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})
  const [services, setServices] = useState<any[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  
  const [formData, setFormData] = useState<PortfolioItemData>({
    id: '',
    title: '',
    slug: '',
    description: '',
    fullDescription: '',
    category: 'CONSTRUCTION',
    location: '',
    client: '',
    duration: '',
    area: '',
    budget: '',
    completionDate: '',
    mainImage: '',
    mainImagePublicId: '',
    features: [''],
    tags: [''],
    challenges: [''],
    solutions: [''],
    technologies: [''],
    teamMembers: [''],
    clientTestimonial: {
      comment: '',
      rating: 5,
      clientName: '',
      clientTitle: ''
    },
    published: true,
    featured: false,
    serviceId: '',
    showInServiceGallery: false,
    projectId: '',
    showInProject: false,
    images: []
  })

  const [newMainImage, setNewMainImage] = useState<File | null>(null)
  const [newGalleryImages, setNewGalleryImages] = useState<File[]>([])
  const [deletedImages, setDeletedImages] = useState<string[]>([])
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  // Fetch services and projects on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/admin/services', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setServices(data.services || [])
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoadingServices(false)
      }
    }
    
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/admin/projects', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setProjects(data.projects || [])
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoadingProjects(false)
      }
    }
    
    fetchServices()
    fetchProjects()
  }, [])

  // تحميل بيانات العمل
  useEffect(() => {
    const fetchPortfolioItem = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/portfolio/${portfolioId}`)
        
        console.log('Fetch response status:', response.status)
        console.log('Fetch response headers:', Object.fromEntries(response.headers.entries()))
        
        // معالجة آمنة للاستجابة
        let data: any = {}
        
        const contentType = response.headers.get('content-type')
        const responseText = await response.text()
        
        console.log('Fetch response text:', responseText.substring(0, 200) + '...')
        console.log('Fetch Content-Type:', contentType)
        
        if (responseText && contentType?.includes('application/json')) {
          try {
            data = JSON.parse(responseText)
          } catch (parseError) {
            console.error('❌ JSON parse error in fetch:', parseError)
            console.error('📋 Response text that failed to parse:', responseText.substring(0, 300) + '...')
            throw new Error('الخادم أرجع استجابة غير صالحة. يرجى المحاولة مرة أخرى.')
          }
        } else {
          // إذا لم تكن الاستجابة JSON
          if (responseText.includes('<!DOCTYPE') || responseText.includes('<html>')) {
            console.error('⚠️ Server returned HTML instead of JSON when fetching portfolio item')
            console.error(`📍 Request URL: /api/admin/portfolio/${portfolioId}`)
            throw new Error(`لا يمكن الوصول إلى البيانات. تأكد من صحة معرف العمل: ${portfolioId}`)
          }
          throw new Error('استجابة غير متوقعة من الخادم')
        }
        
        if (data.success) {
          setFormData(data.portfolioItem)
        } else {
          toast.error('خطأ في تحميل بيانات العمل: ' + (data.message || 'خطأ غير محدد'))
          router.push('/admin/portfolio')
        }
      } catch (error) {
        console.error('❌ خطأ في تحميل العمل:', error)
        toast.error(error instanceof Error ? error.message : 'حدث خطأ في تحميل بيانات العمل')
        router.push('/admin/portfolio')
      } finally {
        setLoading(false)
      }
    }

    if (portfolioId) {
      fetchPortfolioItem()
    }
  }, [portfolioId, router])

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
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // توليد slug تلقائياً عند تغيير العنوان
      ...(field === 'title' && { slug: generateSlug(value) })
    }))
  }

  // إضافة عنصر جديد للمصفوفات
  const addArrayItem = (arrayName: string) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...(prev as any)[arrayName], '']
    }))
  }

  // حذف عنصر من المصفوفات
  const removeArrayItem = (arrayName: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: (prev as any)[arrayName].filter((_: any, i: number) => i !== index)
    }))
  }

  // تحديث عنصر في المصفوفة
  const updateArrayItem = (arrayName: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: (prev as any)[arrayName].map((item: string, i: number) => 
        i === index ? value : item
      )
    }))
  }

  // حذف صورة من المعرض الموجود
  const removeExistingImage = async (imageId: string, publicId?: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
      // حذف من Cloudinary إذا وجد publicId
      if (publicId) {
        try {
          await fetch(`/api/upload/manage?publicId=${publicId}`, {
            method: 'DELETE'
          })
        } catch (error) {
          console.error('خطأ في حذف الصورة من Cloudinary:', error)
        }
      }
      
      // إضافة للقائمة المحذوفة
      setDeletedImages(prev => [...prev, imageId])
      
      // حذف من العرض المحلي
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      }))
    }
  }

  // رفع الصور الجديدة إلى Cloudinary
  const uploadNewImages = async () => {
    const results = {
      mainImageUrl: formData.mainImage,
      mainImagePublicId: formData.mainImagePublicId,
      newGalleryImages: [] as {url: string, publicId: string}[]
    }

    // رفع الصورة الرئيسية الجديدة
    if (newMainImage) {
      setUploadProgress(prev => ({ ...prev, main: 0 }))
      const formDataMain = new FormData()
      formDataMain.append('file', newMainImage)
      formDataMain.append('type', 'portfolio')
      
      try {
        setUploadProgress(prev => ({ ...prev, main: 50 }))
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataMain
        })
        const data = await response.json()
        if (data.success) {
          results.mainImageUrl = data.url
          results.mainImagePublicId = data.publicId
          setUploadProgress(prev => ({ ...prev, main: 100 }))
          
          // حذف الصورة الرئيسية القديمة من Cloudinary
          if (formData.mainImagePublicId) {
            try {
              await fetch(`/api/upload/manage?publicId=${formData.mainImagePublicId}`, {
                method: 'DELETE'
              })
            } catch (error) {
              console.error('خطأ في حذف الصورة الرئيسية القديمة:', error)
            }
          }
        }
      } catch (error) {
        console.error('خطأ في رفع الصورة الرئيسية:', error)
        setUploadProgress(prev => ({ ...prev, main: -1 }))
      }
    }

    // رفع صور المعرض الجديدة
    for (let i = 0; i < newGalleryImages.length; i++) {
      const image = newGalleryImages[i]
      const progressKey = `new-gallery-${i}`
      setUploadProgress(prev => ({ ...prev, [progressKey]: 0 }))
      
      const formData = new FormData()
      formData.append('file', image)
      formData.append('type', 'portfolio')
      
      try {
        setUploadProgress(prev => ({ ...prev, [progressKey]: 50 }))
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        const data = await response.json()
        if (data.success) {
          results.newGalleryImages.push({ url: data.url, publicId: data.publicId })
          setUploadProgress(prev => ({ ...prev, [progressKey]: 100 }))
        }
      } catch (error) {
        console.error('خطأ في رفع صورة المعرض:', error)
        setUploadProgress(prev => ({ ...prev, [progressKey]: -1 }))
      }
    }

    return results
  }

  // حفظ التعديلات
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.location || !formData.client) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    try {
      setSubmitting(true)
      
      // رفع الصور الجديدة أولاً
      const uploadResults = await uploadNewImages()
      
      // إعداد البيانات للتحديث
      const updateData = {
        ...formData,
        mainImage: uploadResults.mainImageUrl,
        mainImagePublicId: uploadResults.mainImagePublicId,
        serviceId: formData.serviceId || null,
        showInServiceGallery: formData.showInServiceGallery || false,
        // تنظيف المصفوفات من القيم الفارغة
        features: formData.features.filter(f => typeof f === 'string' && f.trim()),
        tags: formData.tags.filter(t => typeof t === 'string' && t.trim()),
        challenges: formData.challenges.filter(c => typeof c === 'string' && c.trim()),
        solutions: formData.solutions.filter(s => typeof s === 'string' && s.trim()),
        technologies: formData.technologies.filter(t => typeof t === 'string' && t.trim()),
        teamMembers: formData.teamMembers.filter(tm => typeof tm === 'string' && tm.trim())
      }
      
      // إرسال البيانات لـ API
      const response = await fetch(`/api/admin/portfolio/${portfolioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
      // معالجة آمنة للاستجابة
      let data: any = {}
      
      const contentType = response.headers.get('content-type')
      const responseText = await response.text()
      
      console.log('Response text:', responseText)
      console.log('Content-Type:', contentType)
      
      if (responseText && contentType?.includes('application/json')) {
        try {
          data = JSON.parse(responseText)
        } catch (parseError) {
          console.error('❌ JSON parse error:', parseError)
          console.error('📋 Response text that failed to parse:', responseText.substring(0, 200) + '...')
          
          if (!response.ok) {
            throw new Error('حدث خطأ في الخادم، يرجى المحاولة مرة أخرى')
          }
          
          data = { success: true, message: 'تم تحديث العمل بنجاح!' }
        }
      } else if (!response.ok) {
        // التحقق إذا كانت الاستجابة HTML (صفحة خطأ)
        if (responseText.includes('<!DOCTYPE') || responseText.includes('<html>')) {
          console.error('⚠️ Server returned HTML instead of JSON. This usually means:')
          console.error('  1. API route does not exist')
          console.error('  2. Server error occurred')
          console.error('  3. Wrong URL path')
          console.error(`📍 Request URL: /api/admin/portfolio/${portfolioId}`)
          throw new Error(`خطأ في الخادم (${response.status}). تأكد من صحة المسار والإعدادات.`)
        }
        
        throw new Error(responseText || `خطأ HTTP ${response.status}: ${response.statusText}`)
      } else {
        // استجابة ناجحة لكن ليست JSON
        data = { success: true, message: 'تم تحديث العمل بنجاح!' }
      }
      
      if (data.success) {
        // حذف الصور المحذوفة من قاعدة البيانات
        if (deletedImages.length > 0) {
          try {
            const deleteResponse = await fetch('/api/admin/portfolio-images', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                imageIds: deletedImages
              })
            })
            
            if (!deleteResponse.ok) {
              console.warn('⚠️ Failed to delete some images from database')
            }
          } catch (error) {
            console.error('❌ Error deleting images:', error)
            // لا نوقف العملية، فقط نسجل التحذير
          }
        }
        
        // إضافة صور المعرض الجديدة
        if (uploadResults.newGalleryImages.length > 0) {
          try {
            const maxOrder = Math.max(...formData.images.map(img => img.order), 0)
            const addResponse = await fetch('/api/admin/portfolio-images', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                portfolioId: portfolioId,
                images: uploadResults.newGalleryImages.map((img, index) => ({
                  url: img.url,
                  publicId: img.publicId,
                  order: maxOrder + index + 1
                }))
              })
            })
            
            if (!addResponse.ok) {
              console.warn('⚠️ Failed to add some new images to database')
            }
          } catch (error) {
            console.error('❌ Error adding new images:', error)
            // لا نوقف العملية، فقط نسجل التحذير
          }
        }
        
        // عرض popup النجاح
        setShowSuccessPopup(true)
        
        // الانتقال لصفحة إدارة الأعمال بعد 2 ثانية
        setTimeout(() => {
          router.push('/admin/portfolio')
        }, 2000)
      } else {
        toast.error('حدث خطأ في تحديث العمل: ' + data.message)
      }
    } catch (error) {
      console.error('خطأ في تحديث العمل:', error)
      toast.error('حدث خطأ في الاتصال بالخادم')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar 
          currentPage="portfolio" 
          onPageChange={() => {}} 
          adminRole="ADMIN"
        />
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل بيانات العمل...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar 
        currentPage="portfolio" 
        onPageChange={() => {}} 
        adminRole="ADMIN"
      />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.push('/admin/portfolio')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              رجوع
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">تعديل العمل</h1>
              <p className="text-gray-600">تعديل بيانات العمل: {formData.title}</p>
            </div>
          </div>

          {/* النموذج */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* المعلومات الأساسية */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">المعلومات الأساسية</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان العمل *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رابط العمل (Slug) *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التصنيف *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {portfolioCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الموقع *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العميل *
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => handleInputChange('client', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مدة التنفيذ
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المساحة
                  </label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الميزانية
                  </label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ الانتهاء
                  </label>
                  <input
                    type="text"
                    value={formData.completionDate}
                    onChange={(e) => handleInputChange('completionDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* ربط بخدمة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ربط بخدمة (اختياري)
                  </label>
                  <select
                    value={formData.serviceId || ''}
                    onChange={(e) => handleInputChange('serviceId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- لا توجد خدمة --</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>{service.title}</option>
                    ))}
                  </select>
                  {formData.serviceId && (
                    <label className="flex items-center gap-2 mt-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.showInServiceGallery || false}
                        onChange={(e) => handleInputChange('showInServiceGallery', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">عرض في معرض الخدمة</span>
                    </label>
                  )}
                </div>

                {/* ربط بمشروع */}
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏗️ ربط هذا العمل بمشروع (اختياري)
                  </label>
                  <p className="text-xs text-gray-600 mb-3">
                    اختر مشروع من مشاريع AMG لعرض هذا العمل بداخله (مثل: بيت الوطن، النرجس الجديدة)
                  </p>
                  <select
                    value={formData.projectId || ''}
                    onChange={(e) => handleInputChange('projectId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- لا يوجد مشروع --</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.title} - {project.location}
                      </option>
                    ))}
                  </select>
                  {formData.projectId && (
                    <label className="flex items-center gap-2 mt-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.showInProject || false}
                        onChange={(e) => handleInputChange('showInProject', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 font-medium">✅ عرض هذا العمل داخل صفحة المشروع</span>
                    </label>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف المختصر *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف التفصيلي
                  </label>
                  <textarea
                    value={formData.fullDescription}
                    onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* الصور */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">الصور</h2>
              
              {/* الصورة الرئيسية الحالية */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الصورة الرئيسية الحالية
                </label>
                <div className="flex items-start gap-4">
                  {formData.mainImage ? (
                    <img 
                      src={formData.mainImage} 
                      alt={formData.title}
                      className="w-48 h-32 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-48 h-32 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
                      <PhotoIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">الصورة الرئيسية الحالية</p>
                    <label className="cursor-pointer bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 inline-block">
                      تغيير الصورة الرئيسية
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => setNewMainImage(e.target.files?.[0] || null)}
                      />
                    </label>
                    {newMainImage && (
                      <div className="mt-2">
                        <p className="text-sm text-green-600">✅ تم اختيار صورة جديدة: {newMainImage.name}</p>
                        {uploadProgress.main !== undefined && uploadProgress.main >= 0 && (
                          <div className="mt-2">
                            <div className="bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress.main}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {uploadProgress.main === 100 ? 'تم الرفع بنجاح' : `جاري الرفع... ${uploadProgress.main}%`}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* معرض الصور الحالي */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  معرض الصور الحالي
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {formData.images.map((image, index) => (
                    <div key={image.id} className="relative group">
                      {image.url ? (
                        <img 
                          src={image.url} 
                          alt={`Gallery ${index + 1}`} 
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-24 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
                          <PhotoIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeExistingImage(image.id, image.publicId)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* إضافة صور جديدة للمعرض */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  إضافة صور جديدة للمعرض
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {newGalleryImages.map((image, index) => {
                    const progressKey = `new-gallery-${index}`
                    const progress = uploadProgress[progressKey]
                    
                    return (
                      <div key={index} className="relative">
                        <img 
                          src={URL.createObjectURL(image)} 
                          alt={`New Gallery ${index + 1}`} 
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        
                        {progress !== undefined && progress >= 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1 rounded-b-lg">
                            <div className="bg-gray-300 rounded-full h-1">
                              <div 
                                className="bg-green-500 h-1 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-white text-center">
                              {progress === 100 ? 'تم' : `${progress}%`}
                            </p>
                          </div>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => {
                            setNewGalleryImages(prev => prev.filter((_, i) => i !== index))
                            const newProgress = {...uploadProgress}
                            delete newProgress[progressKey]
                            setUploadProgress(newProgress)
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )
                  })}
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center">
                    <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                      إضافة صور جديدة للمعرض
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            setNewGalleryImages(prev => [...prev, ...Array.from(e.target.files!)])
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* المميزات والتفاصيل */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">المميزات والتفاصيل</h2>
              
              {/* المميزات */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المميزات
                </label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateArrayItem('features', index, e.target.value)}
                      placeholder="اكتب ميزة..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('features', index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('features')}
                  className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <PlusIcon className="w-4 h-4" />
                  إضافة ميزة
                </button>
              </div>

              {/* الكلمات المفتاحية */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الكلمات المفتاحية
                </label>
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateArrayItem('tags', index, e.target.value)}
                      placeholder="اكتب كلمة مفتاحية..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('tags', index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('tags')}
                  className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <PlusIcon className="w-4 h-4" />
                  إضافة كلمة مفتاحية
                </button>
              </div>
            </div>

            {/* ربط بخدمة */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">ربط بخدمة</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اختر الخدمة (اختياري)
                  </label>
                  <select
                    value={formData.serviceId || ''}
                    onChange={(e) => handleInputChange('serviceId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- لا توجد خدمة --</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>{service.title}</option>
                    ))}
                  </select>
                </div>

                {formData.serviceId && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showInServiceGallery"
                      checked={formData.showInServiceGallery || false}
                      onChange={(e) => handleInputChange('showInServiceGallery', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="showInServiceGallery" className="mr-2 text-sm text-gray-700">
                      عرض في معرض الخدمة
                    </label>
                  </div>
                )}

                {formData.serviceId && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      💡 سيتم ربط هذا العمل بالخدمة المختارة. إذا فعلت "عرض في معرض الخدمة"، 
                      سيظهر هذا العمل في صفحة الخدمة ضمن معرض الأعمال السابقة.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* إعدادات النشر */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">إعدادات النشر</h2>
              
              <div className="flex gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => handleInputChange('published', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="published" className="mr-2 text-sm text-gray-700">
                    نشر العمل (سيظهر للزوار)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="mr-2 text-sm text-gray-700">
                    عمل مميز (سيظهر في المقدمة)
                  </label>
                </div>
              </div>
            </div>

            {/* حفظ */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري حفظ التعديلات...
                  </span>
                ) : (
                  'حفظ التعديلات'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/portfolio')}
                disabled={submitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              تم التحديث بنجاح! ✨
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 mb-6"
            >
              تم حفظ جميع التعديلات على العمل
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-2 text-sm text-gray-500"
            >
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري الانتقال لصفحة إدارة الأعمال...
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}