import type { Metadata } from 'next'

// Base URL
const getBaseUrl = () => process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://amg-realestate.com'

// Base metadata for the website
export const baseMetadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: 'AMG العقارية - الحلول العقارية الشاملة في مصر',
    template: '%s | AMG العقارية'
  },
  description: 'شركة AMG العقارية الرائدة في مصر. نقدم خدمات عقارية شاملة من البيع والتسويق إلى الإنشاءات والأثاث والمطابخ العصرية. استثمر في مستقبلك معنا.',
  keywords: [
    'عقارات مصر',
    'شقق للبيع',
    'فلل للبيع',
    'تسويق عقاري',
    'انشاءات',
    'تشطيبات',
    'أثاث عصري',
    'مطابخ مودرن',
    'القاهرة الجديدة',
    'العاصمة الإدارية',
    'التجمع الخامس',
    'AMG العقارية',
    'عقارات للبيع',
    'استثمار عقاري',
    'بيت الوطن',
    'حسن علام'
  ],
  authors: [{ name: 'AMG Real Estate', url: 'https://amg-invest.com' }],
  creator: 'AMG Real Estate',
  publisher: 'AMG Real Estate',
  applicationName: 'AMG Real Estate',
  category: 'Real Estate',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    alternateLocale: ['en_US'],
    url: getBaseUrl(),
    siteName: 'AMG العقارية',
    title: 'AMG العقارية - الحلول العقارية الشاملة في مصر',
    description: 'شركة AMG العقارية الرائدة في مصر. نقدم خدمات عقارية شاملة من البيع والتسويق إلى الإنشاءات والأثاث والمطابخ العصرية.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AMG العقارية - الحلول العقارية الشاملة',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@amgrealestate',
    creator: '@amgrealestate',
    title: 'AMG العقارية - الحلول العقارية الشاملة في مصر',
    description: 'شركة AMG العقارية الرائدة في مصر. نقدم خدمات عقارية شاملة من البيع والتسويق إلى الإنشاءات والأثاث والمطابخ العصرية.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: getBaseUrl(),
    languages: {
      'ar-EG': getBaseUrl(),
      'en-US': `${getBaseUrl()}/en`,
    },
  },
}

// Page-specific metadata
export const pagesMetadata = {
  home: {
    title: 'الرئيسية',
    description: 'مرحباً بك في AMG العقارية - شريكك الموثوق في الاستثمار العقاري. اكتشف أفضل العقارات والخدمات المتكاملة في مصر.',
    keywords: ['الصفحة الرئيسية', 'AMG العقارية', 'عقارات مصر', 'استثمار عقاري'],
  },
  
  portfolio: {
    title: 'معرض الأعمال',
    description: 'استكشف مجموعة متميزة من مشاريعنا المنجزة في مختلف مجالات العقارات والإنشاءات. أكثر من 12 مشروع ناجح بأعلى معايير الجودة.',
    keywords: ['معرض الأعمال', 'مشاريع منجزة', 'انشاءات', 'تشطيبات', 'مطابخ', 'أثاث'],
  },
  
  projects: {
    title: 'المشاريع',
    description: 'اكتشف مشاريع AMG العقارية المتميزة. شقق وفلل وقصور في أفضل المواقع بالقاهرة الجديدة والعاصمة الإدارية.',
    keywords: ['مشاريع عقارية', 'شقق للبيع', 'فلل للبيع', 'قصور فاخرة', 'القاهرة الجديدة'],
  },
  
  services: {
    title: 'خدماتنا',
    description: 'خدمات عقارية شاملة: بيع وتسويق العقارات، إنشاءات وتشطيبات، أثاث عصري ومطابخ مودرن. كل ما تحتاجه في مكان واحد.',
    keywords: ['خدمات عقارية', 'تسويق عقاري', 'انشاءات', 'تشطيبات', 'أثاث', 'مطابخ'],
  },
  
  listings: {
    title: 'الإعلانات العقارية',
    description: 'تصفح آلاف الإعلانات العقارية من المالكين والمطورين. شقق وفلل ومحلات تجارية في جميع أنحاء مصر.',
    keywords: ['إعلانات عقارية', 'شقق للبيع', 'شقق للإيجار', 'فلل للبيع', 'محلات تجارية'],
  },
  
  about: {
    title: 'من نحن',
    description: 'تعرف على قصة AMG العقارية ورؤيتنا في تطوير السوق العقاري المصري. خبرة تمتد لسنوات في خدمة عملائنا.',
    keywords: ['عن الشركة', 'رؤية الشركة', 'فريق العمل', 'خبرة عقارية'],
  },
  
  contact: {
    title: 'تواصل معنا',
    description: 'تواصل مع فريق AMG العقارية. نحن هنا لمساعدتك في جميع احتياجاتك العقارية. اتصل بنا الآن واحصل على استشارة مجانية.',
    keywords: ['تواصل معنا', 'خدمة العملاء', 'استشارة عقارية', 'معلومات الاتصال'],
  },
  
  dashboard: {
    title: 'لوحة التحكم',
    description: 'لوحة التحكم الشخصية للمستخدمين. إدارة إعلاناتك العقارية ومتابعة طلباتك وتحديث بياناتك الشخصية.',
    keywords: ['لوحة التحكم', 'إدارة الإعلانات', 'حساب المستخدم'],
  },
}

// JSON-LD structured data
export const generateStructuredData = (type: string, data?: Record<string, unknown>) => {
  const baseUrl = getBaseUrl()
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AMG العقارية',
    alternateName: 'AMG Real Estate',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    description: 'شركة AMG العقارية الرائدة في مصر للخدمات العقارية الشاملة',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'التجمع الخامس، القاهرة الجديدة',
      addressLocality: 'القاهرة',
      addressRegion: 'محافظة القاهرة',
      postalCode: '11835',
      addressCountry: 'EG'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+20-10-0002-5080',
      contactType: 'customer service',
      email: 'info@amg-invest.com',
      availableLanguage: ['Arabic', 'English'],
      areaServed: 'EG'
    },
    sameAs: [
      'https://www.facebook.com/ahmedelmalahgroup/',
      'https://www.facebook.com/amgrealestate'
    ],
    founder: {
      '@type': 'Person',
      name: 'Ahmed El Malah'
    },
    foundingDate: '2015',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: '50+'
    }
  }

  switch (type) {
    case 'RealEstate':
      return {
        ...baseSchema,
        '@type': 'RealEstateAgent',
        serviceArea: {
          '@type': 'GeoCircle',
          geoMidpoint: {
            '@type': 'GeoCoordinates',
            latitude: 30.0444,
            longitude: 31.2357
          },
          geoRadius: '50000'
        }
      }
    
    case 'Project':
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data?.title || 'مشروع عقاري',
        description: data?.description,
        image: data?.image,
        offers: {
          '@type': 'Offer',
          price: data?.budget,
          priceCurrency: 'EGP',
          availability: 'https://schema.org/InStock'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: data?.rating,
          ratingCount: data?.views
        }
      }
    
    default:
      return baseSchema
  }
}

// Helper function to generate metadata for specific pages
export const generatePageMetadata = (
  pageKey: keyof typeof pagesMetadata,
  customData?: Partial<Metadata>
): Metadata => {
  const pageData = pagesMetadata[pageKey]
  const baseUrl = getBaseUrl()
  const pageUrl = `${baseUrl}/${pageKey === 'home' ? '' : pageKey}`
  
  return {
    title: pageData.title,
    description: pageData.description,
    keywords: pageData.keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${pageData.title} | AMG العقارية`,
      description: pageData.description,
      url: pageUrl,
      images: [
        {
          url: `/images/og-${pageKey}.jpg`,
          width: 1200,
          height: 630,
          alt: `${pageData.title} - AMG العقارية`,
        },
      ],
    },
    twitter: {
      title: `${pageData.title} | AMG العقارية`,
      description: pageData.description,
      images: [`/images/og-${pageKey}.jpg`],
    },
    ...customData,
  }
}
