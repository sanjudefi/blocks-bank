import { PrismaClient } from '@prisma/client'

if (process.env.blocks_MONGODB_URI && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.blocks_MONGODB_URI
}

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create a demo organization
  const org = await prisma.organization.create({
    data: {
      name: 'Acme Capital Management',
      country: 'United States',
      type: 'ASSET_MANAGER',
      legalEntityName: 'Acme Capital Management LLC',
      website: 'https://acmecapital.example.com',
      blockchain: 'ETHEREUM',
    },
  })

  // Create demo instrument
  const instrument = await prisma.instrument.create({
    data: {
      name: 'Acme Capital Bond Series A',
      type: 'BOND',
      supply: 1_000_000,
      symbol: 'ACMEBND',
      minimumInvestment: 10000,
      interestRate: 5.5,
      maturityDate: new Date('2027-12-31'),
      status: 'ACTIVE',
      organizationId: org.id,
    },
  })

  // Create demo contracts
  await prisma.contractDeployment.create({
    data: {
      organizationId: org.id,
      instrumentId: instrument.id,
      tokenContract: '0x1234567890abcdef1234567890abcdef12345678',
      registryContract: '0xabcdef1234567890abcdef1234567890abcdef12',
      treasuryContract: '0x9876543210fedcba9876543210fedcba98765432',
      complianceContract: '0xfedcba9876543210fedcba9876543210fedcba98',
    },
  })

  console.log('Seeded:', { org: org.name, instrument: instrument.name })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
