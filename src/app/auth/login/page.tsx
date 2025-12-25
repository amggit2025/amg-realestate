'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { logger } from '@/lib/logger'
import AuthLayout from '@/components/layout/AuthLayout'
import { LoginForm } from '@/components/ui/SplitAuthForms'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async (formData: { email: string; password: string; rememberMe: boolean }) => {
    setIsLoading(true)
    setError('')
    
    try {
      const result = await login(formData.email, formData.password, formData.rememberMe)
      
      if (result.success) {
        router.push('/dashboard')
      } else {
        setError(result.message)
      }
    } catch (error) {
      logger.error('Login error:', error)
      setError('حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout type="login">
      <LoginForm 
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={error}
      />
    </AuthLayout>
  )
}
