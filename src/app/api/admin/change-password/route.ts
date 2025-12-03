import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAdminToken } from '@/lib/admin-auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    // التحقق من المصادقة
    const { isValid, admin } = await verifyAdminToken(req)
    if (!isValid || !admin) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      )
    }

    const { currentPassword, newPassword } = await req.json()

    // التحقق من البيانات المطلوبة
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    // التحقق من طول كلمة المرور الجديدة
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      )
    }

    // الحصول على بيانات المشرف الكاملة
    const fullAdmin = await prisma.admin.findUnique({
      where: { id: admin.id },
      select: { password: true }
    })

    if (!fullAdmin) {
      return NextResponse.json(
        { success: false, message: 'المشرف غير موجود' },
        { status: 404 }
      )
    }

    // التحقق من كلمة المرور الحالية
    const isPasswordValid = await bcrypt.compare(currentPassword, fullAdmin.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'كلمة المرور الحالية غير صحيحة' },
        { status: 400 }
      )
    }

    // تشفير كلمة المرور الجديدة
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // تحديث كلمة المرور
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        password: hashedPassword,
        // زيادة tokenVersion لإبطال جميع الجلسات القديمة (اختياري)
        // tokenVersion: { increment: 1 }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    })

  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء تغيير كلمة المرور' },
      { status: 500 }
    )
  }
}
