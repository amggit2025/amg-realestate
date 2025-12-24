# 🤖 AI Property Assistant - خطة التنفيذ الكاملة

## 📅 الجدول الزمني (3-4 أسابيع)

### **Week 1: الـ UI Component**
- [ ] إنشاء Chatbot UI (floating button + chat window)
- [ ] Message components (user/AI bubbles)
- [ ] Input field with emoji support
- [ ] Typing indicator animation
- [ ] Quick reply buttons
- [ ] Message history storage (localStorage)

### **Week 2: AI Integration**
- [ ] اختيار AI Provider (OpenAI/Gemini)
- [ ] إنشاء API Key
- [ ] Backend API route (/api/ai/chat)
- [ ] AI Prompt Engineering
- [ ] Context building (عقارات AMG)
- [ ] Error handling & retries

### **Week 3: Smart Features**
- [ ] Property search integration
- [ ] Smart recommendations
- [ ] Budget calculation
- [ ] Area suggestions
- [ ] Mortgage calculator integration
- [ ] Save conversation history to database

### **Week 4: Testing & Polish**
- [ ] User testing
- [ ] Performance optimization
- [ ] Arabic language fine-tuning
- [ ] Security measures
- [ ] Rate limiting
- [ ] Analytics tracking

---

## 🏗️ البنية التقنية (Architecture)

```
User Interface (Chat Widget)
        ↓
Frontend Component (React)
        ↓
API Route (/api/ai/chat)
        ↓
AI Service (OpenAI/Gemini)
        ↓
Database (Context + History)
        ↓
Property Database (Prisma)
```

---

## 💻 الكود المطلوب

### 1. Frontend Component

```tsx
// src/components/features/AIAssistant.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon,
  XMarkIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
  quickReplies?: string[]
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: Message = {
        id: '1',
        text: 'مرحباً! 👋 أنا مساعدك العقاري الذكي. كيف يمكنني مساعدتك اليوم؟',
        sender: 'ai',
        timestamp: new Date(),
        quickReplies: [
          'أبحث عن شقة',
          'ما هي أسعار التجمع الخامس؟',
          'أريد استثمار في عقار',
          'معلومات عن التمويل العقاري'
        ]
      }
      setMessages([greeting])
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      // Call AI API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          history: messages.slice(-5) // Last 5 messages for context
        })
      })

      const data = await response.json()

      if (data.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.message,
          sender: 'ai',
          timestamp: new Date(),
          quickReplies: data.quickReplies
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('AI Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'عذراً، حدث خطأ. حاول مرة أخرى.',
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickReply = (reply: string) => {
    sendMessage(reply)
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 left-6 z-40 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-purple-500/50 transition-shadow"
      >
        {isOpen ? (
          <XMarkIcon className="w-8 h-8" />
        ) : (
          <SparklesIcon className="w-8 h-8" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-44 left-6 z-40 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-purple-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">مساعد AMG الذكي</h3>
                  <p className="text-xs text-purple-100">مدعوم بالذكاء الاصطناعي</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-white text-gray-900 shadow-sm border border-gray-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString('ar-EG', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>

                    {/* Quick Replies */}
                    {message.quickReplies && (
                      <div className="mt-3 space-y-2">
                        {message.quickReplies.map((reply, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickReply(reply)}
                            className="block w-full text-left text-xs px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
                  placeholder="اكتب رسالتك..."
                  className="flex-1 px-4 py-3 rounded-full border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
                  disabled={isTyping}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={isTyping || !input.trim()}
                  className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

---

### 2. Backend API Route

```typescript
// src/app/api/ai/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '@/lib/db'

// Initialize Gemini AI (مجاني!)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get recent properties for context
    const recentProperties = await prisma.listing.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        title: true,
        price: true,
        location: true,
        bedrooms: true,
        bathrooms: true,
        area: true,
        propertyType: true
      }
    })

    // Build AI context
    const context = `
أنت مساعد عقاري ذكي لشركة AMG للاستثمار العقاري في مصر.
مهمتك مساعدة العملاء في العثور على العقار المناسب.

معلومات عن الشركة:
- اسم الشركة: AMG للاستثمار العقاري
- التخصص: بيع وتسويق العقارات في مصر
- المناطق الرئيسية: القاهرة الجديدة، التجمع الخامس، الشيخ زايد، 6 أكتوبر

العقارات المتاحة حالياً:
${recentProperties.map(p => `
- ${p.title}
  السعر: ${p.price} جنيه
  الموقع: ${p.location}
  الغرف: ${p.bedrooms}
  المساحة: ${p.area}m²
`).join('\n')}

إرشادات:
1. كن ودوداً ومحترفاً
2. اسأل أسئلة توضيحية لفهم احتياجات العميل
3. اقترح عقارات مناسبة بناءً على الميزانية والموقع
4. قدم معلومات عن التمويل العقاري إذا طلب العميل
5. أرسل quick replies مفيدة في نهاية كل رد
6. تحدث بالعربية فقط
7. كن موجزاً ومباشراً

رسالة العميل: ${message}
`

    // Call Gemini AI
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(context)
    const response = result.response.text()

    // Generate smart quick replies
    const quickReplies = generateQuickReplies(message, response)

    // Save conversation to database (optional)
    // await saveConversation(message, response)

    return NextResponse.json({
      success: true,
      message: response,
      quickReplies
    })

  } catch (error) {
    console.error('AI Chat Error:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في معالجة الرسالة' },
      { status: 500 }
    )
  }
}

// Generate contextual quick replies
function generateQuickReplies(userMessage: string, aiResponse: string): string[] {
  const message = userMessage.toLowerCase()
  
  if (message.includes('شقة') || message.includes('apartment')) {
    return [
      'ما هي الأسعار المتاحة؟',
      'أريد معاينة',
      'معلومات عن التمويل',
      'عقارات مشابهة'
    ]
  }
  
  if (message.includes('سعر') || message.includes('price')) {
    return [
      'كيف أحسب التمويل؟',
      'ما هي المصاريف الإضافية؟',
      'هل يوجد تقسيط؟',
      'أريد عقارات أرخص'
    ]
  }
  
  if (message.includes('موقع') || message.includes('location')) {
    return [
      'ما هي المرافق القريبة؟',
      'معلومات عن المنطقة',
      'مناطق بديلة',
      'المواصلات'
    ]
  }
  
  // Default quick replies
  return [
    'أبحث عن شقة',
    'معلومات عن الأسعار',
    'أريد استثمار',
    'كلمني مع مندوب'
  ]
}
```

---

### 3. Environment Variables

```env
# .env.local
# Google AI (Gemini) - مجاني!
GOOGLE_AI_API_KEY="your-google-ai-api-key"

# أو OpenAI (مدفوع)
OPENAI_API_KEY="sk-your-openai-api-key"
```

---

## 📊 التكلفة المتوقعة

### **Option 1: Google Gemini (مجاني)**
- ✅ **مجاني تماماً** حتى 60 طلب/دقيقة
- ✅ جودة ممتازة
- ✅ يدعم العربي بشكل جيد
- ⚠️ حد أقصى للطلبات

### **Option 2: OpenAI GPT-4o-mini**
- 💰 **$0.00015** لكل 1000 token
- متوسط المحادثة: 500 tokens
- تكلفة المحادثة: **$0.000075** (جنيه واحد لكل 13,000 محادثة!)
- ✅ جودة ممتازة جداً
- ✅ سرعة عالية

**مثال حسابي:**
- 1000 محادثة/شهر = $0.075 (1.5 جنيه)
- 10,000 محادثة/شهر = $0.75 (15 جنيه)
- 100,000 محادثة/شهر = $7.5 (150 جنيه)

---

## 🎯 اللي محتاجه منك:

### ✅ **من ناحيتي (هعملها):**
1. كتابة كل الكود
2. تصميم الـ UI
3. Prompt Engineering (تعليم الـ AI)
4. Integration مع Database
5. Testing و Optimization

### ✅ **من ناحيتك (سهلة):**
1. **إنشاء Google AI API Key** (5 دقائق):
   - روح: https://makersuite.google.com/app/apikey
   - Create API Key
   - انسخه وحطه في `.env.local`

2. **معلومات عن العقارات:**
   - الـ database موجود بالفعل ✅
   - هستخدم الـ listings الموجودة

3. **Feedback:**
   - جرب الـ AI لما يخلص
   - قولي لو فيه حاجة محتاجة تحسين

---

## 📅 الجدول الزمني

| المرحلة | المدة | الوصف |
|---------|-------|-------|
| **Week 1** | 5-7 أيام | UI Component + Basic Chat |
| **Week 2** | 3-5 أيام | AI Integration + Testing |
| **Week 3** | 3-5 أيام | Smart Features + Polish |
| **Week 4** | 2-3 أيام | Final Testing + Deploy |

**إجمالي: 3-4 أسابيع**

---

## 🚀 عايز نبدأ دلوقتي؟

**الخطوة الأولى:** إنشاء Google AI API Key

روح هنا: https://makersuite.google.com/app/apikey

وقولي لما تخلص! 💪
