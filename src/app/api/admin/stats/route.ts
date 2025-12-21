import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // التحقق من صحة Admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      );
    }

    // جلب الإحصائيات بشكل متوازي
    const [
      pendingProperties,
      newInquiries,
      recentUsers,
      pendingTestimonials,
      newSubscriptions,
      pendingServiceRequests,
    ] = await Promise.all([
      // العقارات المعلقة (تحتاج مراجعة)
      prisma.property.count({
        where: { status: 'PENDING' },
      }),

      // الاستفسارات الجديدة (لم يتم الرد عليها)
      prisma.inquiry.count({
        where: { status: 'PENDING' },
      }),

      // المستخدمين الجدد (آخر 7 أيام)
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // الشهادات غير المنشورة
      prisma.testimonial.count({
        where: { published: false },
      }),

      // الاشتراكات الجديدة (آخر 7 أيام)
      prisma.newsletterSubscription.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          status: 'ACTIVE',
        },
      }),

      // طلبات الاستشارات المعلقة
      prisma.serviceRequest.count({
        where: { status: 'PENDING' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        properties: pendingProperties,
        inquiries: newInquiries,
        users: recentUsers,
        testimonials: pendingTestimonials,
        subscriptions: newSubscriptions,
        serviceRequests: pendingServiceRequests,
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب الإحصائيات' },
      { status: 500 }
    );
  }
}
