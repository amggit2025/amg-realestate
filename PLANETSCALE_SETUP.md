# 🌍 PlanetScale Database Setup Guide

## خطوات إعداد قاعدة البيانات

### 1. إنشاء Database على PlanetScale

1. **سجل دخول إلى** [planetscale.com](https://planetscale.com)
2. **اضغط** "Create a new database"
3. **املأ البيانات:**
   - Database name: `amg-realestate`
   - Region: `AWS - us-east-1` (أو الأقرب لك)
4. **اضغط** "Create database"

### 2. الحصول على Connection String

1. في صفحة الـ Database، **اضغط** "Connect"
2. **اختر** "Prisma" من القائمة المنسدلة
3. **انسخ** الـ `DATABASE_URL` - سيكون شكله:
   ```
   mysql://xxxxxxxxxxxx:************@aws.connect.psdb.cloud/amg-realestate?sslaccept=strict
   ```

### 3. إضافة Connection في Vercel

#### **الطريقة الأولى: من Dashboard**

1. اذهب إلى [vercel.com](https://vercel.com)
2. افتح مشروعك: `amg-realestate`
3. اذهب إلى **Settings** → **Environment Variables**
4. اضغط **Add New**
5. املأ البيانات:
   - **Name:** `DATABASE_URL`
   - **Value:** (الصق الـ connection string)
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
6. **اضغط** Save

#### **الطريقة الثانية: Vercel CLI** (اختيارية)

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# ربط المشروع
vercel link

# إضافة Environment Variable
vercel env add DATABASE_URL
# (الصق الـ connection string عند السؤال)
```

### 4. إنشاء الجداول (Database Schema)

#### **الخيار 1: استخدام Vercel CLI** (موصى به)

```bash
# تأكد من وجود DATABASE_URL في .env
echo "DATABASE_URL=mysql://..." > .env

# توليد Prisma Client
npx prisma generate

# إنشاء الجداول
npx prisma db push
```

#### **الخيار 2: من PlanetScale Dashboard**

1. في PlanetScale، اذهب إلى **Branches** → `main`
2. اضغط **"Enable safe migrations"** (إذا ظهر)
3. ارجع لـ Vercel وشغّل Deployment جديد
4. بعد نجاح الـ Build، الجداول ستُنشأ تلقائياً

### 5. التحقق من نجاح الإعداد

#### **في PlanetScale:**

1. اذهب إلى **Console** tab
2. شغّل هذا الأمر:
   ```sql
   SHOW TABLES;
   ```
3. يجب أن ترى جميع الجداول (User, Admin, Property, Project, إلخ)

#### **في Vercel:**

1. افتح موقعك: `https://your-project.vercel.app`
2. جرب تسجيل الدخول أو التسجيل
3. إذا نجح، معناه Database شغال!

### 6. إضافة بيانات أولية (Optional)

إذا تريد تضيف بيانات تجريبية:

```bash
# محلياً
npx prisma db seed

# أو استخدم API endpoint
curl -X POST https://your-project.vercel.app/api/seed
```

---

## 🔧 ملاحظات مهمة

### PlanetScale Configuration

- ✅ `relationMode = "prisma"` **تم إضافته** في `schema.prisma`
- ✅ PlanetScale لا يدعم Foreign Keys مباشرة، لذلك نستخدم Prisma Relations
- ✅ الـ Free Plan يعطي: **5 GB storage + 1 billion row reads/month**

### أوامر Prisma المفيدة

```bash
# توليد Prisma Client
npx prisma generate

# إنشاء/تحديث الجداول
npx prisma db push

# فتح Prisma Studio (UI لإدارة البيانات)
npx prisma studio

# إعادة تعيين Database (احذر!)
npx prisma db push --force-reset
```

### Troubleshooting

#### ❌ خطأ: "Can't reach database server"
- تأكد من صحة الـ `DATABASE_URL`
- تأكد من إضافة `?sslaccept=strict` في نهاية الـ URL

#### ❌ خطأ: "Foreign key constraint failed"
- تأكد من وجود `relationMode = "prisma"` في schema.prisma

#### ❌ الموقع يعمل لكن Database فاضي
- شغّل `npx prisma db push` من Terminal
- أو استخدم Vercel CLI

---

## 📚 Resources

- [PlanetScale Docs](https://planetscale.com/docs)
- [Prisma with PlanetScale](https://www.prisma.io/docs/guides/database/planetscale)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## ✅ Checklist

- [ ] إنشاء Database في PlanetScale
- [ ] نسخ Connection String
- [ ] إضافة `DATABASE_URL` في Vercel Environment Variables
- [ ] تعديل `schema.prisma` لإضافة `relationMode = "prisma"`
- [ ] رفع التعديلات على GitHub
- [ ] تشغيل `npx prisma db push`
- [ ] اختبار الموقع والتأكد من عمل Database

**بعد إتمام كل الخطوات، موقعك سيكون جاهز 100%! 🎉**
