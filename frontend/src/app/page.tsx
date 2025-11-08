'use client'

import { StreakTracker } from '@/components/StreakTracker'
import { Providers } from '@/components/Providers'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <Providers>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <header className="text-center mb-12 pt-8">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="text-6xl animate-bounce">🔥</div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Streakz
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl">
              Build your onchain streak on Base • Check in daily to keep it alive
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                ⚡ Base Network
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                ✅ Low Gas
              </span>
            </div>
          </header>
          
          <StreakTracker />
          
          <Footer />
        </div>
      </main>
    </Providers>
  )
}
