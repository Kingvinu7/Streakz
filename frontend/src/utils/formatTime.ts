/**
 * Format seconds into human-readable time
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return 'Expired'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Get streak status message
 */
export function getStreakStatus(
  count: number,
  lastCheckIn: number,
  isActive: boolean,
  isExpired: boolean
): string {
  if (!isActive) return "Start your streak journey! 🚀"
  if (isExpired) return "Your streak expired! Start fresh 🔄"
  if (count === 1) return "Great start! Keep it going 💪"
  if (count < 7) return "Building momentum! 🔥"
  if (count < 30) return "You're on fire! 🔥🔥"
  if (count < 100) return "Incredible dedication! 🔥🔥🔥"
  return "Legendary streak! 👑"
}
