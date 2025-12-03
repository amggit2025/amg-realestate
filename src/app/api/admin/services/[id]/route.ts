import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';
import prisma from '@/lib/db';
import { deleteImageFromCloudinary } from '@/lib/cloudinary-helper';

// GET /api/admin/services/[id] - Get single service
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminAuth = await verifyAdminToken(request);
    if (!adminAuth.isValid || !adminAuth.admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { id: params.id },
      include: {
        portfolioItems: {
          where: { showInServiceGallery: true },
          include: { images: true }
        }
      }
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/services/[id] - Update service
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminAuth = await verifyAdminToken(request);
    if (!adminAuth.isValid || !adminAuth.admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      slug,
      title,
      description,
      heroImage,
      heroImagePublicId,
      cardImage,
      cardImagePublicId,
      features,
      stats,
      gallery,
      galleryPublicIds,
      formOptions,
      color,
      iconName,
      published,
      featured,
      order
    } = body;

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id: params.id }
    }) as any;

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // 🗑️ حذف صورة Hero القديمة إذا تم تغييرها
    if (heroImagePublicId && existingService.heroImagePublicId && heroImagePublicId !== existingService.heroImagePublicId) {
      console.log('🗑️ حذف صورة Hero القديمة للخدمة:', existingService.heroImagePublicId)
      await deleteImageFromCloudinary(existingService.heroImagePublicId)
    }

    // 🗑️ حذف صورة Card القديمة إذا تم تغييرها
    if (cardImagePublicId && existingService.cardImagePublicId && cardImagePublicId !== existingService.cardImagePublicId) {
      console.log('🗑️ حذف صورة Card القديمة للخدمة:', existingService.cardImagePublicId)
      await deleteImageFromCloudinary(existingService.cardImagePublicId)
    }

    // If slug is being changed, check if new slug is available
    if (slug && slug !== existingService.slug) {
      const slugExists = await prisma.service.findUnique({
        where: { slug }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Service with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const service = await prisma.service.update({
      where: { id: params.id },
      data: {
        ...(slug && { slug }),
        ...(title && { title }),
        ...(description && { description }),
        ...(heroImage !== undefined && { heroImage }),
        ...(heroImagePublicId !== undefined && { heroImagePublicId }),
        ...(cardImage !== undefined && { cardImage }),
        ...(cardImagePublicId !== undefined && { cardImagePublicId }),
        ...(features !== undefined && { features }),
        ...(stats !== undefined && { stats }),
        ...(gallery !== undefined && { gallery }),
        ...(galleryPublicIds !== undefined && { galleryPublicIds }),
        ...(formOptions !== undefined && { formOptions }),
        ...(color && { color }),
        ...(iconName && { iconName }),
        ...(published !== undefined && { published }),
        ...(featured !== undefined && { featured }),
        ...(order !== undefined && { order })
      }
    });

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/services/[id] - Delete service
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminAuth = await verifyAdminToken(request);
    if (!adminAuth.isValid || !adminAuth.admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { portfolioItems: true }
        }
      }
    }) as any;

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Check if service has linked portfolio items
    if (service._count.portfolioItems > 0) {
      return NextResponse.json(
        { error: `Cannot delete service. It has ${service._count.portfolioItems} linked portfolio items.` },
        { status: 400 }
      );
    }

    // 🗑️ حذف صور الخدمة من Cloudinary قبل حذف السجل
    const imagesToDelete: string[] = []
    
    if (service.heroImagePublicId) {
      imagesToDelete.push(service.heroImagePublicId)
    }
    
    if (service.cardImagePublicId) {
      imagesToDelete.push(service.cardImagePublicId)
    }

    // حذف الصور من Cloudinary
    if (imagesToDelete.length > 0) {
      console.log(`🗑️ حذف ${imagesToDelete.length} صور للخدمة من Cloudinary`)
      for (const publicId of imagesToDelete) {
        await deleteImageFromCloudinary(publicId)
      }
    }

    await prisma.service.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
