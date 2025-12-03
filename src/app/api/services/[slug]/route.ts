import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/services/[slug] - Get single service by slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const service = await prisma.service.findUnique({
      where: { 
        slug: params.slug,
        published: true 
      },
      include: {
        portfolioItems: {
          where: { showInServiceGallery: true },
          include: { 
            images: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { createdAt: 'desc' }
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
