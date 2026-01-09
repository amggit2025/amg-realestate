'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { ShoppingBagIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function CartIcon() {
  const { items, getItemsCount, getTotal, removeFromCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const itemsCount = getItemsCount()
  const total = getTotal()

  return (
    <div className="relative">
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
        aria-label="سلة التسوق"
      >
        <ShoppingBagIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
        {itemsCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg animate-pulse border-2 border-white">
            {itemsCount > 99 ? '99+' : itemsCount}
          </span>
        )}
      </button>

      {/* Cart Drawer (Sliding Sidebar) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-screen w-[90%] sm:w-[420px] bg-white z-[101] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-slate-900 to-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg">
                      <ShoppingBagIcon className="h-5 w-5 text-slate-900" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">سلة التسوق</h3>
                      <p className="text-xs text-gray-300">
                        {itemsCount} {itemsCount === 1 ? 'منتج' : 'منتجات'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBagIcon className="w-16 h-16 text-gray-400" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-2">السلة فارغة</h4>
                  <p className="text-gray-500 mb-6">ابدأ بإضافة منتجات إلى سلتك</p>
                  <Link
                    href="/store/products"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-2 bg-slate-900 text-amber-400 px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
                  >
                    <ShoppingBagIcon className="w-5 h-5" />
                    تصفح المنتجات
                  </Link>
                </div>
              ) : (
                <>
                  {/* Items List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <AnimatePresence mode="popLayout">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 50, height: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                        >
                          {/* Image */}
                          <Link
                            href={`/store/products/${item.id}`}
                            onClick={() => setIsOpen(false)}
                            className="relative w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0 border-2 border-gray-100 hover:border-amber-400 transition-colors"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </Link>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/store/products/${item.id}`}
                              onClick={() => setIsOpen(false)}
                            >
                              <h4 className="font-bold text-sm text-slate-900 mb-1 hover:text-amber-600 transition-colors line-clamp-2">
                                {item.name}
                              </h4>
                            </Link>
                            {item.color && (
                              <p className="text-xs text-gray-500 mb-1.5">اللون: <span className="font-medium">{item.color}</span></p>
                            )}
                            <div className="flex items-center justify-between mt-1.5">
                              <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-gray-200">
                                <span className="text-[10px] text-gray-600 font-medium">الكمية:</span>
                                <span className="font-bold text-sm text-slate-900">{item.quantity}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-black text-slate-900">
                                  {(item.price * item.quantity).toLocaleString()}
                                </div>
                                <div className="text-[10px] text-gray-500">جنيه</div>
                              </div>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                            title="حذف من السلة"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Footer with Summary */}
                  <div className="border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 p-4 pb-6">
                    {/* Subtotal */}
                    <div className="space-y-1.5 mb-3 pb-3 border-b border-gray-200">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>المجموع الفرعي</span>
                        <span className="font-bold">{total.toLocaleString()} ج.م</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>الشحن</span>
                        <span className="font-bold text-green-600">مجاني</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-base font-bold text-gray-700">الإجمالي:</span>
                      <div className="text-right">
                        <div className="text-2xl font-black text-slate-900">
                          {total.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">جنيه مصري</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Link
                        href="/store/checkout"
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-center bg-slate-900 text-amber-400 px-4 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg"
                      >
                        إتمام الشراء
                      </Link>
                      <Link
                        href="/store/cart"
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-center bg-white border-2 border-gray-200 text-slate-900 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 hover:border-slate-900 transition-all"
                      >
                        عرض السلة الكاملة
                      </Link>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-center bg-gray-100 text-gray-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                      >
                        متابعة التسوق
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
