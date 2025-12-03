import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// إنشاء Prisma client جديد مخصوص لهذا الـ route
const prisma = new PrismaClient()

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

// GET: عرض أعمال معرض الأعمال للزوار (الصفحة العامة)
export async function GET(request: NextRequest) {
  try {
    // تأكد من الاتصال بقاعدة البيانات
    await prisma.$connect()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    
    // @ts-ignore - مؤقتاً حتى يتم حل مشكلة Prisma Client
    const portfolioItems = await prisma.portfolioItem.findMany({
      where: {
        published: true, // فقط الأعمال المنشورة
        ...(category && category !== 'all' ? { category: category as any } : {}),
        ...(featured === 'true' ? { featured: true } : {})
      },
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: [
        { featured: 'desc' }, // المميزة أولاً
        { createdAt: 'desc' }  // ثم الأحدث
      ],
      ...(limit ? { take: parseInt(limit) } : {})
    })

    // تحويل البيانات للتوافق مع واجهة الموقع
    // @ts-ignore - مؤقتاً
    const formattedItems = portfolioItems.map((item: any) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      category: item.category.toLowerCase(),
      image: item.mainImage,
      images: item.images?.map((img: any) => img.url) || [item.mainImage],
      description: item.description,
      fullDescription: item.fullDescription,
      completionDate: item.completionDate,
      location: item.location,
      client: item.client,
      duration: item.duration,
      area: item.area,
      budget: item.budget,
      features: safeJsonParse(item.features, []),
      likes: item.likes,
      views: item.views,
      rating: item.rating,
      status: item.status.toLowerCase(),
      tags: safeJsonParse(item.tags, []),
      challenges: safeJsonParse(item.challenges, []),
      solutions: safeJsonParse(item.solutions, []),
      technologies: safeJsonParse(item.technologies, []),
      teamMembers: safeJsonParse(item.teamMembers, []),
      clientTestimonial: safeJsonParse(item.clientTestimonial, null),
      featured: item.featured
    }))

    return NextResponse.json({
      success: true,
      portfolioItems: formattedItems,
      count: formattedItems.length
    })
  } catch (error) {
    console.error('خطأ في جلب أعمال المعرض:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في جلب أعمال المعرض' },
      { status: 500 }
    )
  }
}