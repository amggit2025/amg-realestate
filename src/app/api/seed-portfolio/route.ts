import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { PortfolioCategory } from '@prisma/client'

export async function POST() {
  try {
    await prisma.$connect()
    
    // التحقق من وجود عناصر في المعرض
    const existingItems = await prisma.portfolioItem.count()
    
    if (existingItems > 0) {
      return NextResponse.json({
        success: true,
        message: 'يوجد بالفعل عناصر في معرض الأعمال',
        count: existingItems
      })
    }
    
    // إنشاء بيانات تجريبية لمعرض الأعمال
    const portfolioData = [
      {
        slug: 'villa-new-cairo-luxury',
        title: 'فيلا فاخرة - القاهرة الجديدة',
        description: 'تصميم وتنفيذ فيلا عصرية فاخرة بمساحة 500 متر مربع مع حديقة خاصة ومسبح',
        fullDescription: 'هذا المشروع يتضمن تصميم وتنفيذ فيلا فاخرة في قلب القاهرة الجديدة، تتميز بالتصميم العصري والمواد عالية الجودة مع مساحات واسعة وحديقة خاصة.',
        category: PortfolioCategory.CONSTRUCTION,
        location: 'القاهرة الجديدة - التجمع الخامس',
        client: 'عائلة أحمد محمد',
        duration: '8 أشهر',
        area: '500 متر مربع',
        budget: '3,500,000 جنيه',
        completionDate: '2024',
        mainImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
        likes: 156,
        views: 2340,
        rating: 4.9,
        features: JSON.stringify(['مسبح خاص', 'حديقة', 'جراج لسيارتين', 'غرف نوم 4', 'تكييف مركزي']),
        tags: JSON.stringify(['فيلا', 'سكني', 'فاخر', 'حديث']),
        featured: true,
        published: true
      },
      {
        slug: 'commercial-complex-admin-capital',
        title: 'مجمع تجاري - العاصمة الإدارية',
        description: 'تطوير مجمع تجاري متكامل في العاصمة الإدارية الجديدة بمساحة 2000 متر مربع',
        fullDescription: 'مشروع طموح لتطوير مجمع تجاري حديث يضم محلات تجارية ومكاتب إدارية ومطاعم في موقع استراتيجي بالعاصمة الإدارية الجديدة.',
        category: PortfolioCategory.CONSTRUCTION,
        location: 'العاصمة الإدارية الجديدة - الحي المالي',
        client: 'شركة الرواد للتطوير العقاري',
        duration: '14 شهر',
        area: '2000 متر مربع',
        budget: '15,000,000 جنيه',
        completionDate: '2024',
        mainImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        likes: 298,
        views: 4150,
        rating: 4.8,
        features: JSON.stringify(['محلات تجارية', 'مكاتب إدارية', 'مطاعم', 'جراج متعدد الطوابق', 'أنظمة أمان حديثة']),
        tags: JSON.stringify(['تجاري', 'مجمع', 'استثمار', 'حديث']),
        featured: true,
        published: true
      },
      {
        slug: 'apartment-finishing-zamalek',
        title: 'تشطيب شقة دوبلكس - الزمالك',
        description: 'تشطيب داخلي فاخر لشقة دوبلكس في قلب الزمالك بمساحة 300 متر مربع',
        fullDescription: 'مشروع تشطيب داخلي متميز لشقة دوبلكس في أرقى أحياء القاهرة، يتميز بالذوق الرفيع والمواد الفاخرة والتصميم العصري.',
        category: PortfolioCategory.FINISHING,
        location: 'الزمالك - وسط القاهرة',
        client: 'الدكتور محمد عبدالرحمن',
        duration: '6 أشهر',
        area: '300 متر مربع',
        budget: '2,200,000 جنيه',
        completionDate: '2023',
        mainImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
        likes: 187,
        views: 2890,
        rating: 4.7,
        features: JSON.stringify(['تشطيب فاخر', 'إضاءة ذكية', 'مطبخ إيطالي', 'باركيه طبيعي', 'دهانات عالية الجودة']),
        tags: JSON.stringify(['تشطيب', 'دوبلكس', 'فاخر', 'داخلي']),
        featured: true,
        published: true
      }
    ]
    
    // إدراج البيانات
    const createdItems = await Promise.all(
      portfolioData.map(item => 
        prisma.portfolioItem.create({ data: item })
      )
    )
    
    return NextResponse.json({
      success: true,
      message: 'تم إنشاء البيانات التجريبية بنجاح',
      created: createdItems.length,
      items: createdItems
    })
    
  } catch (error) {
    console.error('Error creating portfolio data:', error)
    return NextResponse.json({
      success: false,
      message: 'خطأ في إنشاء البيانات التجريبية',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'استخدم POST لإنشاء البيانات التجريبية',
    endpoint: '/api/seed-portfolio'
  })
}