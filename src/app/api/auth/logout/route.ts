// ======================================================
// 🚪 AMG Real Estate - User Logout API
// ======================================================
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('👋 User logout request')

    // إنشاء response
    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح'
    })

    // حذف cookie الخاص بالـ token
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // انتهاء فوري
      path: '/'
    })

    console.log('✅ User logged out successfully')
    return response

  } catch (error) {
    console.error('❌ Logout error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء تسجيل الخروج'
      },
      { status: 500 }
    )
  }
}