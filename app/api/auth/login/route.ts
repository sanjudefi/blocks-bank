import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    })

    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, organizationId: user.organizationId },
      organization: user.organization,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Login error:', message)
    return NextResponse.json({ error: `Login failed: ${message}` }, { status: 500 })
  }
}
