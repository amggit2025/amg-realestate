# AMG Real Estate - Mobile Application Development Prompt

## 📱 نظرة عامة على المشروع

AMG Real Estate هي شركة عقارية متكاملة في مصر تقدم خدمات شاملة في المجال العقاري. نحتاج إلى تطبيق موبايل احترافي (iOS & Android) يعكس جميع خدمات وميزات الموقع الإلكتروني الحالي.

---

## 🎯 الهدف من التطبيق

تطوير تطبيق موبايل native/cross-platform متكامل يوفر:
- تجربة مستخدم سلسة ومريحة على الهواتف المحمولة
- الوصول السريع لجميع خدمات الشركة
- إمكانية إضافة وإدارة العقارات للمستخدمين المسجلين
- نظام إشعارات فوري للعملاء والإدارة
- تكامل تام مع Backend الموقع الحالي

---

## 🏢 معلومات الشركة

**الاسم:** AMG Real Estate  
**المجال:** عقارات - مقاولات - تشطيبات - تسويق عقاري - أثاث ومطابخ  
**السوق المستهدف:** السوق المصري (اللغة العربية أساسية مع دعم الإنجليزية)  
**الموقع الحالي:** [https://amg-realestate.vercel.app](https://amg-realestate.vercel.app)

---

## 🎨 الهوية البصرية

### الألوان الأساسية:
- **الأزرق الأساسي:** `#3b82f6` (Blue-500)
- **الأزرق الداكن:** `#1e40af` (Blue-800)
- **الأخضر:** `#10b981` (Green-500)
- **البرتقالي:** `#f97316` (Orange-500)
- **الرمادي:** `#6b7280` (Gray-500)

### التصميم:
- **النمط:** Modern, Clean, Professional
- **الاتجاه:** RTL (Right-to-Left) للعربية
- **الخطوط:** Arabic: 'Cairo' / 'Tajawal', English: 'Inter' / 'Poppins'
- **الأيقونات:** Heroicons / Material Icons

---

## 📊 البنية التقنية الحالية (Backend)

### التقنيات المستخدمة:
- **Framework:** Next.js 16.0.7 (App Router)
- **Database:** MySQL (Railway - PlanetScale compatible)
- **ORM:** Prisma 6.16.1
- **Authentication:** JWT + Cookies
- **File Upload:** Cloudinary
- **Email:** Nodemailer + SendGrid SMTP
- **API:** RESTful APIs

### قاعدة البيانات:
**Database URL:** `mysql://root:PASSWORD@nozomi.proxy.rlwy.net:16757/railway`

---

## 🗂️ نماذج البيانات الرئيسية (Prisma Schema)

### 1. المستخدمين (User)
```prisma
model User {
  id            String      @id @default(cuid())
  name          String
  email         String      @unique
  phone         String?
  password      String
  role          UserRole    @default(USER)
  verified      Boolean     @default(false)
  image         String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  properties    Property[]
}

enum UserRole {
  USER
  PREMIUM
  ADMIN
}
```

### 2. العقارات (Property)
```prisma
model Property {
  id              String         @id @default(cuid())
  title           String
  titleEn         String?
  description     String         @db.Text
  descriptionEn   String?        @db.Text
  type            PropertyType
  status          PropertyStatus @default(PENDING)
  price           Float
  priceType       String         // "للبيع" أو "للإيجار"
  area            Float
  bedrooms        Int?
  bathrooms       Int?
  location        String
  city            String
  governorate     String
  images          Json           // Array of image URLs
  features        Json?          // Array of features
  userId          String
  user            User           @relation(fields: [userId], references: [id])
  views           Int            @default(0)
  featured        Boolean        @default(false)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}

enum PropertyType {
  APARTMENT
  VILLA
  OFFICE
  SHOP
  LAND
  CHALET
  BUILDING
}

enum PropertyStatus {
  PENDING
  APPROVED
  REJECTED
}
```

### 3. المشاريع (Project)
```prisma
model Project {
  id              String    @id @default(cuid())
  title           String
  titleEn         String?
  description     String    @db.Text
  descriptionEn   String?   @db.Text
  location        String
  status          String    // "قيد التنفيذ" أو "مكتمل"
  images          Json      // Array of image URLs
  startDate       DateTime?
  endDate         DateTime?
  category        String    // "سكني" أو "تجاري" أو "إداري"
  featured        Boolean   @default(false)
  order           Int       @default(0)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

### 4. الخدمات (Service)
```prisma
model Service {
  id              String    @id @default(cuid())
  title           String
  titleEn         String?
  slug            String    @unique
  description     String    @db.Text
  descriptionEn   String?   @db.Text
  icon            String
  image           String?
  features        Json?     // Array of features
  order           Int       @default(0)
  active          Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

### 5. طلبات الاستشارات (ServiceRequest)
```prisma
model ServiceRequest {
  id              String                  @id @default(cuid())
  name            String
  email           String
  phone           String
  serviceType     String
  projectType     String?
  budget          String?
  timeline        String?
  message         String?                 @db.Text
  status          ServiceRequestStatus    @default(PENDING)
  adminNotes      String?                 @db.Text
  respondedAt     DateTime?
  respondedBy     String?
  createdAt       DateTime                @default(now())
  updatedAt       DateTime                @updatedAt
}

enum ServiceRequestStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

### 6. الاستفسارات (Inquiry)
```prisma
model Inquiry {
  id              String        @id @default(cuid())
  name            String
  email           String
  phone           String?
  subject         String?
  message         String        @db.Text
  status          InquiryStatus @default(PENDING)
  response        String?       @db.Text
  respondedAt     DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

enum InquiryStatus {
  PENDING
  RESPONDED
  CLOSED
}
```

### 7. آراء العملاء (Testimonial)
```prisma
model Testimonial {
  id              String    @id @default(cuid())
  name            String
  nameEn          String?
  position        String?
  positionEn      String?
  company         String?
  companyEn       String?
  rating          Int       @default(5)
  comment         String    @db.Text
  commentEn       String?   @db.Text
  image           String?
  published       Boolean   @default(false)
  featured        Boolean   @default(false)
  order           Int       @default(0)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

### 8. الاشتراكات (NewsletterSubscription)
```prisma
model NewsletterSubscription {
  id              String              @id @default(cuid())
  email           String              @unique
  name            String?
  status          SubscriptionStatus  @default(ACTIVE)
  subscribedAt    DateTime            @default(now())
  unsubscribedAt  DateTime?
}

enum SubscriptionStatus {
  ACTIVE
  UNSUBSCRIBED
}
```

---

## 🚀 الميزات الرئيسية المطلوبة في التطبيق

### للمستخدمين العاديين:

#### 1. التسجيل والدخول
- تسجيل مستخدم جديد (اسم، إيميل، تليفون، كلمة مرور)
- تسجيل الدخول (إيميل + كلمة مرور)
- نسيت كلمة المرور (إرسال رابط إعادة تعيين)
- تسجيل الدخول عبر Google/Facebook (اختياري)
- حفظ الجلسة (Stay Logged In)

#### 2. الصفحة الرئيسية (Home)
- Hero Section مع إحصائيات الشركة
- عرض المشاريع المميزة (Featured Projects)
- عرض العقارات المميزة (Featured Properties)
- عرض الخدمات الرئيسية (6 خدمات)
- آراء العملاء (Testimonials Slider)
- نموذج الاشتراك في النشرة البريدية

#### 3. المشاريع (Projects)
- عرض جميع مشاريع الشركة (Grid/List View)
- فلترة حسب: الحالة (قيد التنفيذ/مكتمل)، النوع (سكني/تجاري/إداري)
- بحث بالاسم أو الموقع
- صفحة تفاصيل المشروع:
  - معرض صور (Image Gallery)
  - الوصف الكامل
  - الموقع على الخريطة (Google Maps)
  - تاريخ البداية والنهاية
  - زر طلب استشارة مباشرة

#### 4. الخدمات (Services)
الخدمات الستة الأساسية:
1. **المقاولات والبناء** - أعمال الخرسانة والمباني
2. **التشطيبات والديكور** - جميع أعمال التشطيبات
3. **الأثاث والفرش** - توريد وتركيب الأثاث
4. **المطابخ** - تصميم وتنفيذ المطابخ
5. **التسويق العقاري** - تسويق وبيع العقارات
6. **الاستشارات العقارية** - استشارات متخصصة

كل خدمة تحتوي على:
- صفحة تفصيلية
- أنواع المشاريع المتاحة
- نموذج طلب استشارة مجانية (مع اختيار نوع المشروع، الميزانية، الوقت)

#### 5. العقارات (Listings)
- عرض جميع العقارات المعتمدة
- فلترة متقدمة:
  - النوع (شقة، فيلا، محل، مكتب، أرض)
  - السعر (من - إلى)
  - المساحة (من - إلى)
  - عدد الغرف
  - عدد الحمامات
  - المدينة / المحافظة
  - نوع العرض (بيع / إيجار)
- ترتيب حسب: الأحدث، السعر، المساحة
- عرض على الخريطة (Map View)
- صفحة تفاصيل العقار:
  - معرض صور شامل
  - جميع التفاصيل والمواصفات
  - المميزات (Features)
  - بيانات المالك (اسم، تليفون مخفي جزئيًا)
  - زر الاتصال / واتساب
  - زر الحفظ في المفضلة
  - مشاركة العقار (Share)

#### 6. إضافة عقار (للمستخدمين المسجلين)
- نموذج إضافة عقار شامل:
  - العنوان (عربي/إنجليزي)
  - الوصف (عربي/إنجليزي)
  - النوع (شقة، فيلا، محل، إلخ)
  - السعر ونوع العرض (بيع/إيجار)
  - المساحة
  - عدد الغرف والحمامات
  - الموقع (المحافظة، المدينة، العنوان التفصيلي)
  - تحديد الموقع على الخريطة
  - رفع الصور (متعدد، حد أقصى 10 صور)
  - المميزات (Checkboxes): مصعد، موقف سيارات، أمن، حديقة، إلخ
- معاينة قبل النشر
- إرسال للمراجعة (PENDING status)

#### 7. لوحة التحكم الشخصية (User Dashboard)
- معلومات الملف الشخصي
- تعديل البيانات (الاسم، التليفون، الصورة)
- عقاراتي:
  - قائمة بجميع العقارات المضافة
  - الحالة: (قيد المراجعة / معتمد / مرفوض)
  - تعديل / حذف العقار
  - عدد المشاهدات لكل عقار
- المفضلة (Saved Properties)
- الإشعارات:
  - إشعار عند قبول/رفض العقار
  - إشعار عند استفسار على عقار

#### 8. من نحن (About Us)
- قصة الشركة
- الرؤية والرسالة
- القيم
- فريق العمل (Team Members)
- الإنجازات والأرقام

#### 9. اتصل بنا (Contact)
- نموذج تواصل شامل:
  - الاسم
  - الإيميل
  - التليفون
  - الموضوع
  - الرسالة
- معلومات الاتصال:
  - العنوان
  - التليفون
  - الإيميل
  - ساعات العمل
- خريطة الموقع (Google Maps)
- روابط السوشيال ميديا

#### 10. الإشعارات (Push Notifications)
- إشعار عند قبول العقار
- إشعار عند رفض العقار
- إشعار عند استفسار جديد
- إشعار عند رد على الاستفسار
- إشعارات عروض وأخبار الشركة

---

### لوحة تحكم الأدمن (Admin Panel):

#### الوصول:
- صفحة تسجيل دخول منفصلة للأدمن
- صلاحيات متعددة (Super Admin, Content Manager, Support)

#### الميزات:
1. **Dashboard**: إحصائيات شاملة (مستخدمين، عقارات، مشاريع، استفسارات)
2. **إدارة المستخدمين**: عرض، تعديل، حذف، تفعيل/إيقاف
3. **مراجعة العقارات**: قبول/رفض العقارات الجديدة
4. **إدارة المشاريع**: إضافة، تعديل، حذف مشاريع الشركة
5. **إدارة الخدمات**: تعديل محتوى صفحات الخدمات
6. **الاستفسارات**: الرد على استفسارات العملاء
7. **طلبات الاستشارات**: إدارة طلبات الخدمات (تغيير الحالة، إضافة ملاحظات)
8. **آراء العملاء**: قبول/رفض ونشر آراء العملاء
9. **الاشتراكات**: إدارة قائمة المشتركين في النشرة البريدية
10. **الإعدادات العامة**: تعديل معلومات الشركة، روابط السوشيال ميديا
11. **الإشعارات**: إرسال إشعارات جماعية للمستخدمين

---

## 🔐 نظام المصادقة والأمان

### Authentication:
- **JWT Tokens** للمستخدمين والأدمن
- **Refresh Tokens** لتجديد الجلسات
- **Secure Storage** للتوكنات (Keychain/KeyStore)
- **Biometric Authentication** (Face ID / Fingerprint) - اختياري

### API Security:
- HTTPS فقط
- Rate Limiting
- Input Validation
- XSS Protection
- CSRF Protection

---

## 📡 API Endpoints الرئيسية

### Authentication:
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/verify-email/:token
```

### Users:
```
GET    /api/user/profile
PUT    /api/user/profile
PUT    /api/user/change-password
POST   /api/user/upload-avatar
GET    /api/user/properties
GET    /api/user/favorites
POST   /api/user/favorites/:propertyId
DELETE /api/user/favorites/:propertyId
```

### Properties:
```
GET    /api/properties (مع فلاتر: ?type=APARTMENT&city=Cairo&priceMin=1000000)
GET    /api/properties/:id
POST   /api/properties (مع authentication)
PUT    /api/properties/:id (مع authentication)
DELETE /api/properties/:id (مع authentication)
POST   /api/properties/:id/view (لزيادة عدد المشاهدات)
```

### Projects:
```
GET    /api/projects
GET    /api/projects/:id
```

### Services:
```
GET    /api/services
GET    /api/services/:slug
POST   /api/contact (لطلبات الخدمات والاستفسارات)
```

### Service Requests:
```
GET    /api/admin/service-requests (Admin only)
GET    /api/admin/service-requests/:id (Admin only)
PATCH  /api/admin/service-requests/:id (Admin only)
DELETE /api/admin/service-requests/:id (Admin only)
```

### Inquiries:
```
POST   /api/inquiries
GET    /api/admin/inquiries (Admin only)
PATCH  /api/admin/inquiries/:id (Admin only)
```

### Testimonials:
```
GET    /api/testimonials
POST   /api/testimonials (مع authentication)
GET    /api/admin/testimonials (Admin only)
PATCH  /api/admin/testimonials/:id (Admin only)
```

### Newsletter:
```
POST   /api/newsletter/subscribe
POST   /api/newsletter/unsubscribe
```

### Upload:
```
POST   /api/upload/image (يرجع Cloudinary URL)
POST   /api/upload/multiple (لرفع عدة صور)
```

### Admin:
```
POST   /api/admin/login
GET    /api/admin/session
POST   /api/admin/logout
GET    /api/admin/stats (إحصائيات Dashboard)
GET    /api/admin/users
PATCH  /api/admin/users/:id
DELETE /api/admin/users/:id
GET    /api/admin/properties (مع فلتر PENDING)
PATCH  /api/admin/properties/:id (قبول/رفض)
```

---

## 🎨 متطلبات UI/UX

### الشاشات الأساسية:

1. **Splash Screen**: شعار الشركة + Loading
2. **Onboarding**: 3-4 شاشات تعريفية (أول مرة)
3. **Home**: الصفحة الرئيسية مع Navigation
4. **Auth Screens**: Login, Register, Forgot Password
5. **Projects List & Details**
6. **Services List & Details**
7. **Properties List & Details**
8. **Add Property**: Form متعدد الخطوات
9. **User Profile & Dashboard**
10. **Favorites**: قائمة المفضلة
11. **Notifications**: قائمة الإشعارات
12. **About & Contact**
13. **Settings**: إعدادات التطبيق

### Navigation:
- **Bottom Navigation Bar** (5 tabs):
  1. الرئيسية (Home)
  2. المشاريع (Projects)
  3. العقارات (Properties)
  4. الخدمات (Services)
  5. الحساب (Profile)

### Features:
- Pull to Refresh
- Infinite Scroll / Pagination
- Image Gallery (Zoom, Swipe)
- Dark Mode Support
- Multi-language (Arabic Primary, English Secondary)
- Offline Mode (Cache data)
- Share functionality
- Deep Linking (للعقارات والمشاريع)

---

## 📱 التقنيات المقترحة

### خيارات التطوير:

#### Option 1: React Native (Cross-Platform)
```
- Framework: React Native 0.72+
- Navigation: React Navigation 6
- State Management: Redux Toolkit / Zustand
- API Client: Axios / React Query
- UI Library: React Native Paper / NativeBase
- Maps: react-native-maps
- Image Picker: react-native-image-picker
- Push Notifications: @react-native-firebase/messaging
- Storage: AsyncStorage / MMKV
```

#### Option 2: Flutter (Cross-Platform)
```
- Framework: Flutter 3.16+
- State Management: Riverpod / Bloc
- API Client: Dio / http
- UI: Material Design 3
- Maps: google_maps_flutter
- Image Picker: image_picker
- Push Notifications: firebase_messaging
- Storage: shared_preferences / Hive
```

#### Option 3: Native (iOS + Android)
```
iOS:
- Swift + SwiftUI
- Combine / Async/Await
- Alamofire (Networking)
- Kingfisher (Image Caching)

Android:
- Kotlin + Jetpack Compose
- Coroutines + Flow
- Retrofit (Networking)
- Glide / Coil (Image Loading)
```

---

## 🔔 نظام الإشعارات

### Push Notifications via Firebase:
- إشعارات فورية للأحداث المهمة
- إشعارات مجدولة
- Deep Links لفتح صفحات محددة
- Badge Count على الأيقونة

### أنواع الإشعارات:
1. **للمستخدمين**:
   - تم قبول عقارك
   - تم رفض عقارك مع السبب
   - استفسار جديد على عقارك
   - رد على استفسارك
   - عرض خاص / مشروع جديد

2. **للأدمن**:
   - عقار جديد يحتاج مراجعة
   - استفسار جديد
   - طلب استشارة جديد
   - مستخدم جديد

---

## 🗺️ خرائط Google Maps

### الاستخدام:
- عرض موقع العقار/المشروع
- اختيار الموقع عند إضافة عقار (Drag & Drop Pin)
- عرض جميع العقارات على الخريطة
- الاتجاهات (Directions) للموقع

### API Key:
- Google Maps API Key مطلوب
- تفعيل: Maps SDK for Android, Maps SDK for iOS, Places API

---

## 📸 معالجة الصور

### متطلبات:
- رفع صور متعددة (حد أقصى 10 لكل عقار)
- ضغط الصور قبل الرفع (Image Compression)
- معاينة قبل الرفع
- Crop / Rotate (اختياري)
- التخزين على Cloudinary

### Cloudinary Config:
```
Cloud Name: [from env]
API Key: [from env]
Upload Preset: [from env]
```

---

## 💳 الدفع (Future Feature)

للنسخ المستقبلية، يمكن إضافة:
- **Premium Membership** للمستخدمين (عقارات مميزة، أولوية في الظهور)
- **Featured Listings** (دفع لجعل العقار مميز)
- **طرق الدفع**: Visa, Mastercard, Vodafone Cash, Fawry

---

## 🌐 اللغات

### اللغة الأساسية: العربية
- جميع النصوص والعناوين بالعربية
- RTL Layout
- خط عربي احترافي (Cairo / Tajawal)

### اللغة الثانوية: الإنجليزية
- ترجمة شاملة لجميع الصفحات
- LTR Layout عند التبديل
- يحفظ اختيار المستخدم

---

## 📊 Analytics & Tracking

### تتبع الأحداث:
- Google Analytics / Firebase Analytics
- تتبع:
  - User Registration
  - Property Views
  - Property Creation
  - Service Requests
  - Contact Form Submissions
  - App Opens / Sessions
  - Screen Views

---

## ✅ متطلبات الأداء

### Performance:
- وقت تحميل الشاشات: < 2 ثانية
- حجم التطبيق: < 50 MB
- Image Caching لتقليل استهلاك البيانات
- Lazy Loading للصور
- Pagination للقوائم الطويلة

### Compatibility:
- **iOS**: iOS 13.0+
- **Android**: Android 6.0+ (API Level 23+)

---

## 🧪 الاختبار والجودة

### Testing:
- Unit Tests للـ Logic
- Widget/Component Tests
- Integration Tests
- Manual Testing على أجهزة حقيقية

### Quality:
- No Crashes
- No Memory Leaks
- Smooth Animations (60 FPS)
- Proper Error Handling

---

## 📦 التسليم والنشر

### المطلوب:
1. **Source Code** كامل مع Documentation
2. **APK/IPA** للتجربة
3. **دليل المستخدم** (User Guide)
4. **دليل المطور** (Developer Guide)
5. **App Store Assets**:
   - Screenshots (iPhone, iPad, Android)
   - App Icon (1024x1024)
   - App Description (عربي/إنجليزي)
   - Keywords للـ ASO

### النشر:
- **Google Play Store**
- **Apple App Store**

---

## 🔄 التكامل مع الموقع

### يجب أن يكون التطبيق متكاملاً تمامًا مع:
- نفس الـ Backend APIs
- نفس قاعدة البيانات
- نفس نظام المصادقة
- Sync فوري للبيانات

---

## 📞 معلومات الاتصال

**للاستفسارات التقنية:**
- Email: site@amg-invest.com
- Website: https://amg-realestate.vercel.app

---

## 📝 ملاحظات إضافية

1. **الأولوية**: تطبيق يعمل بشكل مستقر > كثرة الميزات
2. **UX أولاً**: التركيز على تجربة مستخدم سلسة ومريحة
3. **Performance**: سرعة وأداء عالي
4. **RTL Support**: دعم كامل للغة العربية واتجاه RTL
5. **Offline Mode**: يفضل Cache البيانات للعمل بدون إنترنت جزئياً
6. **Security**: حماية بيانات المستخدمين بشكل صارم
7. **Scalability**: التطبيق قابل للتوسع والإضافة عليه مستقبلاً

---

## 🎯 المخرجات المتوقعة

### MVP (Minimum Viable Product) - Phase 1:
- ✅ Authentication (Login/Register)
- ✅ Home Screen
- ✅ Properties List & Details
- ✅ Projects List & Details
- ✅ Services List & Details
- ✅ Add Property (للمستخدمين)
- ✅ User Profile
- ✅ Contact Form
- ✅ Push Notifications (Basic)

### Phase 2:
- ✅ Admin Panel (في التطبيق أو Web Dashboard منفصل)
- ✅ Favorites System
- ✅ Advanced Filters & Search
- ✅ Map View
- ✅ Dark Mode
- ✅ Multi-language
- ✅ Analytics Integration

### Phase 3 (Future):
- ✅ Payment Integration
- ✅ Chat System (بين المستخدمين)
- ✅ Video Tours للعقارات
- ✅ AR/VR Preview (اختياري)
- ✅ AI-powered Recommendations

---

**هذا الـ Prompt شامل وجاهز لتسليمه لأي مطور أو فريق تطوير لبناء تطبيق موبايل احترافي لـ AMG Real Estate! 🚀**
