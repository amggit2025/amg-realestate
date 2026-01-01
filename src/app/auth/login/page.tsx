'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useAuth } from '@/lib/AuthContext'
import { logger } from '@/lib/logger'
import AuthLayout from '@/components/layout/AuthLayout'
import { LoginForm } from '@/components/ui/SplitAuthForms'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  // Check for NextAuth errors
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError('حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.')
    }
  }, [searchParams])

  const handleLogin = async (formData: { email: string; password: string; rememberMe: boolean }) => {
    setIsLoading(true)
    setError('')
    
    try {
      // Use NextAuth signIn for credentials
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      } else if (result?.ok) {
        const redirectUrl = searchParams.get('redirect')
        router.push(redirectUrl || '/dashboard')
        router.refresh()
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
