// Admin Projects API Route
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// إنشاء Prisma client جديد مخصوص لهذا الـ route
const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // تأكد من الاتصال بقاعدة البيانات
    await prisma.$connect()
    
    const projects = await prisma.project.findMany({
      orderBy: [
        { createdAt: 'desc' }
      ]
    })

    // Transform data for admin view
    const transformedProjects = projects.map(project => {
      const p = project as any
      return {
        id: p.id,
        title: p.title,
        location: p.location,
        type: p.type || 'غير محدد',
        price: p.price?.toString() || '0',
        developer: p.developer,
        status: p.status,
        featured: p.featured || false,
        published: p.published !== false,
        createdAt: p.createdAt.toISOString()
      }
    })

    return NextResponse.json({
      success: true,
      data: transformedProjects,
      count: transformedProjects.length
    })

  } catch (error) {
    console.error('Admin projects fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ في جلب المشاريع' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Create project with admin data
    const createData = {
      title: data.title,
      description: data.description,
      location: data.location,
      developer: data.developer,
      projectType: data.projectType || 'RESIDENTIAL',
      status: data.status || 'PLANNING',
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
    } as any

    // Add optional fields
    if (data.totalUnits) createData.totalUnits = parseInt(data.totalUnits)
    if (data.availableUnits) createData.availableUnits = parseInt(data.availableUnits)
    if (data.minPrice) createData.minPrice = parseFloat(data.minPrice)
    if (data.maxPrice) createData.maxPrice = parseFloat(data.maxPrice)
    if (data.currency) createData.currency = data.currency
    if (data.deliveryDate) createData.deliveryDate = new Date(data.deliveryDate)
    if (data.area) createData.area = parseInt(data.area)
    if (data.bedrooms) createData.bedrooms = parseInt(data.bedrooms)
    if (data.amenities) createData.amenities = data.amenities
    
    // Handle features - convert string to JSON array if needed
    if (data.features) {
      if (Array.isArray(data.features)) {
        createData.features = JSON.stringify(data.features)
      } else if (typeof data.features === 'string') {
        // Split by comma or newline and create array
        const featuresArray = data.features.split(/[,\n]/).map((f: string) => f.trim()).filter(Boolean)
        createData.features = JSON.stringify(featuresArray)
      }
    }
    
    // Handle other JSON fields
    if (data.specifications) createData.specifications = JSON.stringify(data.specifications)
    if (data.paymentPlan) createData.paymentPlan = JSON.stringify(data.paymentPlan)
    if (data.locationDetails) createData.locationDetails = JSON.stringify(data.locationDetails)

    const project = await prisma.project.create({
      data: createData
    })

    // Add images if provided
    if (data.images && data.images.length > 0) {
      const imageData = data.images.map((image: any) => ({
        url: image.url,
        publicId: image.publicId || null,
        alt: image.alt || `${data.title} - صورة`,
        isMain: image.isMain || false,
        order: image.order || 1,
        projectId: project.id
      }))
      
      // @ts-ignore - publicId موجود في Schema
      await prisma.projectImage.createMany({
        data: imageData
      })
    }

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء المشروع بنجاح',
      data: project
    })

  } catch (error) {
    console.error('Admin project creation error:', error)
    return NextResponse.json(
      { success: false, message: 'خطأ في إنشاء المشروع' },
      { status: 500 }
    )
  }
}
