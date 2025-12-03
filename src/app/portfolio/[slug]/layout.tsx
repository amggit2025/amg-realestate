import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectBySlug } from '@/lib/portfolio-data'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  
  if (!project) {
    return {
      title: 'مشروع غير موجود | AMG Real Estate'
    }
  }

  return {
    title: `${project.title} | معرض الأعمال | AMG Real Estate`,
    description: project.fullDescription || project.description,
    keywords: [
      project.title,
      'AMG Real Estate',
      'مشاريع عقارية',
      'تشطيبات',
      'بناء',
      project.location,
      ...project.features
    ],
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'article',
      locale: 'ar_EG',
      siteName: 'AMG Real Estate'
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description
    },
    alternates: {
      canonical: `/portfolio/${project.slug}`
    }
  }
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
