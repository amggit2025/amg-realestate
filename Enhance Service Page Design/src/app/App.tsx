'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  HomeIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  KeyIcon,
  TrophyIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { Accordion } from './components/ui/accordion';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  iconName: string;
  color: 'blue' | 'orange' | 'purple' | 'green' | 'red';
}

const colorMap = {
  blue: { gradient: 'from-blue-600 to-cyan-500', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  orange: { gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  purple: { gradient: 'from-purple-600 to-indigo-500', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  green: { gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  red: { gradient: 'from-rose-500 to-pink-600', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
};

const iconComponents: { [key: string]: React.ComponentType<{ className?: string }> } = {
  HomeIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  KeyIcon,
};

// Mock API data
const mockServices: Service[] = [
  {
    id: '1',
    slug: 'property-sales',
    title: 'بيع العقارات',
    description: 'نساعدك في بيع عقارك بأفضل سعر في السوق من خلال استراتيجيات تسويقية فعالة وشبكة واسعة من العملاء المحتملين.',
    heroImage: 'https://images.unsplash.com/photo-1670100408549-f9c409d429a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9wZXJ0eSUyMHNhbGUlMjBob3VzZXxlbnwxfHx8fDE3NjcyNTgwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    iconName: 'HomeIcon',
    color: 'blue',
  },
  {
    id: '2',
    slug: 'property-rental',
    title: 'تأجير العقارات',
    description: 'إدارة شاملة لعقاراتك الاستثمارية مع ضمان أفضل عائد على الاستثمار من خلال خدماتنا الاحترافية في التأجير.',
    heroImage: 'https://images.unsplash.com/photo-1627161683077-e34782c24d81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9wZXJ0eSUyMG1hbmFnZW1lbnQlMjBvZmZpY2V8ZW58MXx8fHwxNzY3MjU4MDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    iconName: 'BuildingOfficeIcon',
    color: 'orange',
  },
  {
    id: '3',
    slug: 'investment-consulting',
    title: 'الاستشارات الاستثمارية',
    description: 'تحليلات سوقية دقيقة واستشارات متخصصة لمساعدتك على اتخاذ قرارات استثمارية ذكية في القطاع العقاري.',
    heroImage: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwaW52ZXN0bWVudHxlbnwxfHx8fDE3NjcxNzIyODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    iconName: 'ChartBarIcon',
    color: 'purple',
  },
  {
    id: '4',
    slug: 'property-management',
    title: 'إدارة الممتلكات',
    description: 'خدمات إدارة شاملة تشمل الصيانة والمتابعة وحل المشاكل لضمان حماية استثماراتك العقارية على المدى الطويل.',
    heroImage: 'https://images.unsplash.com/photo-1763479169474-728a7de108c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwY29uc3VsdGF0aW9ufGVufDF8fHx8MTc2NzI1ODA0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    iconName: 'ClipboardDocumentCheckIcon',
    color: 'green',
  },
  {
    id: '5',
    slug: 'property-valuation',
    title: 'تقييم العقارات',
    description: 'تقييمات عقارية دقيقة معتمدة من قبل خبراء مرخصين لمساعدتك في معرفة القيمة الحقيقية لعقارك.',
    heroImage: 'https://images.unsplash.com/photo-1639663742190-1b3dba2eebcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjByZWFsJTIwZXN0YXRlfGVufDF8fHx8MTc2NzI1ODA0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    iconName: 'KeyIcon',
    color: 'red',
  },
];

const stats = [
  { id: 1, label: 'عميل راضٍ', value: '2,500+', icon: UserGroupIcon },
  { id: 2, label: 'عقار مباع', value: '1,200+', icon: HomeIcon },
  { id: 3, label: 'سنة خبرة', value: '15+', icon: TrophyIcon },
  { id: 4, label: 'مليون ريال', value: '500+', icon: ChartBarIcon },
];

const processSteps = [
  { id: 1, title: 'التواصل الأولي', description: 'نتواصل معك لفهم احتياجاتك وأهدافك العقارية بشكل دقيق' },
  { id: 2, title: 'التقييم والتحليل', description: 'نقوم بتقييم شامل للسوق والعقار لتحديد أفضل الخيارات' },
  { id: 3, title: 'تطوير الاستراتيجية', description: 'نضع خطة عمل مخصصة تناسب احتياجاتك الخاصة' },
  { id: 4, title: 'التنفيذ والمتابعة', description: 'ننفذ الخطة بكفاءة عالية مع متابعة مستمرة حتى تحقيق الأهداف' },
];

const faqs = [
  {
    id: 1,
    question: 'ما هي المستندات المطلوبة لبيع العقار؟',
    answer: 'تحتاج إلى صك الملكية، بطاقة الهوية، شهادة إفراغ، ورسم المساحة. نحن نساعدك في تجهيز كل المستندات المطلوبة.',
  },
  {
    id: 2,
    question: 'كم تستغرق عملية بيع العقار؟',
    answer: 'عادةً تستغرق العملية من 2-4 أسابيع، حسب نوع العقار وحالة السوق. نحن نعمل على تسريع العملية قدر الإمكان.',
  },
  {
    id: 3,
    question: 'هل تقدمون خدمات الاستشارات المجانية؟',
    answer: 'نعم، نقدم استشارة أولية مجانية لجميع عملائنا لمناقشة احتياجاتهم ووضع خطة مبدئية.',
  },
  {
    id: 4,
    question: 'ما هي عمولة الشركة؟',
    answer: 'عمولتنا تنافسية جداً وتعتمد على نوع الخدمة والعقار. نضمن لك أفضل قيمة مقابل الخدمات المقدمة.',
  },
];

export default function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setServices(mockServices);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden" dir="rtl">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative h-[45vh] overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
            backgroundSize: '48px 48px',
          }} />
        </div>

        <motion.div 
          style={{ y: heroY }}
          className="absolute inset-0"
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1639663742190-1b3dba2eebcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjByZWFsJTIwZXN0YXRlfGVufDF8fHx8MTc2NzI1ODA0Nnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Hero Background"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/90 to-blue-900/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
        </motion.div>

        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-20 h-20 border-2 border-white/20 rounded-lg"
          />
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 right-1/3 w-16 h-16 border-2 border-cyan-400/30 rounded-full"
          />
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              x: [0, 10, 0],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-12 h-12 border-2 border-blue-400/20"
          />
        </div>

        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative h-full flex flex-col items-center justify-center px-4 text-center text-white z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <motion.div 
              className="flex items-center justify-center gap-4 mb-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="h-px w-12 bg-gradient-to-r from-transparent via-white/60 to-white/40"
                animate={{ scaleX: [0, 1] }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />
              <div className="flex items-center gap-2 px-4 py-1 rounded-full border border-white/30 backdrop-blur-sm bg-white/10">
                <SparklesIcon className="w-4 h-4" />
                <span className="text-sm tracking-widest">خدماتنا</span>
              </div>
              <motion.div 
                className="h-px w-12 bg-gradient-to-l from-transparent via-white/60 to-white/40"
                animate={{ scaleX: [0, 1] }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="inline-block bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                خدمات عقارية متكاملة
              </span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              نقدم مجموعة شاملة من الخدمات العقارية الاحترافية لتلبية جميع احتياجاتك
            </motion.p>

            {/* Scroll Indicator */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="pt-8"
            >
              <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
                <motion.div 
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-white rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Cards Grid */}
      <section className="relative py-20 px-4 md:px-8 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                <div className="absolute inset-0 w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* First 3 cards */}
              {services.slice(0, 3).map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}

              {/* Last 2 cards centered */}
              <div className="md:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {services.slice(3).map((service, index) => (
                    <ServiceCard key={service.id} service={service} index={index + 3} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_100%] animate-[gradient_15s_ease_infinite]" />
        
        {/* Overlay Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative text-center text-white group"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300">
                  <motion.div
                    animate={{ 
                      y: [0, -5, 0],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <stat.icon className="w-12 h-12 mx-auto mb-4 opacity-90" />
                  </motion.div>
                  <div className="mb-2">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative py-20 px-4 md:px-8 bg-white overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full text-blue-600 text-sm">
                ✨ المميزات
              </div>
            </motion.div>
            <h2 className="text-3xl md:text-4xl mb-4">لماذا تختار AMG؟</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              نحن ملتزمون بتقديم أفضل الخدمات العقارية بمعايير عالمية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: TrophyIcon,
                title: 'خبرة واسعة',
                description: 'أكثر من 15 عاماً من الخبرة في السوق العقاري السعودي',
                color: 'from-amber-500 to-orange-500',
              },
              {
                icon: UserGroupIcon,
                title: 'فريق محترف',
                description: 'فريق من المتخصصين المرخصين والمدربين على أعلى مستوى',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: ShieldCheckIcon,
                title: 'موثوقية عالية',
                description: 'التزام تام بالشفافية والمصداقية في جميع تعاملاتنا',
                color: 'from-emerald-500 to-teal-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -12 }}
                className="group relative"
              >
                {/* Gradient Glow on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-opacity duration-500`} />
                
                <div className="relative p-8 bg-white rounded-2xl border-2 border-gray-100 group-hover:border-transparent group-hover:shadow-2xl transition-all duration-300 h-full">
                  {/* Icon with Gradient Background */}
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 rounded-xl blur-lg`} />
                    <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                  
                  {/* Decorative Corner */}
                  <div className="absolute top-0 left-0 w-20 h-20 opacity-5">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-tl-2xl rounded-br-full`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="relative py-20 px-4 md:px-8 bg-gradient-to-b from-gray-50 via-blue-50/30 to-white overflow-hidden">
        {/* Animated Circles */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 right-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full text-purple-600 text-sm">
                🚀 العملية
              </div>
            </motion.div>
            <h2 className="text-3xl md:text-4xl mb-4">كيف نعمل</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              عملية منظمة ومدروسة لضمان تحقيق أفضل النتائج
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                {/* Connecting Line (hidden on last item and mobile) */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 -left-4 w-8 h-0.5 bg-gradient-to-l from-blue-400 to-transparent" />
                )}
                
                {/* Number Badge */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg z-10 group-hover:shadow-2xl transition-shadow"
                >
                  <span className="font-bold">{step.id}</span>
                </motion.div>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative pt-8 pr-8 p-6 bg-white rounded-xl border-2 border-gray-100 group-hover:border-blue-200 transition-all duration-300 h-full shadow-sm group-hover:shadow-xl">
                  <h3 className="text-lg mb-3 group-hover:text-blue-600 transition-colors">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  
                  {/* Decorative Gradient Bar */}
                  <div className="absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right rounded-b-xl" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-green-600 text-sm">
                💬 الأسئلة الشائعة
              </div>
            </motion.div>
            <h2 className="text-3xl md:text-4xl mb-4">الأسئلة الشائعة</h2>
            <p className="text-gray-600">
              إجابات على أكثر الأسئلة شيوعاً حول خدماتنا
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                
                <div className="relative bg-white border-2 border-gray-100 rounded-xl overflow-hidden group-hover:border-transparent transition-all duration-300 shadow-sm group-hover:shadow-lg">
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="w-full p-6 flex items-center justify-between text-right hover:bg-gradient-to-l hover:from-blue-50/50 hover:to-transparent transition-colors"
                  >
                    <span className="text-lg pr-2 flex-1 text-right">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openFaq === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <ChevronDownIcon className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaq === faq.id ? 'auto' : 0,
                      opacity: openFaq === faq.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-600 border-t border-gray-100 bg-gradient-to-b from-blue-50/30 to-transparent">
                      {faq.answer}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 md:px-8 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-[length:200%_100%] animate-[gradient_10s_ease_infinite]" />
        
        {/* Overlay Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />

        {/* Floating Orbs */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
        />

        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Icon */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="inline-block"
            >
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <SparklesIcon className="w-10 h-10" />
              </div>
            </motion.div>

            <h2 className="text-3xl md:text-4xl">
              هل أنت مستعد لبدء رحلتك العقارية؟
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              تواصل معنا اليوم للحصول على استشارة مجانية ودعنا نساعدك في تحقيق أهدافك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-8 py-4 bg-white text-gray-900 rounded-lg overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative group-hover:text-white transition-colors">احجز استشارة مجانية</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-8 py-4 border-2 border-white text-white rounded-lg overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative group-hover:text-gray-900 transition-colors">اتصل بنا الآن</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = iconComponents[service.iconName];
  const colors = colorMap[service.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -12 }}
      className="group relative"
    >
      {/* Animated Border Gradient */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500 group-hover:blur-lg" />
      
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full"
          >
            <ImageWithFallback
              src={service.heroImage}
              alt={service.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Icon Badge with Glassmorphism */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`absolute top-4 right-4 w-14 h-14 ${colors.bg} border-2 ${colors.border} rounded-xl flex items-center justify-center backdrop-blur-md bg-opacity-90 shadow-xl z-20`}
          >
            <Icon className={`w-7 h-7 ${colors.text}`} />
          </motion.div>

          {/* Floating Particles Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                className="absolute bottom-0 left-1/2 w-1 h-1 bg-white rounded-full"
                style={{ left: `${30 + i * 20}%` }}
              />
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="relative p-6 bg-gradient-to-b from-white to-gray-50/50">
          {/* Decorative Corner */}
          <div className="absolute top-0 left-0 w-16 h-16 opacity-5">
            <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient}`} />
          </div>

          <h3 className="relative text-xl mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${colors.gradient} transition-all duration-300">
            {service.title}
          </h3>
          <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
            {service.description}
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative w-full py-3 bg-gradient-to-r ${colors.gradient} text-white rounded-lg overflow-hidden group/btn`}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative flex items-center justify-center gap-2">
              اعرف المزيد
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ←
              </motion.span>
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}