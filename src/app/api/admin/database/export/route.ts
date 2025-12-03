import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import prisma from '@/lib/db'

const execAsync = promisify(exec)

export async function GET(req: NextRequest) {
  try {
    // التحقق من المصادقة (سوبر أدمن فقط)
    const { isValid, admin } = await verifyAdminToken(req)
    if (!isValid || !admin) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      )
    }

    if (admin.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, message: 'هذه العملية متاحة للسوبر أدمن فقط' },
        { status: 403 }
      )
    }

    // الحصول على معلومات الاتصال من .env
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      return NextResponse.json(
        { success: false, message: 'DATABASE_URL غير موجود' },
        { status: 500 }
      )
    }

    // استخراج معلومات الاتصال من URL
    // مثال: mysql://user:password@host:port/database
    const urlMatch = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
    if (!urlMatch) {
      return NextResponse.json(
        { success: false, message: 'صيغة DATABASE_URL غير صحيحة' },
        { status: 500 }
      )
    }

    const [, user, password, host, port, database] = urlMatch

    // إنشاء اسم الملف
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `${database}_backup_${timestamp}.sql`

    // محاولة استخدام mysqldump أولاً
    try {
      const backupsDir = path.join(process.cwd(), 'backups')
      if (!fs.existsSync(backupsDir)) {
        fs.mkdirSync(backupsDir, { recursive: true })
      }
      
      const filepath = path.join(backupsDir, filename)
      const command = `mysqldump -u ${user} -p${password} -h ${host} -P ${port} ${database} > "${filepath}"`
      
      await execAsync(command)
      
      // قراءة الملف
      const fileContent = fs.readFileSync(filepath, 'utf-8')
      
      // حذف الملف بعد القراءة
      fs.unlinkSync(filepath)
      
      // إرجاع الملف
      return new NextResponse(fileContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/sql',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
      
    } catch (mysqldumpError) {
      // في حالة فشل mysqldump، نستخدم Prisma للتصدير اليدوي
      console.log('mysqldump not available, using Prisma fallback...')
      
      // جلب schema من database
      const tables = await prisma.$queryRaw<any[]>`
        SELECT TABLE_NAME 
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = ${database}
      `
      
      let sqlContent = `-- AMG Real Estate Database Backup\n`
      sqlContent += `-- Generated: ${new Date().toISOString()}\n`
      sqlContent += `-- Database: ${database}\n\n`
      sqlContent += `SET FOREIGN_KEY_CHECKS=0;\n\n`
      
      // لكل جدول، نجيب الـ CREATE TABLE و الـ INSERT
      for (const table of tables) {
        const tableName = table.TABLE_NAME
        
        // جلب CREATE TABLE statement
        const createResult = await prisma.$queryRawUnsafe<any[]>(`SHOW CREATE TABLE \`${tableName}\``)
        if (createResult[0]) {
          sqlContent += `-- Table: ${tableName}\n`
          sqlContent += `DROP TABLE IF EXISTS \`${tableName}\`;\n`
          sqlContent += `${createResult[0]['Create Table']};\n\n`
        }
        
        // جلب البيانات
        const rows = await prisma.$queryRawUnsafe<any[]>(`SELECT * FROM \`${tableName}\``)
        
        if (rows.length > 0) {
          sqlContent += `-- Data for table: ${tableName}\n`
          
          for (const row of rows) {
            const columns = Object.keys(row).map(col => `\`${col}\``).join(', ')
            const values = Object.values(row).map(val => {
              if (val === null) return 'NULL'
              if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`
              if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`
              if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`
              return `'${val}'`
            }).join(', ')
            
            sqlContent += `INSERT INTO \`${tableName}\` (${columns}) VALUES (${values});\n`
          }
          
          sqlContent += `\n`
        }
      }
      
      sqlContent += `SET FOREIGN_KEY_CHECKS=1;\n`
      
      // إرجاع الملف
      return new NextResponse(sqlContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/sql',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
    }

  } catch (error) {
    console.error('Error exporting database:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ أثناء تصدير قاعدة البيانات',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
