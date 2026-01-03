# 🎨 Toast Notifications - دليل الاستخدام

## ✅ التعديلات المنجزة

تم استبدال جميع `alert()` الافتراضية بنظام Toast Notifications احترافي وجميل في الصفحات التالية:

### الصفحات المحدثة:
- ✅ `/admin/services` - إدارة الخدمات
- ✅ `/admin/services/add` - إضافة خدمة
- ✅ `/admin/services/edit/[id]` - تعديل خدمة
- ✅ `/admin/projects` - إدارة المشاريع
- ✅ `/admin/portfolio` - إدارة معرض الأعمال
- ✅ `/admin/portfolio/add` - إضافة عمل جديد
- ✅ `/admin/portfolio/edit/[id]` - تعديل عمل

**إجمالي الصفحات المحدثة: 7 صفحات ✨**

---

## 📖 كيفية الاستخدام

### 1. في أي صفحة Admin، أضف الـ import:

```typescript
import { useToastContext } from '@/lib/ToastContext'
```

### 2. في المكون، استدعي الـ hook:

```typescript
export default function MyAdminPage() {
  const toast = useToastContext()
  
  // ... باقي الكود
}
```

### 3. استخدم Toast بدلاً من alert:

#### ❌ الطريقة القديمة:
```typescript
alert('تم الحفظ بنجاح')
alert('حدث خطأ')
```

#### ✅ الطريقة الجديدة:
```typescript
// نجاح
toast.success('تم الحفظ بنجاح')

// خطأ
toast.error('حدث خطأ أثناء الحفظ')

// تحذير
toast.warning('الرجاء ملء جميع الحقول')

// معلومات
toast.info('جاري المعالجة...')
```

---

## 🎯 أمثلة عملية

### مثال 1: عند الحفظ بنجاح
```typescript
const handleSave = async () => {
  try {
    const response = await fetch('/api/admin/save', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    
    if (response.ok) {
      toast.success('تم الحفظ بنجاح')
      router.push('/admin/list')
    } else {
      toast.error('فشل في الحفظ')
    }
  } catch (error) {
    toast.error('حدث خطأ أثناء الحفظ')
  }
}
```

### مثال 2: عند الحذف
```typescript
const handleDelete = async (id: string) => {
  if (!confirm('هل أنت متأكد؟')) return
  
  try {
    const response = await fetch(`/api/admin/delete/${id}`, {
      method: 'DELETE'
    })
    
    if (response.ok) {
      toast.success('تم الحذف بنجاح')
      refreshData()
    } else {
      toast.error('فشل في الحذف')
    }
  } catch (error) {
    toast.error('حدث خطأ أثناء الحذف')
  }
}
```

### مثال 3: رفع صورة
```typescript
const handleImageUpload = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    const data = await response.json()
    
    if (data.success) {
      toast.success('تم رفع الصورة بنجاح')
      setImageUrl(data.url)
    } else {
      toast.error('فشل رفع الصورة', data.message)
    }
  } catch (error) {
    toast.error('حدث خطأ أثناء رفع الصورة')
  }
}
```

### مثال 4: التحقق من المدخلات
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!formData.title || !formData.description) {
    toast.warning('الرجاء ملء جميع الحقول المطلوبة')
    return
  }
  
  // المتابعة في الحفظ
  saveData()
}
```

---

## 🎨 أنواع Toast المتاحة

| النوع | الاستخدام | اللون |
|------|----------|------|
| `toast.success()` | عمليات ناجحة | 🟢 أخضر |
| `toast.error()` | أخطاء | 🔴 أحمر |
| `toast.warning()` | تحذيرات | 🟡 أصفر |
| `toast.info()` | معلومات عامة | 🔵 أزرق |

---

## 📝 ملاحظات مهمة

1. ✅ **لا حاجة لإضافة ToastProvider** - موجود بالفعل في `admin/layout.tsx`
2. ✅ **Toast يظهر تلقائياً** في أعلى يسار الشاشة
3. ✅ **يختفي تلقائياً** بعد 5 ثواني
4. ✅ **يمكن إغلاقه يدوياً** بالضغط على زر X
5. ✅ **متجاوب** - يعمل على جميع الشاشات

---

## 🚀 الصفحات المتبقية للتحديث

لتحديث باقي الصفحات، ابحث عن `alert(` في الملف واستبدله بـ Toast:

```bash
# ابحث عن جميع alert في صفحات الأدمن
grep -r "alert(" src/app/admin/
```

ثم اتبع نفس الخطوات:
1. أضف `import { useToastContext } from '@/lib/ToastContext'`
2. أضف `const toast = useToastContext()`
3. استبدل `alert()` بـ `toast.success/error/warning/info()`

---

## 🎯 أمثلة سريعة

```typescript
// نجاح بسيط
toast.success('تم!')

// خطأ مع تفاصيل
toast.error('فشل الحفظ', 'تحقق من الاتصال بالإنترنت')

// تحذير
toast.warning('حذف هذا العنصر لا يمكن التراجع عنه')

// معلومة
toast.info('سيتم إرسال بريد إلكتروني للتأكيد')
```

---

✨ **استمتع بتجربة مستخدم أفضل مع Toast Notifications!**
