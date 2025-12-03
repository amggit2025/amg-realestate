import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAdminToken } from '@/lib/admin-auth'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // التحقق من المصادقة
    const { isValid, admin } = await verifyAdminToken(req)
    if (!isValid || !admin) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      )
    }

    const sessionId = params.id

    // التحقق من أن الجلسة تخص المشرف الحالي
    const session = await (prisma as any).adminSession.findUnique({
      where: { id: sessionId }
    })

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'الجلسة غير موجودة' },
        { status: 404 }
      )
    }

    if (session.adminId !== admin.id) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بحذف هذه الجلسة' },
        { status: 403 }
      )
    }

    // حذف الجلسة (أو تعطيلها)
    await (prisma as any).adminSession.update({
      where: { id: sessionId },
      data: { isActive: false }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف الجلسة بنجاح'
    })

  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء حذف الجلسة' },
      { status: 500 }
    )
  }
}
