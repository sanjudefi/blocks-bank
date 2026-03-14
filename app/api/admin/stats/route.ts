import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const adminPass = req.headers.get('x-admin-pass')
  if (!adminPass || adminPass !== process.env.ADMIN_PASS) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const [users, organizations, instruments, contracts] = await Promise.all([
      prisma.user.findMany({ select: { id: true, email: true, name: true, createdAt: true, organizationId: true } }),
      prisma.organization.findMany({ select: { id: true, name: true, type: true, country: true, blockchain: true, createdAt: true } }),
      prisma.instrument.findMany({ select: { id: true, name: true, type: true, supply: true, symbol: true, status: true, organizationId: true } }),
      prisma.contractDeployment.findMany({ select: { id: true, tokenContract: true, organizationId: true, deployedAt: true } }),
    ])

    return NextResponse.json({ users, organizations, instruments, contracts })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
