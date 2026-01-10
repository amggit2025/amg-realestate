'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useOrders } from '@/contexts/OrdersContext'
import { useToast } from '@/contexts/ToastContext'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
  DocumentTextIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

type ReturnReason = 'defective' | 'wrong_item' | 'not_as_described' | 'changed_mind' | 'size_issue' | 'other'

export default function ReturnExchangePage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const { getOrderById } = useOrders()
  const { showToast } = useToast()

  const order = getOrderById(orderId)

  const [returnType, setReturnType] = useState<'return' | 'exchange'>('return')
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [reason, setReason] = useState<ReturnReason>('defective')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if order exists and can be returned
  if (!order || order.status !== 'delivered') {
    return (
      <main className="min-h-screen bg-gray-50 pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <XCircleIcon className="w-20 h-20 text-red-400 mx-auto mb-6" />
            <h1 className="text-3xl font-black text-slate-900 mb-4">
              لا يمكن إرجاع هذا الطلب
            </h1>
            <p className="text-gray-600 mb-8">
              الطلب غير مؤهل للإرجاع أو الاستبدال. يمكن إرجاع الطلبات المستلمة فقط خلال 14 يوم.
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

  const returnReasons = [
    { value: 'defective', label: 'منتج معيب أو تالف' },
    { value: 'wrong_item', label: 'منتج خاطئ' },
    { value: 'not_as_described', label: 'لا يطابق الوصف' },
    { value: 'changed_mind', label: 'غيرت رأيي' },
    { value: 'size_issue', label: 'مشكلة في المقاس' },
    { value: 'other', label: 'سبب آخر' }
  ]

  const toggleItemSelection = (itemId: number) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      setImages(prev => [...prev, ...newImages].slice(0, 5)) // Max 5 images
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedItems.length === 0) {
      showToast('يرجى اختيار منتج واحد على الأقل', 'error')
      return
    }

    if (!description.trim()) {
      showToast('يرجى وصف المشكلة', 'error')
      return
    }

    setIsSubmitting(true)

    // Mock submission
    setTimeout(() => {
      showToast(
        returnType === 'return' 
          ? 'تم إرسال طلب الإرجاع بنجاح. سيتم التواصل معك قريباً' 
          : 'تم إرسال طلب الاستبدال بنجاح. سيتم التواصل معك قريباً',
        'success'
      )
      setIsSubmitting(false)
      router.push(`/store/orders/${orderId}`)
    }, 2000)
  }

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
            href={`/store/orders/${orderId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-slate-900 transition-colors font-medium"
          >
            <ArrowRightIcon className="w-5 h-5" />
            العودة إلى تفاصيل الطلب
          </Link>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-black text-slate-900 mb-2">
              {returnType === 'return' ? 'إرجاع منتجات' : 'استبدال منتجات'}
            </h1>
            <p className="text-gray-600">
              طلب #{order.orderNumber}
            </p>
          </motion.div>

          {/* Return/Exchange Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-md p-6 mb-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setReturnType('return')}
                className={`py-4 rounded-xl font-bold transition-all ${
                  returnType === 'return'
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                إرجاع واسترجاع المبلغ
              </button>
              <button
                onClick={() => setReturnType('exchange')}
                className={`py-4 rounded-xl font-bold transition-all ${
                  returnType === 'exchange'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                استبدال بمنتج آخر
              </button>
            </div>
          </motion.div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 mb-6"
          >
            <div className="flex gap-4">
              <InformationCircleIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-slate-900 mb-2">سياسة الإرجاع والاستبدال</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• يمكن إرجاع المنتجات خلال 14 يوم من تاريخ الاستلام</li>
                  <li>• يجب أن تكون المنتجات في حالتها الأصلية مع العبوة</li>
                  <li>• المنتجات المخفضة غير قابلة للإرجاع</li>
                  <li>• سيتم استرجاع المبلغ خلال 5-7 أيام عمل</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Select Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-md p-6 mb-6"
            >
              <h2 className="text-xl font-black text-slate-900 mb-4">
                اختر المنتجات
              </h2>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleItemSelection(item.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedItems.includes(item.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1">{item.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>الكمية: {item.quantity}</span>
                        <span className="font-bold text-slate-900">
                          {item.price.toLocaleString('ar-EG')} جنيه
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedItems.includes(item.id)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedItems.includes(item.id) && (
                        <CheckCircleIcon className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reason */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-md p-6 mb-6"
            >
              <h2 className="text-xl font-black text-slate-900 mb-4">
                سبب {returnType === 'return' ? 'الإرجاع' : 'الاستبدال'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {returnReasons.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setReason(r.value as ReturnReason)}
                    className={`p-4 rounded-xl text-right font-semibold transition-all ${
                      reason === r.value
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-md p-6 mb-6"
            >
              <h2 className="text-xl font-black text-slate-900 mb-4">
                وصف المشكلة
              </h2>
              
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اشرح المشكلة بالتفصيل..."
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </motion.div>

            {/* Upload Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-md p-6 mb-6"
            >
              <h2 className="text-xl font-black text-slate-900 mb-4">
                صور المنتج (اختياري)
              </h2>
              
              <div className="space-y-4">
                {/* Upload Button */}
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-all cursor-pointer">
                    <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-1">اضغط لرفع الصور</p>
                    <p className="text-sm text-gray-500">حد أقصى 5 صور</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <XCircleIcon className="w-8 h-8 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <button
                type="submit"
                disabled={isSubmitting || selectedItems.length === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري الإرسال...
                  </div>
                ) : (
                  `إرسال طلب ${returnType === 'return' ? 'الإرجاع' : 'الاستبدال'}`
                )}
              </button>
            </motion.div>
          </form>
        </div>
      </div>
    </main>
  )
}
