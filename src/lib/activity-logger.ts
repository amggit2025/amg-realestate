// ======================================================
// 📊 AMG Real Estate - User Activity Logging System
// ======================================================
import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'

// Helper function لاستخراج IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown' // NextRequest doesn't have ip property directly
}

export interface ActivityData {
  userId: string
  activityType: string // من enum ActivityType
  entityType?: string // من enum EntityType
  entityId?: string
  title: string
  description?: string
  metadata?: any
  request?: NextRequest // للحصول على IP و User Agent
}

// تسجيل نشاط جديد
export async function logUserActivity(data: ActivityData): Promise<void> {
  try {
    const activityData: any = {
      userId: data.userId,
      activityType: data.activityType,
      title: data.title,
      description: data.description,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    }

    // إضافة نوع الكيان إن وجد
    if (data.entityType) {
      activityData.entityType = data.entityType
    }

    // إضافة معرف الكيان إن وجد  
    if (data.entityId) {
      activityData.entityId = data.entityId
    }

    // إضافة معلومات الطلب إن وجدت
    if (data.request) {
      // الحصول على IP Address
      const forwarded = data.request.headers.get('x-forwarded-for')
      const ip = forwarded ? forwarded.split(',')[0] : data.request.headers.get('x-real-ip') || 'unknown'
      activityData.ipAddress = ip

      // الحصول على User Agent
      activityData.userAgent = data.request.headers.get('user-agent') || 'unknown'
    }

    // تسجيل النشاط في قاعدة البيانات
    await prisma.userActivity.create({
      data: activityData
    })

    console.log(`✅ Activity logged: ${data.activityType} for user ${data.userId}`)
  } catch (error) {
    console.error('❌ Failed to log activity:', error)
    // لا نرمي خطأ عشان مانكسرش العمليات الأساسية
  }
}

// دوال مساعدة لتسجيل أنشطة محددة

export async function logLogin(userId: string, request?: NextRequest) {
  await logUserActivity({
    userId,
    activityType: 'LOGIN',
    title: 'تسجيل دخول',
    description: 'قام المستخدم بتسجيل الدخول',
    request
  })
}

export async function logLogout(userId: string, request?: NextRequest) {
  await logUserActivity({
    userId,
    activityType: 'LOGOUT',
    title: 'تسجيل خروج',
    description: 'قام المستخدم بتسجيل الخروج',
    request
  })
}

export async function logRegister(userId: string, userData: any, request?: NextRequest) {
  await logUserActivity({
    userId,
    activityType: 'REGISTER',
    title: 'إنشاء حساب جديد',
    description: `تم إنشاء حساب جديد باسم ${userData.firstName} ${userData.lastName}`,
    metadata: {
      email: userData.email,
      userType: userData.userType
    },
    request
  })
}

export async function logPropertyCreate(userId: string, propertyId: string, propertyTitle: string, request?: NextRequest) {
  await logUserActivity({
    userId,
    activityType: 'PROPERTY_CREATE',
    entityType: 'PROPERTY',
    entityId: propertyId,
    title: 'إضافة عقار جديد',
    description: `تم إضافة عقار جديد: ${propertyTitle}`,
    request
  })
}

export async function logPropertyUpdate(userId: string, propertyId: string, propertyTitle: string, changes?: any, request?: NextRequest) {
  await logUserActivity({
    userId,
    activityType: 'PROPERTY_UPDATE',
    entityType: 'PROPERTY',
    entityId: propertyId,
    title: 'تحديث عقار',
    description: `تم تحديث العقار: ${propertyTitle}`,
    metadata: changes,
    request
  })
}

export async function logPropertyDelete(userId: string, propertyId: string, propertyTitle: string, request?: NextRequest) {
  await logUserActivity({
    userId,
    activityType: 'PROPERTY_DELETE',
    entityType: 'PROPERTY',
    entityId: propertyId,
    title: 'حذف عقار',
    description: `تم حذف العقار: ${propertyTitle}`,
    request
  })
}

export async function logPropertyView(userId: string, propertyId: string, propertyTitle: string, request?: NextRequest) {
  await logUserActivity({
    userId,
    activityType: 'PROPERTY_VIEW',
    entityType: 'PROPERTY',
    entityId: propertyId,
    title: 'عرض عقار',
    description: `تم عرض العقار: ${propertyTitle}`,
    request
  })
}

export async function logPropertyFavorite(userId: string, propertyId: string, propertyTitle: string, isFavorite: boolean, request?: NextRequest) {
  await logUserActivity({
    userId,
    activityType: isFavorite ? 'PROPERTY_FAVORITE' : 'PROPERTY_UNFAVORITE',
    entityType: 'PROPERTY',
    entityId: propertyId,
    title: isFavorite ? 'إضافة لمفضلة' : 'إزالة من مفضلة',
    description: `تم ${isFavorite ? 'إضافة' : 'إزالة'} العقار ${isFavorite ? 'إلى' : 'من'} المفضلة: ${propertyTitle}`,
    request
  })
}

export async function logInquiry(userId: string, inquiryId: string, subject: string, entityId?: string, request?: NextRequest) {
  await logUserActivity({
    userId,
    activityType: 'INQUIRY_CREATE',
    entityType: 'INQUIRY',
    entityId: inquiryId,
    title: 'إرسال استفسار',
    description: `تم إرسال استفسار: ${subject}`,
    metadata: {
      targetEntityId: entityId
    },
    request
  })
}

// These functions are defined below with better implementation

export async function logEmailVerify(userId: string, request?: NextRequest) {
  await logUserActivity({
    userId,
    activityType: 'EMAIL_VERIFY',
    entityType: 'USER', 
    entityId: userId,
    title: 'تفعيل البريد الإلكتروني',
    description: 'تم تفعيل البريد الإلكتروني بنجاح',
    request
  })
}

// جلب أنشطة المستخدم
export async function getUserActivities(userId: string, limit: number = 20, offset: number = 0) {
  try {
    const activities = await prisma.userActivity.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        activityType: true,
        entityType: true,
        entityId: true,
        title: true,
        description: true,
        metadata: true,
        createdAt: true
      }
    })

    return activities
  } catch (error) {
    console.error('❌ Failed to get user activities:', error)
    return []
  }
}

// جلب إحصائيات الأنشطة
export async function getActivityStats(userId: string, days: number = 30) {
  try {
    const since = new Date()
    since.setDate(since.getDate() - days)

    const stats = await prisma.userActivity.groupBy({
      by: ['activityType'],
      where: {
        userId: userId,
        createdAt: {
          gte: since
        }
      },
      _count: {
        activityType: true
      }
    })

    return stats.reduce((acc: Record<string, number>, stat: any) => {
      acc[stat.activityType] = stat._count.activityType
      return acc
    }, {} as Record<string, number>)

  } catch (error) {
    console.error('❌ Failed to get activity stats:', error)
    return {}
  }
}

// ======================================================
// 👤 Profile Related Activities
// ======================================================

// تحديث الملف الشخصي
export async function logProfileUpdate(
  userId: string, 
  changes: Record<string, { from: any, to: any }>,
  request: NextRequest
) {
  const changeDescriptions = Object.entries(changes).map(([field, change]) => {
    const fieldNames: Record<string, string> = {
      firstName: 'الاسم الأول',
      lastName: 'الاسم الأخير',
      phone: 'رقم الهاتف',
      avatar: 'الصورة الشخصية',
      userType: 'نوع الحساب'
    }
    
    return `${fieldNames[field] || field}: من "${change.from || 'فارغ'}" إلى "${change.to || 'فارغ'}"`
  }).join(', ')

  return await logUserActivity({
    userId,
    activityType: 'PROFILE_UPDATE',
    entityType: 'USER',
    entityId: userId,
    title: 'تحديث الملف الشخصي',
    description: `تم تحديث الملف الشخصي - ${changeDescriptions}`,
    metadata: {
      changes,
      fieldsChanged: Object.keys(changes),
      userAgent: request.headers.get('user-agent') || '',
      ipAddress: getClientIP(request)
    },
    request
  })
}

// تغيير كلمة المرور
export async function logPasswordChange(userId: string, request: NextRequest) {
  return await logUserActivity({
    userId,
    activityType: 'PASSWORD_CHANGE',
    entityType: 'USER',
    entityId: userId,
    title: 'تغيير كلمة المرور',
    description: 'تم تغيير كلمة المرور بنجاح',
    metadata: {
      securityAction: 'password_change',
      userAgent: request.headers.get('user-agent') || '',
      ipAddress: getClientIP(request)
    },
    request
  })
}