'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  UserIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  CogIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'

interface MobileAuthButtonsProps {
  isLoggedIn?: boolean
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onClose: () => void
}

const MobileAuthButtons: React.FC<MobileAuthButtonsProps> = ({ 
  isLoggedIn = false, 
  user,
  onClose 
}) => {
  if (isLoggedIn) {
    return (
      <div className="space-y-4 mb-6">
        {/* User Profile Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900">{user?.name || 'المستخدم'}</p>
              <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Link 
              href="/dashboard" 
              className="flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200"
              onClick={onClose}
            >
              <CogIcon className="w-4 h-4" />
              <span>لوحة التحكم</span>
            </Link>
            
            <Link 
              href="/dashboard/favorites" 
              className="flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200"
              onClick={onClose}
            >
              <HeartIcon className="w-4 h-4" />
              <span>المفضلة</span>
            </Link>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          <Link 
            href="/dashboard/listings" 
            className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors duration-200"
            onClick={onClose}
          >
            <ClipboardDocumentListIcon className="w-5 h-5" />
            <span className="font-medium">إعلاناتي</span>
          </Link>
        </div>

        {/* Logout Button */}
        <motion.button 
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 text-red-600 hover:bg-red-50 border-2 border-red-200 hover:border-red-300 rounded-xl transition-all duration-200 font-medium"
          onClick={() => {
            onClose()
            // Add logout logic here
          }}
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </motion.button>
      </div>
    )
  }

  return (
    <div className="space-y-3 mb-6">
      {/* Login Button */}
      <motion.div whileTap={{ scale: 0.98 }}>
        <Link
          href="/auth/login"
          className="group relative flex items-center justify-center gap-3 w-full py-4 px-6 text-gray-700 hover:text-blue-600 font-semibold rounded-2xl border-2 border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50 transition-all duration-300 overflow-hidden"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
          <ArrowRightOnRectangleIcon className="w-5 h-5 relative z-10 group-hover:rotate-6 transition-transform duration-300" />
          <span className="relative z-10">تسجيل الدخول</span>
        </Link>
      </motion.div>

      {/* Register Button */}
      <motion.div whileTap={{ scale: 0.98 }} className="relative">
        <Link
          href="/auth/register"
          className="group relative flex items-center justify-center gap-3 w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
          onClick={onClose}
        >
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          
          <UserPlusIcon className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
          <span className="relative z-10">إنشاء حساب جديد</span>
          
          {/* Glow dots */}
          <div className="absolute top-2 right-4 w-2 h-2 bg-white/40 rounded-full animate-ping" />
          <div className="absolute bottom-2 left-4 w-1 h-1 bg-white/60 rounded-full animate-pulse" />
        </Link>
        
        {/* Enhanced glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10" />
      </motion.div>
    </div>
  )
}

export default MobileAuthButtons
