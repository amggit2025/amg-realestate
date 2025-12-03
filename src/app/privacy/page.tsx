import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'سياسة الخصوصية - AMG Real Estate',
  description: 'سياسة الخصوصية وحماية البيانات الشخصية لشركة مجموعة أحمد الملاح العقارية',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-white rounded-xl shadow-xl p-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-12 text-center leading-tight">
            سياسة الخصوصية
          </h1>
          
          <div className="prose prose-xl max-w-none text-gray-700 space-y-12">
            <div className="bg-blue-50 p-8 rounded-xl border-r-4 border-blue-500 shadow-sm">
              <p className="text-xl font-semibold text-blue-900 mb-4">
                آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
              </p>
              <p className="text-blue-800 text-lg leading-relaxed">
                تحترم شركة مجموعة أحمد الملاح العقارية (AMG) خصوصيتك وتلتزم بحماية بياناتك الشخصية.
              </p>
            </div>

            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-4">
                1. جمع المعلومات
              </h2>
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">المعلومات التي نجمعها:</h3>
                <ul className="list-disc pr-8 space-y-4 text-lg leading-relaxed">
                  <li><strong className="text-gray-900">المعلومات الشخصية:</strong> الاسم، البريد الإلكتروني، رقم الهاتف، العنوان</li>
                  <li><strong className="text-gray-900">معلومات العقارات:</strong> تفضيلات البحث، متطلبات العقار، الميزانية</li>
                  <li><strong className="text-gray-900">معلومات تقنية:</strong> عنوان IP، نوع المتصفح، أوقات الزيارة</li>
                  <li><strong className="text-gray-900">ملفات تعريف الارتباط:</strong> لتحسين تجربة المستخدم</li>
                </ul>
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-4">
                2. استخدام المعلومات
              </h2>
              <div className="space-y-6">
                <p className="text-lg leading-relaxed">نستخدم معلوماتك للأغراض التالية:</p>
                <ul className="list-disc pr-8 space-y-4 text-lg leading-relaxed">
                  <li>تقديم خدمات الوساطة العقارية والاستشارات</li>
                  <li>التواصل معك بخصوص العقارات المناسبة</li>
                  <li>إرسال التحديثات والعروض الخاصة</li>
                  <li>تحسين خدماتنا وتطوير منصتنا</li>
                  <li>الامتثال للمتطلبات القانونية</li>
                </ul>
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-4">
                3. مشاركة المعلومات
              </h2>
              <div className="space-y-6">
                <p className="text-lg leading-relaxed">نحن لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك في الحالات التالية:</p>
                <ul className="list-disc pr-8 space-y-4 text-lg leading-relaxed">
                  <li>مع شركاء الأعمال المعتمدين لتقديم الخدمات</li>
                  <li>عند الحصول على موافقتك الصريحة</li>
                  <li>للامتثال للمتطلبات القانونية</li>
                  <li>لحماية حقوقنا وممتلكاتنا</li>
                </ul>
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-4">
                4. حماية البيانات
              </h2>
              <div className="space-y-6">
                <p className="text-lg leading-relaxed">نتخذ تدابير أمنية متقدمة لحماية معلوماتك:</p>
                <ul className="list-disc pr-8 space-y-4 text-lg leading-relaxed">
                  <li>تشفير البيانات الحساسة (SSL/TLS)</li>
                  <li>جدران حماية متقدمة وأنظمة مراقبة</li>
                  <li>تحديث دوري لأنظمة الأمان</li>
                  <li>تدريب الموظفين على أمن المعلومات</li>
                  <li>نسخ احتياطية منتظمة ومؤمنة</li>
                </ul>
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-4">
                5. حقوقك
              </h2>
              <div className="space-y-6">
                <p className="text-lg leading-relaxed">لديك الحقوق التالية فيما يتعلق ببياناتك الشخصية:</p>
                <ul className="list-disc pr-8 space-y-4 text-lg leading-relaxed">
                  <li><strong className="text-gray-900">الحق في الوصول:</strong> طلب نسخة من بياناتك المحفوظة لدينا</li>
                  <li><strong className="text-gray-900">الحق في التصحيح:</strong> تحديث أو تصحيح المعلومات غير الدقيقة</li>
                  <li><strong className="text-gray-900">الحق في الحذف:</strong> طلب حذف بياناتك الشخصية</li>
                  <li><strong className="text-gray-900">الحق في التحكم:</strong> إيقاف معالجة بياناتك أو نقلها</li>
                  <li><strong className="text-gray-900">الحق في الاعتراض:</strong> رفض استخدام بياناتك لأغراض معينة</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                6. ملفات تعريف الارتباط (Cookies)
              </h2>
              <div className="space-y-4">
                <p>نستخدم ملفات تعريف الارتباط لتحسين تجربتك:</p>
                <ul className="list-disc pr-6 space-y-2">
                  <li><strong>ملفات ضرورية:</strong> لضمان عمل الموقع بشكل صحيح</li>
                  <li><strong>ملفات تحليلية:</strong> لفهم كيفية استخدام الموقع</li>
                  <li><strong>ملفات تفضيلات:</strong> لحفظ إعداداتك المفضلة</li>
                </ul>
                <p className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                  يمكنك إدارة ملفات تعريف الارتباط من خلال إعدادات متصفحك.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                7. الاحتفاظ بالبيانات
              </h2>
              <div className="space-y-4">
                <p>نحتفظ ببياناتك للمدة اللازمة لتقديم خدماتنا أو حسب ما يتطلبه القانون:</p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>بيانات العملاء النشطين: طوال فترة تقديم الخدمة</li>
                  <li>سجلات المعاملات: 7 سنوات حسب القانون المصري</li>
                  <li>بيانات التسويق: حتى سحب الموافقة</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                8. التغييرات على السياسة
              </h2>
              <div className="space-y-4">
                <p>
                  قد نقوم بتحديث هذه السياسة من وقت لآخر. سنقوم بإشعارك بأي تغييرات جوهرية 
                  عبر البريد الإلكتروني أو إشعار على موقعنا الإلكتروني.
                </p>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                التواصل معنا
              </h2>
              <div className="space-y-4">
                <p>إذا كانت لديك أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">مجموعة أحمد الملاح العقارية</h4>
                    <p>القاهرة، مصر</p>
                    <p>البريد الإلكتروني: privacy@amg-realestate.com</p>
                    <p>الهاتف: +20 XX XXXX XXXX</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">مسؤول حماية البيانات</h4>
                    <p>البريد الإلكتروني: dpo@amg-realestate.com</p>
                    <p>نضمن الرد خلال 72 ساعة</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-blue-800 font-medium">
                تاريخ آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
              </p>
              <p className="text-blue-600 text-sm mt-2">
                هذه السياسة سارية المفعول اعتباراً من التاريخ المذكور أعلاه
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
