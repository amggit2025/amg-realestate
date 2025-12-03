import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET: إحصائيات المشرفين
export async function GET(request: NextRequest) {
  try {
    // جلب جميع المشرفين
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        permissions: true, // ✅ إضافة الصلاحيات
        active: true,
        lastLogin: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // جلب الـ counts بشكل منفصل
    const adminsWithCounts = await Promise.all(
      admins.map(async (admin: any) => {
        const activitiesCount = await (prisma as any).adminActivity.count({
          where: { adminId: admin.id },
        });
        const sessionsCount = await (prisma as any).adminSession.count({
          where: { adminId: admin.id },
        });
        return {
          ...admin,
          activitiesCount,
          sessionsCount,
        };
      })
    );

    // إحصائيات عامة
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats = {
      total: admins.length,
      active: admins.filter((a: any) => a.active).length,
      inactive: admins.filter((a: any) => !a.active).length,
      superAdmins: admins.filter((a: any) => a.role === 'SUPER_ADMIN').length,
      admins: admins.filter((a: any) => a.role === 'ADMIN').length,
      moderators: admins.filter((a: any) => a.role === 'MODERATOR').length,
      loggedInLast7Days: admins.filter((a: any) => a.lastLogin && a.lastLogin >= last7Days).length,
      loggedInLast30Days: admins.filter((a: any) => a.lastLogin && a.lastLogin >= last30Days).length,
    };

    // أكثر المشرفين نشاطاً
    const topActiveAdmins = adminsWithCounts
      .sort((a: any, b: any) => b.activitiesCount - a.activitiesCount)
      .slice(0, 5)
      .map((a: any) => ({
        id: a.id,
        name: `${a.firstName} ${a.lastName}`,
        username: a.username,
        role: a.role,
        activitiesCount: a.activitiesCount,
      }));

    // نشاطات حسب الأيام (آخر 7 أيام)
    const activitiesByDay = await (prisma as any).adminActivity.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: last7Days,
        },
      },
      _count: true,
    });

    return NextResponse.json({
      success: true,
      data: {
        admins: adminsWithCounts.map((a: any) => ({
          ...a,
          name: `${a.firstName} ${a.lastName}`,
        })),
        stats,
        topActiveAdmins,
        activitiesByDay,
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
