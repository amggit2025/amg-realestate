'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  HomeIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'

interface Property {
  id: string
  title: string
  city: string
  district: string
  price: number
  currency: string
  propertyType: string
  images: Array<{ url: string }>
}

export default function BookAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const propertyIdFromUrl = searchParams.get('propertyId')

  const [step, setStep] = useState(1) // 1: Select Property, 2: Fill Form, 3: Success
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    timeSlot: '',
    notes: '',
  })

  const timeSlots = [
    'صباحاً (9:00 - 12:00)',
    'ظهراً (12:00 - 3:00)',
    'عصراً (3:00 - 6:00)',
    'مساءً (6:00 - 9:00)',
  ]

  // Fetch properties
  useEffect(() => {
    fetchProperties()
  }, [])

  // Auto-select property if ID in URL
  useEffect(() => {
    if (propertyIdFromUrl && properties.length > 0) {
      const property = properties.find(p => p.id === propertyIdFromUrl)
      if (property) {
        setSelectedProperty(property)
        setStep(2)
      }
    }
  }, [propertyIdFromUrl, properties])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties/public?limit=50')
      const data = await response.json()
      if (data.properties && data.properties.length > 0) {
        setProperties(data.properties)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const formatPrice = (price: number, currency: string) => {
    const formatter = new Intl.NumberFormat('ar-EG')
    return `${formatter.format(price)} ${currency === 'EGP' ? 'ج.م' : '$'}`
  }

  const filteredProperties = properties.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.district.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProperty || !form.name || !form.email || !form.phone || !form.date || !form.timeSlot) {
      alert('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: selectedProperty.id,
          contactName: form.name,
          contactEmail: form.email,
          contactPhone: form.phone,
          appointmentDate: form.date,
          timeSlot: form.timeSlot,
          notes: form.notes || `حجز معاينة لعقار: ${selectedProperty.title}`,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStep(3) // Success
      } else {
        alert(data.message || 'حدث خطأ أثناء حجز الموعد')
      }
    } catch (error) {
      console.error('Error booking appointment:', error)
      alert('حدث خطأ أثناء حجز الموعد')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 pt-36 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-xl mb-6">
            <CalendarDaysIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">حجز موعد معاينة</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            احجز موعدك لمعاينة العقار المناسب لك. سيتم التواصل معك لتأكيد الموعد.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            {[
              { num: 1, label: 'اختر العقار' },
              { num: 2, label: 'بيانات الحجز' },
              { num: 3, label: 'تأكيد' },
            ].map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all ${
                  step >= s.num 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.num ? <CheckCircleIcon className="w-6 h-6" /> : s.num}
                </div>
                <span className={`mr-2 text-sm font-medium ${step >= s.num ? 'text-purple-600' : 'text-gray-400'}`}>
                  {s.label}
                </span>
                {index < 2 && (
                  <div className={`w-12 h-1 mx-4 rounded-full ${step > s.num ? 'bg-purple-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Select Property */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Search */}
            <div className="relative mb-6">
              <MagnifyingGlassIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن عقار بالاسم أو المدينة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-20">
                <HomeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">لا توجد عقارات متاحة</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProperties.map((property) => (
                  <motion.div
                    key={property.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => { setSelectedProperty(property); setStep(2); }}
                    className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedProperty?.id === property.id 
                        ? 'border-purple-600 ring-2 ring-purple-200' 
                        : 'border-transparent hover:border-purple-300'
                    }`}
                  >
                    <div className="h-40 relative">
                      {property.images[0] ? (
                        <img
                          src={property.images[0].url}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                          <HomeIcon className="w-16 h-16 text-white/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{property.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{property.city} - {property.district}</p>
                      <p className="text-purple-600 font-bold">{formatPrice(property.price, property.currency)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Skip to browse */}
            <div className="text-center mt-8">
              <Link href="/listings" className="text-purple-600 hover:text-purple-700 font-medium">
                أو تصفح جميع العقارات المتاحة ←
              </Link>
            </div>
          </motion.div>
        )}

        {/* Step 2: Fill Form */}
        {step === 2 && selectedProperty && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl mx-auto"
          >
            {/* Selected Property Card */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center gap-4">
              {selectedProperty.images[0] && (
                <img
                  src={selectedProperty.images[0].url}
                  alt={selectedProperty.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{selectedProperty.title}</h3>
                <p className="text-sm text-gray-600">{selectedProperty.city}</p>
                <p className="text-purple-600 font-bold">{formatPrice(selectedProperty.price, selectedProperty.currency)}</p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                تغيير
              </button>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <UserIcon className="w-6 h-6 text-purple-600" />
                بيانات الحجز
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <UserIcon className="w-4 h-4 inline ml-1" />
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="أدخل اسمك الكامل"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <PhoneIcon className="w-4 h-4 inline ml-1" />
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <EnvelopeIcon className="w-4 h-4 inline ml-1" />
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <CalendarDaysIcon className="w-4 h-4 inline ml-1" />
                    تاريخ المعاينة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={getMinDate()}
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <ClockIcon className="w-4 h-4 inline ml-1" />
                    وقت المعاينة <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.timeSlot}
                    onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">اختر الوقت المناسب</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ملاحظات إضافية (اختياري)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="أي ملاحظات أو متطلبات خاصة..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  <ArrowRightIcon className="w-5 h-5 inline ml-2" />
                  رجوع
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      جاري الحجز...
                    </>
                  ) : (
                    <>
                      <CalendarDaysIcon className="w-5 h-5" />
                      تأكيد الحجز
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <CheckCircleIcon className="w-14 h-14 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">تم الحجز بنجاح! 🎉</h2>
              <p className="text-gray-600 text-lg mb-8">
                شكراً لك! تم استلام طلب حجز المعاينة.<br />
                سيتم التواصل معك خلال 24 ساعة لتأكيد الموعد.
              </p>
              
              <div className="bg-purple-50 rounded-xl p-4 mb-8">
                <p className="text-sm text-purple-600">
                  📧 تم إرسال تفاصيل الحجز إلى بريدك الإلكتروني
                </p>
              </div>

              <div className="flex gap-4">
                <Link href="/listings" className="flex-1">
                  <button className="w-full px-6 py-3 border border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                    تصفح المزيد
                  </button>
                </Link>
                <Link href="/" className="flex-1">
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-colors">
                    الصفحة الرئيسية
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
