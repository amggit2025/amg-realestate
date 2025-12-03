import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// جلب بيانات الملف الشخصي
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // دمج الاسم الأول والأخير
    const userWithFullName = {
      ...user,
      name: `${user.firstName} ${user.lastName}`.trim(),
      profileImage: user.avatar
    }

    return NextResponse.json(userWithFullName)

  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { message: 'خطأ في الخادم' },
      { status: 500 }
    )
  }
}

// تحديث بيانات الملف الشخصي
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

    const { name, email, phone } = await request.json()

    // التحقق من البيانات المطلوبة
    if (!name || !email) {
      return NextResponse.json(
        { message: 'الاسم والبريد الإلكتروني مطلوبان' },
        { status: 400 }
      )
    }

    // تقسيم الاسم الكامل إلى اسم أول وأخير
    const nameParts = name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    // التحقق من عدم وجود مستخدم آخر بنفس البريد الإلكتروني
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: { not: decoded.userId }
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني مستخدم من قبل مستخدم آخر' },
        { status: 400 }
      )
    }

    // تحديث بيانات المستخدم
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        createdAt: true,
      }
    })

    // دمج الاسم الأول والأخير للإرجاع
    const userWithFullName = {
      ...updatedUser,
      name: `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
      profileImage: updatedUser.avatar
    }

    return NextResponse.json(userWithFullName)

  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { message: 'خطأ في تحديث الملف الشخصي' },
      { status: 500 }
    )
  }
}