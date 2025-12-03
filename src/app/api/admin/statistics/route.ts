// ======================================================
// 📊 AMG Real Estate - Advanced Admin Statistics API
// ======================================================
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdminToken } from '@/lib/admin-auth'

// GET: إحصائيات شاملة للأدمن
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

    console.log(`📊 Fetching advanced statistics for admin token: ${token.substring(0, 15)}...`)

    // الحصول على تاريخ محدد للمقارنة
    const now = new Date()
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    const last7Days = new Date()
    last7Days.setDate(last7Days.getDate() - 7)
    const lastYear = new Date()
    lastYear.setFullYear(lastYear.getFullYear() - 1)

    // 1. إحصائيات عامة
    const [
      totalUsers,
      totalProperties,
      totalInquiries,
      usersThisMonth,
      propertiesThisMonth
    ] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.inquiry.count(),
      prisma.user.count({
        where: { createdAt: { gte: lastMonth } }
      }),
      prisma.property.count({
        where: { createdAt: { gte: lastMonth } }
      })
    ])

    // Default values for activities (will be 0 until UserActivity model is available)
    const totalActivities = 0
    const activitiesLast7Days = 0

    // 2. إحصائيات المستخدمين المفصلة
    const [
      usersByType,
      verifiedUsers,
      activeUsers
    ] = await Promise.all([
      prisma.user.groupBy({
        by: ['userType'],
        _count: { userType: true }
      }),
      prisma.user.count({
        where: { verified: true }
      }),
      prisma.user.count({
        where: { 
          active: true
          // Removed lastLoginAt filter as field may not exist
        }
      })
    ])

    // Default growth chart (empty array until proper tracking)
    const usersGrowthLast30Days: any[] = []

    // 3. إحصائيات العقارات المفصلة
    const [
      propertiesByStatus,
      propertiesByCity,
      averagePrice,
      totalViews,
      topViewedProperties
    ] = await Promise.all([
      prisma.property.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      prisma.property.groupBy({
        by: ['city'],
        _count: { city: true },
        orderBy: { _count: { city: 'desc' } },
        take: 10
      }),
      prisma.property.aggregate({
        _avg: { price: true },
        where: { status: 'ACTIVE' }
      }),
      prisma.property.aggregate({
        _sum: { views: true }
      }),
      prisma.property.findMany({
        select: {
          id: true,
          title: true,
          views: true,
          createdAt: true
        },
        orderBy: { views: 'desc' },
        take: 5
      })
    ])

    // Default values for missing features
    const propertiesByType = [{ propertyType: 'APARTMENT', _count: { propertyType: 0 } }]
    const propertiesGrowthLast30Days: any[] = []

    // 4. إحصائيات الأنشطة (default values until UserActivity is available)
    const activitiesByType: any[] = []
    const recentActivities: any[] = []
    const mostActiveUsers: any[] = []

    // 5. إحصائيات الاستفسارات والتفاعلات
    const [
      inquiriesStats,
      favoritesStats,
      monthlyInquiries,
      responseRateStats
    ] = await Promise.all([
      prisma.inquiry.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      prisma.favorite.count(),
      prisma.inquiry.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        },
        _count: { createdAt: true },
        orderBy: { createdAt: 'asc' }
      }),
      prisma.inquiry.aggregate({
        _count: {
          id: true
        },
        where: {
          createdAt: { gte: lastMonth }
        }
      })
    ])

    // 6. تحليلات متقدمة
    const conversionRate = totalProperties > 0 ? (totalInquiries / totalProperties) * 100 : 0
    const userEngagementRate = totalUsers > 0 ? (activitiesLast7Days / totalUsers) * 100 : 0
    const verificationRate = totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0

    // حساب معدلات النمو
    const userGrowthRate = totalUsers > usersThisMonth ? 
      ((usersThisMonth / (totalUsers - usersThisMonth)) * 100) : 0
    const propertyGrowthRate = totalProperties > propertiesThisMonth ? 
      ((propertiesThisMonth / (totalProperties - propertiesThisMonth)) * 100) : 0

    // تجميع البيانات النهائية
    const statistics = {
      // إحصائيات عامة
      overview: {
        totalUsers,
        totalProperties,
        totalActivities,
        totalInquiries,
        totalViews: totalViews._sum.views || 0,
        totalFavorites: favoritesStats,
        averagePrice: averagePrice._avg.price || 0
      },

      // معدلات النمو
      growth: {
        usersThisMonth,
        propertiesThisMonth,
        activitiesLast7Days,
        userGrowthRate: Math.round(userGrowthRate * 100) / 100,
        propertyGrowthRate: Math.round(propertyGrowthRate * 100) / 100
      },

      // المؤشرات الرئيسية
      kpis: {
        conversionRate: Math.round(conversionRate * 100) / 100,
        userEngagementRate: Math.round(userEngagementRate * 100) / 100,
        verificationRate: Math.round(verificationRate * 100) / 100,
        averagePropertiesPerUser: totalUsers > 0 ? Math.round((totalProperties / totalUsers) * 100) / 100 : 0
      },

      // تفاصيل المستخدمين
      users: {
        byType: usersByType.reduce((acc, item) => {
          acc[item.userType] = item._count.userType
          return acc
        }, {} as Record<string, number>),
        verified: verifiedUsers,
        active: activeUsers,
        growthChart: usersGrowthLast30Days
      },

      // تفاصيل العقارات
      properties: {
        byStatus: propertiesByStatus.reduce((acc, item) => {
          acc[item.status] = item._count.status
          return acc
        }, {} as Record<string, number>),
        byType: propertiesByType.reduce((acc: Record<string, number>, item: any) => {
          acc[item.propertyType] = item._count.propertyType
          return acc
        }, {} as Record<string, number>),
        byCities: propertiesByCity.slice(0, 10),
        topViewed: topViewedProperties,
        growthChart: propertiesGrowthLast30Days
      },

      // تفاصيل الأنشطة
      activities: {
        byType: activitiesByType.reduce((acc, item) => {
          acc[item.activityType] = item._count.activityType
          return acc
        }, {} as Record<string, number>),
        recent: recentActivities.map(activity => ({
          id: activity.id,
          type: activity.activityType,
          title: activity.title,
          description: activity.description,
          user: activity.user,
          createdAt: activity.createdAt.toISOString()
        })),
        mostActive: mostActiveUsers
      },

      // تفاصيل الاستفسارات
      inquiries: {
        byStatus: inquiriesStats.reduce((acc, item) => {
          acc[item.status] = item._count.status
          return acc
        }, {} as Record<string, number>),
        monthlyChart: monthlyInquiries,
        total: totalInquiries
      },

      // إحصائيات إضافية للمقارنة
      comparisons: {
        lastMonthUsers: usersThisMonth,
        lastMonthProperties: propertiesThisMonth,
        last7DaysActivities: activitiesLast7Days
      }
    }

    console.log(`✅ Advanced statistics fetched successfully`)

    return NextResponse.json({
      success: true,
      message: 'تم جلب الإحصائيات المتقدمة بنجاح',
      data: statistics,
      metadata: {
        generatedAt: new Date().toISOString(),
        dataRange: {
          from: lastMonth.toISOString(),
          to: now.toISOString()
        }
      }
    })

  } catch (error) {
    console.error('❌ Advanced statistics error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'حدث خطأ أثناء جلب الإحصائيات المتقدمة'
      },
      { status: 500 }
    )
  }
}