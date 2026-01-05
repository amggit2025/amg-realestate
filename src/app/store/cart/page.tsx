'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { 
  TrashIcon, 
  MinusIcon, 
  PlusIcon,
  ShoppingBagIcon,
  ArrowLeftIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCart()
  
  const total = getTotal()
  const shipping = total > 0 ? (total >= 50000 ? 0 : 100) : 0
  const tax = total * 0.14 // 14% VAT
  const grandTotal = total + shipping + tax

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBagIcon className="w-16 h-16 text-gray-300" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-4">
                سلة التسوق فارغة
              </h1>
              <p className="text-gray-600 mb-8">
                لم تقم بإضافة أي منتجات إلى سلة التسوق حتى الآن
              </p>
              <Link
                href="/store/products"
                className="inline-flex items-center gap-2 bg-slate-900 text-amber-400 px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 rotate-180" />
                تصفح المنتجات
              </Link>
            </motion.div>
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
              href="/store/products"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 rotate-180 text-gray-600" />
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900">
              سلة التسوق
            </h1>
          </div>
          <p className="text-gray-600">
            لديك <span className="font-bold text-slate-900">{items.length}</span> منتج في السلة
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="flex gap-6">
                  {/* Image */}
                  <Link 
                    href={`/store/products/${item.id}`}
                    className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 group"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <Link 
                          href={`/store/products/${item.id}`}
                          className="font-bold text-lg text-slate-900 hover:text-amber-600 transition-colors mb-2 block"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-500">الفئة: <span className="text-slate-900 font-medium">{item.category}</span></span>
                          {item.color && (
                            <span className="text-gray-500">اللون: <span className="text-slate-900 font-medium">{item.color}</span></span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-xl">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:text-amber-600 transition-colors"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:text-amber-600 transition-colors"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-slate-900">
                          {(item.price * item.quantity).toLocaleString()} <span className="text-sm font-medium text-gray-400">ج.م</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.price.toLocaleString()} ج.م × {item.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Clear Cart Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={clearCart}
              className="w-full py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors border border-red-200"
            >
              إفراغ السلة
            </motion.button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-32"
            >
              <h2 className="text-xl font-black text-slate-900 mb-6">ملخص الطلب</h2>
              
              <div className="space-y-4 mb-6">
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
                
                {total < 50000 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm">
                    <p className="text-amber-800">
                      أضف <span className="font-bold">{(50000 - total).toLocaleString()} ج.م</span> للحصول على شحن مجاني!
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold text-slate-900">الإجمالي:</span>
                  <div className="text-right">
                    <div className="text-3xl font-black text-slate-900">
                      {grandTotal.toLocaleString()} <span className="text-base font-medium text-gray-400">ج.م</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">شامل جميع الضرائب</p>
                  </div>
                </div>
              </div>

              <Link
                href="/store/checkout"
                className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-amber-400 py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-amber-500/10 transition-all flex items-center justify-center gap-2 group mb-3"
              >
                <ShoppingBagIcon className="w-6 h-6 group-hover:animate-bounce" />
                إتمام الشراء
              </Link>

              <Link
                href="/store/products"
                className="w-full border border-gray-200 text-slate-900 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeftIcon className="w-5 h-5 rotate-180" />
                مواصلة التسوق
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>دفع آمن ومشفر</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span>ضمان استرجاع 14 يوم</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <span>دعم فني على مدار الساعة</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
