import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

function createClient(): PrismaClient {
  const url = process.env.blocks_MONGODB_URI || process.env.DATABASE_URL
  if (!url) throw new Error('MongoDB connection string not set. Add blocks_MONGODB_URI to environment variables.')
  // Prisma v7: pass URL via datasourceUrl (replaces deprecated datasources option)
  return new PrismaClient({ datasourceUrl: url } as ConstructorParameters<typeof PrismaClient>[0])
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
