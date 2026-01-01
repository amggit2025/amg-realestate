import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

const MOCK_SERVICES_DETAILS: any = {
  'real-estate-brokerage': {
    id: '1',
    slug: 'real-estate-brokerage',
    title: 'الوساطة العقارية',
    description: 'نقدم خدمات وساطة عقارية متكاملة للبيع والشراء والإيجار، مع ضمان أفضل الصفقات لعملائنا. نمتلك شبكة واسعة من العلاقات وقاعدة بيانات ضخمة للعقارات.',
    heroImage: '/images/services/brokerage.jpg',
    color: 'blue',
    iconName: 'BuildingOfficeIcon',
    stats: { clients: '+500', projects: '+100', satisfaction: '98%' },
    features: [
      { title: 'تقييم عقاري دقيق', description: 'نقدم تقييماً دقيقاً لسعر عقارك بناءً على دراسات السوق الحالية.' },
      { title: 'تسويق احترافي', description: 'نستخدم أحدث أدوات التسويق الرقمي للوصول إلى المشترين المحتملين.' },
      { title: 'إدارة المفاوضات', description: 'نتولى عنك عناء التفاوض للحصول على أفضل سعر وشروط.' },
      { title: 'إجراءات قانونية سليمة', description: 'نضمن سلامة جميع الإجراءات القانونية والعقود.' }
    ]
  },
  'construction-finishing': {
    id: '2',
    slug: 'construction-finishing',
    title: 'التشطيبات والمقاولات',
    description: 'تنفيذ كافة أعمال المقاولات والتشطيبات الداخلية والخارجية بأعلى معايير الجودة. نحول التصاميم إلى واقع ملموس بدقة واحترافية.',
    heroImage: '/images/services/construction.jpg',
    color: 'orange',
    iconName: 'WrenchScrewdriverIcon',
    stats: { clients: '+200', projects: '+50', satisfaction: '100%' },
    features: [
      { title: 'إشراف هندسي كامل', description: 'فريق من المهندسين المتخصصين للإشراف على كافة مراحل التنفيذ.' },
      { title: 'مواد عالية الجودة', description: 'نستخدم أفضل خامات التشطيب والبناء لضمان الاستدامة.' },
      { title: 'الالتزام بالمواعيد', description: 'نحترم جداولنا الزمنية ونسلم المشاريع في الوقت المحدد.' },
      { title: 'ضمان على الأعمال', description: 'نقدم ضماناً شاملاً على كافة أعمال التنفيذ والتشطيب.' }
    ]
  },
  'interior-design': {
    id: '3',
    slug: 'interior-design',
    title: 'التصميم الداخلي',
    description: 'تصميمات عصرية وكلاسيكية تناسب جميع الأذواق، نحول مساحتك إلى تحفة فنية تعكس شخصيتك وتلبي احتياجاتك.',
    heroImage: '/images/services/interior.jpg',
    color: 'purple',
    iconName: 'PaintBrushIcon',
    stats: { clients: '+150', projects: '+80', satisfaction: '99%' },
    features: [
      { title: 'تصاميم ثلاثية الأبعاد', description: 'نقدم تصوراً واقعياً للمساحة قبل البدء في التنفيذ.' },
      { title: 'استغلال المساحات', description: 'حلول ذكية لاستغلال كل ركن في منزلك أو مكتبك.' },
      { title: 'تنسيق الألوان والأثاث', description: 'نساعدك في اختيار الألوان وقطع الأثاث المتناسقة.' },
      { title: 'متابعة التنفيذ', description: 'نتابع تنفيذ التصميم لضمان مطابقته للواقع.' }
    ]
  },
  'property-management': {
    id: '4',
    slug: 'property-management',
    title: 'إدارة الأملاك',
    description: 'نعتني بعقارك بالنيابة عنك، من الصيانة إلى التحصيل، لضمان أفضل عائد استثماري وراحة بالك.',
    heroImage: '/images/services/management.jpg',
    color: 'green',
    iconName: 'HomeIcon',
    stats: { clients: '+300', projects: '+120', satisfaction: '97%' },
    features: [
      { title: 'تحصيل الإيجارات', description: 'نتابع تحصيل الإيجارات بانتظام ونودعها في حسابك.' },
      { title: 'صيانة دورية', description: 'نقوم بأعمال الصيانة الدورية للحفاظ على قيمة العقار.' },
      { title: 'إدارة المستأجرين', description: 'نتعامل مع شكاوى وطلبات المستأجرين باحترافية.' },
      { title: 'تقارير مالية', description: 'نقدم تقارير مالية دورية عن إيرادات ومصروفات العقار.' }
    ]
  },
  'marketing': {
    id: '5',
    slug: 'marketing',
    title: 'التسويق العقاري',
    description: 'خطط تسويقية مبتكرة للوصول إلى الجمهور المستهدف وتحقيق أسرع مبيعات لمشروعك العقاري.',
    heroImage: '/images/services/marketing.jpg',
    color: 'red',
    iconName: 'MegaphoneIcon',
    stats: { clients: '+100', projects: '+200', satisfaction: '95%' },
    features: [
      { title: 'حملات إعلانية ممولة', description: 'إدارة حملات إعلانية على منصات التواصل الاجتماعي وجوجل.' },
      { title: 'تصوير احترافي', description: 'جلسات تصوير وفيديو احترافية لإبراز جمال العقار.' },
      { title: 'هوية بصرية', description: 'تصميم هوية بصرية متكاملة لمشروعك العقاري.' },
      { title: 'تحليل السوق', description: 'دراسة المنافسين وتحديد الفئة المستهدفة بدقة.' }
    ]
  }
};

// GET /api/services/[slug] - Get single service by slug
export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    
    try {
      const service = await prisma.service.findUnique({
        where: { 
          slug: slug,
          published: true 
        },
        include: {
          portfolioItems: {
            where: { showInServiceGallery: true },
            include: { 
              images: {
                orderBy: { order: 'asc' }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (service) {
        return NextResponse.json({ service });
      }
    } catch (dbError) {
      console.error('Database error, falling back to mock:', dbError);
    }

    // Fallback to mock data
    const mockService = MOCK_SERVICES_DETAILS[slug];
    
    if (mockService) {
      return NextResponse.json({ service: mockService, source: 'mock' });
    }

    return NextResponse.json(
      { error: 'Service not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}
