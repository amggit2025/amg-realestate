'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ContactFormData, 
  contactFormSchema,
  serviceOptions,
  budgetOptions,
  urgencyOptions,
  contactPreferences
} from '@/lib/validation'
import { sendContactForm } from '@/lib/contact'
import { LoadingButton } from '@/components/ui/LoadingStates'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

interface ContactFormProps {
  className?: string
  onSuccess?: () => void
  defaultService?: string
}

export default function ContactForm({ 
  className = '',
  onSuccess,
  defaultService = ''
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      service: defaultService || '',
      urgency: 'medium' as const,
      preferredContact: 'phone' as const
    }
  })

  const watchedUrgency = watch('urgency')
  const watchedPreferredContact = watch('preferredContact')

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const result = await sendContactForm(data)
      
      if (result.success) {
        setSubmitStatus('success')
        reset()
        onSuccess?.()
      } else {
        throw new Error(result.error || 'فشل في إرسال الرسالة')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'حدث خطأ غير متوقع')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getIconForContact = (type: string) => {
    switch (type) {
      case 'phone': return <PhoneIcon className="w-5 h-5" />
      case 'email': return <EnvelopeIcon className="w-5 h-5" />
      case 'whatsapp': return <ChatBubbleLeftRightIcon className="w-5 h-5" />
      default: return <PhoneIcon className="w-5 h-5" />
    }
  }

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-8 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">تواصل معنا</h2>
        <p className="text-gray-600">سنكون سعداء بخدمتك والرد على استفساراتك</p>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center"
          >
            <CheckCircleIcon className="w-6 h-6 text-green-600 ml-3" />
            <div>
              <p className="text-green-800 font-medium">تم إرسال رسالتك بنجاح!</p>
              <p className="text-green-600 text-sm">سنتواصل معك في أقرب وقت ممكن</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
          >
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600 ml-3" />
            <div>
              <p className="text-red-800 font-medium">حدث خطأ أثناء الإرسال</p>
              <p className="text-red-600 text-sm">{errorMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name & Email Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الاسم الكامل *
            </label>
            <input
              {...register('name')}
              type="text"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="اكتب اسمك الكامل"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني *
            </label>
            <input
              {...register('email')}
              type="email"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رقم الهاتف *
          </label>
          <input
            {...register('phone')}
            type="tel"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="01xxxxxxxxx"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Service & Budget Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الخدمة المطلوبة *
            </label>
            <select
              {...register('service')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.service ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">اختر الخدمة</option>
              {serviceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.service && (
              <p className="mt-1 text-sm text-red-600">{errors.service.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الميزانية المتوقعة
            </label>
            <select
              {...register('budget')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">اختر الميزانية (اختياري)</option>
              {budgetOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            مستوى الأولوية
          </label>
          <div className="grid grid-cols-3 gap-3">
            {urgencyOptions.map(option => (
              <label key={option.value} className="relative cursor-pointer">
                <input
                  {...register('urgency')}
                  type="radio"
                  value={option.value}
                  className="sr-only"
                />
                <div className={`p-3 border-2 rounded-lg text-center transition-all ${
                  watchedUrgency === option.value
                    ? `border-${option.color}-500 bg-${option.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Preferred Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            طريقة التواصل المفضلة
          </label>
          <div className="grid grid-cols-3 gap-3">
            {contactPreferences.map(option => (
              <label key={option.value} className="relative cursor-pointer">
                <input
                  {...register('preferredContact')}
                  type="radio"
                  value={option.value}
                  className="sr-only"
                />
                <div className={`p-3 border-2 rounded-lg text-center transition-all ${
                  watchedPreferredContact === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center justify-center mb-1">
                    {getIconForContact(option.value)}
                  </div>
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تفاصيل المشروع *
          </label>
          <textarea
            {...register('message')}
            rows={5}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
              errors.message ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="اكتب تفاصيل مشروعك أو استفسارك هنا..."
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        {/* Consent */}
        <div className="flex items-start">
          <input
            {...register('consent')}
            type="checkbox"
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="mr-3 text-sm text-gray-700">
            أوافق على <a href="/privacy" className="text-blue-600 hover:underline">شروط الخدمة وسياسة الخصوصية</a> *
          </label>
        </div>
        {errors.consent && (
          <p className="text-sm text-red-600">{errors.consent.message}</p>
        )}

        {/* Submit Button */}
        <LoadingButton
          loading={isSubmitting}
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-emerald-700 focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
        </LoadingButton>
      </form>
    </div>
  )
}
