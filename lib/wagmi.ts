'use client'

import { createConfig, http } from 'wagmi'
import { mainnet, polygon, base, sepolia } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY

const rpc = (subdomain: string) =>
  alchemyKey
    ? http(`https://${subdomain}.g.alchemy.com/v2/${alchemyKey}`)
    : http()

export const wagmiConfig = createConfig({
  chains: [mainnet, polygon, base, sepolia],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: rpc('eth-mainnet'),
    [polygon.id]: rpc('polygon-mainnet'),
    [base.id]: rpc('base-mainnet'),
    [sepolia.id]: rpc('eth-sepolia'),
  },
})
