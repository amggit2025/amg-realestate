'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShieldExclamationIcon } from '@heroicons/react/24/outline'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center"
      >
        <div className="mb-6">
          <ShieldExclamationIcon className="w-24 h-24 text-red-500 mx-auto" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          غير مصرح لك
        </h1>
        
        <p className="text-gray-600 mb-8">
          عذراً، ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة.
          <br />
          يرجى التواصل مع المدير العام للحصول على الصلاحيات المطلوبة.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            العودة للخلف
          </button>
          
          <button
            onClick={() => router.push('/admin')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </motion.div>
    </div>
  )
}
