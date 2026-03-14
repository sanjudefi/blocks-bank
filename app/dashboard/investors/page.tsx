'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Users, Search, CheckCircle2, Clock, AlertCircle, Wallet } from 'lucide-react'
import { formatAddress } from '@/lib/utils'

interface Investor {
  id: string
  name: string
  email: string
  walletAddress: string | null
  kycStatus: string
  investedAmount?: number
  organizationId: string
  createdAt: string
}

const KYC_CONFIG: Record<string, { variant: 'success' | 'warning' | 'secondary'; label: string; icon: typeof CheckCircle2 }> = {
  APPROVED: { variant: 'success', label: 'KYC Approved', icon: CheckCircle2 },
  PENDING: { variant: 'warning', label: 'KYC Pending', icon: Clock },
  REVIEW: { variant: 'secondary', label: 'Under Review', icon: AlertCircle },
}

function formatUSD(amount: number) {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount}`
}

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<Investor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const organizationId =
      typeof window !== 'undefined' ? localStorage.getItem('organizationId') : null
    if (!organizationId) { setLoading(false); return }

    fetch(`/api/investors?organizationId=${organizationId}`)
      .then((r) => r.json())
      .then((data) => setInvestors(data.investors || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = investors.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase())
  )

  const approved = investors.filter((i) => i.kycStatus === 'APPROVED').length
  const pending = investors.filter((i) => i.kycStatus !== 'APPROVED').length
  const totalInvested = investors.reduce((acc, i) => acc + (i.investedAmount ?? 0), 0)

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Investors</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage whitelisted investors and KYC status
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Investors', value: investors.length, icon: Users, color: 'from-blue-500 to-blue-600' },
          { label: 'KYC Approved', value: approved, icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Pending KYC', value: pending, icon: Clock, color: 'from-amber-500 to-amber-600' },
          { label: 'Total Invested', value: formatUSD(totalInvested), icon: Wallet, color: 'from-violet-500 to-violet-600' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-border">
              <CardContent className="p-4">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-xl font-bold text-foreground">{loading ? '—' : stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search investors by name or email..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>All Investors</CardTitle>
          <CardDescription>{filtered.length} investor{filtered.length !== 1 ? 's' : ''} found</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />)}
            </div>
          ) : filtered.length > 0 ? (
            <div className="space-y-2">
              {filtered.map((investor) => {
                const kyc = KYC_CONFIG[investor.kycStatus] ?? KYC_CONFIG.PENDING
                const KycIcon = kyc.icon
                return (
                  <div
                    key={investor.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {investor.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{investor.name}</p>
                        <p className="text-xs text-muted-foreground">{investor.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap justify-end">
                      {investor.walletAddress ? (
                        <code className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground hidden sm:block">
                          {formatAddress(investor.walletAddress)}
                        </code>
                      ) : (
                        <span className="text-xs text-muted-foreground hidden sm:block">No wallet</span>
                      )}
                      {investor.investedAmount ? (
                        <span className="text-sm font-medium text-foreground">{formatUSD(investor.investedAmount)}</span>
                      ) : null}
                      <Badge variant={kyc.variant} className="gap-1 text-xs">
                        <KycIcon className="w-3 h-3" />
                        {kyc.label}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                {search ? 'No investors match your search' : 'No investors yet'}
              </p>
              <p className="text-muted-foreground text-sm">
                {search ? 'Try a different search term' : 'Investors will appear here once they are whitelisted on your smart contracts.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
