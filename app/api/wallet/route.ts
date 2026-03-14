import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { address, organizationId } = body

    if (!address) {
      return NextResponse.json({ error: 'Wallet address is required.' }, { status: 400 })
    }

    const walletData: { address: string; organizationId?: string } = { address }
    if (organizationId) {
      walletData.organizationId = organizationId
    }

    const wallet = await prisma.wallet.upsert({
      where: { address },
      update: organizationId ? { organizationId } : {},
      create: walletData as { address: string; organizationId: string },
    })

    return NextResponse.json({ wallet })
  } catch (error) {
    console.error('POST wallet error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId is required.' }, { status: 400 })
    }

    const wallets = await prisma.wallet.findMany({
      where: { organizationId },
    })

    return NextResponse.json({ wallets })
  } catch (error) {
    console.error('GET wallet error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
