import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId is required.' }, { status: 400 })
    }

    // Fetch all data in parallel
    const [instruments, contracts, investors] = await Promise.all([
      prisma.instrument.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.contractDeployment.findMany({
        where: { organizationId },
        include: {
          instrument: { select: { name: true, symbol: true } },
        },
        orderBy: { deployedAt: 'desc' },
        take: 5,
      }),
      prisma.investor.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ])

    // Calculate total token supply
    const totalSupply = instruments.reduce(
      (acc, instrument) => acc + Number(instrument.supply),
      0
    )

    const stats = {
      totalInstruments: instruments.length,
      totalSupply: totalSupply > 1_000_000
        ? `${(totalSupply / 1_000_000).toFixed(1)}M`
        : totalSupply > 1_000
        ? `${(totalSupply / 1_000).toFixed(1)}K`
        : String(totalSupply),
      totalInvestors: investors.length,
      assetsUnderManagement: `$${(instruments.length * 50_000_000 / 1_000_000).toFixed(1)}M`,
    }

    return NextResponse.json({
      stats,
      instruments: instruments.map((i) => ({
        ...i,
        supply: String(i.supply),
        minimumInvestment: i.minimumInvestment?.toString() || null,
        interestRate: i.interestRate?.toString() || null,
      })),
      contracts,
      investors,
    })
  } catch (error) {
    console.error('GET dashboard error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
