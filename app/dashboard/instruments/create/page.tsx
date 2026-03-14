'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft, Loader2, Rocket, CheckCircle2, Circle,
  Code2, Shield, Coins, BookOpen, ChevronDown, ChevronUp,
  Wifi, Lock,
} from 'lucide-react'
import Link from 'next/link'

const INSTRUMENT_TYPES = [
  { value: 'BOND', label: 'Bond', emoji: '📄', description: 'Fixed-income debt with periodic interest' },
  { value: 'FIXED_DEPOSIT', label: 'Fixed Deposit', emoji: '🏦', description: 'Time-locked deposit with guaranteed rate' },
  { value: 'REAL_ESTATE_ASSET', label: 'Real Estate', emoji: '🏢', description: 'Tokenized property or REIT share' },
  { value: 'PRIVATE_CREDIT', label: 'Private Credit', emoji: '💼', description: 'Direct lending to private companies' },
  { value: 'FUND_SHARES', label: 'Fund Shares', emoji: '📈', description: 'Tokenized investment fund units' },
]

const NETWORKS = [
  { value: 'sepolia', label: 'Ethereum Sepolia', badge: 'Testnet', color: 'text-blue-600', chainId: 11155111 },
  { value: 'amoy', label: 'Polygon Amoy', badge: 'Testnet', color: 'text-violet-600', chainId: 80002 },
  { value: 'base-sepolia', label: 'Base Sepolia', badge: 'Testnet', color: 'text-indigo-600', chainId: 84532 },
  { value: 'ethereum', label: 'Ethereum Mainnet', badge: 'Mainnet', color: 'text-orange-600', chainId: 1 },
  { value: 'polygon', label: 'Polygon Mainnet', badge: 'Mainnet', color: 'text-orange-600', chainId: 137 },
  { value: 'base', label: 'Base Mainnet', badge: 'Mainnet', color: 'text-orange-600', chainId: 8453 },
]

const DEPLOY_STEPS = [
  { icon: Coins, label: 'Token Contract', description: 'Deploying ERC-20 token...', color: 'from-blue-500 to-blue-600' },
  { icon: BookOpen, label: 'Registry Contract', description: 'Deploying investor registry...', color: 'from-indigo-500 to-indigo-600' },
  { icon: Code2, label: 'Treasury Contract', description: 'Deploying treasury vault...', color: 'from-violet-500 to-violet-600' },
  { icon: Shield, label: 'Compliance Contract', description: 'Deploying compliance rules...', color: 'from-purple-500 to-purple-600' },
]

type DeployStep = 'idle' | 'deploying' | 'step_0' | 'step_1' | 'step_2' | 'step_3' | 'complete'

export default function CreateInstrumentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deployStep, setDeployStep] = useState<DeployStep>('idle')
  const [error, setError] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [form, setForm] = useState({
    name: '',
    type: '',
    supply: '',
    symbol: '',
    network: '',
    minimumInvestment: '',
    interestRate: '',
    maturityDate: '',
  })

  const set = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const simulateDeploy = async () => {
    setDeployStep('deploying')
    for (let i = 0; i < 4; i++) {
      await new Promise((r) => setTimeout(r, 1200))
      setDeployStep(`step_${i}` as DeployStep)
    }
    await new Promise((r) => setTimeout(r, 800))
    setDeployStep('complete')
  }

  const currentStep = (): number => {
    const map: Record<string, number> = { idle: -1, deploying: -1, step_0: 0, step_1: 1, step_2: 2, step_3: 3, complete: 4 }
    return map[deployStep] ?? -1
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.type || !form.supply || !form.symbol) {
      setError('Please fill in all required fields.')
      return
    }
    if (!form.network) {
      setError('Please select a deployment network.')
      return
    }

    const selectedNet = NETWORKS.find((n) => n.value === form.network)
    if (selectedNet?.badge === 'Mainnet') {
      const ok = window.confirm(`⚠️ You are about to deploy to ${selectedNet.label} (MAINNET). This will use real funds and cannot be undone. Continue?`)
      if (!ok) return
    }

    setLoading(true)
    setError('')

    try {
      const organizationId =
        typeof window !== 'undefined' ? localStorage.getItem('organizationId') : null

      simulateDeploy()

      const res = await fetch('/api/instrument', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          organizationId,
          supply: Number(form.supply),
          minimumInvestment: form.minimumInvestment ? Number(form.minimumInvestment) : undefined,
          interestRate: form.interestRate ? Number(form.interestRate) : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create instrument.')
        setDeployStep('idle')
        return
      }

      await new Promise((r) => setTimeout(r, 6000))
      router.push('/dashboard')
    } catch {
      setError('Network error. Please try again.')
      setDeployStep('idle')
    } finally {
      setLoading(false)
    }
  }

  const isDeploying = deployStep !== 'idle'
  const step = currentStep()
  const selectedNet = NETWORKS.find((n) => n.value === form.network)

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/instruments">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">New Instrument</h1>
            <p className="text-muted-foreground text-sm">Create and deploy a tokenized financial instrument</p>
          </div>
        </div>

        {/* Deploy progress */}
        {isDeploying && (
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 mb-5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {deployStep === 'complete' ? (
                  <><CheckCircle2 className="w-5 h-5 text-green-500" /><span className="text-green-700 dark:text-green-400">All Contracts Deployed!</span></>
                ) : (
                  <><Loader2 className="w-5 h-5 text-blue-500 animate-spin" /><span>Deploying to {selectedNet?.label}...</span></>
                )}
              </CardTitle>
              <CardDescription className="text-xs">
                {deployStep === 'complete' ? 'Redirecting to dashboard...' : 'Broadcasting transactions to blockchain...'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {DEPLOY_STEPS.map((s, index) => {
                const Icon = s.icon
                const done = step > index
                const current = step === index
                return (
                  <div key={s.label} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${done ? 'bg-green-100 dark:bg-green-900/30' : current ? `bg-gradient-to-br ${s.color}` : 'bg-muted'}`}>
                      {done ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : current ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${done ? 'text-green-700 dark:text-green-400' : current ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</p>
                    </div>
                    {done && <code className="text-xs text-green-600 font-mono">0x...{Math.random().toString(16).slice(2, 8)}</code>}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}

        <Card className="border-border">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Instrument type picker */}
              <div className="space-y-2">
                <Label>Instrument Type *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {INSTRUMENT_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => { set('type', t.value); setError('') }}
                      disabled={isDeploying}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        form.type === t.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500'
                          : 'border-border hover:border-muted-foreground/40 hover:bg-accent/30'
                      }`}
                    >
                      <div className="text-xl mb-1">{t.emoji}</div>
                      <div className="text-xs font-semibold text-foreground leading-tight">{t.label}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{t.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name">Instrument Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Acme Capital Bond 2028"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  required
                  disabled={isDeploying}
                />
              </div>

              {/* Symbol + Supply */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="symbol">Token Symbol *</Label>
                  <Input
                    id="symbol"
                    placeholder="ACMEBND"
                    value={form.symbol}
                    onChange={(e) => set('symbol', e.target.value.toUpperCase())}
                    required
                    maxLength={10}
                    disabled={isDeploying}
                  />
                  <p className="text-[10px] text-muted-foreground">Max 10 characters</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="supply">Token Supply *</Label>
                  <Input
                    id="supply"
                    type="number"
                    placeholder="1,000,000"
                    value={form.supply}
                    onChange={(e) => set('supply', e.target.value)}
                    required
                    min={1}
                    disabled={isDeploying}
                  />
                  <p className="text-[10px] text-muted-foreground">Number of tokens to mint</p>
                </div>
              </div>

              {/* Network selector */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5" /> Deployment Network *
                </Label>
                <Select onValueChange={(v) => set('network', v)} disabled={isDeploying}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a blockchain network" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Testnets (Recommended)</div>
                    {NETWORKS.filter((n) => n.badge === 'Testnet').map((n) => (
                      <SelectItem key={n.value} value={n.value}>
                        <div className="flex items-center gap-2">
                          <span>{n.label}</span>
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-medium">Testnet</span>
                        </div>
                      </SelectItem>
                    ))}
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-1">Mainnets</div>
                    {NETWORKS.filter((n) => n.badge === 'Mainnet').map((n) => (
                      <SelectItem key={n.value} value={n.value}>
                        <div className="flex items-center gap-2">
                          <span>{n.label}</span>
                          <Lock className="w-3 h-3 text-orange-500" />
                          <span className="text-[10px] bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-1.5 py-0.5 rounded font-medium">Mainnet</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedNet?.badge === 'Mainnet' && (
                  <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Mainnet deployment uses real funds. Ensure your wallet is connected.
                  </p>
                )}
                {selectedNet?.badge === 'Testnet' && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">Safe to test — no real funds required.</p>
                )}
              </div>

              {/* Advanced (optional) */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                disabled={isDeploying}
              >
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                Advanced Settings (optional)
              </button>

              {showAdvanced && (
                <div className="space-y-3 border border-border rounded-xl p-4 bg-muted/20">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="minimumInvestment">Min Investment (USD)</Label>
                      <Input
                        id="minimumInvestment"
                        type="number"
                        placeholder="10,000"
                        value={form.minimumInvestment}
                        onChange={(e) => set('minimumInvestment', e.target.value)}
                        min={0}
                        disabled={isDeploying}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="interestRate">Interest Rate (% p.a.)</Label>
                      <Input
                        id="interestRate"
                        type="number"
                        placeholder="5.5"
                        value={form.interestRate}
                        onChange={(e) => set('interestRate', e.target.value)}
                        min={0}
                        step={0.01}
                        disabled={isDeploying}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="maturityDate">Maturity Date</Label>
                    <Input
                      id="maturityDate"
                      type="date"
                      value={form.maturityDate}
                      onChange={(e) => set('maturityDate', e.target.value)}
                      disabled={isDeploying}
                    />
                  </div>
                </div>
              )}

              {/* Contracts preview */}
              {form.type && (
                <div className="p-3 rounded-lg bg-muted/40 border border-border">
                  <p className="text-xs font-medium text-foreground mb-2">4 contracts will be deployed:</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {DEPLOY_STEPS.map((s) => (
                      <div key={s.label} className="flex items-center gap-1.5">
                        <Circle className="w-1.5 h-1.5 fill-muted-foreground text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 h-11 font-medium shadow-md"
                disabled={loading || isDeploying}
              >
                {isDeploying ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Deploying Contracts...</>
                ) : (
                  <><Rocket className="w-4 h-4 mr-2" />Deploy Instrument</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
