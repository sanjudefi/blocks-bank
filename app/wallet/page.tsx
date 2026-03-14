'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Wallet, CheckCircle2, AlertCircle, Loader2, Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatAddress } from '@/lib/utils'

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on: (event: string, callback: (...args: unknown[]) => void) => void
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void
    }
  }
}

type ConnectionState = 'idle' | 'connecting' | 'connected' | 'error' | 'saving'

export default function WalletPage() {
  const router = useRouter()
  const [state, setState] = useState<ConnectionState>('idle')
  const [address, setAddress] = useState<string>('')
  const [chainId, setChainId] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [copied, setCopied] = useState(false)

  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask is not installed. Please install it from metamask.io')
      setState('error')
      return
    }

    setState('connecting')
    setError('')

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[]

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from MetaMask')
      }

      const chain = await window.ethereum.request({ method: 'eth_chainId' }) as string
      setAddress(accounts[0])
      setChainId(chain)
      setState('connected')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet'
      setError(message.includes('rejected') ? 'Connection rejected by user.' : message)
      setState('error')
    }
  }, [])

  const saveWallet = async () => {
    setState('saving')
    setError('')

    try {
      const organizationId =
        typeof window !== 'undefined' ? localStorage.getItem('organizationId') : null

      const res = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, organizationId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save wallet')
      }

      router.push('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save wallet'
      setError(message)
      setState('connected')
    }
  }

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getChainName = (id: string) => {
    const chains: Record<string, string> = {
      '0x1': 'Ethereum Mainnet',
      '0x89': 'Polygon',
      '0x2105': 'Base',
      '0xa4b1': 'Arbitrum One',
      '0xaa36a7': 'Sepolia Testnet',
      '0x13882': 'Polygon Amoy',
    }
    return chains[id] || `Chain ${parseInt(id, 16)}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50/50 to-background dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-background p-4">
      <div className="w-full max-w-md">
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
              <div className={`flex items-center gap-1.5 ${i === 2 ? 'text-primary' : i < 2 ? 'text-green-500' : 'text-muted-foreground'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border-2 ${
                  i === 2 ? 'border-primary bg-primary text-white' :
                  i < 2 ? 'border-green-500 bg-green-500 text-white' :
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
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-4">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your MetaMask wallet to enable on-chain operations for your organization.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error state */}
            {state === 'error' && error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">Connection Error</p>
                  <p className="text-sm text-red-500 dark:text-red-400/80 mt-1">{error}</p>
                  {error.includes('MetaMask is not installed') && (
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline mt-2"
                    >
                      Install MetaMask <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Connected state */}
            {(state === 'connected' || state === 'saving') && address && (
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">Wallet Connected</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Address</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-foreground">{formatAddress(address)}</code>
                      <button onClick={copyAddress} className="text-muted-foreground hover:text-foreground transition-colors">
                        {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {chainId && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Network</span>
                      <span className="text-sm text-foreground">{getChainName(chainId)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Connect button */}
            {(state === 'idle' || state === 'error') && (
              <Button
                onClick={connectWallet}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white border-0 h-11 font-medium"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect MetaMask
              </Button>
            )}

            {state === 'connecting' && (
              <Button disabled className="w-full h-11">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting to MetaMask...
              </Button>
            )}

            {/* Save button */}
            {(state === 'connected' || state === 'saving') && (
              <Button
                onClick={saveWallet}
                disabled={state === 'saving'}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 h-11 font-medium shadow-md"
              >
                {state === 'saving' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {state === 'saving' ? 'Saving wallet...' : 'Continue to Dashboard'}
              </Button>
            )}

            {/* Skip option */}
            <div className="text-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip for now
              </button>
            </div>

            {/* MetaMask info */}
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground text-center">
                Your wallet address will be stored securely and associated with your organization.
                You can update it anytime from your dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
