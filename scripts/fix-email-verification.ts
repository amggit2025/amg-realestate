import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixEmailVerification() {
  const email = 'engmohamedmagdi5@gmail.com'
  
  console.log(`\n🔧 جاري إصلاح حالة التوثيق للمستخدم: ${email}\n`)
  
  try {
    // Update the user
    const user = await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        verified: true
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
        verified: true
      }
    })
    
    console.log('✅ تم التحديث بنجاح!')
    console.log('═══════════════════════════════════')
    console.log(`الاسم: ${user.firstName} ${user.lastName}`)
    console.log(`البريد الإلكتروني: ${user.email}`)
    console.log(`═══════════════════════════════════`)
    console.log(`📧 emailVerified: ${user.emailVerified ? '✅ موثق' : '❌ غير موثق'}`)
    console.log(`✓ verified: ${user.verified ? '✅ نعم' : '❌ لا'}`)
    console.log('═══════════════════════════════════\n')
    console.log('✨ الآن يمكنك تحديث الصفحة ولن تظهر رسالة تأكيد البريد الإلكتروني\n')
    
  } catch (error: any) {
    if (error.code === 'P2025') {
      console.error('❌ المستخدم غير موجود في قاعدة البيانات')
    } else {
      console.error('❌ خطأ:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

fixEmailVerification()
