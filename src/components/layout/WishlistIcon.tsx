'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useWishlist } from '@/contexts/WishlistContext'
import { HeartIcon, XMarkIcon, ShoppingBagIcon, TrashIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'

export default function WishlistIcon() {
  const { items, wishlistCount, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    })
    showToast('تم إضافة المنتج إلى السلة', 'success')
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Wishlist Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200 group"
        aria-label="المفضلة"
      >
        {wishlistCount > 0 ? (
          <HeartSolidIcon className="h-6 w-6 text-rose-500 group-hover:scale-110 transition-transform" />
        ) : (
          <HeartIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
        )}
        {wishlistCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600 rounded-full shadow-lg animate-pulse border-2 border-white">
            {wishlistCount > 99 ? '99+' : wishlistCount}
          </span>
        )}
      </button>

      {/* Mini Wishlist Dropdown */}
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
              initial={{ opacity: 0, y: 10, x: '-50%', scale: 0.95 }}
              animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
              exit={{ opacity: 0, y: 10, x: '-50%', scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-1/2 top-full mt-3 w-[300px] sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden flex flex-col items-center"
              style={{ transform: 'translateX(-50%)' }}
            >
              {/* Arrow Tooltip */}
              <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-100 z-0"></div>

              {/* Header */}
              <div className="relative w-full p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">المفضلة</h3>
                  <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              {items.length === 0 ? (
                <div className="p-8 pb-10 text-center w-full">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                     <span className="absolute inset-0 bg-blue-100/50 rounded-full scale-110 animate-pulse"></span>
                     <div className="relative w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                        <HeartIcon className="w-9 h-9 text-blue-400" />
                     </div>
                  </div>
                  <h4 className="text-gray-900 font-bold mb-2">قائمة الرغبات فارغة</h4>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    استكشف منتجاتنا المميزة وأضف ما يعجبك هنا
                  </p>
                  <Link
                    href="/store/products"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    تصفح المتجر
                    <span className="text-lg">🛍️</span>
                  </Link>
                </div>
              ) : (
                <>
                  {/* Items List */}
                  <div className="max-h-[350px] overflow-y-auto w-full px-2 py-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-200">
                    <AnimatePresence mode="popLayout">
                    {items.slice(0, 3).map((item) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={item.id}
                        className="group flex gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200"
                      >
                        {/* Image */}
                        <Link
                          href={`/store/products/${item.id}`}
                          onClick={() => setIsOpen(false)}
                          className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <Link
                            href={`/store/products/${item.id}`}
                            onClick={() => setIsOpen(false)}
                          >
                            <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                              {item.name}
                            </h4>
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-bold text-slate-800">
                              {item.price.toLocaleString('ar-EG')} جنيه
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-xs text-gray-400 line-through">
                                {item.originalPrice.toLocaleString('ar-EG')}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col justify-center gap-1.5 pl-1">
                          <button
                            onClick={() => handleAddToCart(item)}
                            disabled={!item.inStock}
                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                              item.inStock
                                ? 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-sm'
                                : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                            }`}
                            title={item.inStock ? 'أضف للسلة' : 'غير متوفر'}
                          >
                            <ShoppingBagIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all hover:shadow-sm"
                            title="حذف من المفضلة"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    </AnimatePresence>
                  </div>

                  {/* Footer */}
                  <div className="p-3 w-full bg-gray-50/80 border-t border-gray-100 backdrop-blur-sm">
                    <Link
                      href="/store/wishlist"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all text-sm group"
                    >
                      <span>عرض كل المنتجات</span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        {wishlistCount}
                      </span>
                    </Link>
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
