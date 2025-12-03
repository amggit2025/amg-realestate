// ======================================================
// 👤 AMG Real Estate - Get Current User API
// ======================================================
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import jwt from 'jsonwebtoken'

// دالة للتحقق من صحة Token
function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    // الحصول على التوكن من الـ cookie أو الـ header
    let token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      const authHeader = request.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }
    }

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'غير مُصرح لك بالوصول. قم بتسجيل الدخول أولاً.',
          requireAuth: true
        },
        { status: 401 }
      )
    }

    // التحقق من صحة التوكن
    const decoded = verifyToken(token)
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'جلسة غير صالحة. قم بتسجيل الدخول مرة أخرى.',
          requireAuth: true
        },
        { status: 401 }
      )
    }

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        userType: true,
        verified: true,
        emailVerified: true,
        phoneVerified: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        // إحصائيات المستخدم
        properties: {
          select: {
            id: true,
            status: true
          }
        },
        favorites: {
          select: {
            id: true
          }
        },
        inquiries: {
          select: {
            id: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'المستخدم غير موجود',
          requireAuth: true
        },
        { status: 404 }
      )
    }

    if (!user.active) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'تم إيقاف هذا الحساب'
        },
        { status: 401 }
      )
    }

    // حساب الإحصائيات
    const stats = {
      totalProperties: user.properties.length,
      activeProperties: user.properties.filter(p => p.status === 'ACTIVE').length,
      favoriteProperties: user.favorites.length,
      totalInquiries: user.inquiries.length
    }

    // حذف البيانات الحساسة
    const { properties, favorites, inquiries, ...userWithoutRelations } = user

    console.log('✅ User data retrieved for:', user.email)

    return NextResponse.json({
      success: true,
      user: userWithoutRelations,
      stats
    })

  } catch (error) {
    console.error('❌ Get user error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء جلب بيانات المستخدم'
      },
      { status: 500 }
    )
  }
}