'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

import {
  ArrowLeftIcon,
  PhotoIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

// تصنيفات معرض الأعمال
const portfolioCategories = [
  { id: 'CONSTRUCTION', name: 'التشييد والبناء' },
  { id: 'FINISHING', name: 'التشطيبات الداخلية' },
  { id: 'FURNITURE', name: 'الأثاث والديكور' },
  { id: 'KITCHENS', name: 'المطابخ' }
]

export default function AddPortfolioPage() {
  const router = useRouter()
  const [services, setServices] = useState<any[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  
  const [formData, setFormData] = useState({
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
    showInServiceGallery: false
  })

  const [mainImage, setMainImage] = useState<File | null>(null)
  const [mainImageCloudinary, setMainImageCloudinary] = useState<{url: string, publicId: string} | null>(null)
  const [galleryImages, setGalleryImages] = useState<File[]>([])
  const [galleryCloudinaryImages, setGalleryCloudinaryImages] = useState<{url: string, publicId: string}[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})

  // Fetch services on mount
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
    fetchServices()
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

  // رفع الصور إلى Cloudinary
  const uploadImages = async () => {
    const uploadedCloudinaryImages: {url: string, publicId: string}[] = []
    
    // رفع الصورة الرئيسية
    let mainImageData = { url: '/images/placeholder.jpg', publicId: '' }
    if (mainImage) {
      setUploadProgress(prev => ({ ...prev, main: 0 }))
      const formData = new FormData()
      formData.append('file', mainImage)
      formData.append('type', 'portfolio')
      
      try {
        setUploadProgress(prev => ({ ...prev, main: 50 }))
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        const data = await response.json()
        if (data.success) {
          mainImageData = { url: data.url, publicId: data.publicId }
          setMainImageCloudinary(mainImageData)
          setUploadProgress(prev => ({ ...prev, main: 100 }))
        }
      } catch (error) {
        console.error('خطأ في رفع الصورة الرئيسية إلى Cloudinary:', error)
        setUploadProgress(prev => ({ ...prev, main: -1 }))
      }
    }

    // رفع صور المعرض
    for (let i = 0; i < galleryImages.length; i++) {
      const image = galleryImages[i]
      const progressKey = `gallery-${i}`
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
          uploadedCloudinaryImages.push({ url: data.url, publicId: data.publicId })
          setUploadProgress(prev => ({ ...prev, [progressKey]: 100 }))
        }
      } catch (error) {
        console.error('خطأ في رفع صورة المعرض إلى Cloudinary:', error)
        setUploadProgress(prev => ({ ...prev, [progressKey]: -1 }))
      }
    }

    setGalleryCloudinaryImages(uploadedCloudinaryImages)
    return { 
      mainImageUrl: mainImageData.url,
      mainImagePublicId: mainImageData.publicId,
      galleryImages: uploadedCloudinaryImages.map(img => img.url),
      galleryPublicIds: uploadedCloudinaryImages.map(img => img.publicId)
    }
  }

  // حفظ العمل
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.location || !formData.client) {
      alert('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    try {
      setSubmitting(true)
      
      // رفع الصور إلى Cloudinary أولاً
      const { 
        mainImageUrl, 
        mainImagePublicId, 
        galleryImages: galleryUrls,
        galleryPublicIds
      } = await uploadImages()
      
      // إعداد البيانات للحفظ
      const portfolioData = {
        ...formData,
        mainImage: mainImageUrl,
        mainImagePublicId: mainImagePublicId, // حفظ معرف Cloudinary
        // تنظيف المصفوفات من القيم الفارغة
        features: formData.features.filter(f => f.trim()),
        tags: formData.tags.filter(t => t.trim()),
        challenges: formData.challenges.filter(c => c.trim()),
        solutions: formData.solutions.filter(s => s.trim()),
        technologies: formData.technologies.filter(t => t.trim()),
        teamMembers: formData.teamMembers.filter(tm => tm.trim()),
        // إضافة بيانات الخدمة
        serviceId: formData.serviceId || null,
        showInServiceGallery: formData.showInServiceGallery
      }
      
      // إرسال البيانات لـ API
      const response = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(portfolioData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        // إضافة صور المعرض إذا وجدت مع معرفات Cloudinary
        if (galleryUrls.length > 0) {
          await fetch('/api/admin/portfolio-images', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              portfolioId: data.portfolioItem.id,
              images: galleryUrls.map((url, index) => ({
                url,
                publicId: galleryPublicIds[index] || null,
                order: index + 1
              }))
            })
          })
        }
        
        alert('تم إضافة العمل بنجاح!')
        router.push('/admin/portfolio')
      } else {
        alert('حدث خطأ في إضافة العمل: ' + data.message)
      }
    } catch (error) {
      console.error('خطأ في إضافة العمل:', error)
      alert('حدث خطأ في الاتصال بالخادم')
    } finally {
      setSubmitting(false)
    }
  }

  return (
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
              <h1 className="text-3xl font-bold text-gray-900">إضافة عمل جديد</h1>
              <p className="text-gray-600">أضف عمل جديد إلى معرض أعمال الشركة</p>
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
                  <p className="text-sm text-gray-500 mt-1">
                    يُولد تلقائياً من العنوان
                  </p>
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
                    ربط بخدمة (اختياري)
                  </label>
                  <select
                    value={formData.serviceId}
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
                        checked={formData.showInServiceGallery}
                        onChange={(e) => handleInputChange('showInServiceGallery', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">عرض في معرض الخدمة</span>
                    </label>
                  )}
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
                    placeholder="مثال: 6 أشهر"
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
                    placeholder="مثال: 200 م²"
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
                    placeholder="مثال: 500 ألف جنيه"
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
                    placeholder="مثال: يناير 2024"
                  />
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
              
              {/* الصورة الرئيسية */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الصورة الرئيسية * 
                  <span className="text-xs text-gray-500">(ستُرفع إلى Cloudinary)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {mainImage ? (
                    <div className="text-center">
                      <img 
                        src={URL.createObjectURL(mainImage)} 
                        alt="Preview" 
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <p className="mt-2 text-sm text-gray-600">{mainImage.name}</p>
                      
                      {/* شريط التقدم */}
                      {uploadProgress.main !== undefined && uploadProgress.main >= 0 && (
                        <div className="mt-2">
                          <div className="bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress.main}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500">
                            {uploadProgress.main === 100 ? 'تم الرفع بنجاح إلى Cloudinary' : `جاري الرفع... ${uploadProgress.main}%`}
                          </p>
                        </div>
                      )}
                      
                      {/* خطأ الرفع */}
                      {uploadProgress.main === -1 && (
                        <p className="mt-2 text-xs text-red-500">فشل في رفع الصورة</p>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => {
                          setMainImage(null)
                          setMainImageCloudinary(null)
                          delete uploadProgress.main
                          setUploadProgress({...uploadProgress})
                        }}
                        className="mt-2 text-red-500 hover:text-red-700"
                      >
                        حذف الصورة
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                          اختر صورة (سترفع إلى Cloudinary)
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => setMainImage(e.target.files?.[0] || null)}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* معرض الصور */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  معرض الصور 
                  <span className="text-xs text-gray-500">(ستُرفع إلى Cloudinary)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {galleryImages.map((image, index) => {
                    const progressKey = `gallery-${index}`
                    const progress = uploadProgress[progressKey]
                    
                    return (
                      <div key={index} className="relative">
                        <img 
                          src={URL.createObjectURL(image)} 
                          alt={`Gallery ${index + 1}`} 
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        
                        {/* شريط التقدم لكل صورة */}
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
                        
                        {/* خطأ الرفع */}
                        {progress === -1 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-red-500 bg-opacity-80 p-1 rounded-b-lg">
                            <p className="text-xs text-white text-center">فشل</p>
                          </div>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => {
                            setGalleryImages(prev => prev.filter((_, i) => i !== index))
                            // حذف شريط التقدم أيضاً
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
                    <label className="cursor-pointer bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                      إضافة صور للمعرض
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            setGalleryImages(prev => [...prev, ...Array.from(e.target.files!)])
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
              <div className="mb-6">
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

              {/* التقنيات المستخدمة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التقنيات والمواد المستخدمة
                </label>
                {formData.technologies.map((tech, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) => updateArrayItem('technologies', index, e.target.value)}
                      placeholder="اكتب تقنية أو مادة..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('technologies', index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('technologies')}
                  className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <PlusIcon className="w-4 h-4" />
                  إضافة تقنية
                </button>
              </div>
            </div>

            {/* التحديات والحلول */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">التحديات والحلول</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* التحديات */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التحديات
                  </label>
                  {formData.challenges.map((challenge, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <textarea
                        value={challenge}
                        onChange={(e) => updateArrayItem('challenges', index, e.target.value)}
                        placeholder="اكتب تحدي..."
                        rows={2}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('challenges', index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('challenges')}
                    className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <PlusIcon className="w-4 h-4" />
                    إضافة تحدي
                  </button>
                </div>

                {/* الحلول */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحلول
                  </label>
                  {formData.solutions.map((solution, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <textarea
                        value={solution}
                        onChange={(e) => updateArrayItem('solutions', index, e.target.value)}
                        placeholder="اكتب حل..."
                        rows={2}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('solutions', index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('solutions')}
                    className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <PlusIcon className="w-4 h-4" />
                    إضافة حل
                  </button>
                </div>
              </div>
            </div>

            {/* فريق العمل وشهادة العميل */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibent text-gray-900 mb-6">فريق العمل وتقييم العميل</h2>
              
              {/* فريق العمل */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  أعضاء فريق العمل
                </label>
                {formData.teamMembers.map((member, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={member}
                      onChange={(e) => updateArrayItem('teamMembers', index, e.target.value)}
                      placeholder="اسم عضو الفريق ومنصبه..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('teamMembers', index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('teamMembers')}
                  className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <PlusIcon className="w-4 h-4" />
                  إضافة عضو فريق
                </button>
              </div>

              {/* شهادة العميل */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">شهادة العميل</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم العميل
                    </label>
                    <input
                      type="text"
                      value={formData.clientTestimonial.clientName}
                      onChange={(e) => handleInputChange('clientTestimonial', {
                        ...formData.clientTestimonial,
                        clientName: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      منصب العميل
                    </label>
                    <input
                      type="text"
                      value={formData.clientTestimonial.clientTitle}
                      onChange={(e) => handleInputChange('clientTestimonial', {
                        ...formData.clientTestimonial,
                        clientTitle: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التقييم (1-5 نجوم)
                  </label>
                  <select
                    value={formData.clientTestimonial.rating}
                    onChange={(e) => handleInputChange('clientTestimonial', {
                      ...formData.clientTestimonial,
                      rating: parseInt(e.target.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 نجوم)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 نجوم)</option>
                    <option value={3}>⭐⭐⭐ (3 نجوم)</option>
                    <option value={2}>⭐⭐ (نجمتان)</option>
                    <option value={1}>⭐ (نجمة واحدة)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تعليق العميل
                  </label>
                  <textarea
                    value={formData.clientTestimonial.comment}
                    onChange={(e) => handleInputChange('clientTestimonial', {
                      ...formData.clientTestimonial,
                      comment: e.target.value
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ما رأي العميل في العمل..."
                  />
                </div>
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
            <div className="space-y-4">
              {/* معلومات Cloudinary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  <span className="text-sm font-medium text-blue-800">معلومات Cloudinary</span>
                </div>
                <p className="text-sm text-blue-700">
                  ✅ الصور ستُرفع تلقائياً إلى Cloudinary مع تحسين الجودة والحجم
                  <br />
                  ✅ روابط الصور ستكون آمنة ومُحسّنة لسرعة التحميل
                  <br />
                  ✅ الصور ستُحفظ في مجلد: <code>amg-realestate/portfolio</code>
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري رفع الصور وحفظ العمل...
                    </span>
                  ) : (
                    'حفظ العمل (رفع إلى Cloudinary)'
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
            </div>
          </form>
        </div>
  )
}

