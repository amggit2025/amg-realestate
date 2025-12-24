# 🚀 إضافة Environment Variables في Vercel

## المشكلة:
الـ Live Chat مش ظاهر على الموقع المنشور لأن Vercel مش عارف الـ Tawk.to IDs

## ✅ الحل السريع:

### 1️⃣ افتح Vercel Dashboard:
https://vercel.com/dashboard

### 2️⃣ اختار المشروع:
- اضغط على `amg-realestate`

### 3️⃣ روح Settings:
- من القائمة الجانبية اختار **Settings**
- ثم اختار **Environment Variables**

### 4️⃣ أضف المتغيرات دي:

```
Variable Name: NEXT_PUBLIC_TAWK_PROPERTY_ID
Value: 694c4ff1f137851977fe43ff
Environment: Production, Preview, Development
```

```
Variable Name: NEXT_PUBLIC_TAWK_WIDGET_ID
Value: 1jd91gifn
Environment: Production, Preview, Development
```

### 5️⃣ احفظ:
- اضغط **Save** لكل متغير

### 6️⃣ أعد النشر:
بعد ما تضيف المتغيرات، **Vercel هيعمل redeploy تلقائي**

أو تقدر تعمل **Manual Redeploy**:
- Deployments → آخر deployment → ... (3 dots) → Redeploy

---

## ⏱️ انتظر 2-3 دقائق

بعد كده افتح الموقع - الـ Live Chat هيظهر! 🎉

---

## 📸 الخطوات بالصور:

### الخطوة 1: Settings
```
Vercel Dashboard
├── Your Projects
│   └── amg-realestate  ← اضغط هنا
│       └── Settings  ← اضغط هنا
```

### الخطوة 2: Environment Variables
```
Settings
├── General
├── Domains
├── Environment Variables  ← اضغط هنا
├── Git
└── ...
```

### الخطوة 3: Add Variable
```
[Add New] ← اضغط هنا

Name: NEXT_PUBLIC_TAWK_PROPERTY_ID
Value: 694c4ff1f137851977fe43ff

☑ Production
☑ Preview  
☑ Development

[Save] ← اضغط هنا
```

### الخطوة 4: كرر للمتغير التاني
```
[Add New]

Name: NEXT_PUBLIC_TAWK_WIDGET_ID
Value: 1jd91gifn

☑ Production
☑ Preview  
☑ Development

[Save]
```

---

## 🎯 تأكد من الإعدادات:

بعد ما تضيف المتغيرات، شوفهم في القائمة:

```
Environment Variables (2)

✅ NEXT_PUBLIC_TAWK_PROPERTY_ID
   Production, Preview, Development
   
✅ NEXT_PUBLIC_TAWK_WIDGET_ID
   Production, Preview, Development
```

---

## 🔄 Redeploy:

إذا Vercel مش عمل redeploy تلقائي:

1. روح **Deployments**
2. اختار آخر deployment
3. اضغط **... (3 dots)**
4. اختار **Redeploy**
5. انتظر 2-3 دقائق

---

## ✅ التحقق من النجاح:

بعد Redeploy:

1. افتح موقعك على Vercel
2. استنى **3 ثواني**
3. هتشوف زر **💬 Live Chat** في أسفل الشاشة!
4. اضغط عليه وجرب ترسل رسالة
5. افتح Tawk.to Dashboard - هتشوف الرسالة! 🎉

---

## 🆘 لو لسه مش ظاهر:

### افحص Console:
1. اضغط **F12**
2. روح **Console**
3. لو فيه warning زي:
   ```
   ⚠️ Tawk.to credentials not found
   ```
   يعني المتغيرات لسه مش محملة - انتظر شوية أو اعمل Clear Cache (Ctrl+Shift+R)

### تأكد من الأسماء:
- ✅ `NEXT_PUBLIC_TAWK_PROPERTY_ID` (لازم NEXT_PUBLIC في الأول)
- ✅ `NEXT_PUBLIC_TAWK_WIDGET_ID` (لازم NEXT_PUBLIC في الأول)
- ❌ `TAWK_PROPERTY_ID` (غلط - بدون NEXT_PUBLIC)

---

## 💡 ملحوظة مهمة:

**أي متغير يبدأ بـ `NEXT_PUBLIC_`** بيكون **accessible في البراوزر**.

المتغيرات اللي بدون `NEXT_PUBLIC_` بتكون **server-side only** ومش بتشتغل في الـ client components.

---

## 🎉 خلاص!

بعد ما تعمل الخطوات دي، الـ Live Chat هيظهر على الموقع المنشور! 💬

أي مشكلة كلمني! 🚀
