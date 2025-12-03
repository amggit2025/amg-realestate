'use client';

import { motion } from 'framer-motion';
import { 
  ClockIcon,
  ShieldCheckIcon,
  PhoneIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { COMPANY_INFO } from '@/lib/constants';

export default function ServiceLevelPage() {
  const slaItems = [
    {
      title: 'وقت الاستجابة للاستفسارات',
      description: 'نتعهد بالرد على جميع الاستفسارات خلال 24 ساعة كحد أقصى',
      time: '24 ساعة',
      icon: ClockIcon,
      color: 'blue'
    },
    {
      title: 'الدعم الفني المباشر',
      description: 'دعم فني مباشر عبر الهاتف أو الواتساب في أوقات العمل',
      time: 'فوري',
      icon: PhoneIcon,
      color: 'green'
    },
    {
      title: 'متابعة المشاريع',
      description: 'تقارير دورية عن حالة المشروع وتحديثات منتظمة',
      time: 'أسبوعياً',
      icon: ChatBubbleBottomCenterTextIcon,
      color: 'orange'
    },
    {
      title: 'ضمان الجودة',
      description: 'ضمان شامل على جميع أعمال التشطيب والإنشاءات',
      time: '5 سنوات',
      icon: ShieldCheckIcon,
      color: 'purple'
    }
  ];

  const serviceStandards = [
    'الالتزام الكامل بالمواعيد المحددة في العقود',
    'استخدام مواد عالية الجودة ومعتمدة فقط',
    'فريق عمل مدرب ومؤهل لتنفيذ المشاريع',
    'مراقبة الجودة في جميع مراحل التنفيذ',
    'شفافية كاملة في التسعير والتكاليف',
    'خدمة عملاء متميزة ومتاحة دائماً',
    'ضمان ما بعد البيع والصيانة المجانية'
  ];

  const responseMatrix = [
    {
      priority: 'عاجل جداً',
      description: 'مشاكل تؤثر على السلامة أو تتطلب تدخل فوري',
      responseTime: '2 ساعة',
      availability: '24/7',
      color: 'red'
    },
    {
      priority: 'عاجل',
      description: 'مشاكل في المشاريع الجارية أو استفسارات مهمة',
      responseTime: '8 ساعات',
      availability: 'أوقات العمل',
      color: 'orange'
    },
    {
      priority: 'متوسط',
      description: 'استفسارات عامة أو طلبات تعديل غير عاجلة',
      responseTime: '24 ساعة',
      availability: 'أوقات العمل',
      color: 'yellow'
    },
    {
      priority: 'منخفض',
      description: 'استفسارات عامة أو معلومات إضافية',
      responseTime: '48 ساعة',
      availability: 'أوقات العمل',
      color: 'green'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative pt-20 pb-20 mb-16 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              اتفاقية مستوى الخدمة
            </h1>
            <p className="text-xl text-white/90 max-w-4xl mx-auto drop-shadow">
              التزامنا بتقديم أعلى مستوى من الخدمة والجودة لعملائنا الكرام
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main SLA Items */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">التزاماتنا تجاه عملائنا</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نحن نضع معايير عالية لخدماتنا ونلتزم بها بشكل كامل
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {slaItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto ${
                  item.color === 'blue' ? 'bg-blue-100' :
                  item.color === 'green' ? 'bg-green-100' :
                  item.color === 'orange' ? 'bg-orange-100' :
                  'bg-purple-100'
                }`}>
                  <item.icon className={`w-8 h-8 ${
                    item.color === 'blue' ? 'text-blue-600' :
                    item.color === 'green' ? 'text-green-600' :
                    item.color === 'orange' ? 'text-orange-600' :
                    'text-purple-600'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4 text-center leading-relaxed">
                  {item.description}
                </p>
                <div className={`rounded-lg p-4 text-center ${
                  item.color === 'blue' ? 'bg-blue-50' :
                  item.color === 'green' ? 'bg-green-50' :
                  item.color === 'orange' ? 'bg-orange-50' :
                  'bg-purple-50'
                }`}>
                  <span className={`text-2xl font-bold ${
                    item.color === 'blue' ? 'text-blue-600' :
                    item.color === 'green' ? 'text-green-600' :
                    item.color === 'orange' ? 'text-orange-600' :
                    'text-purple-600'
                  }`}>
                    {item.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Response Time Matrix */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">مصفوفة أوقات الاستجابة</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              أوقات الاستجابة حسب أولوية الطلب ونوع الخدمة المطلوبة
            </p>
          </motion.div>

          <div className="grid gap-6">
            {responseMatrix.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 shadow-lg border-l-4 border-l-red-500"
                style={{ borderLeftColor: 
                  item.color === 'red' ? '#ef4444' : 
                  item.color === 'orange' ? '#f97316' : 
                  item.color === 'yellow' ? '#eab308' : '#22c55e' 
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      أولوية: {item.priority}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  <div className="flex gap-6 md:flex-col md:items-end">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">وقت الاستجابة</p>
                      <span className="text-2xl font-bold text-blue-600">{item.responseTime}</span>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">التوفر</p>
                      <span className="text-lg font-semibold text-emerald-600">{item.availability}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Standards */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">معايير الخدمة</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              المعايير التي نلتزم بها في جميع مشاريعنا وخدماتنا
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {serviceStandards.map((standard, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-6"
              >
                <CheckCircleIcon className="w-8 h-8 text-green-300 mt-1 flex-shrink-0" />
                <p className="text-white text-lg leading-relaxed">
                  {standard}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact for SLA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-orange-100 to-red-50 rounded-3xl p-12 text-center"
          >
            <ExclamationTriangleIcon className="w-16 h-16 text-orange-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              هل لديك شكوى أو اقتراح حول مستوى الخدمة؟
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              نحن نقدر ملاحظاتكم ونسعى لتحسين خدماتنا باستمرار. لا تترددوا في التواصل معنا
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <PhoneIcon className="w-5 h-5 ml-2" />
                اتصل بنا الآن
              </a>
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                💬 واتساب
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}