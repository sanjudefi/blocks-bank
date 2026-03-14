import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isDemoOrg, DEMO_INVESTORS } from '@/lib/demo-data'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId is required.' }, { status: 400 })
    }

    if (isDemoOrg(organizationId)) {
      return NextResponse.json({ investors: DEMO_INVESTORS[organizationId] ?? [] })
    }

    const isValidObjectId = /^[a-f\d]{24}$/i.test(organizationId)
    if (!isValidObjectId) {
      return NextResponse.json({ investors: [] })
    }

    const investors = await prisma.investor.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ investors })
  } catch (error) {
    console.error('GET investors error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
