import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateOldListingRequests() {
  try {
    console.log('🔄 جاري تحديث طلبات التسويق القديمة...')

    // Get all requests without submittedBy using raw query
    const oldRequests = await prisma.$queryRaw`
      SELECT id, ownerEmail FROM property_listing_requests 
      WHERE submittedBy IS NULL
    ` as { id: string, ownerEmail: string }[]

    console.log(`📋 تم العثور على ${oldRequests.length} طلب قديم`)

    if (oldRequests.length === 0) {
      console.log('✅ جميع الطلبات محدثة بالفعل!')
      return
    }

    // For each old request, try to find the user by email
    let updated = 0
    let notFound = 0

    for (const request of oldRequests) {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: request.ownerEmail }
      })

      if (user) {
        // Update with user ID using raw query
        await prisma.$executeRaw`
          UPDATE property_listing_requests 
          SET submittedBy = ${user.id}
          WHERE id = ${request.id}
        `
        console.log(`✅ تم تحديث الطلب ${request.id} للمستخدم ${user.email}`)
        updated++
      } else {
        console.log(`⚠️  لم يتم العثور على مستخدم للطلب ${request.id} (${request.ownerEmail})`)
        notFound++
      }
    }

    console.log('\n📊 ملخص التحديث:')
    console.log(`✅ تم التحديث: ${updated}`)
    console.log(`⚠️  لم يتم العثور على المستخدم: ${notFound}`)
    console.log(`📋 الإجمالي: ${oldRequests.length}`)

  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateOldListingRequests()
