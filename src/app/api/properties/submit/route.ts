import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import cloudinary from '@/lib/cloudinary'
import { requireAuth } from '@/lib/auth'
import { PropertyListingType, ListingPurpose, ListingServiceType } from '@prisma/client'

// Helper function to upload image to Cloudinary
async function uploadImageToCloudinary(file: File, folder: string = 'properties'): Promise<{ url: string; publicId: string }> {
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
    
    return {
      url: result.secure_url,
      publicId: result.public_id
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('فشل رفع الصورة')
  }
}

// Map form property types to PropertyListingType enum
const propertyTypeMap: Record<string, PropertyListingType> = {
  apartment: 'APARTMENT',
  villa: 'VILLA',
  townhouse: 'TOWNHOUSE',
  duplex: 'DUPLEX',
  penthouse: 'PENTHOUSE',
  land: 'LAND',
  office: 'OFFICE',
  shop: 'COMMERCIAL',
}

// Map service types
const serviceTypeMap: Record<string, ListingServiceType> = {
  marketing: 'MARKETING_ONLY',
  marketing_photo: 'MARKETING_AND_VISIT',
  valuation: 'VALUATION',
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication - user must be logged in
    const authResult = await requireAuth(request)
    
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      )
    }
    
    const user = authResult.user

    const formData = await request.formData()
    
    // Extract form fields
    const propertyType = formData.get('propertyType') as string
    const purpose = formData.get('purpose') as string
    const governorate = formData.get('governorate') as string
    const city = formData.get('city') as string
    const area = formData.get('area') as string
    const price = formData.get('price') as string
    const bedrooms = formData.get('bedrooms') as string
    const bathrooms = formData.get('bathrooms') as string
    const features = formData.get('features') as string
    const description = formData.get('description') as string
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const preferredTime = formData.get('preferredTime') as string
    const services = formData.get('services') as string

    // Validation
    if (!propertyType || !purpose || !city || !area || !price || !name || !phone || !email) {
      return NextResponse.json(
        { error: 'الرجاء ملء جميع الحقول المطلوبة' },
        { status: 400 }
      )
    }

    // Handle image uploads to Cloudinary
    const imageUrls: string[] = []
    const images = formData.getAll('images') as File[]

    for (const image of images) {
      if (image && image.size > 0) {
        try {
          const uploadResult = await uploadImageToCloudinary(image, 'properties')
          
          if (uploadResult.url) {
            imageUrls.push(uploadResult.url)
          }
        } catch (uploadError) {
          console.error('Image upload error:', uploadError)
          // Continue with other images even if one fails
        }
      }
    }

    // Parse features and services arrays
    const featuresArray = features ? JSON.parse(features) : []
    const servicesArray = services ? JSON.parse(services) : []
    
    // Get primary service type
    const primaryService = servicesArray[0] || 'marketing'

    // Create property listing request in database (NO USER REQUIRED!)
    const listingRequest = await prisma.propertyListingRequest.create({
      data: {
        // Property details
        propertyType: propertyTypeMap[propertyType] || 'APARTMENT',
        purpose: purpose === 'sale' ? 'SALE' : 'RENT',
        area: parseFloat(area),
        price: parseFloat(price),
        currency: 'EGP',
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        
        // Location
        governorate,
        city,
        district: city,
        address: `${city}, ${governorate}`,
        
        // Details
        description: description || `عقار ${propertyTypeMap[propertyType] || ''} في ${city}`,
        features: JSON.stringify({
          amenities: featuresArray,
          requestedServices: servicesArray,
        }),
        
        // Images
        images: JSON.stringify(imageUrls),
        
        // Owner contact info (from authenticated user)
        ownerName: name || `${user.firstName} ${user.lastName}`,
        ownerPhone: phone || user.phone || '',
        ownerEmail: email || user.email,
        preferredTime: preferredTime || null,
        
        // Service type
        serviceType: serviceTypeMap[primaryService] || 'MARKETING_ONLY',
        
        // Status
        status: 'PENDING',
      },
    })

    // Update with submittedBy using raw query (workaround for Prisma type issue)
    await prisma.$executeRaw`
      UPDATE property_listing_requests 
      SET submittedBy = ${user.id}
      WHERE id = ${listingRequest.id}
    `

    console.log(`✅ Property listing request created: ${listingRequest.id} by user ${user.id}`)

    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلبك بنجاح',
      data: {
        requestId: `AMG-${listingRequest.id.slice(0, 8).toUpperCase()}`,
        status: listingRequest.status,
        id: listingRequest.id,
      },
    })

  } catch (error) {
    console.error('Property submission error:', error)
    return NextResponse.json(
      { 
        error: 'حدث خطأ أثناء إرسال الطلب. الرجاء المحاولة مرة أخرى',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
