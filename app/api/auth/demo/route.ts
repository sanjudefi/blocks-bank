import { NextRequest, NextResponse } from 'next/server'
import { DEMO_USERS } from '@/lib/demo-users'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  const demo = DEMO_USERS.find((u) => u.email === email)
  if (!demo) {
    return NextResponse.json({ error: 'Demo user not found.' }, { status: 404 })
  }
  const { password: _pw, ...safeUser } = demo
  return NextResponse.json({ ...safeUser, isDemo: true })
}
