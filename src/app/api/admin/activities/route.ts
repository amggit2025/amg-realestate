import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAdminToken } from '@/lib/admin-auth';

// GET: جلب نشاطات المشرفين
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const action = searchParams.get('action');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const limit = parseInt(searchParams.get('limit') || '50');
    const current = searchParams.get('current'); // للحصول على أنشطة المشرف الحالي

    // إذا كان current=true، نحصل على أنشطة المشرف الحالي فقط
    let currentAdminId = adminId;
    if (current === 'true') {
      const { isValid, admin } = await verifyAdminToken(request);
      if (isValid && admin) {
        currentAdminId = admin.id;
      }
    }

    // بناء الفلتر
    const where: any = {};
    
    if (currentAdminId) where.adminId = currentAdminId;
    if (action) where.action = action;
    if (from && to) {
      where.createdAt = {
        gte: new Date(from),
        lte: new Date(to + 'T23:59:59'),
      };
    }

    // جلب النشاطات
    const activities = await (prisma as any).adminActivity.findMany({
      where,
      include: {
        admin: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // حساب إجمالي الأنشطة
    const total = await (prisma as any).adminActivity.count({ where });

    // حساب أنشطة اليوم
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await (prisma as any).adminActivity.count({
      where: {
        ...where,
        createdAt: { gte: today }
      }
    });

    // حساب الإحصائيات
    const stats = await (prisma as any).adminActivity.groupBy({
      by: ['action'],
      where,
      _count: true,
    });

    const actionStats = stats.reduce((acc: any, item: any) => {
      acc[item.action] = item._count;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: activities,
      total,
      todayCount,
      stats: {
        total: activities.length,
        actions: actionStats,
      },
    });

  } catch (error) {
    console.error('Error fetching admin activities:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب النشاطات' },
      { status: 500 }
    );
  }
}

// POST: إضافة نشاط جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, action, targetType, targetId, details, ipAddress, userAgent } = body;

    if (!adminId || !action) {
      return NextResponse.json(
        { success: false, message: 'بيانات غير مكتملة' },
        { status: 400 }
      );
    }

    const activity = await (prisma as any).adminActivity.create({
      data: {
        adminId,
        action,
        targetType,
        targetId,
        details,
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل النشاط بنجاح',
      data: activity,
    });

  } catch (error) {
    console.error('Error creating admin activity:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء تسجيل النشاط' },
      { status: 500 }
    );
  }
}
