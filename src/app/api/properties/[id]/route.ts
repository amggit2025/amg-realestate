import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { logUserActivity } from '@/lib/activity-logger'
import { deleteMultipleImagesFromCloudinary } from '@/lib/cloudinary-helper'
import cloudinary from '@/lib/cloudinary'

const prisma = new PrismaClient()

// Upload image to Cloudinary
async function uploadToCloudinary(file: File, folder: string = 'properties'): Promise<{ url: string; publicId: string }> {
  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`
    
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
    
    return {
      url: result.secure_url,
      publicId: result.public_id
    }
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error)
    throw new Error('فشل رفع الصورة')
  }
}

// جلب عقار واحد
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'غير مصرح' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    const property = await prisma.property.findUnique(
      where: { id },
      include: {
        images: true,
        _count: {
          select: {
            favorites: true,
            inquiries: true,
          }
        }
      }
    })

    if (!property) {
      return NextResponse.json(
        { message: 'العقار غير موجود' },
        { status: 404 }
      )
    }

    // التأكد من أن المستخدم يملك هذا العقار
    if (property.userId !== decoded.userId) {
      return NextResponse.json(
        { message: 'غير مصرح بالوصول لهذا العقار' },
        { status: 403 }
      )
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { message: 'خطأ في الخادم' },
      { status: 500 }
    )
  }
}

// تحديث عقار
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'غير مصرح' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    // التحقق من وجود العقار وملكية المستخدم له
    const existingProperty = await prisma.property.findUnique({
      where: { id }
    })

    if (!existingProperty) {
      return NextResponse.json(
        { message: 'العقار غير موجود' },
        { status: 404 }
      )
    }

    if (existingProperty.userId !== decoded.userId) {
      return NextResponse.json(
        { message: 'غير مصرح بتعديل هذا العقار' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    
    // استخراج البيانات
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const currency = formData.get('currency') as string
    const negotiable = formData.get('negotiable') === 'true'
    const area = parseFloat(formData.get('area') as string)
    const bedrooms = formData.get('bedrooms') ? parseInt(formData.get('bedrooms') as string) : null
    const bathrooms = formData.get('bathrooms') ? parseInt(formData.get('bathrooms') as string) : null
    const floors = formData.get('floors') ? parseInt(formData.get('floors') as string) : null
    const floor = formData.get('floor') ? parseInt(formData.get('floor') as string) : null
    const parking = formData.get('parking') === 'true'
    const furnished = formData.get('furnished') === 'true'
    const city = formData.get('city') as string
    const district = formData.get('district') as string
    const address = formData.get('address') as string
    const propertyType = formData.get('propertyType') as string
    const purpose = formData.get('purpose') as string
    const status = formData.get('status') as string
    const features = formData.get('features') as string
    const additionalDetails = formData.get('additionalDetails') as string
    const contactName = formData.get('contactName') as string
    const contactPhone = formData.get('contactPhone') as string
    const contactEmail = formData.get('contactEmail') as string

    // التحقق من البيانات المطلوبة
    if (!title || !description || !price || !area || !city || !district) {
      return NextResponse.json(
        { message: 'يرجى ملء جميع الحقول المطلوبة' },
        { status: 400 }
      )
    }

    // معالجة الصور
    // 1. جلب الصور الحالية من قاعدة البيانات
    const currentImages = await prisma.propertyImage.findMany({
      where: { propertyId: id }
    })

    // 2. جلب قائمة الصور التي يريد المستخدم الاحتفاظ بها
    const existingImages = JSON.parse(formData.get('existingImages') as string || '[]')
    
    // 3. تحديد الصور المراد حذفها
    const imagesToDelete = currentImages.filter((img: any) => !existingImages.includes(img.url))
    
    if (imagesToDelete.length > 0) {
      console.log(`🗑️ حذف ${imagesToDelete.length} صور قديمة من Cloudinary...`)
      
      // حذف من Cloudinary
      const publicIdsToDelete = imagesToDelete
        .map((img: any) => img.publicId)
        .filter((id: string | null) => id !== null)
      
      if (publicIdsToDelete.length > 0) {
        await deleteMultipleImagesFromCloudinary(publicIdsToDelete)
      }
      
      // حذف من قاعدة البيانات
      await prisma.propertyImage.deleteMany({
        where: {
          id: { in: imagesToDelete.map((img: any) => img.id) }
        }
      })
      
      console.log(`✅ تم حذف ${imagesToDelete.length} صورة`)
    }

    // 4. رفع الصور الجديدة
    const imageFiles = formData.getAll('images') as File[]
    
    if (imageFiles.length > 0 && imageFiles[0].size > 0) {
      console.log(`📸 رفع ${imageFiles.length} صور جديدة...`)
      
      const imagePromises = imageFiles.map(async (file, index) => {
        const { url, publicId } = await uploadToCloudinary(file, 'properties')
        return prisma.propertyImage.create({
          // @ts-ignore - publicId exists in schema
          data: {
            url: url,
            // @ts-ignore - publicId exists in schema
            publicId: publicId,
            alt: `${title} - صورة ${existingImages.length + index + 1}`,
            isMain: existingImages.length === 0 && index === 0,
            order: existingImages.length + index,
            propertyId: id,
          }
        })
      })
      
      await Promise.all(imagePromises)
      console.log('✅ تم رفع جميع الصور الجديدة')
    }
    
    // تحديث العقار في قاعدة البيانات
    const updateData: any = {
      title,
      description,
      price,
      currency,
      negotiable,
      area,
      bedrooms,
      bathrooms,
      floors,
      floor,
      parking,
      furnished,
      city,
      district,
      address,
      propertyType,
      purpose,
      status,
      features,
      additionalDetails,
      contactName,
      contactPhone,
      contactEmail,
      updatedAt: new Date(),
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
        _count: {
          select: {
            favorites: true,
            inquiries: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: 'تم تحديث العقار بنجاح',
      property: updatedProperty
    })

  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { message: 'خطأ في تحديث العقار' },
      { status: 500 }
    )
  }
}

// حذف عقار
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'غير مصرح' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    // التحقق من وجود العقار وملكية المستخدم له
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      include: { images: true }
    })

    if (!existingProperty) {
      return NextResponse.json(
        { message: 'العقار غير موجود' },
        { status: 404 }
      )
    }

    if (existingProperty.userId !== decoded.userId) {
      return NextResponse.json(
        { message: 'غير مصرح بحذف هذا العقار' },
        { status: 403 }
      )
    }

    // 🗑️ حذف جميع صور العقار من Cloudinary
    const imagePublicIds = existingProperty.images
      .map((img: any) => img.publicId)
      .filter((id: string | null) => id !== null)
    
    if (imagePublicIds.length > 0) {
      console.log(`🗑️ حذف ${imagePublicIds.length} صور للعقار من Cloudinary...`)
      const deletedCount = await deleteMultipleImagesFromCloudinary(imagePublicIds)
      console.log(`✅ تم حذف ${deletedCount} من ${imagePublicIds.length} صورة من Cloudinary`)
    }

    // حذف العقار من قاعدة البيانات
    await prisma.property.delete({
      where: { id }
    })

    // تسجيل النشاط
    await logUserActivity({
      userId: decoded.userId,
      activityType: 'PROPERTY_DELETE',
      entityType: 'PROPERTY',
      entityId: id,
      title: 'حذف عقار',
      description: `تم حذف العقار: ${existingProperty.title}`,
      metadata: {
        propertyTitle: existingProperty.title,
        propertyType: existingProperty.propertyType
      },
      request
    })

    return NextResponse.json({
      message: 'تم حذف العقار بنجاح'
    })

  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { message: 'خطأ في حذف العقار' },
      { status: 500 }
    )
  }
}

// تحديث حالة العقار فقط (PATCH)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'غير مصرح' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    const { status } = await request.json()

    // التحقق من وجود العقار وملكية المستخدم له
    const existingProperty = await prisma.property.findUnique({
      where: { id }
    })

    if (!existingProperty) {
      return NextResponse.json(
        { message: 'العقار غير موجود' },
        { status: 404 }
      )
    }

    if (existingProperty.userId !== decoded.userId) {
      return NextResponse.json(
        { message: 'غير مصرح بتعديل حالة هذا العقار' },
        { status: 403 }
      )
    }

    // تحديث حالة العقار فقط
    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: {
            favorites: true,
            inquiries: true,
          }
        }
      }
    })

    // تسجيل النشاط
    await logUserActivity({
      userId: decoded.userId,
      activityType: 'PROPERTY_UPDATE',
      entityType: 'PROPERTY',
      entityId: id,
      title: 'تحديث حالة عقار',
      description: `تم تحديث حالة العقار: ${existingProperty.title} إلى ${status}`,
      metadata: {
        propertyTitle: existingProperty.title,
        oldStatus: existingProperty.status,
        newStatus: status
      },
      request
    })

    return NextResponse.json({
      message: 'تم تحديث حالة العقار بنجاح',
      property: updatedProperty
    })

  } catch (error) {
    console.error('Error updating property status:', error)
    return NextResponse.json(
      { message: 'خطأ في تحديث حالة العقار' },
      { status: 500 }
    )
  }
}
