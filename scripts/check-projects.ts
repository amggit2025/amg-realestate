import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 التحقق من المشاريع في قاعدة البيانات...\n')

  try {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        location: true,
        status: true,
        published: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (projects.length === 0) {
      console.log('❌ لا توجد مشاريع في قاعدة البيانات')
    } else {
      console.log(`✅ تم العثور على ${projects.length} مشروع:\n`)
      projects.forEach((project, index) => {
        console.log(`${index + 1}. ${project.title}`)
        console.log(`   📍 الموقع: ${project.location}`)
        console.log(`   🏗️ الحالة: ${project.status}`)
        console.log(`   ${project.published ? '✅ منشور' : '❌ غير منشور'}`)
        console.log(`   🆔 ID: ${project.id}`)
        console.log(`   📅 تاريخ الإضافة: ${project.createdAt.toLocaleString('ar-EG')}`)
        console.log('')
      })
    }
  } catch (error) {
    console.error('❌ خطأ في الاتصال بقاعدة البيانات:', error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
