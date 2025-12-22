'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AdvancedAdminDashboard from '@/components/admin/AdvancedAdminDashboard'
import { logger } from '@/lib/logger'
import { 
  CircleStackIcon,
  ChartBarIcon,
  UserGroupIcon,
  HomeIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

interface DatabaseStats {
  users: number
  properties: number
  projects: number
  inquiries: number
  total: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [seedResult, setSeedResult] = useState<any>(null)
  const [currentView, setCurrentView] = useState('dashboard') // dashboard or database

  // Fetch stats on component mount
  useEffect(() => {
    fetchStats()
  }, [])

  // جلب إحصائيات قاعدة البيانات
  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      setStats(data.data)
    } catch (error) {
      logger.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // اختبار الاتصال بقاعدة البيانات
  const testConnection = async () => {
    setLoading(true)
    setTestResult(null)
    try {
      logger.log('🔄 Testing database connection...')
      const response = await fetch('/api/admin/database/test')
      logger.log('📡 Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      logger.log('📋 Response data:', data)
      setTestResult(data)
    } catch (error) {
      logger.error('💥 Failed to test connection:', error)
      setTestResult({ 
        success: false, 
        message: error instanceof Error ? error.message : 'خطأ غير محدد'
      })
    } finally {
      setLoading(false)
    }
  }

  // إضافة بيانات تجريبية
  const seedDatabase = async () => {
    setLoading(true)
    setSeedResult(null)
    try {
      logger.log('🌱 Seeding database...')
      const response = await fetch('/api/seed')
      logger.log('📡 Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      logger.log('📋 Seed result:', data)
      setSeedResult(data)
      
      // إعادة جلب الإحصائيات بعد إضافة البيانات
      if (data.success) {
        setTimeout(() => {
          fetchStats()
        }, 1000)
      }
    } catch (error) {
      logger.error('💥 Failed to seed database:', error)
      setSeedResult({ 
        success: false, 
        message: error instanceof Error ? error.message : 'خطأ في إضافة البيانات'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 space-x-reverse bg-white p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === 'dashboard'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            📊 لوحة المعلومات
          </button>
          <button
            onClick={() => setCurrentView('database')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === 'database'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            🛠️ إدارة قاعدة البيانات
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      {currentView === 'dashboard' && <AdvancedAdminDashboard />}
        
        {/* Database Management Page */}
        {currentView === 'database' && (
          <div>
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🎛️ لوحة إدارة قاعدة البيانات
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                إدارة شاملة لقاعدة بيانات موقع AMG العقارية. يمكنك من هنا مراقبة الإحصائيات، إدارة المحتوى، والتحكم في النظام.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Database Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المستخدمين</p>
                <p className="text-2xl font-bold text-blue-600">
                  {loading ? '...' : stats?.users || 0}
                </p>
              </div>
              <UserGroupIcon className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">العقارات</p>
                <p className="text-2xl font-bold text-green-600">
                  {loading ? '...' : stats?.properties || 0}
                </p>
              </div>
              <HomeIcon className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المشاريع</p>
                <p className="text-2xl font-bold text-purple-600">
                  {loading ? '...' : stats?.projects || 0}
                </p>
              </div>
              <BuildingOfficeIcon className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الاستفسارات</p>
                <p className="text-2xl font-bold text-orange-600">
                  {loading ? '...' : stats?.inquiries || 0}
                </p>
              </div>
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-8 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <CircleStackIcon className="w-7 h-7 text-blue-600" />
            أدوات إدارة قاعدة البيانات
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Test Connection */}
            <button
              onClick={testConnection}
              disabled={loading}
              className="flex flex-col items-center gap-3 p-6 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50"
            >
              <ChartBarIcon className="w-8 h-8 text-blue-600" />
              <span className="font-semibold text-gray-900">اختبار الاتصال</span>
              <span className="text-sm text-gray-600 text-center">
                اختبار الاتصال بقاعدة البيانات
              </span>
            </button>

            {/* Refresh Stats */}
            <button
              onClick={fetchStats}
              disabled={loading}
              className="flex flex-col items-center gap-3 p-6 border-2 border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all duration-200 disabled:opacity-50"
            >
              <ChartBarIcon className="w-8 h-8 text-green-600" />
              <span className="font-semibold text-gray-900">تحديث الإحصائيات</span>
              <span className="text-sm text-gray-600 text-center">
                جلب آخر إحصائيات قاعدة البيانات
              </span>
            </button>

            {/* Export Database */}
            <button
              onClick={() => window.location.href = '/api/admin/database/export-json'}
              disabled={loading}
              className="flex flex-col items-center gap-3 p-6 border-2 border-orange-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 disabled:opacity-50"
            >
              <CircleStackIcon className="w-8 h-8 text-orange-600" />
              <span className="font-semibold text-gray-900">تصدير قاعدة البيانات</span>
              <span className="text-sm text-gray-600 text-center">
                تحميل نسخة احتياطية (JSON)
              </span>
            </button>
          </div>

          {/* Additional Export Options */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 font-semibold">خيارات التصدير الإضافية:</p>
            <div className="flex gap-3 flex-wrap">
              <a
                href="/api/admin/database/export"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                📄 تصدير SQL (لـ phpMyAdmin)
              </a>
              <a
                href="/api/admin/database/export-json"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
              >
                📋 تصدير JSON (نسخة احتياطية)
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              💡 ملف SQL يمكن استيراده مباشرة في cPanel phpMyAdmin
            </p>
          </div>
        </motion.div>

        {/* Seed Database Button (moved below) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-8 shadow-lg mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">بيانات تجريبية</h3>
          <p className="text-gray-600 mb-4 text-sm">
            يمكنك إضافة بيانات تجريبية لاختبار النظام. هذه العملية آمنة ولا تؤثر على البيانات الموجودة.
          </p>
          <button
            onClick={seedDatabase}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50"
          >
            إضافة بيانات تجريبية
          </button>
        </motion.div>

        {/* Results */}
        {(testResult || seedResult) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {testResult && (
              <div className={`p-4 rounded-xl border-2 ${
                testResult.success 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-center gap-3">
                  {testResult.success ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircleIcon className="w-6 h-6 text-red-600" />
                  )}
                  <span className={`font-semibold ${
                    testResult.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    نتيجة اختبار الاتصال: {testResult.message}
                  </span>
                </div>
              </div>
            )}

            {seedResult && (
              <div className={`p-4 rounded-xl border-2 ${
                seedResult.success 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-center gap-3">
                  {seedResult.success ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircleIcon className="w-6 h-6 text-red-600" />
                  )}
                  <span className={`font-semibold ${seedResult.success ? 'text-green-900' : 'text-red-900'}`}>
                    نتيجة إضافة البيانات: {seedResult.message}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
        </div>
      )}
    </>
  )
}
