// ======================================================
// 👤 AMG Real Estate - Profile Page Route
// ======================================================
import React from 'react'
import { Metadata } from 'next'
import ProfilePage from '@/components/features/ProfilePage'

// SEO Metadata
export const metadata: Metadata = {
  title: 'الملف الشخصي | AMG Real Estate',
  description: 'إدارة ملفك الشخصي ومعلوماتك وإعداداتك في موقع AMG العقاري',
  keywords: [
    'ملف شخصي',
    'إعدادات الحساب', 
    'AMG العقارية',
    'إدارة الحساب',
    'تعديل البيانات'
  ].join(', '),
  openGraph: {
    title: 'الملف الشخصي | AMG Real Estate',
    description: 'إدارة ملفك الشخصي ومعلوماتك وإعداداتك',
    type: 'website',
  },
  robots: {
    index: false, // Profile pages shouldn't be indexed
    follow: false
  }
}

const Profile = () => {
  return <ProfilePage />
}

export default Profile