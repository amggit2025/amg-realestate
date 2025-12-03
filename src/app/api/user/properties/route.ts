// ======================================================
// 🏠 AMG Real Estate - User Properties API
// ======================================================
// API لعرض وإضافة عقارات المستخدم الحالي
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

// التحقق من صحة بيانات العقار الجديد
const propertySchema = z.object({
  title: z.string().min(5, 'عنوان العقار يجب أن يكون على الأقل 5 أحرف'),
  description: z.string().min(20, 'وصف العقار يجب أن يكون على الأقل 20 حرف'),
  price: z.number().positive('السعر يجب أن يكون أكبر من صفر'),
  currency: z.enum(['EGP', 'USD']).optional().default('EGP'),
  area: z.number().positive('المساحة يجب أن تكون أكبر من صفر'),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  parking: z.boolean().optional().default(false),
  furnished: z.boolean().optional().default(false),
  city: z.string().min(2, 'اسم المدينة مطلوب'),
  district: z.string().min(2, 'اسم الحي مطلوب'),
  address: z.string().min(10, 'العنوان يجب أن يكون على الأقل 10 أحرف'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  propertyType: z.enum(['APARTMENT', 'VILLA', 'OFFICE', 'COMMERCIAL', 'LAND']),
  purpose: z.enum(['SALE', 'RENT']),
  features: z.array(z.string()).optional().default([]),
  contactName: z.string().min(2, 'اسم المسؤول مطلوب'),
  contactPhone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  contactEmail: z.string().email('البريد الإلكتروني غير صحيح')
})

// جلب عقارات المستخدم
export async function GET(request: NextRequest) {
  try {
    // التحقق من صحة المصادقة
    const authResult = await requireAuth(request)
    
    if (!authResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: authResult.message,
          requireAuth: authResult.requireAuth
        },
        { status: authResult.status }
      )
    }

    const userId = authResult.user!.id

    // جلب العقارات الخاصة بالمستخدم
    const properties = await prisma.property.findMany({
      where: {
        userId: userId
      },
      include: {
        images: {
          orderBy: {
            order: 'asc'
          }
        },
        favorites: true,
        inquiries: {
          where: {
            status: 'PENDING'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // تحويل البيانات للعرض
    const transformedProperties = properties.map(property => ({
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price.toString(),
      currency: property.currency,
      area: property.area,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      parking: property.parking,
      furnished: property.furnished,
      city: property.city,
      district: property.district,
      address: property.address,
      propertyType: property.propertyType,
      purpose: property.purpose,
      status: property.status,
      features: property.features ? JSON.parse(property.features) : [],
      views: property.views,
      contactName: property.contactName,
      contactPhone: property.contactPhone,
      contactEmail: property.contactEmail,
      mainImage: property.images.find(img => img.isMain)?.url || property.images[0]?.url || null,
      images: property.images.map(img => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        isMain: img.isMain,
        order: img.order
      })),
      stats: {
        favoritesCount: property.favorites.length,
        pendingInquiries: property.inquiries.length,
        views: property.views
      },
      createdAt: property.createdAt.toISOString(),
      updatedAt: property.updatedAt.toISOString()
    }))

    // حساب إحصائيات عامة
    const stats = {
      total: properties.length,
      active: properties.filter(p => p.status === 'ACTIVE').length,
      sold: properties.filter(p => p.status === 'SOLD').length,
      rented: properties.filter(p => p.status === 'RENTED').length,
      pending: properties.filter(p => p.status === 'PENDING').length,
      totalViews: properties.reduce((sum, p) => sum + p.views, 0),
      totalFavorites: properties.reduce((sum, p) => sum + p.favorites.length, 0),
      totalInquiries: properties.reduce((sum, p) => sum + p.inquiries.length, 0)
    }

    console.log(`✅ Retrieved ${properties.length} properties for user:`, userId)

    return NextResponse.json({
      success: true,
      properties: transformedProperties,
      stats,
      count: properties.length
    })

  } catch (error) {
    console.error('❌ Error fetching user properties:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'حدث خطأ أثناء جلب العقارات'
      },
      { status: 500 }
    )
  }
}

// إضافة عقار جديد
export async function POST(request: NextRequest) {
  try {
    // التحقق من صحة المصادقة
    const authResult = await requireAuth(request)
    
    if (!authResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: authResult.message,
          requireAuth: authResult.requireAuth
        },
        { status: authResult.status }
      )
    }

    const userId = authResult.user!.id
    const body = await request.json()

    console.log('📝 New property creation attempt for user:', userId)

    // التحقق من صحة البيانات
    const validatedData = propertySchema.parse(body)

    // إنشاء العقار الجديد
    const newProperty = await prisma.property.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        currency: validatedData.currency,
        area: validatedData.area,
        bedrooms: validatedData.bedrooms,
        bathrooms: validatedData.bathrooms,
        parking: validatedData.parking,
        furnished: validatedData.furnished,
        city: validatedData.city,
        district: validatedData.district,
        address: validatedData.address,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        propertyType: validatedData.propertyType,
        purpose: validatedData.purpose,
        features: JSON.stringify(validatedData.features),
        contactName: validatedData.contactName,
        contactPhone: validatedData.contactPhone,
        contactEmail: validatedData.contactEmail,
        userId: userId,
        status: 'ACTIVE'
      },
      include: {
        images: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    console.log('✅ Property created successfully:', newProperty.id)

    return NextResponse.json({
      success: true,
      message: 'تم إضافة العقار بنجاح!',
      property: {
        id: newProperty.id,
        title: newProperty.title,
        price: newProperty.price.toString(),
        currency: newProperty.currency,
        city: newProperty.city,
        district: newProperty.district,
        propertyType: newProperty.propertyType,
        purpose: newProperty.purpose,
        status: newProperty.status,
        createdAt: newProperty.createdAt.toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Error creating property:', error)

    // التعامل مع أخطاء التحقق من البيانات
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return NextResponse.json(
        {
          success: false,
          message: firstError.message,
          field: firstError.path[0]
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'حدث خطأ أثناء إضافة العقار. حاول مرة أخرى.'
      },
      { status: 500 }
    )
  }
}