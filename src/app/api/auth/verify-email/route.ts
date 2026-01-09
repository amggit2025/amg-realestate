// ======================================================
// ✅ AMG Real Estate - Verify Email with Code
// ======================================================
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { logUserActivity } from '@/lib/activity-logger'
import jwt from 'jsonwebtoken'
import { getServerSession } from 'next-auth'
import { authOptions } from '../[...nextauth]/route'

// دالة للتحقق من صحة Token
function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
  } catch (error) {
    return null
  }
}

// التحقق من البريد الإلكتروني باستخدام الرمز
export async function POST(request: NextRequest) {
  try {
    let userId: string | null = null

    // أولاً: فحص NextAuth session
    const session = await getServerSession(authOptions)
    if (session?.user?.id) {
      userId = session.user.id as string
    }

    // ثانياً: فحص JWT token العادي إذا لم يوجد NextAuth session
    if (!userId) {
      let token = request.cookies.get('auth-token')?.value
      
      if (!token) {
        const authHeader = request.headers.get('authorization')
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7)
        }
      }

      if (token) {
        const decoded = verifyToken(token)
        if (decoded?.userId) {
          userId = decoded.userId
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح - تسجيل الدخول مطلوب' },
        { status: 401 }
      )
    }

    // الحصول على رمز التحقق من الطلب
    const body = await request.json()
    const { code } = body

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { success: false, message: 'رمز التحقق غير صحيح' },
        { status: 400 }
      )
    }

    // جلب بيانات المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        emailVerifyToken: true,
        verifyTokenExpiry: true,
        firstName: true,
        lastName: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // التحقق من أن البريد لم يتم التحقق منه بالفعل
    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني موثق بالفعل' },
        { status: 400 }
      )
    }

    // التحقق من وجود رمز
    if (!user.emailVerifyToken) {
      return NextResponse.json(
        { success: false, message: 'لم يتم طلب رمز تحقق. يرجى طلب رمز جديد' },
        { status: 400 }
      )
    }

    // التحقق من انتهاء صلاحية الرمز
    if (!user.verifyTokenExpiry || new Date() > user.verifyTokenExpiry) {
      return NextResponse.json(
        { success: false, message: 'انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد' },
        { status: 400 }
      )
    }

    // التحقق من تطابق الرمز
    if (user.emailVerifyToken !== code) {
      return NextResponse.json(
        { success: false, message: 'رمز التحقق غير صحيح' },
        { status: 400 }
      )
    }

    // تحديث حالة التحقق
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
        verifyTokenExpiry: null
      }
    })

    // تسجيل النشاط
    await logUserActivity({
      userId: user.id,
      activityType: 'EMAIL_VERIFY',
      entityType: 'USER',
      entityId: user.id,
      title: 'تم توثيق البريد الإلكتروني',
      description: `تم توثيق البريد الإلكتروني ${user.email} بنجاح`,
      metadata: {
        email: user.email
      }
    })

    console.log(`✅ Email verified for user: ${user.email}`)

    return NextResponse.json({
      success: true,
      message: 'تم توثيق البريد الإلكتروني بنجاح! 🎉'
    })

  } catch (error) {
    console.error('❌ Verify email error:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء التحقق من البريد الإلكتروني' },
      { status: 500 }
    )
  }
}
