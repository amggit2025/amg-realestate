import { motion } from 'motion/react';
import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

export const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/201234567890?text=مرحباً، أريد الاستفسار عن خدمات AMG Real Estate', '_blank');
  };

  return (
    <>
      {/* Help Tooltip */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: isOpen ? 0 : 1, 
          scale: isOpen ? 0 : 1,
          x: isOpen ? 100 : 0 
        }}
        className="fixed left-24 bottom-24 bg-white rounded-2xl shadow-xl px-6 py-3 z-40 border border-gray-200"
      >
        <div className="text-sm font-semibold text-[#1e3a5f]">هل تحتاج مساعدة؟</div>
        <div className="text-xs text-gray-600">تواصل معنا الآن</div>
      </motion.div>

      {/* WhatsApp Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="fixed left-6 bottom-6 w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-2xl flex items-center justify-center z-50 hover:shadow-green-500/50 transition-all duration-300"
      >
        <MessageCircle className="text-white" size={32} />
        
        {/* Pulse Animation */}
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
      </motion.button>
    </>
  );
};
