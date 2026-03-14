import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

function createClient(): PrismaClient {
  const connectionString =
    process.env.PRISMA_DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'PostgreSQL connection string not set. Add DATABASE_URL (or POSTGRES_URL / PRISMA_DATABASE_URL) to environment variables.'
    )
  }
  // Pass PoolConfig directly — avoids @types/pg version conflict with top-level pg package
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])
}

function getClient(): PrismaClient {
  if (!global.__prisma) global.__prisma = createClient()
  return global.__prisma
}

// Proxy defers construction to first request — avoids build-time instantiation
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    const client = getClient()
    const value = client[prop as keyof PrismaClient]
    return typeof value === 'function' ? (value as Function).bind(client) : value
  },
})
