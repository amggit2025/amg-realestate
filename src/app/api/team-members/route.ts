import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - جلب أعضاء الفريق
export async function GET() {
  try {
    // @ts-ignore
    const teamMembers = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: teamMembers
    })
  } catch (error) {
    console.error('خطأ في جلب أعضاء الفريق:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في جلب أعضاء الفريق' },
      { status: 500 }
    )
  }
}

// POST - إضافة عضو فريق جديد
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, position, image, bio, order } = body

    if (!name || !position || !image) {
      return NextResponse.json(
        { success: false, message: 'الاسم والمنصب والصورة مطلوبة' },
        { status: 400 }
      )
    }

    // @ts-ignore
    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        position,
        image,
        bio: bio || null,
        order: order || 0,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تمت إضافة العضو بنجاح',
      data: teamMember
    })
  } catch (error) {
    console.error('خطأ في إضافة عضو الفريق:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في إضافة العضو' },
      { status: 500 }
    )
  }
}
