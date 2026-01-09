'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useOrders, OrderStatus } from '@/contexts/OrdersContext'
import {
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

// Status Badge Component
function StatusBadge({ status }: { status: OrderStatus }) {
  const statusConfig = {
    pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
    confirmed: { label: 'تم التأكيد', color: 'bg-blue-100 text-blue-800', icon: CheckCircleIcon },
    preparing: { label: 'قيد التجهيز', color: 'bg-purple-100 text-purple-800', icon: ShoppingBagIcon },
    shipping: { label: 'جاري الشحن', color: 'bg-indigo-100 text-indigo-800', icon: TruckIcon },
    delivered: { label: 'تم التوصيل', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
    cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-800', icon: XCircleIcon }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${config.color}`}>
      <Icon className="w-4 h-4" />
      {config.label}
    </span>
  )
}

export default function OrdersPage() {
  const { orders } = useOrders()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')

  // Filter and Sort Orders
  const filteredOrders = useMemo(() => {
    let filtered = orders

    // Filter by search query (order number or items)
    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        return b.createdAt.getTime() - a.createdAt.getTime()
      } else {
        return a.createdAt.getTime() - b.createdAt.getTime()
      }
    })

    return filtered
  }, [orders, searchQuery, statusFilter, sortBy])

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    shipping: orders.filter(o => o.status === 'shipping').length
  }

  // Empty State
  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <ShoppingBagIcon className="w-16 h-16 text-blue-400" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-4">
                لا توجد طلبات حتى الآن
              </h1>
              <p className="text-gray-600 mb-8">
                لم تقم بإجراء أي طلبات. ابدأ التسوق الآن واطلب منتجاتك المفضلة!
              </p>
              <Link
                href="/store/products"
                className="inline-flex items-center gap-2 bg-slate-900 text-amber-400 px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all hover:scale-105"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                ابدأ التسوق
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-slate-900 mb-2">
            طلباتي
          </h1>
          <p className="text-gray-600">
            تتبع وإدارة جميع طلباتك
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">إجمالي الطلبات</span>
              <ShoppingBagIcon className="w-5 h-5 text-slate-900" />
            </div>
            <p className="text-3xl font-black text-slate-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">قيد التنفيذ</span>
              <ClockIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-black text-yellow-600">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">جاري الشحن</span>
              <TruckIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-3xl font-black text-indigo-600">{stats.shipping}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">تم التوصيل</span>
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-black text-green-600">{stats.delivered}</p>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-md mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث برقم الطلب أو المنتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FunnelIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="all">جميع الحالات</option>
                <option value="pending">قيد الانتظار</option>
                <option value="confirmed">تم التأكيد</option>
                <option value="preparing">قيد التجهيز</option>
                <option value="shipping">جاري الشحن</option>
                <option value="delivered">تم التوصيل</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="newest">الأحدث أولاً</option>
                <option value="oldest">الأقدم أولاً</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || statusFilter !== 'all') && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-600 font-medium">الفلاتر النشطة:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-900 rounded-full text-sm font-medium">
                  بحث: {searchQuery}
                  <button onClick={() => setSearchQuery('')} className="hover:text-red-600">×</button>
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-900 rounded-full text-sm font-medium">
                  حالة: {statusFilter}
                  <button onClick={() => setStatusFilter('all')} className="hover:text-red-600">×</button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                }}
                className="text-sm text-red-600 hover:text-red-700 font-bold"
              >
                مسح الكل
              </button>
            </div>
          )}
        </motion.div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">لا توجد نتائج تطابق البحث</p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                >
                  <Link href={`/store/orders/${order.id}`} className="block">
                    <div className="p-6">
                      {/* Order Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-black text-slate-900 mb-1">
                            طلب #{order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {order.createdAt.toLocaleDateString('ar-EG', { 
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

                      {/* Order Items Preview */}
                      <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                        {order.items.slice(0, 4).map((item) => (
                          <div key={item.id} className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-100">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                        {order.items.length > 4 && (
                          <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-gray-600">
                              +{order.items.length - 4}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Order Summary */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <ShoppingBagIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {order.items.length} {order.items.length === 1 ? 'منتج' : 'منتجات'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CurrencyDollarIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-slate-900 font-black">
                              {order.total.toLocaleString('ar-EG')} جنيه
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-amber-600 font-bold">
                          عرض التفاصيل
                          <ChevronLeftIcon className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Continue Shopping */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/store/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            تصفح المزيد من المنتجات
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
