'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-gray-100"
      >
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⚠️</span>
        </div>
        
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          عذراً، حدث خطأ غير متوقع
        </h2>
        
        <p className="text-gray-500 mb-8 leading-relaxed">
          نعتذر عن هذا الخلل. فريقنا التقني يعمل على حله. يمكنك المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
        </p>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg hover:shadow-slate-500/20"
          >
            <ArrowPathIcon className="w-5 h-5" />
            المحاولة مرة أخرى
          </button>
          
          <Link
            href="/"
            className="block w-full bg-white border border-gray-200 text-slate-900 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-center gap-2">
               <HomeIcon className="w-5 h-5" />
               الصفحة الرئيسية
            </div>
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-xl text-left text-xs font-mono overflow-auto max-h-40 ltr">
            <p className="font-bold text-red-600 mb-1">{error.name}</p>
            <p className="text-gray-700">{error.message}</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
