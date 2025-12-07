import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkPortfolioImages() {
  try {
    console.log('🔍 Checking portfolio item: فيلا فاخرة...\n')
    
    const item = await prisma.portfolioItem.findFirst({
      where: {
        title: {
          contains: 'فيلا فاخرة'
        }
      },
      include: {
        images: {
          orderBy: {
            order: 'asc'
          }
        },
        service: {
          select: {
            title: true,
            slug: true
          }
        }
      }
    })
    
    if (!item) {
      console.log('❌ Portfolio item not found!')
      return
    }
    
    console.log('📋 Portfolio Item Details:')
    console.log(`  ID: ${item.id}`)
    console.log(`  Title: ${item.title}`)
    console.log(`  Description: ${item.description}`)
    console.log(`  Service: ${item.service?.title}`)
    console.log(`  Show in Service Gallery: ${item.showInServiceGallery}`)
    console.log(`  Main Image: ${item.mainImage || 'None'}`)
    console.log(`  Main Image Public ID: ${item.mainImagePublicId || 'None'}`)
    console.log(`  Images Count: ${item.images.length}`)
    
    if (item.images.length > 0) {
      console.log('\n📷 Images:')
      item.images.forEach((img, i) => {
        console.log(`  ${i + 1}. ${img.url}`)
        console.log(`     Public ID: ${img.publicId}`)
        console.log(`     Order: ${img.order}`)
        console.log('')
      })
    } else {
      console.log('\n❌ NO IMAGES FOUND!')
      console.log('\n💡 Solution: Add images to this portfolio item in the admin panel')
      console.log('   URL: http://localhost:3000/admin/portfolio')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkPortfolioImages()
