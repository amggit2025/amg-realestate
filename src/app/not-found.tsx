'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { HomeIcon, ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-10 right-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"
            />
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, -3, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-20 left-10 w-16 h-16 bg-yellow-200/40 rounded-full blur-lg"
            />
          </div>

          {/* 404 Number */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mb-8"
          >
            <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 select-none">
              404
            </h1>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 text-8xl md:text-9xl font-black text-blue-200/20 select-none"
            >
              404
            </motion.div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              الصفحة غير موجودة
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              عذراً، لا يمكننا العثور على الصفحة التي تبحث عنها. ربما تم حذفها أو تغيير رابطها، أو ربما كتبت الرابط بشكل خاطئ.
            </p>

            {/* Search Suggestion */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8 max-w-lg mx-auto"
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <MagnifyingGlassIcon className="w-6 h-6 text-blue-600" />
                <span className="text-blue-800 font-medium">اقتراحات للبحث</span>
              </div>
              <p className="text-blue-700 text-sm">
                جرب البحث في الصفحة الرئيسية أو تصفح مشاريعنا وخدماتنا المتنوعة
              </p>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link
              href="/"
              className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
            >
              <HomeIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>العودة للرئيسية</span>
            </Link>
            
            <button
              onClick={() => router.back()}
              className="group border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
            >
              <ArrowLeftIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>الصفحة السابقة</span>
            </button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            {[
              { name: 'المشاريع', href: '/projects', icon: '🏢', color: 'bg-blue-500' },
              { name: 'الخدمات', href: '/services', icon: '⚡', color: 'bg-green-500' },
              { name: 'معرض الأعمال', href: '/portfolio', icon: '🎨', color: 'bg-purple-500' },
              { name: 'تواصل معنا', href: '/contact', icon: '📞', color: 'bg-orange-500' }
            ].map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="group block bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    {link.icon}
                  </div>
                  <p className="text-gray-700 font-medium text-sm group-hover:text-blue-600 transition-colors">
                    {link.name}
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 text-sm">
              إذا كنت تعتقد أن هذا خطأ، يرجى 
              <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium mx-1">
                التواصل معنا
              </Link>
              وسنساعدك في إيجاد ما تبحث عنه.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
