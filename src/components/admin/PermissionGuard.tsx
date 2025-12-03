'use client'

import { usePermissions } from '@/hooks/usePermissions'
import { type Module, type Permission } from '@/lib/permissions'

interface PermissionGuardProps {
  module: Module
  permission: Permission
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Component للتحقق من الصلاحيات وإخفاء/إظهار العناصر
 */
export function PermissionGuard({ module, permission, children, fallback = null }: PermissionGuardProps) {
  const { checkPermission, loading } = usePermissions()

  if (loading) {
    return null
  }

  if (!checkPermission(module, permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface ModuleGuardProps {
  module: Module
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Component للتحقق من إمكانية الوصول للوحدة
 */
export function ModuleGuard({ module, children, fallback = null }: ModuleGuardProps) {
  const { checkModuleAccess, loading } = usePermissions()

  if (loading) {
    return null
  }

  if (!checkModuleAccess(module)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
