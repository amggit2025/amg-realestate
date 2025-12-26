// Admin Projects API Route
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
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
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📝 POST /api/admin/projects - Creating new project')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    const data = await request.json()
    console.log('📋 Received data:', JSON.stringify(data, null, 2))

    // Validate required fields
    const requiredFields = ['title', 'description', 'location', 'developer', 'contactName', 'contactPhone', 'contactEmail']
    const missingFields = requiredFields.filter(field => !data[field])
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields)
      return NextResponse.json({
        success: false,
        message: `الحقول التالية مطلوبة: ${missingFields.join(', ')}`
      }, { status: 400 })
    }

    // Find main image URL from images array
    let mainImageUrl = null
    if (data.images && data.images.length > 0) {
      const mainImg = data.images.find((img: any) => img.isMain)
      mainImageUrl = mainImg ? mainImg.url : data.images[0].url
      console.log('📸 Main image URL:', mainImageUrl)
    } else {
      console.log('⚠️ No images provided')
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
      mainImage: mainImageUrl,
    } as any

    // Add optional fields with validation
    if (data.totalUnits) {
      const totalUnits = parseInt(data.totalUnits)
      if (!isNaN(totalUnits)) createData.totalUnits = totalUnits
    }
    if (data.availableUnits) {
      const availableUnits = parseInt(data.availableUnits)
      if (!isNaN(availableUnits)) createData.availableUnits = availableUnits
    }
    if (data.minPrice) {
      const minPrice = parseFloat(data.minPrice)
      if (!isNaN(minPrice)) createData.minPrice = minPrice
    }
    if (data.maxPrice) {
      const maxPrice = parseFloat(data.maxPrice)
      if (!isNaN(maxPrice)) createData.maxPrice = maxPrice
    }
    if (data.currency) createData.currency = data.currency
    if (data.deliveryDate) {
      try {
        createData.deliveryDate = new Date(data.deliveryDate)
      } catch (e) {
        console.warn('⚠️ Invalid deliveryDate format:', data.deliveryDate)
      }
    }
    if (data.area) {
      const area = parseInt(data.area)
      if (!isNaN(area)) createData.area = area
    }
    if (data.bedrooms) {
      const bedrooms = parseInt(data.bedrooms)
      if (!isNaN(bedrooms)) createData.bedrooms = bedrooms
    }
    
    // Handle features - convert to JSON string
    if (data.features) {
      if (Array.isArray(data.features)) {
        createData.features = JSON.stringify(data.features)
      } else if (typeof data.features === 'string') {
        const featuresArray = data.features.split(/[,\n]/).map((f: string) => f.trim()).filter(Boolean)
        createData.features = JSON.stringify(featuresArray)
      }
    }
    
    // Handle other JSON fields
    if (data.specifications) {
      createData.specifications = typeof data.specifications === 'string' 
        ? data.specifications 
        : JSON.stringify(data.specifications)
    }
    if (data.paymentPlan) {
      createData.paymentPlan = typeof data.paymentPlan === 'string'
        ? data.paymentPlan
        : JSON.stringify(data.paymentPlan)
    }
    if (data.locationDetails) {
      createData.locationDetails = typeof data.locationDetails === 'string'
        ? data.locationDetails
        : JSON.stringify(data.locationDetails)
    }

    console.log('📦 Final create data:', JSON.stringify(createData, null, 2))

    // Create project
    console.log('💾 Creating project in database...')
    const project = await prisma.project.create({
      data: createData
    })

    console.log('✅ Project created with ID:', project.id)

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
      
      console.log('📸 Image data to insert:', JSON.stringify(imageData, null, 2))
      
      await prisma.projectImage.createMany({
        data: imageData
      })
      
      console.log('✅ Images added successfully')
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ Project creation completed successfully')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء المشروع بنجاح',
      data: project
    })

  } catch (error: any) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.error('💥 Admin project creation error')
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.error('Error type:', error?.constructor?.name)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    
    // Prisma-specific error handling
    if (error?.code) {
      console.error('Prisma error code:', error.code)
      console.error('Prisma meta:', error.meta)
    }
    
    // Return detailed error message
    const errorMessage = error?.message || 'خطأ غير معروف في إنشاء المشروع'
    
    return NextResponse.json({
      success: false,
      message: `خطأ في إنشاء المشروع: ${errorMessage}`,
      error: process.env.NODE_ENV === 'development' ? {
        message: error?.message,
        code: error?.code,
        stack: error?.stack
      } : undefined
    }, { status: 500 })
  }
}
