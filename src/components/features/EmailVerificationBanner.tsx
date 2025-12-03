'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  EnvelopeIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface EmailVerificationBannerProps {
  email: string
  isVerified: boolean
  onVerificationSuccess?: () => void
}

export default function EmailVerificationBanner({ 
  email, 
  isVerified,
  onVerificationSuccess 
}: EmailVerificationBannerProps) {
  const [isOpen, setIsOpen] = useState(!isVerified)
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
  const [devCode, setDevCode] = useState<string | null>(null)

  // إرسال رمز التحقق
  const handleSendCode = async () => {
    setSendingCode(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success) {
        setShowCodeInput(true)
        setMessage(data.message)
        setMessageType('success')
        
        // في التطوير، نحفظ الكود للعرض
        if (data.devCode) {
          setDevCode(data.devCode)
        }
      } else {
        setMessage(data.message)
        setMessageType('error')
      }
    } catch (error) {
      setMessage('حدث خطأ في الاتصال')
      setMessageType('error')
    } finally {
      setSendingCode(false)
    }
  }

  // التحقق من الرمز
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (code.length !== 6) {
      setMessage('الرمز يجب أن يكون 6 أرقام')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      })

      const data = await response.json()

      if (data.success) {
        setMessage(data.message)
        setMessageType('success')
        
        // إخفاء البانر بعد ثانيتين
        setTimeout(() => {
          setIsOpen(false)
          if (onVerificationSuccess) {
            onVerificationSuccess()
          }
        }, 2000)
      } else {
        setMessage(data.message)
        setMessageType('error')
      }
    } catch (error) {
      setMessage('حدث خطأ في الاتصال')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  if (isVerified || !isOpen) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 mb-6 shadow-lg"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 space-x-reverse flex-1">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-8 w-8 text-yellow-600" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                تأكيد البريد الإلكتروني مطلوب
              </h3>
              <p className="text-gray-700 mb-4">
                يرجى تأكيد بريدك الإلكتروني <span className="font-semibold">{email}</span> للاستفادة من جميع ميزات الموقع
              </p>

              {!showCodeInput ? (
                <button
                  onClick={handleSendCode}
                  disabled={sendingCode}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sendingCode ? (
                    <>
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <EnvelopeIcon className="h-5 w-5" />
                      إرسال رمز التحقق
                    </>
                  )}
                </button>
              ) : (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  {/* رسالة للتحقق من Spam */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <ExclamationCircleIcon className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-800 font-medium mb-1">
                          تم إرسال رمز التحقق إلى بريدك الإلكتروني!
                        </p>
                        <p className="text-sm text-yellow-700">
                          💡 إذا لم تجد الرسالة في صندوق الوارد، يرجى التحقق من مجلد <strong>البريد العشوائي (Spam/Junk)</strong>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* في بيئة التطوير، نعرض الكود */}
                  {devCode && (
                    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>🔧 بيئة التطوير:</strong> رمز التحقق هو:
                      </p>
                      <p className="text-2xl font-bold text-blue-600 text-center tracking-widest">
                        {devCode}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      أدخل رمز التحقق (6 أرقام)
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        if (value.length <= 6) {
                          setCode(value)
                        }
                      }}
                      placeholder="000000"
                      className="w-full md:w-64 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest font-bold"
                      maxLength={6}
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={loading || code.length !== 6}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <ArrowPathIcon className="h-5 w-5 animate-spin" />
                          جاري التحقق...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="h-5 w-5" />
                          تأكيد
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={sendingCode}
                      className="text-blue-600 hover:text-blue-800 font-medium underline disabled:opacity-50"
                    >
                      إعادة إرسال الرمز
                    </button>
                  </div>
                </form>
              )}

              {/* رسالة النجاح أو الخطأ */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-4 rounded-lg ${
                    messageType === 'success' 
                      ? 'bg-green-50 border border-green-200 text-green-800' 
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {messageType === 'success' ? (
                      <CheckCircleIcon className="h-5 w-5" />
                    ) : (
                      <ExclamationCircleIcon className="h-5 w-5" />
                    )}
                    <span className="font-medium">{message}</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
