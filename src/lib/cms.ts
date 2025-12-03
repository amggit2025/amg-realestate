// CMS Integration Library for AMG Real Estate

// TypeScript Interfaces
export interface Project {
  id: number;
  title_ar: string;
  title_en: string;
  slug: string;
  description_ar: string;
  description_en: string;
  short_description_ar: string;
  short_description_en: string;
  location_ar: string;
  location_en: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  main_image: string;
  gallery: string[];
  features_ar: string[];
  features_en: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  title_ar: string;
  title_en: string;
  slug: string;
  description_ar: string;
  description_en: string;
  short_description_ar: string;
  short_description_en: string;
  icon: string;
  main_image: string;
  gallery: string[];
  features_ar: string[];
  features_en: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  name_ar: string;
  name_en: string;
  position_ar: string;
  position_en: string;
  company_ar: string;
  company_en: string;
  content_ar: string;
  content_en: string;
  rating: number;
  avatar: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  [key: string]: string;
}

export interface CMSData {
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  settings: SiteSettings;
}

// Utility Functions
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
  }).format(price);
}

export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '/images/project-placeholder.svg';
  if (imagePath.startsWith('http')) return imagePath;
  return `/${imagePath}`;
}

export function formatDate(dateString: string, locale: string = 'ar-EG'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Main function to get all CMS data
export async function getAllCMSData(): Promise<CMSData> {
  return {
    projects: [
      {
        id: 1,
        title_ar: "برج النيل الإداري الجديد",
        title_en: "New Nile Administrative Tower",
        slug: "new-nile-administrative-tower",
        description_ar: "مشروع عقاري فاخر يضم مكاتب إدارية حديثة في قلب القاهرة الجديدة",
        description_en: "Luxury real estate project featuring modern administrative offices in New Cairo",
        short_description_ar: "مكاتب إدارية فاخرة",
        short_description_en: "Luxury administrative offices",
        location_ar: "القاهرة الجديدة، التجمع الخامس",
        location_en: "New Cairo, Fifth Settlement",
        price: 1500000,
        area: 120,
        bedrooms: 0,
        bathrooms: 2,
        main_image: "/images/projects/project1.jpg",
        gallery: ["/images/projects/project1-1.jpg", "/images/projects/project1-2.jpg"],
        features_ar: ["موقع متميز", "تشطيب سوبر لوكس", "حراسة 24 ساعة", "مواقف سيارات"],
        features_en: ["Prime location", "Super lux finishing", "24/7 security", "Parking spaces"],
        status: "published",
        featured: true,
        sort_order: 1,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z"
      },
      {
        id: 2,
        title_ar: "مجمع الرياض السكني",
        title_en: "Riyadh Residential Complex",
        slug: "riyadh-residential-complex",
        description_ar: "مجمع سكني متكامل يوفر جميع الخدمات والمرافق للعائلات",
        description_en: "Integrated residential complex providing all services for families",
        short_description_ar: "مجمع سكني متكامل",
        short_description_en: "Integrated residential complex",
        location_ar: "القاهرة الجديدة، الرحاب",
        location_en: "New Cairo, Rehab",
        price: 2200000,
        area: 180,
        bedrooms: 3,
        bathrooms: 3,
        main_image: "/images/projects/project2.jpg",
        gallery: ["/images/projects/project2-1.jpg", "/images/projects/project2-2.jpg"],
        features_ar: ["حديقة خاصة", "نادي صحي", "ملاعب رياضية", "مركز تجاري"],
        features_en: ["Private garden", "Health club", "Sports courts", "Shopping center"],
        status: "published",
        featured: true,
        sort_order: 2,
        created_at: "2024-01-16T10:00:00Z",
        updated_at: "2024-01-16T10:00:00Z"
      },
      {
        id: 3,
        title_ar: "أبراج الزمالك التجارية",
        title_en: "Zamalek Commercial Towers",
        slug: "zamalek-commercial-towers",
        description_ar: "أبراج تجارية حديثة في قلب الزمالك مع إطلالة مميزة على النيل",
        description_en: "Modern commercial towers in Zamalek with stunning Nile views",
        short_description_ar: "أبراج تجارية في الزمالك",
        short_description_en: "Commercial towers in Zamalek",
        location_ar: "الزمالك، القاهرة",
        location_en: "Zamalek, Cairo",
        price: 3500000,
        area: 250,
        bedrooms: 0,
        bathrooms: 3,
        main_image: "/images/projects/project3.jpg",
        gallery: ["/images/projects/project3-1.jpg", "/images/projects/project3-2.jpg"],
        features_ar: ["إطلالة على النيل", "تكييف مركزي", "مصاعد عالية السرعة", "أمن متطور"],
        features_en: ["Nile view", "Central AC", "High-speed elevators", "Advanced security"],
        status: "published",
        featured: false,
        sort_order: 3,
        created_at: "2024-01-17T10:00:00Z",
        updated_at: "2024-01-17T10:00:00Z"
      }
    ],
    services: [
      {
        id: 1,
        title_ar: "الاستشارات العقارية",
        title_en: "Real Estate Consulting",
        slug: "real-estate-consulting",
        description_ar: "نقدم استشارات عقارية متخصصة لمساعدتك في اتخاذ القرارات الصحيحة",
        description_en: "We provide specialized real estate consulting to help you make the right decisions",
        short_description_ar: "استشارات عقارية متخصصة",
        short_description_en: "Specialized real estate consulting",
        icon: "chart-bar",
        main_image: "/images/services/consulting.jpg",
        gallery: ["/images/services/consulting-1.jpg", "/images/services/consulting-2.jpg"],
        features_ar: ["تقييم عقاري دقيق", "دراسات جدوى", "استشارات قانونية", "تحليل السوق"],
        features_en: ["Accurate property valuation", "Feasibility studies", "Legal advice", "Market analysis"],
        status: "published",
        featured: true,
        sort_order: 1,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z"
      },
      {
        id: 2,
        title_ar: "إدارة الممتلكات",
        title_en: "Property Management",
        slug: "property-management",
        description_ar: "خدمات إدارة ممتلكات شاملة لضمان الحفاظ على استثمارك العقاري",
        description_en: "Comprehensive property management services to maintain your real estate investment",
        short_description_ar: "إدارة شاملة للممتلكات",
        short_description_en: "Comprehensive property management",
        icon: "building-office",
        main_image: "/images/services/management.jpg",
        gallery: ["/images/services/management-1.jpg", "/images/services/management-2.jpg"],
        features_ar: ["صيانة دورية", "إدارة الإيجارات", "خدمات التنظيف", "الأمن والحراسة"],
        features_en: ["Regular maintenance", "Rental management", "Cleaning services", "Security services"],
        status: "published",
        featured: true,
        sort_order: 2,
        created_at: "2024-01-16T10:00:00Z",
        updated_at: "2024-01-16T10:00:00Z"
      },
      {
        id: 3,
        title_ar: "التسويق العقاري",
        title_en: "Real Estate Marketing",
        slug: "real-estate-marketing",
        description_ar: "حملات تسويقية متطورة لضمان بيع أو تأجير عقارك في أسرع وقت",
        description_en: "Advanced marketing campaigns to sell or rent your property quickly",
        short_description_ar: "تسويق احترافي للعقارات",
        short_description_en: "Professional real estate marketing",
        icon: "megaphone",
        main_image: "/images/services/marketing.jpg",
        gallery: ["/images/services/marketing-1.jpg", "/images/services/marketing-2.jpg"],
        features_ar: ["تصوير احترافي", "إعلانات رقمية", "عروض تفاعلية", "شبكة واسعة من العملاء"],
        features_en: ["Professional photography", "Digital advertising", "Interactive presentations", "Wide client network"],
        status: "published",
        featured: true,
        sort_order: 3,
        created_at: "2024-01-17T10:00:00Z",
        updated_at: "2024-01-17T10:00:00Z"
      }
    ],
    testimonials: [
      {
        id: 1,
        name_ar: "أحمد محمد علي",
        name_en: "Ahmed Mohamed Ali",
        position_ar: "مدير تنفيذي",
        position_en: "Executive Manager",
        company_ar: "شركة النور للاستثمار",
        company_en: "Al Nour Investment Company",
        content_ar: "تعاملت مع AMG في شراء مكتبي الجديد وكانت التجربة رائعة. فريق محترف وخدمة ممتازة في كل التفاصيل.",
        content_en: "I dealt with AMG for purchasing my new office and it was an amazing experience. Professional team and excellent service.",
        rating: 5,
        avatar: "/images/testimonials/client1.jpg",
        status: "published",
        featured: true,
        sort_order: 1,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z"
      },
      {
        id: 2,
        name_ar: "فاطمة أحمد حسن",
        name_en: "Fatma Ahmed Hassan",
        position_ar: "طبيبة أسنان",
        position_en: "Dentist",
        company_ar: "عيادة الرحمة",
        company_en: "Al Rahma Clinic",
        content_ar: "اشتريت شقتي من خلال AMG والحمد لله كانت تجربة ممتازة من البداية للنهاية.",
        content_en: "I bought my apartment through AMG and it was an excellent experience from start to finish.",
        rating: 5,
        avatar: "/images/testimonials/client2.jpg",
        status: "published",
        featured: true,
        sort_order: 2,
        created_at: "2024-01-16T10:00:00Z",
        updated_at: "2024-01-16T10:00:00Z"
      }
    ],
    settings: {
      site_name_ar: "AMG العقارية",
      site_name_en: "AMG Real Estate",
      tagline_ar: "شريكك الموثوق في الاستثمار العقاري",
      tagline_en: "Your Trusted Partner in Real Estate Investment",
      description_ar: "شركة AMG الرائدة في مجال العقارات، نقدم خدمات متكاملة",
      description_en: "AMG leading real estate company, providing integrated services",
      phone: "+20 123 456 7890",
      phone_2: "+20 987 654 3210",
      email: "info@amg-realestate.com",
      contact_email: "sales@amg-realestate.com",
      address_ar: "شارع التسعين الشمالي، القاهرة الجديدة",
      address_en: "North 90th Street, New Cairo",
      city_ar: "القاهرة الجديدة",
      city_en: "New Cairo",
      country_ar: "مصر",
      country_en: "Egypt",
      facebook: "https://facebook.com/amgrealestate",
      instagram: "https://instagram.com/amgrealestate",
      twitter: "https://twitter.com/amgrealestate",
      linkedin: "https://linkedin.com/company/amgrealestate",
      youtube: "https://youtube.com/amgrealestate",
      whatsapp: "+201234567890",
      hero_title_ar: "اكتشف منزل أحلامك",
      hero_title_en: "Discover Your Dream Home",
      hero_subtitle_ar: "مع AMG العقارية، نحن نساعدك في العثور على العقار المثالي",
      hero_subtitle_en: "With AMG Real Estate, we help you find the perfect property",
      hero_image: "/images/hero/hero-bg.jpg",
      logo: "/images/logo/logo.png",
      favicon: "/images/logo/favicon.ico"
    }
  };
}

// Specific data fetchers
export async function getProjects(): Promise<Project[]> {
  const data = await getAllCMSData();
  return data.projects.filter(project => project.status === 'published');
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter(project => project.featured);
}

export async function getServices(): Promise<Service[]> {
  const data = await getAllCMSData();
  return data.services.filter(service => service.status === 'published');
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await getAllCMSData();
  return data.testimonials.filter(testimonial => testimonial.status === 'published');
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await getAllCMSData();
  return data.settings;
}
