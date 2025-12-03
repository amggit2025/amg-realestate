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

interface CompactMobileAuthProps {
  isLoggedIn?: boolean
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onClose: () => void
}

const CompactMobileAuth: React.FC<CompactMobileAuthProps> = ({ 
  isLoggedIn = false, 
  user,
  onClose 
}) => {
  if (isLoggedIn) {
    return (
      <div className="space-y-3 mb-4">
        {/* User Profile Card - Compact */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 border border-blue-100">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{user?.name || 'المستخدم'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>

        {/* Quick Menu Items - Compact */}
        <div className="space-y-1">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 py-2.5 px-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200"
            onClick={onClose}
          >
            <CogIcon className="w-4 h-4" />
            <span className="text-sm font-medium">لوحة التحكم</span>
          </Link>
          
          <Link 
            href="/dashboard/listings" 
            className="flex items-center gap-3 py-2.5 px-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200"
            onClick={onClose}
          >
            <ClipboardDocumentListIcon className="w-4 h-4" />
            <span className="text-sm font-medium">إعلاناتي</span>
          </Link>
          
          <Link 
            href="/dashboard/favorites" 
            className="flex items-center gap-3 py-2.5 px-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200"
            onClick={onClose}
          >
            <HeartIcon className="w-4 h-4" />
            <span className="text-sm font-medium">المفضلة</span>
          </Link>
        </div>

        {/* Logout Button - Compact */}
        <motion.button 
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 rounded-lg transition-all duration-200 text-sm font-medium"
          onClick={() => {
            onClose()
            // Add logout logic here
          }}
        >
          <ArrowLeftOnRectangleIcon className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </motion.button>
      </div>
    )
  }

  return (
    <div className="flex gap-2 mb-4">
      {/* Login Button - Compact */}
      <motion.div whileTap={{ scale: 0.98 }} className="flex-1">
        <Link
          href="/auth/login"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-gray-700 hover:text-blue-600 font-medium rounded-lg border border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50 transition-all duration-200"
          onClick={onClose}
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          <span className="text-sm">تسجيل الدخول</span>
        </Link>
      </motion.div>

      {/* Register Button - Compact */}
      <motion.div whileTap={{ scale: 0.98 }} className="flex-1">
        <Link
          href="/auth/register"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={onClose}
        >
          <UserPlusIcon className="w-4 h-4" />
          <span className="text-sm">حساب جديد</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default CompactMobileAuth
