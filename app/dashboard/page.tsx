'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Code2,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
  Circle,
  AlertCircle,
} from 'lucide-react'
import { formatNumber, formatAddress } from '@/lib/utils'

interface DashboardData {
  stats: {
    totalInstruments: number
    totalSupply: string
    totalInvestors: number
    assetsUnderManagement: string
  }
  instruments: Array<{
    id: string
    name: string
    type: string
    supply: string
    symbol: string
    status: string
  }>
  contracts: Array<{
    id: string
    tokenContract: string | null
    registryContract: string | null
    treasuryContract: string | null
    complianceContract: string | null
    instrument: { name: string } | null
    deployedAt: string
  }>
  investors: Array<{
    id: string
    name: string
    email: string
    walletAddress: string | null
    createdAt: string
  }>
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { variant: 'default' | 'secondary' | 'success' | 'warning' | 'outline'; label: string }> = {
    DRAFT: { variant: 'secondary', label: 'Draft' },
    DEPLOYED: { variant: 'success', label: 'Deployed' },
    ACTIVE: { variant: 'success', label: 'Active' },
    PAUSED: { variant: 'warning', label: 'Paused' },
    CLOSED: { variant: 'outline', label: 'Closed' },
  }
  const config = variants[status] || { variant: 'secondary' as const, label: status }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

function InstrumentTypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    BOND: 'Bond',
    FIXED_DEPOSIT: 'Fixed Deposit',
    REAL_ESTATE_ASSET: 'Real Estate',
    PRIVATE_CREDIT: 'Private Credit',
    FUND_SHARES: 'Fund Shares',
  }
  return (
    <Badge variant="outline" className="font-normal">
      {labels[type] || type}
    </Badge>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const organizationId =
      typeof window !== 'undefined' ? localStorage.getItem('organizationId') : null
    if (!organizationId) {
      setLoading(false)
      return
    }

    fetch(`/api/dashboard?organizationId=${organizationId}`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats = data?.stats || {
    totalInstruments: 0,
    totalSupply: '0',
    totalInvestors: 0,
    assetsUnderManagement: '$0',
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Overview of your tokenized financial instruments
          </p>
        </div>
        <Link href="/dashboard/instruments/create">
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Create Instrument
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: 'Total Instruments',
            value: loading ? '—' : formatNumber(stats.totalInstruments),
            icon: FileText,
            color: 'from-blue-500 to-blue-600',
            bg: 'from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10',
          },
          {
            title: 'Total Token Supply',
            value: loading ? '—' : stats.totalSupply,
            icon: TrendingUp,
            color: 'from-indigo-500 to-indigo-600',
            bg: 'from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-900/10',
          },
          {
            title: 'Investors',
            value: loading ? '—' : formatNumber(stats.totalInvestors),
            icon: Users,
            color: 'from-violet-500 to-violet-600',
            bg: 'from-violet-50 to-violet-100/50 dark:from-violet-900/20 dark:to-violet-900/10',
          },
          {
            title: 'Assets Under Management',
            value: loading ? '—' : stats.assetsUnderManagement,
            icon: TrendingUp,
            color: 'from-emerald-500 to-emerald-600',
            bg: 'from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10',
          },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className={`border-border bg-gradient-to-br ${stat.bg}`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Instruments */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg">Instruments</CardTitle>
                <CardDescription>Your tokenized financial instruments</CardDescription>
              </div>
              <Link href="/dashboard/instruments">
                <Button variant="ghost" size="sm" className="text-primary">
                  View all <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
                  ))}
                </div>
              ) : data?.instruments && data.instruments.length > 0 ? (
                <div className="space-y-2">
                  {data.instruments.map((instrument) => (
                    <div
                      key={instrument.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                          {instrument.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{instrument.name}</p>
                          <p className="text-xs text-muted-foreground">{formatNumber(Number(instrument.supply))} tokens</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <InstrumentTypeBadge type={instrument.type} />
                        <StatusBadge status={instrument.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm mb-4">No instruments yet</p>
                  <Link href="/dashboard/instruments/create">
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
                      <Plus className="w-4 h-4 mr-1" />
                      Create Instrument
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contracts */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg">Smart Contracts</CardTitle>
                <CardDescription>Deployed contract addresses</CardDescription>
              </div>
              <Link href="/dashboard/contracts">
                <Button variant="ghost" size="sm" className="text-primary">
                  View all <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
                  ))}
                </div>
              ) : data?.contracts && data.contracts.length > 0 ? (
                <div className="space-y-3">
                  {data.contracts.slice(0, 2).map((contract) => (
                    <div key={contract.id} className="p-4 rounded-lg border border-border space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{contract.instrument?.name || 'Unknown Instrument'}</p>
                        <Badge variant="success">Deployed</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Token', value: contract.tokenContract },
                          { label: 'Registry', value: contract.registryContract },
                          { label: 'Treasury', value: contract.treasuryContract },
                          { label: 'Compliance', value: contract.complianceContract },
                        ].map((c) => c.value && (
                          <div key={c.label} className="flex items-center gap-2">
                            <Circle className="w-2 h-2 text-green-500 fill-green-500 flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">{c.label}:</span>
                            <code className="text-xs font-mono text-foreground truncate">{formatAddress(c.value)}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Code2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">No contracts deployed yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Create an instrument to deploy contracts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Investors */}
        <div>
          <Card className="border-border h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Investors</CardTitle>
                  <CardDescription>Connected investors</CardDescription>
                </div>
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
                  ))}
                </div>
              ) : data?.investors && data.investors.length > 0 ? (
                <div className="space-y-2">
                  {data.investors.map((investor) => (
                    <div key={investor.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {investor.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{investor.name}</p>
                        {investor.walletAddress && (
                          <p className="text-xs text-muted-foreground font-mono">{formatAddress(investor.walletAddress)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">No investors yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Investors will appear here once they connect</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Getting started banner (shown when no instruments) */}
      {!loading && (!data?.instruments || data.instruments.length === 0) && (
        <Card className="mt-6 border-border bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/10 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Get started with your first instrument</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first tokenized financial instrument to begin issuing tokens to investors.
                </p>
                <Link href="/dashboard/instruments/create">
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
                    Create Instrument
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}
