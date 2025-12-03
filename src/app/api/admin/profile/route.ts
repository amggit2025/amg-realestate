import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAdminToken } from '@/lib/admin-auth'

export async function PUT(req: NextRequest) {
  try {
    // التحقق من المصادقة
    const { isValid, admin } = await verifyAdminToken(req)
    if (!isValid || !admin) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      )
    }

    const { firstName, lastName, email, username } = await req.json()

    // التحقق من البيانات المطلوبة
    if (!firstName || !lastName || !email || !username) {
      return NextResponse.json(
        { success: false, message: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    // التحقق من عدم تكرار اسم المستخدم
    if (username !== admin.username) {
      const existingUsername = await prisma.admin.findFirst({
        where: {
          username,
          NOT: { id: admin.id }
        }
      })

      if (existingUsername) {
        return NextResponse.json(
          { success: false, message: 'اسم المستخدم موجود بالفعل' },
          { status: 400 }
        )
      }
    }

    // التحقق من عدم تكرار البريد الإلكتروني
    if (email !== admin.email) {
      const existingEmail = await prisma.admin.findFirst({
        where: {
          email,
          NOT: { id: admin.id }
        }
      })

      if (existingEmail) {
        return NextResponse.json(
          { success: false, message: 'البريد الإلكتروني موجود بالفعل' },
          { status: 400 }
        )
      }
    }

    // تحديث الملف الشخصي
    const updatedAdmin = await prisma.admin.update({
      where: { id: admin.id },
      data: {
        firstName,
        lastName,
        email,
        username,
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الملف الشخصي بنجاح',
      data: updatedAdmin
    })

  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء تحديث الملف الشخصي' },
      { status: 500 }
    )
  }
}
