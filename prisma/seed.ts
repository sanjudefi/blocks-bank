import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])

async function main() {
  console.log('Seeding database...')

  // Create a demo organization
  const org = await prisma.organization.upsert({
    where: { id: 'demo-org-id' },
    update: {},
    create: {
      id: 'demo-org-id',
      name: 'Acme Capital Management',
      country: 'United States',
      type: 'ASSET_MANAGER',
      legalEntityName: 'Acme Capital Management LLC',
      website: 'https://acmecapital.example.com',
      blockchain: 'ETHEREUM',
    },
  })

  // Create demo instrument
  const instrument = await prisma.instrument.upsert({
    where: { id: 'demo-instrument-id' },
    update: {},
    create: {
      id: 'demo-instrument-id',
      name: 'Acme Capital Bond Series A',
      type: 'BOND',
      supply: BigInt(1_000_000),
      symbol: 'ACMEBND',
      minimumInvestment: 10000,
      interestRate: 5.5,
      maturityDate: new Date('2027-12-31'),
      status: 'ACTIVE',
      organizationId: org.id,
    },
  })

  // Create demo contracts
  await prisma.contractDeployment.upsert({
    where: { id: 'demo-contract-id' },
    update: {},
    create: {
      id: 'demo-contract-id',
      organizationId: org.id,
      instrumentId: instrument.id,
      tokenContract: '0x1234567890abcdef1234567890abcdef12345678',
      registryContract: '0xabcdef1234567890abcdef1234567890abcdef12',
      treasuryContract: '0x9876543210fedcba9876543210fedcba98765432',
      complianceContract: '0xfedcba9876543210fedcba9876543210fedcba98',
      transactionHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    },
  })

  console.log('Seeded:', { org: org.name, instrument: instrument.name })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
