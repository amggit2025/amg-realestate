import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';
import prisma from '@/lib/db';

// GET /api/admin/services - List all services
export async function GET(request: Request) {
  try {
    const adminAuth = await verifyAdminToken(request);
    if (!adminAuth.isValid || !adminAuth.admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { portfolioItems: true }
        }
      }
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST /api/admin/services - Create new service
export async function POST(request: Request) {
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
      cardImage,
      features,
      stats,
      gallery,
      formOptions,
      color,
      iconName,
      published,
      featured,
      order
    } = body;

    // Validate required fields
    if (!slug || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, title, description' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingService = await prisma.service.findUnique({
      where: { slug }
    });

    if (existingService) {
      return NextResponse.json(
        { error: 'Service with this slug already exists' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        slug,
        title,
        description,
        heroImage: heroImage || '',
        cardImage: cardImage || null,
        features: features || [],
        stats: stats || [],
        gallery: gallery || [],
        formOptions: formOptions || {},
        color: color || 'blue',
        iconName: iconName || 'BuildingOfficeIcon',
        published: published !== undefined ? published : true,
        featured: featured !== undefined ? featured : false,
        order: order || 0
      }
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
