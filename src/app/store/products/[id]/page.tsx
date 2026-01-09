'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'
import {
  ShoppingBagIcon,
  HeartIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  MinusIcon,
  PlusIcon,
  ShareIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

// Mock Data
const MOCK_PRODUCT = {
  id: 1,
  name: 'كنبة مودرن إيطالي فاخرة',
  price: 25000,
  originalPrice: 32000,
  discount: 22,
  category: 'أثاث منزلي',
  brand: 'Italian Designs',
  rating: 4.9,
  reviewsCount: 124,
  stock: 8,
  sku: 'AMG-FUR-001',
  description: 'كنبة فاخرة بتصميم إيطالي عصري، مصنوعة من أجود أنواع القماش المستورد والإسفنج عالي الكثافة. تتميز بالراحة الفائقة والمتانة وسهولة التنظيف. مثالية لغرف المعيشة الحديثة.',
  features: [
    'قماش مستورد مقاوم للبقع',
    'إسفنج عالي الكثافة 45 كثافة',
    'هيكل خشبي من خشب الزان الطبيعي',
    'أرجل معدنية مطلية بالكروم',
    'ضمان 5 سنوات على الهيكل',
    'سهولة الفك والتركيب'
  ],
  specifications: {
    'الأبعاد': '220 × 90 × 85 سم',
    'عدد المقاعد': '3 أشخاص',
    'الوزن': '65 كجم',
    'المادة': 'قماش، خشب، إسفنج',
    'اللون': 'رمادي فاتح',
    'بلد المنشأ': 'إيطاليا',
    'الضمان': '5 سنوات'
  },
  images: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
    'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200&q=80',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80',
    'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=1200&q=80'
  ],
  colors: ['رمادي فاتح', 'أزرق داكن', 'بيج', 'كحلي'],
  deliveryTime: '3-5 أيام عمل',
  featured: true
}

const MOCK_REVIEWS = [
  {
    id: 1,
    userName: 'أحمد محمد',
    rating: 5,
    date: '2025-12-15',
    comment: 'منتج رائع جداً، الجودة ممتازة والتوصيل كان سريع. أنصح بالشراء بشدة!',
    verified: true
  },
  {
    id: 2,
    userName: 'سارة علي',
    rating: 5,
    date: '2025-12-10',
    comment: 'الكنبة فخمة وجميلة جداً، بالضبط زي الصور. القماش ناعم ومريح والألوان رائعة.',
    verified: true
  },
  {
    id: 3,
    userName: 'محمود حسن',
    rating: 4,
    date: '2025-12-05',
    comment: 'جودة ممتازة لكن التوصيل تأخر يومين عن الموعد. المنتج نفسه رائع.',
    verified: true
  }
]

const RELATED_PRODUCTS = [
  {
    id: 2,
    name: 'كرسي استرخاء جلد طبيعي',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
    rating: 4.9,
    category: 'أثاث'
  },
  {
    id: 3,
    name: 'طاولة قهوة زجاج وخشب',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800&q=80',
    rating: 4.7,
    category: 'أثاث'
  },
  {
    id: 4,
    name: 'طقم كنب مودرن 3+2+1',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
    rating: 4.9,
    category: 'أثاث'
  },
  {
    id: 5,
    name: 'مكتبة حائط خشب طبيعي',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80',
    rating: 4.5,
    category: 'ديكور'
  }
]

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id
  const { addToCart } = useCart()
  const { showToast } = useToast()

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(MOCK_PRODUCT.colors[0])
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')

  const handleAddToCart = () => {
    console.log('🛒 Adding to cart:', { product: MOCK_PRODUCT.name, quantity, color: selectedColor })
    
    addToCart(
      {
        id: MOCK_PRODUCT.id,
        name: MOCK_PRODUCT.name,
        price: MOCK_PRODUCT.price,
        image: MOCK_PRODUCT.images[0],
        color: selectedColor,
        category: MOCK_PRODUCT.category
      },
      quantity
    )
    
    console.log('✅ Added to cart successfully!')
    showToast(`تمت إضافة ${quantity} × ${MOCK_PRODUCT.name} إلى السلة!`, 'success')
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-36 pb-20">
      
      {/* Top Navigation / Breadcrumb */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
          <Link href="/store" className="hover:text-slate-900 transition-colors">المتجر</Link>
          <ChevronLeftIcon className="w-3 h-3 rtl:rotate-180" />
          <Link href="/store/products" className="hover:text-slate-900 transition-colors">تصفح المنتجات</Link>
          <ChevronLeftIcon className="w-3 h-3 rtl:rotate-180" />
          <span className="text-slate-900 line-clamp-1">{MOCK_PRODUCT.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Right Column: Image Gallery (Sticky) */}
          <div className="lg:w-[55%]">
            <div className="sticky top-32 space-y-4">
              {/* Main Image */}
              <motion.div 
                layoutId={`product-image-${MOCK_PRODUCT.id}`}
                className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100 group"
              >
                <Image
                  src={MOCK_PRODUCT.images[selectedImage]}
                  alt={MOCK_PRODUCT.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                
                {/* badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {MOCK_PRODUCT.discount > 0 && (
                     <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-full shadow-lg text-sm">
                       خصم {MOCK_PRODUCT.discount}%
                     </span>
                  )}
                </div>

                {/* Wishlist Button (Over Image) */}
                <button 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="absolute top-4 left-4 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm"
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-slate-900" />
                  )}
                </button>
              </motion.div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                {MOCK_PRODUCT.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-slate-900 ring-2 ring-slate-900/10 scale-95 opacity-100'
                        : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`عرض ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Left Column: Product Details */}
          <div className="lg:w-[45%]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header Info */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-slate-900 text-amber-400 text-xs font-bold px-3 py-1 rounded-full">
                    {MOCK_PRODUCT.brand}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <StarSolidIcon className="w-4 h-4" />
                    <span className="text-sm font-bold text-slate-900">{MOCK_PRODUCT.rating}</span>
                    <span className="text-xs text-gray-500 underline decoration-gray-300 underline-offset-4">
                      ({MOCK_PRODUCT.reviewsCount} تقييم)
                    </span>
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">
                  {MOCK_PRODUCT.name}
                </h1>
                
                <div className="flex items-end gap-3 mb-6">
                  <div className="flex flex-col">
                    <span className="text-4xl font-black text-slate-900">
                      {MOCK_PRODUCT.price.toLocaleString()} <span className="text-lg font-medium text-gray-400">ج.م</span>
                    </span>
                    <span className="text-xs text-green-600 font-bold">شامل ضريبة القيمة المضافة</span>
                  </div>
                  {MOCK_PRODUCT.originalPrice && (
                    <span className="text-xl text-gray-400 line-through mb-2 decoration-2 decoration-red-400/50">
                      {MOCK_PRODUCT.originalPrice.toLocaleString()} ج.م
                    </span>
                  )}
                </div>
              </div>

              {/* Selectors */}
              <div className="space-y-6 pt-6 border-t border-gray-100">
                {/* Colors */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-3">
                    اللون المختار: <span className="text-gray-500 font-normal">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_PRODUCT.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                          selectedColor === color
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions Box */}
                <div className="bg-white p-5 rounded-3xl shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-xl">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:text-amber-600 transition-colors"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-bold w-6 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(MOCK_PRODUCT.stock, quantity + 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:text-amber-600 transition-colors"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right">
                       <span className="block text-xs text-gray-500">الإجمالي</span>
                       <span className="font-black text-xl text-slate-900">
                         {(MOCK_PRODUCT.price * quantity).toLocaleString()} <span className="text-xs font-normal">ج.م</span>
                       </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-gradient-to-r from-slate-900 to-slate-800 text-amber-400 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-amber-500/10 transition-all flex items-center justify-center gap-2 group"
                    >
                      <ShoppingBagIcon className="w-6 h-6 group-hover:animate-bounce" />
                      أضف للسلة
                    </button>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-center gap-4 text-xs font-medium text-gray-500">
                     <span className="flex items-center gap-1"><TruckIcon className="w-4 h-4" /> شحن سريع</span>
                     <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                     <span className="flex items-center gap-1"><ShieldCheckIcon className="w-4 h-4" /> ضمان ذهبي</span>
                     <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                     <span className="flex items-center gap-1"><ArrowPathIcon className="w-4 h-4" /> استرجاع بسيط</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100">
                  <h3 className="font-bold text-slate-900 mb-3 text-sm">مميزات المنتج:</h3>
                  <ul className="grid grid-cols-1 gap-2">
                    {MOCK_PRODUCT.features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircleIcon className="w-5 h-5 text-amber-500 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="mt-20">
          <div className="flex border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
            {[
              { id: 'description', label: 'الوصف الشامل' },
              { id: 'specs', label: 'المواصفات الفنية' },
              { id: 'reviews', label: `تقييمات العملاء (${MOCK_REVIEWS.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-8 py-4 font-bold text-sm md:text-base whitespace-nowrap transition-all relative ${
                  activeTab === tab.id
                    ? 'text-slate-900'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 rounded-t-full"
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
               className="max-w-4xl"
             >
                {activeTab === 'description' && (
                  <div className="prose prose-lg max-w-none text-gray-600">
                    <h3 className="text-2xl font-black text-slate-900 mb-6">تفاصيل المنتج</h3>
                    <p className="leading-relaxed mb-8 text-lg">{MOCK_PRODUCT.description}</p>
                    <div className="grid md:grid-cols-2 gap-6">
                       {MOCK_PRODUCT.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                             <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-amber-500">
                                <StarIcon className="w-5 h-5" />
                             </div>
                             <span className="font-bold text-slate-800">{f}</span>
                          </div>
                       ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'specs' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                     {Object.entries(MOCK_PRODUCT.specifications).map(([key, value], idx) => (
                        <div key={idx} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-4 rounded-lg transition-colors">
                           <span className="text-gray-500 font-medium">{key}</span>
                           <span className="text-slate-900 font-bold dir-ltr">{value}</span>
                        </div>
                     ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {MOCK_REVIEWS.map((review) => (
                      <div key={review.id} className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-lg">
                                {review.userName.charAt(0)}
                             </div>
                             <div>
                                <h4 className="font-bold text-slate-900">{review.userName}</h4>
                                <span className="text-xs text-gray-400 font-medium">{review.date}</span>
                             </div>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <StarSolidIcon key={i} className={`w-4 h-4 ${i < review.rating ? '' : 'text-gray-200'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
             </motion.div>
          </AnimatePresence>
        </div>

        {/* Similar Products */}
        <div className="mt-24 border-t border-gray-100 pt-16">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-amber-600 font-bold uppercase tracking-wider text-sm mb-2 block">قد يعجبك أيضاً</span>
              <h2 className="text-3xl font-black text-slate-900">منتجات مشابهة</h2>
            </div>
            <Link href="/store/products" className="hidden md:flex items-center gap-2 text-slate-900 font-bold hover:text-amber-600 transition-colors">
               عرض الكل <ChevronLeftIcon className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {RELATED_PRODUCTS.map((product) => (
              <Link
                key={product.id}
                href={`/store/products/${product.id}`}
                className="group bg-white rounded-2xl border border-gray-100 hover:border-amber-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                   <div className="flex items-center gap-2 mb-1">
                      <StarSolidIcon className="w-3 h-3 text-amber-400" />
                      <span className="text-xs font-bold text-slate-900">{product.rating}</span>
                   </div>
                   <h3 className="font-bold text-slate-900 mb-2 truncate group-hover:text-amber-600 transition-colors">
                     {product.name}
                   </h3>
                   <span className="block font-black text-lg text-slate-900">
                     {product.price.toLocaleString()} <span className="text-xs font-normal text-gray-500">ج.م</span>
                   </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}