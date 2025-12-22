'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { logger } from '@/lib/logger'
import {
  ArrowLeftIcon,
  PlusIcon,
  PhotoIcon,
  TrashIcon
} from '@heroicons/react/24/outline'


const ICON_OPTIONS = [
  'BuildingOfficeIcon',
  'PaintBrushIcon',
  'HomeIcon',
  'MegaphoneIcon',
  'BuildingOffice2Icon',
  'WrenchScrewdriverIcon',
  'CubeTransparentIcon'
]

const COLOR_OPTIONS = [
  { name: 'أزرق', value: 'blue' },
  { name: 'برتقالي', value: 'orange' },
  { name: 'بنفسجي', value: 'purple' },
  { name: 'أخضر', value: 'green' },
  { name: 'رمادي', value: 'gray' },
  { name: 'أحمر', value: 'red' },
  { name: 'أصفر', value: 'amber' }
]

interface FormData {
  slug: string
  title: string
  description: string
  heroImage: string
  cardImage: string
  color: string
  iconName: string
  published: boolean
  featured: boolean
  order: number
}

interface Feature {
  title: string
  description: string
  iconName: string
}

interface Stat {
  number: string
  label: string
  iconName: string
}

export default function AddServicePage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState('services')
  const [adminRole] = useState('ADMIN')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    slug: '',
    title: '',
    description: '',
    heroImage: '',
    cardImage: '',
    color: 'blue',
    iconName: 'BuildingOfficeIcon',
    published: true,
    featured: false,
    order: 0
  })

  const [features, setFeatures] = useState<Feature[]>([
    { title: '', description: '', iconName: 'WrenchScrewdriverIcon' }
  ])

  const [stats, setStats] = useState<Stat[]>([
    { number: '', label: '', iconName: 'CheckCircleIcon' }
  ])

  const [projectTypes, setProjectTypes] = useState<string[]>([''])
  const [budgetRanges, setBudgetRanges] = useState<string[]>([''])
  const [timelines, setTimelines] = useState<string[]>([''])
  const [uploadingHero, setUploadingHero] = useState(false)

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingHero(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('type', 'services')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      const data = await response.json()
      
      if (data.success) {
        setFormData(prev => ({ ...prev, heroImage: data.url }))
        alert('تم رفع الصورة بنجاح')
      } else {
        alert(data.message || 'فشل رفع الصورة')
      }
    } catch (error) {
      logger.error('Error uploading image:', error)
      alert('حدث خطأ أثناء رفع الصورة')
    } finally {
      setUploadingHero(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.slug || !formData.title || !formData.description) {
      alert('الرجاء ملء جميع الحقول المطلوبة')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          features: features.filter(f => f.title && f.description),
          stats: stats.filter(s => s.number && s.label),
          formOptions: {
            projectTypes: projectTypes.filter(t => t.trim()),
            budgetRanges: budgetRanges.filter(b => b.trim()),
            timelines: timelines.filter(t => t.trim())
          }
        })
      })

      if (response.ok) {
        alert('تم إضافة الخدمة بنجاح')
        router.push('/admin/services')
      } else {
        const data = await response.json()
        alert(data.error || 'فشل في إضافة الخدمة')
      }
    } catch (error) {
      alert('حدث خطأ أثناء الإضافة')
    } finally {
      setLoading(false)
    }
  }

  const addFeature = () => {
    setFeatures([...features, { title: '', description: '', iconName: 'WrenchScrewdriverIcon' }])
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    const newFeatures = [...features]
    newFeatures[index][field] = value
    setFeatures(newFeatures)
  }

  const addStat = () => {
    setStats([...stats, { number: '', label: '', iconName: 'CheckCircleIcon' }])
  }

  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index))
  }

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    const newStats = [...stats]
    newStats[index][field] = value
    setStats(newStats)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
            <button
              onClick={() => router.push('/admin/services')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              رجوع
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">إضافة خدمة جديدة</h1>
            <p className="text-gray-600">أضف خدمة جديدة إلى قائمة خدمات الشركة</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* معلومات أساسية */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">المعلومات الأساسية</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العنوان <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الرابط (Slug) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="construction"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    صورة البطل (Hero Image)
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                          <PhotoIcon className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {uploadingHero ? 'جاري الرفع...' : 'اختر صورة من الجهاز'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleHeroImageUpload}
                          disabled={uploadingHero}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {formData.heroImage && (
                      <div className="relative">
                        <img 
                          src={formData.heroImage} 
                          alt="Hero Preview" 
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, heroImage: '' })}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اللون
                    </label>
                    <select
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {COLOR_OPTIONS.map(color => (
                        <option key={color.value} value={color.value}>{color.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الأيقونة
                    </label>
                    <select
                      value={formData.iconName}
                      onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {ICON_OPTIONS.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الترتيب
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">منشور</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">مميز</span>
                  </label>
                </div>
              </div>
            </div>

            {/* المميزات */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">المميزات</h2>
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <PlusIcon className="w-5 h-5" />
                  إضافة ميزة
                </button>
              </div>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => updateFeature(index, 'title', e.target.value)}
                          placeholder="عنوان الميزة"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <textarea
                          value={feature.description}
                          onChange={(e) => updateFeature(index, 'description', e.target.value)}
                          placeholder="وصف الميزة"
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <select
                          value={feature.iconName}
                          onChange={(e) => updateFeature(index, 'iconName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {ICON_OPTIONS.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* الإحصائيات */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">الإحصائيات</h2>
                <button
                  type="button"
                  onClick={addStat}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <PlusIcon className="w-5 h-5" />
                  إضافة إحصائية
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={stat.number}
                          onChange={(e) => updateStat(index, 'number', e.target.value)}
                          placeholder="الرقم (مثال: 200+)"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => updateStat(index, 'label', e.target.value)}
                          placeholder="التسمية (مثال: مشروع منجز)"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <select
                          value={stat.iconName}
                          onChange={(e) => updateStat(index, 'iconName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {ICON_OPTIONS.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeStat(index)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* خيارات النموذج */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">خيارات النموذج</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    أنواع المشاريع
                  </label>
                  {projectTypes.map((type, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={type}
                        onChange={(e) => {
                          const newTypes = [...projectTypes]
                          newTypes[index] = e.target.value
                          setProjectTypes(newTypes)
                        }}
                        placeholder="نوع المشروع"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setProjectTypes(projectTypes.filter((_, i) => i !== index))}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setProjectTypes([...projectTypes, ''])}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + إضافة نوع
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نطاقات الميزانية
                  </label>
                  {budgetRanges.map((range, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={range}
                        onChange={(e) => {
                          const newRanges = [...budgetRanges]
                          newRanges[index] = e.target.value
                          setBudgetRanges(newRanges)
                        }}
                        placeholder="نطاق الميزانية"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setBudgetRanges(budgetRanges.filter((_, i) => i !== index))}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setBudgetRanges([...budgetRanges, ''])}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + إضافة نطاق
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الجداول الزمنية
                  </label>
                  {timelines.map((timeline, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={timeline}
                        onChange={(e) => {
                          const newTimelines = [...timelines]
                          newTimelines[index] = e.target.value
                          setTimelines(newTimelines)
                        }}
                        placeholder="الجدول الزمني"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setTimelines(timelines.filter((_, i) => i !== index))}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setTimelines([...timelines, ''])}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    + إضافة جدول زمني
                  </button>
                </div>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? 'جاري الحفظ...' : 'حفظ الخدمة'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/services')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
  )
}

