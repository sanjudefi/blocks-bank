import { createConfig, http } from 'wagmi'
import { mainnet, polygon, base, sepolia } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

// Factory — called inside Providers so it only runs client-side
export function createWagmiConfig() {
  const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY

  const rpc = (subdomain: string) =>
    alchemyKey
      ? http(`https://${subdomain}.g.alchemy.com/v2/${alchemyKey}`)
      : http()

  return createConfig({
    chains: [mainnet, polygon, base, sepolia],
    connectors: [metaMask()],
    ssr: true,
    transports: {
      [mainnet.id]: rpc('eth-mainnet'),
      [polygon.id]: rpc('polygon-mainnet'),
      [base.id]:    rpc('base-mainnet'),
      [sepolia.id]: rpc('eth-sepolia'),
    },
  })
}
