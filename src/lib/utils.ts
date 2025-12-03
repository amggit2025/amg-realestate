// Utility functions for the AMG Real Estate website

export const formatPrice = (price: number, currency: 'EGP' | 'USD' = 'EGP') => {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export const formatArea = (area: number) => {
  return `${area.toLocaleString('ar-EG')} م²`
}

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export const getPropertyTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    apartment: 'شقة',
    villa: 'فيلا',
    office: 'مكتب',
    commercial: 'تجاري',
    land: 'أرض'
  }
  return types[type] || type
}

export const getPurposeLabel = (purpose: string) => {
  const purposes: Record<string, string> = {
    sale: 'للبيع',
    rent: 'للإيجار'
  }
  return purposes[purpose] || purpose
}

export const getStatusLabel = (status: string) => {
  const statuses: Record<string, string> = {
    active: 'متاح',
    pending: 'معلق',
    sold: 'تم البيع',
    rented: 'تم الإيجار'
  }
  return statuses[status] || status
}

export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-red-100 text-red-800',
    rented: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '') // Keep Arabic, English, numbers, spaces, and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string) => {
  // Egyptian phone number validation (simplified)
  const phoneRegex = /^(\+20|0)?1[0-9]{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const formatPhoneNumber = (phone: string) => {
  // Format Egyptian phone numbers
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('20')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
  }
  if (cleaned.startsWith('01')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
  }
  return phone
}

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in kilometers
  return Math.round(distance * 100) / 100
}

export const generatePropertyId = () => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `prop_${timestamp}_${random}`
}

export const isValidImageUrl = (url: string) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  return imageExtensions.some(ext => url.toLowerCase().includes(ext))
}

export const getImagePlaceholder = (width: number, height: number) => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="#9ca3af" font-family="sans-serif" font-size="14">
        ${width}×${height}
      </text>
    </svg>
  `)}`
}

export const shareProperty = (property: { id: string; title: string }) => {
  const url = `${window.location.origin}/listings/${property.id}`
  const text = `تحقق من هذا العقار المميز: ${property.title}`
  
  if (navigator.share) {
    navigator.share({
      title: property.title,
      text: text,
      url: url,
    })
  } else {
    // Fallback to copying to clipboard
    navigator.clipboard.writeText(`${text}\n${url}`)
  }
}
