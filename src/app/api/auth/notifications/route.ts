import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'غير مصرح' },
        { status: 401 }
      )
    }

    jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    // إرجاع إعدادات افتراضية (يمكن حفظها في قاعدة البيانات لاحقاً)
    const defaultSettings = {
      emailNotifications: true,
      smsNotifications: false,
      newInquiries: true,
      propertyViews: true,
      marketingEmails: false
    }

    return NextResponse.json(defaultSettings)

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { message: 'خطأ في الخادم' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'غير مصرح' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    const settings = await request.json()

    // هنا يمكن حفظ الإعدادات في قاعدة البيانات
    // حالياً سنكتفي بإرجاع رسالة نجاح
    console.log(`User ${decoded.userId} updated notification settings:`, settings)

    return NextResponse.json({
      message: 'تم تحديث إعدادات الإشعارات بنجاح',
      settings
    })

  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json(
      { message: 'خطأ في تحديث إعدادات الإشعارات' },
      { status: 500 }
    )
  }
}