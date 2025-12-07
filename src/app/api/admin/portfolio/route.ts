import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// إنشاء Prisma client جديد مخصوص لهذا الـ route
const prisma = new PrismaClient()

// GET: عرض جميع الأعمال
export async function GET(request: NextRequest) {
  try {
    // تأكد من الاتصال بقاعدة البيانات
    await prisma.$connect()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const published = searchParams.get('published')
    
    const portfolioItems = await prisma.portfolioItem.findMany({
      where: {
        ...(category && category !== 'all' ? { category: category as any } : {}),
        ...(published ? { published: published === 'true' } : {})
      },
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      portfolioItems
    })
  } catch (error) {
    console.error('خطأ في جلب الأعمال:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في جلب الأعمال' },
      { status: 500 }
    )
  }
}

// POST: إضافة عمل جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
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

    // التحقق من الحقول المطلوبة
    if (!title || !slug || !description || !category || !location || !client) {
      return NextResponse.json(
        { success: false, message: 'جميع الحقول المطلوبة يجب أن تكون مملوءة' },
        { status: 400 }
      )
    }

    // التحقق من تفرد الـ slug
    // @ts-ignore - مؤقتاً حتى يتم إعادة توليد Prisma Client
    const existingItem = await prisma.portfolioItem.findUnique({
      where: { slug }
    })

    if (existingItem) {
      return NextResponse.json(
        { success: false, message: 'يوجد عمل بنفس الـ slug بالفعل' },
        { status: 400 }
      )
    }

    // إنشاء العمل الجديد
    // @ts-ignore - مؤقتاً حتى يتم إعادة توليد Prisma Client
    const portfolioItem = await prisma.portfolioItem.create({
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
      message: 'تم إضافة العمل بنجاح',
      portfolioItem
    })
  } catch (error) {
    console.error('خطأ في إضافة العمل:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في إضافة العمل' },
      { status: 500 }
    )
  }
}