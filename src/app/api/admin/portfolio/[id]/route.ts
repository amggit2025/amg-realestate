import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { deleteImageFromCloudinary, deleteMultipleImagesFromCloudinary } from '@/lib/cloudinary-helper'

// دالة مساعدة لتحليل JSON بأمان
function safeJsonParse(jsonString: any, defaultValue: any) {
  if (!jsonString) return defaultValue
  
  try {
    // إذا كان البيانات بالفعل object، ارجعها كما هي
    if (typeof jsonString === 'object') return jsonString
    
    // إذا كان string، حاول تحليلها كـ JSON
    if (typeof jsonString === 'string') {
      // تحقق إذا كانت تبدو كـ JSON (تبدأ بـ [ أو {)
      if (jsonString.trim().startsWith('[') || jsonString.trim().startsWith('{')) {
        return JSON.parse(jsonString)
      } else {
        // إذا كانت نص عادي، اجعلها array مع عنصر واحد
        return jsonString.trim() ? [jsonString.trim()] : defaultValue
      }
    }
    
    return defaultValue
  } catch (error) {
    console.error('خطأ في تحليل JSON:', error)
    // في حالة الخطأ، تعامل مع النص كعنصر واحد
    return typeof jsonString === 'string' && jsonString.trim() ? [jsonString.trim()] : defaultValue
  }
}

// GET: عرض عمل واحد
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // @ts-ignore - مؤقتاً حتى يتم إعادة توليد Prisma Client
    const portfolioItem = await prisma.portfolioItem.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!portfolioItem) {
      return NextResponse.json(
        { success: false, message: 'العمل غير موجود' },
        { status: 404 }
      )
    }

    // تحويل البيانات للتوافق مع نموذج التعديل
    const formattedItem = {
      id: portfolioItem.id,
      slug: portfolioItem.slug,
      title: portfolioItem.title,
      description: portfolioItem.description,
      fullDescription: portfolioItem.fullDescription || '',
      category: portfolioItem.category,
      location: portfolioItem.location,
      client: portfolioItem.client,
      duration: portfolioItem.duration || '',
      area: portfolioItem.area || '',
      budget: portfolioItem.budget || '',
      completionDate: portfolioItem.completionDate || '',
      mainImage: portfolioItem.mainImage,
      mainImagePublicId: portfolioItem.mainImagePublicId || '',
      features: safeJsonParse(portfolioItem.features, ['']),
      tags: safeJsonParse(portfolioItem.tags, ['']),
      challenges: safeJsonParse(portfolioItem.challenges, ['']),
      solutions: safeJsonParse(portfolioItem.solutions, ['']),
      technologies: safeJsonParse(portfolioItem.technologies, ['']),
      teamMembers: safeJsonParse(portfolioItem.teamMembers, ['']),
      clientTestimonial: safeJsonParse(portfolioItem.clientTestimonial, {
          comment: '',
          rating: 5,
          clientName: '',
          clientTitle: ''
        }),
      published: portfolioItem.published,
      featured: portfolioItem.featured,
      serviceId: portfolioItem.serviceId || '',
      showInServiceGallery: portfolioItem.showInServiceGallery || false,
      projectId: portfolioItem.projectId || '',
      showInProject: portfolioItem.showInProject || false,
      images: portfolioItem.images?.map((img: any) => ({
        id: img.id,
        url: img.url,
        publicId: img.publicId,
        order: img.order
      })) || []
    }

    return NextResponse.json({
      success: true,
      portfolioItem: formattedItem
    })
  } catch (error) {
    console.error('❌ خطأ في جلب العمل:', error)
    console.error('تفاصيل الخطأ:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'حدث خطأ في جلب العمل. يرجى المحاولة مرة أخرى.',
        message: 'حدث خطأ في جلب العمل' 
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    )
  }
}

// PATCH: تحديث عمل
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    console.log('🔄 PATCH request for portfolio ID:', id)
    console.log('📋 Request body:', body)

    // إذا كان الطلب لتحديث published أو featured فقط
    if (Object.keys(body).length <= 2 && (body.hasOwnProperty('published') || body.hasOwnProperty('featured'))) {
      console.log('🔄 Quick toggle request')
      
      // @ts-ignore
      const updatedPortfolioItem = await prisma.portfolioItem.update({
        where: { id },
        data: {
          ...(body.hasOwnProperty('published') && { published: body.published }),
          ...(body.hasOwnProperty('featured') && { featured: body.featured })
        }
      })

      return NextResponse.json({
        success: true,
        message: 'تم تحديث الحالة بنجاح',
        portfolioItem: updatedPortfolioItem
      })
    }

    // للتحديث الكامل
    const {
      title,
      slug,
      description,
      fullDescription,
      category,
      location,
      client,
      duration,
      area,
      budget,
      completionDate,
      mainImage,
      mainImagePublicId,
      features,
      tags,
      challenges,
      solutions,
      technologies,
      teamMembers,
      clientTestimonial,
      published = true,
      featured = false,
      serviceId,
      showInServiceGallery = false,
      projectId,
      showInProject = false
    } = body

    // التحقق من الحقول المطلوبة للتحديث الكامل
    if (!title || !slug || !description || !category || !location || !client) {
      return NextResponse.json(
        { success: false, message: 'جميع الحقول المطلوبة يجب أن تكون مملوءة' },
        { status: 400 }
      )
    }

    // 🗑️ جلب العمل القديم لحذف الصورة الرئيسية إذا تغيرت
    // @ts-ignore
    const existingItem = await prisma.portfolioItem.findUnique({
      where: { id }
    })

    if (!existingItem) {
      return NextResponse.json(
        { success: false, message: 'العمل غير موجود' },
        { status: 404 }
      )
    }

    // حذف الصورة القديمة من Cloudinary إذا تم تحديث الصورة الرئيسية
    if (mainImagePublicId && mainImagePublicId !== existingItem.mainImagePublicId && existingItem.mainImagePublicId) {
      await deleteImageFromCloudinary(existingItem.mainImagePublicId)
      console.log('🗑️ تم حذف الصورة الرئيسية القديمة للعمل من Cloudinary')
    }

    // التحقق من تفرد الـ slug (عدم تعارض مع أعمال أخرى)
    // @ts-ignore
    const slugCheck = await prisma.portfolioItem.findFirst({
      where: { 
        slug,
        id: { not: id } // استبعاد العمل الحالي
      }
    })

    if (slugCheck) {
      return NextResponse.json(
        { success: false, message: 'يوجد عمل آخر بنفس الـ slug بالفعل' },
        { status: 400 }
      )
    }

    // تحديث العمل
    // @ts-ignore
    const updatedPortfolioItem = await prisma.portfolioItem.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        fullDescription,
        category,
        location,
        client,
        duration,
        area,
        budget,
        completionDate,
        mainImage,
        mainImagePublicId: mainImagePublicId || null,
        features: features ? features : undefined,
        tags: tags ? tags : undefined,
        challenges: challenges ? challenges : undefined,
        solutions: solutions ? solutions : undefined,
        technologies: technologies ? technologies : undefined,
        teamMembers: teamMembers ? teamMembers : undefined,
        clientTestimonial: clientTestimonial ? clientTestimonial : undefined,
        published,
        featured,
        serviceId: serviceId || null,
        showInServiceGallery,
        projectId: projectId || null,
        showInProject
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث العمل بنجاح',
      portfolioItem: updatedPortfolioItem
    })
  } catch (error) {
    console.error('❌ خطأ في تحديث العمل:', error)
    console.error('تفاصيل الخطأ:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    let errorMessage = 'حدث خطأ في تحديث العمل. يرجى المحاولة مرة أخرى.'
    let statusCode = 500
    
    if (error instanceof Error) {
      if (error.message.includes('validation')) {
        errorMessage = 'البيانات المدخلة غير صحيحة. يرجى التحقق من البيانات والمحاولة مرة أخرى.'
        statusCode = 400
      } else if (error.message.includes('unique constraint')) {
        errorMessage = 'يوجد عمل آخر بنفس الاسم أو الرابط بالفعل.'
        statusCode = 409
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        message: errorMessage 
      },
      { 
        status: statusCode,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    )
  }
}

// PUT: تحديث عمل (نفس PATCH للتوافق)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // استدعاء نفس منطق PATCH
  return PATCH(request, { params })
}

// DELETE: حذف عمل مع حذف الصور من Cloudinary
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // تأكد من الاتصال بقاعدة البيانات
    await prisma.$connect()
    
    const { id } = await params

    // جلب العمل مع الصور لحذفها من Cloudinary
    // @ts-ignore
    const portfolioItem = await prisma.portfolioItem.findUnique({
      where: { id },
      include: { images: true }
    })

    if (!portfolioItem) {
      return NextResponse.json(
        { success: false, message: 'العمل غير موجود' },
        { status: 404 }
      )
    }

    // 🗑️ جمع كل الصور (الرئيسية + المعرض) لحذفها من Cloudinary
    const imagesToDelete: string[] = []
    
    if (portfolioItem.mainImagePublicId) {
      imagesToDelete.push(portfolioItem.mainImagePublicId)
    }
    
    const galleryPublicIds = portfolioItem.images
      .map(img => img.publicId)
      .filter((id): id is string => Boolean(id))
    
    imagesToDelete.push(...galleryPublicIds)

    // حذف جميع الصور من Cloudinary
    if (imagesToDelete.length > 0) {
      const deletedCount = await deleteMultipleImagesFromCloudinary(imagesToDelete)
      console.log(`🗑️ تم حذف ${deletedCount} صور للعمل من Cloudinary`)
    }

    // حذف العمل من قاعدة البيانات (الصور ستُحذف تلقائياً بسبب Cascade)
    // @ts-ignore
    await prisma.portfolioItem.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف العمل بنجاح من قاعدة البيانات و Cloudinary'
    })
  } catch (error) {
    console.error('❌ خطأ في حذف العمل:', error)
    console.error('تفاصيل الخطأ:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'حدث خطأ في حذف العمل. يرجى المحاولة مرة أخرى.',
        message: 'حدث خطأ في حذف العمل' 
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    )
  }
}