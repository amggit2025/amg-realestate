'use client'

import { useState, useEffect } from 'react'
import { 
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserIcon,
  ArrowPathIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

interface UserStats {
  totalProperties: number
  totalFavorites: number
  totalInquiries: number
}

interface User {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  avatar: string | null
  userType: 'INDIVIDUAL' | 'COMPANY'
  verified: boolean
  emailVerified: boolean
  phoneVerified: boolean
  active: boolean
  createdAt: string
  updatedAt: string
  stats: UserStats
}

interface UsersStats {
  total: number
  active: number
  verified: number
  individual: number
  company: number
}

interface UsersResponse {
  success: boolean
  message: string
  data: {
    users: User[]
    stats: UsersStats
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UsersStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'active' | 'inactive' | 'individual' | 'company'>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)

  // جلب المستخدمين
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users', {
        credentials: 'include'
      })

      if (response.ok) {
        const data: UsersResponse = await response.json()
        setUsers(data.data.users)
        setStats(data.data.stats)
        setError('')
      } else {
        setError('حدث خطأ أثناء جلب المستخدمين')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  // تحديث حالة المستخدم
  const updateUserStatus = async (userId: string, action: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ userId, action })
      })

      if (response.ok) {
        fetchUsers() // إعادة جلب البيانات
        setShowUserModal(false)
      } else {
        console.error('Failed to update user status')
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // فلترة المستخدمين
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'active' && user.active) ||
      (filterType === 'inactive' && !user.active) ||
      (filterType === 'individual' && user.userType === 'INDIVIDUAL') ||
      (filterType === 'company' && user.userType === 'COMPANY')

    return matchesSearch && matchesFilter
  })

  const getUserTypeLabel = (type: string) => {
    return type === 'INDIVIDUAL' ? 'فرد' : 'شركة'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل المستخدمين...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <UsersIcon className="h-8 w-8 ml-3 text-blue-600" />
                إدارة المستخدمين
              </h1>
              <p className="text-gray-600 mt-2">عرض وإدارة جميع مستخدمي الموقع</p>
            </div>
            <button
              onClick={fetchUsers}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <ArrowPathIcon className="h-5 w-5 ml-2" />
              تحديث
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center">
                <UsersIcon className="h-8 w-8 text-blue-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-gray-600">إجمالي المستخدمين</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                  <p className="text-gray-600">مستخدم نشط</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-blue-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.verified}</p>
                  <p className="text-gray-600">مستخدم محقق</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center">
                <UserIcon className="h-8 w-8 text-purple-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.individual}</p>
                  <p className="text-gray-600">مستخدم فردي</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-8 w-8 text-orange-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.company}</p>
                  <p className="text-gray-600">مستخدم شركة</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="البحث عن مستخدم بالاسم أو البريد الإلكتروني..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
              >
                <option value="all">جميع المستخدمين</option>
                <option value="active">المستخدمين النشطين</option>
                <option value="inactive">المستخدمين غير النشطين</option>
                <option value="individual">المستخدمين الأفراد</option>
                <option value="company">مستخدمين الشركات</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المستخدم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    النوع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإحصائيات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ التسجيل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatar ? (
                            <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <EnvelopeIcon className="h-4 w-4 ml-1" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <PhoneIcon className="h-4 w-4 ml-1" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.userType === 'INDIVIDUAL' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {user.userType === 'INDIVIDUAL' ? (
                          <UserIcon className="h-3 w-3 ml-1" />
                        ) : (
                          <BuildingOfficeIcon className="h-3 w-3 ml-1" />
                        )}
                        {getUserTypeLabel(user.userType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.active ? (
                            <CheckCircleIcon className="h-3 w-3 ml-1" />
                          ) : (
                            <XCircleIcon className="h-3 w-3 ml-1" />
                          )}
                          {user.active ? 'نشط' : 'غير نشط'}
                        </span>
                        {user.verified && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <CheckCircleIcon className="h-3 w-3 ml-1" />
                            محقق
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>العقارات: {user.stats.totalProperties}</div>
                        <div>المفضلة: {user.stats.totalFavorites}</div>
                        <div>الاستفسارات: {user.stats.totalInquiries}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 ml-1" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowUserModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <EyeIcon className="h-4 w-4 ml-1" />
                        عرض التفاصيل
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-4 text-center text-gray-600">
          عرض {filteredUsers.length} من أصل {users.length} مستخدم
        </div>

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">تفاصيل المستخدم</h2>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* User Info */}
                  <div className="flex items-center space-x-4">
                    {selectedUser.avatar ? (
                      <img 
                        className="h-20 w-20 rounded-full" 
                        src={selectedUser.avatar} 
                        alt={selectedUser.name} 
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                        <UserIcon className="h-10 w-10 text-gray-600" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h3>
                      <p className="text-gray-600">{selectedUser.email}</p>
                      {selectedUser.phone && <p className="text-gray-600">{selectedUser.phone}</p>}
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الحالة الحالية</label>
                      <div className="space-y-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          selectedUser.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedUser.active ? 'نشط' : 'غير نشط'}
                        </span>
                        {selectedUser.verified && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            محقق
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الإجراءات</label>
                      <div className="space-y-2">
                        {selectedUser.active ? (
                          <button
                            onClick={() => updateUserStatus(selectedUser.id, 'deactivate')}
                            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            إلغاء التفعيل
                          </button>
                        ) : (
                          <button
                            onClick={() => updateUserStatus(selectedUser.id, 'activate')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            تفعيل الحساب
                          </button>
                        )}
                        
                        {!selectedUser.verified && (
                          <button
                            onClick={() => updateUserStatus(selectedUser.id, 'verify')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            تحقق من الحساب
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">إحصائيات المستخدم</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{selectedUser.stats.totalProperties}</p>
                        <p className="text-gray-600">العقارات</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{selectedUser.stats.totalFavorites}</p>
                        <p className="text-gray-600">المفضلة</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{selectedUser.stats.totalInquiries}</p>
                        <p className="text-gray-600">الاستفسارات</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">التواريخ المهمة</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">تاريخ التسجيل:</span>
                        <span className="font-medium">{formatDate(selectedUser.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">آخر تحديث:</span>
                        <span className="font-medium">{formatDate(selectedUser.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  )
}