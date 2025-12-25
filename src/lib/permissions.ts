/**
 * نظام إدارة الصلاحيات للمشرفين
 */

export type Permission = 
  | 'view' 
  | 'create' 
  | 'edit' 
  | 'delete' 
  | 'approve' 
  | 'reject'
  | 'export'

export type Module = 
  | 'properties'
  | 'users'
  | 'projects'
  | 'portfolio'
  | 'services'
  | 'inquiries'
  | 'appointments'
  | 'newsletter'
  | 'reports'
  | 'admins'
  | 'testimonials'
  | 'general-info'
  | 'about'

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR'

export interface PermissionsMap {
  [module: string]: {
    [permission: string]: boolean
  }
}

/**
 * التحقق من صلاحية معينة
 */
export function hasPermission(
  userRole: AdminRole,
  userPermissions: PermissionsMap | null,
  module: Module,
  permission: Permission
): boolean {
  // SUPER_ADMIN له كل الصلاحيات
  if (userRole === 'SUPER_ADMIN') {
    return true
  }

  // التحقق من الصلاحيات المخصصة
  if (userPermissions && userPermissions[module]) {
    return userPermissions[module][permission] === true
  }

  return false
}

/**
 * التحقق من إمكانية الوصول للوحدة
 */
export function canAccessModule(
  userRole: AdminRole,
  userPermissions: PermissionsMap | null,
  module: Module
): boolean {
  // SUPER_ADMIN له كل الصلاحيات
  if (userRole === 'SUPER_ADMIN') {
    return true
  }

  // التحقق من وجود أي صلاحية في الوحدة
  if (userPermissions && userPermissions[module]) {
    return Object.values(userPermissions[module]).some(v => v === true)
  }

  return false
}

/**
 * الحصول على الصلاحيات الافتراضية حسب الدور
 */
export function getDefaultPermissions(role: AdminRole): PermissionsMap {
  if (role === 'SUPER_ADMIN') {
    return {
      properties: { view: true, create: true, edit: true, delete: true, approve: true },
      users: { view: true, create: true, edit: true, delete: true },
      projects: { view: true, create: true, edit: true, delete: true },
      portfolio: { view: true, create: true, edit: true, delete: true },
      services: { view: true, create: true, edit: true, delete: true },
      inquiries: { view: true, create: true, edit: true, delete: true },
      appointments: { view: true, create: true, edit: true, delete: true },
      newsletter: { view: true, create: true, delete: true },
      reports: { view: true, export: true },
      admins: { view: true, create: true, edit: true, delete: true },
      testimonials: { view: true, create: true, edit: true, delete: true },
      'general-info': { view: true, create: true, edit: true, delete: true },
      about: { view: true, create: true, edit: true, delete: true },
    }
  }

  if (role === 'ADMIN') {
    return {
      properties: { view: true, create: true, edit: true, delete: false, approve: true },
      users: { view: true, create: true, edit: true, delete: false },
      projects: { view: true, create: true, edit: true, delete: false },
      portfolio: { view: true, create: true, edit: true, delete: false },
      services: { view: true, create: true, edit: true, delete: false },
      inquiries: { view: true, create: true, edit: true, delete: false },
      appointments: { view: true, create: true, edit: true, delete: false },
      newsletter: { view: true, create: false, delete: false },
      reports: { view: true, export: true },
      admins: { view: true, create: false, edit: false, delete: false },
      testimonials: { view: true, create: true, edit: true, delete: false },
      'general-info': { view: true, create: true, edit: true, delete: false },
      about: { view: true, create: true, edit: true, delete: false },
    }
  }

  // MODERATOR - صلاحيات محدودة
  return {
    properties: { view: true, create: false, edit: false, delete: false, approve: false },
    users: { view: true, create: false, edit: false, delete: false },
    projects: { view: true, create: false, edit: false, delete: false },
    portfolio: { view: true, create: false, edit: false, delete: false },
    services: { view: true, create: false, edit: false, delete: false },
    inquiries: { view: true, create: false, edit: false, delete: false },
    appointments: { view: true, create: false, edit: false, delete: false },
    newsletter: { view: true, create: false, delete: false },
    reports: { view: true, export: false },
    admins: { view: false, create: false, edit: false, delete: false },
    testimonials: { view: false, create: false, edit: false, delete: false },
    'general-info': { view: false, create: false, edit: false, delete: false },
    about: { view: false, create: false, edit: false, delete: false },
  }
}

/**
 * قائمة الصفحات وصلاحياتها المطلوبة
 */
export const PAGE_PERMISSIONS: Record<string, { module: Module; permission: Permission }> = {
  '/admin/properties': { module: 'properties', permission: 'view' },
  '/admin/users': { module: 'users', permission: 'view' },
  '/admin/projects': { module: 'projects', permission: 'view' },
  '/admin/portfolio': { module: 'portfolio', permission: 'view' },
  '/admin/services': { module: 'services', permission: 'view' },
  '/admin/inquiries': { module: 'inquiries', permission: 'view' },
  '/admin/subscriptions': { module: 'newsletter', permission: 'view' },
  '/admin/appointments': { module: 'appointments', permission: 'view' },
  '/admin/reports': { module: 'reports', permission: 'view' },
  '/admin/admins': { module: 'admins', permission: 'view' },
  '/admin/testimonials': { module: 'testimonials', permission: 'view' },
  '/admin/general-info': { module: 'general-info', permission: 'view' },
  '/admin/about-page': { module: 'about', permission: 'view' },
}

/**
 * تصفية قائمة الصفحات حسب الصلاحيات
 */
export function getAccessiblePages(
  userRole: AdminRole,
  userPermissions: PermissionsMap | null
): string[] {
  return Object.entries(PAGE_PERMISSIONS)
    .filter(([_, config]) => hasPermission(userRole, userPermissions, config.module, config.permission))
    .map(([path]) => path)
}
