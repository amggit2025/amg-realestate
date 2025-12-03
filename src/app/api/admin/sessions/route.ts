import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAdminToken } from '@/lib/admin-auth';

// GET: جلب الجلسات النشطة
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const isActive = searchParams.get('isActive');
    const current = searchParams.get('current'); // للحصول على جلسات المشرف الحالي

    // إذا كان current=true، نحصل على جلسات المشرف الحالي فقط
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
    if (isActive !== null) where.isActive = isActive === 'true';

    // جلب الجلسات
    const sessions = await (prisma as any).adminSession.findMany({
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
      orderBy: { lastActivity: 'desc' },
    });

    // حساب الإحصائيات
    const now = new Date();
    const stats = {
      total: sessions.length,
      active: sessions.filter((s: any) => s.isActive && s.expiresAt > now).length,
      expired: sessions.filter((s: any) => s.expiresAt <= now).length,
    };

    return NextResponse.json({
      success: true,
      data: sessions,
      stats,
    });

  } catch (error) {
    console.error('Error fetching admin sessions:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب الجلسات' },
      { status: 500 }
    );
  }
}

// DELETE: إنهاء جلسة
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'معرف الجلسة مطلوب' },
        { status: 400 }
      );
    }

    await (prisma as any).adminSession.update({
      where: { id: sessionId },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: 'تم إنهاء الجلسة بنجاح',
    });

  } catch (error) {
    console.error('Error terminating session:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء إنهاء الجلسة' },
      { status: 500 }
    );
  }
}
