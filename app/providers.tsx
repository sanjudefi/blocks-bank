'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { createWagmiConfig } from '@/lib/wagmi'

export function Providers({ children }: { children: React.ReactNode }) {
  // Both created inside useState so they're client-only, never run during SSR
  const [wagmiConfig] = useState(() => createWagmiConfig())
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
