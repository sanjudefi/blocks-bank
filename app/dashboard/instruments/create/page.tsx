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
  ArrowLeft,
  Loader2,
  Rocket,
  CheckCircle2,
  Circle,
  Code2,
  Shield,
  Coins,
  BookOpen,
} from 'lucide-react'
import Link from 'next/link'

const instrumentTypes = [
  { value: 'BOND', label: 'Bond', description: 'Fixed-income debt instrument with periodic interest payments' },
  { value: 'FIXED_DEPOSIT', label: 'Fixed Deposit', description: 'Time-locked deposit earning guaranteed interest' },
  { value: 'REAL_ESTATE_ASSET', label: 'Real Estate Asset', description: 'Tokenized property or real estate fund share' },
  { value: 'PRIVATE_CREDIT', label: 'Private Credit', description: 'Direct lending to private companies' },
  { value: 'FUND_SHARES', label: 'Fund Shares', description: 'Tokenized units of an investment fund' },
]

const deploymentSteps = [
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
  const [form, setForm] = useState({
    name: '',
    type: '',
    supply: '',
    symbol: '',
    minimumInvestment: '',
    interestRate: '',
    maturityDate: '',
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const simulateDeployment = async () => {
    setDeployStep('deploying')
    for (let i = 0; i < 4; i++) {
      await new Promise((r) => setTimeout(r, 1200))
      setDeployStep(`step_${i}` as DeployStep)
    }
    await new Promise((r) => setTimeout(r, 800))
    setDeployStep('complete')
  }

  const getCurrentStep = (): number => {
    const steps: Record<string, number> = {
      idle: -1,
      deploying: -1,
      step_0: 0,
      step_1: 1,
      step_2: 2,
      step_3: 3,
      complete: 4,
    }
    return steps[deployStep] ?? -1
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.type || !form.supply || !form.symbol) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const organizationId =
        typeof window !== 'undefined' ? localStorage.getItem('organizationId') : null

      // Start deployment simulation
      simulateDeployment()

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

      // Wait for deployment simulation to complete
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
  const currentStep = getCurrentStep()

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/instruments">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create Instrument</h1>
            <p className="text-muted-foreground text-sm">Configure and deploy a new tokenized financial instrument</p>
          </div>
        </div>

        {/* Deployment overlay */}
        {isDeploying && (
          <Card className="border-border mb-6 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/10 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                {deployStep === 'complete' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-green-700 dark:text-green-400">Contracts Deployed Successfully!</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    <span>Deploying Smart Contracts...</span>
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {deployStep === 'complete'
                  ? 'All contracts have been deployed. Redirecting to dashboard...'
                  : 'Simulating blockchain deployment. This will take a few seconds.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deploymentSteps.map((step, index) => {
                  const Icon = step.icon
                  const isDone = currentStep > index
                  const isCurrent = currentStep === index
                  return (
                    <div key={step.label} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isDone ? 'bg-green-100 dark:bg-green-900/30' :
                        isCurrent ? `bg-gradient-to-br ${step.color}` :
                        'bg-muted'
                      }`}>
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : isCurrent ? (
                          <Loader2 className="w-4 h-4 text-white animate-spin" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          isDone ? 'text-green-700 dark:text-green-400' :
                          isCurrent ? 'text-foreground' :
                          'text-muted-foreground'
                        }`}>{step.label}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                      {isDone && (
                        <span className="text-xs text-green-600 font-mono">0x...{Math.random().toString(16).slice(2, 8)}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Instrument Configuration</CardTitle>
            <CardDescription>
              Define the parameters for your tokenized financial instrument.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="name">Instrument Name *</Label>
                  <Input
                    id="name"
                    placeholder="Acme Capital Bond Series A"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    disabled={isDeploying}
                  />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <Label>Instrument Type *</Label>
                  <Select
                    onValueChange={(v) => handleChange('type', v)}
                    disabled={isDeploying}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select instrument type" />
                    </SelectTrigger>
                    <SelectContent>
                      {instrumentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <span className="font-medium">{type.label}</span>
                            <p className="text-xs text-muted-foreground">{type.description}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="supply">Token Supply *</Label>
                  <Input
                    id="supply"
                    type="number"
                    placeholder="1000000"
                    value={form.supply}
                    onChange={(e) => handleChange('supply', e.target.value)}
                    required
                    min={1}
                    disabled={isDeploying}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="symbol">Token Symbol *</Label>
                  <Input
                    id="symbol"
                    placeholder="ACMEBND"
                    value={form.symbol}
                    onChange={(e) => handleChange('symbol', e.target.value.toUpperCase())}
                    required
                    maxLength={10}
                    disabled={isDeploying}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="minimumInvestment">Minimum Investment (USD)</Label>
                  <Input
                    id="minimumInvestment"
                    type="number"
                    placeholder="10000"
                    value={form.minimumInvestment}
                    onChange={(e) => handleChange('minimumInvestment', e.target.value)}
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
                    onChange={(e) => handleChange('interestRate', e.target.value)}
                    min={0}
                    step={0.01}
                    disabled={isDeploying}
                  />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="maturityDate">Maturity Date</Label>
                  <Input
                    id="maturityDate"
                    type="date"
                    value={form.maturityDate}
                    onChange={(e) => handleChange('maturityDate', e.target.value)}
                    disabled={isDeploying}
                  />
                </div>
              </div>

              {/* Contract summary */}
              {form.type && (
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm font-medium text-foreground mb-2">Contracts to be deployed:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {deploymentSteps.map((step) => (
                      <div key={step.label} className="flex items-center gap-2">
                        <Circle className="w-1.5 h-1.5 fill-muted-foreground text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{step.label}</span>
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
                {loading && !isDeploying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isDeploying ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Deploying Contracts...</>
                ) : (
                  <><Rocket className="w-4 h-4 mr-2" />Deploy Contracts</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
