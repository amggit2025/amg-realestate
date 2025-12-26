import { motion } from 'motion/react';
import { CheckCircle2, Home, Share2, Facebook, Twitter, Send, Building } from 'lucide-react';
import { useEffect, useState } from 'react';
import { propertyTypes } from './PropertyDetailsStep';

interface SuccessStepProps {
  data: any;
}

const Confetti = () => {
  const colors = ['#d4af37', '#1e3a5f', '#10b981', '#f59e0b', '#ef4444'];
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth,
    y: -20,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 8 + 4,
    rotation: Math.random() * 360,
    duration: Math.random() * 2 + 3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: particle.x,
            y: particle.y,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 100,
            rotate: particle.rotation * 4,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            ease: "linear",
          }}
          style={{
            position: 'absolute',
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: '50%',
          }}
        />
      ))}
    </div>
  );
};

export const SuccessStep = ({ data }: SuccessStepProps) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [requestId] = useState(() => 
    `AMG-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
  );

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      {showConfetti && <Confetti />}

      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-2xl mb-6">
            <CheckCircle2 className="text-white" size={64} />
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-4"
          >
            تم إرسال طلبك بنجاح! 🎉
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-600 mb-8"
          >
            شكراً لثقتك في AMG Real Estate. سنتواصل معك قريباً
          </motion.p>

          {/* Request ID */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="inline-block bg-gradient-to-r from-[#1e3a5f]/5 to-[#d4af37]/5 border-2 border-[#d4af37] rounded-2xl px-8 py-4"
          >
            <div className="text-sm text-gray-600 mb-1">رقم الطلب</div>
            <div className="text-2xl font-bold text-[#1e3a5f]">{requestId}</div>
          </motion.div>
        </motion.div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 mb-8"
        >
          <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
            <Home className="text-[#d4af37]" />
            ملخص العقار
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">نوع العقار</div>
              <div className="font-semibold text-[#1e3a5f]">
                {propertyTypes.find(t => t.id === data.propertyType)?.label || 'غير محدد'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">الغرض</div>
              <div className="font-semibold text-[#1e3a5f]">
                {data.purpose === 'sale' ? 'للبيع' : 'للإيجار'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">الموقع</div>
              <div className="font-semibold text-[#1e3a5f]">
                {data.city || 'غير محدد'}, {data.governorate || 'غير محدد'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">المساحة</div>
              <div className="font-semibold text-[#1e3a5f]">{data.area || 'غير محدد'} متر مربع</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">السعر</div>
              <div className="font-semibold text-[#1e3a5f]">
                {data.price ? `${parseInt(data.price).toLocaleString()} جنيه` : 'غير محدد'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">التواصل</div>
              <div className="font-semibold text-[#1e3a5f]">{data.name || 'غير محدد'}</div>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] rounded-2xl p-8 text-white mb-8"
        >
          <h3 className="text-2xl font-bold mb-4">ماذا بعد؟</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#d4af37] rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <div className="font-semibold mb-1">مراجعة الطلب</div>
                <div className="text-white/80 text-sm">سيقوم فريقنا بمراجعة تفاصيل عقارك</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#d4af37] rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <div className="font-semibold mb-1">التواصل معك</div>
                <div className="text-white/80 text-sm">سنتصل بك خلال 24 ساعة في الوقت المحدد</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#d4af37] rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <div className="font-semibold mb-1">بدء التسويق</div>
                <div className="text-white/80 text-sm">نبدأ في تسويق عقارك للوصول لأفضل المشترين</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <button className="flex-1 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] hover:shadow-xl text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
            <Home size={20} />
            العودة للرئيسية
          </button>
          <button className="flex-1 bg-white hover:bg-gray-50 border-2 border-[#1e3a5f] text-[#1e3a5f] font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
            <Building size={20} />
            تصفح المشاريع
          </button>
        </motion.div>

        {/* Social Sharing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <div className="text-sm text-gray-600 mb-4">شارك مع أصدقائك</div>
          <div className="flex justify-center gap-3">
            <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
              <Facebook size={20} />
            </button>
            <button className="w-12 h-12 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
              <Twitter size={20} />
            </button>
            <button className="w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
              <Send size={20} />
            </button>
            <button className="w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
              <Share2 size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};