import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, inquiryType, propertyId, userId } = body;

    // التحقق من البيانات الأساسية
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'يرجى ملء جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من صحة البريد الإلكتروني
    if (!email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'يرجى إدخال بريد إلكتروني صالح' },
        { status: 400 }
      );
    }

    // جلب معلومات الطلب
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';

    // حفظ الاستفسار في قاعدة البيانات
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        subject,
        message,
        inquiryType: inquiryType || 'GENERAL',
        status: 'PENDING',
        propertyId: propertyId || null,
        userId: userId || null,
      },
    });

    // إعداد محتوى البريد الإلكتروني للأدمن
    const emailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 20px;
      direction: rtl;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      margin-top: 10px;
      font-weight: 600;
    }
    .content {
      padding: 30px;
    }
    .info-row {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e5e7eb;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .label {
      color: #6b7280;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .value {
      color: #111827;
      font-size: 16px;
      font-weight: 500;
    }
    .message-box {
      background: #f9fafb;
      border-right: 4px solid #3b82f6;
      padding: 20px;
      border-radius: 8px;
      margin-top: 10px;
      line-height: 1.8;
      color: #374151;
    }
    .type-badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
    }
    .type-property { background: #dbeafe; color: #1e40af; }
    .type-project { background: #fef3c7; color: #92400e; }
    .type-service { background: #d1fae5; color: #065f46; }
    .type-general { background: #e5e7eb; color: #374151; }
    .footer {
      background: #f9fafb;
      padding: 25px;
      text-align: center;
      color: #6b7280;
      font-size: 13px;
      border-top: 1px solid #e5e7eb;
    }
    .action-button {
      display: inline-block;
      background: #3b82f6;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 8px;
      margin: 20px 0;
      font-weight: 600;
      transition: all 0.3s;
    }
    .action-button:hover {
      background: #2563eb;
    }
    .meta-info {
      display: flex;
      gap: 20px;
      margin-top: 20px;
      padding: 15px;
      background: #f3f4f6;
      border-radius: 8px;
      font-size: 12px;
      color: #6b7280;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>🔔 استفسار جديد من موقع AMG</h1>
      <div class="badge">ID: ${inquiry.id.slice(0, 8)}</div>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- نوع الاستفسار -->
      <div class="info-row">
        <div class="label">نوع الاستفسار</div>
        <div class="value">
          <span class="type-badge type-${inquiryType.toLowerCase()}">
            ${inquiryType === 'PROPERTY' ? '🏠 عقار' : 
              inquiryType === 'PROJECT' ? '🏗️ مشروع' : 
              inquiryType === 'SERVICE' ? '⚙️ خدمة' : '💬 عام'}
          </span>
        </div>
      </div>

      <!-- معلومات المرسل -->
      <div class="info-row">
        <div class="label">👤 اسم المرسل</div>
        <div class="value">${name}</div>
      </div>

      <div class="info-row">
        <div class="label">📧 البريد الإلكتروني</div>
        <div class="value">
          <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
        </div>
      </div>

      ${phone ? `
      <div class="info-row">
        <div class="label">📱 رقم الهاتف</div>
        <div class="value">
          <a href="tel:${phone}" style="color: #3b82f6; text-decoration: none;">${phone}</a>
        </div>
      </div>
      ` : ''}

      <!-- الموضوع -->
      <div class="info-row">
        <div class="label">📋 الموضوع</div>
        <div class="value">${subject}</div>
      </div>

      <!-- الرسالة -->
      <div class="info-row">
        <div class="label">💬 الرسالة</div>
        <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
      </div>

      <!-- زر الانتقال لإدارة الاستفسارات -->
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/inquiries" class="action-button">
          عرض في لوحة التحكم
        </a>
      </div>

      <!-- معلومات إضافية -->
      <div class="meta-info">
        <div class="meta-item">
          <span>⏰</span>
          <span>${new Date().toLocaleString('ar-EG', { 
            dateStyle: 'full', 
            timeStyle: 'short' 
          })}</span>
        </div>
        <div class="meta-item">
          <span>🌐</span>
          <span>IP: ${ipAddress}</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin: 0 0 10px 0; font-weight: 600; color: #374151;">AMG Real Estate</p>
      <p style="margin: 0;">مجموعة أحمد الملاح للمقاولات والتشطيبات والتسويق العقاري</p>
      <p style="margin: 10px 0 0 0; font-size: 11px;">
        هذا البريد تم إرساله تلقائياً من نظام إدارة الاستفسارات
      </p>
    </div>
  </div>
</body>
</html>
    `;

    // إرسال البريد الإلكتروني للأدمن
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'info@amgrealestate.com',
        subject: `استفسار جديد: ${subject}`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // نكمل حتى لو فشل الإيميل - المهم الاستفسار اتحفظ في DB
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال استفسارك بنجاح! سنتواصل معك قريباً 🎉',
      data: {
        id: inquiry.id,
        createdAt: inquiry.createdAt,
      },
    });

  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء إرسال الاستفسار. يرجى المحاولة مرة أخرى' 
      },
      { status: 500 }
    );
  }
}

// GET: للحصول على إحصائيات الاستفسارات (للصفحة الرئيسية أو Dashboard)
export async function GET() {
  try {
    const [total, pending, inProgress, resolved] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'PENDING' } }),
      prisma.inquiry.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.inquiry.count({ where: { status: 'RESOLVED' } }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        resolved,
      },
    });
  } catch (error) {
    console.error('Error fetching inquiry stats:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب الإحصائيات' },
      { status: 500 }
    );
  }
}
