import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const request = await prisma.propertyListingRequest.findUnique({
    where: { id: 'cmjmv2dvc0009qqicegzr7mus' }
  })
  
  if (request) {
    console.log('=== Request Data ===')
    console.log('ID:', request.id)
    console.log('City:', request.city)
    console.log('Governorate:', request.governorate)
    console.log('Area:', request.area)
    console.log('Price:', request.price)
    console.log('Updated At:', request.updatedAt)
  } else {
    console.log('Request not found')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
