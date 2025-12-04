import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // بيانات الـ Admin
    const email = 'admin@amg-invest.com';
    const password = 'Admin@2025'; // غيّر الباسورد بعد كده!
    const username = 'superadmin';
    const firstName = 'Super';
    const lastName = 'Admin';

    // تشفير الباسورد
    const hashedPassword = await bcrypt.hash(password, 12);

    // إنشاء Admin
    const admin = await prisma.admin.create({
      data: {
        email,
        username,
        firstName,
        lastName,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        active: true,
      },
    });

    console.log('✅ Admin created successfully!');
    console.log('📧 Email:', email);
    console.log('👤 Username:', username);
    console.log('🔑 Password:', password);
    console.log('🎯 Role:', admin.role);
    console.log('\n⚠️  Please change the password after first login!');
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
