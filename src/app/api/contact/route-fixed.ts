import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the form data
    const validatedData = contactFormSchema.parse(body)
    
    // For now, just simulate successful submission
    // In production, you would send email or save to database
    console.log('Contact form submission:', validatedData)
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return NextResponse.json({ 
      success: true, 
      message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' 
    })
    
  } catch (error) {
    console.error('Contact form error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.' 
      },
      { status: 500 }
    )
  }
}
