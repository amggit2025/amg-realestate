// Admin Session Verification API Route
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    // الحصول على الـ token من الـ cookies
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'لا توجد جلسة نشطة',
          requireAuth: true 
        },
        { status: 401 }
      )
    }

    // التحقق من صحة الـ token
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET || 'amg-admin-jwt-secret-key-super-secure-2024-v2')
    } catch (jwtError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'جلسة غير صالحة أو منتهية الصلاحية',
          requireAuth: true 
        },
        { status: 401 }
      )
    }

    const adminId = decoded.id

    if (!adminId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'جلسة غير صالحة',
          requireAuth: true 
        },
        { status: 401 }
      )
    }

    // محاولة الحصول على بيانات الأدمن من قاعدة البيانات
    let admin = null
    
    try {
      admin = await prisma.admin.findUnique({
        where: { id: adminId },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          active: true,
          permissions: true,
          lastLogin: true,
          tokenVersion: true,
        }
      })

      if (!admin || !admin.active) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'حساب الأدمن غير نشط أو غير موجود',
            requireAuth: true 
          },
          { status: 401 }
        )
      }

      // التحقق من token version
      if (decoded.tokenVersion !== undefined && admin.tokenVersion !== decoded.tokenVersion) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'تم إبطال الجلسة. قم بتسجيل الدخول مرة أخرى.',
            requireAuth: true 
          },
          { status: 401 }
        )
      }
    } catch (dbError) {
      console.error('Database lookup failed:', dbError)
      return NextResponse.json(
        { 
          success: false, 
          message: 'خطأ في الوصول لقاعدة البيانات',
          requireAuth: true 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        admin: {
          id: admin.id,
          username: admin.username || 'admin',
          email: admin.email,
          firstName: admin.firstName || 'Admin',
          lastName: admin.lastName || 'User',
          role: admin.role,
          permissions: admin.permissions,
          lastLogin: admin.lastLogin,
        }
      }
    })

  } catch (error) {
    console.error('Admin session verification error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ في التحقق من الجلسة',
        requireAuth: true 
      },
      { status: 500 }
    )
  }
}
