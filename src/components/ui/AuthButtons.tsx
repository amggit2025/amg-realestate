'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  UserIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  ChevronDownIcon,
  CogIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'

interface AuthButtonsProps {
  isLoggedIn?: boolean
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ 
  isLoggedIn = false, 
  user 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)
  const closeDropdown = () => setDropdownOpen(false)

  if (isLoggedIn) {
    return (
      <div className="relative">
        <motion.button
          onClick={toggleDropdown}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-gray-200 hover:border-blue-300 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
        >
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-white" />
            </div>
          )}
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">
              {user?.name || 'المستخدم'}
            </p>
            <p className="text-xs text-gray-500">مرحباً بك</p>
          </div>
          <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </motion.button>

        <AnimatePresence>
          {dropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={closeDropdown}
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20"
                style={{ minWidth: '280px' }}
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{user?.name || 'المستخدم'}</p>
                      <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    onClick={closeDropdown}
                  >
                    <CogIcon className="w-5 h-5" />
                    <span>لوحة التحكم</span>
                  </Link>
                  
                  <Link 
                    href="/dashboard/listings" 
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    onClick={closeDropdown}
                  >
                    <ClipboardDocumentListIcon className="w-5 h-5" />
                    <span>إعلاناتي</span>
                  </Link>
                  
                  <Link 
                    href="/dashboard/favorites" 
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    onClick={closeDropdown}
                  >
                    <HeartIcon className="w-5 h-5" />
                    <span>المفضلة</span>
                  </Link>
                </div>

                <div className="border-t border-gray-100 pt-2">
                  <button 
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-right"
                    onClick={() => {
                      closeDropdown()
                      // Add logout logic here
                    }}
                  >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      {/* Login Button */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          href="/auth/login"
          className="group relative flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-blue-600 font-medium rounded-xl border border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
          <ArrowRightOnRectangleIcon className="w-4 h-4 relative z-10 group-hover:rotate-6 transition-transform duration-300" />
          <span className="relative z-10">تسجيل الدخول</span>
        </Link>
      </motion.div>

      {/* Register Button */}
      <motion.div 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }}
        className="relative"
      >
        <Link
          href="/auth/register"
          className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
        >
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          
          <UserPlusIcon className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
          <span className="relative z-10">إنشاء حساب</span>
          
          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-xl bg-white/20 animate-ping group-hover:animate-none" />
        </Link>
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10" />
      </motion.div>
    </div>
  )
}

export default AuthButtons
