// ======================================================
// 🗄️ AMG Real Estate - Database Connection Setup
// ======================================================
// إعداد الاتصال بقاعدة البيانات باستخدام Prisma

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// ======================================================
// 🔧 وظائف مساعدة لقاعدة البيانات
// ======================================================

/**
 * اختبار الاتصال بقاعدة البيانات
 */
export async function testDatabaseConnection() {
  try {
    console.log('🔄 Attempting database connection...')
    
    // اختبار بسيط للاتصال
    await prisma.$executeRaw`SELECT 1`
    
    console.log('✅ Database connection successful!')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : error,
      code: (error as any)?.code,
      errno: (error as any)?.errno
    })
    return false
  }
}

/**
 * إغلاق الاتصال بقاعدة البيانات
 */
export async function closeDatabaseConnection() {
  await prisma.$disconnect()
}

export default prisma
