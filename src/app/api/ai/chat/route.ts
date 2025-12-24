import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check API key
    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      console.error('Missing GOOGLE_AI_API_KEY environment variable')
      return NextResponse.json(
        { success: false, error: 'خطأ في إعدادات الخادم. يرجى المحاولة لاحقاً' },
        { status: 500 }
      )
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey)

    // Get recent properties for context
    const recentListings = await prisma.listings.findMany({
      take: 15,
      where: {
        status: 'APPROVED'
      },
      orderBy: { createdAt: 'desc' },
      select: {
        title: true,
        price: true,
        address: true,
        city: true,
        governorate: true,
        bedrooms: true,
        bathrooms: true,
        area: true,
        propertyType: true,
        description: true
      }
    })

    // Build AI context with real estate data
    const propertiesContext = recentListings.length > 0
      ? recentListings.map(p => `
- ${p.title}
  النوع: ${getPropertyTypeArabic(p.propertyType)}
  السعر: ${formatPrice(Number(p.price))}
  الموقع: ${p.city}, ${p.governorate}
  ${p.bedrooms ? `عدد الغرف: ${p.bedrooms}` : ''}
  ${p.bathrooms ? `عدد الحمامات: ${p.bathrooms}` : ''}
  ${p.area ? `المساحة: ${p.area}م²` : ''}
`).join('\n')
      : 'لا توجد عقارات متاحة حالياً.'

    // Build conversation history
    const conversationHistory = history && history.length > 0
      ? history.map((msg: any) => `${msg.sender === 'user' ? 'العميل' : 'المساعد'}: ${msg.text}`).join('\n')
      : ''

    // Create AI prompt
    const prompt = `
أنت مساعد عقاري ذكي لشركة AMG للاستثمار العقاري في مصر.
مهمتك الأساسية: مساعدة العملاء في العثور على العقار المثالي وتقديم استشارات عقارية احترافية.

معلومات عن شركة AMG:
- الاسم: AMG للاستثمار العقاري
- التخصص: بيع وتسويق وإدارة العقارات في مصر
- المناطق الرئيسية: القاهرة الجديدة، التجمع الخامس، الشيخ زايد، 6 أكتوبر، العاصمة الإدارية
- الخدمات: بيع، شراء، تأجير، استشارات عقارية، تمويل عقاري

العقارات المتاحة حالياً:
${propertiesContext}

${conversationHistory ? `محادثة سابقة:\n${conversationHistory}\n` : ''}

الرسالة الحالية من العميل:
${message}

إرشادات مهمة:
1. كن ودوداً، محترفاً، ومساعداً
2. استخدم اللغة العربية الفصحى المبسطة
3. إذا سأل عن عقار معين، ابحث في القائمة أعلاه واقترح الأنسب
4. اطرح أسئلة توضيحية لفهم احتياجات العميل بدقة (الميزانية، الموقع، عدد الغرف، إلخ)
5. قدم معلومات عن التمويل العقاري إذا سأل العميل
6. اقترح 2-3 عقارات مناسبة بناءً على متطلبات العميل
7. كن موجزاً ومباشراً في الإجابة (3-5 أسطر كحد أقصى)
8. لا تخترع معلومات - استخدم فقط البيانات المتاحة
9. إذا لم تجد عقار مناسب، اقترح بدائل أو اطلب تفاصيل أكثر
10. في نهاية كل رد، اقترح خطوة تالية للعميل

أمثلة على ردود جيدة:
- "مرحباً! يسعدني مساعدتك في إيجاد العقار المثالي. ما هي ميزانيتك التقريبية والمنطقة المفضلة لديك؟"
- "بناءً على ميزانيتك، وجدت 3 شقق رائعة في التجمع الخامس. هل تفضل أن أعرضها عليك؟"
- "التمويل العقاري متاح من خلال بنوك متعددة بفائدة تبدأ من 8%. هل تريد معرفة القسط الشهري المتوقع؟"

قواعد ممنوعة:
❌ لا تعطي معلومات طبية أو قانونية
❌ لا تعطي أسعار غير موجودة في القائمة
❌ لا تتحدث عن شركات منافسة
❌ لا تكن مملاً أو تستخدم كلام رسمي جداً

أجب الآن على سؤال العميل بطريقة احترافية ومفيدة:
`

    // Call Gemini AI
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 500,
      }
    })
    
    const result = await model.generateContent(prompt)
    const response = result.response
    const aiMessage = response.text()

    // Generate smart quick replies based on context
    const quickReplies = generateQuickReplies(message, aiMessage)

    return NextResponse.json({
      success: true,
      message: aiMessage,
      quickReplies
    })

  } catch (error: any) {
    console.error('AI Chat Error:', error)
    
    // Handle specific errors
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { success: false, error: 'خطأ في مفتاح API. يرجى المحاولة لاحقاً' },
        { status: 500 }
      )
    }

    if (error.message?.includes('quota')) {
      return NextResponse.json(
        { success: false, error: 'تم تجاوز حد الاستخدام. يرجى المحاولة بعد قليل' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى' },
      { status: 500 }
    )
  }
}

// Helper: Generate contextual quick replies
function generateQuickReplies(userMessage: string, aiResponse: string): string[] {
  const message = userMessage.toLowerCase()
  const response = aiResponse.toLowerCase()
  
  // بحث عن شقة
  if (message.includes('شقة') || message.includes('apartment')) {
    return [
      'ما هي الأسعار المتاحة؟',
      'أريد معاينة عقار',
      'معلومات عن التمويل',
      'أريد التحدث مع مندوب'
    ]
  }
  
  // سؤال عن السعر
  if (message.includes('سعر') || message.includes('price') || message.includes('كام')) {
    return [
      'كيف أحسب القسط الشهري؟',
      'ما هي المصاريف الإضافية؟',
      'هل يوجد تقسيط؟',
      'عقارات بميزانية أقل'
    ]
  }
  
  // سؤال عن الموقع
  if (message.includes('موقع') || message.includes('location') || message.includes('منطقة')) {
    return [
      'ما هي المرافق القريبة؟',
      'معلومات أكثر عن المنطقة',
      'مناطق بديلة قريبة',
      'وسائل المواصلات'
    ]
  }
  
  // سؤال عن التمويل
  if (message.includes('تمويل') || message.includes('قرض') || message.includes('بنك')) {
    return [
      'ما هي البنوك المتعاونة؟',
      'كيف أحسب القسط؟',
      'ما هي الأوراق المطلوبة؟',
      'مميزات التمويل العقاري'
    ]
  }
  
  // استثمار
  if (message.includes('استثمار') || message.includes('invest') || message.includes('عائد')) {
    return [
      'ما هو العائد المتوقع؟',
      'أفضل المناطق للاستثمار',
      'مقارنة العوائد',
      'نصائح استثمارية'
    ]
  }
  
  // رد الـ AI يحتوي على عقارات
  if (response.includes('وجدت') || response.includes('لدينا') || response.includes('متاح')) {
    return [
      'عرض تفاصيل أكثر',
      'أريد معاينة',
      'مقارنة العقارات',
      'حجز موعد'
    ]
  }
  
  // Default quick replies
  return [
    'أبحث عن شقة للسكن',
    'أريد استثمار عقاري',
    'معلومات عن التمويل',
    'التحدث مع مندوب مبيعات'
  ]
}

// Helper: Format price to Arabic
function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)} مليون جنيه`
  }
  return `${price.toLocaleString('ar-EG')} جنيه`
}

// Helper: Get property type in Arabic
function getPropertyTypeArabic(type: string): string {
  const types: Record<string, string> = {
    'APARTMENT': 'شقة',
    'VILLA': 'فيلا',
    'DUPLEX': 'دوبلكس',
    'STUDIO': 'استوديو',
    'PENTHOUSE': 'بنتهاوس',
    'TOWNHOUSE': 'تاون هاوس',
    'CHALET': 'شاليه',
    'LAND': 'أرض',
    'BUILDING': 'عمارة',
    'SHOP': 'محل تجاري',
    'OFFICE': 'مكتب'
  }
  return types[type] || type
}
