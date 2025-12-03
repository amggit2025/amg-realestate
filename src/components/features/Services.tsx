'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  WrenchScrewdriverIcon,
  PaintBrushIcon,
  CubeTransparentIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

const services = [
  {
    id: 1,
    title: "الإنشاءات والمقاولات",
    description: "تنفيذ خرسانات ومباني وأعمال الإنشاءات بأعلى معايير الجودة والالتزام بالمواعيد",
    icon: WrenchScrewdriverIcon,
    color: "orange",
    features: ["تنفيذ خرسانات مسلحة", "أعمال المباني والحوائط", "الأساسات والهياكل الخرسانية"],
    slug: "construction"
  },
  {
    id: 2,
    title: "التشطيبات والديكورات",
    description: "تشطيبات داخلية وخارجية عالية الجودة مع تصاميم عصرية ومواد فاخرة",
    icon: PaintBrushIcon,
    color: "purple",
    features: ["تشطيبات داخلية وخارجية", "تصاميم ديكور حديثة", "مواد تشطيب عالية الجودة"],
    slug: "finishing"
  },
  {
    id: 3,
    title: "الأثاث المنزلي",
    description: "تصميم وتنفيذ أثاث منزلي مخصص بجودة عالية وتصاميم عصرية",
    icon: CubeTransparentIcon,
    color: "blue",
    features: ["غرف نوم مودرن وكلاسيك", "ركنيات وصالونات فاخرة", "دريسنج وخزائن مدمجة"],
    slug: "furniture"
  },
  {
    id: 4,
    title: "التسويق العقاري",
    description: "تسويق وتطوير المشاريع العقارية المتميزة والمجمعات السكنية والتجارية",
    icon: BuildingOfficeIcon,
    color: "green",
    features: ["تسويق الأبراج والمجمعات السكنية", "تطوير المشاريع التجارية", "تسويق الفلل والأراضي"],
    slug: "marketing"
  },
  {
    id: 5,
    title: "قسم المصانع",
    description: "حلول متكاملة للمصانع من التشطيب والبناء إلى الإيبوكسي والأرضيات الصناعية",
    icon: BuildingOfficeIcon,
    color: "gray",
    features: ["تشطيب وبناء المصانع", "أرضيات إيبوكسي للمخازن", "حلول الأرضيات المقاومة للأحمال"],
    slug: "factories"
  }
]

export default function Services() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            خدماتنا المتميزة
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            حلول عقارية 
            <span className="text-blue-600"> شاملة</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نقدم مجموعة متكاملة من الخدمات العقارية لتلبية جميع احتياجاتك من الاستشارة إلى التنفيذ
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.slice(0, 3).map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Service Icon */}
              <div className={`w-14 h-14 bg-${service.color}-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className={`w-7 h-7 text-${service.color}-600`} />
              </div>

              {/* Service Info */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* View All Services Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            الذهاب إلى جميع الخدمات
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-4">
            هل تحتاج استشارة مجانية؟
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            تواصل معنا الآن للحصول على استشارة مجانية من خبرائنا واكتشف كيف يمكننا مساعدتك
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            احصل على استشارة مجانية
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
