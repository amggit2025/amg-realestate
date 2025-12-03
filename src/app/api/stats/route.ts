// ======================================================
// 🧪 AMG Real Estate - Quick Database Test
// ======================================================
// ملف لاختبار قاعدة البيانات بسرعة

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    console.log('📊 Getting database statistics...')
    
    let userCount = 0
    let propertyCount = 0
    let projectCount = 0
    let inquiryCount = 0
    let portfolioCount = 0

    // عد المستخدمين مع معالجة الأخطاء
    try {
      userCount = await prisma.user.count()
    } catch (error) {
      console.log('Users table not found or empty:', error)
    }
    
    // عد العقارات مع معالجة الأخطاء
    try {
      propertyCount = await prisma.property.count()
    } catch (error) {
      console.log('Properties table not found or empty:', error)
    }
    
    // عد المشاريع مع معالجة الأخطاء
    try {
      projectCount = await prisma.project.count()
    } catch (error) {
      console.log('Projects table not found or empty:', error)
    }
    
    // عد الاستفسارات مع معالجة الأخطاء
    try {
      inquiryCount = await prisma.inquiry.count()
    } catch (error) {
      console.log('Inquiries table not found or empty:', error)
    }

    // عد أعمال البورتفوليو مع معالجة الأخطاء
    try {
      portfolioCount = await prisma.portfolioItem.count()
    } catch (error) {
      console.log('Portfolio table not found or empty:', error)
    }

    const stats = {
      users: userCount,
      properties: propertyCount,
      projects: projectCount,
      inquiries: inquiryCount,
      portfolio: portfolioCount,
      total: userCount + propertyCount + projectCount + inquiryCount + portfolioCount
    }

    console.log('📊 Statistics:', stats)

    return NextResponse.json({
      success: true,
      message: 'Database statistics 📊',
      data: stats,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('💥 Database stats error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to get database statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
