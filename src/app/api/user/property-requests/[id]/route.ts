import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// جلب تفاصيل طلب معين (للمستخدم فقط)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // التحقق من تسجيل دخول المستخدم
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'غير مصرح - تسجيل الدخول مطلوب' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'رمز غير صحيح' }, { status: 401 })
    }

    const listingRequest = await prisma.propertyListingRequest.findUnique({
      where: { id }
    })

    if (!listingRequest) {
      return NextResponse.json(
        { error: 'الطلب غير موجود' },
        { status: 404 }
      )
    }

    // الحصول على بيانات المستخدم للتحقق من الإيميل
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { email: true }
    })

    // التأكد من أن الطلب يخص المستخدم الحالي (بالـ submittedBy أو الإيميل)
    const isOwner = (listingRequest as any).submittedBy === decoded.userId || 
                    listingRequest.ownerEmail === user?.email
    
    if (!isOwner) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول لهذا الطلب' },
        { status: 403 }
      )
    }

    // Parse JSON fields
    const parsedRequest = {
      ...listingRequest,
      images: typeof listingRequest.images === 'string' ? JSON.parse(listingRequest.images) : (listingRequest.images || []),
      features: typeof listingRequest.features === 'string' ? JSON.parse(listingRequest.features as string) : (listingRequest.features || [])
    }

    return NextResponse.json({
      success: true,
      data: parsedRequest
    })

  } catch (error) {
    console.error('Error fetching listing request:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الطلب' },
      { status: 500 }
    )
  }
}

// تحديث طلب (فقط إذا كان الطلب في حالة PENDING)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // التحقق من تسجيل دخول المستخدم
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'غير مصرح - تسجيل الدخول مطلوب' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'رمز غير صحيح' }, { status: 401 })
    }

    // التحقق من وجود الطلب
    const existingRequest = await prisma.propertyListingRequest.findUnique({
      where: { id }
    })

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'الطلب غير موجود' },
        { status: 404 }
      )
    }

    // الحصول على بيانات المستخدم للتحقق من الإيميل
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { email: true }
    })

    // التأكد من أن الطلب يخص المستخدم الحالي (بالـ submittedBy أو الإيميل)
    const isOwner = (existingRequest as any).submittedBy === decoded.userId || 
                    existingRequest.ownerEmail === user?.email
    
    if (!isOwner) {
      return NextResponse.json(
        { error: 'غير مصرح بتعديل هذا الطلب' },
        { status: 403 }
      )
    }

    // التأكد من أن الطلب في حالة PENDING فقط
    if (existingRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'لا يمكن تعديل الطلب بعد بدء المراجعة' },
        { status: 400 }
      )
    }

    // Parse FormData
    const formData = await request.formData()
    
    // Get existing images or new ones
    const existingImagesStr = formData.get('existingImages') as string
    const existingImages = existingImagesStr ? JSON.parse(existingImagesStr) : []
    
    // For now, just keep existing images (file upload would need Cloudinary integration)
    const images = JSON.stringify(existingImages)

    // Get form values
    const propertyType = formData.get('propertyType') as string
    const purpose = formData.get('purpose') as string
    const governorate = formData.get('governorate') as string
    const city = formData.get('city') as string
    const area = parseFloat(formData.get('area') as string) || 0
    const price = parseFloat(formData.get('price') as string) || 0
    const ownerName = formData.get('ownerName') as string
    const ownerPhone = formData.get('ownerPhone') as string
    const ownerEmail = formData.get('ownerEmail') as string
    const description = formData.get('description') as string || ''
    const features = formData.get('features') as string || '[]'
    const serviceType = formData.get('serviceType') as string
    const bedrooms = formData.get('bedrooms') ? parseInt(formData.get('bedrooms') as string) : null
    const bathrooms = formData.get('bathrooms') ? parseInt(formData.get('bathrooms') as string) : null

    // تحديث الطلب باستخدام raw SQL لتجنب مشاكل Prisma types
    await prisma.$executeRaw`
      UPDATE property_listing_requests 
      SET 
        propertyType = ${propertyType},
        purpose = ${purpose},
        governorate = ${governorate},
        city = ${city},
        area = ${area},
        price = ${price},
        ownerName = ${ownerName},
        ownerPhone = ${ownerPhone},
        ownerEmail = ${ownerEmail},
        description = ${description},
        images = ${images},
        features = ${features},
        serviceType = ${serviceType},
        bedrooms = ${bedrooms},
        bathrooms = ${bathrooms},
        updatedAt = NOW()
      WHERE id = ${id}
    `

    // Fetch updated request
    const updatedRequests = await prisma.$queryRaw`
      SELECT * FROM property_listing_requests WHERE id = ${id}
    ` as any[]
    
    const updatedRequest = updatedRequests[0]

    // Parse JSON fields for response
    const parsedRequest = {
      ...updatedRequest,
      images: typeof updatedRequest.images === 'string' ? JSON.parse(updatedRequest.images) : (updatedRequest.images || []),
      features: typeof updatedRequest.features === 'string' ? JSON.parse(updatedRequest.features) : (updatedRequest.features || [])
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الطلب بنجاح',
      data: parsedRequest
    })

  } catch (error) {
    console.error('Error updating listing request:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الطلب', details: errorMessage },
      { status: 500 }
    )
  }
}

// حذف طلب (فقط إذا كان الطلب في حالة PENDING)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // التحقق من تسجيل دخول المستخدم
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'غير مصرح - تسجيل الدخول مطلوب' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'رمز غير صحيح' }, { status: 401 })
    }

    // التحقق من وجود الطلب
    const existingRequest = await prisma.propertyListingRequest.findUnique({
      where: { id }
    })

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'الطلب غير موجود' },
        { status: 404 }
      )
    }

    // الحصول على بيانات المستخدم للتحقق من الإيميل
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { email: true }
    })

    // التأكد من أن الطلب يخص المستخدم الحالي (بالـ submittedBy أو الإيميل)
    const isOwner = (existingRequest as any).submittedBy === decoded.userId || 
                    existingRequest.ownerEmail === user?.email
    
    if (!isOwner) {
      return NextResponse.json(
        { error: 'غير مصرح بحذف هذا الطلب' },
        { status: 403 }
      )
    }

    // التأكد من أن الطلب في حالة PENDING فقط
    if (existingRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'لا يمكن حذف الطلب بعد بدء المراجعة' },
        { status: 400 }
      )
    }

    await prisma.propertyListingRequest.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف الطلب بنجاح'
    })

  } catch (error) {
    console.error('Error deleting listing request:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف الطلب' },
      { status: 500 }
    )
  }
}
