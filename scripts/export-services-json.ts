import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function exportServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' }
    });

    // حفظ كـ JSON
    fs.writeFileSync(
      'services-export.json',
      JSON.stringify(services, null, 2),
      'utf-8'
    );

    console.log(`✅ تم تصدير ${services.length} خدمة إلى services-export.json`);
    console.log('\nالخدمات المصدّرة:');
    services.forEach((s, i) => {
      console.log(`${i + 1}. ${s.slug}`);
    });

  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportServices();
