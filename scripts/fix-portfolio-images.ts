import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixPortfolioImages() {
  try {
    console.log('🔧 Fixing portfolio images...\n')
    
    // Get portfolio item
    const item = await prisma.portfolioItem.findFirst({
      where: {
        title: {
          contains: 'فيلا فاخرة'
        }
      },
      include: {
        images: true
      }
    })
    
    if (!item) {
      console.log('❌ Portfolio item not found!')
      return
    }
    
    console.log(`Found: ${item.title}`)
    console.log(`Main Image: ${item.mainImage}`)
    console.log(`Current Images Count: ${item.images.length}`)
    
    if (item.mainImage && item.images.length === 0) {
      console.log('\n➕ Adding main image to images table...')
      
      await prisma.portfolioImage.create({
        data: {
          portfolioId: item.id,
          url: item.mainImage,
          publicId: item.mainImagePublicId || '',
          order: 0,
          alt: item.title
        }
      })
      
      console.log('✅ Image added successfully!')
      
      // Verify
      const updated = await prisma.portfolioItem.findUnique({
        where: { id: item.id },
        include: { images: true }
      })
      
      console.log(`\n✅ Updated Images Count: ${updated?.images.length}`)
      if (updated?.images && updated.images.length > 0) {
        console.log(`   First Image URL: ${updated.images[0].url}`)
      }
    } else if (item.images.length > 0) {
      console.log('\n✅ Portfolio item already has images!')
    } else {
      console.log('\n❌ No main image to add!')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixPortfolioImages()
