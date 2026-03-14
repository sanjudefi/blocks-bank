import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { organizationName, email, password, organizationType } = body

    if (!organizationName || !email || !password || !organizationType) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)

    const organization = await prisma.organization.create({
      data: { name: organizationName, country: 'Unknown', type: organizationType },
    })

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: organizationName,
        organizationId: organization.id,
      },
      select: { id: true, email: true, name: true, organizationId: true },
    })

    return NextResponse.json({ user, organization }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Signup error:', message)
    return NextResponse.json({ error: `Signup failed: ${message}` }, { status: 500 })
  }
}
