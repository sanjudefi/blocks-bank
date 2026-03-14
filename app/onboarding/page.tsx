'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Loader2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const blockchains = [
  { value: 'ETHEREUM', label: 'Ethereum', description: 'Mainnet – highest security and liquidity' },
  { value: 'POLYGON', label: 'Polygon', description: 'Low fees, fast confirmations' },
  { value: 'BASE', label: 'Base', description: 'Coinbase L2 – enterprise friendly' },
  { value: 'PRIVATE_EVM', label: 'Private EVM', description: 'Permissioned private blockchain' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [form, setForm] = useState({
    legalEntityName: '',
    website: '',
    adminWalletAddress: '',
    blockchain: '',
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const organizationId =
        typeof window !== 'undefined' ? localStorage.getItem('organizationId') : null

      if (!organizationId) {
        router.push('/signup')
        return
      }

      // Upload logo if provided
      let logoUrl: string | undefined
      if (logoFile) {
        const logoForm = new FormData()
        logoForm.append('file', logoFile)
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: logoForm,
        })
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          logoUrl = uploadData.url
        }
      }

      const res = await fetch('/api/organization', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          ...form,
          logoUrl,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to save organization details.')
        return
      }

      router.push('/wallet')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50/50 to-background dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-background p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-foreground">Blocks Bank</span>
          </Link>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          {['Account', 'Organization', 'Wallet', 'Dashboard'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 ${i === 1 ? 'text-primary' : i < 1 ? 'text-green-500' : 'text-muted-foreground'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border-2 ${
                  i === 1 ? 'border-primary bg-primary text-white' :
                  i < 1 ? 'border-green-500 bg-green-500 text-white' :
                  'border-muted-foreground/30'
                }`}>
                  {i + 1}
                </div>
                <span className="text-xs font-medium hidden sm:inline">{step}</span>
              </div>
              {i < 3 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        <Card className="border-border shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Organization Details</CardTitle>
            <CardDescription>
              Tell us more about your organization to complete the setup.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Logo Upload */}
              <div className="space-y-1.5">
                <Label>Organization Logo (Optional)</Label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setLogoFile(null); setLogoPreview('') }}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-16 h-16 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                    </label>
                  )}
                  <div className="text-sm text-muted-foreground">
                    <p>Upload your organization logo</p>
                    <p className="text-xs">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="legalEntityName">Legal Entity Name</Label>
                <Input
                  id="legalEntityName"
                  placeholder="Acme Capital Management LLC"
                  value={form.legalEntityName}
                  onChange={(e) => handleChange('legalEntityName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://acmecapital.com"
                  value={form.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="adminWalletAddress">Admin Wallet Address</Label>
                <Input
                  id="adminWalletAddress"
                  placeholder="0x..."
                  value={form.adminWalletAddress}
                  onChange={(e) => handleChange('adminWalletAddress', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">You can also connect your wallet on the next step.</p>
              </div>

              <div className="space-y-1.5">
                <Label>Preferred Blockchain</Label>
                <Select onValueChange={(v) => handleChange('blockchain', v)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blockchain network" />
                  </SelectTrigger>
                  <SelectContent>
                    {blockchains.map((chain) => (
                      <SelectItem key={chain.value} value={chain.value}>
                        <div>
                          <span className="font-medium">{chain.label}</span>
                          <span className="text-muted-foreground text-xs ml-2">{chain.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 h-10 font-medium shadow-md"
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? 'Saving...' : 'Continue to Wallet Setup'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
