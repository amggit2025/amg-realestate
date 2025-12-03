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

interface CompactAuthButtonsProps {
  isLoggedIn?: boolean
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

const CompactAuthButtons: React.FC<CompactAuthButtonsProps> = ({ 
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <UserIcon className="w-3.5 h-3.5 text-white" />
            </div>
          )}
          <span className="text-sm font-medium text-gray-700 max-w-16 truncate">
            {user?.name?.split(' ')[0] || 'المستخدم'}
          </span>
          <ChevronDownIcon className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </motion.button>

        <AnimatePresence>
          {dropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={closeDropdown}
              />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20"
              >
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>

                <div className="py-1">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                    onClick={closeDropdown}
                  >
                    <CogIcon className="w-4 h-4" />
                    <span>لوحة التحكم</span>
                  </Link>
                  
                  <Link 
                    href="/dashboard/listings" 
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                    onClick={closeDropdown}
                  >
                    <ClipboardDocumentListIcon className="w-4 h-4" />
                    <span>إعلاناتي</span>
                  </Link>
                  
                  <Link 
                    href="/dashboard/favorites" 
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                    onClick={closeDropdown}
                  >
                    <HeartIcon className="w-4 h-4" />
                    <span>المفضلة</span>
                  </Link>
                </div>

                <div className="border-t border-gray-100 pt-1">
                  <button 
                    className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors duration-150 w-full text-right"
                    onClick={() => {
                      closeDropdown()
                      // Add logout logic here
                    }}
                  >
                    <ArrowLeftOnRectangleIcon className="w-4 h-4" />
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
    <div className="flex items-center gap-2">
      {/* Login Link */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href="/auth/login"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
        >
          <ArrowRightOnRectangleIcon className="w-3.5 h-3.5" />
          <span>دخول</span>
        </Link>
      </motion.div>

      {/* Register Button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href="/auth/register"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-medium rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <UserPlusIcon className="w-3.5 h-3.5" />
          <span>حساب جديد</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default CompactAuthButtons
