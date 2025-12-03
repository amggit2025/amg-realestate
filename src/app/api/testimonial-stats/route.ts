import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - جلب إحصائيات Testimonials
export async function GET(request: NextRequest) {
  try {
    // جلب الإحصائيات النشطة
    // @ts-ignore - Prisma client will be generated
    let stats = await prisma.testimonialStats.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })

    // إذا لم توجد إحصائيات، نعمل واحدة جديدة بالقيم الافتراضية
    if (!stats) {
      // @ts-ignore
      stats = await prisma.testimonialStats.create({
        data: {
          happyClients: 5000,
          satisfactionRate: 99,
          averageRating: 4.9,
          yearsOfExperience: 15,
          isActive: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error fetching testimonial stats:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ في جلب الإحصائيات' 
      },
      { status: 500 }
    )
  }
}

// PUT - تحديث إحصائيات Testimonials (للأدمن فقط)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { happyClients, satisfactionRate, averageRating, yearsOfExperience } = body

    // التحقق من البيانات
    if (!happyClients || !satisfactionRate || !averageRating || !yearsOfExperience) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'جميع الحقول مطلوبة' 
        },
        { status: 400 }
      )
    }

    // التحقق من أن الأرقام صحيحة
    if (
      happyClients < 0 || 
      satisfactionRate < 0 || 
      satisfactionRate > 100 ||
      averageRating < 0 ||
      averageRating > 5 ||
      yearsOfExperience < 0
    ) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'القيم غير صحيحة. نسبة الرضا (0-100)، التقييم (0-5)' 
        },
        { status: 400 }
      )
    }

    // جلب الإحصائيات الحالية
    // @ts-ignore
    const currentStats = await prisma.testimonialStats.findFirst({
      where: { isActive: true }
    })

    let updatedStats

    if (currentStats) {
      // تحديث الإحصائيات الموجودة
      // @ts-ignore
      updatedStats = await prisma.testimonialStats.update({
        where: { id: currentStats.id },
        data: {
          happyClients: parseInt(happyClients),
          satisfactionRate: parseInt(satisfactionRate),
          averageRating: parseFloat(averageRating),
          yearsOfExperience: parseInt(yearsOfExperience),
          updatedAt: new Date()
        }
      })
    } else {
      // إنشاء إحصائيات جديدة
      // @ts-ignore
      updatedStats = await prisma.testimonialStats.create({
        data: {
          happyClients: parseInt(happyClients),
          satisfactionRate: parseInt(satisfactionRate),
          averageRating: parseFloat(averageRating),
          yearsOfExperience: parseInt(yearsOfExperience),
          isActive: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الإحصائيات بنجاح',
      data: updatedStats
    })
  } catch (error) {
    console.error('Error updating testimonial stats:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ في تحديث الإحصائيات' 
      },
      { status: 500 }
    )
  }
}
