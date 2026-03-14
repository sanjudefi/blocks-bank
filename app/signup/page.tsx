'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Landmark, TrendingUp, PieChart, Home,
  Banknote, Globe, Grid3X3, Eye, EyeOff, Loader2,
  ArrowRight, ChevronLeft, Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DEMO_USERS } from '@/lib/demo-users'

const ORG_TYPES = [
  { value: 'BANK',                 label: 'Bank',              icon: Landmark,    color: 'from-blue-500 to-blue-700' },
  { value: 'HEDGE_FUND',           label: 'Hedge Fund',        icon: TrendingUp,  color: 'from-emerald-500 to-emerald-700' },
  { value: 'ASSET_MANAGER',        label: 'Asset Manager',     icon: PieChart,    color: 'from-violet-500 to-violet-700' },
  { value: 'REAL_ESTATE_COMPANY',  label: 'Real Estate',       icon: Home,        color: 'from-orange-500 to-orange-700' },
  { value: 'PRIVATE_CREDIT_FIRM',  label: 'Private Credit',    icon: Banknote,    color: 'from-rose-500 to-rose-700' },
  { value: 'INVESTMENT_PLATFORM',  label: 'Investment Platform', icon: Globe,     color: 'from-cyan-500 to-cyan-700' },
  { value: 'OTHER',                label: 'Other',             icon: Grid3X3,     color: 'from-slate-500 to-slate-700' },
]

type Tab = 'login' | 'signup'
type Step = 1 | 2

export default function SignupPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('signup')
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  // Signup form state
  const [orgType, setOrgType] = useState('')
  const [orgName, setOrgName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [metamaskLoading, setMetamaskLoading] = useState(false)

  const saveSession = (data: { user: object; organization: object }) => {
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('organizationId', (data.organization as { id: string }).id)
  }

  /* ── Login ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      saveSession(data)
      router.push('/dashboard')
    } catch { setError('Network error. Please try again.') }
    finally { setLoading(false) }
  }

  /* ── MetaMask login ── */
  const handleMetaMask = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      setError('MetaMask not found. Please install the MetaMask browser extension.')
      return
    }
    setMetamaskLoading(true); setError('')
    try {
      const accounts: string[] = await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
      const address = accounts[0]
      if (!address) { setError('No account selected in MetaMask.'); return }
      // Look up user by wallet address, or create a wallet-based session
      const res = await fetch('/api/auth/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Wallet login failed.'); return }
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('organizationId', data.user.organizationId || '')
      router.push('/dashboard')
    } catch (err: any) {
      if (err?.code === 4001) setError('MetaMask connection was rejected.')
      else setError('Failed to connect MetaMask.')
    } finally { setMetamaskLoading(false) }
  }

  /* ── Demo login ── */
  const handleDemo = async (demoEmail: string) => {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      localStorage.setItem('user', JSON.stringify({ id: data.id, email: data.email, name: data.name, organizationId: data.organizationId }))
      localStorage.setItem('organizationId', data.organizationId)
      router.push('/dashboard')
    } catch { setError('Failed to load demo.') }
    finally { setLoading(false) }
  }

  /* ── Signup ── */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationName: orgName, email, password, organizationType: orgType }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      saveSession(data)
      router.push('/onboarding')
    } catch { setError('Network error. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex w-2/5 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex-col justify-between p-12">
        <Link href="/">
          <Image src="/logo-full.svg" alt="Blocks Bank" width={160} height={48} className="h-11 w-auto brightness-0 invert" />
        </Link>

        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Tokenize financial assets<br />
            <span className="text-blue-400">in minutes.</span>
          </h2>
          <p className="text-blue-200 text-base leading-relaxed mb-10">
            Issue bonds, deposits, and fund shares as blockchain tokens —
            with automated compliance, custody, and settlement.
          </p>
          <div className="space-y-4">
            {[
              { icon: '⚡', text: 'Deploy smart contracts instantly' },
              { icon: '🔒', text: 'Built-in compliance & KYC controls' },
              { icon: '🌐', text: 'Ethereum, Polygon, Base & more' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <span className="text-lg">{f.icon}</span>
                <span className="text-blue-100 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-300/70 text-xs">
          © {new Date().getFullYear()} Blocks Bank — Open Financial Infrastructure
        </p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-background overflow-y-auto">
        <div className="w-full max-w-lg">

          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden mb-8">
            <Image src="/logo-full.svg" alt="Blocks Bank" width={140} height={42} className="h-10 w-auto" />
          </Link>

          {/* Tabs */}
          <div className="flex bg-muted rounded-xl p-1 mb-8">
            {(['login', 'signup'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); setStep(1) }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
                  tab === t
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* ══ LOGIN ══ */}
          {tab === 'login' && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
                <p className="text-muted-foreground text-sm mt-1">Sign in to your organization</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" placeholder="admin@yourorg.com" value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input type={showPw ? 'text' : 'password'} placeholder="••••••••"
                      value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                      required className="pr-10" />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 h-11" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                </Button>
              </form>

              {/* MetaMask */}
              <div>
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <button
                  onClick={handleMetaMask}
                  disabled={metamaskLoading || loading}
                  className="w-full flex items-center justify-center gap-2.5 border border-border rounded-xl h-11 text-sm font-medium hover:bg-accent/50 transition-colors disabled:opacity-50"
                >
                  {metamaskLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M36.4 3L22.1 13.6l2.6-6.1L36.4 3z" fill="#E2761B" stroke="#E2761B" strokeWidth=".5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3.6 3l14.2 10.7-2.5-6.2L3.6 3z" fill="#E4761B" stroke="#E4761B" strokeWidth=".5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M31 28.3l-3.8 5.8 8.1 2.2 2.3-7.9-6.6-.1z" fill="#E4761B" stroke="#E4761B" strokeWidth=".5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2.4 28.4l2.3 7.9 8.1-2.2-3.8-5.8-6.6.1z" fill="#E4761B" stroke="#E4761B" strokeWidth=".5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12.4 18.1l-2.2 3.4 7.9.4-.3-8.5-5.4 4.7z" fill="#E4761B" stroke="#E4761B" strokeWidth=".5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M27.6 18.1l-5.5-4.8-.2 8.6 7.9-.4-2.2-3.4z" fill="#E4761B" stroke="#E4761B" strokeWidth=".5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12.8 34.1l4.8-2.3-4.1-3.2-.7 5.5z" fill="#E4761B" stroke="#E4761B" strokeWidth=".5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22.4 31.8l4.8 2.3-.8-5.5-4 3.2z" fill="#E4761B" stroke="#E4761B" strokeWidth=".5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  <span>Connect with MetaMask</span>
                </button>
              </div>

              {/* Demo accounts */}
              <div>
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">Demo accounts</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {DEMO_USERS.map((u) => {
                    const OrgType = ORG_TYPES.find((o) => o.value === u.organization.type)
                    const Icon = OrgType?.icon ?? Grid3X3
                    return (
                      <button key={u.email} onClick={() => handleDemo(u.email)} disabled={loading}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border hover:border-primary hover:bg-accent/50 transition-all text-center group disabled:opacity-50">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${OrgType?.color ?? 'from-slate-500 to-slate-700'} flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-medium text-foreground leading-tight">{u.name}</span>
                        <span className="text-[10px] text-muted-foreground">{OrgType?.label}</span>
                      </button>
                    )
                  })}
                </div>
                <p className="text-center text-xs text-muted-foreground mt-3">
                  Password for all demo accounts: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">Demo1234!</code>
                </p>
              </div>
            </div>
          )}

          {/* ══ SIGNUP ══ */}
          {tab === 'signup' && (
            <div>
              {/* Step 1 — Org type */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">What type of organization?</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                      Select the category that best describes your institution.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ORG_TYPES.map((type) => {
                      const Icon = type.icon
                      const selected = orgType === type.value
                      return (
                        <button
                          key={type.value}
                          onClick={() => setOrgType(type.value)}
                          className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all text-center group ${
                            selected
                              ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                              : 'border-border hover:border-primary/50 hover:bg-accent/40'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-foreground leading-tight">{type.label}</span>
                          {selected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  <Button
                    onClick={() => { if (orgType) { setStep(2); setError('') } else setError('Please select an organization type.') }}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 h-11"
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}

              {/* Step 2 — Account details */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setStep(1)}
                      className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
                      <p className="text-muted-foreground text-sm mt-0.5">
                        {ORG_TYPES.find((o) => o.value === orgType)?.label} account
                      </p>
                    </div>
                  </div>

                  {/* Selected org type badge */}
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/60 border border-border">
                    {(() => {
                      const t = ORG_TYPES.find((o) => o.value === orgType)
                      const Icon = t?.icon ?? Grid3X3
                      return (
                        <>
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${t?.color} flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{t?.label}</span>
                        </>
                      )
                    })()}
                  </div>

                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Organization Name</Label>
                      <Input placeholder="First National Bank" value={orgName}
                        onChange={(e) => setOrgName(e.target.value)} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Email Address</Label>
                      <Input type="email" placeholder="admin@yourorg.com" value={email}
                        onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Password</Label>
                      <div className="relative">
                        <Input type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters"
                          value={password} onChange={(e) => setPassword(e.target.value)}
                          required minLength={8} className="pr-10" />
                        <button type="button" onClick={() => setShowPw(!showPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 h-11">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
