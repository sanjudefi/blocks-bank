'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Building2, Users, FileText, Code2, Shield, LogOut,
  TrendingUp, Globe, Landmark, PieChart, Home, Banknote,
  Grid3X3, RefreshCw,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const ORG_TYPE_LABELS: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  BANK: { label: 'Bank', icon: Landmark, color: 'from-blue-500 to-blue-700' },
  HEDGE_FUND: { label: 'Hedge Fund', icon: TrendingUp, color: 'from-emerald-500 to-emerald-700' },
  ASSET_MANAGER: { label: 'Asset Manager', icon: PieChart, color: 'from-violet-500 to-violet-700' },
  REAL_ESTATE_COMPANY: { label: 'Real Estate', icon: Home, color: 'from-orange-500 to-orange-700' },
  PRIVATE_CREDIT_FIRM: { label: 'Private Credit', icon: Banknote, color: 'from-rose-500 to-rose-700' },
  INVESTMENT_PLATFORM: { label: 'Investment Platform', icon: Globe, color: 'from-cyan-500 to-cyan-700' },
  OTHER: { label: 'Other', icon: Grid3X3, color: 'from-slate-500 to-slate-700' },
}

interface AdminData {
  users: Array<{ id: string; email: string; name: string | null; createdAt: string; organizationId: string | null }>
  organizations: Array<{ id: string; name: string; type: string; country: string; blockchain: string | null; createdAt: string }>
  instruments: Array<{ id: string; name: string; type: string; supply: number; symbol: string; status: string; organizationId: string }>
  contracts: Array<{ id: string; tokenContract: string | null; organizationId: string; deployedAt: string }>
}

export default function AdminPage() {
  const router = useRouter()
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchStats = async (pass: string) => {
    setLoading(true); setError('')
    const res = await fetch('/api/admin/stats', { headers: { 'x-admin-pass': pass } })
    if (res.status === 401) { router.push('/admin/login'); return }
    if (!res.ok) { setError('Failed to load admin data.'); setLoading(false); return }
    setData(await res.json())
    setLoading(false)
  }

  useEffect(() => {
    const pass = localStorage.getItem('adminPass')
    if (!pass) { router.push('/admin/login'); return }
    fetchStats(pass)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const logout = () => { localStorage.removeItem('adminPass'); router.push('/admin/login') }

  return (
    <div className="min-h-screen bg-background">
      {/* Topbar */}
      <header className="h-14 border-b border-border bg-card flex items-center px-6 gap-4">
        <Link href="/" className="mr-4">
          <Image src="/logo-full.svg" alt="Blocks Bank" width={120} height={36} className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700">
          <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Admin Panel</span>
        </div>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" onClick={() => { const p = localStorage.getItem('adminPass') || ''; fetchStats(p) }}>
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
        <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground">
          <LogOut className="w-4 h-4 mr-1" /> Logout
        </Button>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Overview</h1>
          <p className="text-muted-foreground text-sm">All organizations, users, and instruments across Blocks Bank.</p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 text-sm text-red-600">{error}</div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: data?.users.length ?? '—', icon: Users, color: 'from-blue-500 to-blue-600' },
            { label: 'Organizations', value: data?.organizations.length ?? '—', icon: Building2, color: 'from-indigo-500 to-indigo-600' },
            { label: 'Instruments', value: data?.instruments.length ?? '—', icon: FileText, color: 'from-violet-500 to-violet-600' },
            { label: 'Contracts Deployed', value: data?.contracts.length ?? '—', icon: Code2, color: 'from-emerald-500 to-emerald-600' },
          ].map((s) => {
            const Icon = s.icon
            return (
              <Card key={s.label} className="border-border">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{loading ? '…' : s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Organizations */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Organizations</CardTitle>
              <CardDescription>All registered institutions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 max-h-80 overflow-y-auto">
              {loading ? (
                [1, 2, 3].map((i) => <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />)
              ) : data?.organizations.length ? (
                data.organizations.map((org) => {
                  const t = ORG_TYPE_LABELS[org.type]
                  const Icon = t?.icon ?? Grid3X3
                  return (
                    <div key={org.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/40 transition-colors">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${t?.color ?? 'from-slate-500 to-slate-600'} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{org.name}</p>
                        <p className="text-xs text-muted-foreground">{org.country} · {t?.label}</p>
                      </div>
                      {org.blockchain && <Badge variant="outline" className="text-[10px]">{org.blockchain}</Badge>}
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No organizations yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Users */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Users</CardTitle>
              <CardDescription>All registered accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 max-h-80 overflow-y-auto">
              {loading ? (
                [1, 2, 3].map((i) => <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />)
              ) : data?.users.length ? (
                data.users.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/40 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                      {(u.name || u.email).slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{u.name || '—'}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No users yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Instruments */}
          <Card className="border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">All Instruments</CardTitle>
              <CardDescription>Tokenized instruments across all organizations</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />)}</div>
              ) : data?.instruments.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground border-b border-border">
                        <th className="pb-2 font-medium">Name</th>
                        <th className="pb-2 font-medium">Symbol</th>
                        <th className="pb-2 font-medium">Type</th>
                        <th className="pb-2 font-medium text-right">Supply</th>
                        <th className="pb-2 font-medium text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {data.instruments.map((inst) => (
                        <tr key={inst.id} className="hover:bg-accent/30 transition-colors">
                          <td className="py-2.5 font-medium text-foreground">{inst.name}</td>
                          <td className="py-2.5"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">${inst.symbol}</code></td>
                          <td className="py-2.5 text-muted-foreground">{inst.type.replace('_', ' ')}</td>
                          <td className="py-2.5 text-right text-muted-foreground">{inst.supply.toLocaleString()}</td>
                          <td className="py-2.5 text-right">
                            <Badge variant={inst.status === 'DEPLOYED' || inst.status === 'ACTIVE' ? 'success' : 'secondary'}>
                              {inst.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No instruments deployed yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
