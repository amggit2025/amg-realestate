import { motion } from 'motion/react';
import { User, Phone, Mail, Clock, Camera, TrendingUp, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const timeSlots = [
  { id: 'morning', label: 'صباحاً', time: '9 ص - 12 م', icon: '🌅' },
  { id: 'afternoon', label: 'ظهراً', time: '12 م - 5 م', icon: '☀️' },
  { id: 'evening', label: 'مساءً', time: '5 م - 9 م', icon: '🌙' },
];

const serviceTypes = [
  {
    id: 'marketing',
    title: 'تسويق فقط',
    description: 'نقوم بتسويق عقارك على جميع المنصات والوصول لأكبر عدد من المهتمين',
    icon: <TrendingUp size={32} />,
    features: ['نشر على 10+ منصة', 'تسويق رقمي متقدم', 'تقارير أسبوعية'],
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'marketing_photo',
    title: 'تسويق + تصوير احترافي',
    description: 'تسويق شامل مع جلسة تصوير احترافية لعقارك',
    icon: <Camera size={32} />,
    features: ['تصوير احترافي', 'جولة افتراضية', 'تسويق مميز', 'تحرير احترافي'],
    color: 'from-purple-500 to-purple-600',
    recommended: true,
  },
  {
    id: 'valuation',
    title: 'تقييم عقاري',
    description: 'احصل على تقييم دقيق لسعر عقارك من خبراء متخصصين',
    icon: <CheckCircle size={32} />,
    features: ['تقييم من خبراء', 'تقرير مفصل', 'تحليل السوق', 'استشارة مجانية'],
    color: 'from-green-500 to-green-600',
  },
];

interface ContactInfoStepProps {
  data: any;
  onDataChange: (data: any) => void;
}

export const ContactInfoStep = ({ data, onDataChange }: ContactInfoStepProps) => {
  const [selectedTime, setSelectedTime] = useState(data.preferredTime || '');
  const [selectedServices, setSelectedServices] = useState<string[]>(data.services || []);

  const handleTimeSelect = (timeId: string) => {
    setSelectedTime(timeId);
    onDataChange({ ...data, preferredTime: timeId });
  };

  const toggleService = (serviceId: string) => {
    const newServices = selectedServices.includes(serviceId)
      ? selectedServices.filter(s => s !== serviceId)
      : [...selectedServices, serviceId];
    setSelectedServices(newServices);
    onDataChange({ ...data, services: newServices });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
        {/* Contact Form */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6">معلومات التواصل</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم الكامل</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37]" size={20} />
                <input
                  type="text"
                  value={data.name || ''}
                  onChange={(e) => onDataChange({ ...data, name: e.target.value })}
                  placeholder="أحمد محمد"
                  className="w-full pr-12 pl-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">رقم الهاتف</label>
              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37]" size={20} />
                <input
                  type="tel"
                  value={data.phone || ''}
                  onChange={(e) => onDataChange({ ...data, phone: e.target.value })}
                  placeholder="01012345678"
                  className="w-full pr-12 pl-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d4af37]" size={20} />
                <input
                  type="email"
                  value={data.email || ''}
                  onChange={(e) => onDataChange({ ...data, email: e.target.value })}
                  placeholder="example@email.com"
                  className="w-full pr-12 pl-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:outline-none transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preferred Contact Time */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
            <Clock className="text-[#d4af37]" size={28} />
            الوقت المفضل للتواصل
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {timeSlots.map((slot, index) => (
              <motion.button
                key={slot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleTimeSelect(slot.id)}
                className={`
                  p-6 rounded-2xl border-2 transition-all duration-300
                  ${selectedTime === slot.id
                    ? 'border-[#d4af37] bg-gradient-to-br from-[#1e3a5f]/5 to-[#d4af37]/5 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-[#d4af37]/50 hover:shadow-md'
                  }
                `}
              >
                <div className="text-4xl mb-3">{slot.icon}</div>
                <div className="font-bold text-lg text-[#1e3a5f] mb-1">{slot.label}</div>
                <div className="text-sm text-gray-600">{slot.time}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Service Selection */}
        <div>
          <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6">اختر الخدمات المطلوبة</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {serviceTypes.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => toggleService(service.id)}
                className={`
                  relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer
                  ${selectedServices.includes(service.id)
                    ? 'border-[#d4af37] shadow-xl scale-105'
                    : 'border-gray-200 hover:border-[#d4af37]/50 hover:shadow-md'
                  }
                `}
              >
                {/* Recommended Badge */}
                {service.recommended && (
                  <div className="absolute -top-3 right-6 bg-gradient-to-r from-[#d4af37] to-[#f0c866] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    الأكثر طلباً ⭐
                  </div>
                )}

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} text-white mb-4 shadow-lg`}>
                  {service.icon}
                </div>

                {/* Title */}
                <h4 className="font-bold text-xl text-[#1e3a5f] mb-2">{service.title}</h4>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{service.description}</p>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Checkbox */}
                <div className="flex items-center justify-center">
                  <div className={`
                    w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300
                    ${selectedServices.includes(service.id)
                      ? 'bg-[#d4af37] border-[#d4af37]'
                      : 'border-gray-300'
                    }
                  `}>
                    {selectedServices.includes(service.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-white text-sm"
                      >
                        ✓
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
