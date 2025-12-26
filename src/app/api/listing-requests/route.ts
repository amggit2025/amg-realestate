import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdminToken } from '@/lib/admin-auth'
import { sendListingRequestConfirmation, sendNewListingRequestNotification } from '@/lib/email'

// إنشاء طلب جديد (للزوار)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      propertyType,
      purpose,
      area,
      price,
      currency = 'EGP',
      governorate,
      city,
      district,
      address,
      bedrooms,
      bathrooms,
      floors,
      floor,
      yearBuilt,
      features,
      description,
      images,
      ownerName,
      ownerPhone,
      ownerEmail,
      preferredTime,
      serviceType
    } = body

    // التحقق من البيانات المطلوبة
    if (!propertyType || !purpose || !area || !price || !governorate || !city || !district) {
      return NextResponse.json(
        { error: 'جميع بيانات العقار مطلوبة' },
        { status: 400 }
      )
    }

    if (!description) {
      return NextResponse.json(
        { error: 'وصف العقار مطلوب' },
        { status: 400 }
      )
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'يجب رفع صورة واحدة على الأقل' },
        { status: 400 }
      )
    }

    if (!ownerName || !ownerPhone || !ownerEmail) {
      return NextResponse.json(
        { error: 'بيانات التواصل مطلوبة' },
        { status: 400 }
      )
    }

    if (!serviceType) {
      return NextResponse.json(
        { error: 'نوع الخدمة مطلوب' },
        { status: 400 }
      )
    }

    // إنشاء الطلب
    const listingRequest = await prisma.propertyListingRequest.create({
      data: {
        propertyType,
        purpose,
        area: parseFloat(area),
        price: parseFloat(price),
        currency,
        governorate,
        city,
        district,
        address: address || null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        floors: floors ? parseInt(floors) : null,
        floor: floor ? parseInt(floor) : null,
        yearBuilt: yearBuilt ? parseInt(yearBuilt) : null,
        features: features || null,
        description,
        images,
        ownerName,
        ownerPhone,
        ownerEmail,
        preferredTime: preferredTime || null,
        serviceType,
        status: 'PENDING'
      }
    })

    // إرسال إيميل تأكيد للعميل
    sendListingRequestConfirmation(
      ownerEmail,
      ownerName,
      listingRequest.id,
      propertyType,
      purpose,
      serviceType
    ).catch(err => console.error('Failed to send confirmation email:', err))

    // إرسال إشعار للأدمن
    sendNewListingRequestNotification(
      listingRequest.id,
      ownerName,
      ownerPhone,
      ownerEmail,
      propertyType,
      purpose,
      governorate,
      city,
      parseFloat(price),
      currency
    ).catch(err => console.error('Failed to send admin notification:', err))

    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً',
      requestId: listingRequest.id
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating listing request:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الطلب' },
      { status: 500 }
    )
  }
}

// جلب الطلبات (للأدمن فقط)
export async function GET(request: NextRequest) {
  try {
    // التحقق من صلاحيات الأدمن
    const authResult = await verifyAdminToken(request)
    if (!authResult.isValid) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    // الفلاتر
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const propertyType = searchParams.get('propertyType')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // بناء الـ where clause
    const where: any = {}
    if (status) where.status = status
    if (propertyType) where.propertyType = propertyType

    // جلب الطلبات مع العدد الكلي
    const [rawRequests, total] = await Promise.all([
      prisma.propertyListingRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.propertyListingRequest.count({ where })
    ])

    // Parse JSON fields (images and features)
    const requests = rawRequests.map(req => ({
      ...req,
      images: typeof req.images === 'string' ? JSON.parse(req.images) : (req.images || []),
      features: typeof req.features === 'string' ? JSON.parse(req.features as string) : (req.features || [])
    }))

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching listing requests:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الطلبات' },
      { status: 500 }
    )
  }
}
