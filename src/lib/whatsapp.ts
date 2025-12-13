// ======================================================
// 💬 WhatsApp Integration Helper Functions
// ======================================================

import { COMPANY_INFO } from './constants'

interface PropertyWhatsAppData {
  title: string
  price: number
  currency: string
  propertyType: string
  purpose: string
  city: string
  district: string
  area: number
  bedrooms?: number
  bathrooms?: number
  url?: string
}

/**
 * إنشاء رابط واتساب لعقار معين
 */
export function generatePropertyWhatsAppLink(property: PropertyWhatsAppData): string {
  const phone = COMPANY_INFO.whatsapp.replace(/\D/g, '') // إزالة أي أحرف غير رقمية
  
  // تنسيق السعر
  const formattedPrice = new Intl.NumberFormat('ar-EG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(property.price)
  
  const currencySymbol = property.currency === 'EGP' ? 'ج.م' : '$'
  
  // ترجمة النوع والغرض
  const typeText = getPropertyTypeText(property.propertyType)
  const purposeText = property.purpose === 'SALE' ? 'للبيع' : 'للإيجار'
  
  // بناء الرسالة
  let message = `مرحباً 👋\n\n`
  message += `أنا مهتم بالعقار التالي:\n\n`
  message += `📍 *${property.title}*\n\n`
  message += `💰 السعر: ${formattedPrice} ${currencySymbol}\n`
  message += `🏠 النوع: ${typeText} ${purposeText}\n`
  message += `📐 المساحة: ${property.area} م²\n`
  
  if (property.bedrooms) {
    message += `🛏️ غرف النوم: ${property.bedrooms}\n`
  }
  
  if (property.bathrooms) {
    message += `🚿 الحمامات: ${property.bathrooms}\n`
  }
  
  message += `📍 الموقع: ${property.district}, ${property.city}\n\n`
  
  if (property.url) {
    message += `🔗 رابط العقار:\n${property.url}\n\n`
  }
  
  message += `أرجو التواصل معي للمزيد من التفاصيل.`
  
  // ترميز الرسالة
  const encodedMessage = encodeURIComponent(message)
  
  return `https://wa.me/${phone}?text=${encodedMessage}`
}

/**
 * إنشاء رابط واتساب للتواصل العام
 */
export function generateGeneralWhatsAppLink(message?: string): string {
  const phone = COMPANY_INFO.whatsapp.replace(/\D/g, '')
  
  const defaultMessage = message || `مرحباً 👋\n\nأرغب في الاستفسار عن خدماتكم.`
  const encodedMessage = encodeURIComponent(defaultMessage)
  
  return `https://wa.me/${phone}?text=${encodedMessage}`
}

/**
 * إنشاء رابط واتساب لخدمة معينة
 */
export function generateServiceWhatsAppLink(serviceName: string): string {
  const phone = COMPANY_INFO.whatsapp.replace(/\D/g, '')
  
  const message = `مرحباً 👋\n\nأنا مهتم بخدمة: *${serviceName}*\n\nأرجو التواصل معي للمزيد من التفاصيل.`
  const encodedMessage = encodeURIComponent(message)
  
  return `https://wa.me/${phone}?text=${encodedMessage}`
}

/**
 * إنشاء رابط واتساب لمشروع معين
 */
export function generateProjectWhatsAppLink(projectName: string): string {
  const phone = COMPANY_INFO.whatsapp.replace(/\D/g, '')
  
  const message = `مرحباً 👋\n\nأنا مهتم بمشروع: *${projectName}*\n\nأرجو التواصل معي للمزيد من المعلومات.`
  const encodedMessage = encodeURIComponent(message)
  
  return `https://wa.me/${phone}?text=${encodedMessage}`
}

/**
 * ترجمة نوع العقار
 */
function getPropertyTypeText(type: string): string {
  const types: Record<string, string> = {
    APARTMENT: 'شقة',
    VILLA: 'فيلا',
    OFFICE: 'مكتب',
    COMMERCIAL: 'عقار تجاري',
    LAND: 'أرض',
    PENTHOUSE: 'بنتهاوس',
    DUPLEX: 'دوبلكس',
    STUDIO: 'استوديو'
  }
  return types[type] || type
}
