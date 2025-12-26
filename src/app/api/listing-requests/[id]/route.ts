import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdminToken } from '@/lib/admin-auth'

// جلب تفاصيل طلب معين
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // التحقق من صلاحيات الأدمن
    const authResult = await verifyAdminToken(request)
    if (!authResult.isValid) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const listingRequest = await prisma.propertyListingRequest.findUnique({
      where: { id }
    })

    if (!listingRequest) {
      return NextResponse.json(
        { error: 'الطلب غير موجود' },
        { status: 404 }
      )
    }

    // Parse JSON fields (images and features)
    const parsedRequest = {
      ...listingRequest,
      images: typeof listingRequest.images === 'string' ? JSON.parse(listingRequest.images) : (listingRequest.images || []),
      features: typeof listingRequest.features === 'string' ? JSON.parse(listingRequest.features as string) : (listingRequest.features || [])
    }

    return NextResponse.json(parsedRequest)

  } catch (error) {
    console.error('Error fetching listing request:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الطلب' },
      { status: 500 }
    )
  }
}

// تحديث طلب (تغيير الحالة، إضافة ملاحظات، جدولة معاينة)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // التحقق من صلاحيات الأدمن
    const authResult = await verifyAdminToken(request)
    if (!authResult.isValid) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const body = await request.json()
    const { status, adminNotes, assignedTo, visitDate, visitNotes } = body

    // التحقق من وجود الطلب
    const existingRequest = await prisma.propertyListingRequest.findUnique({
      where: { id }
    })

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'الطلب غير موجود' },
        { status: 404 }
      )
    }

    // تحديث الطلب
    const updateData: any = {}
    if (status) updateData.status = status
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo
    if (visitDate !== undefined) updateData.visitDate = visitDate ? new Date(visitDate) : null
    if (visitNotes !== undefined) updateData.visitNotes = visitNotes

    const updatedRequest = await prisma.propertyListingRequest.update({
      where: { id },
      data: updateData
    })

    // TODO: إرسال إشعار للعميل عند تغيير الحالة

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الطلب بنجاح',
      request: updatedRequest
    })

  } catch (error) {
    console.error('Error updating listing request:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الطلب' },
      { status: 500 }
    )
  }
}

// حذف طلب
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // التحقق من صلاحيات الأدمن
    const authResult = await verifyAdminToken(request)
    if (!authResult.isValid) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    // التحقق من وجود الطلب
    const existingRequest = await prisma.propertyListingRequest.findUnique({
      where: { id }
    })

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'الطلب غير موجود' },
        { status: 404 }
      )
    }

    await prisma.propertyListingRequest.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف الطلب بنجاح'
    })

  } catch (error) {
    console.error('Error deleting listing request:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف الطلب' },
      { status: 500 }
    )
  }
}
