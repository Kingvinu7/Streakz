'use client'

import { useEffect, useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { useAppKit } from '@reown/appkit/react'
import { STREAK_TRACKER_ABI, CONTRACT_ADDRESS } from '@/config/contract'
import { formatTimeRemaining, getStreakStatus } from '@/utils/formatTime'
import { parseWeb3Error, isUserRejection } from '@/utils/errors'

interface StreakData {
  count: bigint
  lastCheckIn: bigint
  isActive: boolean
  isExpired: boolean
}

export function StreakTracker() {
  const { address, isConnected } = useAccount()
  const { open } = useAppKit()
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Read streak data
  const { data: streakData, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: STREAK_TRACKER_ABI,
    functionName: 'getStreak',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  })

  // Write contract for check-in
  const { 
    writeContract, 
    data: hash,
    isPending: isWritePending,
    error: writeError 
  } = useWriteContract()

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Update streak data when available
  useEffect(() => {
    if (streakData) {
      const [count, lastCheckIn, isActive, isExpired] = streakData as [bigint, bigint, boolean, boolean]
      setStreak({ count, lastCheckIn, isActive, isExpired })
    }
  }, [streakData])

  // Refetch after successful transaction
  useEffect(() => {
    if (isSuccess) {
      refetch()
    }
  }, [isSuccess, refetch])

  // Calculate time until expiry
  useEffect(() => {
    if (!streak || !streak.isActive) return

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000)
      const expiry = Number(streak.lastCheckIn) + 24 * 60 * 60
      const remaining = expiry - now

      if (remaining <= 0) {
        setTimeUntilExpiry('Expired')
        refetch()
      } else {
        const hours = Math.floor(remaining / 3600)
        const minutes = Math.floor((remaining % 3600) / 60)
        setTimeUntilExpiry(`${hours}h ${minutes}m`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [streak, refetch])

  const handleCheckIn = async () => {
    try {
      setErrorMessage('')
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: STREAK_TRACKER_ABI,
        functionName: 'checkIn',
        value: parseEther('0.0001'),
      })
    } catch (err) {
      console.error('Check-in error:', err)
      if (!isUserRejection(err)) {
        setErrorMessage(parseWeb3Error(err))
      }
    }
  }
  
  // Update error message from writeError
  useEffect(() => {
    if (writeError && !isUserRejection(writeError)) {
      setErrorMessage(parseWeb3Error(writeError))
    }
  }, [writeError])

  const canCheckIn = () => {
    if (!streak) return true
    if (!streak.isActive) return true
    
    const now = Math.floor(Date.now() / 1000)
    const timeSinceLastCheckIn = now - Number(streak.lastCheckIn)
    
    // Must wait at least 1 hour between check-ins
    return timeSinceLastCheckIn >= 3600
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
          <div className="text-6xl mb-6">🔗</div>
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Connect Your Wallet</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Connect your wallet to start tracking your onchain streak
          </p>
          <button
            onClick={() => open()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
        {/* Header with wallet button */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold dark:text-white">Your Streak</h2>
          <appkit-button />
        </div>

        {/* Streak Display */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-red-500 mb-4 animate-pulse-slow">
            <span className="text-6xl">🔥</span>
          </div>
          <div className="text-6xl font-bold mb-2 dark:text-white">
            {streak?.count ? streak.count.toString() : '0'}
          </div>
          <div className="text-gray-600 dark:text-gray-300 text-lg">
            {streak?.count === 1n ? 'Day' : 'Days'} Streak
          </div>
        </div>

        {/* Status Message */}
        {streak && (
          <div className="text-center mb-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {getStreakStatus(Number(streak.count), Number(streak.lastCheckIn), streak.isActive, streak.isExpired)}
            </p>
          </div>
        )}

        {/* Status and Timer */}
        {streak?.isActive && !streak?.isExpired && (
          <div className="bg-blue-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Time Remaining</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">
                {timeUntilExpiry}
              </span>
            </div>
          </div>
        )}

        {/* Check-in Button */}
        <button
          onClick={handleCheckIn}
          disabled={!canCheckIn() || isWritePending || isConfirming}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg ${
            !canCheckIn() || isWritePending || isConfirming
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white'
          }`}
        >
          {isWritePending || isConfirming
            ? 'Processing...'
            : !canCheckIn()
            ? 'Check back later (1 hour between check-ins)'
            : streak?.isActive
            ? 'Continue Streak (0.0001 ETH)'
            : 'Start Streak (0.0001 ETH)'}
        </button>

        {/* Error Display */}
        {errorMessage && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">
              ⚠️ {errorMessage}
            </p>
          </div>
        )}

        {/* Success Message */}
        {isSuccess && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-green-600 dark:text-green-400 font-medium">
              ✅ Streak updated successfully!
            </p>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 dark:text-white">📖 How it works</h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Check in once per day to maintain your streak</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Each check-in costs 0.0001 ETH on Base</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>You have 24 hours between check-ins</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Miss the window and your streak resets!</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
