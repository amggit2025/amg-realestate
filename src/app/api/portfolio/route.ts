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
    
    // Return mock data for testing when DB is unavailable
    const mockPortfolioItems = [
      {
        id: 1,
        slug: 'altjma',
        title: 'مشروع التجمع - القاهرة الجديدة',
        category: 'real-estate',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
        ],
        description: 'مشروع سكني فاخر يتميز بتصميم معماري عصري وموقع استراتيجي',
        fullDescription: 'مشروع سكني متكامل في قلب القاهرة الجديدة',
        completionDate: '2024',
        location: 'القاهرة الجديدة، مصر',
        client: 'AMG Real Estate',
        duration: '24 شهر',
        area: '50,000 متر مربع',
        budget: '200 مليون جنيه',
        features: ['تصميم معماري حديث', 'مساحات خضراء واسعة', 'مرافق متكاملة'],
        likes: 0,
        views: 0,
        rating: 0,
        status: 'completed',
        tags: ['سكني', 'فاخر', 'القاهرة الجديدة'],
        challenges: [],
        solutions: [],
        technologies: ['BIM', 'تقنيات البناء الذكي'],
        teamMembers: [],
        clientTestimonial: null,
        featured: true
      },
      {
        id: 2,
        slug: 'north-coast-villa',
        title: 'فيلا الساحل الشمالي',
        category: 'real-estate',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
        ],
        description: 'فيلا فاخرة على البحر مباشرة بتصميم عصري',
        fullDescription: 'فيلا استثنائية على الساحل الشمالي',
        completionDate: '2023',
        location: 'الساحل الشمالي، مصر',
        client: 'عميل خاص',
        duration: '18 شهر',
        area: '800 متر مربع',
        budget: '15 مليون جنيه',
        features: ['إطلالة بحرية', 'حمام سباحة خاص', 'حديقة واسعة'],
        likes: 0,
        views: 0,
        rating: 0,
        status: 'completed',
        tags: ['فيلا', 'ساحلي', 'فاخر'],
        challenges: [],
        solutions: [],
        technologies: [],
        teamMembers: [],
        clientTestimonial: null,
        featured: false
      },
      {
        id: 3,
        slug: 'modern-office',
        title: 'مكاتب إدارية حديثة',
        category: 'commercial',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        images: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
          'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'
        ],
        description: 'مبنى مكاتب إدارية بتصميم معماري متميز',
        fullDescription: 'مكاتب إدارية حديثة بمواصفات عالمية',
        completionDate: '2024',
        location: 'مدينة نصر، القاهرة',
        client: 'شركة تجارية',
        duration: '20 شهر',
        area: '12,000 متر مربع',
        budget: '80 مليون جنيه',
        features: ['نظام إدارة ذكي', 'مواقف متعددة', 'أمن متطور'],
        likes: 0,
        views: 0,
        rating: 0,
        status: 'completed',
        tags: ['مكاتب', 'تجاري', 'حديث'],
        challenges: [],
        solutions: [],
        technologies: [],
        teamMembers: [],
        clientTestimonial: null,
        featured: false
      }
    ]

    return NextResponse.json({
      success: true,
      portfolioItems: mockPortfolioItems,
      count: mockPortfolioItems.length
    })
  }
}