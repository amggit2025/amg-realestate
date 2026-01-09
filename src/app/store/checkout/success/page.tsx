'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useOrders } from '@/contexts/OrdersContext'
import {
  CheckCircleIcon,
  ShoppingBagIcon,
  TruckIcon,
  DocumentTextIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const { getOrderById } = useOrders()

  const order = orderId ? getOrderById(orderId) : null

  // If no order ID, redirect to store
  useEffect(() => {
    if (!orderId) {
      router.push('/store')
    }
  }, [orderId, router])

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50 pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <SparklesIcon className="w-20 h-20 text-amber-400 mx-auto mb-6" />
              <h1 className="text-3xl font-black text-slate-900 mb-4">
                جاري التحميل...
              </h1>
            </motion.div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-28 pb-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-400 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: -20,
              opacity: 0.6
            }}
            animate={{ 
              y: window.innerHeight + 20,
              x: Math.random() * window.innerWidth
            }}
            transition={{ 
              duration: Math.random() * 3 + 2, 
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-25" />
              <div className="relative w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                <CheckCircleIcon className="w-20 h-20 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              🎉 تم إتمام طلبك بنجاح!
            </h1>
            <p className="text-xl text-gray-600">
              شكراً لك! سنبدأ بتجهيز طلبك فوراً
            </p>
          </motion.div>

          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl p-8 mb-6"
          >
            {/* Order Number */}
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-100">
              <p className="text-gray-600 mb-2">رقم الطلب</p>
              <p className="text-3xl font-black text-slate-900">
                #{order.orderNumber}
              </p>
            </div>

            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-2xl">
                <ShoppingBagIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">عدد المنتجات</p>
                <p className="text-2xl font-black text-slate-900">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-2xl">
                <DocumentTextIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">المبلغ الإجمالي</p>
                <p className="text-2xl font-black text-slate-900">
                  {order.total.toLocaleString('ar-EG')} جنيه
                </p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-2xl">
                <TruckIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">التوصيل المتوقع</p>
                <p className="text-2xl font-black text-slate-900">3-5 أيام</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <h3 className="font-black text-slate-900 mb-3">عنوان التوصيل</h3>
              <div className="text-gray-600 space-y-1">
                <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.street}, {order.shippingAddress.building}</p>
                <p>{order.shippingAddress.area}, {order.shippingAddress.city}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-amber-50 rounded-2xl p-6">
              <h3 className="font-black text-slate-900 mb-2">طريقة الدفع</h3>
              <p className="text-gray-600">
                {order.paymentMethod === 'cod' && '💵 الدفع عند الاستلام'}
                {order.paymentMethod === 'card' && '💳 بطاقة ائتمان'}
                {order.paymentMethod === 'wallet' && '📱 محفظة إلكترونية'}
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Link
              href={`/store/orders/${order.id}`}
              className="flex items-center justify-center gap-2 bg-slate-900 text-amber-400 px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all hover:scale-105 shadow-lg"
            >
              <TruckIcon className="w-6 h-6" />
              تتبع الطلب
            </Link>

            <Link
              href="/store/products"
              className="flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all hover:scale-105 shadow-lg"
            >
              <ShoppingBagIcon className="w-6 h-6" />
              متابعة التسوق
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-8"
          >
            <p className="text-gray-600 text-sm">
              📧 تم إرسال تأكيد الطلب إلى بريدك الإلكتروني
            </p>
            <p className="text-gray-600 text-sm mt-2">
              💬 لأي استفسار، تواصل معنا على{' '}
              <Link href="/contact" className="text-blue-600 hover:underline font-bold">
                صفحة الاتصال
              </Link>
            </p>
          </motion.div>

          {/* Fun Animation */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-12 text-center"
          >
            <div className="inline-block text-6xl animate-bounce">
              🎁
            </div>
            <p className="text-gray-600 mt-4 font-medium">
              نتمنى لك تجربة تسوق ممتعة!
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
