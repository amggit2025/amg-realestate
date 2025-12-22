import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AMG Real Estate - الحلول العقارية الشاملة',
    short_name: 'AMG العقارية',
    description: 'شركة AMG العقارية الرائدة في مصر للخدمات العقارية الشاملة',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#667eea',
    orientation: 'portrait',
    lang: 'ar',
    dir: 'rtl',
    icons: [
      {
        src: '/images/logo/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/images/logo/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    categories: ['business', 'real estate', 'property'],
    screenshots: [
      {
        src: '/images/screenshots/home.jpg',
        sizes: '1280x720',
        type: 'image/jpeg',
      },
    ],
  }
}
