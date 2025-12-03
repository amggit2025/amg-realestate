import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'معرض الأعمال | AMG Real Estate',
  description: 'استعرض مجموعة متنوعة من مشاريعنا المتميزة في البناء والتشطيب والأثاث والتسويق العقاري. أكثر من 100 مشروع نموذجي في مختلف أنحاء القاهرة الكبرى.',
  keywords: [
    'معرض الأعمال',
    'مشاريع عقارية',
    'تشطيبات',
    'بناء',
    'أعمال سابقة',
    'AMG Real Estate',
    'مقاولات',
    'ديكور',
    'أثاث',
    'مطابخ'
  ],
  openGraph: {
    title: 'معرض الأعمال | AMG Real Estate',
    description: 'استعرض مجموعة متنوعة من مشاريعنا المتميزة في البناء والتشطيب والأثاث والتسويق العقاري',
    type: 'website',
    locale: 'ar_EG',
    siteName: 'AMG Real Estate'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'معرض الأعمال | AMG Real Estate',
    description: 'استعرض مجموعة متنوعة من مشاريعنا المتميزة في البناء والتشطيب والأثاث والتسويق العقاري'
  },
  alternates: {
    canonical: '/portfolio'
  }
}

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
