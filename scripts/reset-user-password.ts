import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetUserPassword() {
  try {
    // اعرض كل المستخدمين
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    });

    console.log('📋 المستخدمين الموجودين:\n');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   الاسم: ${user.firstName} ${user.lastName}`);
      console.log(`   تاريخ التسجيل: ${user.createdAt.toLocaleDateString('ar-EG')}\n`);
    });

    // هنا ضع email المستخدم اللي عاوز تغير باسورده
    const userEmail = 'YOUR_EMAIL_HERE'; // غيّر ده!
    const newPassword = 'NewPassword@2025'; // الباسورد الجديد

    if (userEmail === 'YOUR_EMAIL_HERE') {
      console.log('⚠️  من فضلك غيّر userEmail في الكود بالإيميل اللي عاوز تغير باسورده!');
      return;
    }

    // تشفير الباسورد الجديد
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // تحديث الباسورد
    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: { password: hashedPassword }
    });

    console.log('✅ تم تغيير الباسورد بنجاح!');
    console.log(`📧 Email: ${updatedUser.email}`);
    console.log(`🔑 الباسورد الجديد: ${newPassword}`);
    console.log('\n⚠️  احفظ الباسورد ده في مكان آمن!');

  } catch (error: any) {
    console.error('❌ خطأ:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetUserPassword();
