import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validation'
import nodemailer from 'nodemailer'
import prisma from '@/lib/db'

// Create email transporter
const createTransporter = () => {
  // استخدام SendGrid بدلاً من Hostinger (أكثر استقراراً)
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.sendgrid.net',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.EMAIL_USER || 'apikey',
      pass: process.env.EMAIL_PASSWORD
    }
  })
}

// Email template
interface EmailData {
  name: string;
  email: string;
  phone: string;
  service: string;
  budget?: string;
  urgency: string;
  preferredContact: string;
  message: string;
}

const createEmailHTML = (data: EmailData) => {
  const serviceLabels: Record<string, string> = {
    construction: 'أعمال المقاولات والبناء',
    finishing: 'التشطيبات والديكور',
    furniture: 'الأثاث والفرش',
    marketing: 'التسويق العقاري',
    consultation: 'استشارة عقارية',
    maintenance: 'الصيانة والترميم',
    real_estate: 'بيع وشراء العقارات',
    other: 'خدمة أخرى'
  }

  const urgencyLabels: Record<string, string> = {
    low: 'غير عاجل',
    medium: 'متوسط الأولوية',
    high: 'عاجل'
  }

  const contactLabels: Record<string, string> = {
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    whatsapp: 'واتساب'
  }

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>رسالة جديدة من موقع AMG العقارية</title>
      <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3b82f6, #10b981); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #374151; margin-bottom: 5px; }
        .value { color: #6b7280; line-height: 1.6; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; }
        .priority-high { color: #ef4444; font-weight: bold; }
        .priority-medium { color: #f59e0b; font-weight: bold; }
        .priority-low { color: #10b981; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>رسالة جديدة من موقع AMG العقارية</h1>
          <p>تم استلام رسالة جديدة من العميل</p>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="label">الاسم:</div>
            <div class="value">${data.name}</div>
          </div>
          
          <div class="field">
            <div class="label">البريد الإلكتروني:</div>
            <div class="value">${data.email}</div>
          </div>
          
          <div class="field">
            <div class="label">رقم الهاتف:</div>
            <div class="value">${data.phone}</div>
          </div>
          
          <div class="field">
            <div class="label">الخدمة المطلوبة:</div>
            <div class="value">${serviceLabels[data.service] || data.service}</div>
          </div>
          
          ${data.budget ? `
          <div class="field">
            <div class="label">الميزانية:</div>
            <div class="value">${data.budget}</div>
          </div>
          ` : ''}
          
          <div class="field">
            <div class="label">مستوى الأولوية:</div>
            <div class="value priority-${data.urgency}">${urgencyLabels[data.urgency] || data.urgency}</div>
          </div>
          
          <div class="field">
            <div class="label">طريقة التواصل المفضلة:</div>
            <div class="value">${contactLabels[data.preferredContact] || data.preferredContact}</div>
          </div>
          
          <div class="field">
            <div class="label">الرسالة:</div>
            <div class="value" style="background: #f9fafb; padding: 15px; border-radius: 8px; border-right: 4px solid #3b82f6;">${data.message}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>تم إرسال هذه الرسالة من موقع AMG العقارية</p>
          <p>التاريخ: ${new Date().toLocaleString('ar-SA')}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Plain text version
const createEmailText = (data: EmailData) => {
  const serviceLabels: Record<string, string> = {
    construction: 'أعمال المقاولات والبناء',
    finishing: 'التشطيبات والديكور',
    furniture: 'الأثاث والفرش',
    marketing: 'التسويق العقاري',
    consultation: 'استشارة عقارية',
    maintenance: 'الصيانة والترميم',
    other: 'خدمة أخرى'
  }

  return `
رسالة جديدة من موقع AMG العقارية

الاسم: ${data.name}
البريد الإلكتروني: ${data.email}
رقم الهاتف: ${data.phone}
الخدمة المطلوبة: ${serviceLabels[data.service] || data.service}
${data.budget ? `الميزانية: ${data.budget}\n` : ''}
الرسالة: ${data.message}

التاريخ: ${new Date().toLocaleString('ar-SA')}
  `
}

export async function POST(request: NextRequest) {
  try {
    // تسجيل معلومات الطلب للتتبع
    console.log('📨 Contact API - Incoming request')
    console.log('Request headers:', Object.fromEntries(request.headers.entries()))
    
    let body;
    try {
      body = await request.json()
      console.log('📋 Request body received:', { ...body, message: body.message?.substring(0, 100) + '...' })
    } catch (jsonError) {
      console.error('❌ JSON parsing error:', jsonError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'البيانات المرسلة غير صالحة. يرجى التحقق من صحة البيانات والمحاولة مرة أخرى.' 
        },
        { status: 400 }
      )
    }
    
    // Handle service request type
    if (body.type === 'service_request') {
      // For service requests, we use a simpler validation
      const serviceRequestData = {
        name: body.name,
        email: body.email,
        phone: body.phone,
        service: body.serviceType || 'service_request',
        message: body.message || 'طلب خدمة جديد',
        urgency: 'medium',
        preferredContact: 'phone',
        consent: true
      }
      
      console.log('Service request submission:', serviceRequestData)
      
      try {
        // Save to database
        const savedRequest = await prisma.serviceRequest.create({
          data: {
            name: body.name,
            email: body.email,
            phone: body.phone,
            serviceType: body.serviceType || 'خدمة عامة',
            projectType: body.projectType || null,
            budget: body.budget || null,
            timeline: body.timeline || null,
            message: body.message || null,
            status: 'PENDING'
          }
        })
        
        console.log('✅ Service request saved to database:', savedRequest.id)
        
        const transporter = createTransporter()
        
        // Send notification to site owner
        const mailOptions = {
          from: process.env.EMAIL_FROM || 'site@amg-invest.com',
          to: process.env.EMAIL_FROM || 'site@amg-invest.com',
          subject: body.subject || `طلب خدمة جديد من ${serviceRequestData.name}`,
          html: createEmailHTML(serviceRequestData),
          text: createEmailText(serviceRequestData),
          replyTo: serviceRequestData.email
        }
        
        await transporter.sendMail(mailOptions)
        
        // Send confirmation email to customer
        const confirmationOptions = {
          from: process.env.EMAIL_FROM || 'site@amg-invest.com',
          to: serviceRequestData.email,
          subject: 'تأكيد استلام طلب الخدمة - AMG العقارية',
          html: `
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
              <meta charset="UTF-8">
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; }
                .header { text-align: center; margin-bottom: 30px; }
                .logo { color: #3b82f6; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">AMG العقارية</div>
                  <h2>شكراً لطلب الخدمة</h2>
                </div>
                <p>عزيزي/عزيزتي ${serviceRequestData.name},</p>
                <p>تم استلام طلبك للخدمة: <strong>${body.serviceType}</strong></p>
                <p>سيتم التواصل معك قريباً لتأكيد التفاصيل وتقديم عرض السعر.</p>
                <p>مع أطيب التحيات،<br>فريق AMG العقارية</p>
              </div>
            </body>
            </html>
          `
        }
        
        await transporter.sendMail(confirmationOptions)
        
        console.log('Emails sent successfully')
        
        return NextResponse.json({ 
          success: true, 
          message: 'تم إرسال طلب الخدمة بنجاح' 
        })
        
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        return NextResponse.json(
          { error: 'فشل في إرسال البريد الإلكتروني' },
          { status: 500 }
        )
      }
    }
    
    // Regular contact form validation
    const validatedData = contactFormSchema.parse(body)
    
    console.log('Contact form submission:', validatedData)
    
    // Send email
    try {
      const transporter = createTransporter()
      
      // Send notification to site owner
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'site@amg-invest.com',
        to: process.env.EMAIL_FROM || 'site@amg-invest.com',
        subject: `رسالة جديدة من ${validatedData.name} - ${validatedData.service}`,
        html: createEmailHTML(validatedData),
        text: createEmailText(validatedData),
        replyTo: validatedData.email
      }
      
      await transporter.sendMail(mailOptions)
      
      // Send confirmation email to customer
      const confirmationOptions = {
        from: process.env.EMAIL_FROM || 'site@amg-invest.com',
        to: validatedData.email,
        subject: 'تأكيد استلام رسالتك - AMG العقارية',
        html: `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; }
              .header { text-align: center; margin-bottom: 30px; }
              .logo { color: #3b82f6; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">AMG العقارية</div>
                <h2>شكراً لتواصلك معنا</h2>
              </div>
              
              <p>عزيزي/عزيزتي ${validatedData.name}،</p>
              
              <p>تم استلام رسالتك بنجاح. سيقوم فريقنا بمراجعة طلبك والرد عليك في أقرب وقت ممكن.</p>
              
              <p><strong>تفاصيل طلبك:</strong></p>
              <ul style="background: #f9fafb; padding: 20px; border-radius: 8px;">
                <li>الخدمة: ${validatedData.service}</li>
                <li>رقم الهاتف: ${validatedData.phone}</li>
                ${validatedData.budget ? `<li>الميزانية: ${validatedData.budget}</li>` : ''}
              </ul>
              
              <p>للاستفسارات العاجلة، يمكنك التواصل معنا على:</p>
              <p>📞 الهاتف: 01234567890<br>
                 📧 البريد الإلكتروني: site@amg-invest.com</p>
              
              <p>شكراً لثقتك في AMG العقارية</p>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280;">
                <p>AMG العقارية - شريكك في النجاح</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
عزيزي/عزيزتي ${validatedData.name}،

تم استلام رسالتك بنجاح. سيقوم فريقنا بمراجعة طلبك والرد عليك في أقرب وقت ممكن.

تفاصيل طلبك:
- الخدمة: ${validatedData.service}
- رقم الهاتف: ${validatedData.phone}
${validatedData.budget ? `- الميزانية: ${validatedData.budget}\n` : ''}

للاستفسارات العاجلة:
الهاتف: 01234567890
البريد الإلكتروني: site@amg-invest.com

شكراً لثقتك في AMG العقارية
        `
      }
      
      await transporter.sendMail(confirmationOptions)
      console.log('Emails sent successfully')
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Continue anyway - we'll still show success to user
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' 
    })
    
  } catch (error) {
    console.error('❌ Contact form error:', error)
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // التحقق من نوع الخطأ لإعطاء رسالة مناسبة
    let errorMessage = 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.'
    let statusCode = 500
    
    if (error instanceof Error) {
      if (error.message.includes('validation')) {
        errorMessage = 'البيانات المدخلة غير صحيحة. يرجى التحقق من البيانات والمحاولة مرة أخرى.'
        statusCode = 400
      } else if (error.message.includes('network') || error.message.includes('timeout')) {
        errorMessage = 'مشكلة في الاتصال. يرجى التحقق من الإنترنت والمحاولة مرة أخرى.'
        statusCode = 503
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        message: errorMessage // للتوافق مع الكود الحالي
      },
      { 
        status: statusCode,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    )
  }
}
