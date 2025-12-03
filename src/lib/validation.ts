import { z } from 'zod'

// Contact form schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'الاسم يجب أن يكون أكثر من حرفين')
    .max(50, 'الاسم طويل جداً'),
  
  email: z
    .string()
    .email('البريد الإلكتروني غير صحيح')
    .min(1, 'البريد الإلكتروني مطلوب'),
  
  phone: z
    .string()
    .min(10, 'رقم الهاتف يجب أن يكون على الأقل 10 أرقام')
    .max(15, 'رقم الهاتف طويل جداً')
    .regex(/^[0-9+\-\s()]+$/, 'رقم الهاتف يحتوي على أرقام فقط'),
  
  service: z
    .string()
    .min(1, 'يرجى اختيار الخدمة المطلوبة'),
  
  budget: z
    .string()
    .optional(),
  
  message: z
    .string()
    .min(10, 'الرسالة يجب أن تكون أكثر من 10 أحرف')
    .max(1000, 'الرسالة طويلة جداً'),
  
  urgency: z
    .enum(['low', 'medium', 'high'])
    .optional()
    .default('medium'),
  
  preferredContact: z
    .enum(['email', 'phone', 'whatsapp'])
    .optional()
    .default('phone'),
  
  consent: z
    .boolean()
    .refine(val => val === true, 'يجب الموافقة على شروط الخدمة')
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Service options
export const serviceOptions = [
  { value: 'construction', label: 'أعمال المقاولات والبناء' },
  { value: 'finishing', label: 'التشطيبات والديكور' },
  { value: 'furniture', label: 'الأثاث والفرش' },
  { value: 'marketing', label: 'التسويق العقاري' },
  { value: 'consultation', label: 'استشارة عقارية' },
  { value: 'maintenance', label: 'الصيانة والترميم' },
  { value: 'other', label: 'خدمة أخرى' }
]

// Budget options
export const budgetOptions = [
  { value: 'under-100k', label: 'أقل من 100,000 جنيه' },
  { value: '100k-300k', label: '100,000 - 300,000 جنيه' },
  { value: '300k-500k', label: '300,000 - 500,000 جنيه' },
  { value: '500k-1m', label: '500,000 - 1,000,000 جنيه' },
  { value: 'over-1m', label: 'أكثر من 1,000,000 جنيه' },
  { value: 'discuss', label: 'للمناقشة' }
]

// Urgency options
export const urgencyOptions = [
  { value: 'low', label: 'غير عاجل', color: 'green' },
  { value: 'medium', label: 'متوسط الأولوية', color: 'yellow' },
  { value: 'high', label: 'عاجل', color: 'red' }
]

// Contact preferences
export const contactPreferences = [
  { value: 'phone', label: 'مكالمة هاتفية', icon: '📞' },
  { value: 'email', label: 'بريد إلكتروني', icon: '📧' },
  { value: 'whatsapp', label: 'واتساب', icon: '💬' }
]
