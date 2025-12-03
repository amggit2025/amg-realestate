import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - جلب إحصائيات Hero
export async function GET(request: NextRequest) {
  try {
    // جلب الإحصائيات النشطة
    // @ts-ignore - Prisma client will be generated
    let stats = await prisma.heroStats.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })

    // إذا لم توجد إحصائيات، نعمل واحدة جديدة بالقيم الافتراضية
    if (!stats) {
      // @ts-ignore
      stats = await prisma.heroStats.create({
        data: {
          yearsOfExperience: 15,
          completedProjects: 200,
          happyClients: 500,
          clientSatisfaction: 98,
          isActive: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error fetching hero stats:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ في جلب الإحصائيات' 
      },
      { status: 500 }
    )
  }
}

// PUT - تحديث إحصائيات Hero (للأدمن فقط)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { yearsOfExperience, completedProjects, happyClients, clientSatisfaction, heroImage, heroImagePublicId } = body

    // التحقق من البيانات
    if (!yearsOfExperience || !completedProjects || !happyClients || !clientSatisfaction) {
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
      yearsOfExperience < 0 || 
      completedProjects < 0 || 
      happyClients < 0 || 
      clientSatisfaction < 0 || 
      clientSatisfaction > 100
    ) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'القيم غير صحيحة. نسبة الرضا يجب أن تكون بين 0 و 100' 
        },
        { status: 400 }
      )
    }

    // جلب الإحصائيات الحالية
    // @ts-ignore
    const currentStats = await prisma.heroStats.findFirst({
      where: { isActive: true }
    })

    let updatedStats

    if (currentStats) {
      // تحديث الإحصائيات الموجودة
      // @ts-ignore
      updatedStats = await prisma.heroStats.update({
        where: { id: currentStats.id },
        data: {
          yearsOfExperience: parseInt(yearsOfExperience),
          completedProjects: parseInt(completedProjects),
          happyClients: parseInt(happyClients),
          clientSatisfaction: parseInt(clientSatisfaction),
          heroImage: heroImage || currentStats.heroImage,
          heroImagePublicId: heroImagePublicId || currentStats.heroImagePublicId,
          updatedAt: new Date()
        }
      })
    } else {
      // إنشاء إحصائيات جديدة
      // @ts-ignore
      updatedStats = await prisma.heroStats.create({
        data: {
          yearsOfExperience: parseInt(yearsOfExperience),
          completedProjects: parseInt(completedProjects),
          happyClients: parseInt(happyClients),
          clientSatisfaction: parseInt(clientSatisfaction),
          heroImage: heroImage || null,
          heroImagePublicId: heroImagePublicId || null,
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
    console.error('Error updating hero stats:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ في تحديث الإحصائيات' 
      },
      { status: 500 }
    )
  }
}
