'use client'

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { metaMask } from 'wagmi/connectors'
import { Copy, CheckCircle2, Wallet, ChevronDown, ExternalLink, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatAddress } from '@/lib/utils'

const CHAINS: Record<number, { name: string; color: string }> = {
  1:        { name: 'Ethereum',        color: 'bg-blue-500' },
  137:      { name: 'Polygon',         color: 'bg-violet-500' },
  8453:     { name: 'Base',            color: 'bg-blue-400' },
  11155111: { name: 'Sepolia Testnet', color: 'bg-amber-500' },
}

export default function WalletConnect({ onConnected }: { onConnected?: (address: string) => void }) {
  const { address, isConnected, connector } = useAccount()
  const { connect, isPending, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const chain = chainId ? CHAINS[chainId] : null

  const handleConnect = () => {
    connect(
      { connector: metaMask() },
      {
        onSuccess: (data) => {
          if (onConnected && data.accounts[0]) onConnected(data.accounts[0])
        },
      }
    )
  }

  const copyAddress = async () => {
    if (!address) return
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isConnected) {
    return (
      <div className="space-y-3">
        <Button
          onClick={handleConnect}
          disabled={isPending}
          className="w-full h-12 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white border-0 font-medium text-base shadow-md shadow-orange-500/20"
        >
          <Wallet className="w-5 h-5 mr-2" />
          {isPending ? 'Connecting…' : 'Connect MetaMask'}
        </Button>
        {connectError && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-600 dark:text-red-400">{connectError.message}</p>
          </div>
        )}
        <p className="text-xs text-center text-muted-foreground">
          Need MetaMask?{' '}
          <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-0.5">
            Download here <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Connected card */}
      <div className="p-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">Connected</span>
          </div>
          <span className="text-xs text-muted-foreground">{connector?.name}</span>
        </div>

        <div className="flex items-center justify-between">
          <code className="text-sm font-mono text-foreground font-medium">{formatAddress(address!)}</code>
          <div className="flex items-center gap-1">
            <button onClick={copyAddress}
              className="p-1.5 rounded-md hover:bg-green-100 dark:hover:bg-green-800/50 transition-colors"
              title="Copy address">
              {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
            </button>
            <a href={`https://etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer"
              className="p-1.5 rounded-md hover:bg-green-100 dark:hover:bg-green-800/50 transition-colors">
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
          </div>
        </div>

        {/* Network */}
        <div className="flex items-center gap-2 mt-2 relative">
          <button onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/60 dark:bg-black/20 border border-border hover:bg-white/80 dark:hover:bg-black/30 transition-colors text-xs">
            <span className={`w-2 h-2 rounded-full ${chain?.color ?? 'bg-muted-foreground'}`} />
            <span className="font-medium text-foreground">{chain?.name ?? `Chain ${chainId}`}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
          {showMenu && (
            <div className="absolute top-7 left-0 bg-card border border-border rounded-lg shadow-lg z-20 min-w-[160px] overflow-hidden">
              {Object.entries(CHAINS).map(([id, c]) => (
                <button key={id} onClick={() => { switchChain({ chainId: Number(id) }); setShowMenu(false) }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent transition-colors ${Number(id) === chainId ? 'text-primary font-medium' : 'text-foreground'}`}>
                  <span className={`w-2 h-2 rounded-full ${c.color}`} />
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={() => disconnect()} className="w-full text-muted-foreground hover:text-foreground">
        Disconnect wallet
      </Button>
    </div>
  )
}
