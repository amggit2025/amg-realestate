'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { logger } from '@/lib/logger'
import AuthLayout from '@/components/layout/AuthLayout'
import { RegisterForm } from '@/components/ui/SplitAuthForms'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { register } = useAuth()

  const handleRegister = async (formData: any) => {
    setIsLoading(true)
    setError('')
    
    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        userType: formData.userType || 'INDIVIDUAL'
      })
      
      if (result.success) {
        router.push('/dashboard')
      } else {
        setError(result.message)
      }
    } catch (error) {
      logger.error('Registration error:', error)
      setError('حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout type="register">
      <RegisterForm 
        onSubmit={handleRegister}
        isLoading={isLoading}
        error={error}
      />
    </AuthLayout>
  )
}
