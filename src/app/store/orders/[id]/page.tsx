'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useOrders, OrderStatus } from '@/contexts/OrdersContext'
import { useToast } from '@/contexts/ToastContext'
import {
  ArrowRightIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
  ShoppingBagIcon,
  MapPinIcon,
  PhoneIcon,
  CreditCardIcon,
  DocumentTextIcon,
  PrinterIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

// Status Badge Component
function StatusBadge({ status }: { status: OrderStatus }) {
  const statusConfig = {
    pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: ClockIcon },
    confirmed: { label: 'تم التأكيد', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircleIcon },
    preparing: { label: 'قيد التجهيز', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: ShoppingBagIcon },
    shipping: { label: 'جاري الشحن', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: TruckIcon },
    delivered: { label: 'تم التوصيل', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircleIcon },
    cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircleIcon }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 ${config.color}`}>
      <Icon className="w-5 h-5" />
      {config.label}
    </div>
  )
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const { getOrderById, cancelOrder } = useOrders()
  const { showToast } = useToast()

  const order = getOrderById(orderId)

  // Handle Cancel Order
  const handleCancelOrder = () => {
    if (order && (order.status === 'pending' || order.status === 'confirmed')) {
      if (confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) {
        cancelOrder(orderId)
        showToast('تم إلغاء الطلب بنجاح', 'success')
      }
    }
  }

  // Handle Print Invoice
  const handlePrintInvoice = () => {
    window.print()
    showToast('جاري طباعة الفاتورة...', 'info')
  }

  // 404 - Order Not Found
  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50 pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <XCircleIcon className="w-20 h-20 text-red-400 mx-auto mb-6" />
            <h1 className="text-3xl font-black text-slate-900 mb-4">
              الطلب غير موجود
            </h1>
            <p className="text-gray-600 mb-8">
              لم نتمكن من العثور على الطلب المطلوب. تأكد من رقم الطلب وحاول مرة أخرى.
            </p>
            <Link
              href="/store/orders"
              className="inline-flex items-center gap-2 bg-slate-900 text-amber-400 px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
            >
              <ArrowRightIcon className="w-5 h-5" />
              العودة إلى الطلبات
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const canCancel = order.status === 'pending' || order.status === 'confirmed'

  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/store/orders"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-slate-900 transition-colors font-medium"
          >
            <ArrowRightIcon className="w-5 h-5" />
            العودة إلى الطلبات
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">
                طلب #{order.orderNumber}
              </h1>
              <p className="text-gray-600">
                تم الطلب في {order.createdAt.toLocaleDateString('ar-EG', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePrintInvoice}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-amber-400 rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
              <PrinterIcon className="w-5 h-5" />
              طباعة الفاتورة
            </button>
            
            <button
              onClick={handlePrintInvoice}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              تحميل الفاتورة
            </button>

            {canCancel && (
              <button
                onClick={handleCancelOrder}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all"
              >
                <XCircleIcon className="w-5 h-5" />
                إلغاء الطلب
              </button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <h2 className="text-xl font-black text-slate-900 mb-6">تتبع الطلب</h2>
              
              <div className="relative">
                {order.tracking?.map((track, index) => {
                  const isLast = index === order.tracking!.length - 1
                  const statusConfig = {
                    pending: { color: 'bg-yellow-500', icon: ClockIcon },
                    confirmed: { color: 'bg-blue-500', icon: CheckCircleIcon },
                    preparing: { color: 'bg-purple-500', icon: ShoppingBagIcon },
                    shipping: { color: 'bg-indigo-500', icon: TruckIcon },
                    delivered: { color: 'bg-green-500', icon: CheckCircleIcon },
                    cancelled: { color: 'bg-red-500', icon: XCircleIcon }
                  }
                  const config = statusConfig[track.status]
                  const Icon = config.icon

                  return (
                    <div key={index} className="flex gap-4 relative">
                      {/* Timeline Line */}
                      {!isLast && (
                        <div className="absolute right-6 top-12 bottom-0 w-0.5 bg-gray-200" />
                      )}

                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-full ${config.color} flex items-center justify-center flex-shrink-0 relative z-10`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-8">
                        <h3 className="font-bold text-slate-900 mb-1">{track.message}</h3>
                        <p className="text-sm text-gray-600">
                          {track.timestamp.toLocaleDateString('ar-EG', {
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <h2 className="text-xl font-black text-slate-900 mb-6">المنتجات</h2>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 border-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1">{item.name}</h3>
                      {item.color && (
                        <p className="text-sm text-gray-600 mb-2">اللون: {item.color}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">الكمية: {item.quantity}</span>
                        <span className="font-black text-slate-900">
                          {(item.price * item.quantity).toLocaleString('ar-EG')} جنيه
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Summary & Info */}
          <div className="space-y-6">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <h2 className="text-xl font-black text-slate-900 mb-6">ملخص الطلب</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold">{order.subtotal.toLocaleString('ar-EG')} جنيه</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>الشحن</span>
                  <span className="font-bold">
                    {order.shipping === 0 ? 'مجاني' : `${order.shipping.toLocaleString('ar-EG')} جنيه`}
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>الضريبة (14%)</span>
                  <span className="font-bold">{order.tax.toLocaleString('ar-EG')} جنيه</span>
                </div>
                
                <div className="pt-3 border-t-2 border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black text-slate-900">الإجمالي</span>
                    <span className="text-2xl font-black text-slate-900">
                      {order.total.toLocaleString('ar-EG')} جنيه
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <CreditCardIcon className="w-6 h-6" />
                طريقة الدفع
              </h2>
              
              <p className="text-gray-600">
                {order.paymentMethod === 'cod' && 'الدفع عند الاستلام'}
                {order.paymentMethod === 'card' && 'بطاقة ائتمان'}
                {order.paymentMethod === 'wallet' && 'محفظة إلكترونية'}
              </p>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-md p-6"
            >
              <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <MapPinIcon className="w-6 h-6" />
                عنوان الشحن
              </h2>
              
              <div className="space-y-2 text-gray-600">
                <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
                <p className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4" />
                  {order.shippingAddress.phone}
                </p>
                <div className="pt-2 border-t border-gray-100">
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.building}, الطابق {order.shippingAddress.floor || '-'}, شقة {order.shippingAddress.apartment || '-'}</p>
                  <p>{order.shippingAddress.area}, {order.shippingAddress.city}</p>
                  {order.shippingAddress.landmarks && (
                    <p className="text-sm mt-2">علامات مميزة: {order.shippingAddress.landmarks}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Need Help */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100"
            >
              <h3 className="font-black text-slate-900 mb-2">تحتاج مساعدة؟</h3>
              <p className="text-sm text-gray-600 mb-4">
                فريق الدعم متاح لمساعدتك في أي استفسار حول طلبك
              </p>
              <Link
                href="/contact"
                className="block w-full text-center bg-slate-900 text-amber-400 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                تواصل معنا
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
