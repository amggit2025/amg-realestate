import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // التحقق من البريد الإلكتروني
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'يرجى إدخال بريد إلكتروني صالح' },
        { status: 400 }
      );
    }

    // التحقق من وجود الاشتراك مسبقاً
    // @ts-ignore - Prisma Client needs to be regenerated
    const existingSubscription = await prisma.newsletterSubscription.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingSubscription) {
      // إذا كان الاشتراك ملغي، نعيد تفعيله
      if (existingSubscription.status === 'UNSUBSCRIBED') {
        // @ts-ignore
        await prisma.newsletterSubscription.update({
          where: { email: email.toLowerCase() },
          data: {
            status: 'ACTIVE',
            unsubscribedAt: null,
            unsubscribeReason: null,
            updatedAt: new Date(),
          },
        });
        
        return NextResponse.json({
          success: true,
          message: 'تم تجديد اشتراكك بنجاح! شكراً لعودتك 🎉',
        });
      }

      return NextResponse.json(
        { 
          success: false, 
          message: 'هذا البريد الإلكتروني مشترك بالفعل في نشرتنا الإخبارية' 
        },
        { status: 400 }
      );
    }

    // جلب معلومات الطلب
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // إنشاء اشتراك جديد
    // @ts-ignore
    await prisma.newsletterSubscription.create({
      data: {
        email: email.toLowerCase(),
        status: 'ACTIVE',
        source: 'footer', // يمكن تخصيصه حسب مصدر الاشتراك
        ipAddress,
        userAgent,
        verifiedAt: new Date(), // نفعله مباشرة (يمكن تغييره لاحقاً لنظام تفعيل بالبريد)
      },
    });

    return NextResponse.json({
      success: true,
      message: 'تم الاشتراك بنجاح في نشرتنا الإخبارية! 🎉',
    });

  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى' },
      { status: 500 }
    );
  }
}

// GET: للحصول على إحصائيات الاشتراكات (للأدمن)
export async function GET() {
  try {
    // @ts-ignore
    const [total, active, unsubscribed] = await Promise.all([
      // @ts-ignore
      prisma.newsletterSubscription.count(),
      // @ts-ignore
      prisma.newsletterSubscription.count({ where: { status: 'ACTIVE' } }),
      // @ts-ignore
      prisma.newsletterSubscription.count({ where: { status: 'UNSUBSCRIBED' } }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        total,
        active,
        unsubscribed,
      },
    });
  } catch (error) {
    console.error('Error fetching newsletter stats:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب الإحصائيات' },
      { status: 500 }
    );
  }
}
