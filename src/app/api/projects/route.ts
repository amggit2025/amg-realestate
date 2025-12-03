// Get all projects API Route
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient()
  
  try {
    await prisma.$connect()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    const priceRange = searchParams.get('priceRange')
    const featured = searchParams.get('featured')

    // Build where clause for filtering
    let where: any = {}

    if (type && type !== 'جميع الأنواع') {
      where.type = type
    }

    if (location && location !== 'جميع المناطق') {
      where.location = {
        contains: location
      }
    }

    if (featured === 'true') {
      where.featured = true
    }

    // Price range filtering
    if (priceRange && priceRange !== 'جميع الأسعار') {
      const ranges: { [key: string]: { min?: number, max?: number } } = {
        '2-3 مليون': { min: 2000000, max: 3000000 },
        '3-5 مليون': { min: 3000000, max: 5000000 },
        '5+ مليون': { min: 5000000 }
      }
      
      const range = ranges[priceRange]
      if (range) {
        where.price = {
          ...(range.min && { gte: range.min }),
          ...(range.max && { lte: range.max })
        }
      }
    }

    const projects = await prisma.project.findMany({
      where: where,
      include: {
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ]
    })

    // Transform data to match frontend expectations
    const transformedProjects = projects.map(project => {
      const p = project as any; // Temporary type casting
      
      // Safe JSON parse function
      const safeJsonParse = (jsonString: string | null, defaultValue: any = []): any => {
        if (!jsonString || jsonString.trim() === '') {
          return defaultValue;
        }
        
        // If it's a simple string (not JSON), return as array or default
        if (typeof jsonString === 'string' && !jsonString.trim().startsWith('[') && !jsonString.trim().startsWith('{')) {
          // If default is array, convert to array
          if (Array.isArray(defaultValue)) {
            return jsonString.split(',').map((item: string) => item.trim()).filter(Boolean);
          }
          return defaultValue;
        }
        
        try {
          return JSON.parse(jsonString);
        } catch (error) {
          console.warn('Failed to parse JSON:', jsonString.substring(0, 50) + '...');
          // If it's corrupted data or Arabic text, return safe default
          if (Array.isArray(defaultValue)) {
            return jsonString.includes(',') 
              ? jsonString.split(',').map((item: string) => item.trim()).filter(Boolean)
              : [jsonString.trim()];
          }
          return defaultValue;
        }
      };

      return {
        id: p.id,
        title: p.title,
        location: p.location,
        type: p.type || p.projectType,
        price: p.price?.toString() || '0',
        minPrice: p.minPrice?.toString(),
        maxPrice: p.maxPrice?.toString(),
        currency: p.currency || 'EGP',
        bedrooms: p.bedrooms,
        area: p.area,
        description: p.description,
        image: p.mainImage || p.images[0]?.url || '/images/placeholder.jpg',
        features: safeJsonParse(p.features, []),
        deliveryDate: p.deliveryDate ? new Date(p.deliveryDate).getFullYear().toString() : '',
        developer: p.developer,
        hasFullDetails: true,
        featured: p.featured || false
      }
    })

    return NextResponse.json({
      success: true,
      data: transformedProjects,
      count: transformedProjects.length
    })

  } catch (error) {
    console.error('Projects fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ في جلب المشاريع' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient()
  
  try {
    await prisma.$connect()
    const data = await request.json()

    const createData = {
      title: data.title,
      description: data.description,
      location: data.location,
      developer: data.developer,
      projectType: data.projectType,
      status: data.status || 'PLANNING',
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
    } as any; // Temporary type casting

    // Add optional fields if they exist in the schema
    if (data.price) createData.price = parseFloat(data.price);
    if (data.bedrooms) createData.bedrooms = parseInt(data.bedrooms);
    if (data.area) createData.area = parseInt(data.area);
    if (data.type) createData.type = data.type;
    if (data.totalUnits) createData.totalUnits = parseInt(data.totalUnits);
    if (data.availableUnits) createData.availableUnits = parseInt(data.availableUnits);
    if (data.minPrice) createData.minPrice = parseFloat(data.minPrice);
    if (data.maxPrice) createData.maxPrice = parseFloat(data.maxPrice);
    if (data.currency) createData.currency = data.currency;
    if (data.deliveryDate) createData.deliveryDate = new Date(data.deliveryDate);
    if (data.features) createData.features = JSON.stringify(data.features);
    if (data.specifications) createData.specifications = JSON.stringify(data.specifications);
    if (data.paymentPlan) createData.paymentPlan = JSON.stringify(data.paymentPlan);
    if (data.locationDetails) createData.locationDetails = JSON.stringify(data.locationDetails);
    if (data.mainImage) createData.mainImage = data.mainImage;
    if (data.featured !== undefined) createData.featured = data.featured;
    if (data.published !== undefined) createData.published = data.published;

    const project = await prisma.project.create({
      data: createData,
      include: {
        images: true
      }
    })

    // Add images if provided
    if (data.images && data.images.length > 0) {
      await Promise.all(
        data.images.map((imageUrl: string, index: number) =>
          prisma.projectImage.create({
            data: {
              url: imageUrl,
              alt: `${data.title} - صورة ${index + 1}`,
              isMain: index === 0,
              order: index,
              projectId: project.id
            }
          })
        )
      )
    }

    return NextResponse.json({
      success: true,
      message: 'تم إضافة المشروع بنجاح',
      data: project
    })

  } catch (error) {
    console.error('Project creation error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ في إضافة المشروع' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
