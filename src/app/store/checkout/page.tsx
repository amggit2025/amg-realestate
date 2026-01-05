'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/lib/AuthContext'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  TruckIcon,
  CreditCardIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  
  const [checkoutAs, setCheckoutAs] = useState<'guest' | 'member'>('guest')
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cash',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const total = getTotal()
  const shipping = total >= 50000 ? 0 : 100
  const tax = total * 0.14
  const grandTotal = total + shipping + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate order processing
    setTimeout(() => {
      // Clear cart
      clearCart()
      
      // Show success message
      alert('تم استلام طلبك بنجاح! سنتواصل معك قريباً.')
      
      // Redirect to success page or home
      router.push('/store')
    }, 2000)
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-16 h-16 text-gray-300" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4">
              لا توجد منتجات للشراء
            </h1>
            <p className="text-gray-600 mb-8">
              يجب إضافة منتجات إلى السلة أولاً
            </p>
            <Link
              href="/store/products"
              className="inline-flex items-center gap-2 bg-slate-900 text-amber-400 px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 rotate-180" />
              تصفح المنتجات
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/store/cart"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 rotate-180 text-gray-600" />
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900">
              إتمام الشراء
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Checkout As (Guest/Member) */}
              {!isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100"
                >
                  <h2 className="text-xl font-bold text-slate-900 mb-4">اختر طريقة الشراء</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setCheckoutAs('guest')}
                      className={`p-6 rounded-xl border-2 transition-all text-right ${
                        checkoutAs === 'guest'
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          checkoutAs === 'guest' ? 'border-slate-900' : 'border-gray-300'
                        }`}>
                          {checkoutAs === 'guest' && (
                            <div className="w-3 h-3 rounded-full bg-slate-900"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 mb-1">شراء كضيف</h3>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>✓ أسرع وأسهل</li>
                            <li>✓ لا يتطلب إنشاء حساب</li>
                          </ul>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => router.push('/auth/login?redirect=/store/checkout')}
                      className="p-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all text-right"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 mb-1">الشراء بحسابك</h3>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>✓ تتبع الطلبات</li>
                            <li>✓ نقاط ولاء ومكافآت</li>
                          </ul>
                        </div>
                      </div>
                      <span className="text-blue-600 text-sm font-medium">سجل دخول →</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100"
              >
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <UserIcon className="w-6 h-6" />
                  معلومات الاتصال
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      الاسم الأول *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      الاسم الأخير *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 border border-gray-100"
              >
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <MapPinIcon className="w-6 h-6" />
                  عنوان التوصيل
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      العنوان الكامل *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="رقم الشارع، اسم الحي، رقم المبنى"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        المدينة *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        الرمز البريدي
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 border border-gray-100"
              >
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <CreditCardIcon className="w-6 h-6" />
                  طريقة الدفع
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-slate-900 transition-all">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-slate-900 focus:ring-amber-500"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-slate-900">الدفع عند الاستلام</div>
                      <div className="text-sm text-gray-600">ادفع نقداً عند استلام طلبك</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-slate-900 transition-all opacity-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      disabled
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-slate-900">الدفع الإلكتروني</div>
                      <div className="text-sm text-gray-600">قريباً - فيزا، ماستركارد، فوري</div>
                    </div>
                  </label>
                </div>
              </motion.div>

              {/* Order Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-6 border border-gray-100"
              >
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  ملاحظات الطلب (اختياري)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="أي تعليمات خاصة للتوصيل..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-amber-400 py-5 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-amber-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'جاري معالجة الطلب...' : `تأكيد الطلب - ${grandTotal.toLocaleString()} ج.م`}
              </motion.button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-32"
            >
              <h2 className="text-xl font-black text-slate-900 mb-6">ملخص الطلب</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                      <p className="text-sm font-bold text-slate-900">
                        {(item.price * item.quantity).toLocaleString()} ج.م
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold text-slate-900">{total.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>الشحن:</span>
                  <span className="font-bold text-slate-900">
                    {shipping === 0 ? (
                      <span className="text-green-600">مجاناً</span>
                    ) : (
                      `${shipping.toLocaleString()} ج.م`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>الضريبة (14%):</span>
                  <span className="font-bold text-slate-900">{tax.toLocaleString()} ج.م</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-lg font-bold text-slate-900">الإجمالي:</span>
                  <div className="text-right">
                    <div className="text-3xl font-black text-slate-900">
                      {grandTotal.toLocaleString()} <span className="text-base font-medium text-gray-400">ج.م</span>
                    </div>
                    <p className="text-xs text-gray-500">شامل جميع الضرائب</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
