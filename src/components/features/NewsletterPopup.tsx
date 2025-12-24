'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, EnvelopeIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

export default function NewsletterPopup() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Don't show popup in admin pages
    if (pathname?.startsWith('/admin')) {
      return
    }

    // Show popup after 6 seconds on every page load
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 6000)

    return () => clearTimeout(timer)
  }, [pathname])

  const handleClose = () => {
    setIsOpen(false)
    // Just close without saving to localStorage (testing mode)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          source: 'popup' // Track that it came from popup
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Don't save to localStorage in testing mode
        
        // Close popup after 3 seconds
        setTimeout(() => {
          setIsOpen(false)
        }, 3000)
      } else {
        setError(data.message || 'حدث خطأ، حاول مرة أخرى')
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden relative">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-300 hover:scale-110"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>

              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="relative h-64 md:h-auto bg-gradient-to-br from-blue-600 to-indigo-600">
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="text-center text-white">
                      {/* Decorative Icon */}
                      <motion.div
                        animate={{
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="mb-6"
                      >
                        <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <EnvelopeIcon className="w-12 h-12" />
                        </div>
                      </motion.div>

                      <h3 className="text-2xl font-bold mb-3">
                        ابقَ على اطلاع!
                      </h3>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        اشترك في نشرتنا الإخبارية واحصل على أحدث العروض والمشاريع العقارية
                      </p>

                      {/* Floating particles */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              y: [0, -30, 0],
                              opacity: [0.3, 0.7, 0.3],
                            }}
                            transition={{
                              duration: 3 + i * 0.5,
                              repeat: Infinity,
                              delay: i * 0.3,
                            }}
                            className="absolute"
                            style={{
                              left: `${20 + i * 15}%`,
                              top: `${30 + i * 10}%`,
                            }}
                          >
                            <SparklesIcon className="w-4 h-4 text-white/40" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Side */}
                <div className="p-8">
                  {!success ? (
                    <>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        🎉 عرض خاص!
                      </h2>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        اشترك الآن واحصل على <span className="text-blue-600 font-bold">أولوية</span> في معرفة أحدث المشاريع والعروض الحصرية
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="popup-email" className="block text-sm font-medium text-gray-700 mb-2">
                            البريد الإلكتروني
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              id="popup-email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="example@email.com"
                              required
                              className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                            />
                            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          </div>
                        </div>

                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                          >
                            {error}
                          </motion.div>
                        )}

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              جاري الاشتراك...
                            </span>
                          ) : (
                            'اشترك الآن مجاناً'
                          )}
                        </button>

                        <p className="text-xs text-gray-500 text-center">
                          بالاشتراك، أنت توافق على{' '}
                          <a href="/privacy" className="text-blue-600 hover:underline">سياسة الخصوصية</a>
                        </p>
                      </form>

                      {/* Benefits */}
                      <div className="mt-6 space-y-2">
                        {[
                          'أحدث المشاريع العقارية',
                          'عروض حصرية للمشتركين',
                          'نصائح عقارية مفيدة'
                        ].map((benefit, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="flex items-center gap-2 text-sm text-gray-600"
                          >
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            {benefit}
                          </motion.div>
                        ))}
                      </div>
                    </>
                  ) : (
                    // Success State
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
                      >
                        <CheckCircleIcon className="w-12 h-12 text-green-600" />
                      </motion.div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        🎉 تم الاشتراك بنجاح!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        شكراً لانضمامك! ستصلك أحدث العروض والمشاريع على بريدك الإلكتروني
                      </p>

                      <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 rounded-xl text-green-700 font-medium">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        تم التأكيد
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
