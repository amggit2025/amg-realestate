import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/services - Public list of published services
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        heroImage: true,
        color: true,
        iconName: true,
        featured: true,
        stats: true
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
