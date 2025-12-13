import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import cloudinary from '@/lib/cloudinary'
import { logUserActivity } from '@/lib/activity-logger'
import { deleteMultipleImagesFromCloudinary } from '@/lib/cloudinary-helper'
import { notifyPropertyPendingReview } from '@/lib/notifications'

const prisma = new PrismaClient()

// Validation schema
const propertySchema = z.object({
  title: z.string().min(1, 'عنوان العقار مطلوب'),
  description: z.string().min(10, 'وصف العقار يجب أن يكون 10 أحرف على الأقل'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'السعر غير صحيح'),
  currency: z.enum(['EGP', 'USD']),
  negotiable: z.string().optional(),
  area: z.string().regex(/^\d+$/, 'المساحة يجب أن تكون رقم'),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  floors: z.string().optional(),
  floor: z.string().optional(),
  parking: z.string().optional(),
  furnished: z.string().optional(),
  city: z.string().min(1, 'المدينة مطلوبة'),
  district: z.string().min(1, 'المنطقة مطلوبة'),
  address: z.string().min(1, 'العنوان مطلوب'),
  propertyType: z.enum(['APARTMENT', 'VILLA', 'OFFICE', 'COMMERCIAL', 'LAND']),
  purpose: z.enum(['SALE', 'RENT']),
  features: z.string().optional(),
  additionalDetails: z.string().optional(),
  contactName: z.string().min(1, 'اسم جهة التواصل مطلوب'),
  contactPhone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  contactEmail: z.string().email('البريد الإلكتروني غير صحيح'),
})

// Get user from JWT token
async function getUserFromToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })
    return user
  } catch (error) {
    return null
  }
}

// Upload image to Cloudinary
async function uploadToCloudinary(file: File, folder: string = 'properties'): Promise<{ url: string; publicId: string }> {
  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Convert buffer to base64
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: `amg-real-estate/${folder}`,
      resource_type: 'auto',
      transformation: [
        { width: 1920, height: 1080, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    })
    
    console.log('✅ Image uploaded to Cloudinary:', result.secure_url)
    console.log('🔑 Public ID:', result.public_id)
    
    return {
      url: result.secure_url,
      publicId: result.public_id
    }
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error)
    throw new Error('فشل رفع الصورة')
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/properties - Request received')
    
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value
    console.log('Auth token present:', !!token)
    
    if (!token) {
      console.log('No auth token found in request')
      return NextResponse.json(
        { message: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    // Get user
    const user = await getUserFromToken(token)
    console.log('User from token:', user ? `${user.firstName} ${user.lastName}` : 'null')
    
    if (!user) {
      console.log('Invalid user from token')
      return NextResponse.json(
        { message: 'مستخدم غير صالح' },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    console.log('Form data received')
    
    // Extract form fields
    const data: any = {}
    const images: File[] = []

    for (const [key, value] of formData.entries()) {
      if (key === 'images' && value instanceof File) {
        images.push(value)
      } else if (typeof value === 'string') {
        data[key] = value
      }
    }

    console.log('Extracted data:', data)
    console.log('Number of images:', images.length)

    // Validate data
    const validatedData = propertySchema.parse(data)

    // Prepare property data
    const propertyData = {
      title: validatedData.title.trim(),
      description: validatedData.description.trim(),
      price: parseFloat(validatedData.price),
      currency: validatedData.currency,
      negotiable: validatedData.negotiable === 'true',
      area: parseInt(validatedData.area),
      bedrooms: validatedData.bedrooms && validatedData.bedrooms !== '' ? parseInt(validatedData.bedrooms) : null,
      bathrooms: validatedData.bathrooms && validatedData.bathrooms !== '' ? parseInt(validatedData.bathrooms) : null,
      floors: validatedData.floors && validatedData.floors !== '' ? parseInt(validatedData.floors) : null,
      floor: validatedData.floor && validatedData.floor !== '' ? parseInt(validatedData.floor) : null,
      parking: validatedData.parking === 'true',
      furnished: validatedData.furnished === 'true',
      city: validatedData.city.trim(),
      district: validatedData.district.trim(),
      address: validatedData.address.trim(),
      propertyType: validatedData.propertyType,
      purpose: validatedData.purpose,
      features: validatedData.features ? validatedData.features.trim() : null,
      additionalDetails: validatedData.additionalDetails ? validatedData.additionalDetails.trim() : null,
      contactName: validatedData.contactName.trim(),
      contactPhone: validatedData.contactPhone.trim(),
      contactEmail: validatedData.contactEmail.trim(),
      userId: user.id,
    }

    // Create property
    const property = await prisma.property.create({
      data: propertyData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    })

    // Save images if any
    if (images.length > 0) {
      console.log(`📸 Uploading ${images.length} images to Cloudinary...`)
      
      const imagePromises = images.map(async (image, index) => {
        const { url, publicId } = await uploadToCloudinary(image, 'properties')
        return prisma.propertyImage.create({
          data: {
            url: url,
            // @ts-ignore - publicId exists in schema
            publicId: publicId,
            alt: `${property.title} - صورة ${index + 1}`,
            isMain: index === 0, // First image is main
            order: index,
            propertyId: property.id,
          }
        })
      })

      await Promise.all(imagePromises)
      console.log('✅ All images uploaded successfully')
    }

    // إرسال إشعار للمستخدم بأن العقار قيد المراجعة
    await notifyPropertyPendingReview(
      user.id,
      property.id,
      property.title
    );

    // تسجيل النشاط
    await logUserActivity({
      userId: user.id,
      activityType: 'PROPERTY_CREATE',
      entityType: 'PROPERTY',
      entityId: property.id,
      title: 'إضافة عقار جديد',
      description: `تم إضافة عقار: ${property.title}`,
      metadata: {
        propertyId: property.id,
        propertyType: property.propertyType,
        purpose: property.purpose,
        price: property.price.toString(),
        city: property.city
      },
      request
    })

    // Get complete property with images
    const completeProperty = await prisma.property.findUnique({
      where: { id: property.id },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: 'تم إضافة العقار بنجاح',
      property: completeProperty
    })

  } catch (error) {
    console.error('Error creating property:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'بيانات غير صحيحة', errors: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'حدث خطأ في إضافة العقار' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { message: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    // Get user
    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json(
        { message: 'مستخدم غير صالح' },
        { status: 401 }
      )
    }

    // Get user's properties
    const properties = await prisma.property.findMany({
      where: {
        userId: user.id
      },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            favorites: true,
            inquiries: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ properties })

  } catch (error) {
    console.error('Error fetching user properties:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في جلب العقارات' },
      { status: 500 }
    )
  }
}
