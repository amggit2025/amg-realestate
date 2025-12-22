"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ContactForm from '@/components/features/ContactForm'
import FreeMap from '@/components/ui/FreeMap';
import { logger } from '@/lib/logger';
import { 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { COMPANY_INFO, SOCIAL_LINKS } from '@/lib/constants';

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

export default function ContactPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLinksData>({});

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
      logger.error('Error fetching social links:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 pt-20">
        {/* Hero Section */}
        <div className="relative pt-12 pb-20 mb-16 rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-600 to-blue-600">
          {/* Background Image */}
          <div className="absolute inset-0 bg-[url('/images/contact-hero.jpg')] bg-cover bg-center bg-no-repeat opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 to-blue-900/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-emerald-600/10" />
          <div className="relative px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                تواصل معنا
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow">
                نحن هنا لخدمتك والإجابة على جميع استفساراتك. تواصل معنا الآن وسنرد عليك في أقرب وقت ممكن
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">أرسل رسالة</h2>
                <ContactForm 
                  onSuccess={() => {
                    // Optionally scroll to success message or show notification
                  }}
                />
              </div>
            </motion.div>
            
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">معلومات الاتصال</h2>
                <p className="text-lg text-gray-600 mb-8">
                  يسعدنا تواصلك معنا بأي من الطرق التالية
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                <div className="flex items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center ml-4">
                    <PhoneIcon className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">اتصل بنا</h3>
                    <p className="text-gray-600">{COMPANY_INFO.phone}</p>
                  </div>
                </div>

                <div className="flex items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center ml-4">
                    <EnvelopeIcon className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">راسلنا</h3>
                    <p className="text-gray-600">{COMPANY_INFO.email}</p>
                  </div>
                </div>

                <div className="flex items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center ml-4">
                    <MapPinIcon className="w-7 h-7 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">زورنا - بورسعيد</h3>
                    <p className="text-gray-600">{COMPANY_INFO.locations.portSaid.address}</p>
                  </div>
                </div>

                <div className="flex items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center ml-4">
                    <MapPinIcon className="w-7 h-7 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">زورنا - القاهرة</h3>
                    <p className="text-gray-600">{COMPANY_INFO.locations.cairo.address}</p>
                  </div>
                </div>

                <div className="flex items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center ml-4">
                    <ClockIcon className="w-7 h-7 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">أوقات العمل</h3>
                    <p className="text-gray-600">السبت - الخميس: 9:00 ص - 8:00 م</p>
                    <p className="text-gray-600">الجمعة: 2:00 م - 8:00 م</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">تابعنا على</h3>
                <div className="flex gap-4">
                  {/* Facebook */}
                  {socialLinks.facebook && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all group"
                      title="Facebook"
                    >
                      <svg className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}

                  {/* Instagram */}
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-pink-50 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 hover:scale-110 transition-all group"
                      title="Instagram"
                    >
                      <svg className="w-7 h-7 text-pink-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}

                  {/* TikTok */}
                  {socialLinks.tiktok && (
                    <a
                      href={socialLinks.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-black hover:scale-110 transition-all group"
                      title="TikTok"
                    >
                      <svg className="w-7 h-7 text-gray-800 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </a>
                  )}

                  {/* LinkedIn */}
                  {socialLinks.linkedin && (
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all group"
                      title="LinkedIn"
                    >
                      <svg className="w-7 h-7 text-blue-700 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">موقعنا على الخريطة</h2>
            <p className="text-xl text-gray-600">يمكنك العثور علينا هنا - بورسعيد، مصر</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="h-96"
          >
            <FreeMap 
              lat={31.2568} 
              lng={32.2910} 
              address="بورسعيد، مصر" 
              className="h-full w-full"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              هل تريد بدء مشروعك الآن؟
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              لا تتردد في الاتصال بنا اليوم وسنساعدك في تحويل أحلامك إلى واقع
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <PhoneIcon className="w-5 h-5 ml-2" />
                اتصل بنا الآن
              </a>
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                💬 واتساب
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
