import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://amg-realestate.com'
  
  try {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/listings`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

    // Dynamic: Projects (Portfolio Items from AMG)
    const projects = await prisma.portfolioItem.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        slug: true,
        updatedAt: true,
      },
    })

    const projectPages: MetadataRoute.Sitemap = projects.map((project: any) => ({
      url: `${baseUrl}/projects/${project.slug || project.id}`,
      lastModified: project.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Dynamic: Services - Static for now as no service model
    const servicePages: MetadataRoute.Sitemap = []

    // Dynamic: User Listings (Public listings only)
    const listings = await prisma.listings.findMany({
      where: {
        status: 'APPROVED',
      },
      select: {
        id: true,
        updatedAt: true,
      },
      take: 1000, // Limit to prevent sitemap from being too large
    })

    const listingPages: MetadataRoute.Sitemap = listings.map((listing: any) => ({
      url: `${baseUrl}/listings/${listing.id}`,
      lastModified: listing.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Combine all pages
    return [
      ...staticPages,
      ...projectPages,
      ...listingPages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Return at least static pages if database fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/services`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/projects`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
    ]
  }
}
