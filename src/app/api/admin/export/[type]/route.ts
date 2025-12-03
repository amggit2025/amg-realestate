import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const { type } = await params;

    // بناء الفلتر الزمني
    const dateFilter = from && to ? {
      createdAt: {
        gte: new Date(from),
        lte: new Date(to + 'T23:59:59'),
      },
    } : {};

    let data: any[] = [];
    let filename = '';
    let headers: string[] = [];

    // جلب البيانات حسب النوع
    switch (type) {
      case 'users':
        const users = await prisma.user.findMany({
          where: dateFilter,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            verified: true,
            createdAt: true,
            _count: {
              select: {
                properties: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
        
        data = users.map(u => ({
          'المعرف': u.id,
          'الاسم الأول': u.firstName,
          'الاسم الأخير': u.lastName,
          'البريد الإلكتروني': u.email,
          'الهاتف': u.phone || '',
          'مفعل': u.verified ? 'نعم' : 'لا',
          'عدد العقارات': u._count.properties,
          'تاريخ التسجيل': new Date(u.createdAt).toLocaleDateString('ar-EG'),
        }));
        filename = 'users';
        headers = ['المعرف', 'الاسم الأول', 'الاسم الأخير', 'البريد الإلكتروني', 'الهاتف', 'مفعل', 'عدد العقارات', 'تاريخ التسجيل'];
        break;

      case 'properties':
        const properties = await prisma.property.findMany({
          where: dateFilter,
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });

        data = properties.map(p => ({
          'المعرف': p.id,
          'العنوان': p.title,
          'النوع': p.propertyType,
          'الغرض': p.purpose,
          'السعر': p.price,
          'المدينة': p.city,
          'الحي': p.district,
          'غرف النوم': p.bedrooms,
          'دورات المياه': p.bathrooms,
          'المساحة': p.area,
          'الحالة': p.status,
          'المالك': `${p.user.firstName} ${p.user.lastName}`,
          'بريد المالك': p.user.email,
          'تاريخ الإضافة': new Date(p.createdAt).toLocaleDateString('ar-EG'),
        }));
        filename = 'properties';
        headers = ['المعرف', 'العنوان', 'النوع', 'الغرض', 'السعر', 'المدينة', 'الحي', 'غرف النوم', 'دورات المياه', 'المساحة', 'الحالة', 'المالك', 'بريد المالك', 'تاريخ الإضافة'];
        break;

      case 'inquiries':
        const inquiries = await prisma.inquiry.findMany({
          where: dateFilter,
          orderBy: { createdAt: 'desc' },
        });

        data = inquiries.map(i => ({
          'المعرف': i.id,
          'الاسم': i.name,
          'البريد الإلكتروني': i.email,
          'الهاتف': i.phone || '',
          'الموضوع': i.subject,
          'الرسالة': i.message,
          'النوع': i.inquiryType,
          'الحالة': i.status,
          'تاريخ الإرسال': new Date(i.createdAt).toLocaleDateString('ar-EG'),
        }));
        filename = 'inquiries';
        headers = ['المعرف', 'الاسم', 'البريد الإلكتروني', 'الهاتف', 'الموضوع', 'الرسالة', 'النوع', 'الحالة', 'تاريخ الإرسال'];
        break;

      case 'subscriptions':
        const subscriptions = await prisma.newsletterSubscription.findMany({
          where: dateFilter,
          orderBy: { createdAt: 'desc' },
        });

        data = subscriptions.map(s => ({
          'المعرف': s.id,
          'البريد الإلكتروني': s.email,
          'الحالة': s.status,
          'المصدر': s.source || '',
          'IP': s.ipAddress || '',
          'تاريخ الاشتراك': new Date(s.createdAt).toLocaleDateString('ar-EG'),
        }));
        filename = 'newsletter-subscriptions';
        headers = ['المعرف', 'البريد الإلكتروني', 'الحالة', 'المصدر', 'IP', 'تاريخ الاشتراك'];
        break;

      default:
        return NextResponse.json(
          { success: false, message: 'نوع غير صحيح' },
          { status: 400 }
        );
    }

    // تصدير CSV
    if (format === 'csv') {
      const csvContent = convertToCSV(data, headers);
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // تصدير JSON
    if (format === 'json') {
      return new NextResponse(JSON.stringify(data, null, 2), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}-${new Date().toISOString().split('T')[0]}.json"`,
        },
      });
    }

    return NextResponse.json(
      { success: false, message: 'صيغة غير مدعومة' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء التصدير' },
      { status: 500 }
    );
  }
}

// دالة تحويل البيانات إلى CSV
function convertToCSV(data: any[], headers: string[]): string {
  if (data.length === 0) {
    return '';
  }

  // إضافة BOM لدعم العربية في Excel
  const BOM = '\uFEFF';
  
  // إنشاء الصف الأول (Headers)
  const headerRow = headers.join(',');
  
  // إنشاء صفوف البيانات
  const dataRows = data.map(row => {
    return headers.map(header => {
      let value = row[header] || '';
      
      // معالجة القيم التي تحتوي على فواصل أو علامات اقتباس
      if (typeof value === 'string') {
        value = value.replace(/"/g, '""'); // تجنب مشاكل علامات الاقتباس
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = `"${value}"`;
        }
      }
      
      return value;
    }).join(',');
  });

  return BOM + headerRow + '\n' + dataRows.join('\n');
}
