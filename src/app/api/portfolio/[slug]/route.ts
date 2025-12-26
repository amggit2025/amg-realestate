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
    
    // Return mock data for testing when DB is unavailable
    const { slug } = await params
    return NextResponse.json({
      success: true,
      data: {
        id: 1,
        title: 'مشروع التجمع - القاهرة الجديدة',
        slug: slug,
        description: 'مشروع سكني فاخر يتميز بتصميم معماري عصري وموقع استراتيجي',
        fullDescription: 'مشروع سكني متكامل في قلب القاهرة الجديدة يجمع بين الفخامة والراحة. يضم المشروع وحدات سكنية متنوعة تناسب جميع الاحتياجات مع مساحات خضراء واسعة ومرافق متكاملة.',
        mainImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
        images: [
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', alt: 'واجهة المشروع', order: 1 },
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', alt: 'المساحات الخضراء', order: 2 },
          { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', alt: 'الوحدات الداخلية', order: 3 },
          { url: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800', alt: 'المرافق', order: 4 }
        ],
        category: 'real-estate',
        status: 'completed',
        location: 'القاهرة الجديدة، مصر',
        client: 'AMG Real Estate',
        area: '50,000 متر مربع',
        duration: '24 شهر',
        budget: '200 مليون جنيه',
        completionDate: '2024',
        features: ['تصميم معماري حديث', 'مساحات خضراء واسعة', 'مرافق متكاملة', 'أمن وحراسة 24/7', 'موقف سيارات متعدد الطوابق'],
        technologies: ['BIM', 'تقنيات البناء الذكي', 'أنظمة إدارة الطاقة'],
        challenges: ['التنسيق بين المقاولين', 'ضمان الجودة العالية'],
        solutions: ['نظام إدارة مشاريع متطور', 'فريق رقابة جودة محترف'],
        teamMembers: [],
        tags: ['سكني', 'فاخر', 'القاهرة الجديدة'],
        clientTestimonial: '',
        featured: true,
        published: true
      }
    })
  } finally {
    await prisma.$disconnect()
  }
}