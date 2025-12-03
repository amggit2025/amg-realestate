# 🚀 نشر موقع AMG Real Estate على Vercel

## خطوات النشر

### 1️⃣ تجهيز قاعدة البيانات

اختر أحد مقدمي خدمات MySQL السحابية:

#### الخيار الأول: PlanetScale (مجاني - مُوصى به)
1. اذهب إلى [planetscale.com](https://planetscale.com)
2. أنشئ حساب جديد
3. أنشئ Database جديد
4. احصل على `DATABASE_URL` من لوحة التحكم
5. **مهم:** في PlanetScale، عدّل `schema.prisma`:
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
     relationMode = "prisma"  // أضف هذا السطر
   }
   ```

#### الخيار الثاني: Railway.app
1. اذهب إلى [railway.app](https://railway.app)
2. أنشئ مشروع جديد
3. أضف MySQL Database
4. احصل على `DATABASE_URL`

#### الخيار الثالث: Aiven.io
1. اذهب إلى [aiven.io](https://aiven.io)
2. أنشئ MySQL service
3. احصل على connection string

---

### 2️⃣ إعداد Cloudinary

1. اذهب إلى [cloudinary.com](https://cloudinary.com)
2. أنشئ حساب مجاني
3. من Dashboard احصل على:
   - Cloud Name
   - API Key
   - API Secret

---

### 3️⃣ النشر على Vercel

#### الطريقة الأولى: من خلال GitHub (مُوصى به)

1. **اذهب إلى** [vercel.com](https://vercel.com)
2. **سجل دخول** بحساب GitHub
3. **اضغط** "Add New" → "Project"
4. **اختر** repository: `amg-real-estate`
5. **Configure Project:**
   - Framework Preset: **Next.js**
   - Root Directory: **./** (default)
   - Build Command: `prisma generate && next build`
   - Output Directory: `.next` (default)
   - Install Command: `npm install`

6. **Environment Variables** - أضف المتغيرات التالية:

```env
DATABASE_URL=mysql://user:password@host:3306/database
JWT_SECRET=your-generated-secret-key-here
JWT_ADMIN_SECRET=your-admin-secret-key-here
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=site@amg-invest.com
SMTP_PASS=your-email-password
FROM_EMAIL=site@amg-invest.com
FROM_NAME=AMG Real Estate
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

7. **اضغط** "Deploy"
8. **انتظر** حتى ينتهي البناء (2-5 دقائق)

---

### 4️⃣ تشغيل Migrations

بعد النشر الأول، قم بتشغيل migrations:

```bash
# من جهازك المحلي
npx prisma db push --skip-generate
```

أو استخدم Vercel CLI:

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# ربط المشروع
vercel link

# تشغيل command
vercel env pull .env.production
npx prisma db push
```

---

### 5️⃣ إعداد Domain مخصص (اختياري)

1. في Vercel Dashboard → **Settings** → **Domains**
2. أضف domain الخاص بك
3. اتبع التعليمات لتحديث DNS records
4. انتظر حتى ينتشر (5-60 دقيقة)

---

## 🔧 إعدادات إضافية

### تحديث متغيرات البيئة

1. Vercel Dashboard → Project → **Settings** → **Environment Variables**
2. عدّل أو أضف متغيرات جديدة
3. **Redeploy** المشروع لتطبيق التغييرات

### تفعيل Auto Deployments

- كل push إلى `main` branch سيؤدي لنشر تلقائي
- Pull requests ستحصل على preview deployments

---

## ⚠️ مشاكل شائعة وحلولها

### مشكلة: Build Failed - Prisma Error

**الحل:**
```bash
# تأكد من build command في Vercel:
prisma generate && next build
```

### مشكلة: Database Connection Error

**الحل:**
- تحقق من صحة `DATABASE_URL`
- تأكد من IP whitelist في PlanetScale/Railway
- استخدم SSL connection string

### مشكلة: Images not loading

**الحل:**
- تحقق من Cloudinary credentials
- تأكد من `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` صحيح
- راجع `next.config.ts` → remotePatterns

### مشكلة: Environment Variables not working

**الحل:**
- المتغيرات التي تبدأ بـ `NEXT_PUBLIC_` فقط تكون متاحة في Client
- باقي المتغيرات متاحة في Server فقط
- بعد تحديث المتغيرات، اعمل Redeploy

---

## 📊 مراقبة الأداء

### Analytics في Vercel
1. **Settings** → **Analytics** → Enable
2. راقب:
   - Page views
   - Performance metrics
   - Error rates
   - Geographic data

### Logs
- **Deployments** → اختر deployment → **View Function Logs**
- راقب API errors ومشاكل Database

---

## 🔐 الأمان في Production

### 1. تأمين JWT Secrets
```bash
# استخدم مولد قوي:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. تفعيل CORS
- راجع `next.config.ts`
- حدد domains المسموحة

### 3. Rate Limiting
- أضف rate limiting للـ API routes
- استخدم Vercel Edge Config

---

## 🚦 Checklist قبل النشر

- [ ] تم رفع الكود على GitHub
- [ ] تم إنشاء Database (PlanetScale/Railway)
- [ ] تم إنشاء حساب Cloudinary
- [ ] تم إضافة جميع Environment Variables في Vercel
- [ ] تم اختبار Build محلياً (`npm run build`)
- [ ] تم تشغيل Prisma migrations
- [ ] تم اختبار الموقع بعد النشر
- [ ] تم إنشاء Admin account أول
- [ ] تم تحديث `NEXT_PUBLIC_APP_URL`

---

## 📞 الدعم

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **PlanetScale Docs:** [planetscale.com/docs](https://planetscale.com/docs)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)

---

## 🎉 بعد النشر الناجح

1. ✅ سجل دخول كأدمن: `/admin/login`
   - Username: `admin`
   - Password: `admin123` (غيرها فوراً!)

2. ✅ أنشئ محتوى تجريبي من Admin Panel

3. ✅ اختبر جميع الميزات:
   - تسجيل مستخدم جديد
   - إضافة عقار
   - رفع صور
   - إرسال استفسار

4. ✅ شارك الرابط مع فريقك! 🚀

---

**الموقع الآن جاهز للعمل على:** https://your-app.vercel.app 🎊
