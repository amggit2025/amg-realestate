import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { PortfolioCategory } from '@prisma/client'

export async function GET() {
  try {
    await prisma.$connect()
    
    // إنشاء بيانات تجريبية لمعرض الأعمال
    const portfolioData = [
      {
        slug: 'villa-new-cairo-luxury',
        title: 'فيلا فاخرة - القاهرة الجديدة',
        description: 'تصميم وتنفيذ فيلا عصرية فاخرة بمساحة 500 متر مربع مع حديقة خاصة ومسبح',
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
        featured: true,
        published: true
      },
      {
        slug: 'commercial-complex-admin-capital',
        title: 'مجمع تجاري - العاصمة الإدارية',
        description: 'تطوير مجمع تجاري متكامل في العاصمة الإدارية الجديدة بمساحة 2000 متر مربع',
        category: PortfolioCategory.CONSTRUCTION,
        location: 'العاصمة الإدارية الجديدة',
        client: 'شركة الرواد للتطوير العقاري',
        duration: '14 شهر',
        area: '2000 متر مربع',
        budget: '15,000,000 جنيه',
        completionDate: '2024',
        mainImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        likes: 298,
        views: 4150,
        rating: 4.8,
        featured: true,
        published: true
      },
      {
        slug: 'apartment-finishing-zamalek',
        title: 'تشطيب شقة دوبلكس - الزمالك',
        description: 'تشطيب داخلي فاخر لشقة دوبلكس في قلب الزمالك بمساحة 300 متر مربع',
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
        featured: true,
        published: true
      }
    ]
    
    // إدراج البيانات
    const createdItems = []
    for (const item of portfolioData) {
      const created = await prisma.portfolioItem.create({ data: item })
      createdItems.push(created)
    }
    
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