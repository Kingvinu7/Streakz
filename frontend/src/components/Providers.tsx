'use client'

import { ReactNode, useEffect, useState } from 'react'
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

// Initialize AppKit only once
let appKitInitialized = false

function initializeAppKit() {
  if (appKitInitialized || typeof window === 'undefined') {
    return
  }

  // Debug: Log Project ID status (will show in browser console)
  console.log('🔍 Reown Project ID:', projectId ? '✅ Loaded' : '❌ Missing')
  console.log('🔍 Project ID value:', projectId || 'EMPTY STRING')
  console.log('🔍 Metadata URL:', metadata.url)
  console.log('🔍 Analytics enabled:', true)
  
  if (!projectId) {
    console.error('⚠️ CRITICAL: Project ID is not set! Analytics will not work.')
    console.error('⚠️ Make sure NEXT_PUBLIC_PROJECT_ID is set in Vercel environment variables')
  }

  // Create Streakz AppKit instance
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

  appKitInitialized = true
  console.log('✅ AppKit initialized successfully')
}

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    initializeAppKit()
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    )
  }

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
