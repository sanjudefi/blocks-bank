import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateContractAddress } from '@/lib/utils'
import { isDemoOrg, DEMO_INSTRUMENTS } from '@/lib/demo-data'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId is required.' }, { status: 400 })
    }

    if (isDemoOrg(organizationId)) {
      return NextResponse.json({ instruments: DEMO_INSTRUMENTS[organizationId] ?? [] })
    }

    const instruments = await prisma.instrument.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ instruments })
  } catch (error) {
    console.error('GET instruments error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name,
      type,
      supply,
      symbol,
      minimumInvestment,
      interestRate,
      maturityDate,
      organizationId,
    } = body

    if (!name || !type || !supply || !symbol || !organizationId) {
      return NextResponse.json(
        { error: 'name, type, supply, symbol, and organizationId are required.' },
        { status: 400 }
      )
    }

    // For demo orgs, return simulated success
    if (isDemoOrg(organizationId)) {
      const fakeId = `demo-inst-${Date.now()}`
      return NextResponse.json({
        instrument: { id: fakeId, name, type, supply: Number(supply), symbol, minimumInvestment: minimumInvestment ?? null, interestRate: interestRate ?? null, maturityDate: maturityDate ?? null, status: 'DEPLOYED', createdAt: new Date().toISOString() },
        contract: { id: `demo-ct-${Date.now()}`, tokenContract: generateContractAddress(), registryContract: generateContractAddress(), treasuryContract: generateContractAddress(), complianceContract: generateContractAddress(), transactionHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}` },
      }, { status: 201 })
    }

    const instrument = await prisma.instrument.create({
      data: {
        name,
        type,
        supply: Math.round(Number(supply)),
        symbol: symbol.toUpperCase(),
        minimumInvestment: minimumInvestment ? Number(minimumInvestment) : null,
        interestRate: interestRate ? Number(interestRate) : null,
        maturityDate: maturityDate ? new Date(maturityDate) : null,
        status: 'DEPLOYED',
        organizationId,
      },
    })

    // Simulate contract deployment
    const contract = await prisma.contractDeployment.create({
      data: {
        organizationId,
        instrumentId: instrument.id,
        tokenContract: generateContractAddress(),
        registryContract: generateContractAddress(),
        treasuryContract: generateContractAddress(),
        complianceContract: generateContractAddress(),
        transactionHash: `0x${Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('')}`,
      },
    })

    return NextResponse.json({ instrument, contract }, { status: 201 })
  } catch (error) {
    console.error('POST instrument error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
