'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import PasswordStrength from './PasswordStrength'
import Notification from './Notification'

interface AuthFormProps {
  type: 'login' | 'register'
  onSubmit?: (data: any) => void
  isLoading?: boolean
}

interface FormData {
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  password: string
  confirmPassword?: string
  rememberMe?: boolean
  agreeToTerms?: boolean
}

const InputField = ({ 
  label, 
  type, 
  name, 
  value, 
  onChange, 
  placeholder, 
  icon: Icon, 
  required = false,
  error,
  success
}: {
  label: string
  type: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  icon?: React.ComponentType<{ className?: string }>
  required?: boolean
  error?: string
  success?: boolean
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 transition-colors ${
              focused ? 'text-blue-500' : 'text-gray-400'
            }`} />
          </div>
        )}
        
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-500 border rounded-xl
            transition-all duration-300 ease-in-out
            ${Icon ? 'pl-10 sm:pl-11' : 'pl-3 sm:pl-4'}
            ${type === 'password' ? 'pr-10 sm:pr-11' : 'pr-3 sm:pr-4'}
            ${error 
              ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
              : success
              ? 'border-green-300 bg-green-50 focus:ring-green-500 focus:border-green-500'
              : 'border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-0
            hover:border-gray-400
            ${focused ? 'shadow-lg transform scale-[1.02]' : 'shadow-sm'}
          `}
          placeholder={placeholder}
          required={required}
        />
        
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        )}

        {success && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 flex items-center text-sm text-red-600"
          >
            <ExclamationCircleIcon className="h-4 w-4 mr-1" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const SocialButton = ({ 
  provider, 
  icon, 
  onClick, 
  color 
}: { 
  provider: string
  icon: string
  onClick: () => void
  color: string
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`
      w-full flex items-center justify-center px-4 py-3 border border-gray-300 
      rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white 
      hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
      focus:ring-blue-500 transition-all duration-200
      hover:shadow-md hover:border-gray-400
    `}
  >
    <span className="text-xl mr-3">{icon}</span>
    المتابعة مع {provider}
  </motion.button>
)

export default function AuthForm({ type, onSubmit, isLoading = false }: AuthFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    agreeToTerms: false
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [step, setStep] = useState(1)
  const [notification, setNotification] = useState<{
    show: boolean
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
  }>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  })

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setNotification({ show: true, type, title, message })
  }

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type: inputType, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors: Partial<FormData> = {}
    
    if (type === 'register') {
      if (!formData.firstName?.trim()) newErrors.firstName = 'الاسم الأول مطلوب'
      if (!formData.lastName?.trim()) newErrors.lastName = 'الاسم الأخير مطلوب'
      if (!formData.phone?.trim()) newErrors.phone = 'رقم الهاتف مطلوب'
      if (!formData.confirmPassword) newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب'
      else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'كلمات المرور غير متطابقة'
      }
    }
    
    if (!formData.email?.trim()) newErrors.email = 'البريد الإلكتروني مطلوب'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح'
    }
    
    if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة'
    else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      showNotification('success', 'تم بنجاح!', `سيتم ${isRegister ? 'إنشاء حسابك' : 'تسجيل دخولك'} الآن...`)
      setTimeout(() => {
        onSubmit?.(formData)
      }, 1000)
    } else {
      showNotification('error', 'خطأ في البيانات', 'يرجى تصحيح الأخطاء والمحاولة مرة أخرى')
    }
  }

  const isRegister = type === 'register'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto px-4 sm:px-0"
    >
      <motion.div
        className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 text-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
          >
            <span className="text-2xl sm:text-3xl font-bold">A</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2"
          >
            {isRegister ? 'إنشاء حساب جديد' : 'مرحباً بعودتك'}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-xs sm:text-sm"
          >
            {isRegister 
              ? 'انضم إلى مجتمع AMG العقارية' 
              : 'سجل دخولك للمتابعة'
            }
          </motion.p>
        </div>

        {/* Form */}
        <div className="px-6 sm:px-8 py-6 sm:py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {isRegister && step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <InputField
                      label="الاسم الأول"
                      type="text"
                      name="firstName"
                      value={formData.firstName || ''}
                      onChange={handleInputChange}
                      placeholder="أحمد"
                      icon={UserIcon}
                      required
                      error={errors.firstName}
                    />
                    <InputField
                      label="الاسم الأخير"
                      type="text"
                      name="lastName"
                      value={formData.lastName || ''}
                      onChange={handleInputChange}
                      placeholder="محمد"
                      icon={UserIcon}
                      required
                      error={errors.lastName}
                    />
                  </div>
                  
                  <InputField
                    label="رقم الهاتف"
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    placeholder="+20 10 1234 5678"
                    icon={PhoneIcon}
                    required
                    error={errors.phone}
                  />

                  <motion.button
                    type="button"
                    onClick={() => setStep(2)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    المتابعة ←
                  </motion.button>
                </motion.div>
              )}

              {(!isRegister || step === 2) && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {isRegister && (
                    <motion.button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center text-sm text-gray-600 hover:text-gray-800 mb-4"
                    >
                      ← العودة
                    </motion.button>
                  )}

                  <InputField
                    label="البريد الإلكتروني"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="ahmed@example.com"
                    icon={EnvelopeIcon}
                    required
                    error={errors.email}
                  />

                  <InputField
                    label="كلمة المرور"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="أدخل كلمة مرور قوية"
                    icon={LockClosedIcon}
                    required
                    error={errors.password}
                  />
                  
                  {/* Password Strength Indicator */}
                  {isRegister && formData.password && (
                    <PasswordStrength password={formData.password} />
                  )}

                  {isRegister && (
                    <InputField
                      label="تأكيد كلمة المرور"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword || ''}
                      onChange={handleInputChange}
                      placeholder="أعد إدخال كلمة المرور"
                      icon={LockClosedIcon}
                      required
                      error={errors.confirmPassword}
                      success={formData.confirmPassword !== '' && formData.password === formData.confirmPassword}
                    />
                  )}

                  {/* Options */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="mr-2 text-sm text-gray-600">
                        {isRegister ? 'أوافق على الشروط والأحكام' : 'تذكرني'}
                      </span>
                    </label>

                    {!isRegister && (
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                      >
                        نسيت كلمة المرور؟
                      </button>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className={`
                      w-full py-3 px-4 rounded-xl font-semibold shadow-lg transition-all duration-300
                      ${isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl'
                      }
                      text-white
                    `}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                        جاري المعالجة...
                      </div>
                    ) : (
                      isRegister ? 'إنشاء الحساب' : 'تسجيل الدخول'
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Social Login */}
          {!isRegister || step === 2 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6"
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">أو</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <SocialButton
                  provider="Google"
                  icon="🔍"
                  onClick={() => console.log('Google login')}
                  color="red"
                />
                <SocialButton
                  provider="Facebook"
                  icon="📘"
                  onClick={() => console.log('Facebook login')}
                  color="blue"
                />
              </div>
            </motion.div>
          ) : null}

          {/* Switch Form Type */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-600">
              {isRegister ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}{' '}
              <button
                type="button"
                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                onClick={() => window.location.href = isRegister ? '/auth/login' : '/auth/register'}
              >
                {isRegister ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <Notification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClose={hideNotification}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
