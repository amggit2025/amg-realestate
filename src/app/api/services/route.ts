import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

const MOCK_SERVICES = [
  {
    id: '1',
    slug: 'real-estate-brokerage',
    title: 'الوساطة العقارية',
    description: 'نقدم خدمات وساطة عقارية متكاملة للبيع والشراء والإيجار، مع ضمان أفضل الصفقات لعملائنا.',
    heroImage: '/images/services/brokerage.jpg',
    color: 'blue',
    iconName: 'BuildingOfficeIcon',
    featured: true,
    stats: { clients: '+500', projects: '+100' }
  },
  {
    id: '2',
    slug: 'construction-finishing',
    title: 'التشطيبات والمقاولات',
    description: 'تنفيذ كافة أعمال المقاولات والتشطيبات الداخلية والخارجية بأعلى معايير الجودة.',
    heroImage: '/images/services/construction.jpg',
    color: 'orange',
    iconName: 'WrenchScrewdriverIcon',
    featured: true,
    stats: { clients: '+200', projects: '+50' }
  },
  {
    id: '3',
    slug: 'interior-design',
    title: 'التصميم الداخلي',
    description: 'تصميمات عصرية وكلاسيكية تناسب جميع الأذواق، نحول مساحتك إلى تحفة فنية.',
    heroImage: '/images/services/interior.jpg',
    color: 'purple',
    iconName: 'PaintBrushIcon',
    featured: true,
    stats: { clients: '+150', projects: '+80' }
  },
  {
    id: '4',
    slug: 'property-management',
    title: 'إدارة الأملاك',
    description: 'نعتني بعقارك بالنيابة عنك، من الصيانة إلى التحصيل، لضمان أفضل عائد استثماري.',
    heroImage: '/images/services/management.jpg',
    color: 'green',
    iconName: 'HomeIcon',
    featured: false,
    stats: { clients: '+300', projects: '+120' }
  },
  {
    id: '5',
    slug: 'marketing',
    title: 'التسويق العقاري',
    description: 'خطط تسويقية مبتكرة للوصول إلى الجمهور المستهدف وتحقيق أسرع مبيعات.',
    heroImage: '/images/services/marketing.jpg',
    color: 'red',
    iconName: 'MegaphoneIcon',
    featured: false,
    stats: { clients: '+100', projects: '+200' }
  }
];

// GET /api/services - Public list of published services
export async function GET() {
  try {
    try {
      const services = await prisma.service.findMany({
        where: { published: true },
        orderBy: { order: 'asc' },
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          heroImage: true,
          color: true,
          iconName: true,
          featured: true,
          stats: true
        }
      });
      return NextResponse.json({ services });
    } catch (dbError) {
      console.error('Database connection failed, using mock data:', dbError);
      return NextResponse.json({ services: MOCK_SERVICES, source: 'mock' });
    }
  } catch (error) {
    console.error('Error fetching services:', error);
    // Fallback to mock data on any error
    return NextResponse.json({ services: MOCK_SERVICES, source: 'mock-fallback' });
  }
}
