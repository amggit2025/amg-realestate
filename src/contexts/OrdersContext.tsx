'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Order Status Types
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipping' | 'delivered' | 'cancelled'

export type PaymentMethod = 'cod' | 'card' | 'wallet'

// Order Item Interface
export interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  color?: string
}

// Order Interface
export interface Order {
  id: string
  orderNumber: string
  createdAt: Date
  updatedAt: Date
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  paymentMethod: PaymentMethod
  shippingAddress: {
    fullName: string
    phone: string
    city: string
    area: string
    street: string
    building: string
    floor?: string
    apartment?: string
    landmarks?: string
  }
  tracking?: {
    status: OrderStatus
    timestamp: Date
    message: string
  }[]
}

interface OrdersContextType {
  orders: Order[]
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'tracking'>) => Order
  getOrders: () => Order[]
  getOrderById: (orderId: string) => Order | undefined
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  cancelOrder: (orderId: string) => void
  ordersCount: number
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

const ORDERS_STORAGE_KEY = 'amg-store-orders'

// Generate Order Number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `AMG${timestamp}${random}`
}

// Generate Unique ID
function generateId(): string {
  return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Mock Tracking Data Generator
function generateTracking(status: OrderStatus): Order['tracking'] {
  const now = new Date()
  const tracking: Order['tracking'] = [
    {
      status: 'pending',
      timestamp: new Date(now.getTime() - 3600000 * 4), // 4 hours ago
      message: 'تم استلام الطلب بنجاح'
    }
  ]

  if (status !== 'pending') {
    tracking.push({
      status: 'confirmed',
      timestamp: new Date(now.getTime() - 3600000 * 3), // 3 hours ago
      message: 'تم تأكيد الطلب'
    })
  }

  if (status === 'preparing' || status === 'shipping' || status === 'delivered') {
    tracking.push({
      status: 'preparing',
      timestamp: new Date(now.getTime() - 3600000 * 2), // 2 hours ago
      message: 'جاري تجهيز الطلب'
    })
  }

  if (status === 'shipping' || status === 'delivered') {
    tracking.push({
      status: 'shipping',
      timestamp: new Date(now.getTime() - 3600000), // 1 hour ago
      message: 'الطلب في الطريق إليك'
    })
  }

  if (status === 'delivered') {
    tracking.push({
      status: 'delivered',
      timestamp: now,
      message: 'تم توصيل الطلب بنجاح'
    })
  }

  if (status === 'cancelled') {
    tracking.push({
      status: 'cancelled',
      timestamp: now,
      message: 'تم إلغاء الطلب'
    })
  }

  return tracking
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY)
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders)
        // Convert date strings back to Date objects
        const ordersWithDates = parsed.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt),
          tracking: order.tracking?.map((t: any) => ({
            ...t,
            timestamp: new Date(t.timestamp)
          }))
        }))
        setOrders(ordersWithDates)
      } catch (error) {
        console.error('Error loading orders:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
    }
  }, [orders, isLoaded])

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'tracking'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: generateId(),
      orderNumber: generateOrderNumber(),
      createdAt: new Date(),
      updatedAt: new Date(),
      tracking: generateTracking(orderData.status)
    }

    setOrders(prev => [newOrder, ...prev]) // Add to beginning (most recent first)
    return newOrder
  }

  const getOrders = (): Order[] => {
    return orders
  }

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId)
  }

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status, 
              updatedAt: new Date(),
              tracking: generateTracking(status)
            }
          : order
      )
    )
  }

  const cancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled')
  }

  const ordersCount = orders.length

  return (
    <OrdersContext.Provider
      value={{
        orders,
        createOrder,
        getOrders,
        getOrderById,
        updateOrderStatus,
        cancelOrder,
        ordersCount,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider')
  }
  return context
}
