import { createConfig, http } from 'wagmi'
import { mainnet, polygon, base, sepolia } from 'wagmi/chains'
import { injected } from '@wagmi/core'

// Use injected({ target: 'metaMask' }) instead of metaMask().
// metaMask() uses @metamask/sdk which accesses browser globals at
// initialisation time and crashes Next.js SSR. injected() is a
// lightweight connector that only touches window.ethereum at connect time.
export function createWagmiConfig() {
  const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY

  const rpc = (sub: string) =>
    alchemyKey ? http(`https://${sub}.g.alchemy.com/v2/${alchemyKey}`) : http()

  return createConfig({
    chains: [mainnet, polygon, base, sepolia],
    connectors: [injected({ target: 'metaMask' })],
    ssr: true,
    transports: {
      [mainnet.id]: rpc('eth-mainnet'),
      [polygon.id]: rpc('polygon-mainnet'),
      [base.id]:    rpc('base-mainnet'),
      [sepolia.id]: rpc('eth-sepolia'),
    },
  })
}
