// Script to add mock orders to localStorage for testing
// Run this in browser console on the website

const mockOrders = [
  {
    id: 'order_1704902400000_abc123',
    orderNumber: 'AMG17049024001',
    trackingNumber: 'AMGTR12345XYZ',
    createdAt: new Date('2026-01-08T10:30:00').toISOString(),
    updatedAt: new Date('2026-01-08T10:30:00').toISOString(),
    estimatedDelivery: new Date('2026-01-11T00:00:00').toISOString(),
    status: 'shipping',
    items: [
      {
        id: 1,
        name: 'كنبة مودرن 3 مقاعد',
        price: 8500,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop',
        color: 'رمادي'
      },
      {
        id: 2,
        name: 'طاولة قهوة خشبية',
        price: 2500,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop'
      }
    ],
    subtotal: 11000,
    shipping: 150,
    tax: 1561,
    total: 12711,
    paymentMethod: 'cod',
    shippingAddress: {
      fullName: 'أحمد محمد علي',
      phone: '01012345678',
      city: 'القاهرة',
      area: 'مدينة نصر',
      street: 'شارع عباس العقاد',
      building: 'برج 15',
      floor: '3',
      apartment: '12',
      landmarks: 'بجوار مستشفى الشروق'
    },
    tracking: [
      {
        status: 'pending',
        timestamp: new Date('2026-01-08T10:30:00').toISOString(),
        message: 'تم استلام الطلب بنجاح'
      },
      {
        status: 'confirmed',
        timestamp: new Date('2026-01-08T11:00:00').toISOString(),
        message: 'تم تأكيد الطلب'
      },
      {
        status: 'preparing',
        timestamp: new Date('2026-01-08T14:00:00').toISOString(),
        message: 'جاري تجهيز الطلب'
      },
      {
        status: 'shipping',
        timestamp: new Date('2026-01-09T09:00:00').toISOString(),
        message: 'الطلب في الطريق إليك'
      }
    ]
  },
  {
    id: 'order_1704729600000_def456',
    orderNumber: 'AMG17047296002',
    trackingNumber: 'AMGTR67890ABC',
    createdAt: new Date('2026-01-06T14:20:00').toISOString(),
    updatedAt: new Date('2026-01-09T10:00:00').toISOString(),
    status: 'delivered',
    items: [
      {
        id: 3,
        name: 'مطبخ ألوميتال كامل',
        price: 35000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=500&h=500&fit=crop',
        color: 'أبيض'
      }
    ],
    subtotal: 35000,
    shipping: 0,
    tax: 4900,
    total: 39900,
    paymentMethod: 'card',
    shippingAddress: {
      fullName: 'سارة أحمد محمود',
      phone: '01098765432',
      city: 'الجيزة',
      area: '6 أكتوبر',
      street: 'المحور المركزي',
      building: 'فيلا 45',
      floor: '1',
      apartment: '',
      landmarks: 'الحي الأول'
    },
    tracking: [
      {
        status: 'pending',
        timestamp: new Date('2026-01-06T14:20:00').toISOString(),
        message: 'تم استلام الطلب بنجاح'
      },
      {
        status: 'confirmed',
        timestamp: new Date('2026-01-06T15:00:00').toISOString(),
        message: 'تم تأكيد الطلب'
      },
      {
        status: 'preparing',
        timestamp: new Date('2026-01-07T10:00:00').toISOString(),
        message: 'جاري تجهيز الطلب'
      },
      {
        status: 'shipping',
        timestamp: new Date('2026-01-08T09:00:00').toISOString(),
        message: 'الطلب في الطريق إليك'
      },
      {
        status: 'delivered',
        timestamp: new Date('2026-01-09T10:00:00').toISOString(),
        message: 'تم توصيل الطلب بنجاح'
      }
    ]
  },
  {
    id: 'order_1704643200000_ghi789',
    orderNumber: 'AMG17046432003',
    trackingNumber: 'AMGTR11223DEF',
    createdAt: new Date('2026-01-05T09:15:00').toISOString(),
    updatedAt: new Date('2026-01-05T11:00:00').toISOString(),
    status: 'confirmed',
    items: [
      {
        id: 4,
        name: 'سرير نوم مزدوج',
        price: 12000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500&h=500&fit=crop'
      },
      {
        id: 5,
        name: 'دولاب ملابس',
        price: 8500,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&h=500&fit=crop'
      },
      {
        id: 6,
        name: 'تسريحة مع مرآة',
        price: 4500,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=500&h=500&fit=crop'
      }
    ],
    subtotal: 25000,
    shipping: 200,
    tax: 3528,
    total: 28728,
    paymentMethod: 'cod',
    shippingAddress: {
      fullName: 'محمد حسن علي',
      phone: '01123456789',
      city: 'الإسكندرية',
      area: 'سموحة',
      street: 'شارع فوزي معاذ',
      building: 'عمارة 8',
      floor: '2',
      apartment: '5',
      landmarks: 'خلف سيتي سنتر'
    },
    tracking: [
      {
        status: 'pending',
        timestamp: new Date('2026-01-05T09:15:00').toISOString(),
        message: 'تم استلام الطلب بنجاح'
      },
      {
        status: 'confirmed',
        timestamp: new Date('2026-01-05T11:00:00').toISOString(),
        message: 'تم تأكيد الطلب'
      }
    ]
  },
  {
    id: 'order_1704470400000_jkl012',
    orderNumber: 'AMG17044704004',
    createdAt: new Date('2026-01-03T15:30:00').toISOString(),
    updatedAt: new Date('2026-01-03T16:00:00').toISOString(),
    status: 'pending',
    items: [
      {
        id: 7,
        name: 'طقم أواني طبخ',
        price: 1500,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1584990347498-7432ab2d7761?w=500&h=500&fit=crop'
      }
    ],
    subtotal: 3000,
    shipping: 50,
    tax: 427,
    total: 3477,
    paymentMethod: 'wallet',
    shippingAddress: {
      fullName: 'فاطمة محمود أحمد',
      phone: '01234567890',
      city: 'القاهرة',
      area: 'المعادي',
      street: 'شارع 9',
      building: '25',
      floor: '4',
      apartment: '8',
      landmarks: 'قريب من محطة المترو'
    },
    tracking: [
      {
        status: 'pending',
        timestamp: new Date('2026-01-03T15:30:00').toISOString(),
        message: 'تم استلام الطلب بنجاح'
      }
    ]
  }
]

// Convert date strings back to Date objects for storage
const ordersForStorage = mockOrders.map(order => ({
  ...order,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  estimatedDelivery: order.estimatedDelivery,
  tracking: order.tracking.map(t => ({
    ...t,
    timestamp: t.timestamp
  }))
}))

// Save to localStorage
localStorage.setItem('amg-store-orders', JSON.stringify(ordersForStorage))

console.log('✅ تم إضافة 4 طلبات تجريبية بنجاح!')
console.log('📦 الطلبات:', ordersForStorage.length)
console.log('يمكنك الآن زيارة /dashboard/my-orders أو /store/orders لرؤية الطلبات')
