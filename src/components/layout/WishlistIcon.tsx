'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useWishlist } from '@/contexts/WishlistContext'
import { HeartIcon, XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
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
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-40 max-h-[500px] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-rose-50 to-pink-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
                    <HeartSolidIcon className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">المفضلة</h3>
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
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HeartIcon className="w-8 h-8 text-rose-400" />
                  </div>
                  <p className="text-gray-500 font-medium mb-2">لا توجد منتجات مفضلة</p>
                  <p className="text-sm text-gray-400 mb-4">ابدأ بإضافة منتجات إلى المفضلة</p>
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
                  <div className="max-h-96 overflow-y-auto">
                    {items.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <Link
                          href={`/store/products/${item.id}`}
                          onClick={() => setIsOpen(false)}
                          className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/store/products/${item.id}`}
                            onClick={() => setIsOpen(false)}
                          >
                            <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1 hover:text-amber-600 transition-colors">
                              {item.name}
                            </h4>
                          </Link>
                          <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900">
                              {item.price.toLocaleString('ar-EG')} جنيه
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-xs text-gray-400 line-through">
                                {item.originalPrice.toLocaleString('ar-EG')}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleAddToCart(item)}
                            disabled={!item.inStock}
                            className={`p-2 rounded-lg transition-all ${
                              item.inStock
                                ? 'hover:bg-slate-900 hover:text-amber-400 text-slate-900'
                                : 'text-gray-400 cursor-not-allowed'
                            }`}
                            title={item.inStock ? 'أضف للسلة' : 'غير متوفر'}
                          >
                            <ShoppingBagIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            title="حذف من المفضلة"
                          >
                            <HeartSolidIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <Link
                      href="/store/wishlist"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center bg-slate-900 text-amber-400 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                    >
                      عرض كل المفضلة ({wishlistCount})
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
