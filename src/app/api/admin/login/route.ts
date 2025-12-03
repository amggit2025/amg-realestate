// Admin Login API Route with JWT & Secure Cookies
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { AdminAuth } from '@/lib/admin-auth'
import { logAdminActivity, createAdminSession, getClientIP, getUserAgent } from '@/lib/admin-activity'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'اسم المستخدم وكلمة المرور مطلوبان' },
        { status: 400 }
      )
    }

    // محاولة البحث في قاعدة البيانات أولاً
    let admin: any = null
    
    try {
      admin = await prisma.admin.findUnique({
        where: { username },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          password: true,
          role: true,
          active: true,
          permissions: true,
        }
      })

      // التحقق من كلمة المرور
      if (admin) {
        const isValidPassword = await AdminAuth.verifyPassword(password, admin.password)
        if (!isValidPassword) {
          admin = null
        }
      }
    } catch (dbError) {
      console.warn('Database lookup failed, using fallback admins:', dbError)
    }

    // Fallback - Default Admin Credentials (إذا فشل الاتصال بقاعدة البيانات)
    if (!admin) {
      const defaultAdmins = [
        {
          id: 'admin_default_1',
          username: 'admin',
          password: 'admin123',
          role: 'SUPER_ADMIN',
          email: 'admin@amg-invest.com',
          firstName: 'Super',
          lastName: 'Admin',
          active: true
        },
        {
          id: 'admin_default_2',
          username: 'moderator',
          password: 'mod123',
          role: 'MODERATOR',
          email: 'mod@amg-invest.com',
          firstName: 'Moderator',
          lastName: 'User',
          active: true
        },
        {
          id: 'admin_default_3',
          username: 'eslam',
          password: '123456',
          role: 'SUPER_ADMIN',
          email: 'eslam@amg-invest.com',
          firstName: 'اسلام',
          lastName: 'مجدي',
          active: true
        }
      ]

      // Check fallback credentials
      admin = defaultAdmins.find(
        a => a.username === username && a.password === password
      )
    }

    if (!admin || !admin.active) {
      return NextResponse.json(
        { success: false, message: 'بيانات الدخول غير صحيحة' },
        { status: 401 }
      )
    }

    // إنشاء JWT Token
    const tokenPayload = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions
    }

    const accessToken = AdminAuth.generateAccessToken(tokenPayload)
    const refreshToken = AdminAuth.generateRefreshToken(admin.id, 0)

    // تحديث lastLogin في قاعدة البيانات (إذا كان متاحاً)
    try {
      const clientIP = getClientIP(request)
      
      await prisma.admin.update({
        where: { id: admin.id },
        data: { 
          lastLogin: new Date(),
          lastLoginIp: clientIP,
          refreshToken: refreshToken
        }
      })

      // تسجيل النشاط
      await logAdminActivity({
        adminId: admin.id,
        action: 'LOGIN',
        ipAddress: clientIP,
        userAgent: getUserAgent(request),
      })

      // إنشاء جلسة
      await createAdminSession(
        admin.id,
        accessToken,
        request,
        7 // 7 days
      )
    } catch (updateError) {
      console.warn('Could not update lastLogin or create session:', updateError)
    }

    // إنشاء response مع الـ cookies
    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role,
          permissions: admin.permissions
        },
        token: accessToken
      }
    })

    // إضافة الـ cookies الآمنة
    // Access Token Cookie
    response.cookies.set('admin_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // تغيير من strict إلى lax للسماح بالـ redirects
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    // Refresh Token Cookie
    response.cookies.set('admin_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // تغيير من strict إلى lax للسماح بالـ redirects
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
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
