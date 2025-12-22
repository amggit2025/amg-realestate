import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - جلب عضو واحد
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // @ts-ignore
    const teamMember = await prisma.teamMember.findUnique({
      where: { id }
    })

    if (!teamMember) {
      return NextResponse.json(
        { success: false, message: 'العضو غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: teamMember
    })
  } catch (error) {
    console.error('خطأ في جلب عضو الفريق:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في جلب العضو' },
      { status: 500 }
    )
  }
}

// PUT - تحديث عضو
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { id } = await params

    // @ts-ignore
    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: {
        name: body.name,
        position: body.position,
        image: body.image,
        bio: body.bio,
        order: body.order,
        isActive: body.isActive
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث العضو بنجاح',
      data: teamMember
    })
  } catch (error) {
    console.error('خطأ في تحديث عضو الفريق:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في تحديث العضو' },
      { status: 500 }
    )
  }
}

// DELETE - حذف عضو
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // @ts-ignore
    await prisma.teamMember.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف العضو بنجاح'
    })
  } catch (error) {
    console.error('خطأ في حذف عضو الفريق:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في حذف العضو' },
      { status: 500 }
    )
  }
}
