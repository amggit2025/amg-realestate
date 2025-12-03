import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// إضافة أعمال تجريبية لمعرض الأعمال
export async function POST(request: NextRequest) {
  try {
    // أعمال تجريبية
    const samplePortfolioItems = [
      {
        slug: 'villa-construction-new-cairo',
        title: 'بناء فيلا فاخرة - القاهرة الجديدة',
        description: 'مشروع إنشاء فيلا فاخرة على الطراز المعاصر بمساحة 500 متر مربع في قلب القاهرة الجديدة مع جميع وسائل الراحة العصرية.',
        fullDescription: 'مشروع متكامل لإنشاء فيلا فاخرة في منطقة راقية بالقاهرة الجديدة. يتضمن المشروع 4 غرف نوم رئيسية، 5 حمامات، صالة استقبال كبيرة، مطبخ عصري، حديقة خاصة مع مسبح، وجراج لسيارتين. تم استخدام أفضل مواد البناء وأحدث التقنيات في التصميم والتنفيذ.',
        category: 'CONSTRUCTION' as const,
        location: 'القاهرة الجديدة - التجمع الأول',
        client: 'عائلة محمد أحمد',
        duration: '14 شهر',
        area: '500 م²',
        budget: '3.2 مليون جنيه',
        completionDate: 'يناير 2024',
        mainImage: '/images/portfolio/construction.jpg',
        features: ['4 غرف نوم', 'حديقة خاصة', 'مسبح', 'جراج مغطى', 'نظام أمان متطور', 'تكييف مركزي'],
        tags: ['فيلا', 'سكني', 'فاخر', 'حديث', 'القاهرة الجديدة'],
        challenges: ['التضاريس المعقدة للأرض', 'التوفيق بين التصميم الحديث والكلاسيكي', 'إنجاز المشروع في الموعد المحدد رغم الظروف الجوية'],
        solutions: ['استخدام تقنيات الأساسات المتطورة', 'تطوير تصميم معماري مبتكر يجمع بين الطرازين', 'تنظيم دقيق لمراحل العمل وفريق عمل محترف'],
        technologies: ['BIM Technology', 'Smart Home Systems', 'Eco-friendly Materials', 'Solar Energy Integration'],
        teamMembers: ['م. أحمد السيد - مدير المشروع', 'م. سارة علي - مهندس تصميم', 'أ. محمد رضا - مقاول عام', 'م. فاطمة حسن - مهندس كهرباء'],
        clientTestimonial: {
          comment: 'تجربة رائعة مع AMG العقارية. الجودة عالية والالتزام بالمواعيد مثالي. فريق العمل محترف جداً وتعامل راقي. أنصح بشدة بالتعامل معهم.',
          rating: 5,
          clientName: 'محمد أحمد',
          clientTitle: 'رب الأسرة'
        },
        likes: 156,
        views: 892,
        rating: 4.8,
        featured: true,
        published: true
      },
      {
        slug: 'apartment-finishing-nasr-city',
        title: 'تشطيب شقة عصرية - مدينة نصر',
        description: 'مشروع تشطيب شقة سكنية بمساحة 180 متر مربع على الطراز العصري مع استخدام أجود الخامات والألوان المتناسقة.',
        fullDescription: 'مشروع تشطيب متكامل لشقة سكنية في موقع متميز بمدينة نصر. يشمل المشروع التشطيبات الداخلية الفاخرة، تركيب أرضيات باركية عالية الجودة، دهانات عصرية، إضاءة LED ذكية، وتصميم ديكورات داخلية أنيقة تناسب الذوق العصري.',
        category: 'FINISHING' as const,
        location: 'مدينة نصر - شارع مكرم عبيد',
        client: 'أسرة سامح خالد',
        duration: '6 أشهر',
        area: '180 م²',
        budget: '850 ألف جنيه',
        completionDate: 'أكتوبر 2023',
        mainImage: '/images/portfolio/project-2.jpg',
        features: ['باركيه طبيعي', 'إضاءة LED', 'دهانات عصرية', 'سيراميك إيطالي', 'أسقف جبسية', 'تكييفات سبليت'],
        tags: ['تشطيب', 'شقة', 'عصري', 'فاخر', 'مدينة نصر'],
        challenges: ['المساحات الضيقة في بعض الغرف', 'التوفيق بين رغبات أفراد الأسرة المختلفة', 'العمل في شقة مأهولة'],
        solutions: ['تصميم أثاث مدمج لتوفير المساحة', 'عقد جلسات تصميم مع جميع أفراد الأسرة', 'تنظيم العمل في أوقات محددة لتقليل الإزعاج'],
        technologies: ['3D Design Software', 'Smart Lighting Systems', 'Acoustic Materials'],
        teamMembers: ['م. هدى محمد - مصمم داخلي', 'أ. كريم صلاح - مقاول تشطيبات', 'فني محمود علي - كهربائي'],
        clientTestimonial: {
          comment: 'النتيجة فاقت توقعاتنا بكثير. التصميم رائع والتنفيذ احترافي. الشقة أصبحت تحفة فنية حقيقية.',
          rating: 4.9,
          clientName: 'سامح خالد',
          clientTitle: 'صاحب الشقة'
        },
        likes: 203,
        views: 1247,
        rating: 4.7,
        featured: true,
        published: true
      },
      {
        slug: 'kitchen-design-zamalek',
        title: 'تصميم مطبخ عصري - الزمالك',
        description: 'تصميم وتنفيذ مطبخ عصري بمساحة 25 متر مربع مع استخدام أحدث الأجهزة والخامات عالية الجودة.',
        fullDescription: 'مشروع تصميم مطبخ فاخر في شقة بالزمالك. يتضمن المشروع تصميم وحدات تخزين ذكية، جزيرة مطبخ وسطية، استخدام رخام طبيعي للأسطح، تركيب أجهزة كهربائية من أفضل الماركات العالمية، وإضاءة موزعة بعناية لخلق أجواء مثالية للطبخ.',
        category: 'KITCHENS' as const,
        location: 'الزمالك - شارع البرازيل',
        client: 'د. منى عبدالله',
        duration: '3 أشهر',
        area: '25 م²',
        budget: '320 ألف جنيه',
        completionDate: 'ديسمبر 2023',
        mainImage: '/images/portfolio/project-3.jpg',
        features: ['جزيرة مطبخ', 'رخام طبيعي', 'أجهزة ألمانية', 'إضاءة LED', 'تهوية قوية', 'تصميم ذكي'],
        tags: ['مطبخ', 'عصري', 'فاخر', 'زمالك', 'تصميم ذكي'],
        challenges: ['المساحة المحدودة', 'التهوية في المطابخ المغلقة', 'دمج التصميم مع باقي الشقة'],
        solutions: ['استغلال أمثل للمساحة العمودية', 'نظام تهوية متطور ومروحة شفط قوية', 'اختيار ألوان ومواد متناسقة مع التصميم العام'],
        technologies: ['Smart Storage Solutions', 'Advanced Ventilation Systems', 'Touch Control Appliances'],
        teamMembers: ['م. ريم أحمد - مصمم مطابخ', 'أ. عمر حسن - نجار أثاث', 'فني أحمد سعد - سباك'],
        clientTestimonial: {
          comment: 'المطبخ أصبح قلب البيت الحقيقي. التصميم عملي جداً والتنفيذ متقن. شكراً لفريق AMG المميز.',
          rating: 5,
          clientName: 'د. منى عبدالله',
          clientTitle: 'طبيبة أسنان'
        },
        likes: 178,
        views: 734,
        rating: 4.9,
        featured: false,
        published: true
      }
    ]

    // إضافة الأعمال لقاعدة البيانات
    let addedCount = 0
    for (const item of samplePortfolioItems) {
      try {
        // التحقق من عدم وجود العمل مسبقاً
        // @ts-ignore - مؤقتاً حتى يتم إعادة توليد Prisma Client
        const existing = await prisma.portfolioItem.findUnique({
          where: { slug: item.slug }
        })

        if (!existing) {
          // @ts-ignore - مؤقتاً حتى يتم إعادة توليد Prisma Client
          await prisma.portfolioItem.create({
            data: {
              ...item,
              features: JSON.stringify(item.features),
              tags: JSON.stringify(item.tags),
              challenges: JSON.stringify(item.challenges),
              solutions: JSON.stringify(item.solutions),
              technologies: JSON.stringify(item.technologies),
              teamMembers: JSON.stringify(item.teamMembers),
              clientTestimonial: JSON.stringify(item.clientTestimonial)
            }
          })
          addedCount++
        }
      } catch (error) {
        console.error(`خطأ في إضافة العمل ${item.title}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `تم إضافة ${addedCount} أعمال تجريبية بنجاح`,
      count: addedCount
    })
  } catch (error) {
    console.error('خطأ في إضافة الأعمال التجريبية:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في إضافة الأعمال التجريبية' },
      { status: 500 }
    )
  }
}