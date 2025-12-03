'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { hasPermission, canAccessModule, type Module, type Permission, type AdminRole, type PermissionsMap } from '@/lib/permissions'

interface AdminUser {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: AdminRole
  permissions: PermissionsMap | null
  active: boolean
}

export function usePermissions(options: { skipAuth?: boolean } = {}) {
  const router = useRouter()
  const pathname = usePathname()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // لا تعمل check للـ auth في صفحة الـ login أو لو skipAuth = true
    if (pathname === '/admin/login' || options.skipAuth) {
      setLoading(false)
      return
    }
    
    checkAuth()
  }, [pathname, options.skipAuth])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/admin/me', {
        credentials: 'include', // مهم عشان الـ cookies
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.admin) {
          setAdmin(data.admin)
        } else {
          // إذا كانت الـ response ok لكن مافيش admin، يبقى في مشكلة
          console.error('No admin data in response')
          if (pathname !== '/admin/login') {
            router.push('/admin/login')
          }
        }
      } else {
        // إذا كانت الـ response مش ok
        console.error('Auth check failed:', response.status)
        if (pathname !== '/admin/login') {
          router.push('/admin/login')
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      if (pathname !== '/admin/login') {
        router.push('/admin/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const checkPermission = (module: Module, permission: Permission): boolean => {
    if (!admin) return false
    return hasPermission(admin.role, admin.permissions, module, permission)
  }

  const checkModuleAccess = (module: Module): boolean => {
    if (!admin) return false
    return canAccessModule(admin.role, admin.permissions, module)
  }

  const isSuperAdmin = (): boolean => {
    return admin?.role === 'SUPER_ADMIN'
  }

  const requirePermission = (module: Module, permission: Permission) => {
    if (!checkPermission(module, permission)) {
      router.push('/admin/unauthorized')
    }
  }

  return {
    admin,
    loading,
    checkPermission,
    checkModuleAccess,
    isSuperAdmin,
    requirePermission,
  }
}
