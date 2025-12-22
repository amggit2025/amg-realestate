import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateServices() {
  try {
    console.log('🔄 جاري نقل الخدمات من قاعدة البيانات المحلية...\n');

    // الخدمات الموجودة
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' }
    });

    if (services.length === 0) {
      console.log('❌ لا توجد خدمات في قاعدة البيانات المحلية!');
      console.log('💡 تأكد من أنك متصل بالداتا بيز المحلية في ملف .env');
      return;
    }

    console.log(`✅ تم العثور على ${services.length} خدمة\n`);

    // عرض الخدمات
    services.forEach((service, index) => {
      console.log(`${index + 1}. ${service.title}`);
      console.log(`   - Slug: ${service.slug}`);
      console.log(`   - الوصف: ${service.description?.substring(0, 50)}...`);
      console.log(`   - الحالة: ${service.published ? '✅ نشط' : '❌ غير نشط'}\n`);
    });

    console.log('\n📊 إحصائيات:');
    console.log(`   - إجمالي الخدمات: ${services.length}`);
    console.log(`   - الخدمات المنشورة: ${services.filter(s => s.published).length}`);
    console.log(`   - الخدمات المميزة: ${services.filter(s => s.featured).length}`);

    console.log('\n✅ البيانات جاهزة للنقل!');
    console.log('💾 احفظ هذه البيانات لنقلها للـ Railway Database');

  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateServices();
