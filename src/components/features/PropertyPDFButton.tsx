'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

interface PropertyData {
  title: string
  price: number
  currency: string
  area: number
  bedrooms?: number
  bathrooms?: number
  propertyType: string
  purpose: string
  city: string
  district: string
  description: string
  features?: string
  contactName: string
  contactPhone: string
  contactEmail: string
  images: { url: string }[]
}

interface PropertyPDFButtonProps {
  property: PropertyData
  variant?: 'icon' | 'full'
}

export default function PropertyPDFButton({ property, variant = 'full' }: PropertyPDFButtonProps) {
  const [isClient, setIsClient] = useState(false)
  const [PDFDownloadLink, setPDFDownloadLink] = useState<any>(null)
  const [PropertyPDFDocument, setPropertyPDFDocument] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    
    // Load PDF components only on client side
    Promise.all([
      import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
      import('@/components/features/PropertyPDFDocument').then((mod) => mod.default),
    ]).then(([PDFLink, PDFDoc]) => {
      setPDFDownloadLink(() => PDFLink)
      setPropertyPDFDocument(() => PDFDoc)
    })
  }, [])

  if (!isClient || !PDFDownloadLink || !PropertyPDFDocument) {
    return variant === 'icon' ? (
      <motion.button
        disabled
        className="p-2 rounded-full bg-gray-100 opacity-50 cursor-not-allowed"
        title="جاري التحميل..."
      >
        <ArrowDownTrayIcon className="w-5 h-5 text-gray-600" />
      </motion.button>
    ) : (
      <motion.button
        disabled
        className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg opacity-50 cursor-not-allowed"
      >
        <ArrowDownTrayIcon className="w-5 h-5" />
        جاري التحميل...
      </motion.button>
    )
  }

  return (
    <PDFDownloadLink
      document={<PropertyPDFDocument property={property} />}
      fileName={`${property.title.replace(/\s+/g, '_')}_AMG.pdf`}
      className={variant === 'icon' ? '' : 'block'}
    >
      {({ loading }: { loading: boolean }) =>
        variant === 'icon' ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full bg-gray-100 hover:bg-green-50 transition-colors disabled:opacity-50"
            disabled={loading}
            title="تحميل PDF"
          >
            <ArrowDownTrayIcon className="w-5 h-5 text-gray-600" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            {loading ? 'جاري التحضير...' : 'تحميل كـ PDF'}
          </motion.button>
        )
      }
    </PDFDownloadLink>
  )
}
