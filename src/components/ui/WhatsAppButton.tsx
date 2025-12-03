'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
  className?: string
  position?: 'fixed' | 'inline'
}

export default function WhatsAppButton({ 
  phoneNumber = '201234567890', // رقم WhatsApp للشركة
  message = 'مرحباً، أريد الاستفسار عن خدماتكم',
  className = '',
  position = 'fixed'
}: WhatsAppButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  if (position === 'fixed') {
    return (
      <motion.button
        onClick={handleWhatsAppClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`fixed bottom-6 left-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }} // يظهر بعد تحميل الصفحة
      >
        {/* أيقونة WhatsApp */}
        <motion.div
          animate={{ rotate: isHovered ? 15 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg 
            className="w-8 h-8" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.75-1.866-.75-1.866-1.008-2.313-.248-.428-.512-.37-.704-.377-.18-.007-.384-.007-.584-.007s-.527.074-.804.372c-.277.297-1.057 1.033-1.057 2.521s1.082 2.924 1.232 3.122c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 17.568c-.85 1.275-2.126 2.147-3.568 2.432v-1.704c1.018-.206 1.967-.731 2.725-1.489.758-.758 1.283-1.707 1.489-2.725h1.704c-.285 1.442-1.157 2.718-2.432 3.568-.362.242-.738.448-1.125.616-.387.168-.791.3-1.207.395v1.708c.416-.095.82-.227 1.207-.395.387-.168.763-.374 1.125-.616z"/>
          </svg>
        </motion.div>

        {/* Pulse Animation */}
        <motion.div
          className="absolute inset-0 bg-green-400 rounded-full -z-10"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            x: isHovered ? -10 : 0 
          }}
          className="absolute right-full top-1/2 transform -translate-y-1/2 mr-4 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap"
        >
          تواصل معنا عبر WhatsApp
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45" />
        </motion.div>
      </motion.button>
    )
  }

  // Inline button
  return (
    <motion.button
      onClick={handleWhatsAppClick}
      className={`bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all duration-300 text-sm font-semibold ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.75-1.866-.75-1.866-1.008-2.313-.248-.428-.512-.37-.704-.377-.18-.007-.384-.007-.584-.007s-.527.074-.804.372c-.277.297-1.057 1.033-1.057 2.521s1.082 2.924 1.232 3.122c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      </svg>
      واتساب
    </motion.button>
  )
}
