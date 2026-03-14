import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json()
    if (!address || typeof address !== 'string') {
      return NextResponse.json({ error: 'Wallet address is required.' }, { status: 400 })
    }

    const normalizedAddress = address.toLowerCase()

    // Find a wallet linked to an organization
    const wallet = await prisma.wallet.findFirst({
      where: { address: { equals: normalizedAddress, mode: 'insensitive' } },
      include: {
        organization: {
          include: { users: { take: 1 } },
        },
      },
    }).catch(() => null)

    if (wallet?.organization) {
      const org = wallet.organization
      const user = org.users[0]
      return NextResponse.json({
        user: {
          id: user?.id ?? org.id,
          email: user?.email ?? `wallet@${normalizedAddress.slice(0, 6)}.eth`,
          name: org.name,
          organizationId: org.id,
          walletAddress: address,
        },
        organization: org,
      })
    }

    // No existing account — create a wallet-only session (in-memory, no DB write for demo)
    return NextResponse.json({
      user: {
        id: `wallet-${normalizedAddress.slice(2, 10)}`,
        email: `${normalizedAddress.slice(0, 8)}@wallet.eth`,
        name: `Wallet ${address.slice(0, 6)}...${address.slice(-4)}`,
        organizationId: '',
        walletAddress: address,
      },
    })
  } catch (error) {
    console.error('Wallet auth error:', error)
    return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 })
  }
}
