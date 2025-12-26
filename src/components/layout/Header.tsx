'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { AdvancedSearch } from '@/components/ui'
import { useAuth } from '@/lib/AuthContext'
import NotificationBell from './NotificationBell'
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  BuildingOffice2Icon,
  CogIcon,
  UserGroupIcon,
  PhoneIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'
import { COMPANY_INFO } from '@/lib/constants'

const navigation = [
  { name: 'الرئيسية', href: '/', icon: HomeIcon },
  { name: 'المشاريع', href: '/projects', icon: BuildingOffice2Icon },
  { name: 'معرض الأعمال', href: '/portfolio', icon: CogIcon },
  { name: 'الخدمات', href: '/services', icon: CogIcon },
  { name: 'الإعلانات', href: '/listings', icon: BuildingOffice2Icon },
  { name: 'من نحن', href: '/about', icon: UserGroupIcon },
  { name: 'تواصل معنا', href: '/contact', icon: PhoneIcon },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  // Prevent hydration mismatch by waiting for client mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.user-menu-container')) {
        setUserMenuOpen(false)
      }
    }

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userMenuOpen])

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMenu = () => {
    setMobileMenuOpen(false)
  }

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen)
  }

  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white backdrop-blur-md border-b border-gray-200 shadow-sm">
      <nav className="container mx-auto px-4" aria-label="Global">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md border border-gray-200">
                  <Image 
                    src="/images/logo.png" 
                    alt="AMG Real Estate Logo" 
                    width={32} 
                    height={32} 
                    className="object-contain"
                  />
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs font-medium leading-5 text-gray-600 hover:text-blue-600 transition-colors duration-200 py-1.5 px-2 rounded-md hover:bg-gray-50"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex lg:flex-1 lg:justify-end items-center gap-2">
            {/* Show skeleton/placeholder until mounted to prevent hydration mismatch */}
            {!mounted ? (
              // Server-side placeholder - same structure always
              <div className="hidden lg:flex items-center gap-3">
                <div className="h-9 w-24 bg-gray-100 rounded-lg animate-pulse"></div>
                <div className="h-9 w-24 bg-gray-100 rounded-lg animate-pulse"></div>
                <div className="h-9 w-28 bg-blue-100 rounded-lg animate-pulse"></div>
              </div>
            ) : (
              // Client-side - render actual content based on auth state
              <>
                <div className="hidden lg:flex items-center gap-3">
                  <Link
                    href="/book-appointment"
                    className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg"
                  >
                    <CalendarDaysIcon className="w-4 h-4" />
                    حجز معاينة
                  </Link>
                  <Link
                    href="/list-your-property"
                    className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 transition-colors bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg"
                  >
                    <HomeIcon className="w-4 h-4" />
                    اعرض عقارك
                  </Link>
                </div>

                {/* Notification Bell - Only for authenticated users */}
                {isAuthenticated && user && <NotificationBell />}
                
                {/* User Menu or Login Button */}
                {!isAuthenticated || !user ? (
                  <div className="hidden lg:block">
                    <Link
                      href="/auth/login"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      تسجيل الدخول
                    </Link>
                  </div>
                ) : (
                  <div className="hidden lg:block relative user-menu-container">
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      <UserIcon className="w-5 h-5" />
                      <span className="font-medium">{user.firstName} {user.lastName}</span>
                      <ChevronDownIcon className="w-4 h-4" />
                    </button>
                
                {/* User Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        🏠 لوحة التحكم
                      </Link>
                      <Link
                        href="/dashboard/add-property"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        ➕ إضافة عقار
                      </Link>
                      <Link
                        href="/dashboard/properties"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        🏡 عقاراتي
                      </Link>
                      <Link
                        href="/dashboard/my-requests"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        📋 طلبات التسويق
                      </Link>
                      <Link
                        href="/dashboard/inquiries"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        💬 الاستفسارات
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 inline ml-2" />
                        تسجيل الخروج
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="relative p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
              onClick={toggleMenu}
            >
              <span className="sr-only">فتح القائمة</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="lg:hidden">
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-[998] bg-black/50 backdrop-blur-sm"
                onClick={closeMenu}
              />
              
              {/* Sidebar */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                className="fixed top-0 right-0 z-[999] h-screen w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md border border-gray-200">
                      <Image 
                        src="/images/logo.png" 
                        alt="AMG Logo" 
                        width={32} 
                        height={32} 
                        className="object-contain"
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">AMG</div>
                      <div className="text-xs text-gray-600">العقارية</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-white/80 transition-colors duration-200"
                    onClick={closeMenu}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Navigation Links */}
                  <div className="space-y-2 mb-8">
                    {navigation.map((item, index) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-4 rounded-xl px-4 py-4 text-base font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-300 group"
                        onClick={closeMenu}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300 shrink-0">
                          <item.icon className="h-5 w-5 group-hover:text-blue-600" />
                        </div>
                        <span className="flex-1">{item.name}</span>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>

                  {/* Auth Buttons */}
                  <div className="p-4 border-t border-gray-200" suppressHydrationWarning>
                    {!mounted ? (
                      <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                    ) : isAuthenticated && user ? (
                      <div>
                        <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
                          <UserIcon className="w-8 h-8 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Link
                            href="/dashboard"
                            className="block w-full text-right p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                            onClick={closeMenu}
                          >
                            🏠 لوحة التحكم
                          </Link>
                          <Link
                            href="/dashboard/add-property"
                            className="block w-full text-right p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                            onClick={closeMenu}
                          >
                            ➕ إضافة عقار
                          </Link>
                          <Link
                            href="/dashboard/properties"
                            className="block w-full text-right p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                            onClick={closeMenu}
                          >
                            🏡 عقاراتي
                          </Link>
                          <Link
                            href="/dashboard/my-requests"
                            className="block w-full text-right p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                            onClick={closeMenu}
                          >
                            📋 طلبات التسويق
                          </Link>
                          <Link
                            href="/dashboard/inquiries"
                            className="block w-full text-right p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                            onClick={closeMenu}
                          >
                            💬 الاستفسارات
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-right p-3 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            تسجيل الخروج
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Link
                          href="/book-appointment"
                          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
                          onClick={closeMenu}
                        >
                          <CalendarDaysIcon className="w-5 h-5" />
                          حجز موعد معاينة
                        </Link>
                        <Link
                          href="/list-your-property"
                          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors"
                          onClick={closeMenu}
                        >
                          <HomeIcon className="w-5 h-5" />
                          اعرض عقارك للتسويق
                        </Link>
                        <Link
                          href="/auth/login"
                          className="block w-full text-center py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          onClick={closeMenu}
                        >
                          تسجيل الدخول
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">تواصل معنا</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4 shrink-0" />
                        <span>{COMPANY_INFO.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{COMPANY_INFO.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
