import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkPortfolioServices() {
  try {
    console.log('🔍 Checking portfolio items linked to services...\n')
    
    // Get all portfolio items
    const portfolioItems = await prisma.portfolioItem.findMany({
      select: {
        id: true,
        title: true,
        serviceId: true,
        showInServiceGallery: true,
        service: {
          select: {
            title: true,
            slug: true,
          }
        },
        images: {
          select: {
            url: true,
            order: true,
          },
          orderBy: {
            order: 'asc'
          },
          take: 1
        }
      },
      where: {
        serviceId: {
          not: null
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    if (portfolioItems.length === 0) {
      console.log('❌ No portfolio items are linked to any service!')
      console.log('\n💡 Tip: In admin panel, edit portfolio items and:')
      console.log('   1. Select a service from the dropdown')
      console.log('   2. Check "إظهار في معرض الخدمة"')
      console.log('')
    } else {
      console.log(`✅ Found ${portfolioItems.length} portfolio items linked to services:\n`)
      
      portfolioItems.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title}`)
        console.log(`   Service: ${item.service?.title} (${item.service?.slug})`)
        console.log(`   Show in Service Gallery: ${item.showInServiceGallery ? '✅ YES' : '❌ NO'}`)
        console.log(`   Has Images: ${item.images.length > 0 ? '✅ YES' : '❌ NO'}`)
        if (item.images.length > 0) {
          console.log(`   First Image: ${item.images[0].url.substring(0, 50)}...`)
        }
        console.log('')
      })
      
      // Group by service
      console.log('\n📊 Summary by Service:')
      const byService = portfolioItems.reduce((acc: any, item) => {
        const serviceName = item.service?.title || 'No Service'
        if (!acc[serviceName]) {
          acc[serviceName] = {
            total: 0,
            shown: 0,
            withImages: 0
          }
        }
        acc[serviceName].total++
        if (item.showInServiceGallery) acc[serviceName].shown++
        if (item.images.length > 0) acc[serviceName].withImages++
        return acc
      }, {})
      
      Object.entries(byService).forEach(([service, stats]: [string, any]) => {
        console.log(`\n${service}:`)
        console.log(`  Total items: ${stats.total}`)
        console.log(`  Shown in gallery: ${stats.shown}`)
        console.log(`  With images: ${stats.withImages}`)
      })
    }
    
    // Check all portfolio items (even without service)
    const allItems = await prisma.portfolioItem.count()
    const itemsWithService = portfolioItems.length
    console.log(`\n📈 Overall Stats:`)
    console.log(`  Total portfolio items: ${allItems}`)
    console.log(`  Linked to services: ${itemsWithService}`)
    console.log(`  Not linked: ${allItems - itemsWithService}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkPortfolioServices()
