import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// POST: إضافة صورة جديدة للمعرض
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { url, publicId, order } = await request.json()

    if (!url) {
      return NextResponse.json(
        { success: false, message: 'رابط الصورة مطلوب' },
        { status: 400 }
      )
    }

    // التحقق من وجود العمل
    // @ts-ignore
    const portfolioItem = await prisma.portfolioItem.findUnique({
      where: { id }
    })

    if (!portfolioItem) {
      return NextResponse.json(
        { success: false, message: 'العمل غير موجود' },
        { status: 404 }
      )
    }

    // إضافة الصورة
    // @ts-ignore
    const newImage = await prisma.portfolioImage.create({
      data: {
        portfolioId: id,
        url,
        publicId: publicId || '',
        order: order || 0
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم إضافة الصورة بنجاح',
      image: newImage
    })
  } catch (error) {
    console.error('خطأ في إضافة الصورة:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في إضافة الصورة' },
      { status: 500 }
    )
  }
}

// DELETE: حذف صورة من المعرض
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')

    if (!imageId) {
      return NextResponse.json(
        { success: false, message: 'معرف الصورة مطلوب' },
        { status: 400 }
      )
    }

    // جلب الصورة
    // @ts-ignore
    const image = await prisma.portfolioImage.findUnique({
      where: { id: imageId }
    })

    if (!image) {
      return NextResponse.json(
        { success: false, message: 'الصورة غير موجودة' },
        { status: 404 }
      )
    }

    // حذف الصورة من Cloudinary
    if (image.publicId) {
      try {
        const cloudinary = (await import('@/lib/cloudinary')).default
        await cloudinary.uploader.destroy(image.publicId)
      } catch (error) {
        console.error('خطأ في حذف الصورة من Cloudinary:', error)
      }
    }

    // حذف الصورة من قاعدة البيانات
    // @ts-ignore
    await prisma.portfolioImage.delete({
      where: { id: imageId }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف الصورة بنجاح'
    })
  } catch (error) {
    console.error('خطأ في حذف الصورة:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في حذف الصورة' },
      { status: 500 }
    )
  }
}