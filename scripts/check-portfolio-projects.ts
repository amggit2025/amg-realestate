import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 التحقق من ربط الأعمال بالمشاريع...\n')

  try {
    // جلب مشروع بيت الوطن
    const baitAlwatanProject = await prisma.project.findFirst({
      where: {
        title: {
          contains: 'بيت الوطن'
        }
      }
    })

    if (!baitAlwatanProject) {
      console.log('❌ مشروع بيت الوطن غير موجود')
      return
    }

    console.log('✅ مشروع بيت الوطن:')
    console.log(`   ID: ${baitAlwatanProject.id}`)
    console.log(`   الاسم: ${baitAlwatanProject.title}\n`)

    // جلب كل الأعمال المرتبطة بهذا المشروع
    const linkedWorks = await prisma.portfolioItem.findMany({
      where: {
        projectId: baitAlwatanProject.id
      },
      select: {
        id: true,
        title: true,
        projectId: true,
        showInProject: true,
        published: true
      }
    })

    if (linkedWorks.length === 0) {
      console.log('⚠️ لا توجد أعمال مرتبطة بمشروع بيت الوطن')
      console.log('\n💡 جرب تعديل عمل موجود من الأدمن واختر مشروع بيت الوطن وفعّل الـ checkbox')
    } else {
      console.log(`✅ تم العثور على ${linkedWorks.length} عمل مرتبط بمشروع بيت الوطن:\n`)
      linkedWorks.forEach((work, index) => {
        console.log(`${index + 1}. ${work.title}`)
        console.log(`   🆔 ID: ${work.id}`)
        console.log(`   ${work.showInProject ? '✅ يظهر في صفحة المشروع' : '❌ لا يظهر في صفحة المشروع'}`)
        console.log(`   ${work.published ? '✅ منشور' : '❌ غير منشور'}`)
        console.log('')
      })
    }

    // التحقق من كل الأعمال
    console.log('\n📋 جميع الأعمال في قاعدة البيانات:')
    const allWorks = await prisma.portfolioItem.findMany({
      select: {
        id: true,
        title: true,
        projectId: true,
        showInProject: true
      }
    })

    allWorks.forEach((work, index) => {
      console.log(`\n${index + 1}. ${work.title}`)
      console.log(`   🆔 ID: ${work.id}`)
      console.log(`   🏗️ Project ID: ${work.projectId || 'غير مرتبط'}`)
      console.log(`   ${work.showInProject ? '✅ showInProject: true' : '❌ showInProject: false'}`)
    })

  } catch (error) {
    console.error('❌ خطأ:', error)
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
