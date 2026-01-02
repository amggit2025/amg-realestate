import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - جلب إحصائيات معرض الأعمال - بيانات حقيقية من قاعدة البيانات
export async function GET() {
  try {
    // جلب عدد المشاريع الحقيقي من قاعدة البيانات
    const [totalProjects, featuredProjects, totalViews, avgRating] = await Promise.all([
      // عدد كل المشاريع المنشورة
      prisma.portfolioItem.count({
        where: { published: true }
      }),
      // عدد المشاريع المميزة
      prisma.portfolioItem.count({
        where: { published: true, featured: true }
      }),
      // إجمالي المشاهدات
      prisma.portfolioItem.aggregate({
        _sum: { views: true }
      }),
      // متوسط التقييم
      prisma.portfolioItem.aggregate({
        _avg: { rating: true }
      })
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalProjects: totalProjects || 0,
        featuredCount: featuredProjects || 0,
        totalViews: totalViews._sum.views || 0,
        averageRating: avgRating._avg.rating ? Number(avgRating._avg.rating.toFixed(1)) : 0
      }
    })
  } catch (error) {
    console.error('خطأ في جلب إحصائيات معرض الأعمال:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في جلب الإحصائيات' },
      { status: 500 }
    )
  }
}

// PUT - تحديث إحصائيات معرض الأعمال
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { totalProjects, happyClients, averageRating, totalViews } = body

    // التحقق من صحة البيانات
    if (totalProjects < 0 || happyClients < 0 || totalViews < 0) {
      return NextResponse.json(
        { success: false, message: 'الأرقام يجب أن تكون موجبة' },
        { status: 400 }
      )
    }

    if (averageRating < 0 || averageRating > 5) {
      return NextResponse.json(
        { success: false, message: 'التقييم يجب أن يكون بين 0 و 5' },
        { status: 400 }
      )
    }

    // @ts-ignore - مؤقتاً
    const existingStats = await prisma.portfolioStats.findFirst({
      where: { isActive: true }
    })

    let stats
    if (existingStats) {
      // @ts-ignore - مؤقتاً
      stats = await prisma.portfolioStats.update({
        where: { id: existingStats.id },
        data: {
          totalProjects: totalProjects || existingStats.totalProjects,
          happyClients: happyClients || existingStats.happyClients,
          averageRating: averageRating || existingStats.averageRating,
          totalViews: totalViews || existingStats.totalViews
        }
      })
    } else {
      // @ts-ignore - مؤقتاً
      stats = await prisma.portfolioStats.create({
        data: {
          totalProjects: totalProjects || 50,
          happyClients: happyClients || 125,
          averageRating: averageRating || 4.8,
          totalViews: totalViews || 12000,
          isActive: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'تم حفظ الإحصائيات بنجاح',
      data: stats
    })
  } catch (error) {
    console.error('خطأ في حفظ إحصائيات معرض الأعمال:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في حفظ الإحصائيات' },
      { status: 500 }
    )
  }
}
