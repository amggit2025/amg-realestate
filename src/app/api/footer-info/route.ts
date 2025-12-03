import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - جلب معلومات Footer النشطة
export async function GET() {
  try {
    // @ts-ignore
    const footerInfo = await prisma.footerInfo.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    // إذا مفيش داتا، نرجع default values
    if (!footerInfo) {
      return NextResponse.json({
        success: true,
        data: {
          title: "🏆 AMG Real Estate - شريكك الموثوق في عالم العقارات",
          subtitle: "ابدأ رحلتك العقارية معنا اليوم",
          yearsExperience: 15,
          happyClients: 5000,
          completedProjects: 200,
          contactPhone: "+20 123 456 7890",
          contactEmail: "info@amgrealestate.com",
          address: "القاهرة، مصر",
          whatsapp: null
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: footerInfo
    });
  } catch (error) {
    console.error('Error fetching footer info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch footer info' },
      { status: 500 }
    );
  }
}

// PUT - تحديث معلومات Footer
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      title,
      subtitle,
      yearsExperience,
      happyClients,
      completedProjects,
      contactPhone,
      contactEmail,
      address,
      whatsapp
    } = body;

    // Validation
    if (yearsExperience && (yearsExperience < 0 || yearsExperience > 100)) {
      return NextResponse.json(
        { success: false, error: 'Years of experience must be between 0 and 100' },
        { status: 400 }
      );
    }

    if (happyClients && happyClients < 0) {
      return NextResponse.json(
        { success: false, error: 'Happy clients must be positive' },
        { status: 400 }
      );
    }

    if (completedProjects && completedProjects < 0) {
      return NextResponse.json(
        { success: false, error: 'Completed projects must be positive' },
        { status: 400 }
      );
    }

    // @ts-ignore
    const existingFooterInfo = await prisma.footerInfo.findFirst({
      where: { isActive: true }
    });

    let footerInfo;

    if (existingFooterInfo) {
      // Update existing
      // @ts-ignore
      footerInfo = await prisma.footerInfo.update({
        where: { id: existingFooterInfo.id },
        data: {
          ...(title !== undefined && { title }),
          ...(subtitle !== undefined && { subtitle }),
          ...(yearsExperience !== undefined && { yearsExperience }),
          ...(happyClients !== undefined && { happyClients }),
          ...(completedProjects !== undefined && { completedProjects }),
          ...(contactPhone !== undefined && { contactPhone }),
          ...(contactEmail !== undefined && { contactEmail }),
          ...(address !== undefined && { address }),
          ...(whatsapp !== undefined && { whatsapp })
        }
      });
    } else {
      // Create new
      // @ts-ignore
      footerInfo = await prisma.footerInfo.create({
        data: {
          title: title || "🏆 AMG Real Estate - شريكك الموثوق في عالم العقارات",
          subtitle: subtitle || "ابدأ رحلتك العقارية معنا اليوم",
          yearsExperience: yearsExperience || 15,
          happyClients: happyClients || 5000,
          completedProjects: completedProjects || 200,
          contactPhone: contactPhone || "+20 123 456 7890",
          contactEmail: contactEmail || "info@amgrealestate.com",
          address: address || "القاهرة، مصر",
          whatsapp: whatsapp || null,
          isActive: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: footerInfo
    });
  } catch (error) {
    console.error('Error updating footer info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update footer info' },
      { status: 500 }
    );
  }
}
