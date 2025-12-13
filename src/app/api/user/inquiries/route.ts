import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import prisma from '@/lib/db';

// GET: جلب استفسارات اليوزر (الاستفسارات على عقاراته)
export async function GET(request: NextRequest) {
  try {
    // استخراج التوكن
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

    // جلب جميع الاستفسارات على عقارات اليوزر
    const inquiries = await prisma.inquiry.findMany({
      where: {
        userId: user.id, // استفسارات على عقارات هذا اليوزر
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            city: true,
            price: true,
            currency: true,
            images: {
              take: 1,
              select: {
                url: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      inquiries,
    });
  } catch (error) {
    console.error('Error fetching user inquiries:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب الاستفسارات' },
      { status: 500 }
    );
  }
}
