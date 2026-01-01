import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, serviceSlug, serviceTitle } = body;

    // التحقق من البيانات المطلوبة
    if (!name || !phone || !message || !serviceSlug) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // حفظ الطلب في قاعدة البيانات
    try {
      const serviceRequest = await prisma.serviceRequest.create({
        data: {
          name,
          email: email || '',
          phone,
          message: message || '',
          serviceType: serviceSlug,
          projectType: serviceTitle || serviceSlug,
          status: 'PENDING',
        },
      });

      // إرسال إيميل للإدارة
      try {
        await sendEmail({
          to: process.env.ADMIN_EMAIL || 'admin@amg-invest.com',
          subject: `طلب خدمة جديد: ${serviceTitle || serviceSlug}`,
          text: `
طلب خدمة جديد من العميل:

الاسم: ${name}
الهاتف: ${phone}
${email ? `البريد الإلكتروني: ${email}` : ''}
الخدمة: ${serviceTitle || serviceSlug}

تفاصيل الطلب:
${message}

---
رقم الطلب: ${serviceRequest.id}
التاريخ: ${new Date().toLocaleString('ar-EG')}
          `,
          html: `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      padding: 20px;
      direction: rtl;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px;
    }
    .info-row {
      margin: 15px 0;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      border-right: 4px solid #667eea;
    }
    .info-label {
      font-weight: bold;
      color: #667eea;
      margin-bottom: 5px;
    }
    .info-value {
      color: #333;
      font-size: 16px;
    }
    .message-box {
      background: #fff9e6;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border: 1px solid #ffd700;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
    .badge {
      display: inline-block;
      padding: 5px 15px;
      background: #ffd700;
      color: #333;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 طلب خدمة جديد</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">AMG Real Estate</p>
    </div>
    
    <div class="content">
      <div class="info-row">
        <div class="info-label">👤 اسم العميل</div>
        <div class="info-value">${name}</div>
      </div>
      
      <div class="info-row">
        <div class="info-label">📞 رقم الهاتف</div>
        <div class="info-value">${phone}</div>
      </div>
      
      ${email ? `
      <div class="info-row">
        <div class="info-label">📧 البريد الإلكتروني</div>
        <div class="info-value">${email}</div>
      </div>
      ` : ''}
      
      <div class="info-row">
        <div class="info-label">🛠️ الخدمة المطلوبة</div>
        <div class="info-value">${serviceTitle || serviceSlug}</div>
      </div>
      
      <div class="message-box">
        <div class="info-label">💬 تفاصيل الطلب</div>
        <div class="info-value" style="margin-top: 10px; line-height: 1.6;">${message}</div>
      </div>
      
      <div style="text-align: center; margin-top: 20px;">
        <span class="badge">رقم الطلب: #${serviceRequest.id}</span>
        <p style="color: #666; font-size: 14px; margin-top: 10px;">
          ${new Date().toLocaleString('ar-EG', { 
            dateStyle: 'full', 
            timeStyle: 'short' 
          })}
        </p>
      </div>
    </div>
    
    <div class="footer">
      <p style="margin: 0;">© 2025 AMG Real Estate - جميع الحقوق محفوظة</p>
      <p style="margin: 5px 0 0 0; font-size: 12px;">
        تم إنشاء هذا الطلب تلقائياً من موقع AMG Real Estate
      </p>
    </div>
  </div>
</body>
</html>
          `,
        });
      } catch (emailError) {
        console.error('فشل إرسال الإيميل (لكن تم حفظ الطلب):', emailError);
      }

      return NextResponse.json({
        success: true,
        message: 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً.',
        requestId: serviceRequest.id,
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // حتى لو فشل حفظ البيانات، نحاول إرسال الإيميل
      try {
        await sendEmail({
          to: process.env.ADMIN_EMAIL || 'admin@amg-invest.com',
          subject: `طلب خدمة جديد (بدون حفظ في DB): ${serviceTitle || serviceSlug}`,
          html: `<h2>طلب خدمة جديد</h2><p><strong>الاسم:</strong> ${name}</p><p><strong>الهاتف:</strong> ${phone}</p>${email ? `<p><strong>البريد:</strong> ${email}</p>` : ''}<p><strong>الخدمة:</strong> ${serviceTitle || serviceSlug}</p><p><strong>الرسالة:</strong> ${message}</p>`,
          text: `
طلب خدمة جديد من العميل (لم يتم حفظه في قاعدة البيانات):

الاسم: ${name}
الهاتف: ${phone}
${email ? `البريد الإلكتروني: ${email}` : ''}
الخدمة: ${serviceTitle || serviceSlug}

تفاصيل الطلب:
${message}
          `,
        });
        
        return NextResponse.json({
          success: true,
          message: 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً.',
        });
      } catch (emailError) {
        console.error('فشل إرسال الإيميل:', emailError);
        throw new Error('فشل في معالجة الطلب');
      }
    }
  } catch (error) {
    console.error('Service request error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}
