import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateContractAddress } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId is required.' }, { status: 400 })
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

    // Create instrument and deploy contracts in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const instrument = await tx.instrument.create({
        data: {
          name,
          type,
          supply: BigInt(supply),
          symbol: symbol.toUpperCase(),
          minimumInvestment: minimumInvestment ? minimumInvestment : null,
          interestRate: interestRate ? interestRate : null,
          maturityDate: maturityDate ? new Date(maturityDate) : null,
          status: 'DEPLOYED',
          organizationId,
        },
      })

      // Simulate contract deployment
      const contract = await tx.contractDeployment.create({
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

      return { instrument, contract }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('POST instrument error:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
