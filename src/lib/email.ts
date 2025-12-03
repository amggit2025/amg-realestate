// ======================================================
// 📧 AMG Real Estate - Email Service (Nodemailer)
// ======================================================
import nodemailer from 'nodemailer'

// تكوين Nodemailer باستخدام إعدادات Hostinger SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '587'), // استخدام 587 بدل 465
  secure: false, // false for 587 (TLS)
  auth: {
    user: process.env.SMTP_USER, // site@amg-invest.com
    pass: process.env.SMTP_PASS, // Hostinger email password
  },
  tls: {
    rejectUnauthorized: false, // لتجنب مشاكل SSL
  },
})

// التحقق من الاتصال
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service connection error:', error)
  } else {
    console.log('✅ Email service is ready to send messages')
  }
})

// دالة لإرسال رمز التحقق
export async function sendVerificationEmail(
  to: string,
  name: string,
  verificationCode: string
): Promise<boolean> {
  try {
    const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'AMG Real Estate'}" <${fromEmail}>`,
      to,
      subject: 'رمز التحقق من البريد الإلكتروني - AMG Real Estate',
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .code-box {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
              color: #ffffff !important;
              font-size: 36px;
              font-weight: bold;
              letter-spacing: 8px;
              padding: 20px;
              border-radius: 10px;
              margin: 30px 0;
              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
              text-align: center;
            }
            .code-box span {
              color: #ffffff !important;
              background-color: transparent !important;
              display: inline-block;
              font-family: 'Courier New', monospace;
            }
            .message {
              color: #555;
              font-size: 16px;
              line-height: 1.6;
              margin: 20px 0;
            }
            .warning {
              background-color: #fff3cd;
              border-right: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
              color: #856404;
              font-size: 14px;
            }
            .footer {
              background-color: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #6c757d;
              font-size: 14px;
            }
            .footer a {
              color: #667eea;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 AMG Real Estate</h1>
              <p>مرحباً بك في عائلتنا العقارية</p>
            </div>
            
            <div class="content">
              <h2>مرحباً ${name}،</h2>
              <p class="message">
                شكراً لتسجيلك في منصة AMG Real Estate.<br>
                لإكمال عملية تفعيل حسابك، يرجى استخدام رمز التحقق التالي:
              </p>
              
              <div class="code-box" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; font-size: 36px; font-weight: bold; letter-spacing: 8px; padding: 20px; border-radius: 10px; margin: 30px 0; text-align: center;">
                <span style="color: #ffffff !important; background-color: transparent !important; display: inline-block; font-family: 'Courier New', monospace;">${verificationCode}</span>
              </div>
              
              <p class="message">
                هذا الرمز صالح لمدة <strong>30 دقيقة فقط</strong>.
              </p>
              
              <div class="warning">
                ⚠️ <strong>تنبيه أمني:</strong> لا تشارك هذا الرمز مع أي شخص.
                فريق AMG لن يطلب منك هذا الرمز أبداً.
              </div>
              
              <p class="message" style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; color: #856404;">
                💡 <strong>ملاحظة:</strong> إذا لم تجد الرسالة في صندوق الوارد، يرجى التحقق من مجلد <strong>البريد العشوائي (Spam/Junk)</strong>.
              </p>
            </div>
            
            <div class="footer">
              <p>
                إذا لم تطلب هذا الرمز، يرجى تجاهل هذا البريد الإلكتروني.<br>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}">زيارة الموقع</a>
              </p>
              <p style="margin-top: 20px;">
                © 2024 AMG Real Estate. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        مرحباً ${name},
        
        رمز التحقق الخاص بك هو: ${verificationCode}
        
        هذا الرمز صالح لمدة 30 دقيقة.
        
        إذا لم تطلب هذا الرمز، يرجى تجاهل هذا البريد.
        
        AMG Real Estate
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent successfully:', info.messageId)
    return true

  } catch (error) {
    console.error('❌ Error sending email:', error)
    return false
  }
}

// دالة لإرسال إيميل ترحيبي
export async function sendWelcomeEmail(
  to: string,
  name: string
): Promise<boolean> {
  try {
    const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'AMG Real Estate'}" <${fromEmail}>`,
      to,
      subject: 'مرحباً بك في AMG Real Estate! 🎉',
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 10px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
            .content { padding: 40px 30px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 مرحباً بك في AMG Real Estate</h1>
            </div>
            <div class="content">
              <h2>عزيزي/عزيزتي ${name},</h2>
              <p>نحن سعداء بانضمامك إلى منصة AMG Real Estate!</p>
              <p>الآن يمكنك:</p>
              <ul>
                <li>✅ إضافة عقاراتك للبيع أو الإيجار</li>
                <li>✅ تصفح آلاف العقارات المميزة</li>
                <li>✅ التواصل مع ملاك العقارات مباشرة</li>
                <li>✅ متابعة إحصائيات عقاراتك</li>
              </ul>
              <center>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="button">
                  ابدأ الآن
                </a>
              </center>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Welcome email sent:', info.messageId)
    return true

  } catch (error) {
    console.error('❌ Error sending welcome email:', error)
    return false
  }
}

// دالة عامة لإرسال البريد الإلكتروني
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text?: string
}): Promise<boolean> {
  try {
    const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'AMG Real Estate'}" <${fromEmail}>`,
      to,
      subject,
      html,
      text: text || subject,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent successfully:', info.messageId)
    return true

  } catch (error) {
    console.error('❌ Error sending email:', error)
    return false
  }
}

export default transporter
