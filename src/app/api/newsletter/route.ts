import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'

// Newsletter subscription schema
const newsletterSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  name: z.string().optional()
})

// Create email transporter (same as contact form)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER || 'site@amg-invest.com',
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = newsletterSchema.parse(body)
    
    console.log('Newsletter subscription:', validatedData)
    
    // Send notification email
    try {
      const transporter = createTransporter()
      
      const mailOptions = {
        from: process.env.SMTP_USER || 'site@amg-invest.com',
        to: 'site@amg-invest.com',
        subject: 'اشتراك جديد في النشرة الإخبارية - AMG العقارية',
        html: `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; }
              .header { background: linear-gradient(135deg, #3b82f6, #10b981); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>اشتراك جديد في النشرة الإخبارية</h2>
              </div>
              <p><strong>البريد الإلكتروني:</strong> ${validatedData.email}</p>
              ${validatedData.name ? `<p><strong>الاسم:</strong> ${validatedData.name}</p>` : ''}
              <p><strong>التاريخ:</strong> ${new Date().toLocaleString('ar-SA')}</p>
            </div>
          </body>
          </html>
        `,
        text: `
اشتراك جديد في النشرة الإخبارية

البريد الإلكتروني: ${validatedData.email}
${validatedData.name ? `الاسم: ${validatedData.name}\n` : ''}
التاريخ: ${new Date().toLocaleString('ar-SA')}
        `
      }
      
      await transporter.sendMail(mailOptions)
      console.log('Newsletter notification sent')
    } catch (emailError) {
      console.error('Newsletter email failed:', emailError)
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'تم اشتراكك بنجاح في النشرة الإخبارية!' 
    })
    
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى.' 
      },
      { status: 500 }
    )
  }
}
