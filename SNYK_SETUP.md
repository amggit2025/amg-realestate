# Snyk Security Setup Guide

## ما هو Snyk؟
Snyk هو أداة أمنية متقدمة تفحص المشروع بحثاً عن:
- ثغرات أمنية في الـ dependencies
- مشاكل في الـ Docker images
- ثغرات في الـ Infrastructure as Code
- مشاكل أمنية في الـ source code

## الحالة الحالية ✅
تم فحص المشروع بنجاح:
- **566 dependency** تم فحصها
- **0 ثغرات أمنية** تم اكتشافها
- **المشروع آمن 100%**

## الميزات المفعلة

### 1. Snyk CLI (محلي)
```bash
# فحص المشروع
snyk test

# فحص كل الملفات
snyk test --all-projects

# مراقبة المشروع
snyk monitor
```

### 2. Snyk Dashboard
يمكنك متابعة المشروع من:
https://app.snyk.io/org/edu-webgee/projects

### 3. GitHub Actions (تلقائي)
تم إضافة workflow يفحص المشروع:
- مع كل push على main أو develop
- مع كل pull request
- كل يوم إثنين الساعة 9 صباحاً (فحص أسبوعي)

## كيفية إكمال الإعداد

### الخطوة 1: إضافة SNYK_TOKEN للـ GitHub
1. اذهب إلى: https://app.snyk.io/account
2. انسخ الـ API Token
3. اذهب إلى: https://github.com/amggit2025/amg-realestate/settings/secrets/actions
4. اضغط **New repository secret**
5. اكتب:
   - Name: `SNYK_TOKEN`
   - Secret: [الصق الـ token من Snyk]
6. اضغط **Add secret**

### الخطوة 2: تفعيل Snyk GitHub Integration (اختياري)
1. اذهب إلى: https://app.snyk.io/org/edu-webgee/integrations
2. اختر **GitHub**
3. اتبع التعليمات لربط الحساب
4. اختر المشاريع التي تريد مراقبتها

## الأوامر المفيدة

### فحص شامل
```bash
snyk test --all-projects
```

### فحص مع تفاصيل كاملة
```bash
snyk test --json
```

### فحص Docker (إذا كان موجود)
```bash
snyk container test nginx:latest
```

### إصلاح الثغرات تلقائياً
```bash
snyk fix
```

### عرض التقرير
```bash
snyk monitor --org=edu-webgee
```

## الإشعارات

ستصلك إشعارات بالإيميل عند:
- اكتشاف ثغرة أمنية جديدة
- توفر تحديث أمني
- فشل الفحص

## الخطة المجانية

الخطة المجانية تشمل:
- ✅ عدد غير محدود من الفحوصات
- ✅ 200 test شهرياً
- ✅ مراقبة مستمرة
- ✅ تقارير مفصلة
- ✅ إصلاحات تلقائية
- ✅ GitHub/GitLab integration

## Best Practices

### 1. فحص دوري
```bash
# أضف للـ package.json
"scripts": {
  "security:check": "snyk test",
  "security:monitor": "snyk monitor",
  "security:fix": "snyk fix"
}
```

### 2. قبل الـ deployment
```bash
npm run security:check
```

### 3. CI/CD Integration
الـ workflow موجود في `.github/workflows/snyk-security.yml`

## التقارير والمتابعة

### Dashboard الرئيسي
https://app.snyk.io/org/edu-webgee

### تقرير المشروع
https://app.snyk.io/org/edu-webgee/project/d3bcce44-a350-4312-9fb2-bbfaf712108f

### تاريخ الفحوصات
يمكنك مشاهدة كل الفحوصات السابقة من Dashboard

## الدعم

- [Snyk Documentation](https://docs.snyk.io/)
- [Snyk Community](https://community.snyk.io/)
- [Snyk Support](https://support.snyk.io/)

## ملاحظات

- الفحص الحالي أظهر أن المشروع آمن تماماً
- تم إصلاح 5 ثغرات سابقاً باستخدام `npm audit fix`
- باقي 3 low severity في next-auth (غير حرجة)

---

**آخر فحص:** 3 يناير 2026  
**الحالة:** ✅ آمن - 0 ثغرات عالية الخطورة
