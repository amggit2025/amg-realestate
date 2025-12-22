import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAdminToken } from '@/lib/admin-auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminAuth = await verifyAdminToken(request)
    if (!adminAuth.isValid || !adminAuth.admin) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status, adminNotes, respondedAt } = body
    const { id } = await params

    const updatedRequest = await prisma.serviceRequest.update({
      where: { id },
      data: {
        status,
        adminNotes,
        respondedAt: respondedAt ? new Date(respondedAt) : undefined,
        respondedBy: adminAuth.admin.id,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminAuth = await verifyAdminToken(request)
    if (!adminAuth.isValid || !adminAuth.admin) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      )
    }

    const { id } = await params

    await prisma.serviceRequest.delete({
      where: { id }
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
