// ======================================================
// 🔥 Firebase Configuration Validator
// ======================================================
// استخدم هذا السكريبت للتحقق من إعداد Firebase الصحيح

export function validateFirebaseConfig() {
  const requiredEnvVars = {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    NEXT_PUBLIC_FIREBASE_VAPID_KEY: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  }

  const missing: string[] = []
  const configured: string[] = []

  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value || value.trim() === '') {
      missing.push(key)
    } else {
      configured.push(key)
    }
  })

  return {
    isValid: missing.length === 0,
    configured,
    missing,
    details: {
      projectId: !!requiredEnvVars.FIREBASE_PROJECT_ID,
      clientEmail: !!requiredEnvVars.FIREBASE_CLIENT_EMAIL,
      privateKey: !!requiredEnvVars.FIREBASE_PRIVATE_KEY,
      vapidKey: !!requiredEnvVars.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    }
  }
}

export function getFirebaseSetupInstructions() {
  return `
🔥 إعداد Firebase للإشعارات Push

1️⃣ إنشاء مشروع Firebase:
   - اذهب إلى: https://console.firebase.google.com/
   - أنشئ مشروع جديد أو استخدم "amg-real-estate"
   - فعّل Cloud Messaging

2️⃣ الحصول على Service Account Key:
   - Project Settings → Service Accounts
   - Generate New Private Key
   - احفظ ملف JSON

3️⃣ الحصول على VAPID Key:
   - Project Settings → Cloud Messaging
   - Web Push certificates
   - Generate key pair
   - انسخ الـ Key pair

4️⃣ إضافة المتغيرات في Vercel:
   FIREBASE_PROJECT_ID="amg-real-estate"
   FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@amg-real-estate.iam.gserviceaccount.com"
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYour-Key-Here\\n-----END PRIVATE KEY-----"
   NEXT_PUBLIC_FIREBASE_VAPID_KEY="Your-VAPID-Key-Here"

⚠️ ملاحظات مهمة:
   - استبدل \\n بـ newline في FIREBASE_PRIVATE_KEY
   - تأكد من عدم وجود مسافات في البداية أو النهاية
   - VAPID Key يجب أن يبدأ بـ NEXT_PUBLIC_

📱 بعد الإعداد:
   - يمكن للمستخدمين استقبال إشعارات push
   - الإشعارات تعمل حتى لو كان الموقع مغلق
   - دعم كامل للـ PWA
  `
}

// Helper للطباعة في Console
if (process.env.NODE_ENV === 'development') {
  const result = validateFirebaseConfig()
  
  if (!result.isValid) {
    console.warn('⚠️ Firebase Configuration Incomplete')
    console.log('Missing:', result.missing)
    console.log(getFirebaseSetupInstructions())
  } else {
    console.log('✅ Firebase Configuration Complete')
  }
}
