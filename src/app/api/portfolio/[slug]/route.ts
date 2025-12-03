// Get single portfolio item by slug API Route
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const prisma = new PrismaClient()
  
  try {
    await prisma.$connect()
    const { slug } = await params
    
    console.log('🔍 Fetching portfolio item with slug:', slug)

    const portfolioItem = await prisma.portfolioItem.findUnique({
      where: {
        slug: slug
      },
      include: {
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!portfolioItem) {
      return NextResponse.json(
        { success: false, message: 'العمل غير موجود' },
        { status: 404 }
      )
    }

    // Transform data to match frontend expectations
    const p = portfolioItem as any; // Temporary type casting
    
    // Safe JSON parse function
    const safeJsonParse = (jsonString: any, defaultValue: any = []): any => {
      if (!jsonString) return defaultValue;
      
      // If it's already an array or object, handle appropriately
      if (typeof jsonString === 'object') {
        // If default is string and we have an object, extract meaningful text
        if (typeof defaultValue === 'string' && jsonString.comment) {
          return jsonString.comment;
        }
        return jsonString;
      }
      
      try {
        const parsed = JSON.parse(jsonString);
        // If default is string and parsed is object with comment, return comment
        if (typeof defaultValue === 'string' && typeof parsed === 'object' && parsed.comment) {
          return parsed.comment;
        }
        return parsed;
      } catch (error) {
        console.warn('Failed to parse JSON:', jsonString);
        // If it's not JSON and default is array, treat as comma-separated string
        if (Array.isArray(defaultValue) && typeof jsonString === 'string') {
          return jsonString.split(',').map((item: string) => item.trim()).filter(Boolean);
        }
        return defaultValue;
      }
    };
    
    const transformedItem = {
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      fullDescription: p.fullDescription,
      category: p.category,
      status: p.status,
      location: p.location,
      client: p.client,
      duration: p.duration,
      area: p.area,
      budget: p.budget,
      completionDate: p.completionDate ? new Date(p.completionDate).getFullYear().toString() : '',
      mainImage: p.mainImage || p.images[0]?.url || '/images/placeholder.jpg',
      images: p.images.map((img: any) => ({
        id: img.id,
        url: img.url,
        publicId: img.publicId,
        alt: img.alt || p.title
      })),
      likes: p.likes || 0,
      views: p.views || 0,
      rating: p.rating || 0,
      features: safeJsonParse(p.features, []),
      tags: safeJsonParse(p.tags, []),
      challenges: safeJsonParse(p.challenges, []),
      solutions: safeJsonParse(p.solutions, []),
      technologies: safeJsonParse(p.technologies, []),
      teamMembers: safeJsonParse(p.teamMembers, []),
      clientTestimonial: safeJsonParse(p.clientTestimonial, ''),
      featured: p.featured || false,
      published: p.published || false
    }

    return NextResponse.json({
      success: true,
      data: transformedItem
    })

  } catch (error) {
    console.error('Portfolio item fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ في جلب العمل' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}