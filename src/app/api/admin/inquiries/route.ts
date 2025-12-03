import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // جلب جميع الاستفسارات مع المستخدمين والعقارات المرتبطة
    const inquiries = await prisma.inquiry.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // حساب الإحصائيات
    const total = inquiries.length;
    const pending = inquiries.filter(i => i.status === 'PENDING').length;
    const inProgress = inquiries.filter(i => i.status === 'IN_PROGRESS').length;
    const resolved = inquiries.filter(i => i.status === 'RESOLVED').length;
    const closed = inquiries.filter(i => i.status === 'CLOSED').length;
    
    // استفسارات اليوم
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = inquiries.filter(i => new Date(i.createdAt) >= today).length;
    
    // استفسارات هذا الأسبوع
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekCount = inquiries.filter(i => new Date(i.createdAt) >= weekAgo).length;

    return NextResponse.json({
      success: true,
      data: inquiries,
      stats: {
        total,
        pending,
        inProgress,
        resolved,
        closed,
        today: todayCount,
        thisWeek: weekCount,
      },
    });

  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب البيانات' },
      { status: 500 }
    );
  }
}
