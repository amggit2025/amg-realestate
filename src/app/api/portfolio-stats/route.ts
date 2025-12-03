import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - جلب إحصائيات معرض الأعمال
export async function GET() {
  try {
    // @ts-ignore - مؤقتاً
    const stats = await prisma.portfolioStats.findFirst({
      where: { isActive: true }
    })

    if (!stats) {
      // إرجاع قيم افتراضية
      return NextResponse.json({
        success: true,
        data: {
          totalProjects: 50,
          happyClients: 125,
          averageRating: 4.8,
          totalViews: 12000
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        totalProjects: stats.totalProjects,
        happyClients: stats.happyClients,
        averageRating: stats.averageRating,
        totalViews: stats.totalViews
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
