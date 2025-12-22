import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// تحديد استخدام Node.js runtime بدلاً من Edge Runtime
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // حماية مسارات الأدمن
  if (pathname.startsWith('/admin')) {
    // السماح بصفحة تسجيل الدخول
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    // التحقق من وجود الـ token (بدون verify لأن Edge Runtime لا يدعم crypto)
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      // إعادة توجيه لصفحة تسجيل الدخول
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // فك تشفير الـ token (بدون verify) للحصول على البيانات الأساسية
    try {
      // فك تشفير JWT بدون verify (Base64 decode فقط)
      const parts = token.split('.')
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
        
        // التحقق من انتهاء صلاحية الـ token
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          // Token منتهي الصلاحية - إعادة توجيه لصفحة تسجيل الدخول
          const loginUrl = new URL('/admin/login', request.url)
          loginUrl.searchParams.set('redirect', pathname)
          loginUrl.searchParams.set('expired', 'true')
          return NextResponse.redirect(loginUrl)
        }
        
        // إضافة معلومات الأدمن إلى الـ headers
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-admin-id', payload.id || '')
        requestHeaders.set('x-admin-role', payload.role || '')
        requestHeaders.set('x-admin-email', payload.email || '')
        
        return NextResponse.next({
          request: {
            headers: requestHeaders
          }
        })
      }
    } catch (error) {
      // Token decode failed - redirect to login
      if (process.env.NODE_ENV === 'development') {
        console.error('Token decode error:', error)
      }
    }

    // إذا فشل فك التشفير، إعادة توجيه لصفحة تسجيل الدخول
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // حماية مسارات API الأدمن
  if (pathname.startsWith('/api/admin')) {
    // السماح بمسارات Login و Session بدون token
    const publicApiRoutes = ['/api/admin/login', '/api/admin/session']
    if (publicApiRoutes.includes(pathname)) {
      // لكن session يحتاج token للتحقق، دعه يمر مع token extraction
      if (pathname === '/api/admin/session') {
        const token = request.cookies.get('admin_token')?.value
        if (token) {
          try {
            const parts = token.split('.')
            if (parts.length === 3) {
              const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
              
              const requestHeaders = new Headers(request.headers)
              requestHeaders.set('x-admin-id', payload.id || '')
              requestHeaders.set('x-admin-role', payload.role || '')
              requestHeaders.set('x-admin-email', payload.email || '')
              
              return NextResponse.next({
                request: {
                  headers: requestHeaders
                }
              })
            }
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Session token decode error:', error)
            }
          }
        }
      }
      return NextResponse.next()
    }

    // التحقق من وجود token (التحقق من صحته سيتم في API route نفسه)
    const tokenFromCookie = request.cookies.get('admin_token')?.value
    const authHeader = request.headers.get('authorization')
    const tokenFromHeader = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null

    const token = tokenFromCookie || tokenFromHeader

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'غير مصرح لك بالوصول. قم بتسجيل الدخول كمسؤول.',
          requireAuth: true 
        },
        { status: 401 }
      )
    }

    // فك تشفير الـ token (بدون verify) للحصول على البيانات الأساسية
    try {
      const parts = token.split('.')
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
        
        // التحقق من انتهاء صلاحية الـ token
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          // Token منتهي الصلاحية
          return NextResponse.json(
            { 
              success: false, 
              message: 'انتهت صلاحية الجلسة. قم بتسجيل الدخول مرة أخرى.',
              requireAuth: true,
              expired: true
            },
            { status: 401 }
          )
        }
        
        // إضافة معلومات الأدمن إلى الـ headers
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-admin-id', payload.id || '')
        requestHeaders.set('x-admin-role', payload.role || '')
        requestHeaders.set('x-admin-email', payload.email || '')
        
        return NextResponse.next({
          request: {
            headers: requestHeaders
          }
        })
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Token decode error in API:', error)
      }
    }

    // السماح بالمرور - سيتم التحقق من صحة الـ token في API route
    return NextResponse.next()
  }

  return NextResponse.next()
}
