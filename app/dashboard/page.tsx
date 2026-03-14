'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import WalletConnect from '@/components/WalletConnect'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Plus, ArrowRight, Circle, FileText, Code2,
  Rocket, TrendingUp, Users, Layers,
} from 'lucide-react'
import { formatNumber, formatAddress } from '@/lib/utils'

interface DashboardData {
  stats: { totalInstruments: number; totalSupply: string; totalInvestors: number; assetsUnderManagement: string }
  instruments: Array<{ id: string; name: string; type: string; supply: number; symbol: string; status: string }>
  contracts: Array<{ id: string; tokenContract: string | null; registryContract: string | null; treasuryContract: string | null; complianceContract: string | null; instrument: { name: string } | null; deployedAt: string }>
}

const TYPE_LABELS: Record<string, string> = {
  BOND: 'Bond', FIXED_DEPOSIT: 'Fixed Deposit', REAL_ESTATE_ASSET: 'Real Estate',
  PRIVATE_CREDIT: 'Private Credit', FUND_SHARES: 'Fund Shares',
}

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [walletSaved, setWalletSaved] = useState(false)

  useEffect(() => {
    const organizationId = localStorage.getItem('organizationId')
    const user = localStorage.getItem('user')
    if (!organizationId) { router.push('/signup'); return }
    if (user) {
      try { setUserName(JSON.parse(user).name || '') } catch { /* ignore */ }
    }
    fetch(`/api/dashboard?organizationId=${organizationId}`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [router])

  const handleWalletConnected = async (address: string) => {
    const organizationId = localStorage.getItem('organizationId')
    if (!organizationId || walletSaved) return
    await fetch('/api/wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, organizationId }),
    })
    setWalletSaved(true)
  }

  const stats = data?.stats ?? { totalInstruments: 0, totalSupply: '0', totalInvestors: 0, assetsUnderManagement: '$0' }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {userName ? `Welcome, ${userName.split(' ')[0]} 👋` : 'Dashboard'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Deploy and manage your tokenized financial instruments
          </p>
        </div>
        <Link href="/dashboard/instruments/create">
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-md whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            New Instrument
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Instruments', value: stats.totalInstruments, icon: Layers, color: 'from-blue-500 to-blue-600' },
              { label: 'Token Supply', value: stats.totalSupply, icon: TrendingUp, color: 'from-indigo-500 to-indigo-600' },
              { label: 'Investors', value: stats.totalInvestors, icon: Users, color: 'from-violet-500 to-violet-600' },
              { label: 'AUM', value: stats.assetsUnderManagement, icon: TrendingUp, color: 'from-emerald-500 to-emerald-600' },
            ].map((s) => {
              const Icon = s.icon
              return (
                <Card key={s.label} className="border-border">
                  <CardContent className="p-4">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-xl font-bold text-foreground">{loading ? '—' : (typeof s.value === 'number' ? formatNumber(s.value) : s.value)}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Instruments */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Instruments</CardTitle>
                <CardDescription className="text-xs">Your deployed tokenized products</CardDescription>
              </div>
              <Link href="/dashboard/instruments">
                <Button variant="ghost" size="sm" className="text-primary text-xs h-7">
                  All <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">{[1, 2].map((i) => <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />)}</div>
              ) : data?.instruments.length ? (
                <div className="space-y-2">
                  {data.instruments.map((inst) => (
                    <div key={inst.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-accent/30 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {inst.symbol.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{inst.name}</p>
                        <p className="text-xs text-muted-foreground">{formatNumber(inst.supply)} tokens · {TYPE_LABELS[inst.type] ?? inst.type}</p>
                      </div>
                      <Badge variant={inst.status === 'DEPLOYED' || inst.status === 'ACTIVE' ? 'success' : 'secondary'} className="text-xs">
                        {inst.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <FileText className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">No instruments yet</p>
                  <Link href="/dashboard/instruments/create">
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
                      <Rocket className="w-4 h-4 mr-1.5" /> Deploy First Instrument
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contracts */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Smart Contracts</CardTitle>
                <CardDescription className="text-xs">Deployed on-chain contract addresses</CardDescription>
              </div>
              <Link href="/dashboard/contracts">
                <Button variant="ghost" size="sm" className="text-primary text-xs h-7">
                  All <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">{[1].map((i) => <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />)}</div>
              ) : data?.contracts.length ? (
                <div className="space-y-3">
                  {data.contracts.slice(0, 2).map((c) => (
                    <div key={c.id} className="p-3 rounded-xl border border-border space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{c.instrument?.name ?? 'Instrument'}</p>
                        <Badge variant="success" className="text-[10px]">Live</Badge>
                      </div>
                      {[
                        { label: 'Token', val: c.tokenContract },
                        { label: 'Registry', val: c.registryContract },
                        { label: 'Treasury', val: c.treasuryContract },
                        { label: 'Compliance', val: c.complianceContract },
                      ].filter(x => x.val).map(({ label, val }) => (
                        <div key={label} className="flex items-center gap-2">
                          <Circle className="w-1.5 h-1.5 fill-green-500 text-green-500 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground w-16 flex-shrink-0">{label}</span>
                          <code className="text-xs font-mono text-foreground">{formatAddress(val!)}</code>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Code2 className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No contracts deployed yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Create an instrument to deploy contracts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar — Wallet */}
        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Wallet Connection</CardTitle>
              <CardDescription className="text-xs">
                Connect MetaMask to sign transactions and deploy contracts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WalletConnect onConnected={handleWalletConnected} />
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: 'Deploy New Instrument', href: '/dashboard/instruments/create', icon: Rocket, primary: true },
                { label: 'View All Instruments', href: '/dashboard/instruments', icon: FileText, primary: false },
                { label: 'View Contracts', href: '/dashboard/contracts', icon: Code2, primary: false },
              ].map((action) => {
                const Icon = action.icon
                return (
                  <Link key={action.href} href={action.href}>
                    <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      action.primary
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-sm'
                        : 'border border-border hover:bg-accent/50 text-foreground'
                    }`}>
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {action.label}
                    </button>
                  </Link>
                )
              })}
            </CardContent>
          </Card>

          {/* Alchemy network status */}
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-foreground">Network Status</span>
              </div>
              <div className="space-y-1.5">
                {['Ethereum', 'Polygon', 'Base'].map((net) => (
                  <div key={net} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{net}</span>
                    <span className="text-xs text-green-600 font-medium">Operational</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">Powered by Alchemy</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
