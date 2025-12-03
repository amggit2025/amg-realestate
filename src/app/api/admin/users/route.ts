// ======================================================
// 👥 AMG Real Estate - Admin Users Management API
// ======================================================
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET: جلب جميع المستخدمين (Admin only)
export async function GET(request: NextRequest) {
  try {
    // التحقق من صحة الإدمن من خلال الـ headers (تأتي من middleware)
    const adminId = request.headers.get('x-admin-id')
    const adminRole = request.headers.get('x-admin-role')

    if (!adminId) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح - تسجيل الدخول مطلوب' },
        { status: 401 }
      )
    }

    // التحقق من صلاحيات الإدمن
    const admin = await prisma.admin.findUnique({ 
      where: { id: adminId },
      select: { active: true, role: true }
    })
    
    if (!admin || !admin.active) {
      return NextResponse.json(
        { success: false, message: 'حساب غير نشط أو غير موجود' },
        { status: 401 }
      )
    }

    console.log('🔍 Fetching users for admin...')

    // جلب جميع المستخدمين مع الإحصائيات
    const users = await prisma.user.findMany({
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
        _count: {
          select: {
            properties: true,
            favorites: true,
            inquiries: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // حساب الإحصائيات العامة
    const totalUsers = users.length
    const activeUsers = users.filter(user => user.active).length
    const verifiedUsers = users.filter(user => user.verified).length
    const individualUsers = users.filter(user => user.userType === 'INDIVIDUAL').length
    const companyUsers = users.filter(user => user.userType === 'COMPANY').length

    // تحضير البيانات للعرض
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      userType: user.userType,
      verified: user.verified,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      active: user.active,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      stats: {
        totalProperties: user._count.properties,
        totalFavorites: user._count.favorites,
        totalInquiries: user._count.inquiries
      }
    }))

    console.log(`✅ Retrieved ${users.length} users`)

    return NextResponse.json({
      success: true,
      message: `تم جلب ${users.length} مستخدم بنجاح`,
      data: {
        users: formattedUsers,
        stats: {
          total: totalUsers,
          active: activeUsers,
          verified: verifiedUsers,
          individual: individualUsers,
          company: companyUsers
        }
      }
    })

  } catch (error) {
    console.error('❌ Admin users fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'حدث خطأ أثناء جلب المستخدمين'
      },
      { status: 500 }
    )
  }
}

// PUT: تحديث حالة المستخدم (تفعيل/إلغاء تفعيل)
export async function PUT(request: NextRequest) {
  try {
    const { userId, action } = await request.json()

    if (!userId || !action) {
      return NextResponse.json(
        { success: false, message: 'بيانات غير مكتملة' },
        { status: 400 }
      )
    }

    let updateData = {}
    let successMessage = ''

    switch (action) {
      case 'activate':
        updateData = { active: true }
        successMessage = 'تم تفعيل المستخدم بنجاح'
        break
      case 'deactivate':
        updateData = { active: false }
        successMessage = 'تم إلغاء تفعيل المستخدم بنجاح'
        break
      case 'verify':
        updateData = { verified: true, emailVerified: true }
        successMessage = 'تم التحقق من المستخدم بنجاح'
        break
      default:
        return NextResponse.json(
          { success: false, message: 'إجراء غير صحيح' },
          { status: 400 }
        )
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        active: true,
        verified: true
      }
    })

    console.log(`✅ User ${action}d:`, updatedUser.email)

    return NextResponse.json({
      success: true,
      message: successMessage,
      user: updatedUser
    })

  } catch (error) {
    console.error('❌ User update error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'حدث خطأ أثناء تحديث المستخدم'
      },
      { status: 500 }
    )
  }
}