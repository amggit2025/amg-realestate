// ======================================================
// 🔑 AMG Real Estate - User Login API
// ======================================================
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

// التحقق من صحة بيانات تسجيل الدخول
const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
  rememberMe: z.boolean().optional().default(false)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔐 Login attempt for:', body.email)

    // التحقق من صحة البيانات
    const validatedData = loginSchema.parse(body)

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        password: true,
        userType: true,
        verified: true,
        active: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
          field: 'email'
        },
        { status: 401 }
      )
    }

    // التحقق من أن الحساب نشط
    if (!user.active) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'تم إيقاف هذا الحساب. تواصل مع الدعم الفني.'
        },
        { status: 401 }
      )
    }

    // المستخدمين اللي سجلوا بـ Google مش عندهم كلمة مرور
    if (!user.password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'هذا الحساب مسجل عبر Google. استخدم زر "المتابعة مع Google" لتسجيل الدخول.'
        },
        { status: 401 }
      )
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
          field: 'password'
        },
        { status: 401 }
      )
    }

    // إنشاء JWT token
    const tokenExpiry = validatedData.rememberMe ? '30d' : '7d'
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        userType: user.userType
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: tokenExpiry }
    )

    // حذف كلمة المرور من البيانات المُرجعة
    const { password, ...userWithoutPassword } = user

    console.log('✅ User logged in successfully:', user.id)

    // إنشاء response مع cookie للـ token
    const response = NextResponse.json({
      success: true,
      message: `مرحباً بك ${user.firstName}! تم تسجيل الدخول بنجاح`,
      user: userWithoutPassword,
      token
    })

    // إعداد cookie للـ token
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: validatedData.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000, // 30 أو 7 أيام
      path: '/'
    }

    response.cookies.set('auth-token', token, cookieOptions)

    return response

  } catch (error) {
    console.error('❌ Login error:', error)

    // التعامل مع أخطاء التحقق من البيانات
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return NextResponse.json(
        { 
          success: false, 
          message: firstError.message,
          field: firstError.path[0]
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.'
      },
      { status: 500 }
    )
  }
}