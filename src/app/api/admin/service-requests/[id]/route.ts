import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAdminAuth } from '@/lib/admin-auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status, adminNotes, respondedAt } = body

    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: params.id },
      data: {
        status,
        adminNotes,
        respondedAt: respondedAt ? new Date(respondedAt) : undefined,
        respondedBy: admin.id,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      request: updatedRequest
    })
  } catch (error) {
    console.error('Error updating service request:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء تحديث الطلب' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      )
    }

    await prisma.serviceRequest.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف الطلب بنجاح'
    })
  } catch (error) {
    console.error('Error deleting service request:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء حذف الطلب' },
      { status: 500 }
    )
  }
}
