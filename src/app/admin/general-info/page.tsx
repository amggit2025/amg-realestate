'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  InformationCircleIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShareIcon
} from '@heroicons/react/24/outline'

interface HeroStats {
  yearsOfExperience: number
  completedProjects: number
  happyClients: number
  clientSatisfaction: number
  heroImage?: string
  heroImagePublicId?: string
}

interface TestimonialStats {
  happyClients: number
  satisfactionRate: number
  averageRating: number
  yearsOfExperience: number
}

interface FooterInfo {
  title: string
  subtitle: string
  yearsExperience: number
  happyClients: number
  completedProjects: number
  contactPhone: string
  contactEmail: string
  address: string
  whatsapp: string
}

interface PortfolioStats {
  totalProjects: number
  happyClients: number
  averageRating: number
  totalViews: number
}

interface SocialLinksData {
  facebook?: string
  instagram?: string
  linkedin?: string
  tiktok?: string
  twitter?: string
  youtube?: string
  whatsapp?: string
  snapchat?: string
}

export default function GeneralInfoPage() {
  const [activeTab, setActiveTab] = useState('hero')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  // Hero Stats State
  const [heroStats, setHeroStats] = useState<HeroStats>({
    yearsOfExperience: 15,
    completedProjects: 200,
    happyClients: 500,
    clientSatisfaction: 98,
    heroImage: '',
    heroImagePublicId: ''
  })

  // Testimonial Stats State
  const [testimonialStats, setTestimonialStats] = useState<TestimonialStats>({
    happyClients: 5000,
    satisfactionRate: 99,
    averageRating: 4.9,
    yearsOfExperience: 15
  })

  // Footer Info State
  const [footerInfo, setFooterInfo] = useState<FooterInfo>({
    title: "🏆 AMG Real Estate - شريكك الموثوق في عالم العقارات",
    subtitle: "ابدأ رحلتك العقارية معنا اليوم",
    yearsExperience: 15,
    happyClients: 5000,
    completedProjects: 200,
    contactPhone: "+20 123 456 7890",
    contactEmail: "info@amgrealestate.com",
    address: "القاهرة، مصر",
    whatsapp: ""
  })

  // Portfolio Stats State
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats>({
    totalProjects: 50,
    happyClients: 125,
    averageRating: 4.8,
    totalViews: 12000
  })

  // Social Links State
  const [socialLinks, setSocialLinks] = useState<SocialLinksData>({
    facebook: '',
    instagram: '',
    linkedin: '',
    tiktok: '',
    twitter: '',
    youtube: '',
    whatsapp: '',
    snapchat: '',
  })

  // جلب البيانات الحالية عند التحميل
  useEffect(() => {
    fetchHeroStats()
    fetchTestimonialStats()
    fetchFooterInfo()
    fetchPortfolioStats()
    fetchSocialLinks()
  }, [])

  const fetchHeroStats = async () => {
    try {
      const response = await fetch('/api/hero-stats')
      const data = await response.json()
      
      if (data.success && data.data) {
        setHeroStats({
          yearsOfExperience: data.data.yearsOfExperience,
          completedProjects: data.data.completedProjects,
          happyClients: data.data.happyClients,
          clientSatisfaction: data.data.clientSatisfaction,
          heroImage: data.data.heroImage || '',
          heroImagePublicId: data.data.heroImagePublicId || ''
        })
      }
    } catch (err) {
      console.error('Error fetching hero stats:', err)
    }
  }

  const fetchTestimonialStats = async () => {
    try {
      const response = await fetch('/api/testimonial-stats')
      const data = await response.json()
      
      if (data.success && data.data) {
        setTestimonialStats({
          happyClients: data.data.happyClients,
          satisfactionRate: data.data.satisfactionRate,
          averageRating: data.data.averageRating,
          yearsOfExperience: data.data.yearsOfExperience
        })
      }
    } catch (err) {
      console.error('Error fetching testimonial stats:', err)
    }
  }

  const fetchFooterInfo = async () => {
    try {
      const response = await fetch('/api/footer-info')
      const data = await response.json()
      
      if (data.success && data.data) {
        setFooterInfo({
          title: data.data.title,
          subtitle: data.data.subtitle,
          yearsExperience: data.data.yearsExperience,
          happyClients: data.data.happyClients,
          completedProjects: data.data.completedProjects,
          contactPhone: data.data.contactPhone,
          contactEmail: data.data.contactEmail,
          address: data.data.address,
          whatsapp: data.data.whatsapp || ""
        })
      }
    } catch (err) {
      console.error('Error fetching footer info:', err)
    }
  }

  // حذف صورة Hero من Cloudinary
  const deleteHeroImage = async (publicId: string) => {
    if (!publicId || publicId === '') return

    try {
      const response = await fetch('/api/delete-image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
      })
      
      const data = await response.json()
      if (data.success) {
        console.log('✅ تم حذف صورة Hero القديمة من Cloudinary')
      } else {
        console.warn('⚠️ فشل حذف صورة Hero القديمة:', data.message)
      }
    } catch (err) {
      console.error('❌ خطأ في حذف صورة Hero القديمة:', err)
    }
  }

  // رفع صورة Hero
  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار صورة فقط')
      return
    }

    // التحقق من حجم الملف (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة يجب أن يكون أقل من 5 ميجابايت')
      return
    }

    setLoading(true)
    setError('')

    try {
      // 🗑️ حذف الصورة القديمة من Cloudinary قبل رفع الجديدة
      if (heroStats.heroImagePublicId) {
        await deleteHeroImage(heroStats.heroImagePublicId)
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'hero')

      // إنشاء AbortController للتحكم في timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 seconds timeout

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setHeroStats(prev => ({
          ...prev,
          heroImage: data.url,
          heroImagePublicId: data.publicId
        }))
        setSuccess(true)
        setTimeout(() => setSuccess(false), 2000)
      } else {
        setError(data.message || 'فشل رفع الصورة')
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('انتهت مهلة رفع الصورة. يرجى المحاولة مرة أخرى')
      } else {
        setError('حدث خطأ أثناء رفع الصورة: ' + (err.message || 'غير معروف'))
      }
      console.error('Upload error:', err)
    } finally {
      setLoading(false)
    }
  }

  // حذف صورة Hero نهائياً
  const handleDeleteHeroImage = async () => {
    if (!heroStats.heroImagePublicId) {
      setError('لا توجد صورة لحذفها')
      return
    }

    if (!confirm('هل أنت متأكد من حذف صورة Hero؟ سيتم استخدام الصورة الافتراضية.')) {
      return
    }

    setLoading(true)
    setError('')

    try {
      // حذف من Cloudinary
      await deleteHeroImage(heroStats.heroImagePublicId)

      // تحديث الحالة
      setHeroStats(prev => ({
        ...prev,
        heroImage: '',
        heroImagePublicId: ''
      }))

      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      setError('حدث خطأ أثناء حذف الصورة')
      console.error('Delete error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveHeroStats = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError('')

    try {
      const response = await fetch('/api/hero-stats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(heroStats),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(data.message || 'حدث خطأ')
      }
    } catch (err) {
      setError('حدث خطأ في حفظ البيانات')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTestimonialStats = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError('')

    try {
      const response = await fetch('/api/testimonial-stats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonialStats),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(data.message || 'حدث خطأ')
      }
    } catch (err) {
      setError('حدث خطأ في حفظ البيانات')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveFooterInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError('')

    try {
      const response = await fetch('/api/footer-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(footerInfo),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(data.message || 'حدث خطأ')
      }
    } catch (err) {
      setError('حدث خطأ في حفظ البيانات')
    } finally {
      setLoading(false)
    }
  }

  const fetchPortfolioStats = async () => {
    try {
      const response = await fetch('/api/portfolio-stats')
      const data = await response.json()
      
      if (data.success && data.data) {
        setPortfolioStats(data.data)
      }
    } catch (err) {
      console.error('Error fetching portfolio stats:', err)
    }
  }

  const handleSavePortfolioStats = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError('')

    try {
      const response = await fetch('/api/portfolio-stats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolioStats),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(data.message || 'حدث خطأ')
      }
    } catch (err) {
      setError('حدث خطأ في حفظ البيانات')
    } finally {
      setLoading(false)
    }
  }

  const fetchSocialLinks = async () => {
    try {
      const response = await fetch('/api/social-links')
      const data = await response.json()
      
      if (data.success && data.data) {
        setSocialLinks({
          facebook: data.data.facebook || '',
          instagram: data.data.instagram || '',
          linkedin: data.data.linkedin || '',
          tiktok: data.data.tiktok || '',
          twitter: data.data.twitter || '',
          youtube: data.data.youtube || '',
          whatsapp: data.data.whatsapp || '',
          snapchat: data.data.snapchat || '',
        })
      }
    } catch (err) {
      console.error('Error fetching social links:', err)
    }
  }

  const handleSaveSocialLinks = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError('')

    try {
      const response = await fetch('/api/social-links', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(socialLinks),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(data.message || 'حدث خطأ')
      }
    } catch (err) {
      setError('حدث خطأ في حفظ البيانات')
    } finally {
      setLoading(false)
    }
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
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <InformationCircleIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">معلومات عامة</h1>
              <p className="text-gray-600 mt-1">إدارة محتوى الصفحة الرئيسية</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 space-x-reverse">
              <button
                onClick={() => setActiveTab('hero')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'hero'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <ChartBarIcon className="w-5 h-5" />
                  <span>إحصائيات Hero</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('testimonials')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'testimonials'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <ChartBarIcon className="w-5 h-5" />
                  <span>إحصائيات آراء العملاء</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('footer')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'footer'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <InformationCircleIcon className="w-5 h-5" />
                  <span>معلومات Footer</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('portfolio')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'portfolio'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <ChartBarIcon className="w-5 h-5" />
                  <span>إحصائيات معرض الأعمال</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('social')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'social'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <ShareIcon className="w-5 h-5" />
                  <span>روابط السوشيال ميديا</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3 space-x-reverse"
          >
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
            <span className="text-green-800 font-medium">تم الحفظ بنجاح!</span>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3 space-x-reverse"
          >
            <XCircleIcon className="w-6 h-6 text-red-600" />
            <span className="text-red-800 font-medium">{error}</span>
          </motion.div>
        )}

        {/* Hero Stats Form */}
        {activeTab === 'hero' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">إحصائيات منطقة Hero</h2>
              <p className="text-gray-600">البيانات التي تظهر في القسم الرئيسي للصفحة الرئيسية</p>
            </div>

            <form onSubmit={handleSaveHeroStats} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* سنين الخبرة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سنين الخبرة
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={heroStats.yearsOfExperience}
                    onChange={(e) => setHeroStats({ ...heroStats, yearsOfExperience: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">عدد سنوات الخبرة للشركة</p>
                </div>

                {/* مشاريع منجزة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مشاريع منجزة
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={heroStats.completedProjects}
                    onChange={(e) => setHeroStats({ ...heroStats, completedProjects: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">عدد المشاريع المنجزة</p>
                </div>

                {/* عملاء سعداء */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عملاء سعداء
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={heroStats.happyClients}
                    onChange={(e) => setHeroStats({ ...heroStats, happyClients: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">عدد العملاء السعداء</p>
                </div>

                {/* رضاء العملاء */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رضاء العملاء (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={heroStats.clientSatisfaction}
                    onChange={(e) => setHeroStats({ ...heroStats, clientSatisfaction: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">نسبة رضاء العملاء (من 0 إلى 100)</p>
                </div>
              </div>

              {/* صورة خلفية Hero */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صورة خلفية Hero Section
                </label>
                
                {heroStats.heroImage && (
                  <div className="mb-4 relative group">
                    <img 
                      src={heroStats.heroImage} 
                      alt="Hero Background" 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleDeleteHeroImage}
                        disabled={loading}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2 disabled:opacity-50"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        حذف من Cloudinary
                      </button>
                      <div className="text-white text-sm bg-black/70 px-3 py-1 rounded">
                        💾 مساحة: {heroStats.heroImagePublicId ? '~2MB' : '0MB'}
                      </div>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    📸 اختر صورة عالية الجودة للخلفية (يفضل 1920x1080 أو أكبر، حجم أقصى 5MB)
                  </p>
                  <p className="mt-1 text-xs text-amber-600 font-medium">
                    ⚠️ عند رفع صورة جديدة، سيتم حذف الصورة القديمة تلقائياً من Cloudinary لتوفير المساحة
                  </p>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">معاينة:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{heroStats.yearsOfExperience}+</div>
                    <div className="text-sm text-gray-600 mt-1">سنة خبرة</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{heroStats.completedProjects}+</div>
                    <div className="text-sm text-gray-600 mt-1">مشروع منجز</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{heroStats.happyClients}+</div>
                    <div className="text-sm text-gray-600 mt-1">عميل سعيد</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">{heroStats.clientSatisfaction}%</div>
                    <div className="text-sm text-gray-600 mt-1">رضاء العملاء</div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Testimonial Stats Form */}
        {activeTab === 'testimonials' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">إحصائيات آراء العملاء</h2>
              <p className="text-gray-600">البيانات التي تظهر في قسم آراء العملاء (تحت التقييمات)</p>
            </div>

            <form onSubmit={handleSaveTestimonialStats} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* عملاء سعداء */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عملاء سعداء
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={testimonialStats.happyClients}
                    onChange={(e) => setTestimonialStats({ ...testimonialStats, happyClients: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">عدد العملاء السعداء</p>
                </div>

                {/* نسبة الرضا */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نسبة الرضا (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={testimonialStats.satisfactionRate}
                    onChange={(e) => setTestimonialStats({ ...testimonialStats, satisfactionRate: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">نسبة رضا العملاء (من 0 إلى 100)</p>
                </div>

                {/* متوسط التقييم */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    متوسط التقييم (من 5)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={testimonialStats.averageRating}
                    onChange={(e) => setTestimonialStats({ ...testimonialStats, averageRating: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">متوسط التقييم (مثال: 4.9)</p>
                </div>

                {/* سنين الخبرة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سنين الخبرة
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={testimonialStats.yearsOfExperience}
                    onChange={(e) => setTestimonialStats({ ...testimonialStats, yearsOfExperience: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">عدد سنوات الخبرة</p>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">معاينة:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{testimonialStats.happyClients}+</div>
                    <div className="text-sm text-gray-600 mt-1">عميل سعيد</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{testimonialStats.satisfactionRate}%</div>
                    <div className="text-sm text-gray-600 mt-1">نسبة الرضا</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-3xl font-bold text-yellow-600">{testimonialStats.averageRating}/5</div>
                    <div className="text-sm text-gray-600 mt-1">التقييم</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{testimonialStats.yearsOfExperience}+</div>
                    <div className="text-sm text-gray-600 mt-1">سنة خبرة</div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Footer Info Form */}
        {activeTab === 'footer' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">معلومات الفوتر</h2>
              <p className="text-gray-600">بيانات التواصل والإحصائيات في أسفل الصفحة</p>
            </div>

            <form onSubmit={handleSaveFooterInfo} className="space-y-8">
              {/* Title and Subtitle */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان الرئيسي
                  </label>
                  <textarea
                    value={footerInfo.title}
                    onChange={(e) => setFooterInfo({ ...footerInfo, title: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="AMG Real Estate - شريكك الموثوق في عالم العقارات"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان الفرعي
                  </label>
                  <input
                    type="text"
                    value={footerInfo.subtitle}
                    onChange={(e) => setFooterInfo({ ...footerInfo, subtitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ابدأ رحلتك العقارية معنا اليوم"
                  />
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سنوات الخبرة
                  </label>
                  <input
                    type="number"
                    value={footerInfo.yearsExperience}
                    onChange={(e) => setFooterInfo({ ...footerInfo, yearsExperience: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العملاء السعداء
                  </label>
                  <input
                    type="number"
                    value={footerInfo.happyClients}
                    onChange={(e) => setFooterInfo({ ...footerInfo, happyClients: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المشاريع المنجزة
                  </label>
                  <input
                    type="number"
                    value={footerInfo.completedProjects}
                    onChange={(e) => setFooterInfo({ ...footerInfo, completedProjects: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="200"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="text"
                    value={footerInfo.contactPhone}
                    onChange={(e) => setFooterInfo({ ...footerInfo, contactPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+20 123 456 7890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={footerInfo.contactEmail}
                    onChange={(e) => setFooterInfo({ ...footerInfo, contactEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="info@amgrealestate.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان
                  </label>
                  <input
                    type="text"
                    value={footerInfo.address}
                    onChange={(e) => setFooterInfo({ ...footerInfo, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="القاهرة، مصر"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    واتساب (اختياري)
                  </label>
                  <input
                    type="text"
                    value={footerInfo.whatsapp || ''}
                    onChange={(e) => setFooterInfo({ ...footerInfo, whatsapp: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+20 123 456 7890"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">معاينة:</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="text-xl font-bold text-gray-900">{footerInfo.title}</h4>
                    <p className="text-gray-600 mt-1">{footerInfo.subtitle}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{footerInfo.yearsExperience}+</div>
                      <div className="text-sm text-gray-600 mt-1">سنة خبرة</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{footerInfo.happyClients}+</div>
                      <div className="text-sm text-gray-600 mt-1">عميل راضي</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{footerInfo.completedProjects}+</div>
                      <div className="text-sm text-gray-600 mt-1">مشروع منجز</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-medium hover:from-orange-700 hover:to-red-700 transition-all ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Portfolio Stats Form */}
        {activeTab === 'portfolio' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">إحصائيات معرض الأعمال</h2>
              <p className="text-gray-600">البيانات التي تظهر أسفل معرض الأعمال في الصفحة الرئيسية</p>
            </div>

            <form onSubmit={handleSavePortfolioStats} className="space-y-8">
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    إجمالي المشاريع
                  </label>
                  <input
                    type="number"
                    value={portfolioStats.totalProjects}
                    onChange={(e) => setPortfolioStats({ ...portfolioStats, totalProjects: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العملاء السعداء
                  </label>
                  <input
                    type="number"
                    value={portfolioStats.happyClients}
                    onChange={(e) => setPortfolioStats({ ...portfolioStats, happyClients: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="125"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التقييم العام (من 5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={portfolioStats.averageRating}
                    onChange={(e) => setPortfolioStats({ ...portfolioStats, averageRating: parseFloat(e.target.value) || 0 })}
                    min="0"
                    max="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="4.8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    إجمالي المشاهدات
                  </label>
                  <input
                    type="number"
                    value={portfolioStats.totalViews}
                    onChange={(e) => setPortfolioStats({ ...portfolioStats, totalViews: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="12000"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="mt-8 p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">معاينة:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-teal-600">{portfolioStats.totalProjects}+</div>
                    <div className="text-sm text-gray-600 mt-1">مشروع منجز</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-teal-600">{portfolioStats.happyClients}+</div>
                    <div className="text-sm text-gray-600 mt-1">عميل راضي</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-teal-600">{portfolioStats.averageRating}</div>
                    <div className="text-sm text-gray-600 mt-1">تقييم عام</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-teal-600">
                      {portfolioStats.totalViews > 1000 ? `${Math.round(portfolioStats.totalViews / 1000)}K+` : `${portfolioStats.totalViews}+`}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">مشاهدة</div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-medium hover:from-teal-700 hover:to-cyan-700 transition-all ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Social Links Form */}
        {activeTab === 'social' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">روابط السوشيال ميديا</h2>
              <p className="text-gray-600">إدارة روابط حسابات الشركة على منصات التواصل الاجتماعي</p>
            </div>

            <form onSubmit={handleSaveSocialLinks} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Facebook */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-2xl">📘</span>
                    فيسبوك
                  </label>
                  <input
                    type="text"
                    value={socialLinks.facebook || ''}
                    onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                    placeholder="https://facebook.com/yourpage"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-2xl">📷</span>
                    انستجرام
                  </label>
                  <input
                    type="text"
                    value={socialLinks.instagram || ''}
                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                    placeholder="https://instagram.com/yourprofile"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-2xl">💼</span>
                    لينكد إن
                  </label>
                  <input
                    type="text"
                    value={socialLinks.linkedin || ''}
                    onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/company/yourcompany"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>

                {/* TikTok */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-2xl">🎵</span>
                    تيك توك
                  </label>
                  <input
                    type="text"
                    value={socialLinks.tiktok || ''}
                    onChange={(e) => setSocialLinks({ ...socialLinks, tiktok: e.target.value })}
                    placeholder="https://tiktok.com/@yourprofile"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>

                {/* Twitter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-2xl">🐦</span>
                    تويتر (X)
                  </label>
                  <input
                    type="text"
                    value={socialLinks.twitter || ''}
                    onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                    placeholder="https://twitter.com/yourprofile"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>

                {/* YouTube */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-2xl">📹</span>
                    يوتيوب
                  </label>
                  <input
                    type="text"
                    value={socialLinks.youtube || ''}
                    onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                    placeholder="https://youtube.com/@yourchannel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-2xl">💬</span>
                    واتساب
                  </label>
                  <input
                    type="text"
                    value={socialLinks.whatsapp || ''}
                    onChange={(e) => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })}
                    placeholder="+201234567890"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>

                {/* Snapchat */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-2xl">👻</span>
                    سناب شات
                  </label>
                  <input
                    type="text"
                    value={socialLinks.snapchat || ''}
                    onChange={(e) => setSocialLinks({ ...socialLinks, snapchat: e.target.value })}
                    placeholder="https://snapchat.com/add/yourprofile"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-blue-900 font-bold mb-3 flex items-center gap-2">
                  ℹ️ ملاحظات هامة
                </h3>
                <ul className="text-blue-800 space-y-2 text-sm">
                  <li>• تأكد من إدخال الروابط كاملة بما في ذلك https://</li>
                  <li>• بالنسبة لواتساب، ادخل رقم الهاتف مع كود الدولة (مثال: +201234567890)</li>
                  <li>• يمكنك ترك أي حقل فارغاً إذا لم يكن لديك حساب على المنصة</li>
                  <li>• الروابط ستظهر في Footer الموقع وصفحة التواصل</li>
                </ul>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  )
}
