'use client'

import type { Metadata } from "next";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { logger } from '@/lib/logger';
import { ToastProvider } from '@/lib/ToastContext';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [adminSession, setAdminSession] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuthentication();
  }, [pathname]); // إضافة pathname كـ dependency

  useEffect(() => {
    // تحديد الصفحة الحالية بناء على الـ pathname
    if (pathname === '/admin' || pathname === '/admin/') {
      setCurrentPage('dashboard');
    } else if (pathname === '/admin/users') {
      setCurrentPage('users');
    } else if (pathname === '/admin/properties/review') {
      setCurrentPage('properties-review');
    } else if (pathname.startsWith('/admin/portfolio')) {
      setCurrentPage('portfolio');
    } else if (pathname.startsWith('/admin/projects')) {
      setCurrentPage('projects');
    } else if (pathname.startsWith('/admin/services') && !pathname.includes('service-requests')) {
      setCurrentPage('services');
    } else if (pathname === '/admin/inquiries') {
      setCurrentPage('inquiries');
    } else if (pathname === '/admin/service-requests' || pathname.startsWith('/admin/service-requests/')) {
      setCurrentPage('service-requests');
    } else if (pathname === '/admin/listing-requests' || pathname.startsWith('/admin/listing-requests/')) {
      setCurrentPage('listing-requests');
    } else if (pathname === '/admin/subscriptions') {
      setCurrentPage('subscriptions');
    } else if (pathname === '/admin/testimonials') {
      setCurrentPage('testimonials');
    } else if (pathname === '/admin/general-info') {
      setCurrentPage('general-info');
    } else if (pathname === '/admin/about-page') {
      setCurrentPage('about-page');
    } else if (pathname === '/admin/reports') {
      setCurrentPage('reports');
    } else if (pathname === '/admin/admins') {
      setCurrentPage('admins');
    } else if (pathname === '/admin/settings') {
      setCurrentPage('settings');
    }
  }, [pathname]);

  // Debug logging for admin session changes (simplified)
  useEffect(() => {
    logger.log('AdminLayout - Page:', currentPage, 'Role:', adminSession?.role)
  }, [currentPage, adminSession]);

  const checkAuthentication = async () => {
    // إذا كنا في صفحة login، لا نحتاج للتحقق من الجلسة
    if (pathname === '/admin/login') {
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      // التحقق من الجلسة من خلال الـ API (server-side)
      const response = await fetch('/api/admin/session', {
        method: 'GET',
        credentials: 'include', // لإرسال الـ cookies
      });

      if (!response.ok) {
        // فشل التحقق - مسح البيانات وإعادة التوجيه
        setIsAuthenticated(false);
        localStorage.removeItem('amg_admin_session');
        router.push('/admin/login');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success && data.data?.admin) {
        setAdminSession(data.data.admin);
        setIsAuthenticated(true);
        
        // حفظ في localStorage كـ backup فقط (ليس للمصادقة)
        localStorage.setItem('amg_admin_session', JSON.stringify({
          admin: data.data.admin
        }));
      } else {
        // فشل التحقق - مسح البيانات وإعادة التوجيه
        setIsAuthenticated(false);
        localStorage.removeItem('amg_admin_session');
        router.push('/admin/login');
      }
    } catch (error) {
      logger.error('Authentication check failed:', error);
      setIsAuthenticated(false);
      localStorage.removeItem('amg_admin_session');
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // إذا كنا في صفحة login، نعرضها بدون sidebar
  if (pathname === '/admin/login') {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </ToastProvider>
    );
  }

  // باقي الصفحات تحتاج authentication
  if (!isAuthenticated) {
    return null; // سيتم إعادة التوجيه إلى صفحة تسجيل الدخول
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar 
        key="admin-sidebar"
        currentPage={currentPage}
        onPageChange={handlePageChange}
        adminRole={adminSession?.role || 'MODERATOR'}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:mr-[280px] min-h-screen">
        {/* Top Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="text-right">
                <h1 className="text-xl font-bold text-gray-900">
                  مرحباً، {adminSession?.name || 'الإدارة'}
                </h1>
                <p className="text-sm text-gray-500">
                  {adminSession?.role === 'SUPER_ADMIN' ? 'مدير عام' : 'مشرف'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 space-x-reverse">
              <button
                onClick={async () => {
                  try {
                    await fetch('/api/admin/logout', {
                      method: 'POST',
                      credentials: 'include',
                    });
                  } catch (error) {
                    logger.error('Logout error:', error);
                  }
                  localStorage.removeItem('amg_admin_session');
                  router.push('/admin/login');
                  router.refresh();
                }}
                className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-gray-900 transition-all"
              >
                تسجيل خروج
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </ToastProvider>
  );
}
