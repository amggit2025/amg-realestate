import { NextRequest, NextResponse } from 'next/server'
// @ts-ignore
import { PrismaClient } from '@prisma/client'

// @ts-ignore
const prisma = new PrismaClient()

// إضافة صور المعرض لعمل معين
export async function POST(request: NextRequest) {
  try {
    const { portfolioId, images } = await request.json()

    if (!portfolioId || !images || !Array.isArray(images)) {
      return NextResponse.json({ 
        success: false, 
        message: 'بيانات غير صحيحة' 
      })
    }

    // إضافة الصور للقاعدة
    const createdImages = await Promise.all(
      images.map(async (image: { url: string; order: number; publicId?: string }) => {
        // @ts-ignore
        return await prisma.portfolioImage.create({
          data: {
            url: image.url,
            publicId: image.publicId || null,
            order: image.order,
            portfolioId: portfolioId
          }
        })
      })
    )

    return NextResponse.json({ 
      success: true, 
      images: createdImages 
    })

  } catch (error) {
    console.error('خطأ في إضافة صور المعرض:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'حدث خطأ في الخادم' 
    })
  }
}

// جلب صور المعرض لعمل معين
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const portfolioId = searchParams.get('portfolioId')

    if (!portfolioId) {
      return NextResponse.json({ 
        success: false, 
        message: 'معرف العمل مطلوب' 
      })
    }

    // @ts-ignore
    const images = await prisma.portfolioImage.findMany({
      where: {
        portfolioId: portfolioId
      },
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json({ 
      success: true, 
      images 
    })

  } catch (error) {
    console.error('خطأ في جلب صور المعرض:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'حدث خطأ في الخادم' 
    })
  }
}