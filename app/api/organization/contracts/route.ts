import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId is required.' }, { status: 400 })
    }

    const contracts = await prisma.contractDeployment.findMany({
      where: { organizationId },
      include: {
        instrument: {
          select: { name: true, symbol: true, type: true },
        },
      },
      orderBy: { deployedAt: 'desc' },
    })

    return NextResponse.json({ contracts })
  } catch (error) {
    console.error('GET contracts error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
