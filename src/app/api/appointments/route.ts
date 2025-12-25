import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendEmail } from '@/lib/email';

// POST - Create new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      propertyId,
      listingId,
      contactName,
      contactEmail,
      contactPhone,
      appointmentDate,
      timeSlot,
      notes
    } = body;

    // Validation
    if (!contactName || !contactEmail || !contactPhone || !appointmentDate || !timeSlot) {
      return NextResponse.json(
        { success: false, message: 'يرجى ملء جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    if (!propertyId && !listingId) {
      return NextResponse.json(
        { success: false, message: 'يرجى تحديد العقار' },
        { status: 400 }
      );
    }

    // Check if appointment date is in the future
    const appointmentDateTime = new Date(appointmentDate);
    if (appointmentDateTime < new Date()) {
      return NextResponse.json(
        { success: false, message: 'يجب أن يكون موعد المعاينة في المستقبل' },
        { status: 400 }
      );
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        userId: userId || null,
        propertyId: propertyId || null,
        listingId: listingId || null,
        contactName,
        contactEmail: contactEmail.toLowerCase(),
        contactPhone,
        appointmentDate: appointmentDateTime,
        timeSlot,
        notes: notes || null,
        status: 'PENDING'
      },
      include: {
        property: {
          select: {
            title: true,
            address: true,
            city: true
          }
        },
        listing: {
          select: {
            title: true,
            address: true,
            city: true
          }
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Get property details
    const propertyDetails = appointment.property || appointment.listing;
    const propertyTitle = propertyDetails?.title || 'عقار';
    const propertyLocation = `${propertyDetails?.city || ''}, ${propertyDetails?.address || ''}`;

    // Send confirmation email to user
    const userEmailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .detail-box { background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
    .detail-label { font-weight: bold; color: #667eea; }
    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ تم حجز موعد المعاينة بنجاح</h1>
    </div>
    <div class="content">
      <p>عزيزي/عزيزتي <strong>${contactName}</strong>،</p>
      <p>شكراً لك على حجز موعد معاينة العقار. تم تسجيل طلبك بنجاح وسيتم التواصل معك قريباً لتأكيد الموعد.</p>
      
      <div class="detail-box">
        <h3 style="color: #667eea; margin-top: 0;">📋 تفاصيل الموعد</h3>
        <div class="detail-row">
          <span class="detail-label">رقم الحجز:</span>
          <span>#${appointment.id.slice(0, 8).toUpperCase()}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">العقار:</span>
          <span>${propertyTitle}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">الموقع:</span>
          <span>${propertyLocation}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">التاريخ:</span>
          <span>${new Date(appointmentDate).toLocaleDateString('ar-EG', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">الوقت:</span>
          <span>${timeSlot}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">الحالة:</span>
          <span style="color: #ffa500;">⏳ قيد المراجعة</span>
        </div>
      </div>

      ${notes ? `
      <div class="detail-box">
        <h3 style="color: #667eea; margin-top: 0;">📝 ملاحظات</h3>
        <p style="margin: 0;">${notes}</p>
      </div>
      ` : ''}

      <p><strong>ملاحظة مهمة:</strong></p>
      <ul>
        <li>سيتم التواصل معك خلال 24 ساعة لتأكيد الموعد</li>
        <li>يرجى الوصول في الموعد المحدد</li>
        <li>في حالة الرغبة في تغيير الموعد، يرجى التواصل معنا</li>
      </ul>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/appointments" class="button">
          عرض مواعيدي
        </a>
      </div>
    </div>
    <div class="footer">
      <p><strong>AMG للاستثمار العقاري</strong></p>
      <p>📞 01000025080 | 📧 info@amg-realestate.com</p>
      <p>© 2024 جميع الحقوق محفوظة</p>
    </div>
  </div>
</body>
</html>
    `;

    // Send email to user
    await sendEmail({
      to: contactEmail,
      subject: `✅ تأكيد حجز موعد المعاينة - ${propertyTitle}`,
      html: userEmailHtml
    });

    // Send notification email to admin
    const adminEmailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .detail-box { background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 حجز موعد معاينة جديد</h1>
    </div>
    <div class="content">
      <p>تم استلام طلب حجز موعد معاينة جديد:</p>
      
      <div class="detail-box">
        <h3>📋 بيانات العميل</h3>
        <p><strong>الاسم:</strong> ${contactName}</p>
        <p><strong>البريد:</strong> ${contactEmail}</p>
        <p><strong>الهاتف:</strong> ${contactPhone}</p>
      </div>

      <div class="detail-box">
        <h3>🏠 بيانات العقار</h3>
        <p><strong>العقار:</strong> ${propertyTitle}</p>
        <p><strong>الموقع:</strong> ${propertyLocation}</p>
      </div>

      <div class="detail-box">
        <h3>📅 بيانات الموعد</h3>
        <p><strong>التاريخ:</strong> ${new Date(appointmentDate).toLocaleDateString('ar-EG', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
        <p><strong>الوقت:</strong> ${timeSlot}</p>
        <p><strong>رقم الحجز:</strong> #${appointment.id.slice(0, 8).toUpperCase()}</p>
      </div>

      ${notes ? `
      <div class="detail-box">
        <h3>📝 ملاحظات العميل</h3>
        <p>${notes}</p>
      </div>
      ` : ''}

      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/appointments" class="button">
          إدارة المواعيد
        </a>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'info@amg-realestate.com',
      subject: `🔔 حجز موعد معاينة جديد - ${propertyTitle}`,
      html: adminEmailHtml
    });

    return NextResponse.json({
      success: true,
      message: 'تم حجز الموعد بنجاح',
      appointment: {
        id: appointment.id,
        appointmentDate: appointment.appointmentDate,
        timeSlot: appointment.timeSlot,
        status: appointment.status
      }
    });

  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء حجز الموعد' },
      { status: 500 }
    );
  }
}

// GET - Get appointments (with filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const propertyId = searchParams.get('propertyId');
    const listingId = searchParams.get('listingId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    const where: any = {};
    
    if (userId) where.userId = userId;
    if (propertyId) where.propertyId = propertyId;
    if (listingId) where.listingId = listingId;
    if (status) where.status = status;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        orderBy: { appointmentDate: 'asc' },
        take: limit,
        skip: (page - 1) * limit,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          property: {
            select: {
              title: true,
              address: true,
              city: true,
              propertyType: true
            }
          },
          listing: {
            select: {
              title: true,
              address: true,
              city: true,
              propertyType: true
            }
          }
        }
      }),
      prisma.appointment.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      appointments,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit
      }
    });

  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب المواعيد' },
      { status: 500 }
    );
  }
}
