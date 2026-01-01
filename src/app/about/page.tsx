'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  ClockIcon,
  CheckCircleIcon,
  LightBulbIcon,
  AcademicCapIcon,
  StarIcon,
  ArrowLongLeftIcon,
  SparklesIcon,
  ScaleIcon,
  HeartIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { COMPANY_INFO } from '@/lib/constants'
import SEOHead from '@/components/SEOHead'
import { useState, useEffect, useRef } from 'react'
import { logger } from '@/lib/logger'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface AboutPageData {
  companyName: string
  companyFullName: string
  foundedYear: number
  founderImage: string | null
  yearsOfExperience: number
  completedProjects: number
  happyClients: number
  teamSize: number
  ourStory: string
  vision: string
  mission: string
  values: Array<{title: string, description: string}>
  principles: string[]
  tagline: string
}

const valueIcons: Record<string, any> = {
  'الالتزام': ScaleIcon,
  'الكفاءة': SparklesIcon,
  'الإبداع': LightBulbIcon,
  'الجودة': StarIcon,
  'التميز': BuildingOfficeIcon,
  'المصداقية': HeartIcon
}

export default function AboutPage() {
  const [data, setData] = useState<AboutPageData | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Parallax & Scroll Animations
  const containerRef = useRef(null)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 1000], [0, 300])
  const heroScale = useTransform(scrollY, [0, 1000], [1.1, 1])
  
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/about-page', {
        cache: 'no-store',
        next: { revalidate: 0 }
      })
      const result = await response.json()
      
      if (result.success && result.data) {
        setData(result.data)
      }
    } catch (err) {
      logger.error('Error fetching about page data:', err)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { number: data?.yearsOfExperience || COMPANY_INFO.experience, label: 'سنوات من الخبرة', sub: 'مسيرة مستمرة' },
    { number: data?.completedProjects || 500, label: 'مشروع مكتمل', sub: 'بأعلى المعايير' },
    { number: data?.happyClients || 1000, label: 'عميل يثق بنا', sub: 'شراكة دائمة' },
    { number: data?.teamSize || 50, label: 'عضو في الفريق', sub: 'كفاءات عالية' }
  ]

  const defaultValues = [
    { title: 'الجودة', description: 'نلتزم بأعلى معايير الجودة في كل تفاصيل مشاريعنا' },
    { title: 'الالتزام', description: 'نحترم المواعيد والوعود التي نقطعها لعملائنا' },
    { title: 'الإبداع', description: 'نبتكر حلولاً عصرية تناسب تطلعات عملائنا' },
    { title: 'المصداقية', description: 'الشفافية والوضوح هما أساس تعاملنا' }
  ]

  const displayValues = data?.values && data.values.length > 0 ? data.values : defaultValues

  if (loading) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
          <span className="text-slate-500 font-light tracking-widest">LOADING</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEOHead 
        title={`من نحن - ${data?.companyName || 'مجموعة أحمد الملاح'}`}
        description={data?.ourStory || 'تعرف على مجموعة أحمد الملاح (AMG) - رائدة في مجال المقاولات والتشطيبات والتسويق العقاري'}
      />
      
      <main ref={containerRef} className="bg-white overflow-hidden selection:bg-slate-900 selection:text-white">
        
        {/* 1. Aesthetic Hero Section */}
        <section className="relative h-screen min-h-[800px] flex items-center overflow-hidden">
          {/* Background Image with Parallax */}
          <motion.div 
            style={{ y: heroY, scale: heroScale }}
            className="absolute inset-0 z-0"
          >
            <Image
              src="/images/about-hero-v3.jpg"
              alt="AMG Headquarters"
              fill
              className="object-cover brightness-[0.7]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/30" />
          </motion.div>

          {/* Content */}
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="border-r-4 border-amber-500 pr-8 md:pr-12"
              >
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="block text-amber-400 text-lg md:text-xl font-medium tracking-[0.2em] mb-4 uppercase"
                >
                  {data?.tagline || 'EST. 2010'}
                </motion.span>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-8">
                  نصنع <span className="text-transparent bg-clip-text bg-gradient-to-l from-amber-200 to-amber-500">التميز</span> <br />
                  في كل تفصيل
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed max-w-2xl mb-12">
                  {data?.mission || 'نحن في AMG نؤمن بأن العمارة ليست مجرد بناء، بل هي فن تشكيل الفراغ ليحتوي الحياة بأرقى صورها.'}
                </p>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-wrap gap-6"
                >
                  <Link 
                    href="/projects" 
                    className="group relative px-8 py-4 bg-white text-slate-900 font-bold overflow-hidden transition-all hover:bg-amber-500 hover:text-white"
                  >
                    <span className="relative z-10">استكشف مشاريعنا</span>
                  </Link>
                  <Link 
                    href="/contact" 
                    className="px-8 py-4 border border-white/30 text-white hover:bg-white/10 transition-all backdrop-blur-sm"
                  >
                    تواصل معنا
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Scroll Hint */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/60"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="p-3 border border-white/20 rounded-full backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ChevronDownIcon className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>
        </section>

        {/* 2. Minimalist Stats Strip */}
        <section className="bg-slate-900 text-white py-20 border-b border-slate-800">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center md:text-right border-l-0 md:border-l border-slate-800 pl-0 md:pl-8 last:border-l-0"
                >
                  <div className="text-4xl md:text-6xl font-light text-amber-500 mb-2 font-sans">
                    {stat.number}
                  </div>
                  <div className="text-lg font-medium text-white mb-1">{stat.label}</div>
                  <div className="text-sm text-slate-400">{stat.sub}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. The Story - Editorial Layout */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-20 items-start">
              <div className="lg:w-5/12 sticky top-24">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative aspect-[3/4] bg-slate-100 overflow-hidden"
                >
                  <Image
                    src="/images/about-story.jpg"
                    alt="Our Vision"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-[1.5s]"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white font-serif text-2xl italic">
                      "الجودة هي حجر الزاوية في كل ما نقوم به."
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="lg:w-7/12 pt-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-16"
                >
                  <h4 className="text-amber-600 font-bold tracking-widest uppercase mb-4 text-sm">من نحن</h4>
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                    رؤية تتجاوز <br />
                    <span className="text-slate-400">حدود البناء التقليدي</span>
                  </h2>
                  <div className="prose prose-lg text-slate-600 leading-loose">
                    <p className="mb-6 text-xl font-light text-slate-800">
                      {data?.ourStory || 'تأسست مجموعة أحمد الملاح (AMG) برؤية واضحة: إعادة تعريف مفهوم السكن الفاخر والمقاولات في مصر. نحن لا نبني مجرد هياكل خرسانية، بل نخلق بيئات متكاملة تنبض بالحياة.'}
                    </p>
                    <p>
                      {data?.vision || 'منذ انطلاقتنا، حرصنا على دمج أحدث التقنيات الهندسية مع اللمسات الجمالية الراقية، لنقدم لعملائنا منتجاً عقارياً يجمع بين المتانة والرفاهية. فريقنا المكون من نخبة المهندسين والمصممين يعمل بشغف لتحويل كل مخطط إلى واقع ملموس يفوق التوقعات.'}
                    </p>
                  </div>
                </motion.div>

                {/* Founder Quote - Redesigned */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative mt-16"
                >
                  <div className="absolute -top-10 -right-4 text-[120px] text-amber-500/10 font-serif leading-none select-none z-0">"</div>
                  
                  <div className="relative bg-white p-8 md:p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 z-10">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                      
                      {/* Image with decorative elements */}
                      <div className="relative shrink-0 group">
                        <div className="absolute inset-0 bg-amber-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white shadow-lg relative z-10 ring-1 ring-slate-100">
                           {data?.founderImage ? (
                            <Image src={data.founderImage} alt="Founder" fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                              <UserGroupIcon className="w-12 h-12 text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-amber-500 rounded-full border-4 border-white flex items-center justify-center z-20 shadow-sm">
                          <SparklesIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-center md:text-right flex-1">
                        <blockquote className="text-xl text-slate-700 font-light italic leading-relaxed mb-8 relative">
                          <span className="text-amber-500 font-bold text-2xl ml-1">"</span>
                          نحن نبني للمستقبل. كل مشروع هو شهادة على التزامنا بالتميز وشغفنا بالابتكار. هدفنا ليس فقط إرضاء العميل، بل إبهاره.
                          <span className="text-amber-500 font-bold text-2xl mr-1">"</span>
                        </blockquote>
                        
                        <div className="flex flex-col md:flex-row items-center md:justify-between border-t border-slate-100 pt-6 gap-4">
                          <div className="text-center md:text-right">
                            <h3 className="text-lg font-bold text-slate-900">أحمد الملاح</h3>
                            <p className="text-amber-600 text-xs font-bold tracking-widest uppercase mt-1">المؤسس والمدير التنفيذي</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Values - Grid Layout */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">قيمنا الراسخة</h2>
              <div className="h-1 w-20 bg-amber-500 mx-auto" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayValues.map((value, index) => {
                const Icon = valueIcons[value.title] || StarIcon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white p-10 shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 hover:border-amber-100 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500" />
                    
                    <div className="relative z-10">
                      <div className="w-12 h-12 text-amber-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-full h-full" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-slate-500 leading-relaxed group-hover:text-slate-600">
                        {value.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 5. Luxury CTA */}
        <section className="relative py-32 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/images/about-hero.jpg"
              alt="Background"
              fill
              className="object-cover grayscale"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/80" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="lg:w-2/3">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  هل أنت مستعد <br />
                  <span className="text-amber-500">لبناء حلمك؟</span>
                </h2>
                <p className="text-xl text-slate-300 max-w-xl font-light">
                  دعنا نكون شركاء نجاحك. تواصل معنا اليوم لمناقشة مشروعك القادم مع خبرائنا.
                </p>
              </div>
              
              <div className="lg:w-1/3 flex justify-end">
                <Link 
                  href="/contact"
                  className="group relative inline-flex items-center justify-center px-10 py-6 bg-white text-slate-900 font-bold text-lg overflow-hidden transition-transform hover:scale-105"
                >
                  <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-amber-500 rounded-full group-hover:w-96 group-hover:h-96 opacity-10"></span>
                  <span className="relative flex items-center gap-3">
                    ابدأ المحادثة
                    <ArrowLongLeftIcon className="w-6 h-6" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
