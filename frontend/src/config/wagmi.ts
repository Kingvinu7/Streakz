import { cookieStorage, createStorage } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { http } from 'viem'

// Get projectId from environment
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || ''

if (!projectId) {
  console.warn('NEXT_PUBLIC_PROJECT_ID is not set')
}

export const networks = [base, baseSepolia] as const

export const wagmiConfig = {
  chains: networks,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
}

export const metadata = {
  name: 'Streakz',
  description: 'Track your onchain streaks on Base',
  url: 'https://streakz-rho.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}
