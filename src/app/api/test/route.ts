// ======================================================
// 🧪 AMG Real Estate - Database Test API
// ======================================================
// API لاختبار الاتصال بقاعدة البيانات

import { NextRequest, NextResponse } from 'next/server'
import { testDatabaseConnection } from '@/lib/db'

export async function GET() {
  try {
    console.log('🧪 API Test Route Called')
    
    // اختبار الاتصال بقاعدة البيانات
    const isConnected = await testDatabaseConnection()
    
    if (isConnected) {
      console.log('✅ Test successful - returning success response')
      return NextResponse.json({
        success: true,
        message: 'Database connection successful! ✅',
        timestamp: new Date().toISOString(),
        database: 'amg_real_estate',
        status: 'Connected'
      })
    } else {
      console.log('❌ Test failed - returning error response')
      return NextResponse.json({
        success: false,
        message: 'Database connection failed! ❌',
        timestamp: new Date().toISOString(),
        status: 'Disconnected'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('💥 Database test API error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Database test error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      status: 'Error'
    }, { status: 500 })
  }
}
