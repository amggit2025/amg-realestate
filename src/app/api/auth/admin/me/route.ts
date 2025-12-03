import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { AdminAuth } from '@/lib/admin-auth'

// GET: الحصول على بيانات المشرف الحالي
export async function GET(request: NextRequest) {
  try {
    // الحصول على التوكن من الكوكيز
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      )
    }

    // التحقق من التوكن
    const decoded = AdminAuth.verifyAccessToken(token)

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'توكن غير صالح' },
        { status: 401 }
      )
    }

    // الحصول على بيانات المشرف
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        permissions: true,
        active: true,
        createdAt: true,
        lastLogin: true,
        lastLoginIp: true,
      },
    })

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'المشرف غير موجود' },
        { status: 404 }
      )
    }

    if (!admin.active) {
      return NextResponse.json(
        { success: false, message: 'الحساب معطل' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      admin,
    })
  } catch (error) {
    console.error('Error getting admin data:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ في التحقق من الهوية' },
      { status: 401 }
    )
  }
}
