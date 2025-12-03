import { 
  HomeIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
  CubeTransparentIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline'
import { PortfolioProject, PortfolioCategory } from '@/types/portfolio'

// تصنيفات المشاريع
export const portfolioCategories: PortfolioCategory[] = [
  { 
    id: 'construction', 
    name: 'التشييد والبناء', 
    description: 'مشاريع البناء والإنشاءات السكنية والتجارية',
    icon: WrenchScrewdriverIcon,
    color: 'orange'
  },
  { 
    id: 'finishing', 
    name: 'التشطيبات الداخلية', 
    description: 'أعمال التشطيب والديكور الداخلي',
    icon: PaintBrushIcon,
    color: 'purple'
  },
  { 
    id: 'furniture', 
    name: 'الأثاث والديكور', 
    description: 'تصميم وتنفيذ الأثاث المخصص',
    icon: CubeTransparentIcon,
    color: 'red'
  },
  { 
    id: 'kitchens', 
    name: 'المطابخ', 
    description: 'تصميم وتنفيذ المطابخ العصرية',
    icon: BuildingOffice2Icon,
    color: 'green'
  }
]

// بيانات المشاريع المركزية
export const portfolioProjects: PortfolioProject[] = [
  {
    id: 1,
    slug: 'villa-new-cairo',
    title: 'فيلا فاخرة - القاهرة الجديدة',
    category: 'construction',
    image: '/images/portfolio/construction.jpg',
    images: [
      '/images/portfolio/construction.jpg',
      '/images/portfolio/finishing.jpg',
      '/images/portfolio/kitchens.jpg',
      '/images/portfolio/furniture.jpg'
    ],
    description: 'تشييد وبناء فيلا فاخرة بمساحة 500 متر مربع مع تصميم معماري مميز',
    fullDescription: 'مشروع متكامل لتشييد فيلا فاخرة في قلب القاهرة الجديدة، يجمع بين الطراز المعماري الحديث والتصميم الكلاسيكي الأنيق. تم تنفيذ المشروع على أعلى المعايير الهندسية العالمية مع استخدام أفضل مواد البناء وأحدث التقنيات في مجال الإنشاء.',
    completionDate: '2024',
    location: 'القاهرة الجديدة - التجمع الأول',
    client: 'عائلة أحمد محمود',
    duration: '18 شهر',
    area: '500 م²',
    budget: '2.5 مليون جنيه',
    features: ['3 طوابق', 'حديقة خاصة', 'مسبح', 'جراج مغطى', 'نظام أمان', 'تكييف مركزي'],
    likes: 245,
    views: 1250,
    rating: 4.9,
    status: 'completed',
    tags: ['فيلا', 'سكني', 'فاخر', 'حديث'],
    challenges: [
      'التضاريس المعقدة للأرض',
      'التوفيق بين التصميم الحديث والكلاسيكي',
      'إنجاز المشروع في الموعد المحدد'
    ],
    solutions: [
      'استخدام تقنيات الأساسات المتطورة',
      'تطوير تصميم معماري مبتكر',
      'تنظيم دقيق لمراحل العمل'
    ],
    technologies: ['BIM Technology', 'Smart Home Systems', 'Eco-friendly Materials'],
    teamMembers: ['م. أحمد السيد - مدير المشروع', 'م. سارة علي - مهندس تصميم', 'أ. محمد رضا - مقاول'],
    clientTestimonial: {
      comment: 'تجربة رائعة مع AMG العقارية. الجودة عالية والالتزام بالمواعيد مثالي. فريق العمل محترف جداً وتعامل راقي. أنصح بشدة بالتعامل معهم.',
      rating: 5,
      clientName: 'أحمد محمود',
      clientTitle: 'رب الأسرة'
    },
    relatedProjects: [5, 7, 10]
  },
  {
    id: 2,
    slug: 'apartment-nasr-city',
    title: 'تشطيب شقة مودرن - مدينة نصر',
    category: 'finishing',
    image: '/images/portfolio/finishing.jpg',
    images: [
      '/images/portfolio/finishing.jpg',
      '/images/portfolio/furniture.jpg',
      '/images/portfolio/construction.jpg'
    ],
    description: 'تشطيب شقة 200 متر بتصميم عصري وأنيق مع استخدام أفضل الخامات',
    fullDescription: 'مشروع تشطيب متكامل لشقة عصرية في قلب مدينة نصر، يتميز بالتصميم الأنيق والاستخدام الأمثل للمساحات. تم استخدام أجود الخامات المحلية والمستوردة لضمان الجودة والأناقة.',
    completionDate: '2024',
    location: 'مدينة نصر - المنطقة السابعة',
    client: 'م/ سارة علي',
    duration: '6 أشهر',
    area: '200 م²',
    budget: '800 ألف جنيه',
    features: ['3 غرف نوم', 'صالة واسعة', 'مطبخ أمريكاني', 'حمامين', 'بلكونات', 'باركيه طبيعي'],
    likes: 189,
    views: 890,
    rating: 4.8,
    status: 'completed',
    tags: ['شقة', 'تشطيب', 'عصري', 'أنيق'],
    challenges: [
      'تحسين استغلال المساحات الصغيرة',
      'دمج الطراز العصري مع الراحة',
      'العمل في مبنى مأهول'
    ],
    solutions: [
      'تصميم أثاث مدمج وذكي',
      'استخدام الألوان والإضاءة بذكاء',
      'تنظيم مواعيد العمل بعناية'
    ],
    technologies: ['Smart Lighting', 'Space-Saving Solutions', 'Eco Paint'],
    teamMembers: ['م. ليلى أحمد - مصمم داخلي', 'أ. وليد صالح - مقاول', 'أ. نور الدين - كهربائي'],
    clientTestimonial: {
      comment: 'أعجبت جداً بالتصميم والتنفيذ. تجاوزت توقعاتي بمراحل. فريق العمل محترف ومتعاون.',
      rating: 5,
      clientName: 'سارة علي',
      clientTitle: 'مهندسة معمارية'
    },
    relatedProjects: [6, 11]
  },
  {
    id: 3,
    slug: 'modern-kitchen-maadi',
    title: 'مطبخ مودرن كلاسيك',
    category: 'kitchens',
    image: '/images/portfolio/kitchens.jpg',
    images: [
      '/images/portfolio/kitchens.jpg',
      '/images/portfolio/construction.jpg',
      '/images/portfolio/finishing.jpg'
    ],
    description: 'تصميم وتنفيذ مطبخ مودرن بخامات عالية الجودة وتصميم وظيفي',
    fullDescription: 'مشروع تصميم وتنفيذ مطبخ عصري يجمع بين الأناقة والوظيفية، مع استخدام أجود الخامات الإيطالية وأحدث الأجهزة الذكية لضمان تجربة طبخ مميزة.',
    completionDate: '2024',
    location: 'المعادي - دجلة',
    client: 'أسرة محمد رضا',
    duration: '2 شهر',
    area: '25 م²',
    budget: '200 ألف جنيه',
    features: ['جزيرة وسطية', 'خامات إيطالية', 'إضاءة LED', 'أجهزة ذكية', 'تخزين ذكي', 'رخام طبيعي'],
    likes: 167,
    views: 650,
    rating: 4.9,
    status: 'completed',
    tags: ['مطبخ', 'مودرن', 'إيطالي', 'ذكي'],
    challenges: [
      'المساحة المحدودة',
      'دمج التقنيات الحديثة',
      'التوازن بين التصميم والوظيفة'
    ],
    solutions: [
      'تصميم جزيرة متعددة الاستخدامات',
      'استخدام أجهزة مدمجة وذكية',
      'تحسين مساحات التخزين'
    ],
    technologies: ['Smart Appliances', 'LED Lighting', 'Italian Hardware'],
    teamMembers: ['م. أمينة حسن - مصمم مطابخ', 'أ. كريم السيد - نجار', 'أ. هشام علي - كهربائي'],
    clientTestimonial: {
      comment: 'مطبخ أحلامي تحقق على أرض الواقع. التصميم رائع والتنفيذ في قمة الإتقان.',
      rating: 5,
      clientName: 'محمد رضا',
      clientTitle: 'صاحب المنزل'
    },
    relatedProjects: [8, 12]
  }
  // يمكن إضافة المزيد من المشاريع هنا...
]

// وظائف مساعدة للبحث والفلترة
export const getProjectById = (id: number): PortfolioProject | undefined => {
  return portfolioProjects.find(project => project.id === id)
}

export const getProjectBySlug = (slug: string): PortfolioProject | undefined => {
  return portfolioProjects.find(project => project.slug === slug)
}

export const getProjectsByCategory = (category: string): PortfolioProject[] => {
  if (category === 'all') return portfolioProjects
  return portfolioProjects.filter(project => project.category === category)
}

export const getRelatedProjects = (currentProjectId: number, limit: number = 3): PortfolioProject[] => {
  const currentProject = getProjectById(currentProjectId)
  if (!currentProject) return []
  
  // البحث عن المشاريع المشابهة في نفس الفئة
  return portfolioProjects
    .filter(project => 
      project.id !== currentProjectId && 
      project.category === currentProject.category
    )
    .slice(0, limit)
}

export const searchProjects = (query: string): PortfolioProject[] => {
  const lowercaseQuery = query.toLowerCase()
  return portfolioProjects.filter(project =>
    project.title.toLowerCase().includes(lowercaseQuery) ||
    project.description.toLowerCase().includes(lowercaseQuery) ||
    project.location.toLowerCase().includes(lowercaseQuery) ||
    project.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}
