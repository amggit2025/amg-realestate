'use client'

export const dynamic = 'force-dynamic'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { logger } from '@/lib/logger'
import { 
  LayoutDashboard, 
  Building2, 
  Eye, 
  MessageSquare, 
  Plus, 
  Search, 
  Settings, 
  User, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  FileText,
  Bell
} from 'lucide-react'
import { useAuth, withAuth } from '@/lib/AuthContext'
import Link from 'next/link'
import Image from 'next/image'
import RecentActivities from '@/components/features/RecentActivities'
import EmailVerificationBanner from '@/components/features/EmailVerificationBanner'

// Interfaces
interface Property {
  id: string
  title: string
  price: number
  currency: string
  city: string
  district: string
  propertyType: string
  status: string
  views: number
  images?: Array<{ url: string }>
  createdAt: string
  _count: {
    inquiries: number
  }
}

interface Request {
  id: string
  type: string
  status: string
  createdAt: string
}

interface DashboardStats {
  totalProperties: number
  activeProperties: number
  totalViews: number
  totalInquiries: number
  totalRequests: number
  viewsGrowth: number
  inquiriesGrowth: number
}

function DashboardPage() {
  const { user } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeProperties: 0,
    totalViews: 0,
    totalInquiries: 0,
    totalRequests: 0,
    viewsGrowth: 0,
    inquiriesGrowth: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propsRes, reqsRes] = await Promise.all([
          fetch('/api/properties', {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          }),
          fetch('/api/user/property-requests', {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          })
        ])

        if (propsRes.ok) {
          const data = await propsRes.json()
          setProperties(data.properties || [])
          
          // Calculate stats from properties
          const props = data.properties || []
          const totalViews = props.reduce((sum: number, p: Property) => sum + (p.views || 0), 0)
          const totalInquiries = props.reduce((sum: number, p: Property) => sum + (p._count?.inquiries || 0), 0)
          
          setStats(prev => ({
            ...prev,
            totalProperties: props.length,
            activeProperties: props.filter((p: Property) => p.status === 'ACTIVE').length,
            totalViews,
            totalInquiries,
            viewsGrowth: 12.5, // Mock growth for demo
            inquiriesGrowth: 8.2 // Mock growth for demo
          }))
        }

        if (reqsRes.ok) {
          const data = await reqsRes.json()
          setRequests(data.requests || [])
          setStats(prev => ({
            ...prev,
            totalRequests: (data.requests || []).length
          }))
        }
      } catch (error) {
        logger.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-50 rounded-bl-full -mr-4 -mt-4 opacity-50`} />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 bg-${color}-50 rounded-xl`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
          {trend && (
            <div className={`flex items-center text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'} bg-white px-2 py-1 rounded-full shadow-sm`}>
              {trend > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </motion.div>
  )

  const QuickActionCard = ({ title, description, icon: Icon, href, gradient }: any) => (
    <Link href={href} className="block group">
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className={`h-full p-6 rounded-2xl bg-gradient-to-br ${gradient} text-white relative overflow-hidden shadow-lg`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-white/20 transition-all" />
        <div className="relative z-10">
          <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className="text-white/80 text-sm">{description}</p>
        </div>
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <ChevronRight className="w-4 h-4 text-white" />
          </div>
        </div>
      </motion.div>
    </Link>
  )

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 pt-28">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                مرحباً، {user?.firstName} 👋
              </h1>
              <p className="text-gray-500 mt-1">
                إليك نظرة عامة على أداء عقاراتك ونشاطك اليوم
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard/notifications">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
              </Link>
              <Link href="/dashboard/add-property">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20">
                  <Plus className="w-5 h-5" />
                  <span>إضافة عقار</span>
                </button>
              </Link>
            </div>
          </div>

          {user && !user.emailVerified && (
            <div className="mt-6">
              <EmailVerificationBanner 
                email={user.email}
                isVerified={user.emailVerified}
                onVerificationSuccess={() => {
                  // Hard reload to clear cache and refetch user data
                  window.location.href = window.location.href
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="إجمالي العقارات" 
            value={stats.totalProperties} 
            icon={Building2} 
            color="blue"
            trend={null}
          />
          <StatCard 
            title="المشاهدات الكلية" 
            value={stats.totalViews} 
            icon={Eye} 
            color="purple"
            trend={stats.viewsGrowth}
          />
          <StatCard 
            title="الاستفسارات" 
            value={stats.totalInquiries} 
            icon={MessageSquare} 
            color="orange"
            trend={stats.inquiriesGrowth}
          />
          <StatCard 
            title="طلبات التسويق" 
            value={stats.totalRequests} 
            icon={FileText} 
            color="emerald"
            trend={null}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-gray-500" />
                وصول سريع
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuickActionCard 
                  title="إضافة عقار جديد"
                  description="أضف عقارك للبيع أو الإيجار في خطوات بسيطة"
                  icon={Plus}
                  href="/dashboard/add-property"
                  gradient="from-blue-600 to-blue-400"
                />
                <QuickActionCard 
                  title="طلباتي"
                  description="تتبع حالة طلبات التسويق والبحث العقاري"
                  icon={FileText}
                  href="/dashboard/my-requests"
                  gradient="from-purple-600 to-purple-400"
                />
              </div>
            </section>

            {/* Recent Properties */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">آخر العقارات المضافة</h2>
                <Link href="/dashboard/properties" className="text-blue-600 text-sm font-medium hover:underline">
                  عرض الكل
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">جاري التحميل...</div>
                ) : properties.length > 0 ? (
                  properties.slice(0, 5).map((property) => (
                    <div key={property.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 relative overflow-hidden flex-shrink-0">
                        {property.images?.[0] ? (
                          <Image 
                            src={property.images[0].url} 
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Building2 className="w-8 h-8 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{property.title}</h3>
                        <p className="text-sm text-gray-500 truncate">
                          {property.city}، {property.district}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            property.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                            property.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {property.status === 'ACTIVE' ? 'نشط' : property.status === 'PENDING' ? 'قيد المراجعة' : 'غير نشط'}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {property.views}
                          </span>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-blue-600">
                          {new Intl.NumberFormat('ar-EG').format(property.price)} {property.currency}
                        </p>
                        <Link href={`/dashboard/properties/${property.id}/edit`}>
                          <button className="text-xs text-gray-500 hover:text-blue-600 mt-1">
                            تعديل
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building2 className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">لا توجد عقارات مضافة بعد</p>
                    <Link href="/dashboard/add-property">
                      <button className="mt-3 text-blue-600 font-medium text-sm hover:underline">
                        أضف عقارك الأول
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Profile Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {user?.firstName?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{user?.firstName} {user?.lastName}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${user?.verified ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      {user?.verified ? <CheckCircle2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {user?.userType || 'مستخدم'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Link href="/dashboard/profile">
                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-600 hover:text-blue-600 group">
                    <span className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                      الملف الشخصي
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600" />
                  </button>
                </Link>
                <Link href="/dashboard/settings">
                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-600 hover:text-blue-600 group">
                    <span className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                      الإعدادات
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  النشاط الأخير
                </h3>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                <RecentActivities limit={5} showStats={false} className="shadow-none border-none" />
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">تحتاج مساعدة؟</h3>
                <p className="text-white/80 text-sm mb-4">
                  فريق الدعم لدينا جاهز لمساعدتك في أي وقت. تواصل معنا الآن.
                </p>
                <Link href="/contact">
                  <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors">
                    تواصل معنا
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAuth(DashboardPage)
