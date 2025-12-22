'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { logger } from '@/lib/logger'
import {
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  TableCellsIcon,
  DocumentTextIcon,
  CalendarIcon,
  FunnelIcon,
  ChartBarIcon,
  UserGroupIcon,
  HomeIcon,
  EnvelopeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

interface ExportStats {
  totalUsers: number
  totalProperties: number
  totalInquiries: number
  totalSubscriptions: number
  activeUsers: number
  activeProperties: number
  pendingInquiries: number
  thisMonth: {
    users: number
    properties: number
    inquiries: number
  }
}

export default function ReportsPage() {
  const [stats, setStats] = useState<ExportStats>({
    totalUsers: 0,
    totalProperties: 0,
    totalInquiries: 0,
    totalSubscriptions: 0,
    activeUsers: 0,
    activeProperties: 0,
    pendingInquiries: 0,
    thisMonth: {
      users: 0,
      properties: 0,
      inquiries: 0,
    },
  })
  const [isLoading, setIsLoading] = useState(true)
  const [exportLoading, setExportLoading] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      // جلب الإحصائيات من APIs مختلفة
      const responses = await Promise.allSettled([
        fetch('/api/admin/users'),
        fetch('/api/admin/properties'),
        fetch('/api/admin/inquiries'),
        fetch('/api/admin/newsletter-subscriptions'),
      ])

      // معالجة النتائج
      let usersStats = { total: 0, active: 0, thisMonth: 0 }
      let propertiesStats = { total: 0, active: 0, thisMonth: 0 }
      let inquiriesStats = { total: 0, pending: 0, today: 0 }
      let subscriptionsStats = { total: 0 }

      if (responses[0].status === 'fulfilled') {
        const usersData = await responses[0].value.json()
        if (usersData.success && usersData.data?.stats) {
          usersStats = {
            total: usersData.data.stats.total || 0,
            active: usersData.data.stats.active || 0,
            thisMonth: usersData.data.stats.thisMonth || 0,
          }
        }
      }

      if (responses[1].status === 'fulfilled') {
        const propertiesData = await responses[1].value.json()
        if (propertiesData.success && propertiesData.stats) {
          propertiesStats = {
            total: propertiesData.stats.total || 0,
            active: propertiesData.stats.active || 0,
            thisMonth: propertiesData.stats.thisMonth || 0,
          }
        }
      }

      if (responses[2].status === 'fulfilled') {
        const inquiriesData = await responses[2].value.json()
        if (inquiriesData.success && inquiriesData.stats) {
          inquiriesStats = {
            total: inquiriesData.stats.total || 0,
            pending: inquiriesData.stats.pending || 0,
            today: inquiriesData.stats.today || 0,
          }
        }
      }

      if (responses[3].status === 'fulfilled') {
        const subscriptionsData = await responses[3].value.json()
        if (subscriptionsData.success && subscriptionsData.stats) {
          subscriptionsStats = {
            total: subscriptionsData.stats.total || 0,
          }
        }
      }

      setStats({
        totalUsers: usersStats.total,
        totalProperties: propertiesStats.total,
        totalInquiries: inquiriesStats.total,
        totalSubscriptions: subscriptionsStats.total,
        activeUsers: usersStats.active,
        activeProperties: propertiesStats.active,
        pendingInquiries: inquiriesStats.pending,
        thisMonth: {
          users: usersStats.thisMonth,
          properties: propertiesStats.thisMonth,
          inquiries: inquiriesStats.today,
        },
      })
    } catch (error) {
      logger.error('Error fetching stats:', error)
      showMessage('error', 'حدث خطأ في جلب الإحصائيات')
    } finally {
      setIsLoading(false)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const exportData = async (type: 'users' | 'properties' | 'inquiries' | 'subscriptions', format: 'csv' | 'json' | 'pdf') => {
    setExportLoading(`${type}-${format}`)
    
    try {
      if (format === 'pdf') {
        // تصدير PDF باستخدام window.print
        await exportToPDF(type)
        showMessage('success', `تم تصدير ${type} بنجاح بصيغة PDF`)
        setExportLoading(null)
        return
      }

      const response = await fetch(`/api/admin/export/${type}?format=${format}&from=${dateRange.from}&to=${dateRange.to}`)
      
      if (!response.ok) {
        throw new Error('فشل التصدير')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type}-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      showMessage('success', `تم تصدير ${type} بنجاح بصيغة ${format.toUpperCase()}`)
    } catch (error) {
      logger.error('Export error:', error)
      showMessage('error', 'حدث خطأ أثناء التصدير')
    } finally {
      setExportLoading(null)
    }
  }

  const exportToPDF = async (type: 'users' | 'properties' | 'inquiries' | 'subscriptions') => {
    try {
      // جلب البيانات
      const response = await fetch(`/api/admin/export/${type}?format=json&from=${dateRange.from}&to=${dateRange.to}`)
      const data = await response.json()

      // إنشاء نافذة جديدة للطباعة
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        throw new Error('فشل فتح نافذة الطباعة')
      }

      // إنشاء HTML للطباعة
      const html = generatePDFHTML(type, data)
      printWindow.document.write(html)
      printWindow.document.close()

      // انتظار تحميل المحتوى ثم طباعة
      printWindow.onload = () => {
        printWindow.print()
        setTimeout(() => printWindow.close(), 500)
      }
    } catch (error) {
      throw error
    }
  }

  const generatePDFHTML = (type: string, data: any[]) => {
    const typeNames: Record<string, string> = {
      users: 'المستخدمين',
      properties: 'العقارات',
      inquiries: 'الاستفسارات',
      subscriptions: 'الاشتراكات',
    }

    const headers = data.length > 0 ? Object.keys(data[0]) : []

    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>تقرير ${typeNames[type]} - AMG Real Estate</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 1cm;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      direction: rtl;
      padding: 20px;
      background: white;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #3b82f6;
    }
    .header h1 {
      color: #1e40af;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .header p {
      color: #64748b;
      font-size: 14px;
    }
    .meta-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      padding: 15px;
      background: #f1f5f9;
      border-radius: 8px;
    }
    .meta-info div {
      font-size: 12px;
      color: #475569;
    }
    .meta-info strong {
      color: #1e293b;
      display: block;
      margin-bottom: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 11px;
    }
    thead {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
    }
    th {
      padding: 12px 8px;
      text-align: right;
      font-weight: 600;
      border: 1px solid #2563eb;
    }
    td {
      padding: 10px 8px;
      border: 1px solid #e2e8f0;
      text-align: right;
    }
    tbody tr:nth-child(even) {
      background-color: #f8fafc;
    }
    tbody tr:hover {
      background-color: #e0e7ff;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      font-size: 11px;
      color: #64748b;
    }
    .stats {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .stat-card {
      flex: 1;
      min-width: 150px;
      padding: 15px;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      border-radius: 8px;
      text-align: center;
    }
    .stat-card h3 {
      font-size: 24px;
      margin-bottom: 5px;
    }
    .stat-card p {
      font-size: 12px;
      opacity: 0.9;
    }
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏢 AMG Real Estate</h1>
    <p>تقرير ${typeNames[type]} - مجموعة أحمد الملاح للمقاولات والتشطيبات والتسويق العقاري</p>
  </div>

  <div class="meta-info">
    <div>
      <strong>📅 الفترة الزمنية:</strong>
      من ${new Date(dateRange.from).toLocaleDateString('ar-EG')} إلى ${new Date(dateRange.to).toLocaleDateString('ar-EG')}
    </div>
    <div>
      <strong>📊 إجمالي السجلات:</strong>
      ${data.length} سجل
    </div>
    <div>
      <strong>🕐 تاريخ التقرير:</strong>
      ${new Date().toLocaleString('ar-EG')}
    </div>
  </div>

  <div class="stats">
    <div class="stat-card">
      <h3>${data.length}</h3>
      <p>إجمالي ${typeNames[type]}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        ${headers.map(h => `<th>${h}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${data.map(row => `
        <tr>
          ${headers.map(h => `<td>${row[h] || '-'}</td>`).join('')}
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    <p><strong>AMG Real Estate</strong> - شركة رائدة في مجال التطوير العقاري والتسويق</p>
    <p>📧 info@amg-invest.com | 📱 +20 1000025080</p>
    <p style="margin-top: 10px; font-size: 10px;">هذا التقرير تم إنشاؤه تلقائياً من نظام إدارة AMG Real Estate</p>
  </div>
</body>
</html>
    `
  }

  const exportCategories = [
    {
      id: 'users',
      title: 'المستخدمين',
      icon: UserGroupIcon,
      description: 'تصدير بيانات جميع المستخدمين المسجلين',
      count: stats.totalUsers,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      id: 'properties',
      title: 'العقارات',
      icon: HomeIcon,
      description: 'تصدير بيانات جميع العقارات المضافة',
      count: stats.totalProperties,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      id: 'inquiries',
      title: 'الاستفسارات',
      icon: EnvelopeIcon,
      description: 'تصدير بيانات جميع استفسارات العملاء',
      count: stats.totalInquiries,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
    {
      id: 'subscriptions',
      title: 'الاشتراكات',
      icon: EnvelopeIcon,
      description: 'تصدير بيانات المشتركين في النشرة الإخبارية',
      count: stats.totalSubscriptions,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تصدير البيانات</h1>
          <p className="text-gray-600 mt-1">تصدير جميع بيانات الموقع بصيغ مختلفة</p>
        </div>
        <div className="flex items-center gap-2">
          <DocumentArrowDownIcon className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">إجمالي المستخدمين</p>
              <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
              <p className="text-blue-100 text-xs mt-1">+{stats.thisMonth.users} هذا الشهر</p>
            </div>
            <UserGroupIcon className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">إجمالي العقارات</p>
              <p className="text-3xl font-bold mt-2">{stats.totalProperties}</p>
              <p className="text-green-100 text-xs mt-1">+{stats.thisMonth.properties} هذا الشهر</p>
            </div>
            <HomeIcon className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">إجمالي الاستفسارات</p>
              <p className="text-3xl font-bold mt-2">{stats.totalInquiries}</p>
              <p className="text-purple-100 text-xs mt-1">{stats.pendingInquiries} في الانتظار</p>
            </div>
            <EnvelopeIcon className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">اشتراكات النشرة</p>
              <p className="text-3xl font-bold mt-2">{stats.totalSubscriptions}</p>
              <p className="text-orange-100 text-xs mt-1">نشطة</p>
            </div>
            <EnvelopeIcon className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">تحديد الفترة الزمنية</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">من تاريخ</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">إلى تاريخ</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Export Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {exportCategories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl shadow-lg border-2 ${category.borderColor} overflow-hidden`}
          >
            <div className={`${category.bgColor} p-6 border-b-2 ${category.borderColor}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-white rounded-xl shadow-sm`}>
                    <category.icon className={`w-8 h-8 ${category.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                </div>
                <div className={`text-3xl font-bold ${category.iconColor}`}>
                  {category.count}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {/* CSV Export */}
                <button
                  onClick={() => exportData(category.id as any, 'csv')}
                  disabled={exportLoading === `${category.id}-csv`}
                  className={`flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {exportLoading === `${category.id}-csv` ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">جاري التصدير...</span>
                    </>
                  ) : (
                    <>
                      <TableCellsIcon className="w-5 h-5" />
                      <span className="text-xs">CSV</span>
                    </>
                  )}
                </button>

                {/* JSON Export */}
                <button
                  onClick={() => exportData(category.id as any, 'json')}
                  disabled={exportLoading === `${category.id}-json`}
                  className={`flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {exportLoading === `${category.id}-json` ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">جاري التصدير...</span>
                    </>
                  ) : (
                    <>
                      <DocumentTextIcon className="w-5 h-5" />
                      <span className="text-xs">JSON</span>
                    </>
                  )}
                </button>

                {/* PDF Export */}
                <button
                  onClick={() => exportData(category.id as any, 'pdf')}
                  disabled={exportLoading === `${category.id}-pdf`}
                  className={`flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {exportLoading === `${category.id}-pdf` ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">جاري التصدير...</span>
                    </>
                  ) : (
                    <>
                      <DocumentArrowDownIcon className="w-5 h-5" />
                      <span className="text-xs">PDF</span>
                    </>
                  )}
                </button>
              </div>

              <div className={`text-xs text-gray-500 flex items-center gap-1 justify-center pt-2 border-t border-${category.color}-100`}>
                <ClockIcon className="w-4 h-4" />
                <span>سيتم تصدير البيانات من {dateRange.from} إلى {dateRange.to}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Export Info */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ArrowDownTrayIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 mb-2">معلومات التصدير</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>CSV:</strong> ملف جداول بيانات متوافق مع Excel وGoogle Sheets</li>
              <li>• <strong>JSON:</strong> ملف بيانات منسق للمطورين والتطبيقات</li>
              <li>• <strong>PDF:</strong> تقرير احترافي منسق وجاهز للطباعة مع شعار الشركة</li>
              <li>• يتم تصدير البيانات حسب الفترة المحددة أعلاه</li>
              <li>• جميع البيانات المصدرة محمية ومشفرة</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}