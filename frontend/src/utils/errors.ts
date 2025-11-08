/**
 * Parse and format Web3 errors for user-friendly display
 */
export function parseWeb3Error(error: any): string {
  const errorString = error?.message || error?.toString() || 'Unknown error'
  
  // Common error patterns
  if (errorString.includes('user rejected')) {
    return 'Transaction was rejected'
  }
  
  if (errorString.includes('insufficient funds')) {
    return 'Insufficient funds for transaction'
  }
  
  if (errorString.includes('Already checked in recently')) {
    return 'You need to wait at least 1 hour between check-ins'
  }
  
  if (errorString.includes('Insufficient payment')) {
    return 'Payment amount is too low (minimum 0.000005 ETH)'
  }
  
  if (errorString.includes('network changed') || errorString.includes('chain')) {
    return 'Please switch to Base network'
  }
  
  if (errorString.includes('connection')) {
    return 'Connection error. Please check your network'
  }
  
  // Return shortened error if still too long
  if (errorString.length > 100) {
    return errorString.substring(0, 100) + '...'
  }
  
  return errorString
}

/**
 * Check if error is a user rejection
 */
export function isUserRejection(error: any): boolean {
  const errorString = error?.message || error?.toString() || ''
  return errorString.includes('user rejected') || errorString.includes('User rejected')
}
