'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  InformationCircleIcon,
  CheckCircleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'

interface AboutPageData {
  companyName: string
  companyFullName: string
  foundedYear: number
  founderImage: string | null
  yearsOfExperience: number
  completedProjects: number
  happyClients: number
  teamSize: number
  ourStory: string
  vision: string
  mission: string
  values: Array<{title: string, description: string}>
  principles: string[]
  tagline: string
}

export default function AboutPageAdmin() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  
  const [data, setData] = useState<AboutPageData>({
    companyName: "مجموعة أحمد الملاح",
    companyFullName: "مجموعة أحمد الملاح للمقاولات والتشطيبات والتسويق العقاري",
    foundedYear: 2009,
    founderImage: null,
    yearsOfExperience: 15,
    completedProjects: 500,
    happyClients: 1000,
    teamSize: 50,
    ourStory: "",
    vision: "",
    mission: "",
    values: [
      {title: "الالتزام", description: "نلتزم بتسليم مشاريعنا في الوقت المحدد"},
      {title: "الكفاءة", description: "فريق عمل محترف ومدرب على أعلى مستوى"},
      {title: "الإبداع", description: "حلول مبتكرة لكل تحدي نواجهه"},
      {title: "الجودة", description: "أعلى معايير الجودة في التنفيذ"}
    ],
    principles: [
      "الشفافية الكاملة في التعامل",
      "استخدام أفضل المواد والخامات",
      "الالتزام بالمواعيد المحددة",
      "خدمة ما بعد البيع المتميزة",
      "أسعار تنافسية وعادلة"
    ],
    tagline: "شريكك الموثوق في عالم العقارات"
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/about-page')
      const result = await response.json()
      
      if (result.success && result.data) {
        // Parse values and principles if they're strings
        const parsedData = {
          ...result.data,
          values: typeof result.data.values === 'string' 
            ? JSON.parse(result.data.values) 
            : result.data.values,
          principles: typeof result.data.principles === 'string'
            ? JSON.parse(result.data.principles)
            : result.data.principles
        }
        setData(parsedData)
      }
    } catch (err) {
      console.error('Error fetching about page data:', err)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      
      // Create FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'about-page')
      
      // Upload to Cloudinary via API
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      const uploadData = await uploadResponse.json()
      
      if (uploadData.success) {
        setData({ ...data, founderImage: uploadData.url })
      } else {
        setError(uploadData.message || 'فشل رفع الصورة')
      }
      setUploadingImage(false)
    } catch (error) {
      console.error('Error uploading image:', error)
      setError('فشل رفع الصورة')
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError('')

    try {
      const response = await fetch('/api/about-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(result.message || 'حدث خطأ')
      }
    } catch (err) {
      setError('حدث خطأ في حفظ البيانات')
    } finally {
      setLoading(false)
    }
  }

  const updateValue = (index: number, field: 'title' | 'description', value: string) => {
    const newValues = [...data.values]
    newValues[index][field] = value
    setData({ ...data, values: newValues })
  }

  const updatePrinciple = (index: number, value: string) => {
    const newPrinciples = [...data.principles]
    newPrinciples[index] = value
    setData({ ...data, principles: newPrinciples })
  }

  const addPrinciple = () => {
    setData({ ...data, principles: [...data.principles, "مبدأ جديد"] })
  }

  const removePrinciple = (index: number) => {
    const newPrinciples = data.principles.filter((_, i) => i !== index)
    setData({ ...data, principles: newPrinciples })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 space-x-reverse mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
              <InformationCircleIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة صفحة من نحن</h1>
              <p className="text-gray-600 mt-1">تحديث محتوى صفحة من نحن</p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">معلومات الشركة</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الشركة
                </label>
                <input
                  type="text"
                  value={data.companyName}
                  onChange={(e) => setData({ ...data, companyName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  سنة التأسيس
                </label>
                <input
                  type="number"
                  value={data.foundedYear}
                  onChange={(e) => setData({ ...data, foundedYear: parseInt(e.target.value) || 2009 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل للشركة
                </label>
                <input
                  type="text"
                  value={data.companyFullName}
                  onChange={(e) => setData({ ...data, companyFullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صورة المؤسس
                </label>
                <div className="flex items-center gap-4">
                  {data.founderImage && (
                    <img 
                      src={data.founderImage} 
                      alt="Founder" 
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  )}
                  <label className="cursor-pointer bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                    {uploadingImage ? 'جاري الرفع...' : 'رفع صورة'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">الإحصائيات</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  سنوات الخبرة
                </label>
                <input
                  type="number"
                  value={data.yearsOfExperience}
                  onChange={(e) => setData({ ...data, yearsOfExperience: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المشاريع المنجزة
                </label>
                <input
                  type="number"
                  value={data.completedProjects}
                  onChange={(e) => setData({ ...data, completedProjects: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العملاء السعداء
                </label>
                <input
                  type="number"
                  value={data.happyClients}
                  onChange={(e) => setData({ ...data, happyClients: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حجم الفريق
                </label>
                <input
                  type="number"
                  value={data.teamSize}
                  onChange={(e) => setData({ ...data, teamSize: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Story, Vision, Mission */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">القصة والرؤية والمهمة</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  قصتنا
                </label>
                <textarea
                  value={data.ourStory}
                  onChange={(e) => setData({ ...data, ourStory: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="اكتب قصة الشركة..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رؤيتنا
                  </label>
                  <textarea
                    value={data.vision}
                    onChange={(e) => setData({ ...data, vision: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="اكتب الرؤية..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مهمتنا
                  </label>
                  <textarea
                    value={data.mission}
                    onChange={(e) => setData({ ...data, mission: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="اكتب المهمة..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الشعار
                </label>
                <input
                  type="text"
                  value={data.tagline}
                  onChange={(e) => setData({ ...data, tagline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">القيم الأساسية (4)</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {data.values.map((value, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <input
                    type="text"
                    value={value.title}
                    onChange={(e) => updateValue(index, 'title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 font-semibold"
                    placeholder="العنوان"
                  />
                  <textarea
                    value={value.description}
                    onChange={(e) => updateValue(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="الوصف"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Principles */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">المبادئ</h2>
              <button
                type="button"
                onClick={addPrinciple}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                + إضافة مبدأ
              </button>
            </div>
            
            <div className="space-y-3">
              {data.principles.map((principle, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={principle}
                    onChange={(e) => updatePrinciple(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  {data.principles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePrinciple(index)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      حذف
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>

            {success && (
              <span className="text-green-600 flex items-center">
                <CheckCircleIcon className="w-5 h-5 ml-2" />
                تم الحفظ بنجاح
              </span>
            )}

            {error && (
              <span className="text-red-600">
                {error}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
