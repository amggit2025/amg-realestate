import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendEmail } from '@/lib/email';

// GET - Get single appointment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const appointment = await prisma.appointment.findUnique({
      where: { id },
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
            propertyType: true,
            contactName: true,
            contactPhone: true
          }
        },
        listing: {
          select: {
            title: true,
            address: true,
            city: true,
            propertyType: true,
            contactName: true,
            contactPhone: true
          }
        }
      }
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'الموعد غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      appointment
    });

  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب الموعد' },
      { status: 500 }
    );
  }
}

// PATCH - Update appointment status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json();
    const { status, adminNotes, confirmedBy, cancellationReason } = body;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        property: {
          select: { title: true, address: true, city: true }
        },
        listing: {
          select: { title: true, address: true, city: true }
        }
      }
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'الموعد غير موجود' },
        { status: 404 }
      );
    }

    // Update appointment
    const updateData: any = {
      status,
      adminNotes: adminNotes || appointment.adminNotes,
      updatedAt: new Date()
    };

    if (status === 'CONFIRMED') {
      updateData.confirmedAt = new Date();
      updateData.confirmedBy = confirmedBy;
    }

    if (status === 'CANCELLED') {
      updateData.cancelledAt = new Date();
      updateData.cancellationReason = cancellationReason;
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: updateData
    });

    // Send email notification based on status
    const propertyDetails = appointment.property || appointment.listing;
    const propertyTitle = propertyDetails?.title || 'عقار';

    if (status === 'CONFIRMED') {
      const confirmEmailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .detail-box { background-color: #f0fff4; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #48bb78; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ تم تأكيد موعد المعاينة</h1>
    </div>
    <div class="content">
      <p>عزيزي/عزيزتي <strong>${appointment.contactName}</strong>،</p>
      <p>نسعد بإبلاغك بأنه تم تأكيد موعد معاينة العقار بنجاح.</p>
      
      <div class="detail-box">
        <h3 style="color: #38a169; margin-top: 0;">📋 تفاصيل الموعد المؤكد</h3>
        <p><strong>العقار:</strong> ${propertyTitle}</p>
        <p><strong>التاريخ:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString('ar-EG', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
        <p><strong>الوقت:</strong> ${appointment.timeSlot}</p>
        <p><strong>الموقع:</strong> ${propertyDetails?.address}, ${propertyDetails?.city}</p>
      </div>

      <p><strong>يرجى الالتزام بالموعد المحدد.</strong></p>
      <p>في حالة الرغبة في التأجيل أو الإلغاء، يرجى التواصل معنا قبل 24 ساعة على الأقل.</p>

      <div style="background-color: #bee3f8; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p style="margin: 0;"><strong>📞 للتواصل:</strong></p>
        <p style="margin: 5px 0;">هاتف: 01000025080</p>
        <p style="margin: 5px 0;">واتساب: 01000025080</p>
      </div>
    </div>
  </div>
</body>
</html>
      `;

      await sendEmail({
        to: appointment.contactEmail,
        subject: `✅ تأكيد موعد المعاينة - ${propertyTitle}`,
        html: confirmEmailHtml
      });
    }

    if (status === 'CANCELLED') {
      const cancelEmailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .detail-box { background-color: #fff5f5; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #f56565; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>❌ تم إلغاء موعد المعاينة</h1>
    </div>
    <div class="content">
      <p>عزيزي/عزيزتي <strong>${appointment.contactName}</strong>،</p>
      <p>نأسف لإبلاغك بأنه تم إلغاء موعد المعاينة.</p>
      
      <div class="detail-box">
        <h3 style="color: #e53e3e; margin-top: 0;">📋 تفاصيل الموعد الملغي</h3>
        <p><strong>العقار:</strong> ${propertyTitle}</p>
        <p><strong>التاريخ:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString('ar-EG')}</p>
        <p><strong>الوقت:</strong> ${appointment.timeSlot}</p>
        ${cancellationReason ? `<p><strong>سبب الإلغاء:</strong> ${cancellationReason}</p>` : ''}
      </div>

      <p>يمكنك حجز موعد آخر في أي وقت عبر موقعنا أو التواصل معنا مباشرة.</p>

      <div style="background-color: #bee3f8; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p style="margin: 0;"><strong>📞 للتواصل:</strong></p>
        <p style="margin: 5px 0;">هاتف: 01000025080</p>
      </div>
    </div>
  </div>
</body>
</html>
      `;

      await sendEmail({
        to: appointment.contactEmail,
        subject: `❌ إلغاء موعد المعاينة - ${propertyTitle}`,
        html: cancelEmailHtml
      });
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الموعد بنجاح',
      appointment: updatedAppointment
    });

  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء تحديث الموعد' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel appointment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'الموعد غير موجود' },
        { status: 404 }
      );
    }

    await prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancellationReason: 'تم الإلغاء من قبل المستخدم'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم إلغاء الموعد بنجاح'
    });

  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء إلغاء الموعد' },
      { status: 500 }
    );
  }
}
