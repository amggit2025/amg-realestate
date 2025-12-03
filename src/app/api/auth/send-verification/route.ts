// ======================================================
// 📧 AMG Real Estate - Send Email Verification
// ======================================================
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'
import crypto from 'crypto'

// إرسال رمز التحقق بالبريد الإلكتروني
export async function POST(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح - تسجيل الدخول مطلوب' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'رمز غير صحيح' },
        { status: 401 }
      )
    }

    // جلب بيانات المستخدم
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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
