import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // جلب جميع الاشتراكات
    // @ts-ignore - Prisma Client needs to be regenerated
    const subscriptions = await prisma.newsletterSubscription.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // حساب الإحصائيات
    const total = subscriptions.length;
    // @ts-ignore
    const active = subscriptions.filter((s: any) => s.status === 'ACTIVE').length;
    // @ts-ignore
    const unsubscribed = subscriptions.filter((s: any) => s.status === 'UNSUBSCRIBED').length;
    
    // اشتراكات هذا الشهر
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // @ts-ignore
    const thisMonth = subscriptions.filter((s: any) => new Date(s.createdAt) >= firstDayOfMonth).length;

    return NextResponse.json({
      success: true,
      data: subscriptions,
      stats: {
        total,
        active,
        unsubscribed,
        thisMonth,
      },
    });

  } catch (error) {
    console.error('Error fetching newsletter subscriptions:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب البيانات' },
      { status: 500 }
    );
  }
}
