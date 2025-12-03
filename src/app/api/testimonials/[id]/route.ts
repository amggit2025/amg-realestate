import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { deleteImageFromCloudinary } from '@/lib/cloudinary-helper';

// GET - جلب testimonial واحد
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // @ts-ignore
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: params.id }
    });

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonial' },
      { status: 500 }
    );
  }
}

// PUT - تعديل testimonial
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { content, clientName, position, location, image, imagePublicId, rating, featured, published, order } = body;

    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // 🗑️ جلب التوصية القديمة لحذف الصورة إذا تغيرت
    // @ts-ignore
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id: params.id }
    });

    if (!existingTestimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    // حذف الصورة القديمة من Cloudinary إذا تم تحديث الصورة
    if (imagePublicId && imagePublicId !== existingTestimonial.imagePublicId && existingTestimonial.imagePublicId) {
      await deleteImageFromCloudinary(existingTestimonial.imagePublicId)
      console.log('🗑️ تم حذف صورة التوصية القديمة من Cloudinary')
    }

    // @ts-ignore
    const testimonial = await prisma.testimonial.update({
      where: { id: params.id },
      data: {
        ...(content && { content }),
        ...(clientName && { clientName }),
        ...(position && { position }),
        ...(location !== undefined && { location }),
        ...(image !== undefined && { image }),
        ...(imagePublicId !== undefined && { imagePublicId }),
        ...(rating !== undefined && { rating }),
        ...(featured !== undefined && { featured }),
        ...(published !== undefined && { published }),
        ...(order !== undefined && { order })
      }
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

// DELETE - حذف testimonial
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 🗑️ جلب التوصية لحذف الصورة من Cloudinary
    // @ts-ignore
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: params.id }
    });

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    // حذف الصورة من Cloudinary إذا كانت موجودة
    if (testimonial.imagePublicId) {
      await deleteImageFromCloudinary(testimonial.imagePublicId)
      console.log('🗑️ تم حذف صورة التوصية من Cloudinary')
    }

    // @ts-ignore
    await prisma.testimonial.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}
