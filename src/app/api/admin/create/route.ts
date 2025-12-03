// Create New Admin API Route (SUPER_ADMIN only)
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { AdminAuth } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    // التحقق من صلاحيات الأدمن
    const adminRole = request.headers.get('x-admin-role')
    
    if (adminRole !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'غير مصرح لك بإنشاء حسابات أدمن. صلاحية SUPER_ADMIN مطلوبة.' 
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { username, email, firstName, lastName, password, role, permissions } = body

    // Validation
    if (!username || !email || !firstName || !lastName || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    // التحقق من عدم وجود الأدمن مسبقاً
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email }
        ]
      }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: 'اسم المستخدم أو البريد الإلكتروني موجود بالفعل' },
        { status: 400 }
      )
    }

    // تشفير كلمة المرور
    const hashedPassword = await AdminAuth.hashPassword(password)

    // Default permissions based on role
    type PermissionSet = {
      [key: string]: { read: boolean; write: boolean; delete: boolean }
    }

    const defaultPermissions: Record<string, PermissionSet> = {
      SUPER_ADMIN: {
        users: { read: true, write: true, delete: true },
        properties: { read: true, write: true, delete: true },
        projects: { read: true, write: true, delete: true },
        inquiries: { read: true, write: true, delete: true },
        reports: { read: true, write: true, delete: true },
        settings: { read: true, write: true, delete: true },
        admins: { read: true, write: true, delete: true }
      },
      ADMIN: {
        users: { read: true, write: true, delete: false },
        properties: { read: true, write: true, delete: true },
        projects: { read: true, write: true, delete: true },
        inquiries: { read: true, write: true, delete: false },
        reports: { read: true, write: false, delete: false },
        settings: { read: true, write: false, delete: false }
      },
      MODERATOR: {
        users: { read: true, write: false, delete: false },
        properties: { read: true, write: true, delete: false },
        projects: { read: true, write: false, delete: false },
        inquiries: { read: true, write: true, delete: false },
        reports: { read: true, write: false, delete: false }
      },
      SUPPORT: {
        users: { read: true, write: false, delete: false },
        properties: { read: true, write: false, delete: false },
        inquiries: { read: true, write: true, delete: false }
      }
    }

    const finalPermissions = permissions || defaultPermissions[role] || defaultPermissions['SUPPORT']

    // إنشاء الأدمن
    const newAdmin = await prisma.admin.create({
      data: {
        username,
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role,
        permissions: finalPermissions,
        active: true
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        permissions: true,
        active: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء حساب الأدمن بنجاح',
      data: {
        admin: newAdmin
      }
    })

  } catch (error) {
    console.error('Create admin error:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في إنشاء حساب الأدمن' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    message: 'طريقة غير مسموحة - استخدم POST'
  }, { status: 405 })
}
