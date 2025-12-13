import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import prisma from '@/lib/db';

// PATCH: تحديث حالة الاستفسار (قراءة / الرد)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                  (request as any).cookies?.get?.('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      );
    }

    const { status } = await request.json();
    const inquiryId = params.id;

    // التحقق من أن الاستفسار يخص هذا اليوزر
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
    });

    if (!inquiry || inquiry.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 403 }
      );
    }

    // تحديث الحالة
    const updated = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      inquiry: updated,
    });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء تحديث الاستفسار' },
      { status: 500 }
    );
  }
}

// DELETE: حذف استفسار
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                  (request as any).cookies?.get?.('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      );
    }

    const inquiryId = params.id;

    // التحقق من أن الاستفسار يخص هذا اليوزر
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
    });

    if (!inquiry || inquiry.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 403 }
      );
    }

    // حذف الاستفسار
    await prisma.inquiry.delete({
      where: { id: inquiryId },
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف الاستفسار بنجاح',
    });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء حذف الاستفسار' },
      { status: 500 }
    );
  }
}
