'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  MapPinIcon, 
  HomeIcon, 
  PhoneIcon,
  HeartIcon,
  EyeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Badge, Button } from '@/components/ui'
import { Property } from '@/types'
import { useState } from 'react'

interface PropertyCardProps {
  property: Property
  showContact?: boolean
}

export default function PropertyCard({ property, showContact = false }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const formatPrice = (price: number, currency: string) => {
    const formatter = new Intl.NumberFormat('ar-EG', { 
      notation: 'compact',
      maximumFractionDigits: 1
    })
    return `${formatter.format(price)} ${currency === 'EGP' ? 'ج.م' : '$'}`
  }

  const getStatusColor = (status: Property['status']) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/90'
      case 'pending': return 'bg-amber-500/90'
      case 'sold': return 'bg-red-500/90'
      case 'rented': return 'bg-blue-500/90'
      default: return 'bg-gray-500/90'
    }
  }

  const getStatusText = (status: Property['status']) => {
    switch (status) {
      case 'active': return 'متاح'
      case 'pending': return 'معلق'
      case 'sold': return 'مباع'
      case 'rented': return 'مؤجر'
      default: return status
    }
  }

  const getPurposeColor = (purpose: Property['purpose']) => {
    return purpose === 'sale' 
      ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
      : 'bg-gradient-to-r from-purple-500 to-purple-600'
  }

  const getPurposeText = (purpose: Property['purpose']) => {
    return purpose === 'sale' ? 'للبيع' : 'للإيجار'
  }

  const getTypeText = (type: Property['type']) => {
    const types = {
      apartment: 'شقة',
      villa: 'فيلا',
      office: 'مكتب',
      commercial: 'تجاري',
      land: 'أرض'
    }
    return types[type] || type
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {property.images.length > 0 ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
            <HomeIcon className="w-20 h-20 text-white/30" />
          </div>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          {/* Purpose Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className={`${getPurposeColor(property.purpose)} backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg`}
          >
            <SparklesIcon className="w-3.5 h-3.5 text-white" />
            <span className="text-white text-xs font-bold">
              {getPurposeText(property.purpose)}
            </span>
          </motion.div>

          {/* Status Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`${getStatusColor(property.status)} backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg`}
          >
            <span className="text-white text-xs font-bold">
              {getStatusText(property.status)}
            </span>
          </motion.div>
        </div>

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
        >
          {isFavorite ? (
            <HeartSolidIcon className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-700" />
          )}
        </motion.button>

        {/* Type Badge - Bottom */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
            <span className="text-gray-800 text-xs font-semibold">
              {getTypeText(property.type)}
            </span>
          </div>
        </div>

        {/* Image Count Indicator */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
            <EyeIcon className="w-3.5 h-3.5 text-white" />
            <span className="text-white text-xs font-medium">
              {property.images.length}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Price - Big & Bold */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {formatPrice(property.price, property.currency)}
            </span>
            {property.purpose === 'rent' && (
              <span className="text-sm text-gray-500 font-medium">/شهرياً</span>
            )}
          </div>
        </div>

        {/* Title */}
        <Link href={`/listings/${property.id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 hover:text-blue-600 transition-colors cursor-pointer">
            {property.title}
          </h3>
        </Link>
        
        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPinIcon className="w-4 h-4 ml-1 flex-shrink-0 text-blue-500" />
          <span className="text-sm truncate font-medium">
            {property.location.district}, {property.location.city}
          </span>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
          {/* Area */}
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <HomeIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">المساحة</p>
              <p className="text-sm font-bold text-gray-900">{property.area}م²</p>
            </div>
          </div>
          
          {/* Bedrooms */}
          {property.bedrooms && (
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <span className="text-base">�️</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">غرف</p>
                <p className="text-sm font-bold text-gray-900">{property.bedrooms}</p>
              </div>
            </div>
          )}
          
          {/* Bathrooms */}
          {property.bathrooms && (
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                <span className="text-base">🚿</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">حمام</p>
                <p className="text-sm font-bold text-gray-900">{property.bathrooms}</p>
              </div>
            </div>
          )}
        </div>

        {/* Features Tags */}
        {property.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {property.features.slice(0, 2).map((feature, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-medium border border-gray-200"
                >
                  {feature}
                </span>
              ))}
              {property.features.length > 2 && (
                <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-semibold border border-blue-200">
                  +{property.features.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Contact Info */}
        {showContact && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4">
            <div className="flex items-center text-sm text-gray-700">
              <PhoneIcon className="w-4 h-4 ml-1.5 text-blue-600" />
              <span className="font-medium">{property.contact.name}</span>
              <span className="mx-2">•</span>
              <span className="font-semibold text-blue-600">{property.contact.phone}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link href={`/listings/${property.id}`} className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 px-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 transition-all"
            >
              عرض التفاصيل
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open(`tel:${property.contact.phone}`)}
            className="bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 p-2.5 rounded-xl transition-all group"
          >
            <PhoneIcon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </motion.button>
        </div>
      </div>

      {/* Hover Effect - Glow */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-400/50 ring-offset-2" />
        </motion.div>
      )}
    </motion.div>
  )
}
