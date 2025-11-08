'use client'

import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, baseSepolia } from '@reown/appkit/networks'
import { projectId, metadata } from '@/config/wagmi'

// Set up query client
const queryClient = new QueryClient()

// Set up Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [base, baseSepolia],
  ssr: true,
})

// Create AppKit instance
createAppKit({
  adapters: [wagmiAdapter],
  networks: [base, baseSepolia],
  projectId,
  metadata,
  features: {
    analytics: true,
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#0052FF',
  }
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
