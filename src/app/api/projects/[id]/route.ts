// Get single project API Route  
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  
  try {
    const { id: projectId } = await params
    
    console.log('🔍 Fetching project with ID:', projectId)

    const project = await prisma.project.findUnique({
      where: {
        id: projectId
      },
      include: {
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { success: false, message: 'المشروع غير موجود' },
        { status: 404 }
      )
    }

    // Transform data to match frontend expectations
    const p = project as any; // Temporary type casting
    
    // Safe JSON parse function
    const safeJsonParse = (jsonString: string | null, defaultValue: any = []): any => {
      if (!jsonString) return defaultValue;
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        console.warn('Failed to parse JSON:', jsonString);
        // If it's not JSON and default is array, treat as comma-separated string
        if (Array.isArray(defaultValue)) {
          return jsonString.split(',').map((item: string) => item.trim()).filter(Boolean);
        }
        return defaultValue;
      }
    };
    
    const transformedProject = {
      id: p.id,
      title: p.title,
      location: p.location,
      type: p.type || p.projectType,
      price: p.price?.toString() || '0',
      bedrooms: p.bedrooms,
      area: p.area,
      description: p.description,
      mainImage: p.mainImage || p.images[0]?.url || '/images/placeholder.jpg',
      images: p.images.map((img: any) => ({
        id: img.id,
        url: img.url,
        alt: img.alt || p.title
      })),
      features: safeJsonParse(p.features, []),
      specifications: safeJsonParse(p.specifications, {}),
      paymentPlan: safeJsonParse(p.paymentPlan, []),
      locationDetails: safeJsonParse(p.locationDetails, {}),
      deliveryDate: p.deliveryDate ? new Date(p.deliveryDate).getFullYear().toString() : '',
      developer: p.developer,
      contactName: p.contactName,
      contactPhone: p.contactPhone,
      contactEmail: p.contactEmail,
      totalUnits: p.totalUnits,
      availableUnits: p.availableUnits,
      minPrice: p.minPrice?.toString(),
      maxPrice: p.maxPrice?.toString(),
      currency: p.currency,
      status: p.status,
      featured: p.featured || false
    }

    return NextResponse.json({
      success: true,
      data: transformedProject
    })

  } catch (error) {
    console.error('Project fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ في جلب المشروع' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  
  try {
    const { id: projectId } = await params
    const data = await request.json()
    
    console.log('🔄 PUT request for project ID:', projectId)
    console.log('📋 Request data:', data)

    const updateData = {
      title: data.title,
      description: data.description,
      location: data.location,
      developer: data.developer,
      projectType: data.projectType,
      status: data.status,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
    } as any; // Temporary type casting

    // Add optional fields if they exist in the schema
    if (data.price) updateData.price = parseFloat(data.price);
    if (data.bedrooms) updateData.bedrooms = parseInt(data.bedrooms);
    if (data.area) updateData.area = parseInt(data.area);
    if (data.type) updateData.type = data.type;
    if (data.totalUnits) updateData.totalUnits = parseInt(data.totalUnits);
    if (data.availableUnits) updateData.availableUnits = parseInt(data.availableUnits);
    if (data.minPrice) updateData.minPrice = parseFloat(data.minPrice);
    if (data.maxPrice) updateData.maxPrice = parseFloat(data.maxPrice);
    if (data.currency) updateData.currency = data.currency;
    if (data.deliveryDate) updateData.deliveryDate = new Date(data.deliveryDate);
    if (data.features) updateData.features = JSON.stringify(data.features);
    if (data.specifications) updateData.specifications = JSON.stringify(data.specifications);
    if (data.paymentPlan) updateData.paymentPlan = JSON.stringify(data.paymentPlan);
    if (data.locationDetails) updateData.locationDetails = JSON.stringify(data.locationDetails);
    if (data.mainImage) updateData.mainImage = data.mainImage;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.published !== undefined) updateData.published = data.published;

    const project = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
      include: {
        images: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث المشروع بنجاح',
      data: project
    })

  } catch (error) {
    console.error('Project update error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ في تحديث المشروع' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  
  try {
    const { id: projectId } = await params

    await prisma.project.delete({
      where: { id: projectId }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف المشروع بنجاح'
    })

  } catch (error) {
    console.error('Project delete error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ في حذف المشروع' },
      { status: 500 }
    )
  }
}
