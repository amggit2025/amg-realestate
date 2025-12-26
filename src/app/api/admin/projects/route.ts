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
      projects: transformedProjects,
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
    
    console.log('📝 Creating project with data:', JSON.stringify(data, null, 2))

    // Find main image URL from images array
    let mainImageUrl = null
    if (data.images && data.images.length > 0) {
      const mainImg = data.images.find((img: any) => img.isMain)
      mainImageUrl = mainImg ? mainImg.url : data.images[0].url
    }

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
      mainImage: mainImageUrl, // ⭐ حفظ الصورة الرئيسية
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

    console.log('📦 Final create data:', JSON.stringify(createData, null, 2))

    const project = await prisma.project.create({
      data: createData
    })

    console.log('✅ Project created:', project.id)

    // Add images if provided
    if (data.images && data.images.length > 0) {
      console.log('📸 Adding', data.images.length, 'images...')
      
      const imageData = data.images.map((image: any, index: number) => ({
        url: image.url,
        publicId: image.publicId || null,
        alt: image.alt || `${data.title} - صورة ${index + 1}`,
        isMain: image.isMain || index === 0,
        order: image.order || index + 1,
        projectId: project.id
      }))
      
      console.log('📸 Image data:', JSON.stringify(imageData, null, 2))
      
      // @ts-ignore - publicId موجود في Schema
      await prisma.projectImage.createMany({
        data: imageData
      })
      
      console.log('✅ Images added successfully')
    }
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
