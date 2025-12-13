#!/usr/bin/env pwsh
# 🧪 اختبار نظام الإشعارات الفورية

Write-Host "🔥 ========================================" -ForegroundColor Cyan
Write-Host "   اختبار Firebase Push Notifications" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# التحقق من المتغيرات
Write-Host "✓ التحقق من ملف .env.local..." -ForegroundColor Green

$envFile = Get-Content .env.local -Raw

if ($envFile -match "NEXT_PUBLIC_FIREBASE_VAPID_KEY=") {
    Write-Host "  ✅ VAPID Key موجود" -ForegroundColor Green
} else {
    Write-Host "  ❌ VAPID Key غير موجود" -ForegroundColor Red
}

if ($envFile -match "FIREBASE_PROJECT_ID=") {
    Write-Host "  ✅ Project ID موجود" -ForegroundColor Green
} else {
    Write-Host "  ❌ Project ID غير موجود" -ForegroundColor Red
}

if ($envFile -match "FIREBASE_CLIENT_EMAIL=") {
    Write-Host "  ✅ Client Email موجود" -ForegroundColor Green
} else {
    Write-Host "  ❌ Client Email غير موجود" -ForegroundColor Red
}

if ($envFile -match "FIREBASE_PRIVATE_KEY=") {
    Write-Host "  ✅ Private Key موجود" -ForegroundColor Green
} else {
    Write-Host "  ❌ Private Key غير موجود" -ForegroundColor Red
}

Write-Host ""
Write-Host "📦 التحقق من الحزم المطلوبة..." -ForegroundColor Green

$packageJson = Get-Content package.json | ConvertFrom-Json

if ($packageJson.dependencies."firebase") {
    Write-Host "  ✅ Firebase SDK مثبت (v$($packageJson.dependencies.'firebase'))" -ForegroundColor Green
} else {
    Write-Host "  ❌ Firebase SDK غير مثبت" -ForegroundColor Red
}

if ($packageJson.dependencies."firebase-admin") {
    Write-Host "  ✅ Firebase Admin مثبت (v$($packageJson.dependencies.'firebase-admin'))" -ForegroundColor Green
} else {
    Write-Host "  ❌ Firebase Admin غير مثبت" -ForegroundColor Red
}

if ($packageJson.dependencies."date-fns") {
    Write-Host "  ✅ date-fns مثبت (v$($packageJson.dependencies.'date-fns'))" -ForegroundColor Green
} else {
    Write-Host "  ❌ date-fns غير مثبت" -ForegroundColor Red
}

Write-Host ""
Write-Host "📁 التحقق من الملفات المطلوبة..." -ForegroundColor Green

$files = @(
    "src/lib/firebase-client.ts",
    "src/lib/firebase-admin.ts",
    "src/lib/notifications.ts",
    "src/components/layout/NotificationBell.tsx",
    "public/firebase-messaging-sw.js",
    "src/app/api/notifications/route.ts",
    "prisma/schema.prisma"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file غير موجود" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🗄️  التحقق من قاعدة البيانات..." -ForegroundColor Green

$schema = Get-Content prisma/schema.prisma -Raw
if ($schema -match "model Notification") {
    Write-Host "  ✅ جدول Notification موجود في Schema" -ForegroundColor Green
} else {
    Write-Host "  ❌ جدول Notification غير موجود" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# عرض خطوات الاختبار
Write-Host "📋 خطوات الاختبار التالية:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  شغل السيرفر:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣  افتح المتصفح:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "3️⃣  سجل دخول كمستخدم" -ForegroundColor Cyan
Write-Host ""
Write-Host "4️⃣  اضغط 'السماح' عند طلب إذن الإشعارات" -ForegroundColor Cyan
Write-Host ""
Write-Host "5️⃣  أضف عقار جديد" -ForegroundColor Cyan
Write-Host ""
Write-Host "6️⃣  أغلق المتصفح تماماً" -ForegroundColor Cyan
Write-Host ""
Write-Host "7️⃣  سجل دخول كأدمن من جهاز آخر" -ForegroundColor Cyan
Write-Host ""
Write-Host "8️⃣  وافق على العقار" -ForegroundColor Cyan
Write-Host ""
Write-Host "9️⃣  ستصلك إشعار حتى والموقع مغلق! 🎉" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "⚠️  تذكير مهم للإنتاج:" -ForegroundColor Yellow
Write-Host "أضف المتغيرات في Vercel Dashboard:" -ForegroundColor White
Write-Host "https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host ""
