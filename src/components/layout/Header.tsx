'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { AdvancedSearch } from '@/components/ui'
import { useAuth } from '@/lib/AuthContext'
import NotificationBell from './NotificationBell'
import CartIcon from './CartIcon'
import WishlistIcon from './WishlistIcon'
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
  CalendarDaysIcon,
  ShoppingBagIcon,
  ClipboardDocumentCheckIcon
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
  const [requestsMenuOpen, setRequestsMenuOpen] = useState(false)
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
      if (!target.closest('.requests-menu-container')) {
        setRequestsMenuOpen(false)
      }
    }

    if (userMenuOpen || requestsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userMenuOpen, requestsMenuOpen])

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMenu = () => {
    setMobileMenuOpen(false)
  }

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen)
  }

  const toggleRequestsMenu = () => {
    setRequestsMenuOpen(!requestsMenuOpen)
  }

  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
  }

  // Get current date in Arabic
  const currentDate = new Date().toLocaleDateString('ar-EG', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <header className="fixed top-0 left-0 right-0 z-[100]">
      {/* Top Bar */}
      <div className="hidden lg:block bg-slate-900 text-white py-2.5">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between text-xs">
            {/* Left: Contact Info */}
            <div className="flex items-center gap-8">
              <a href={`mailto:${COMPANY_INFO.email}`} className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{COMPANY_INFO.email}</span>
              </a>
              <a href={`tel:${COMPANY_INFO.phone}`} className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                <PhoneIcon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{COMPANY_INFO.phone}</span>
              </a>
            </div>

            {/* Center: Date */}
            <div className="flex items-center gap-2 text-gray-300">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{currentDate}</span>
            </div>

            {/* Right: Social Media */}
            <div className="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center hover:text-amber-400 transition-colors rounded-md hover:bg-slate-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center hover:text-amber-400 transition-colors rounded-md hover:bg-slate-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center hover:text-amber-400 transition-colors rounded-md hover:bg-slate-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center hover:text-amber-400 transition-colors rounded-md hover:bg-slate-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://wa.me/201234567890" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center hover:text-amber-400 transition-colors rounded-md hover:bg-slate-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white backdrop-blur-md border-b border-gray-200 shadow-sm" aria-label="Global">
        <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="-m-1.5 p-1.5 shrink-0">
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center gap-1 flex-1 mx-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-50 whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons & Icons (Right Side) */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Show skeleton/placeholder until mounted to prevent hydration mismatch */}
            {!mounted ? (
              // Server-side placeholder - same structure always
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gray-100 rounded-lg animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-100 rounded-lg animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse"></div>
                <div className="h-8 w-20 bg-blue-100 rounded-lg animate-pulse"></div>
              </div>
            ) : (
              // Client-side - render actual content based on auth state
              <div className="flex items-center gap-2">
                {/* Notification Bell - Only for authenticated users */}
                {isAuthenticated && user && (
                  <NotificationBell />
                )}
                
                {/* Wishlist Icon */}
                <WishlistIcon />
                
                {/* Cart Icon */}
                <CartIcon />

                  {/* Divider */}
                  <div className="hidden lg:block h-8 w-px bg-gray-200 mx-1"></div>

                  {/* Store Button - Icon Only */}
                  <Link
                    href="/store"
                    className="hidden lg:flex relative p-2 bg-slate-900 text-amber-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="المتجر"
                  >
                    <ShoppingBagIcon className="w-5 h-5" />
                  </Link>

                  {/* Requests Dropdown */}
                  <div className="hidden lg:block relative requests-menu-container">
                    <button
                       onClick={toggleRequestsMenu}
                       className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 whitespace-nowrap text-xs font-medium"
                    >
                      <ClipboardDocumentCheckIcon className="w-4 h-4" />
                      <span>قدم طلبك</span>
                      <ChevronDownIcon className={`w-3 h-3 transition-transform duration-200 ${requestsMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {requestsMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, x: '-50%' }}
                          animate={{ opacity: 1, y: 0, x: '-50%' }}
                          exit={{ opacity: 0, y: -10, x: '-50%' }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-1/2 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 overflow-hidden"
                        >
                          <Link
                            href="/book-appointment"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors border-b border-gray-50"
                            onClick={() => setRequestsMenuOpen(false)}
                          >
                            <CalendarDaysIcon className="w-4 h-4" />
                            حجز معاينة
                          </Link>
                          <Link
                            href="/list-your-property"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                            onClick={() => setRequestsMenuOpen(false)}
                          >
                            <HomeIcon className="w-4 h-4" />
                            اعرض عقارك
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Divider */}
                  <div className="hidden lg:block h-8 w-px bg-gray-200 mx-1"></div>
                
                  {/* User Menu or Login Button */}
                  <div className="hidden lg:block">
                  {!isAuthenticated || !user ? (
                    <Link
                      href="/auth/login"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow whitespace-nowrap"
                    >
                      تسجيل الدخول
                    </Link>
                ) : (
                    <div className="relative user-menu-container">
                      <button
                        onClick={toggleUserMenu}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span className="text-sm font-medium truncate max-w-[100px]">{user.firstName}</span>
                        <ChevronDownIcon className="w-3.5 h-3.5" />
                      </button>
                
                      {/* User Dropdown */}
                      <AnimatePresence>
                        {userMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50"
                          >
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        🏠 لوحة التحكم
                      </Link>
                      <Link
                        href="/dashboard/add-property"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        ➕ إضافة عقار
                      </Link>
                      <Link
                        href="/dashboard/properties"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        🏡 عقاراتي
                      </Link>
                      <Link
                        href="/dashboard/my-requests"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        📋 طلبات التسويق
                      </Link>
                      <Link
                        href="/dashboard/my-orders"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        🛍️ طلباتي من المتجر
                      </Link>
                      <Link
                        href="/dashboard/inquiries"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        💬 الاستفسارات
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-right px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 inline ml-2" />
                        تسجيل الخروج
                      </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                  </div>
              </div>
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
                          <UserIcon className="w-8 h-8 text-blue-600 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 truncate">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-600 truncate">{user.email}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Link
                            href="/store/cart"
                            className="block w-full text-right p-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                            onClick={closeMenu}
                          >
                            🛒 السلة
                          </Link>
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
                            href="/dashboard/my-orders"
                            className="block w-full text-right p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                            onClick={closeMenu}
                          >
                            🛍️ طلباتي من المتجر
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
                        {/* Mobile Store Button */}
                        <Link
                          href="/store"
                          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-900 text-amber-400 rounded-lg hover:bg-slate-800 transition-colors border border-slate-700 shadow-md"
                          onClick={closeMenu}
                        >
                          <ShoppingBagIcon className="w-5 h-5" />
                          <span className="font-bold">المتجر</span>
                          <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full mr-2">جديد</span>
                        </Link>

                        {/* Mobile Cart Button */}
                        <Link
                          href="/store/cart"
                          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border-2 border-slate-900 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                          onClick={closeMenu}
                        >
                          <ShoppingBagIcon className="w-5 h-5" />
                          <span className="font-bold">السلة</span>
                        </Link>

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
        </div>
      </nav>
    </header>
  )
}
