import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // @ts-ignore - Prisma Client needs to be regenerated
    await prisma.newsletterSubscription.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف الاشتراك بنجاح',
    });

  } catch (error) {
    console.error('Error deleting subscription:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء الحذف' },
      { status: 500 }
    );
  }
}
