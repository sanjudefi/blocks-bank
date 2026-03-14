'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Code2, Circle, Copy, CheckCircle2, ExternalLink } from 'lucide-react'
import { formatAddress } from '@/lib/utils'

interface Contract {
  id: string
  tokenContract: string | null
  registryContract: string | null
  treasuryContract: string | null
  complianceContract: string | null
  transactionHash: string | null
  instrument: { name: string; symbol: string; type: string } | null
  deployedAt: string
}

const CONTRACT_TYPES = [
  { key: 'tokenContract', label: 'Token Contract', description: 'ERC-20 token representing the financial instrument' },
  { key: 'registryContract', label: 'Registry Contract', description: 'Manages investor whitelist and KYC status' },
  { key: 'treasuryContract', label: 'Treasury Contract', description: 'Handles fund custody and distributions' },
  { key: 'complianceContract', label: 'Compliance Contract', description: 'Enforces transfer restrictions and rules' },
]

function ContractRow({
  label,
  address,
  description,
}: {
  label: string
  address: string | null
  description: string
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!address) return
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!address) return null

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <Circle className="w-2.5 h-2.5 text-green-500 fill-green-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <code className="text-sm font-mono bg-muted px-2 py-1 rounded text-foreground">
          {formatAddress(address)}
        </code>
        <button
          onClick={copy}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Copy address"
        >
          {copied ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
        <a
          href={`https://etherscan.io/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="View on Etherscan"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const organizationId =
      typeof window !== 'undefined' ? localStorage.getItem('organizationId') : null
    if (!organizationId) {
      setLoading(false)
      return
    }

    fetch(`/api/organization/contracts?organizationId=${organizationId}`)
      .then((r) => r.json())
      .then((data) => setContracts(data.contracts || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Smart Contracts</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View all deployed smart contract addresses
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {CONTRACT_TYPES.map((type) => {
          const deployed = contracts.filter((c) => c[type.key as keyof Contract] !== null).length
          return (
            <Card key={type.key} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                  <span className="text-xs font-medium text-muted-foreground">{type.label}</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{deployed}</div>
                <div className="text-xs text-muted-foreground">Deployed</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Contract list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : contracts.length > 0 ? (
        <div className="space-y-4">
          {contracts.map((contract) => (
            <Card key={contract.id} className="border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {contract.instrument?.name || 'Unknown Instrument'}
                      {contract.instrument?.symbol && (
                        <code className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">
                          ${contract.instrument.symbol}
                        </code>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-0.5">
                      Deployed {new Date(contract.deployedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </CardDescription>
                  </div>
                  <Badge variant="success">Deployed</Badge>
                </div>
                {contract.transactionHash && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">Tx:</span>
                    <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                      {formatAddress(contract.transactionHash)}
                    </code>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {CONTRACT_TYPES.map((type) => (
                  <ContractRow
                    key={type.key}
                    label={type.label}
                    address={contract[type.key as keyof Contract] as string | null}
                    description={type.description}
                  />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border">
          <CardContent className="py-16 text-center">
            <Code2 className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">No contracts deployed</p>
            <p className="text-muted-foreground text-sm">
              Create and deploy a financial instrument to see your smart contracts here.
            </p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}
