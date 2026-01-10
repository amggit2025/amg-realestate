'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo } from 'react'
import { useOrders, OrderStatus } from '@/contexts/OrdersContext'
import { withAuth } from '@/lib/AuthContext'
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  Eye,
  Download,
  RefreshCw,
  AlertCircle,
  DollarSign,
  MapPin,
  Phone
} from 'lucide-react'

// Status Badge Component
function StatusBadge({ status }: { status: OrderStatus }) {
  const statusConfig = {
    pending: { 
      label: 'قيد الانتظار', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      icon: Clock 
    },
    confirmed: { 
      label: 'تم التأكيد', 
      color: 'bg-blue-100 text-blue-800 border-blue-200', 
      icon: CheckCircle2 
    },
    preparing: { 
      label: 'قيد التجهيز', 
      color: 'bg-purple-100 text-purple-800 border-purple-200', 
      icon: Package 
    },
    shipping: { 
      label: 'جاري الشحن', 
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200', 
      icon: Truck 
    },
    delivered: { 
      label: 'تم التوصيل', 
      color: 'bg-green-100 text-green-800 border-green-200', 
      icon: CheckCircle2 
    },
    cancelled: { 
      label: 'ملغي', 
      color: 'bg-red-100 text-red-800 border-red-200', 
      icon: XCircle 
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold border-2 ${config.color}`}>
      <Icon className="w-4 h-4" />
      {config.label}
    </span>
  )
}

function MyOrdersPage() {
  const { orders } = useOrders()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')

  // Filter and Sort Orders
  const filteredOrders = useMemo(() => {
    let filtered = orders

    // Filter by search query
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
    pending: orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
    shipping: orders.filter(o => o.status === 'shipping' || o.status === 'preparing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalSpent: orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">طلباتي</h1>
              <p className="text-gray-600">تتبع وإدارة جميع طلباتك من المتجر</p>
            </div>
            
            <Link href="/store/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                تسوق الآن
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">إجمالي الطلبات</span>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">قيد التنفيذ</span>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-3xl font-black text-yellow-600">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">قيد الشحن</span>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <p className="text-3xl font-black text-indigo-600">{stats.shipping}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">تم التوصيل</span>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-black text-green-600">{stats.delivered}</p>
          </div>
        </motion.div>

        {/* Total Spent Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-xl p-6 mb-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">إجمالي المشتريات</p>
              <p className="text-4xl font-black">{stats.totalSpent.toLocaleString('ar-EG')} ج.م</p>
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث برقم الطلب أو المنتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
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
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="newest">الأحدث أولاً</option>
                <option value="oldest">الأقدم أولاً</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || statusFilter !== 'all') && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600 font-medium">الفلاتر النشطة:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  بحث: {searchQuery}
                  <button onClick={() => setSearchQuery('')} className="hover:text-red-600">×</button>
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-md p-12 text-center"
          >
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {orders.length === 0 ? 'لا توجد طلبات' : 'لا توجد نتائج'}
            </h3>
            <p className="text-gray-600 mb-6">
              {orders.length === 0 
                ? 'ابدأ التسوق الآن واستكشف منتجاتنا الرائعة' 
                : 'لم يتم العثور على طلبات تطابق البحث'}
            </p>
            <Link href="/store/products">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
                تصفح المنتجات
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border-2 border-gray-100 hover:border-blue-200"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                          <ShoppingBag className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-bold text-gray-900">
                              طلب #{order.orderNumber}
                            </h3>
                            <StatusBadge status={order.status} />
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {order.createdAt.toLocaleDateString('ar-EG', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              {order.items.length} منتج
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-left">
                          <p className="text-sm text-gray-600">الإجمالي</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {order.total.toLocaleString('ar-EG')} ج.م
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6">
                    {/* Items Preview */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      {order.items.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold">
                            ×{item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.items.length > 4 && (
                      <p className="text-sm text-gray-600 mb-4">
                        + {order.items.length - 4} منتجات أخرى
                      </p>
                    )}

                    {/* Tracking Info */}
                    {order.trackingNumber && order.status !== 'pending' && order.status !== 'cancelled' && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Truck className="w-6 h-6 text-blue-600" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">رقم التتبع</p>
                              <p className="text-sm text-gray-600 font-mono">{order.trackingNumber}</p>
                            </div>
                          </div>
                          {order.estimatedDelivery && (
                            <div className="text-left">
                              <p className="text-xs text-gray-600">التوصيل المتوقع</p>
                              <p className="text-sm font-bold text-gray-900">
                                {order.estimatedDelivery.toLocaleDateString('ar-EG', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Link href={`/store/orders/${order.id}`} className="flex-1">
                        <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                          <Eye className="w-5 h-5" />
                          تفاصيل الطلب
                        </button>
                      </Link>
                      
                      {order.status === 'delivered' && (
                        <Link href={`/store/orders/${order.id}/return`}>
                          <button className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2">
                            <RefreshCw className="w-5 h-5" />
                            إرجاع
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

export default withAuth(MyOrdersPage)
