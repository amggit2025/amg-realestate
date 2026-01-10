'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'
import { 
  HeartIcon,
  ShoppingBagIcon,
  TrashIcon,
  ArrowLeftIcon,
  StarIcon,
  ChartBarIcon,
  BellIcon,
  ShareIcon,
  FolderIcon,
  CheckIcon,
  XMarkIcon,
  ArchiveBoxIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { showToast } = useToast()
  
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([])
  const [showComparisonModal, setShowComparisonModal] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showShareModal, setShowShareModal] = useState(false)

  // Calculate stats
  const totalValue = items.reduce((sum, item) => sum + item.price, 0)
  const inStockCount = items.filter(item => item.inStock !== false).length
  const outOfStockCount = items.length - inStockCount

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(items.map(item => item.category || 'أخرى')))]

  const filteredItems = filterCategory === 'all' 
    ? items 
    : items.filter(item => (item.category || 'أخرى') === filterCategory)

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
    setSelectedForComparison(prev => prev.filter(id => id !== productId))
    showToast(`تم حذف ${productName} من المفضلة`, 'success')
  }

  const handleClearAll = () => {
    if (confirm('هل تريد حذف جميع المنتجات من المفضلة؟')) {
      clearWishlist()
      setSelectedForComparison([])
      showToast('تم مسح جميع المنتجات من المفضلة', 'success')
    }
  }

  const toggleCompareSelection = (productId: number) => {
    if (selectedForComparison.includes(productId)) {
      setSelectedForComparison(prev => prev.filter(id => id !== productId))
    } else {
      if (selectedForComparison.length >= 3) {
        showToast('يمكنك مقارنة 3 منتجات كحد أقصى', 'info')
        return
      }
      setSelectedForComparison(prev => [...prev, productId])
    }
  }

  const handleCompare = () => {
    if (selectedForComparison.length < 2) {
      showToast('اختر منتجين على الأقل للمقارنة', 'info')
      return
    }
    setShowComparisonModal(true)
  }

  const handleShare = () => {
    const wishlistUrl = window.location.href
    navigator.clipboard.writeText(wishlistUrl)
    showToast('تم نسخ رابط المفضلة', 'success')
  }

  // Empty State
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/50 backdrop-blur-lg rounded-3xl p-12 shadow-xl border border-white/50"
            >
              <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center shadow-inner relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/40 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <HeartIcon className="w-20 h-20 text-rose-500 animate-pulse" />
              </div>
              <h1 className="text-4xl font-black text-slate-900 mb-4">
                القائمة فارغة
              </h1>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                لم تقم بإضافة أي منتجات إلى المفضلة حتى الآن.<br/>ابدأ رحلة التسوق واستكشف منتجاتنا المميزة!
              </p>
              <Link
                href="/store/products"
                className="inline-flex items-center gap-3 bg-slate-900 text-amber-400 px-10 py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all hover:scale-105 shadow-xl hover:shadow-2xl text-lg group"
              >
                <ArrowLeftIcon className="w-6 h-6 rotate-180 group-hover:-translate-x-1 transition-transform" />
                تصفح المنتجات
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
    )
  }

  const selectedProducts = items.filter(item => selectedForComparison.includes(item.id))

  return (
    <main className="min-h-screen bg-gray-50 pt-32 pb-20 overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-blue-100/30 blur-[100px]" />
        <div className="absolute top-[40%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-100/30 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-5xl font-black text-slate-900 mb-4 flex items-center gap-4">
                <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">المفضلة</span>
                <HeartSolidIcon className="w-12 h-12 text-rose-500 drop-shadow-lg" />
              </h1>
              <p className="text-xl text-gray-500 font-medium">
                قم بإدارة قائمة رغباتك، قارن المنتجات، وشاركها مع أصدقائك
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-wrap items-center gap-3"
            >
              <button
                onClick={() => setShowShareModal(true)}
                className="px-6 py-3 bg-white text-slate-700 rounded-2xl hover:bg-slate-50 transition-all font-bold flex items-center gap-2 shadow-sm border border-gray-200 hover:border-blue-300 group"
              >
                <ShareIcon className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                مشاركة القائمة
              </button>

              {selectedForComparison.length >= 2 && (
                <button
                  onClick={handleCompare}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-bold flex items-center gap-2 shadow-lg hover:shadow-indigo-200 hover:-translate-y-1 active:translate-y-0"
                >
                  <ChartBarIcon className="w-5 h-5" />
                  مقارنة ({selectedForComparison.length})
                </button>
              )}

              <button
                onClick={handleClearAll}
                className="px-6 py-3 bg-white text-rose-600 hover:bg-rose-50 rounded-2xl transition-all font-bold flex items-center gap-2 shadow-sm border border-gray-200 hover:border-rose-200 group"
              >
                <TrashIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                مسح الكل
              </button>
            </motion.div>
          </div>

          {/* Stats & Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Stats Cards */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">القيمة الإجمالية</p>
                  <p className="text-3xl font-black text-slate-900">{totalValue.toLocaleString('ar-EG')}</p>
                </div>
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <TagIcon className="w-7 h-7 text-blue-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">المنتجات المتوفرة</p>
                  <p className="text-3xl font-black text-green-600">{inStockCount}</p>
                </div>
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <ArchiveBoxIcon className="w-7 h-7 text-green-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">عناصر المقارنة</p>
                  <p className="text-3xl font-black text-indigo-600">{selectedForComparison.length}<span className="text-lg text-gray-400 font-normal">/3</span></p>
                </div>
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <ChartBarIcon className="w-7 h-7 text-indigo-600" />
                </div>
              </motion.div>
            </div>

            {/* Categories Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FolderIcon className="w-5 h-5 text-gray-500" />
                تصفية حسب الفئة
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      filterCategory === cat
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'all' ? 'الكل' : cat}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Products Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((product, index) => {
              const isSelected = selectedForComparison.includes(product.id)
              
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 relative group overflow-hidden border ${
                    isSelected ? 'border-indigo-500 ring-4 ring-indigo-500/20' : 'border-gray-100'
                  }`}
                >
                  {/* Compare Toggle */}
                  <div className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleCompareSelection(product.id)
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
                        isSelected 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-white text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                      title="إضافة للمقارنة"
                    >
                      {isSelected ? <CheckIcon className="w-5 h-5" /> : <ChartBarIcon className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Remove Button */}
                  <div className="absolute top-4 right-4 z-20">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleRemove(product.id, product.name)
                      }}
                      className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-rose-500 shadow-sm hover:bg-rose-500 hover:text-white transition-all transform hover:scale-110 hover:shadow-rose-200"
                    >
                      <HeartSolidIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Image Container */}
                  <Link href={`/store/products/${product.id}`} className="block relative h-80 overflow-hidden bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                    
                    {/* Status Badges */}
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center">
                      {product.inStock === false && (
                        <div className="bg-red-500/90 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                          <BellIcon className="w-3.5 h-3.5" />
                          غير متوفر
                        </div>
                      )}
                      
                      {product.category && (
                        <div className="bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          {product.category}
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6">
                    <Link href={`/store/products/${product.id}`}>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-end justify-between mb-6">
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">السعر الحالي</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-slate-900">{product.price.toLocaleString('ar-EG')}</span>
                          <span className="text-sm font-bold text-gray-500">ج.م</span>
                        </div>
                      </div>
                      
                      {product.rating && (
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                          <StarIcon className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-bold text-amber-700">{product.rating}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.inStock === false}
                      className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                        product.inStock === false
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-slate-900 text-white hover:bg-blue-600 shadow-lg hover:shadow-blue-200'
                      }`}
                    >
                      <ShoppingBagIcon className="w-5 h-5" />
                      {product.inStock === false ? 'أخبرني عند التوفر' : 'أضف للسلة'}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Comparison Modal - Table Design */}
      <AnimatePresence>
        {showComparisonModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] transition-opacity"
              onClick={() => setShowComparisonModal(false)}
            />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-5xl max-h-[85vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-gray-100 pointer-events-auto"
              >
              {/* Header */}
              <div className="bg-slate-900 text-white px-8 py-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                    <ChartBarIcon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">مقارنة المنتجات</h2>
                    <p className="text-gray-400 text-sm font-medium">مقارنة تفصيلية لـ {selectedProducts.length} منتجات</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowComparisonModal(false)}
                  className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors border border-transparent hover:border-white/10"
                >
                  <XMarkIcon className="w-6 h-6 text-white/70 hover:text-white" />
                </button>
              </div>

              {/* Table Content */}
              <div className="overflow-auto custom-scrollbar flex-1 bg-white p-6">
                <div className={`grid gap-6 ${selectedProducts.length === 2 ? 'grid-cols-3' : 'grid-cols-4'} min-w-[600px]`}>
                  
                  {/* Labels Column */}
                  <div className="space-y-4 pt-[180px]">
                    <div className="h-14 flex items-center px-4 font-bold text-gray-500 bg-gray-50 rounded-xl text-sm">السعر</div>
                    <div className="h-14 flex items-center px-4 font-bold text-gray-500 bg-gray-50 rounded-xl text-sm">الفئة</div>
                    <div className="h-14 flex items-center px-4 font-bold text-gray-500 bg-gray-50 rounded-xl text-sm">التقييم</div>
                    <div className="h-14 flex items-center px-4 font-bold text-gray-500 bg-gray-50 rounded-xl text-sm">التوفر</div>
                    <div className="h-14 flex items-center px-4 font-bold text-gray-500 bg-gray-50 rounded-xl text-sm">إجراء</div>
                  </div>

                  {/* Product Columns */}
                  {selectedProducts.map(product => (
                    <div key={product.id} className="space-y-4">
                      {/* Product Header (Image + Name) */}
                      <div className="h-[180px] flex flex-col items-center text-center">
                        <div className="relative w-full h-32 rounded-2xl overflow-hidden mb-3 bg-gray-100 border border-gray-100">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <h3 className="font-bold text-slate-900 line-clamp-2 h-10 text-sm px-2">{product.name}</h3>
                      </div>

                      {/* Product Data */}
                      <div className="h-14 flex items-center justify-center px-4 bg-white border border-gray-100 rounded-xl font-black text-slate-900">
                        {product.price.toLocaleString('ar-EG')} ج.م
                      </div>
                      
                      <div className="h-14 flex items-center justify-center px-4 bg-white border border-gray-100 rounded-xl font-semibold text-slate-600">
                        {product.category || '-'}
                      </div>
                      
                      <div className="h-14 flex items-center justify-center px-4 bg-white border border-gray-100 rounded-xl">
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-lg">
                          <StarIcon className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-bold">{product.rating || '-'}</span>
                        </div>
                      </div>
                      
                      <div className="h-14 flex items-center justify-center px-4 bg-white border border-gray-100 rounded-xl">
                        <span className={`font-bold px-3 py-1 rounded-full text-xs ${
                          product.inStock === false 
                            ? 'bg-red-50 text-red-600' 
                            : 'bg-green-50 text-green-600'
                        }`}>
                          {product.inStock === false ? 'غير متوفر' : 'متوفر'}
                        </span>
                      </div>

                      <div className="h-14 flex items-center justify-center px-4">
                        <button
                          onClick={() => {
                            handleAddToCart(product)
                            setShowComparisonModal(false)
                          }}
                          disabled={product.inStock === false}
                          className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                            product.inStock === false
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-200'
                          }`}
                        >
                          {product.inStock === false ? 'نفذت' : 'أضف للسلة'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
              onClick={() => setShowShareModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl z-[101] p-8 w-full max-w-md shadow-2xl"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <ShareIcon className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">مشاركة القائمة</h2>
                <p className="text-gray-500">شارك منتجاتك المفضلة مع أصدقائك وعائلتك</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    const text = `شاهد قائمة المفضلة الخاصة بي في متجر AMG 🛍️\n${window.location.href}`
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
                  }}
                  className="w-full py-4 px-6 bg-[#25D366] text-white rounded-2xl hover:bg-[#20b85c] transition-colors font-bold flex items-center justify-center gap-3 shadow-lg shadow-green-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  مشاركة عبر WhatsApp
                </button>

                <button
                  onClick={handleShare}
                  className="w-full py-4 px-6 bg-gray-50 text-gray-900 rounded-2xl hover:bg-gray-100 transition-colors font-bold border border-gray-200 hover:border-gray-300"
                >
                  نسخ الرابط
                </button>
              </div>
              
              <button
                onClick={() => setShowShareModal(false)}
                className="mt-6 w-full py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                إغلاق
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}
