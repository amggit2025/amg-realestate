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

      {/* Mini Cart Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-40 max-h-[500px] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                    <ShoppingBagIcon className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">سلة التسوق</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              {items.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium mb-2">السلة فارغة</p>
                  <p className="text-sm text-gray-400 mb-4">ابدأ بإضافة منتجات إلى سلتك</p>
                  <Link
                    href="/store/products"
                    onClick={() => setIsOpen(false)}
                    className="inline-block bg-slate-900 text-amber-400 px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors"
                  >
                    تصفح المنتجات
                  </Link>
                </div>
              ) : (
                <>
                  {/* Items List */}
                  <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        {/* Image */}
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-slate-900 truncate mb-1">
                            {item.name}
                          </h4>
                          {item.color && (
                            <p className="text-xs text-gray-500 mb-1">اللون: {item.color}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">
                              الكمية: {item.quantity}
                            </span>
                            <span className="font-bold text-sm text-slate-900">
                              {(item.price * item.quantity).toLocaleString()} ج.م
                            </span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors flex-shrink-0"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600 font-medium">الإجمالي:</span>
                      <span className="text-2xl font-black text-slate-900">
                        {total.toLocaleString()} <span className="text-sm font-medium text-gray-500">ج.م</span>
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href="/store/cart"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 text-center bg-white border border-gray-200 text-slate-900 px-4 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                      >
                        عرض السلة
                      </Link>
                      <Link
                        href="/store/checkout"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 text-center bg-slate-900 text-amber-400 px-4 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                      >
                        إتمام الشراء
                      </Link>
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
