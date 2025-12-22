import { Metadata } from 'next'
import Link from 'next/link'
import { WifiIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'غير متصل بالإنترنت | AMG Real Estate',
  description: 'أنت غير متصل بالإنترنت حالياً',
}

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <WifiIcon className="w-12 h-12 text-blue-600" strokeWidth={1.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          غير متصل بالإنترنت
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-8">
          يبدو أنك غير متصل بالإنترنت حالياً. تحقق من اتصالك وحاول مرة أخرى.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            إعادة المحاولة
          </button>
          
          <Link
            href="/"
            className="block w-full bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 transition-all duration-300"
          >
            العودة للرئيسية
          </Link>
        </div>

        {/* Cached Content Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-900">
            💡 <strong>نصيحة:</strong> بعض الصفحات التي زرتها سابقاً قد تكون متاحة في وضع عدم الاتصال
          </p>
        </div>

        {/* Network Status */}
        <div className="mt-6 text-sm text-gray-500">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>غير متصل</span>
          </div>
        </div>
      </div>
    </div>
  )
}
