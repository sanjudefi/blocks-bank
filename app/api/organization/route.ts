import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId is required.' }, { status: 400 })
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        wallets: true,
        _count: {
          select: {
            instruments: true,
            investors: true,
            contracts: true,
          },
        },
      },
    })

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found.' }, { status: 404 })
    }

    return NextResponse.json({ organization })
  } catch (error) {
    console.error('GET organization error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { organizationId, legalEntityName, website, adminWalletAddress, blockchain, logoUrl } = body

    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId is required.' }, { status: 400 })
    }

    const organization = await prisma.organization.update({
      where: { id: organizationId },
      data: {
        legalEntityName,
        website,
        blockchain,
        logoUrl,
      },
    })

    // If wallet address provided, save it
    if (adminWalletAddress) {
      await prisma.wallet.upsert({
        where: { address: adminWalletAddress },
        update: { organizationId },
        create: {
          address: adminWalletAddress,
          organizationId,
        },
      })
    }

    return NextResponse.json({ organization })
  } catch (error) {
    console.error('PUT organization error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
