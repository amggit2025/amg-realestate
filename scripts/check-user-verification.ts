import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUserVerification() {
  const email = 'engmohamedmagdi5@gmail.com'
  
  console.log(`\n🔍 جاري البحث عن المستخدم: ${email}\n`)
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
        phoneVerified: true,
        verified: true,
        active: true,
        createdAt: true
      }
    })
    
    if (!user) {
      console.log('❌ المستخدم غير موجود في قاعدة البيانات')
      return
    }
    
    console.log('✅ تم العثور على المستخدم:')
    console.log('═══════════════════════════════════')
    console.log(`الاسم: ${user.firstName} ${user.lastName}`)
    console.log(`البريد الإلكتروني: ${user.email}`)
    console.log(`═══════════════════════════════════`)
    console.log(`📧 emailVerified: ${user.emailVerified ? '✅ موثق' : '❌ غير موثق'}`)
    console.log(`📱 phoneVerified: ${user.phoneVerified ? '✅ موثق' : '❌ غير موثق'}`)
    console.log(`✓ verified: ${user.verified ? '✅ نعم' : '❌ لا'}`)
    console.log(`🔓 active: ${user.active ? '✅ نشط' : '❌ معطل'}`)
    console.log(`📅 تاريخ التسجيل: ${user.createdAt.toLocaleDateString('ar-EG')}`)
    console.log('═══════════════════════════════════\n')
    
    if (!user.emailVerified) {
      console.log('💡 الحل: يجب تغيير emailVerified إلى true')
      console.log('   قم بتشغيل: npm run fix-email-verification\n')
    }
    
  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserVerification()
