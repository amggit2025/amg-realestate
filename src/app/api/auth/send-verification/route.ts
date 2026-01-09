// ======================================================
// 📧 AMG Real Estate - Send Email Verification
// ======================================================
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { sendVerificationEmail } from '@/lib/email'
import crypto from 'crypto'
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

// إرسال رمز التحقق بالبريد الإلكتروني
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

    // جلب بيانات المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        emailVerified: true,
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

    // توليد رمز التحقق (6 أرقام)
    const verificationCode = crypto.randomInt(100000, 999999).toString()
    
    // تاريخ انتهاء الصلاحية (30 دقيقة)
    const expiryDate = new Date()
    expiryDate.setMinutes(expiryDate.getMinutes() + 30)

    // حفظ رمز التحقق في قاعدة البيانات
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifyToken: verificationCode,
        verifyTokenExpiry: expiryDate
      }
    })

    // إرسال البريد الإلكتروني الفعلي
    const userName = `${user.firstName} ${user.lastName}`.trim()
    const emailSent = await sendVerificationEmail(
      user.email,
      userName || 'عزيزي المستخدم',
      verificationCode
    )

    // في بيئة التطوير أو إذا فشل إرسال البريد، نعرض الكود في الـ console
    if (process.env.NODE_ENV === 'development' || !emailSent) {
      console.log('=' .repeat(50))
      console.log(`🔐 رمز التحقق لـ ${userName}`)
      console.log(`📧 البريد: ${user.email}`)
      console.log(`🔢 الرمز: ${verificationCode}`)
      console.log(`⏰ صالح لمدة 30 دقيقة`)
      console.log(`📮 حالة البريد: ${emailSent ? '✅ تم الإرسال' : '❌ فشل الإرسال'}`)
      console.log('=' .repeat(50))
    }

    if (!emailSent && process.env.NODE_ENV === 'production') {
      return NextResponse.json({
        success: false,
        message: 'فشل إرسال البريد الإلكتروني. يرجى المحاولة لاحقاً',
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: emailSent 
        ? 'تم إرسال رمز التحقق إلى بريدك الإلكتروني'
        : 'تم إنشاء رمز التحقق (تحقق من إعدادات البريد الإلكتروني)',
      // في التطوير فقط، نعيد الكود للتسهيل
      ...(process.env.NODE_ENV === 'development' && { 
        devCode: verificationCode,
        devNote: 'هذا الكود للتطوير فقط ولن يظهر في الإنتاج'
      })
    })

  } catch (error) {
    console.error('❌ Send verification error:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء إرسال رمز التحقق' },
      { status: 500 }
    )
  }
}
