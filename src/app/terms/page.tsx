import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'شروط الاستخدام - AMG Real Estate',
  description: 'شروط وأحكام استخدام خدمات شركة مجموعة أحمد الملاح العقارية',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-white rounded-xl shadow-xl p-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-12 text-center leading-tight">
            شروط الاستخدام
          </h1>
          
          <div className="prose prose-xl max-w-none text-gray-700 space-y-12">
            <div className="bg-blue-50 p-8 rounded-xl border-r-4 border-blue-500 shadow-sm">
              <p className="text-xl font-semibold text-blue-900 mb-4">
                آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
              </p>
              <p className="text-blue-800 text-lg leading-relaxed">
                مرحباً بك في موقع مجموعة أحمد الملاح العقارية. باستخدامك لموقعنا وخدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام.
              </p>
            </div>

            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-4">
                1. التعريفات
              </h2>
              <div className="space-y-6">
                <ul className="list-disc pr-8 space-y-4 text-lg leading-relaxed">
                  <li><strong className="text-gray-900">&ldquo;الشركة&rdquo; أو &ldquo;نحن&rdquo;:</strong> مجموعة أحمد الملاح العقارية (AMG Real Estate)</li>
                  <li><strong className="text-gray-900">&ldquo;الموقع&rdquo;:</strong> الموقع الإلكتروني الخاص بالشركة وجميع خدماته</li>
                  <li><strong className="text-gray-900">&ldquo;المستخدم&rdquo; أو &ldquo;أنت&rdquo;:</strong> أي شخص يدخل أو يستخدم الموقع</li>
                  <li><strong className="text-gray-900">&ldquo;الخدمات&rdquo;:</strong> جميع الخدمات العقارية المقدمة من الشركة</li>
                  <li><strong className="text-gray-900">&ldquo;المحتوى&rdquo;:</strong> جميع النصوص والصور والمعلومات المتاحة على الموقع</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                2. قبول الشروط
              </h2>
              <div className="space-y-4">
                <p>
                  باستخدام موقعنا الإلكتروني أو خدماتنا، فإنك تؤكد أنك:
                </p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>بلغت السن القانونية (18 عاماً أو أكثر)</li>
                  <li>تمتلك الأهلية القانونية للدخول في العقود</li>
                  <li>قرأت وفهمت وتوافق على هذه الشروط والأحكام</li>
                  <li>لن تستخدم الموقع لأي أغراض غير قانونية</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                3. الخدمات المقدمة
              </h2>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">خدماتنا تشمل:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">الخدمات العقارية</h4>
                    <ul className="text-green-700 space-y-1">
                      <li>• بيع وشراء العقارات</li>
                      <li>• تأجير العقارات</li>
                      <li>• التقييم العقاري</li>
                      <li>• الاستشارات العقارية</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">خدمات التطوير</h4>
                    <ul className="text-blue-700 space-y-1">
                      <li>• إدارة المشاريع العقارية</li>
                      <li>• التسويق العقاري</li>
                      <li>• التشطيبات والديكور</li>
                      <li>• الأثاث والمطابخ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                4. التزامات المستخدم
              </h2>
              <div className="space-y-4">
                <p>يتعهد المستخدم بما يلي:</p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>تقديم معلومات صحيحة ودقيقة</li>
                  <li>عدم انتهاك حقوق الملكية الفكرية</li>
                  <li>عدم نشر محتوى مسيء أو مخالف للقانون</li>
                  <li>عدم محاولة اختراق أو الإضرار بالموقع</li>
                  <li>احترام المستخدمين الآخرين</li>
                  <li>الامتثال للقوانين المحلية والدولية</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                5. الرسوم والمدفوعات
              </h2>
              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">هيكل الرسوم:</h4>
                  <ul className="text-yellow-700 space-y-1">
                    <li>• رسوم الوساطة: تحدد حسب نوع العقار وقيمته</li>
                    <li>• رسوم الاستشارات: تحدد حسب نوع الخدمة</li>
                    <li>• رسوم التسويق: تتفاوت حسب حجم المشروع</li>
                    <li>• جميع الرسوم قابلة للتفاوض وتحدد كتابياً</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">شروط الدفع:</h4>
                  <ul className="list-disc pr-6 space-y-1">
                    <li>جميع الرسوم تستحق الدفع حسب الاتفاق المكتوب</li>
                    <li>يتم قبول الدفع نقداً أو بالتحويل البنكي</li>
                    <li>لا توجد استردادات إلا في حالات محددة</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                6. حقوق الملكية الفكرية
              </h2>
              <div className="space-y-4">
                <p>
                  جميع المحتويات الموجودة على الموقع محمية بحقوق الطبع والنشر وحقوق الملكية الفكرية:
                </p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>العلامة التجارية "AMG Real Estate" مملوكة للشركة</li>
                  <li>التصاميم والشعارات والصور محفوظة الحقوق</li>
                  <li>لا يحق نسخ أو توزيع المحتوى دون إذن مكتوب</li>
                  <li>يمكن مشاركة الروابط مع ذكر المصدر</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                7. إخلاء المسؤولية
              </h2>
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">تنويه مهم:</h4>
                  <ul className="text-red-700 space-y-1">
                    <li>• المعلومات المقدمة لأغراض إعلامية فقط</li>
                    <li>• لا نضمن دقة جميع المعلومات المعروضة</li>
                    <li>• الأسعار والتفاصيل قابلة للتغيير دون إشعار مسبق</li>
                    <li>• ننصح بالتحقق المستقل من جميع المعلومات</li>
                  </ul>
                </div>
                <p>
                  الشركة غير مسؤولة عن أي أضرار مباشرة أو غير مباشرة قد تنتج عن استخدام الموقع أو الخدمات،
                  باستثناء ما ينص عليه القانون صراحة.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                8. إنهاء الخدمة
              </h2>
              <div className="space-y-4">
                <p>يحق للشركة إنهاء أو تعليق الخدمة في الحالات التالية:</p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>انتهاك شروط الاستخدام</li>
                  <li>استخدام الموقع لأغراض غير قانونية</li>
                  <li>تقديم معلومات كاذبة أو مضللة</li>
                  <li>عدم دفع الرسوم المستحقة</li>
                </ul>
                <p className="mt-4 p-4 bg-gray-100 rounded">
                  يحق للمستخدم إنهاء الخدمة في أي وقت بإشعار مكتوب مسبق.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                9. القانون الحاكم وفض النزاعات
              </h2>
              <div className="space-y-4">
                <ul className="list-disc pr-6 space-y-2">
                  <li>تخضع هذه الشروط للقانون المصري</li>
                  <li>محاكم القاهرة هي صاحبة الاختصاص في النزاعات</li>
                  <li>نفضل حل النزاعات ودياً قبل اللجوء للقضاء</li>
                  <li>يمكن اللجوء للتحكيم التجاري في القضايا المعقدة</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                10. تعديل الشروط
              </h2>
              <div className="space-y-4">
                <p>
                  تحتفظ الشركة بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعار المستخدمين بالتغييرات الجوهرية عبر:
                </p>
                <ul className="list-disc pr-6 space-y-2">
                  <li>إشعار على الموقع الإلكتروني</li>
                  <li>رسالة بريد إلكتروني للمستخدمين المسجلين</li>
                  <li>رسالة نصية للعملاء النشطين</li>
                </ul>
                <p className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                  استمرار استخدام الموقع بعد التعديل يعني قبولك للشروط الجديدة.
                </p>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                معلومات التواصل
              </h2>
              <div className="space-y-4">
                <p>لأي استفسارات حول شروط الاستخدام، يرجى التواصل معنا:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">المكتب الرئيسي</h4>
                    <p>مجموعة أحمد الملاح العقارية</p>
                    <p>القاهرة، مصر</p>
                    <p>الهاتف: +20 XX XXXX XXXX</p>
                    <p>البريد الإلكتروني: info@amg-realestate.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">الشؤون القانونية</h4>
                    <p>البريد الإلكتروني: legal@amg-realestate.com</p>
                    <p>ساعات العمل: 9 صباحاً - 6 مساءً</p>
                    <p>من السبت إلى الخميس</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-green-800 font-medium">
                تاريخ آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
              </p>
              <p className="text-green-600 text-sm mt-2">
                هذه الشروط سارية المفعول اعتباراً من التاريخ المذكور أعلاه
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
