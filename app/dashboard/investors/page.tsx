'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Users, Search, CheckCircle2, Clock, AlertCircle, Wallet,
  Shield, ExternalLink, Upload, FileText, ChevronRight, X,
} from 'lucide-react'
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

const KYC_BADGE: Record<string, { variant: 'success' | 'warning' | 'secondary' | 'destructive'; label: string; icon: typeof CheckCircle2 }> = {
  APPROVED: { variant: 'success', label: 'KYC Approved', icon: CheckCircle2 },
  PENDING:  { variant: 'warning', label: 'KYC Pending', icon: Clock },
  REVIEW:   { variant: 'secondary', label: 'Under Review', icon: AlertCircle },
  REJECTED: { variant: 'destructive', label: 'KYC Rejected', icon: X },
}

const KYC_PROVIDERS = [
  {
    id: 'jumio',
    name: 'Jumio',
    logo: '🔵',
    tagline: 'AI-powered identity & biometric verification',
    tier: 'Enterprise',
    features: ['Document scan + OCR', 'Liveness detection', '200+ countries', 'AML watchlist'],
    color: 'from-blue-600 to-blue-700',
    tierColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    link: 'https://www.jumio.com',
  },
  {
    id: 'onfido',
    name: 'Onfido',
    logo: '🟢',
    tagline: 'Global document & facial biometric checks',
    tier: 'Standard',
    features: ['ID document OCR', 'Biometric matching', 'Real-time results', 'Fraud signals'],
    color: 'from-emerald-600 to-teal-700',
    tierColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    link: 'https://onfido.com',
  },
  {
    id: 'veriff',
    name: 'Veriff',
    logo: '🟣',
    tagline: 'Automated identity verification at scale',
    tier: 'Enterprise',
    features: ['10,000+ documents', 'Video verification', 'Watchlist screening', 'Risk scoring'],
    color: 'from-violet-600 to-purple-700',
    tierColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
    link: 'https://www.veriff.com',
  },
  {
    id: 'sumsub',
    name: 'Sumsub',
    logo: '🟠',
    tagline: 'All-in-one KYC, KYB & AML compliance',
    tier: 'Standard',
    features: ['KYC + KYB', 'Crypto AML', 'Ongoing monitoring', 'No-code flows'],
    color: 'from-orange-600 to-amber-700',
    tierColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    link: 'https://sumsub.com',
  },
]

function formatUSD(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<Investor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'investors' | 'kyc'>('investors')
  const [connectedProvider, setConnectedProvider] = useState<string | null>(null)

  useEffect(() => {
    const organizationId = typeof window !== 'undefined' ? localStorage.getItem('organizationId') : null
    if (!organizationId) { setLoading(false); return }
    fetch(`/api/investors?organizationId=${organizationId}`)
      .then((r) => r.json())
      .then((data) => setInvestors(data.investors || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = investors.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase())
  )

  const approved = investors.filter((i) => i.kycStatus === 'APPROVED').length
  const pending  = investors.filter((i) => i.kycStatus !== 'APPROVED').length
  const totalInvested = investors.reduce((acc, i) => acc + (i.investedAmount ?? 0), 0)

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Investors & KYC</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage verified investors and identity compliance</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-sm">
          <Users className="w-4 h-4 mr-2" /> Add Investor
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted rounded-xl p-1 mb-6 w-fit">
        {(['investors', 'kyc'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              activeTab === tab ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}>
            {tab === 'investors' ? 'Investor List' : 'KYC Providers'}
          </button>
        ))}
      </div>

      {/* ── INVESTORS TAB ── */}
      {activeTab === 'investors' && (
        <>
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
              placeholder="Search by name or email..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>All Investors</CardTitle>
              <CardDescription>{filtered.length} investor{filtered.length !== 1 ? 's' : ''}</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />)}
                </div>
              ) : filtered.length > 0 ? (
                <div className="space-y-2">
                  {filtered.map((investor) => {
                    const kyc = KYC_BADGE[investor.kycStatus] ?? KYC_BADGE.PENDING
                    const KycIcon = kyc.icon
                    return (
                      <div key={investor.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/30 transition-colors">
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
                            <span className="text-sm font-semibold text-foreground">{formatUSD(investor.investedAmount)}</span>
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
                    {search ? 'Try a different search term.' : 'Add investors and verify them through the KYC Providers tab.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* ── KYC PROVIDERS TAB ── */}
      {activeTab === 'kyc' && (
        <div className="space-y-6">
          {/* Info banner */}
          <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 p-5 flex items-start gap-4">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Connect a KYC Provider</p>
              <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">
                Link one of the verified identity providers below to automate investor onboarding. Once connected, investors receive a secure link to complete verification before receiving tokens.
              </p>
            </div>
          </div>

          {/* Provider cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {KYC_PROVIDERS.map((p) => (
              <Card key={p.id} className={`border-border transition-all ${connectedProvider === p.id ? 'ring-2 ring-emerald-500 border-emerald-300 dark:border-emerald-700' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{p.logo}</div>
                      <div>
                        <div className="font-bold text-foreground">{p.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{p.tagline}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.tierColor} border border-current/20`}>
                      {p.tier}
                    </span>
                  </div>

                  <ul className="space-y-1.5 mb-5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-2">
                    {connectedProvider === p.id ? (
                      <div className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-4 h-4" /> Connected
                      </div>
                    ) : (
                      <button
                        onClick={() => setConnectedProvider(p.id)}
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${p.color} hover:opacity-90 transition-opacity`}>
                        Connect {p.name}
                      </button>
                    )}
                    <a href={p.link} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Manual KYC */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-base">Manual KYC Submission</CardTitle>
              </div>
              <CardDescription>
                For jurisdictions or cases not covered by automated providers. Compliance team reviews within 24–48 hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Investor Full Name</label>
                  <input type="text" placeholder="e.g. Aisha Malik" className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Email Address</label>
                  <input type="email" placeholder="investor@fund.com" className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Wallet Address (optional)</label>
                <input type="text" placeholder="0x..." className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>

              {/* Document upload areas */}
              <div className="grid sm:grid-cols-3 gap-3">
                {['Government ID / Passport', 'Proof of Address', 'Corporate Documents'].map((doc) => (
                  <div key={doc} className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-blue-300 hover:bg-accent/30 transition-colors cursor-pointer">
                    <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs font-medium text-foreground">{doc}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">PDF, PNG, JPG</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-sm">
                  Submit for Review
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
                  Guidelines <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {['FATF Compliant', 'GDPR Protected', 'Encrypted Storage', '24h Review'].map((tag) => (
                  <span key={tag} className="text-[10px] font-medium bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
