'use client'

import { useParams, notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowRightIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline'

interface PortfolioItem {
  id: string
  slug: string
  title: string
  description: string
  category: string
  status: string
  location: string
  completionDate?: string
  mainImage: string
  images: { id: string; url: string; alt: string }[]
}

export default function PortfolioDetailPage() {
  const params = useParams()
  const [project, setProject] = useState<PortfolioItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/portfolio/${params.slug}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error('Failed to fetch project')
        }

        const data = await response.json()
        setProject(data)
      } catch (error) {
        console.error('Error fetching project:', error)
        setError(error instanceof Error ? error.message : 'حدث خطأ في تحميل المشروع')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchProject()
    }
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل المشروع...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">خطأ في التحميل</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/portfolio" className="text-orange-500 hover:underline">
            العودة لمعرض الأعمال
          </Link>
        </div>
      </div>
    )
  }

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-orange-500">الرئيسية</Link>
          <ArrowRightIcon className="w-4 h-4" />
          <Link href="/portfolio" className="hover:text-orange-500">معرض الأعمال</Link>
          <ArrowRightIcon className="w-4 h-4" />
          <span className="text-gray-900">{project.title}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="aspect-video relative">
            <Image
              src={project.mainImage}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-5 h-5" />
                    <span>{project.location}</span>
                  </div>
                  {project.completionDate && (
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-5 h-5" />
                      <span>{project.completionDate}</span>
                    </div>
                  )}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${{
                'completed': 'bg-green-100 text-green-800',
                'in-progress': 'bg-yellow-100 text-yellow-800',
                'planned': 'bg-blue-100 text-blue-800'
              }[project.status] || 'bg-gray-100 text-gray-800'}`}>
                {project.status === 'completed' ? 'مكتمل' : 
                 project.status === 'in-progress' ? 'قيد التنفيذ' : 
                 project.status === 'planned' ? 'مخطط' : project.status}
              </span>
            </div>

            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>

            {project.images && project.images.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">صور المشروع</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {project.images.map((image, index) => (
                    <div key={image.id} className="aspect-square relative rounded-lg overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.alt || `${project.title} - صورة ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6 border-t">
              <Link 
                href="/contact" 
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                تواصل معنا
              </Link>
              <Link 
                href="/portfolio" 
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                العودة لمعرض الأعمال
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}