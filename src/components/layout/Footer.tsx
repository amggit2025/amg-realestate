'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline'
import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react'
import { COMPANY_INFO, SOCIAL_LINKS } from '@/lib/constants'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

interface SocialLinksData {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
  twitter?: string;
  youtube?: string;
  whatsapp?: string;
  snapchat?: string;
}

const footerNavigation = {
  main: [
    { name: 'الرئيسية', href: '/' },
    { name: 'المشاريع', href: '/projects' },
    { name: 'الخدمات', href: '/services' },
    { name: 'الإعلانات', href: '/listings' },
    { name: 'من نحن', href: '/about' },
    { name: 'تواصل معنا', href: '/contact' },
  ],
  services: [
    { name: 'بيع العقارات', href: '/services#real-estate' },
    { name: 'التسويق العقاري', href: '/services#marketing' },
    { name: 'الإنشاءات', href: '/services#construction' },
    { name: 'الأثاث العصري', href: '/services#furniture' },
    { name: 'المطابخ المودرن', href: '/services#kitchens' },
  ],
  legal: [
    { name: 'سياسة الخصوصية', href: '/privacy' },
    { name: 'شروط الاستخدام', href: '/terms' },
    { name: 'سياسة الاسترداد', href: '/refund' },
    { name: 'اتفاقية مستوى الخدمة', href: '/service-level' },
  ],
  social: [
    { name: 'Facebook', href: SOCIAL_LINKS.facebook, icon: '�' },
    { name: 'WhatsApp', href: SOCIAL_LINKS.whatsapp, icon: '📱' },
    { name: 'Email', href: SOCIAL_LINKS.email, icon: '�' },
  ],
}

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLinksData>({});
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const response = await fetch('/api/social-links');
      const result = await response.json();
      
      if (result.success && result.data) {
        setSocialLinks(result.data);
      }
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'يرجى إدخال بريد إلكتروني صالح' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setEmail(''); // مسح الحقل بعد النجاح
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ. يرجى المحاولة مرة أخرى' });
    } finally {
      setIsSubmitting(false);
      
      // إخفاء الرسالة بعد 5 ثواني
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-900 via-transparent to-slate-900" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

      <div className="container mx-auto px-6 pt-20 pb-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* 1. Company Info (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Enhanced Logo Section */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center gap-5 bg-slate-900/80 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center border border-white/5 shadow-2xl shrink-0 group-hover:scale-105 transition-transform duration-500">
                  <Image 
                    src="/images/logo.png" 
                    alt="AMG Real Estate Logo" 
                    width={65} 
                    height={65} 
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-3xl font-black text-white tracking-tight leading-none mb-1">
                    AMG <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Group</span>
                  </h3>
                  <div className="h-px w-12 bg-gradient-to-r from-amber-500/50 to-transparent my-2"></div>
                  <p className="text-slate-300 text-sm font-medium tracking-wide">
                    مجموعة أحمد الملاح
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-slate-400 leading-relaxed text-lg font-light">
              {COMPANY_INFO.fullNameAr}. تأسست عام {COMPANY_INFO.founded}، نسعى لتقديم تجربة عقارية استثنائية تجمع بين الفخامة والابتكار.
            </p>

            {/* Contact Info */}
            <div className="space-y-4 pt-4">
              <a href={`tel:${COMPANY_INFO.phone}`} className="flex items-center gap-4 text-slate-300 hover:text-amber-400 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                  <PhoneIcon className="w-5 h-5" />
                </div>
                <span className="dir-ltr">{COMPANY_INFO.phone}</span>
              </a>
              
              <a href={`mailto:${COMPANY_INFO.email}`} className="flex items-center gap-4 text-slate-300 hover:text-amber-400 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                  <EnvelopeIcon className="w-5 h-5" />
                </div>
                <span>{COMPANY_INFO.email}</span>
              </a>

              <div className="flex items-start gap-4 text-slate-300 group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-1 group-hover:bg-amber-500/20 transition-colors">
                  <MapPinIcon className="w-5 h-5" />
                </div>
                <div className="space-y-2 text-sm leading-relaxed">
                  <p className="hover:text-white transition-colors">{COMPANY_INFO.locations.portSaid.cityAr}: {COMPANY_INFO.locations.portSaid.address}</p>
                  <p className="hover:text-white transition-colors">{COMPANY_INFO.locations.cairo.cityAr}: {COMPANY_INFO.locations.cairo.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Quick Links (2 cols) */}
          <div className="lg:col-span-2 lg:col-start-6">
            {/* Desktop View */}
            <div className="hidden lg:block">
              <h3 className="text-lg font-bold text-white mb-8 relative inline-block">
                روابط سريعة
                <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-amber-500 rounded-full"></span>
              </h3>
              <ul className="space-y-4">
                {footerNavigation.main.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-slate-400 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-amber-500 transition-colors"></span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Mobile View - Accordion */}
            <div className="lg:hidden border-b border-white/10 pb-2 mb-2">
              <Disclosure>
                {({ open }) => (
                  <>
                    <DisclosureButton className="flex w-full items-center justify-between py-4 text-right group">
                      <span className={`text-lg font-bold group-hover:text-amber-400 transition-colors ${open ? 'text-amber-500' : 'text-white'}`}>
                        روابط سريعة
                      </span>
                      {open ? (
                        <MinusIcon className="h-5 w-5 text-amber-500 transition-transform duration-300" />
                      ) : (
                        <PlusIcon className="h-5 w-5 text-slate-400 group-hover:text-amber-400 transition-transform duration-300" />
                      )}
                    </DisclosureButton>
                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <DisclosurePanel className="pb-4">
                        <ul className="space-y-3 pr-2 border-r border-white/10 mr-1">
                          {footerNavigation.main.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className="block py-1 text-slate-400 hover:text-white hover:translate-x-2 transition-all duration-300 text-sm"
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </DisclosurePanel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            </div>
          </div>

          {/* 3. Services (2 cols) */}
          <div className="lg:col-span-2">
            {/* Desktop View */}
            <div className="hidden lg:block">
              <h3 className="text-lg font-bold text-white mb-8 relative inline-block">
                خدماتنا
                <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-amber-500 rounded-full"></span>
              </h3>
              <ul className="space-y-4">
                {footerNavigation.services.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-slate-400 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-amber-500 transition-colors"></span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile View - Accordion */}
            <div className="lg:hidden border-b border-white/10 pb-2 mb-2">
              <Disclosure>
                {({ open }) => (
                  <>
                    <DisclosureButton className="flex w-full items-center justify-between py-4 text-right group">
                      <span className={`text-lg font-bold group-hover:text-amber-400 transition-colors ${open ? 'text-amber-500' : 'text-white'}`}>
                        خدماتنا
                      </span>
                      {open ? (
                        <MinusIcon className="h-5 w-5 text-amber-500 transition-transform duration-300" />
                      ) : (
                        <PlusIcon className="h-5 w-5 text-slate-400 group-hover:text-amber-400 transition-transform duration-300" />
                      )}
                    </DisclosureButton>
                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <DisclosurePanel className="pb-4">
                        <ul className="space-y-3 pr-2 border-r border-white/10 mr-1">
                          {footerNavigation.services.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className="block py-1 text-slate-400 hover:text-white hover:translate-x-2 transition-all duration-300 text-sm"
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </DisclosurePanel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            </div>
          </div>

          {/* 4. Newsletter (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-bold text-white mb-8 relative inline-block">
              النشرة البريدية
              <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-amber-500 rounded-full"></span>
            </h3>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                اشترك في نشرتنا الإخبارية للحصول على آخر الأخبار والعروض الحصرية مباشرة في بريدك الوارد.
              </p>
              
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="البريد الإلكتروني"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-slate-500 transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-3 px-6 rounded-xl font-bold shadow-lg shadow-orange-900/20 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الاشتراك...
                    </>
                  ) : (
                    'اشترك الآن'
                  )}
                </button>
                
                {message && (
                  <div className={`p-3 rounded-xl text-sm text-center animate-fade-in ${
                    message.type === 'success' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {message.text}
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-12"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Copyright */}
          <div className="text-slate-500 text-sm font-light">
            © {new Date().getFullYear()} <span className="text-slate-300 font-medium">AMG Real Estate</span>. جميع الحقوق محفوظة.
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-4">
            {[
              { icon: 'facebook', url: socialLinks.facebook, color: 'hover:bg-[#1877F2]' },
              { icon: 'instagram', url: socialLinks.instagram, color: 'hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737]' },
              { icon: 'tiktok', url: socialLinks.tiktok, color: 'hover:bg-black' },
              { icon: 'linkedin', url: socialLinks.linkedin, color: 'hover:bg-[#0A66C2]' },
            ].map((social) => social.url && (
              <a
                key={social.icon}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:-translate-y-1 ${social.color}`}
              >
                {/* Simple SVG Icons based on name */}
                {social.icon === 'facebook' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
                {social.icon === 'instagram' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>}
                {social.icon === 'tiktok' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>}
                {social.icon === 'linkedin' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap gap-6 text-sm">
            {footerNavigation.legal.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-slate-500 hover:text-amber-400 transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <WhatsAppButton position="fixed" />
    </footer>
  )
}
