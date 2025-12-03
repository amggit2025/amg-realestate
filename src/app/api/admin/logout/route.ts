// Admin Logout API Route
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // الحصول على admin id من الـ headers (يتم إضافته من الـ middleware)
    const adminId = request.headers.get('x-admin-id')

    // حذف الـ refresh token من قاعدة البيانات
    if (adminId) {
      try {
        await prisma.admin.update({
          where: { id: adminId },
          data: { 
            refreshToken: null,
            tokenVersion: { increment: 1 } // زيادة tokenVersion لإبطال جميع الـ tokens
          }
        })
      } catch (dbError) {
        console.warn('Could not update admin logout:', dbError)
      }
    }

    // إنشاء response
    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح'
    })

    // حذف الـ cookies
    response.cookies.delete('admin_token')
    response.cookies.delete('admin_refresh_token')

    return response

  } catch (error) {
    console.error('Admin logout error:', error)
    
    // حتى في حالة الخطأ، نحذف الـ cookies
    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الخروج'
    })
    
    response.cookies.delete('admin_token')
    response.cookies.delete('admin_refresh_token')
    
    return response
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    message: 'طريقة غير مسموحة - استخدم POST'
  }, { status: 405 })
}
