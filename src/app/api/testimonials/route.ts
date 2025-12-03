import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - جلب كل الـ testimonials (للأدمن) أو المنشورة فقط (للعامة)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');
    
    const where: any = {};
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    if (published === 'true') {
      where.published = true;
    }

    // @ts-ignore
    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST - إضافة testimonial جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { content, clientName, position, location, image, imagePublicId, rating, featured, published, order } = body;

    // Validation
    if (!content || !clientName || !position) {
      return NextResponse.json(
        { error: 'Content, client name, and position are required' },
        { status: 400 }
      );
    }

    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // @ts-ignore
    const testimonial = await prisma.testimonial.create({
      data: {
        content,
        clientName,
        position,
        location: location || null,
        image: image || null,
        imagePublicId: imagePublicId || null,
        rating: rating || 5,
        featured: featured || false,
        published: published !== undefined ? published : true,
        order: order || 0
      }
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}
