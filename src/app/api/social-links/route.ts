import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - جلب روابط السوشيال ميديا
export async function GET() {
  try {
    // @ts-ignore
    let socialLinks = await prisma.socialLinks.findFirst({
      where: { isActive: true },
    });

    // إذا لم توجد بيانات، نرجع defaults
    if (!socialLinks) {
      socialLinks = {
        id: 'default',
        facebook: '',
        instagram: '',
        linkedin: '',
        tiktok: '',
        twitter: '',
        youtube: '',
        whatsapp: '',
        snapchat: '',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return NextResponse.json({
      success: true,
      data: socialLinks,
    });
  } catch (error) {
    console.error('Error fetching social links:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch social links' },
      { status: 500 }
    );
  }
}

// PUT - تحديث روابط السوشيال ميديا
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      facebook,
      instagram,
      linkedin,
      tiktok,
      twitter,
      youtube,
      whatsapp,
      snapchat,
    } = body;

    // @ts-ignore
    const existingSocialLinks = await prisma.socialLinks.findFirst({
      where: { isActive: true },
    });

    let socialLinks;
    if (existingSocialLinks) {
      // تحديث البيانات الموجودة
      // @ts-ignore
      socialLinks = await prisma.socialLinks.update({
        where: { id: existingSocialLinks.id },
        data: {
          facebook: facebook || null,
          instagram: instagram || null,
          linkedin: linkedin || null,
          tiktok: tiktok || null,
          twitter: twitter || null,
          youtube: youtube || null,
          whatsapp: whatsapp || null,
          snapchat: snapchat || null,
          updatedAt: new Date(),
        },
      });
    } else {
      // إنشاء بيانات جديدة
      // @ts-ignore
      socialLinks = await prisma.socialLinks.create({
        data: {
          facebook: facebook || null,
          instagram: instagram || null,
          linkedin: linkedin || null,
          tiktok: tiktok || null,
          twitter: twitter || null,
          youtube: youtube || null,
          whatsapp: whatsapp || null,
          snapchat: snapchat || null,
          isActive: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: socialLinks,
      message: 'تم تحديث روابط السوشيال ميديا بنجاح',
    });
  } catch (error) {
    console.error('Error updating social links:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update social links' },
      { status: 500 }
    );
  }
}
