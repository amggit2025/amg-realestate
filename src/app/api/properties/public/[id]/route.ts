import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// جلب تفاصيل عقار للعرض العام (بدون تسجيل دخول)
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    const property = await prisma.property.findFirst({
      where: { 
        id,
        status: 'ACTIVE' // فقط العقارات النشطة
      },
      include: {
        images: {
          orderBy: {
            order: 'asc'
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            userType: true,
            verified: true
          }
        },
        _count: {
          select: {
            favorites: true,
            inquiries: true,
          }
        }
      }
    })

    if (!property) {
      return NextResponse.json(
        { 
          success: false,
          message: 'العقار غير موجود أو غير متاح' 
        },
        { status: 404 }
      )
    }

    // زيادة عدد المشاهدات
    await prisma.property.update({
      where: { id },
      data: {
        views: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      property: {
        ...property,
        views: property.views + 1 // إرجاع العدد المحدث
      }
    })

  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'حدث خطأ في جلب بيانات العقار' 
      },
      { status: 500 }
    )
  }
}
