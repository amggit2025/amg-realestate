import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
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

    const { currentPassword, newPassword } = await request.json()

    // التحقق من البيانات المطلوبة
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'كلمة المرور الحالية والجديدة مطلوبتان' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      )
    }

    // جلب المستخدم الحالي
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        password: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // التحقق من كلمة المرور الحالية
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'كلمة المرور الحالية غير صحيحة' },
        { status: 400 }
      )
    }

    // تشفير كلمة المرور الجديدة
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // تحديث كلمة المرور
    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date(),
      }
    })

    return NextResponse.json({
      message: 'تم تغيير كلمة المرور بنجاح'
    })

  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { message: 'خطأ في تغيير كلمة المرور' },
      { status: 500 }
    )
  }
}