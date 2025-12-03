'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ImageLoader } from '@/components/ui'
import { 
  MapPinIcon, 
  HomeIcon, 
  CurrencyDollarIcon, 
  CalendarIcon,
  BuildingOfficeIcon,
  PhotoIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

// TypeScript interfaces
interface ProjectDetail {
  id: string
  title: string
  location: string
  type: string
  price: string
  bedrooms: number
  area: number
  description: string
  mainImage: string
  images: { id: string; url: string; alt: string }[]
  features: string[]
  specifications: { [key: string]: any }
  paymentPlan: any[]
  locationDetails: { [key: string]: any }
  deliveryDate: string
  developer: string
  contactName: string
  contactPhone: string
  contactEmail: string
  totalUnits: number
  availableUnits: number
  minPrice: string
  maxPrice: string
  currency: string
  status: string
  featured: boolean
}

// Fallback project data for demonstration
const fallbackProjectData = {
  1: {
    id: 1,
    title: 'كمبوند النخيل الجديد',
    location: 'القاهرة الجديدة',
    type: 'شقق سكنية',
    status: 'متاح للبيع',
    price: '2,500,000',
    area: '150',
    completionDate: '2025',
    developer: 'AMG Development',
    description: 'مشروع سكني متكامل في قلب القاهرة الجديدة مع جميع الخدمات والمرافق الحديثة. يقع المشروع في موقع استراتيجي يوفر سهولة الوصول لجميع المناطق المهمة.',
    features: [
      'حمام سباحة أوليمبي',
      'نادي صحي متكامل',
      'منطقة ألعاب للأطفال',
      'أمن وحراسة 24/7',
      'منطقة تجارية',
      'كافيتريا ومطاعم',
      'مساحات خضراء واسعة',
      'مواقف سيارات مظللة'
    ],
    gallery: [
      '/images/project-1-1.jpg',
      '/images/project-1-2.jpg',
      '/images/project-1-3.jpg',
      '/images/project-1-4.jpg',
      '/images/project-1-5.jpg'
    ],
    specifications: {
      floors: '8 طوابق',
      apartments: '120 شقة',
      unitTypes: ['استوديو', 'شقة غرفة واحدة', 'شقتين غرف', 'ثلاث غرف'],
      areas: '80-200 متر مربع',
      parking: 'جراج تحت أرضي',
      elevator: '2 مصعد'
    },
    paymentPlan: [
      { step: 'دفعة مقدمة', percentage: '10%', description: 'عند التعاقد' },
      { step: 'دفعة ثانية', percentage: '15%', description: 'بعد 3 أشهر' },
      { step: 'دفعة ثالثة', percentage: '25%', description: 'عند الانتهاء من الهيكل' },
      { step: 'الباقي', percentage: '50%', description: 'عند الاستلام' }
    ],
    location_details: {
      nearby: [
        'الجامعة الأمريكية - 10 دقائق',
        'مول كايرو فيستيفال - 15 دقيقة',
        'مطار القاهرة الدولي - 30 دقيقة',
        'وسط البلد - 45 دقيقة'
      ]
    }
  }
  // يمكن إضافة باقي المشاريع هنا...
}

export default function ProjectDetailsPage() {
  const params = useParams()
  const projectId = params.id as string

  // State management
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/projects/${projectId}`)
        const data = await response.json()

        if (data.success) {
          setProject(data.data)
        } else {
          setError(data.message || 'خطأ في جلب المشروع')
        }
      } catch (error) {
        console.error('Error fetching project:', error)
        setError('خطأ في الاتصال بالخادم')
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  // تأخير قصير لإظهار الـ loading animation للصور
  useEffect(() => {
    if (project) {
      const timer = setTimeout(() => {
        setImageLoading(false)
      }, 1500)
      
      return () => clearTimeout(timer)
    }
  }, [project])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">جاري تحميل تفاصيل المشروع...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              href="/projects"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              العودة للمشاريع
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // إذا لم يوجد المشروع
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">المشروع غير موجود</h1>
          <Link href="/projects" className="text-blue-600 hover:text-blue-700">
            العودة لصفحة المشاريع
          </Link>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    if (!project || project.images.length <= 1) return
    setImageLoading(true)
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length)
    setTimeout(() => setImageLoading(false), 800)
  }

  const prevImage = () => {
    if (!project || project.images.length <= 1) return
    setImageLoading(true)
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
    setTimeout(() => setImageLoading(false), 800)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // هنا سيتم إرسال البيانات للسيرفر
    console.log('Form submitted:', formData)
    setShowContactForm(false)
    // يمكن إضافة رسالة نجاح
  }

  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <nav className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">الرئيسية</Link>
            <ChevronLeftIcon className="w-4 h-4 mx-2" />
            <Link href="/projects" className="hover:text-blue-600">المشاريع</Link>
            <ChevronLeftIcon className="w-4 h-4 mx-2" />
            <span className="text-gray-900">{project.title}</span>
          </nav>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Left side - Project Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{project.title}</h1>
                <div className="flex gap-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {project.type === 'RESIDENTIAL' ? 'سكني' : 
                     project.type === 'COMMERCIAL' ? 'تجاري' : 
                     project.type === 'MIXED_USE' ? 'مختلط' : 'صناعي'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    project.status === 'UNDER_CONSTRUCTION' ? 'bg-orange-100 text-orange-800' :
                    project.status === 'PLANNING' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status === 'COMPLETED' ? 'مكتمل' :
                     project.status === 'UNDER_CONSTRUCTION' ? 'تحت الإنشاء' :
                     project.status === 'PLANNING' ? 'قيد التخطيط' : 'متوقف'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPinIcon className="w-4 h-4 ml-2" />
                <span className="text-sm">{project.location}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <HomeIcon className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">إجمالي الوحدات</p>
                  <p className="font-bold text-sm">{project.totalUnits || 'غير محدد'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <BuildingOfficeIcon className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">المساحة</p>
                  <p className="font-bold text-sm">{project.area ? `${project.area} م²` : 'غير محدد'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <CalendarIcon className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">التسليم</p>
                  <p className="font-bold text-sm">{project.deliveryDate ? new Date(project.deliveryDate).toLocaleDateString('ar-EG') : 'غير محدد'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <CurrencyDollarIcon className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">السعر</p>
                  <p className="font-bold text-xs leading-tight">
                    {project.minPrice && project.maxPrice 
                      ? `من ${parseFloat(project.minPrice).toLocaleString()} إلى ${parseFloat(project.maxPrice).toLocaleString()} ${project.currency}`
                      : project.minPrice 
                        ? `يبدأ من ${parseFloat(project.minPrice).toLocaleString()} ${project.currency}`
                        : 'غير محدد'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Image Gallery - Smaller */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="relative h-64 md:h-80">
              {/* Loading Overlay */}
              <ImageLoader isLoading={imageLoading} />
              
              {/* صورة رئيسية */}
              {!imageLoading && (
                <>
                  <Image
                    src={project.images[currentImageIndex]?.url || project.mainImage}
                    alt={`${project.title} - صورة ${currentImageIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover transition-opacity duration-500"
                    priority
                    onLoad={() => setImageLoading(false)}
                  />
                  
                  {/* أزرار التنقل */}
                  {project.images && project.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <ChevronRightIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <ChevronLeftIcon className="w-4 h-4" />
                      </button>

                      {/* مؤشر الصور */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                        {project.images.map((_, index: number) => (
                          <button
                            key={index}
                            onClick={() => {
                              setImageLoading(true)
                              setCurrentImageIndex(index)
                              setTimeout(() => setImageLoading(false), 500)
                            }}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>

                      {/* عداد الصور */}
                      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                        {currentImageIndex + 1} / {project.images.length}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* المحتوى الرئيسي */}
          <div className="lg:col-span-2 space-y-8">
            {/* الوصف */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">وصف المشروع</h2>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </motion.div>

            {/* المواصفات التفصيلية */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">تفاصيل إضافية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <HomeIcon className="w-5 h-5 text-blue-600 ml-2" />
                    <p className="font-semibold text-gray-900 text-sm">المطور</p>
                  </div>
                  <p className="text-gray-700 font-medium">{project.developer || 'غير محدد'}</p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <BuildingOfficeIcon className="w-5 h-5 text-green-600 ml-2" />
                    <p className="font-semibold text-gray-900 text-sm">الوحدات المتاحة</p>
                  </div>
                  <p className="text-gray-700 font-medium">{project.availableUnits || 'غير محدد'}</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <CalendarIcon className="w-5 h-5 text-purple-600 ml-2" />
                    <p className="font-semibold text-gray-900 text-sm">تاريخ التسليم</p>
                  </div>
                  <p className="text-gray-700 font-medium">
                    {project.deliveryDate ? new Date(project.deliveryDate).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'غير محدد'}
                  </p>
                </div>

                {project.bedrooms && (
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <HomeIcon className="w-5 h-5 text-orange-600 ml-2" />
                      <p className="font-semibold text-gray-900 text-sm">عدد الغرف</p>
                    </div>
                    <p className="text-gray-700 font-medium">{project.bedrooms} غرفة</p>
                  </div>
                )}

                {(project.minPrice || project.maxPrice) && (
                  <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <CurrencyDollarIcon className="w-5 h-5 text-indigo-600 ml-2" />
                      <p className="font-semibold text-gray-900 text-sm">السعر</p>
                    </div>
                    <p className="text-gray-700 font-medium text-sm">
                      {project.minPrice && project.maxPrice 
                        ? `يبدأ من ${parseFloat(project.minPrice).toLocaleString()} إلى ${parseFloat(project.maxPrice).toLocaleString()} ${project.currency}`
                        : project.minPrice 
                          ? `يبدأ من ${parseFloat(project.minPrice).toLocaleString()} ${project.currency}`
                          : project.maxPrice 
                            ? `حتى ${parseFloat(project.maxPrice).toLocaleString()} ${project.currency}`
                            : 'غير محدد'}
                    </p>
                  </div>
                )}

                {project.contactName && (
                  <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <PhoneIcon className="w-5 h-5 text-pink-600 ml-2" />
                      <p className="font-semibold text-gray-900 text-sm">جهة الاتصال</p>
                    </div>
                    <p className="text-gray-700 font-medium">{project.contactName}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* المميزات */}
            {project.features && project.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">مميزات المشروع</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.features.map((feature, index) => (
                    <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                      <StarIcon className="w-4 h-4 text-yellow-500 ml-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* خطة الدفع */}
            {project.paymentPlan && project.paymentPlan.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">خطة الدفع</h2>
                <div className="space-y-3">
                  {project.paymentPlan.map((step, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">{step.step}</p>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold ml-4">
                          {step.percentage}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* الشريط الجانبي */}
          <div className="space-y-8">
            {/* معلومات سريعة */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg p-5 border border-blue-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center border-b border-blue-200 pb-2">ملخص المشروع</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">المساحة:</span>
                  <span className="font-bold text-blue-600">{project.area ? `${project.area} م²` : 'غير محدد'}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">الموقع:</span>
                  <span className="font-bold text-gray-800 text-xs">{project.location}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">المطور:</span>
                  <span className="font-bold text-gray-800 text-xs">{project.developer}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">التسليم:</span>
                  <span className="font-bold text-green-600 text-xs">
                    {project.deliveryDate ? new Date(project.deliveryDate).toLocaleDateString('ar-EG') : 'غير محدد'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">إجمالي الوحدات:</span>
                  <span className="font-bold text-purple-600">{project.totalUnits || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">الوحدات المتاحة:</span>
                  <span className="font-bold text-orange-600">{project.availableUnits || 'غير محدد'}</span>
                </div>
              </div>
            </motion.div>

            {/* الأماكن القريبة */}
            {project.locationDetails && project.locationDetails.nearby && project.locationDetails.nearby.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center border-b border-gray-100 pb-2">الأماكن القريبة</h3>
                <div className="space-y-2">
                  {project.locationDetails.nearby.map((place: any, index: number) => (
                    <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                      <MapPinIcon className="w-4 h-4 text-blue-500 ml-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{place}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* زر التواصل */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-5 text-white shadow-xl"
            >
              <h3 className="text-lg font-bold mb-3 text-center">مهتم بهذا المشروع؟</h3>
              <p className="mb-4 opacity-90 text-center text-sm">تواصل معنا للحصول على مزيد من التفاصيل</p>
              <div className="space-y-3">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-white text-blue-600 py-2.5 px-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                >
                  استفسار عن المشروع
                </button>
                <a
                  href={`tel:${project.contactPhone}`}
                  className="w-full bg-white/20 backdrop-blur-sm text-white py-2.5 px-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2 border border-white/20 text-sm"
                >
                  <PhoneIcon className="w-4 h-4" />
                  {project.contactPhone || 'اتصل الآن'}
                </a>
                {project.contactEmail && (
                  <a
                    href={`mailto:${project.contactEmail}`}
                    className="w-full bg-white/20 backdrop-blur-sm text-white py-2.5 px-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2 border border-white/20 text-sm"
                  >
                    <EnvelopeIcon className="w-4 h-4" />
                    إرسال إيميل
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* نموذج التواصل المنبثق */}
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowContactForm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">استفسار عن {project.title}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رسالة</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="أريد المزيد من التفاصيل عن هذا المشروع..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                  >
                    إرسال
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
