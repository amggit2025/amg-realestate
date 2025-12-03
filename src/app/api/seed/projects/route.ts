// Seed Projects API Route - إضافة مشاريع تجريبية
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ProjectType, ProjectStatus, Currency } from '@prisma/client'

const sampleProjects = [
  {
    title: 'كمبوند الياسمين الجديدة',
    description: 'كمبوند سكني راقي في قلب العاصمة الإدارية الجديدة يضم شقق ودوبلكس وفيلات بتصميمات عصرية ومساحات خضراء واسعة',
    location: 'العاصمة الإدارية الجديدة - الحي السكني الثالث',
    developer: 'AMG للتطوير العقاري',
    projectType: ProjectType.RESIDENTIAL,
    status: ProjectStatus.UNDER_CONSTRUCTION,
    totalUnits: 500,
    availableUnits: 120,
    minPrice: 2200000,
    maxPrice: 4500000,
    currency: Currency.EGP,
    deliveryDate: new Date('2025-12-31'),
    area: 150,
    bedrooms: 3,
    type: 'شقق سكنية',
    features: JSON.stringify([
      'مسابح خارجية',
      'حدائق ومناطق خضراء',
      'نادي رياضي متكامل',
      'أمن وحراسة 24 ساعة',
      'مول تجاري',
      'منطقة ألعاب أطفال',
      'مسارات للجري والمشي',
      'موقف سيارات مغطى'
    ]),
    specifications: JSON.stringify({
      'التشطيب': 'سوبر لوكس',
      'الارتفاع': '8 أدوار',
      'المساحة الإجمالية': '100 فدان',
      'عدد المباني': '20 مبنى'
    }),
    paymentPlan: JSON.stringify([
      { step: 1, description: 'مقدم', percentage: 15, amount: 0 },
      { step: 2, description: 'عند التعاقد', percentage: 10, amount: 0 },
      { step: 3, description: 'أقساط شهرية', percentage: 60, duration: '36 شهر' },
      { step: 4, description: 'عند الاستلام', percentage: 15, amount: 0 }
    ]),
    locationDetails: JSON.stringify({
      nearby: [
        'مطار العاصمة الإدارية - 15 دقيقة',
        'مول العاصمة - 10 دقائق', 
        'الحي الحكومي - 5 دقائق',
        'النادي الدبلوماسي - 8 دقائق'
      ]
    }),
    contactName: 'أحمد محمد',
    contactPhone: '+201234567890',
    contactEmail: 'projects@amgrealestate.com',
    featured: true,
    published: true
  },
  {
    title: 'ريزيدنس النخيل',
    description: 'مجمع فيلات فاخر في الشيخ زايد بتصميمات معمارية متميزة ومساحات واسعة وخدمات متكاملة',
    location: 'الشيخ زايد - الحي السادس عشر',
    developer: 'AMG للتطوير العقاري',
    projectType: ProjectType.RESIDENTIAL,
    status: ProjectStatus.COMPLETED,
    totalUnits: 80,
    availableUnits: 12,
    minPrice: 4800000,
    maxPrice: 8500000,
    currency: Currency.EGP,
    deliveryDate: new Date('2024-06-30'),
    area: 350,
    bedrooms: 4,
    type: 'فيلات',
    features: JSON.stringify([
      'حدائق خاصة',
      'مسبح خاص لكل فيلا',
      'جراج لسيارتين',
      'تكييف مركزي',
      'نظام أمان متطور',
      'تشطيبات إيطالية',
      'مصاعد داخلية',
      'روف مفتوح'
    ]),
    specifications: JSON.stringify({
      'التشطيب': 'إيطالي فاخر',
      'عدد الطوابق': '3 طوابق + روف',
      'المساحة الإجمالية': '50 فدان',
      'أسلوب المعمار': 'حديث ومعاصر'
    }),
    paymentPlan: JSON.stringify([
      { step: 1, description: 'مقدم', percentage: 20, amount: 0 },
      { step: 2, description: 'عند التعاقد', percentage: 15, amount: 0 },
      { step: 3, description: 'أقساط ربع سنوية', percentage: 50, duration: '24 شهر' },
      { step: 4, description: 'عند الاستلام', percentage: 15, amount: 0 }
    ]),
    locationDetails: JSON.stringify({
      nearby: [
        'مول مصر - 12 دقيقة',
        'نادي الشيخ زايد - 8 دقائق',
        'جامعة زويل - 15 دقيقة',
        'طريق الواحات - 5 دقائق'
      ]
    }),
    contactName: 'سارة أحمد',
    contactPhone: '+201234567891',
    contactEmail: 'villas@amgrealestate.com',
    featured: true,
    published: true
  },
  {
    title: 'تاور بيزنس العاصمة',
    description: 'برج إداري وتجاري متميز في العاصمة الإدارية الجديدة بموقع استراتيجي ووحدات مكتبية ومحلات تجارية',
    location: 'العاصمة الإدارية الجديدة - الحي المالي',
    developer: 'AMG للتطوير العقاري',
    projectType: ProjectType.COMMERCIAL,
    status: ProjectStatus.PLANNING,
    totalUnits: 200,
    availableUnits: 180,
    minPrice: 1500000,
    maxPrice: 5000000,
    currency: Currency.EGP,
    deliveryDate: new Date('2026-03-31'),
    area: 80,
    bedrooms: null,
    type: 'وحدات إدارية وتجارية',
    features: JSON.stringify([
      'لوبي فاخر',
      'مصاعد عالية السرعة',
      'نظام BMS ذكي',
      'مولد كهرباء احتياطي',
      'أنظمة إطفاء متطورة',
      'مواقف سيارات متعددة الطوابق',
      'كافيتيريا ومطاعم',
      'قاعات اجتماعات مشتركة'
    ]),
    specifications: JSON.stringify({
      'الارتفاع': '25 طابق',
      'نوع الوحدات': 'مكاتب ومحلات تجارية',
      'مساحة المكاتب': '40 - 200 متر',
      'مساحة المحلات': '25 - 100 متر'
    }),
    paymentPlan: JSON.stringify([
      { step: 1, description: 'حجز الوحدة', percentage: 10, amount: 0 },
      { step: 2, description: 'مقدم', percentage: 25, amount: 0 },
      { step: 3, description: 'أقساط شهرية', percentage: 50, duration: '48 شهر' },
      { step: 4, description: 'عند التسليم', percentage: 15, amount: 0 }
    ]),
    locationDetails: JSON.stringify({
      nearby: [
        'البنك المركزي الجديد - 5 دقائق',
        'البورصة المصرية الجديدة - 8 دقائق',
        'مجلس الوزراء - 10 دقائق',
        'محطة المونوريل - 3 دقائق'
      ]
    }),
    contactName: 'محمد عبدالله',
    contactPhone: '+201234567892',
    contactEmail: 'commercial@amgrealestate.com',
    featured: true,
    published: true
  }
]

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await prisma.$connect()

    // Clear existing projects if any
    await prisma.projectImage.deleteMany({})
    await prisma.project.deleteMany({})

    // Create projects
    const createdProjects = []
    for (const projectData of sampleProjects) {
      const project = await prisma.project.create({
        data: projectData
      })

      // Add sample images for each project
      await prisma.projectImage.createMany({
        data: [
          {
            projectId: project.id,
            url: '/images/placeholder.jpg',
            alt: `${project.title} - صورة رئيسية`,
            isMain: true,
            order: 1
          },
          {
            projectId: project.id,
            url: '/images/placeholder.jpg',
            alt: `${project.title} - صورة 2`,
            isMain: false,
            order: 2
          }
        ]
      })

      createdProjects.push(project)
    }

    return NextResponse.json({
      success: true,
      message: `تم إنشاء ${createdProjects.length} مشاريع بنجاح`,
      data: createdProjects.map(p => ({
        id: p.id,
        title: p.title,
        featured: p.featured
      }))
    })

  } catch (error) {
    console.error('Seed projects error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'خطأ في إنشاء المشاريع التجريبية',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })

  } finally {
    await prisma.$disconnect()
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'استخدم POST لإنشاء المشاريع التجريبية',
    instructions: 'قم بعمل POST request لـ /api/seed/projects لإضافة مشاريع تجريبية إلى قاعدة البيانات'
  })
}