import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdminToken } from '@/lib/admin-auth'

// إحصائيات طلبات العقارات
export async function GET(request: NextRequest) {
  try {
    // التحقق من صلاحيات الأدمن
    const authResult = await verifyAdminToken(request)
    if (!authResult.isValid) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    // جلب الإحصائيات
    const [
      total,
      pending,
      reviewing,
      visitScheduled,
      approved,
      rejected,
      completed,
      byPropertyType,
      byPurpose,
      recentRequests
    ] = await Promise.all([
      // إجمالي الطلبات
      prisma.propertyListingRequest.count(),
      
      // حسب الحالة
      prisma.propertyListingRequest.count({ where: { status: 'PENDING' } }),
      prisma.propertyListingRequest.count({ where: { status: 'REVIEWING' } }),
      prisma.propertyListingRequest.count({ where: { status: 'VISIT_SCHEDULED' } }),
      prisma.propertyListingRequest.count({ where: { status: 'APPROVED' } }),
      prisma.propertyListingRequest.count({ where: { status: 'REJECTED' } }),
      prisma.propertyListingRequest.count({ where: { status: 'COMPLETED' } }),
      
      // حسب نوع العقار
      prisma.propertyListingRequest.groupBy({
        by: ['propertyType'],
        _count: { propertyType: true }
      }),
      
      // حسب الغرض
      prisma.propertyListingRequest.groupBy({
        by: ['purpose'],
        _count: { purpose: true }
      }),
      
      // آخر 5 طلبات
      prisma.propertyListingRequest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          propertyType: true,
          purpose: true,
          governorate: true,
          city: true,
          ownerName: true,
          status: true,
          createdAt: true
        }
      })
    ])

    return NextResponse.json({
      total,
      byStatus: {
        pending,
        reviewing,
        visitScheduled,
        approved,
        rejected,
        completed
      },
      byPropertyType: byPropertyType.reduce((acc: any, item) => {
        acc[item.propertyType] = item._count.propertyType
        return acc
      }, {}),
      byPurpose: byPurpose.reduce((acc: any, item) => {
        acc[item.purpose] = item._count.purpose
        return acc
      }, {}),
      recentRequests
    })

  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الإحصائيات' },
      { status: 500 }
    )
  }
}
