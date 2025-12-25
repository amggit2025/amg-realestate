'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { 
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  CircleStackIcon,
  CogIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  EnvelopeIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'
import { usePermissions } from '@/hooks/usePermissions'
import type { Module } from '@/lib/permissions'

interface AdminSidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  adminRole: string
}

function AdminSidebarContent({ currentPage, onPageChange, adminRole }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(1024) // Default to desktop width
  const [stats, setStats] = useState({
    properties: 0,
    inquiries: 0,
    users: 0,
    testimonials: 0,
    subscriptions: 0,
    serviceRequests: 0,
  })
  const router = useRouter()
  const pathname = usePathname()
  const { checkModuleAccess, isSuperAdmin, admin } = usePermissions({ skipAuth: false })

  // جلب الإحصائيات
  useEffect(() => {
    fetchStats()
    // تحديث كل 30 ثانية
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('amg_admin_session') || 'temp_token'}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setStats(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    // Set initial width
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth)
      window.addEventListener('resize', handleResize)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  // Auto-detect current page from URL
  useEffect(() => {
    const pathMap: { [key: string]: string } = {
      '/admin': 'dashboard',
      '/admin/users': 'users',
      '/admin/properties/review': 'properties-review',
      '/admin/projects': 'projects',
      '/admin/portfolio': 'portfolio',
      '/admin/services': 'services',
      '/admin/inquiries': 'inquiries',
      '/admin/appointments': 'appointments',
      '/admin/service-requests': 'service-requests',
      '/admin/subscriptions': 'subscriptions',
      '/admin/testimonials': 'testimonials',
      '/admin/general-info': 'general-info',
      '/admin/about-page': 'about-page',
      '/admin/reports': 'reports',
      '/admin/admins': 'admins',
      '/admin/settings': 'settings'
    }

    const detectedPage = pathMap[pathname] || 'dashboard'
    if (detectedPage !== currentPage) {
      onPageChange(detectedPage)
    }
  }, [pathname, currentPage, onPageChange])

  const menuItems = [
    {
      id: 'dashboard',
      name: 'لوحة المعلومات',
      icon: HomeIcon,
      module: null, // متاح للجميع
    },
    {
      id: 'users',
      name: 'إدارة المستخدمين',
      icon: UsersIcon,
      module: 'users' as Module,
    },
    {
      id: 'properties-review',
      name: 'مراجعة العقارات',
      icon: ShieldCheckIcon,
      module: 'properties' as Module,
    },
    {
      id: 'projects',
      name: 'إدارة المشاريع',
      icon: ChartBarIcon,
      module: 'projects' as Module,
    },
    {
      id: 'portfolio',
      name: 'إدارة الأعمال',
      icon: DocumentTextIcon,
      module: 'portfolio' as Module,
    },
    {
      id: 'services',
      name: 'إدارة الخدمات',
      icon: BuildingOfficeIcon,
      module: 'services' as Module,
    },
    {
      id: 'inquiries',
      name: 'الاستفسارات',
      icon: ChatBubbleLeftRightIcon,
      module: 'inquiries' as Module,
    },
    {
      id: 'appointments',
      name: 'مواعيد المعاينات',
      icon: CalendarDaysIcon,
      module: 'appointments' as Module,
    },
    {
      id: 'subscriptions',
      name: 'الاشتراكات',
      icon: EnvelopeIcon,
      module: 'newsletter' as Module,
    },
    {
      id: 'service-requests',
      name: 'طلبات الاستشارات',
      icon: ChatBubbleLeftRightIcon,
      module: 'inquiries' as Module,
    },
    {
      id: 'testimonials',
      name: 'آراء العملاء',
      icon: ChatBubbleLeftRightIcon,
      module: 'testimonials' as Module,
    },
    {
      id: 'general-info',
      name: 'معلومات عامة',
      icon: CircleStackIcon,
      module: 'general-info' as Module,
    },
    {
      id: 'about-page',
      name: 'صفحة من نحن',
      icon: DocumentTextIcon,
      module: 'about' as Module,
    },
    {
      id: 'reports',
      name: 'التقارير',
      icon: DocumentTextIcon,
      module: 'reports' as Module,
    },
    {
      id: 'admins',
      name: 'إدارة المشرفين',
      icon: ShieldCheckIcon,
      module: 'admins' as Module,
    },
    {
      id: 'settings',
      name: 'الإعدادات',
      icon: CogIcon,
      module: null, // متاح للجميع
    }
  ]

  // تصفية القائمة حسب الصلاحيات
  const filteredMenuItems = menuItems.filter(item => {
    // الصفحات بدون module متاحة للجميع
    if (!item.module) return true
    
    // إذا لم يكن هناك admin، لا تظهر أي صفحات محمية
    if (!admin) return false
    
    // التحقق من صلاحية الوصول للوحدة
    return checkModuleAccess(item.module)
  })

  // Handle navigation
  const handleNavigation = (itemId: string) => {
    // Map menu items to their routes
    const routeMap: { [key: string]: string } = {
      'dashboard': '/admin',
      'users': '/admin/users',
      'properties-review': '/admin/properties/review',
      'projects': '/admin/projects',
      'portfolio': '/admin/portfolio',
      'services': '/admin/services',
      'inquiries': '/admin/inquiries',
      'appointments': '/admin/appointments',
      'subscriptions': '/admin/subscriptions',
      'service-requests': '/admin/service-requests',
      'testimonials': '/admin/testimonials',
      'general-info': '/admin/general-info',
      'about-page': '/admin/about-page',
      'reports': '/admin/reports',
      'admins': '/admin/admins',
      'settings': '/admin/settings'
    }

    const route = routeMap[itemId] || '/admin'
    
    // Navigate to the route
    router.push(route)
    
    // Update the current page for highlighting
    onPageChange(itemId)
    
    // Close mobile menu
    setIsMobileOpen(false)
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      // استدعاء API Logout
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      })

      // مسح localStorage
      localStorage.removeItem('amg_admin_session')

      // إعادة التوجيه لصفحة Login
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      // حتى في حالة الخطأ، نعيد التوجيه
      localStorage.removeItem('amg_admin_session')
      router.push('/admin/login')
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-white rounded-lg shadow-lg border"
        >
          {isMobileOpen ? (
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          )}
        </motion.button>
      </div>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        style={{
          width: isCollapsed ? '80px' : '280px',
          transform: isMobileOpen ? 'translateX(0)' : (windowWidth < 1024 ? 'translateX(-280px)' : 'translateX(0)'),
          transition: 'all 0.3s ease'
        }}
        className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 shadow-xl z-40 ${
          isMobileOpen ? 'lg:relative' : 'hidden lg:block'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-3 space-x-reverse"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <ShieldCheckIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {admin ? `${admin.firstName} ${admin.lastName}` : 'AMG Admin'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {admin?.role === 'SUPER_ADMIN' ? '🔐 سوبر أدمن' : 
                       admin?.role === 'ADMIN' ? '👤 مشرف' : 
                       admin?.role === 'MODERATOR' ? '📝 محرر' : 'لوحة التحكم'}
                    </p>
                  </div>
                </motion.div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bars3Icon className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredMenuItems.length > 0 ? (
              filteredMenuItems.map((item) => {
                const IconComponent = item.icon
                const isActive = currentPage === item.id
                
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center justify-between space-x-3 space-x-reverse p-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse relative">
                      <div className="relative">
                        <IconComponent className="w-5 h-5 flex-shrink-0" />
                        
                        {/* Badge Dot - يظهر دائماً حتى في حالة collapsed */}
                        {isCollapsed && (
                          <>
                            {item.id === 'properties-review' && stats.properties > 0 && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"
                              />
                            )}
                            {item.id === 'inquiries' && stats.inquiries > 0 && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-white animate-pulse"
                              />
                            )}
                            {item.id === 'users' && stats.users > 0 && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"
                              />
                            )}
                            {item.id === 'testimonials' && stats.testimonials > 0 && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white animate-pulse"
                              />
                            )}
                            {item.id === 'subscriptions' && stats.subscriptions > 0 && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white animate-pulse"
                              />
                            )}
                            {item.id === 'service-requests' && stats.serviceRequests > 0 && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white animate-pulse"
                              />
                            )}
                          </>
                        )}
                      </div>
                      
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="font-medium"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </div>
                    
                    {/* Badge للإشعارات - بالأرقام عند expanded */}
                    {!isCollapsed && (
                      <>
                        {item.id === 'properties-review' && stats.properties > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-red-500 text-white animate-pulse'
                            }`}
                          >
                            {stats.properties}
                          </motion.span>
                        )}
                        {item.id === 'inquiries' && stats.inquiries > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-purple-500 text-white animate-pulse'
                            }`}
                          >
                            {stats.inquiries}
                          </motion.span>
                        )}
                        {item.id === 'users' && stats.users > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-green-500 text-white animate-pulse'
                            }`}
                          >
                            {stats.users} جديد
                          </motion.span>
                        )}
                        {item.id === 'testimonials' && stats.testimonials > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-yellow-500 text-white animate-pulse'
                            }`}
                          >
                            {stats.testimonials}
                          </motion.span>
                        )}
                        {item.id === 'subscriptions' && stats.subscriptions > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-blue-500 text-white animate-pulse'
                            }`}
                          >
                            {stats.subscriptions} جديد
                          </motion.span>
                        )}
                        {item.id === 'service-requests' && stats.serviceRequests > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-orange-500 text-white animate-pulse'
                            }`}
                          >
                            {stats.serviceRequests}
                          </motion.span>
                        )}
                      </>
                    )}
                  </motion.button>
                )
              })
            ) : (
              <div className="text-center text-gray-500 py-4">
                <p className="text-sm">جاري التحميل...</p>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 space-x-reverse p-3 rounded-xl transition-all text-red-600 hover:bg-red-50"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium"
                >
                  تسجيل الخروج
                </motion.span>
              )}
            </motion.button>

            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center pt-2"
              >
                <p className="text-xs text-gray-500 mb-2">AMG Real Estate</p>
                <p className="text-xs text-gray-400">Admin Panel v1.0</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default function AdminSidebar(props: AdminSidebarProps) {
  return (
    <Suspense fallback={<div className="h-screen w-64 bg-gray-900" />}>
      <AdminSidebarContent {...props} />
    </Suspense>
  )
}
