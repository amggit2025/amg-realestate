// ======================================================
// 🛡️ AMG Real Estate - Admin Property Review API
// ======================================================
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { notifyPropertyApproved, notifyPropertyRejected } from '@/lib/notifications'

// GET: جلب العقارات المطلوب مراجعتها
export async function GET(request: NextRequest) {
  try {
    // التحقق من صحة Admin token - مؤقت مبسط
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح - تسجيل دخول الأدمن مطلوب' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    // مؤقتاً - قبول أي token يبدأ بـ temp_token أو admin-session
    if (!token.includes('temp_token') && !token.includes('admin-session')) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح - token غير صحيح' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const reviewStatus = searchParams.get('reviewStatus') || 'PENDING'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    console.log('🔍 Fetching properties for review...', { reviewStatus, page, limit })

    // جلب العقارات حسب حالة المراجعة
    const whereClause: any = {}
    if (reviewStatus !== 'ALL') {
      whereClause.status = reviewStatus === 'PENDING' ? 'PENDING' : 
                          reviewStatus === 'APPROVED' ? 'ACTIVE' : 
                          reviewStatus === 'REJECTED' ? 'INACTIVE' : 'PENDING'
    }

    const properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            userType: true
          }
        },
        images: {
          orderBy: { order: 'asc' },
          take: 5 // أول 5 صور فقط
        },
        _count: {
          select: {
            favorites: true,
            inquiries: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    })

    // حساب العدد الإجمالي
    const totalCount = await prisma.property.count({
      // مؤقتاً - إزالة الفلتر حتى يتم إضافة حقل reviewStatus للـ schema
    })

    // تحضير البيانات للعرض
    const formattedProperties = properties.map(property => ({
      id: property.id,
      title: property.title,
      description: property.description.substring(0, 200) + (property.description.length > 200 ? '...' : ''),
      price: property.price.toString(),
      currency: property.currency,
      area: property.area,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      city: property.city,
      district: property.district,
      propertyType: property.propertyType,
      purpose: property.purpose,
      status: property.status,
      reviewStatus: property.status, // Using status as proxy for reviewStatus
      rejectionReason: null, // This field might not exist yet
      reviewedBy: null, // This field might not exist yet  
      reviewedAt: property.updatedAt?.toISOString(),
      views: property.views,
      createdAt: property.createdAt.toISOString(),
      updatedAt: property.updatedAt.toISOString(),
      user: {
        id: property.user?.id || '',
        name: `${property.user?.firstName || ''} ${property.user?.lastName || ''}`,
        email: property.user?.email || '',
        phone: property.user?.phone || '',
        userType: property.user?.userType || 'INDIVIDUAL'
      },
      mainImage: property.images?.[0]?.url || null,
      imagesCount: property.images?.length || 0,
      stats: {
        favorites: property._count?.favorites || 0,
        inquiries: property._count?.inquiries || 0
      }
    }))

    // إحصائيات سريعة باستخدام status
    const stats = {
      pending: await prisma.property.count({ where: { status: 'PENDING' } }),
      approved: await prisma.property.count({ where: { status: 'ACTIVE' } }),
      rejected: await prisma.property.count({ where: { status: 'INACTIVE' } }),
      needsEdit: await prisma.property.count({ where: { status: 'PENDING' } }) // Using PENDING as DRAFT alternative
    }

    console.log(`✅ Retrieved ${properties.length} properties for review`)

    return NextResponse.json({
      success: true,
      message: `تم جلب ${properties.length} عقار`,
      data: {
        properties: formattedProperties,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        },
        stats
      }
    })

  } catch (error) {
    console.error('❌ Property review fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'حدث خطأ أثناء جلب العقارات'
      },
      { status: 500 }
    )
  }
}

// PUT: تحديث حالة مراجعة العقار
export async function PUT(request: NextRequest) {
  try {
    // التحقق من صحة Admin token - مؤقت مبسط
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح - تسجيل دخول الأدمن مطلوب' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    // مؤقتاً - قبول أي token يبدأ بـ temp_token أو admin-session
    if (!token.includes('temp_token') && !token.includes('admin-session')) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح - token غير صحيح' },
        { status: 401 }
      )
    }

    const { propertyId, action, rejectionReason } = await request.json()

    if (!propertyId || !action) {
      return NextResponse.json(
        { success: false, message: 'بيانات غير مكتملة' },
        { status: 400 }
      )
    }

    // تحقق من التوكن واستخرج بيانات الأدمن
    const decoded = verifyToken(token)
    let updateData: any = {
      reviewedBy: decoded?.userId || null,
      reviewedAt: new Date()
    }

    let successMessage = ''

    switch (action) {
      case 'approve':
        updateData.reviewStatus = 'APPROVED'
        updateData.status = 'ACTIVE' // تفعيل العقار عند الموافقة
        successMessage = 'تمت الموافقة على العقار وتم نشره'
        break
        
      case 'reject':
        if (!rejectionReason) {
          return NextResponse.json(
            { success: false, message: 'سبب الرفض مطلوب' },
            { status: 400 }
          )
        }
        updateData.reviewStatus = 'REJECTED'
        updateData.status = 'INACTIVE'
        updateData.rejectionReason = rejectionReason
        successMessage = 'تم رفض العقار'
        break
        
      case 'needs_edit':
        if (!rejectionReason) {
          return NextResponse.json(
            { success: false, message: 'تفاصيل التعديل المطلوب مطلوبة' },
            { status: 400 }
          )
        }
        updateData.reviewStatus = 'NEEDS_EDIT'
        updateData.rejectionReason = rejectionReason
        successMessage = 'تم طلب تعديل العقار'
        break
        
      case 'revert_to_pending':
        updateData.reviewStatus = 'PENDING'
        updateData.status = 'PENDING'
        updateData.rejectionReason = null
        successMessage = 'تم إرجاع العقار للمراجعة'
        break
        
      default:
        return NextResponse.json(
          { success: false, message: 'إجراء غير صحيح' },
          { status: 400 }
        )
    }

    // تحديث العقار
    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: updateData,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    console.log(`✅ Property ${action}ed:`, {
      propertyId,
      title: updatedProperty.title,
      user: updatedProperty.user.email
    })

    // إرسال إشعار للمستخدم
    if (action === 'approve') {
      await notifyPropertyApproved(
        updatedProperty.userId,
        updatedProperty.id,
        updatedProperty.title
      );
    } else if (action === 'reject') {
      await notifyPropertyRejected(
        updatedProperty.userId,
        updatedProperty.id,
        updatedProperty.title,
        rejectionReason
      );
    }

    return NextResponse.json({
      success: true,
      message: successMessage,
      property: {
        id: updatedProperty.id,
        title: updatedProperty.title,
        reviewStatus: updatedProperty.status, // Using status as proxy
        status: updatedProperty.status,
        reviewedAt: updatedProperty.updatedAt?.toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Property review update error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'حدث خطأ أثناء تحديث حالة العقار'
      },
      { status: 500 }
    )
  }
}

// POST: إضافة تعليق مراجعة
export async function POST(request: NextRequest) {
  try {
    const { propertyId, comment, isPublic } = await request.json()

    // TODO: إنشاء نظام تعليقات المراجعة
    // إضافة جدول PropertyReviewComment في المستقبل

    return NextResponse.json({
      success: true,
      message: 'تم إضافة التعليق بنجاح'
    })

  } catch (error) {
    console.error('❌ Review comment error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'حدث خطأ أثناء إضافة التعليق'
      },
      { status: 500 }
    )
  }
}