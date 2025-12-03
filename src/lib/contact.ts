import { ContactFormData } from './validation'

// دالة مساعدة لإرسال النماذج
export interface FormResponse {
  success: boolean
  message?: string
  error?: string
}

export async function sendContactForm(data: ContactFormData): Promise<FormResponse> {
  try {
    console.log('Sending contact form data:', { ...data, message: data.message.substring(0, 50) + '...' })
    
    // تحويل البيانات إلى صيغة API الاستفسارات
    const inquiryData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: `${data.service} - ${data.urgency === 'high' ? 'عاجل' : data.urgency === 'medium' ? 'عادي' : 'غير عاجل'}`,
      message: `
الخدمة المطلوبة: ${data.service}
${data.budget ? `الميزانية المتوقعة: ${data.budget}` : ''}
الأولوية: ${data.urgency === 'high' ? 'عاجل 🔴' : data.urgency === 'medium' ? 'عادي 🟡' : 'غير عاجل 🟢'}
طريقة التواصل المفضلة: ${data.preferredContact === 'phone' ? 'هاتف 📱' : data.preferredContact === 'email' ? 'بريد إلكتروني 📧' : 'واتساب 💬'}

تفاصيل المشروع:
${data.message}
      `.trim(),
      inquiryType: 'SERVICE', // نوع الاستفسار: خدمة
    };
    
    const response = await fetch('/api/inquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inquiryData),
    })

    console.log('Response status:', response.status)
    
    const result = await response.json()
    console.log('Parsed result:', result)
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'فشل في إرسال الرسالة')
    }

    return {
      success: true,
      message: result.message || 'تم إرسال رسالتك بنجاح!'
    }
  } catch (error) {
    console.error('Form submission error details:', error)
    
    return {
      success: false,
      error: error instanceof Error 
        ? error.message 
        : 'حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى'
    }
  }
}
