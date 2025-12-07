import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixAllPortfolioImages() {
  try {
    console.log('🔧 Fixing all portfolio items without images...\n')
    
    // Get all portfolio items with mainImage but no images
    const items = await prisma.portfolioItem.findMany({
      where: {
        mainImage: {
          not: ''
        }
      },
      include: {
        images: true,
        service: {
          select: {
            title: true
          }
        }
      }
    })
    
    console.log(`Found ${items.length} portfolio items with main image\n`)
    
    let fixed = 0
    let skipped = 0
    
    for (const item of items) {
      if (item.images.length === 0 && item.mainImage) {
        console.log(`➕ Adding image for: ${item.title}`)
        
        await prisma.portfolioImage.create({
          data: {
            portfolioId: item.id,
            url: item.mainImage,
            publicId: item.mainImagePublicId || '',
            order: 0,
            alt: item.title
          }
        })
        
        fixed++
        console.log(`   ✅ Image added`)
      } else if (item.images.length > 0) {
        console.log(`⏭️  Skipped: ${item.title} (already has ${item.images.length} images)`)
        skipped++
      }
    }
    
    console.log(`\n📊 Summary:`)
    console.log(`   Total items: ${items.length}`)
    console.log(`   Fixed: ${fixed}`)
    console.log(`   Skipped (already have images): ${skipped}`)
    
    if (fixed > 0) {
      console.log(`\n✅ Successfully fixed ${fixed} portfolio items!`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixAllPortfolioImages()
