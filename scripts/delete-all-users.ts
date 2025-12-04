import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllUsers() {
  try {
    // عد المستخدمين قبل الحذف
    const count = await prisma.user.count();
    
    console.log(`🗑️  جاري حذف ${count} مستخدم...\n`);

    // حذف كل المستخدمين
    const result = await prisma.user.deleteMany({});

    console.log(`✅ تم حذف ${result.count} مستخدم بنجاح!`);
    console.log('✅ جدول المستخدمين فاضي الآن!');

  } catch (error: any) {
    console.error('❌ خطأ:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllUsers();
