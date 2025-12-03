import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    // التحقق من المصادقة
    const { isValid, admin } = await verifyAdminToken(req)
    if (!isValid || !admin) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      )
    }

    // اختبار الاتصال بقاعدة البيانات
    const startTime = Date.now()
    
    // تنفيذ استعلام بسيط
    await prisma.$queryRaw`SELECT 1`
    
    const responseTime = Date.now() - startTime

    // الحصول على معلومات قاعدة البيانات
    const dbUrl = process.env.DATABASE_URL || ''
    const urlMatch = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
    
    let dbInfo = {
      type: 'MySQL',
      host: 'Unknown',
      port: 'Unknown',
      database: 'Unknown',
    }

    if (urlMatch) {
      const [, , , host, port, database] = urlMatch
      dbInfo = {
        type: 'MySQL',
        host,
        port,
        database,
      }
    }

    // الحصول على عدد الجداول
    const tables = await prisma.$queryRaw<any[]>`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `

    return NextResponse.json({
      success: true,
      message: 'الاتصال بقاعدة البيانات ناجح',
      data: {
        connected: true,
        responseTime: `${responseTime}ms`,
        database: dbInfo,
        tablesCount: tables.length,
        tables: tables.map((t: any) => t.TABLE_NAME),
      }
    })

  } catch (error) {
    console.error('Database connection test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'فشل الاتصال بقاعدة البيانات',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
