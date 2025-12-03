import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'سياسة الاسترداد والاستبدال - AMG Real Estate',
  description: 'سياسة الاسترداد والاستبدال وضمان الخدمات لشركة مجموعة أحمد الملاح العقارية',
}

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-white rounded-xl shadow-xl p-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-12 text-center leading-tight">
            سياسة الاسترداد والاستبدال
          </h1>
          
          <div className="prose prose-xl max-w-none text-gray-700 space-y-12">
            <div className="bg-green-50 p-8 rounded-xl border-r-4 border-green-500 shadow-sm">
              <p className="text-xl font-semibold text-green-900 mb-4">
                آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
              </p>
              <p className="text-green-800 text-lg leading-relaxed">
                نحن في مجموعة أحمد الملاح العقارية نلتزم بتقديم خدمات عالية الجودة وضمان رضا عملائنا. 
                هذه السياسة توضح شروط الاسترداد والاستبدال لخدماتنا المختلفة.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                1. نظرة عامة على السياسة
              </h2>
              <div className="space-y-4">
                <p>
                  نتفهم أن الخدمات العقارية استثمار مهم، لذلك وضعنا سياسة شاملة وعادلة للاسترداد والاستبدال
                  تحمي حقوق عملائنا مع ضمان استمرارية أعمالنا.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">المبادئ الأساسية:</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• الشفافية الكاملة في جميع المعاملات</li>
                    <li>• العدالة في تطبيق السياسة</li>
                    <li>• السرعة في معالجة الطلبات</li>
                    <li>• التواصل الواضح مع العملاء</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                2. الخدمات القابلة للاسترداد
              </h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-3">✅ قابلة للاسترداد</h3>
                    <ul className="text-green-700 space-y-2">
                      <li>• رسوم الاستشارات (خلال 48 ساعة)</li>
                      <li>• رسوم التقييم العقاري (قبل البدء)</li>
                      <li>• خدمات التسويق (خلال 7 أيام)</li>
                      <li>• خدمات التصميم (مرحلة التخطيط)</li>
                      <li>• حجز المعاينات المدفوعة</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-5 rounded-lg border border-red-200">
                    <h3 className="text-lg font-semibold text-red-800 mb-3">❌ غير قابلة للاسترداد</h3>
                    <ul className="text-red-700 space-y-2">
                      <li>• عمولات الوساطة المكتملة</li>
                      <li>• خدمات إدارة الممتلكات الجارية</li>
                      <li>• رسوم المعاملات القانونية</li>
                      <li>• خدمات التشطيب المنجزة</li>
                      <li>• تكاليف الإعلانات المنشورة</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                3. شروط الاسترداد حسب نوع الخدمة
              </h2>
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">🏠 الخدمات العقارية</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">خدمات الوساطة:</h4>
                      <ul className="list-disc pr-6 space-y-1 text-gray-600">
                        <li>استرداد 100% إذا لم نقدم أي عقارات مناسبة خلال 30 يوم</li>
                        <li>استرداد 50% إذا ألغي العقد قبل إتمام الصفقة بسبب مشاكل قانونية</li>
                        <li>لا استرداد بعد إتمام عملية البيع/الشراء بنجاح</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">التقييم العقاري:</h4>
                      <ul className="list-disc pr-6 space-y-1 text-gray-600">
                        <li>استرداد كامل إذا ألغي الطلب قبل بدء المعاينة</li>
                        <li>استرداد 70% إذا وجدت أخطاء جوهرية في التقييم</li>
                        <li>لا استرداد بعد تسليم التقرير النهائي</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">🎨 خدمات التصميم والتشطيب</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">التصميم الداخلي:</h4>
                      <ul className="list-disc pr-6 space-y-1 text-gray-600">
                        <li>استرداد 100% خلال 7 أيام من بدء المشروع</li>
                        <li>استرداد 50% بعد تسليم التصاميم الأولية</li>
                        <li>استرداد 25% بعد الموافقة على التصاميم النهائية</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">أعمال التشطيب:</h4>
                      <ul className="list-disc pr-6 space-y-1 text-gray-600">
                        <li>استرداد حسب مراحل الإنجاز والمواد المستخدمة</li>
                        <li>ضمان لمدة سنة واحدة على جميع الأعمال</li>
                        <li>إصلاح مجاني للعيوب الظاهرة خلال فترة الضمان</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">📢 خدمات التسويق</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">التسويق العقاري:</h4>
                      <ul className="list-disc pr-6 space-y-1 text-gray-600">
                        <li>استرداد 100% إذا لم يتم نشر الإعلانات خلال 5 أيام عمل</li>
                        <li>استرداد 60% إذا لم نحقق الحد الأدنى من المشاهدات المتفق عليها</li>
                        <li>استرداد نسبي حسب مدة الحملة المتبقية</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                4. إجراءات طلب الاسترداد
              </h2>
              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">خطوات طلب الاسترداد:</h4>
                  <ol className="list-decimal pr-6 space-y-2 text-yellow-700">
                    <li>تقديم طلب مكتوب عبر البريد الإلكتروني أو الموقع</li>
                    <li>تقديم المستندات المطلوبة (عقد الخدمة، إيصالات الدفع)</li>
                    <li>توضيح سبب طلب الاسترداد بالتفصيل</li>
                    <li>انتظار مراجعة الطلب خلال 7-14 يوم عمل</li>
                    <li>استلام رد الشركة والموافقة أو الرفض مع الأسباب</li>
                    <li>تنفيذ الاسترداد خلال 30 يوم في حالة الموافقة</li>
                  </ol>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">المستندات المطلوبة:</h4>
                    <ul className="list-disc pr-6 space-y-1 text-gray-600">
                      <li>نسخة من عقد الخدمة</li>
                      <li>إيصالات الدفع الأصلية</li>
                      <li>هوية العميل أو المفوض</li>
                      <li>تفاصيل الحساب البنكي للاسترداد</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">مدد المعالجة:</h4>
                    <ul className="list-disc pr-6 space-y-1 text-gray-600">
                      <li>مراجعة الطلب: 7-14 يوم عمل</li>
                      <li>التحقق من المستندات: 3-5 أيام</li>
                      <li>تنفيذ الاسترداد: 15-30 يوم</li>
                      <li>الحالات المعقدة: حتى 45 يوم</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                5. طرق الاسترداد
              </h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-blue-800 mb-2">🏦 التحويل البنكي</h4>
                    <p className="text-blue-700 text-sm">
                      الطريقة المفضلة للمبالغ الكبيرة
                      <br />مدة التنفيذ: 3-5 أيام عمل
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-green-800 mb-2">💳 نفس طريقة الدفع</h4>
                    <p className="text-green-700 text-sm">
                      إذا كان الدفع بالبطاقة
                      <br />مدة التنفيذ: 7-14 يوم عمل
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-purple-800 mb-2">💵 نقدي</h4>
                    <p className="text-purple-700 text-sm">
                      للمبالغ الصغيرة فقط
                      <br />من المكتب الرئيسي
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                6. سياسة الاستبدال
              </h2>
              <div className="space-y-4">
                <p>
                  في بعض الحالات، قد يكون الاستبدال خياراً أفضل من الاسترداد:
                </p>
                <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200">
                  <h4 className="font-semibold text-indigo-800 mb-3">خيارات الاستبدال:</h4>
                  <ul className="text-indigo-700 space-y-2">
                    <li>• <strong>تبديل نوع الخدمة:</strong> تغيير من خدمة لأخرى بنفس القيمة</li>
                    <li>• <strong>تأجيل الخدمة:</strong> تأجيل تنفيذ الخدمة لوقت لاحق</li>
                    <li>• <strong>ترقية الخدمة:</strong> الانتقال لباقة أعلى مقابل دفع الفرق</li>
                    <li>• <strong>تقسيم الخدمة:</strong> تجزئة الخدمة لعدة مراحل</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                7. الضمانات
              </h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-5 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-3">🛡️ ضمان الجودة</h4>
                    <ul className="text-green-700 space-y-1">
                      <li>• ضمان سنة على أعمال التشطيب</li>
                      <li>• ضمان 6 أشهر على التصاميم</li>
                      <li>• ضمان 3 أشهر على الاستشارات</li>
                      <li>• صيانة مجانية خلال فترة الضمان</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-5 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3">⭐ ضمان الرضا</h4>
                    <ul className="text-blue-700 space-y-1">
                      <li>• إعادة العمل مجاناً في حالة عدم الرضا</li>
                      <li>• استشارات إضافية مجانية</li>
                      <li>• متابعة ما بعد البيع</li>
                      <li>• دعم فني على مدار الساعة</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                8. حالات خاصة
              </h2>
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">القوة القاهرة:</h4>
                    <p className="text-orange-700">
                      في حالات الكوارث الطبيعية، الحروب، أو الظروف الاستثنائية التي تمنع تنفيذ الخدمة،
                      سيتم تأجيل الخدمة أو الاسترداد الكامل حسب رغبة العميل.
                    </p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">المشاكل القانونية:</h4>
                    <p className="text-red-700">
                      في حالة ظهور مشاكل قانونية في العقار تمنع إتمام الصفقة،
                      سيتم استرداد كامل الرسوم المدفوعة خلال 30 يوم.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                التواصل والشكاوى
              </h2>
              <div className="space-y-4">
                <p>لطلبات الاسترداد أو الاستفسارات، يرجى التواصل معنا:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">خدمة العملاء</h4>
                    <p>الهاتف: +20 XX XXXX XXXX</p>
                    <p>البريد الإلكتروني: refunds@amg-realestate.com</p>
                    <p>ساعات العمل: 9 ص - 6 م (السبت - الخميس)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">إدارة الشكاوى</h4>
                    <p>البريد الإلكتروني: complaints@amg-realestate.com</p>
                    <p>واتساب: +20 XX XXXX XXXX</p>
                    <p>نضمن الرد خلال 24 ساعة</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-8 p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
              <p className="text-indigo-800 font-medium">
                تاريخ آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
              </p>
              <p className="text-indigo-600 text-sm mt-2">
                هذه السياسة سارية المفعول اعتباراً من التاريخ المذكور أعلاه
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
