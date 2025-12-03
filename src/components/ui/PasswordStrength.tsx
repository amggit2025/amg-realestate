'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PasswordStrengthProps {
  password: string
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const [strength, setStrength] = useState(0)
  const [requirements, setRequirements] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false
  })

  useEffect(() => {
    const newRequirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    
    setRequirements(newRequirements)
    
    const score = Object.values(newRequirements).filter(Boolean).length
    setStrength(score)
  }, [password])

  if (!password) return null

  const getStrengthColor = () => {
    if (strength < 2) return 'bg-red-500'
    if (strength < 4) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (strength < 2) return 'ضعيفة'
    if (strength < 4) return 'متوسطة'
    return 'قوية'
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 space-y-2"
    >
      <div className="flex items-center space-x-2 space-x-reverse">
        <span className="text-sm text-gray-600">قوة كلمة المرور:</span>
        <span className={`text-sm font-medium ${
          strength < 2 ? 'text-red-600' : strength < 4 ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {getStrengthText()}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${(strength / 5) * 100}%` }}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-1 text-xs">
        <div className={`flex items-center ${requirements.length ? 'text-green-600' : 'text-gray-400'}`}>
          <span className="mr-1">{requirements.length ? '✓' : '×'}</span>
          8 أحرف على الأقل
        </div>
        <div className={`flex items-center ${requirements.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
          <span className="mr-1">{requirements.lowercase ? '✓' : '×'}</span>
          حرف صغير
        </div>
        <div className={`flex items-center ${requirements.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
          <span className="mr-1">{requirements.uppercase ? '✓' : '×'}</span>
          حرف كبير
        </div>
        <div className={`flex items-center ${requirements.number ? 'text-green-600' : 'text-gray-400'}`}>
          <span className="mr-1">{requirements.number ? '✓' : '×'}</span>
          رقم
        </div>
      </div>
    </motion.div>
  )
}

export default PasswordStrength
