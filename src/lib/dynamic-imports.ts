/**
 * Dynamic Imports Configuration
 * تحسين الأداء من خلال تحميل المكونات عند الحاجة فقط
 */

import dynamic from 'next/dynamic'

// Lazy load heavy components
export const DynamicFeaturedProjects = dynamic(
  () => import('@/components/features/FeaturedProjects'),
  {
    loading: () => null,
    ssr: true, // Server-side render for SEO
  }
)

export const DynamicPortfolioShowcase = dynamic(
  () => import('@/components/features/PortfolioShowcase'),
  {
    loading: () => null,
    ssr: true,
  }
)

export const DynamicTestimonials = dynamic(
  () => import('@/components/features/Testimonials'),
  {
    loading: () => null,
    ssr: true,
  }
)

export const DynamicServices = dynamic(
  () => import('@/components/features/Services'),
  {
    loading: () => null,
    ssr: true,
  }
)

export const DynamicHero = dynamic(
  () => import('@/components/features/Hero'),
  {
    loading: () => null,
    ssr: true,
  }
)
