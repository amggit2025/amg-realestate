import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkServices() {
  try {
    console.log('🔍 Checking services in database...\n')
    
    const services = await prisma.service.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    if (services.length === 0) {
      console.log('❌ No services found in database!')
      console.log('You need to create services first.\n')
    } else {
      console.log(`✅ Found ${services.length} services:\n`)
      services.forEach((service, index) => {
        console.log(`${index + 1}. ${service.title}`)
        console.log(`   Slug: ${service.slug}`)
        console.log(`   Published: ${service.published ? '✅ Yes' : '❌ No'}`)
        console.log(`   URL: /api/services/${service.slug}`)
        console.log('')
      })
    }
    
    console.log('\n📝 Expected slugs for services:')
    console.log('- furniture (الأثاث)')
    console.log('- finishing (التشطيبات)')
    console.log('- construction (المقاولات)')
    console.log('- marketing (التسويق العقاري)')
    console.log('- real-estate (العقارات)')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkServices()
