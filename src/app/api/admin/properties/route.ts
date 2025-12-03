import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // جلب جميع العقارات مع الإحصائيات
    const properties = await prisma.property.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // حساب الإحصائيات
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      total: properties.length,
      active: properties.filter(p => p.status === 'ACTIVE').length,
      pending: properties.filter(p => p.status === 'PENDING').length,
      sold: properties.filter(p => p.status === 'SOLD').length,
      rented: properties.filter(p => p.status === 'RENTED').length,
      forSale: properties.filter(p => p.purpose === 'SALE').length,
      forRent: properties.filter(p => p.purpose === 'RENT').length,
      thisMonth: properties.filter(p => new Date(p.createdAt) >= startOfMonth).length,
    };

    return NextResponse.json({
      success: true,
      data: properties,
      stats,
    });

  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب العقارات' },
      { status: 500 }
    );
  }
}
