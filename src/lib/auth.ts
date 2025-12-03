// ======================================================
// 🛡️ AMG Real Estate - Authentication Utilities
// ======================================================
import jwt from 'jsonwebtoken'
import prisma from '@/lib/db'

// تعريف نوع بيانات Token
export interface TokenPayload {
  userId: string
  email: string
  userType: string
  iat?: number
  exp?: number
}

// دالة للتحقق من صحة Token
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as TokenPayload
    return decoded
  } catch (error) {
    console.error('Invalid token:', error)
    return null
  }
}

// دالة للحصول على المستخدم من Token
export async function getUserFromToken(token: string) {
  try {
    const decoded = verifyToken(token)
    
    if (!decoded || !decoded.userId) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        userType: true,
        verified: true,
        active: true,
        createdAt: true
      }
    })

    if (!user || !user.active) {
      return null
    }

    return user
  } catch (error) {
    console.error('Error getting user from token:', error)
    return null
  }
}

// دالة للتحقق من صحة المصادقة في الطلبات
export async function requireAuth(request: Request) {
  try {
    // محاولة الحصول على التوكن من الـ cookie أو الـ header
    const cookieStore = request.headers.get('cookie')
    let token: string | null = null

    // البحث في الـ cookies
    if (cookieStore) {
      const cookies = cookieStore.split(';').map(cookie => cookie.trim())
      const authCookie = cookies.find(cookie => cookie.startsWith('auth-token='))
      if (authCookie) {
        token = authCookie.split('=')[1]
      }
    }

    // البحث في الـ Authorization header
    if (!token) {
      const authHeader = request.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }
    }

    if (!token) {
      return {
        success: false,
        message: 'غير مُصرح لك بالوصول. قم بتسجيل الدخول أولاً.',
        requireAuth: true,
        status: 401
      }
    }

    const user = await getUserFromToken(token)

    if (!user) {
      return {
        success: false,
        message: 'جلسة غير صالحة. قم بتسجيل الدخول مرة أخرى.',
        requireAuth: true,
        status: 401
      }
    }

    return {
      success: true,
      user
    }

  } catch (error) {
    console.error('Auth error:', error)
    return {
      success: false,
      message: 'حدث خطأ في التحقق من المصادقة',
      status: 500
    }
  }
}

// دالة لحماية API routes
export async function withAuth(handler: (request: Request, user: any) => Promise<Response>) {
  return async (request: Request) => {
    const authResult = await requireAuth(request)
    
    if (!authResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: authResult.message,
          requireAuth: authResult.requireAuth
        }),
        { 
          status: authResult.status,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    return handler(request, authResult.user)
  }
}

// دالة إنشاء JWT token
export function createToken(payload: Record<string, any>, expiresIn = '7d'): string {
  const secret = process.env.JWT_SECRET || 'fallback-secret'
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions)
}