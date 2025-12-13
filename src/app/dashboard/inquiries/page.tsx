'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  XMarkIcon,
  TrashIcon,
  EyeIcon,
  HomeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { formatDistanceToNow, format } from 'date-fns';
import { ar } from 'date-fns/locale';
import Link from 'next/link';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  inquiryType: string;
  status: string;
  createdAt: string;
  property?: {
    id: string;
    title: string;
    images: { url: string }[];
    city: string;
    price: number;
    currency: string;
  };
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    let filtered = [...inquiries];

    // Apply status filter
    if (filter === 'unread') {
      filtered = filtered.filter(i => i.status === 'PENDING');
    } else if (filter === 'read') {
      filtered = filtered.filter(i => i.status !== 'PENDING');
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(i =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredInquiries(filtered);
  }, [filter, searchQuery, inquiries]);

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/user/inquiries', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries || []);
        setFilteredInquiries(data.inquiries || []);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/user/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'READ' }),
        credentials: 'include',
      });

      setInquiries(inquiries.map(i =>
        i.id === id ? { ...i, status: 'READ' } : i
      ));
    } catch (error) {
      console.error('Error marking inquiry as read:', error);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الاستفسار؟')) return;

    try {
      await fetch(`/api/user/inquiries/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      setInquiries(inquiries.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString('ar-EG')} ${currency === 'EGP' ? 'ج.م' : '$'}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">جديد</span>;
      case 'READ':
        return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">مقروء</span>;
      case 'RESPONDED':
        return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">تم الرد</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <EnvelopeIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">الاستفسارات</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {inquiries.filter(i => i.status === 'PENDING').length > 0 ? (
                    <span className="text-purple-600 font-semibold">
                      لديك {inquiries.filter(i => i.status === 'PENDING').length} استفسار جديد
                    </span>
                  ) : (
                    'لا توجد استفسارات جديدة'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            {/* Filter Tabs */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                الكل ({inquiries.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'unread'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                جديد ({inquiries.filter(i => i.status === 'PENDING').length})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'read'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                مقروء ({inquiries.filter(i => i.status !== 'PENDING').length})
              </button>
            </div>

            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في الاستفسارات..."
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Inquiries List */}
        {filteredInquiries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <EnvelopeIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد استفسارات</h3>
            <p className="text-gray-600">
              {searchQuery ? 'لم يتم العثور على نتائج للبحث' : 'ستظهر استفساراتك هنا'}
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {filteredInquiries.map((inquiry, index) => (
                <motion.div
                  key={inquiry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden border-r-4 ${
                    inquiry.status === 'PENDING' ? 'border-purple-500 bg-purple-50/30' : 'border-transparent'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{inquiry.subject}</h3>
                          {getStatusBadge(inquiry.status)}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <UserIcon className="w-4 h-4" />
                            <span>{inquiry.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <EnvelopeIcon className="w-4 h-4" />
                            <a href={`mailto:${inquiry.email}`} className="hover:text-purple-600">
                              {inquiry.email}
                            </a>
                          </div>
                          {inquiry.phone && (
                            <div className="flex items-center gap-1">
                              <PhoneIcon className="w-4 h-4" />
                              <a href={`tel:${inquiry.phone}`} className="hover:text-purple-600">
                                {inquiry.phone}
                              </a>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true, locale: ar })}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {inquiry.status === 'PENDING' && (
                          <button
                            onClick={() => markAsRead(inquiry.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="تحديد كمقروء"
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteInquiry(inquiry.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Property Info */}
                    {inquiry.property && (
                      <Link
                        href={`/listings/${inquiry.property.id}`}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4 hover:bg-gray-100 transition-colors group"
                      >
                        {inquiry.property.images[0] && (
                          <img
                            src={inquiry.property.images[0].url}
                            alt={inquiry.property.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {inquiry.property.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {inquiry.property.city} - {formatPrice(inquiry.property.price, inquiry.property.currency)}
                          </p>
                        </div>
                        <EyeIcon className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                      </Link>
                    )}

                    {/* Message */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {inquiry.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <a
                        href={`mailto:${inquiry.email}?subject=رد على: ${inquiry.subject}`}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                      >
                        <EnvelopeIcon className="w-4 h-4" />
                        الرد عبر البريد
                      </a>
                      {inquiry.phone && (
                        <a
                          href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً، بخصوص استفسارك عن: ' + inquiry.subject)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-2 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.75-1.866-.75-1.866-1.008-2.313-.248-.428-.512-.37-.704-.377-.18-.007-.384-.007-.584-.007s-.527.074-.804.372c-.277.297-1.057 1.033-1.057 2.521s1.082 2.924 1.232 3.122c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                          </svg>
                          واتساب
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
