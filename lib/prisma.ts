import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

function createClient(): PrismaClient {
  // Alias custom env var to DATABASE_URL that Prisma reads at runtime
  if (process.env.blocks_MONGODB_URI && !process.env.DATABASE_URL) {
    process.env.DATABASE_URL = process.env.blocks_MONGODB_URI
  }
  return new PrismaClient()
}

// Lazily initialize — avoids instantiation during Next.js build phase
function getClient(): PrismaClient {
  if (!global.__prisma) {
    global.__prisma = createClient()
    if (process.env.NODE_ENV !== 'production') {
      global.__prisma = global.__prisma
    }
  }
  return global.__prisma
}

// Proxy defers PrismaClient construction until first property access (request time)
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    const client = getClient()
    const value = client[prop as keyof PrismaClient]
    return typeof value === 'function' ? (value as Function).bind(client) : value
  },
})
