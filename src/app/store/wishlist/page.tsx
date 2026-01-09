'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'
import { 
  HeartIcon,
  ShoppingBagIcon,
  TrashIcon,
  ArrowLeftIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { showToast } = useToast()

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    })
    showToast('تم إضافة المنتج إلى السلة', 'success')
  }

  const handleRemove = (productId: number, productName: string) => {
    removeFromWishlist(productId)
    showToast(`تم حذف ${productName} من المفضلة`, 'success')
  }

  const handleClearAll = () => {
    if (confirm('هل تريد حذف جميع المنتجات من المفضلة؟')) {
      clearWishlist()
      showToast('تم مسح جميع المنتجات من المفضلة', 'success')
    }
  }

  // Empty State
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
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center">
                <HeartIcon className="w-16 h-16 text-rose-400" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-4">
                قائمة المفضلة فارغة
              </h1>
              <p className="text-gray-600 mb-8">
                لم تقم بإضافة أي منتجات إلى المفضلة حتى الآن. ابدأ باستكشاف منتجاتنا المميزة!
              </p>
              <Link
                href="/store/products"
                className="inline-flex items-center gap-2 bg-slate-900 text-amber-400 px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all hover:scale-105"
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
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black text-slate-900 mb-2">
              المفضلة
            </h1>
            <p className="text-gray-600">
              لديك {items.length} {items.length === 1 ? 'منتج' : 'منتجات'} في المفضلة
            </p>
          </motion.div>

          <motion.button
            onClick={handleClearAll}
            className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-bold"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            مسح الكل
          </motion.button>
        </div>

        {/* Products Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          layout
        >
          <AnimatePresence mode="popLayout">
            {items.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all"
              >
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden">
                  <Link href={`/store/products/${product.id}`}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </Link>

                  {/* Remove from Wishlist Button */}
                  <motion.button
                    onClick={() => handleRemove(product.id, product.name)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-rose-600 hover:bg-rose-600 hover:text-white transition-all z-10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <HeartSolidIcon className="w-5 h-5" />
                  </motion.button>

                  {/* Stock Badge */}
                  {!product.inStock && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                      غير متوفر
                    </div>
                  )}

                  {/* Discount Badge */}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-amber-400 text-slate-900 text-sm font-black rounded-full">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/store/products/${product.id}`}>
                    <p className="text-sm text-amber-600 font-bold mb-1">
                      {product.category}
                    </p>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 hover:text-amber-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 mr-2">
                      ({product.rating})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-black text-slate-900">
                      {product.price.toLocaleString('ar-EG')} جنيه
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        {product.originalPrice.toLocaleString('ar-EG')}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                        product.inStock
                          ? 'bg-slate-900 text-amber-400 hover:bg-slate-800'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      whileHover={product.inStock ? { scale: 1.02 } : {}}
                      whileTap={product.inStock ? { scale: 0.98 } : {}}
                    >
                      <ShoppingBagIcon className="w-5 h-5" />
                      {product.inStock ? 'أضف للسلة' : 'غير متوفر'}
                    </motion.button>

                    <motion.button
                      onClick={() => handleRemove(product.id, product.name)}
                      className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Continue Shopping */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/store/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl"
          >
            <ArrowLeftIcon className="w-5 h-5 rotate-180" />
            تصفح المزيد من المنتجات
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
