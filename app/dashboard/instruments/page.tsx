'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, TrendingUp, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { formatNumber } from '@/lib/utils'

interface Instrument {
  id: string
  name: string
  type: string
  supply: string
  symbol: string
  minimumInvestment: string | null
  interestRate: string | null
  maturityDate: string | null
  status: string
  createdAt: string
}

const typeLabels: Record<string, string> = {
  BOND: 'Bond',
  FIXED_DEPOSIT: 'Fixed Deposit',
  REAL_ESTATE_ASSET: 'Real Estate',
  PRIVATE_CREDIT: 'Private Credit',
  FUND_SHARES: 'Fund Shares',
}

const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'success' | 'warning' | 'outline'; label: string }> = {
  DRAFT: { variant: 'secondary', label: 'Draft' },
  DEPLOYED: { variant: 'success', label: 'Deployed' },
  ACTIVE: { variant: 'success', label: 'Active' },
  PAUSED: { variant: 'warning', label: 'Paused' },
  CLOSED: { variant: 'outline', label: 'Closed' },
}

export default function InstrumentsPage() {
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const organizationId =
      typeof window !== 'undefined' ? localStorage.getItem('organizationId') : null
    if (!organizationId) {
      setLoading(false)
      return
    }

    fetch(`/api/instrument?organizationId=${organizationId}`)
      .then((r) => r.json())
      .then((data) => setInstruments(data.instruments || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = instruments.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.symbol.toLowerCase().includes(search.toLowerCase()) ||
      typeLabels[i.type]?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Instruments</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your tokenized financial instruments
          </p>
        </div>
        <Link href="/dashboard/instruments/create">
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Create Instrument
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search instruments by name, symbol, or type..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: instruments.length, color: 'text-foreground' },
          { label: 'Active', value: instruments.filter((i) => i.status === 'ACTIVE' || i.status === 'DEPLOYED').length, color: 'text-green-600' },
          { label: 'Draft', value: instruments.filter((i) => i.status === 'DRAFT').length, color: 'text-muted-foreground' },
        ].map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>All Instruments</CardTitle>
          <CardDescription>
            {filtered.length} instrument{filtered.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="space-y-2">
              {filtered.map((instrument) => {
                const status = statusConfig[instrument.status] || { variant: 'secondary' as const, label: instrument.status }
                return (
                  <div
                    key={instrument.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                        {instrument.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{instrument.name}</p>
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">
                            ${instrument.symbol}
                          </code>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-sm text-muted-foreground">
                            {formatNumber(Number(instrument.supply))} tokens
                          </span>
                          {instrument.interestRate && (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {instrument.interestRate}% APY
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-normal">
                        {typeLabels[instrument.type] || instrument.type}
                      </Badge>
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <Link href={`/dashboard/instruments/${instrument.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                {search ? 'No instruments match your search' : 'No instruments yet'}
              </p>
              <p className="text-muted-foreground text-sm mb-6">
                {search
                  ? 'Try a different search term'
                  : 'Create your first tokenized financial instrument to get started.'}
              </p>
              {!search && (
                <Link href="/dashboard/instruments/create">
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Instrument
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
