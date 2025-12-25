'use client'

import { useEffect, useState } from 'react'

export default function TestPopupPage() {
  useEffect(() => {
    // Clear localStorage to show popup
    if (typeof window !== 'undefined') {
      localStorage.removeItem('newsletter_closed')
      console.log('✅ تم مسح localStorage - البوب أب سيظهر بعد 6 ثواني')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-2xl bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            🧪 صفحة اختبار البوب أب
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            تم مسح localStorage تلقائياً
          </p>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
          <p className="text-blue-800 font-semibold mb-3">
            ⏱️ البوب أب سيظهر بعد <span className="text-2xl font-bold">6 ثواني</span>
          </p>
          <p className="text-blue-600 text-sm">
            (10 ثواني على الموبايل)
          </p>
        </div>

        <div className="space-y-4 text-right">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-2">📝 ملاحظات:</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>✅ localStorage تم مسحه تلقائياً</li>
              <li>✅ البوب أب مفعّل في الموقع</li>
              <li>⏰ انتظر 6 ثواني (ديسكتوب) أو 10 ثواني (موبايل)</li>
              <li>🚫 لو قفلت البوب أب، مش هيظهر تاني (localStorage)</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <h3 className="font-bold text-amber-800 mb-2">💡 لو البوب أب مش ظاهر:</h3>
            <div className="space-y-2 text-right text-amber-700 text-sm">
              <p><strong>الطريقة 1:</strong> افتح Console (F12) واكتب:</p>
              <code className="block bg-amber-100 p-2 rounded text-xs font-mono text-left">
                localStorage.removeItem(&apos;newsletter_closed&apos;)
              </code>
              
              <p className="mt-3"><strong>الطريقة 2:</strong> افتح Developer Tools:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>F12 → Application</li>
                <li>Local Storage → http://localhost:3000</li>
                <li>احذف مفتاح &quot;newsletter_closed&quot;</li>
                <li>حدّث الصفحة (F5)</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <a 
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            ← العودة للصفحة الرئيسية
          </a>
        </div>

        {/* Live Counter */}
        <div className="mt-6">
          <LiveCounter />
        </div>
      </div>
    </div>
  )
}

function LiveCounter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev >= 6) {
          return prev
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-lg">
      <p className="text-sm mb-2">⏱️ العد التنازلي لظهور البوب أب:</p>
      <div className="text-5xl font-bold">
        {count < 6 ? 6 - count : '🎉'}
      </div>
      {count >= 6 && (
        <p className="text-sm mt-2 animate-pulse">
          البوب أب من المفترض يكون ظاهر الآن!
        </p>
      )}
    </div>
  )
}
