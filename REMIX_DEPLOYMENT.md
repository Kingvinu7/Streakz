# Deploy StreakTracker Using Remix IDE

## Quick Start Guide

### Step 1: Open Remix
Go to [https://remix.ethereum.org](https://remix.ethereum.org)

### Step 2: Create New File
1. In the File Explorer (left sidebar), create a new file
2. Name it: `StreakTracker.sol`

### Step 3: Copy the Contract Code
Copy the entire contract code below into the file:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title StreakTracker
 * @dev Track user streaks on Base chain
 */
contract StreakTracker {
    struct Streak {
        uint256 count;
        uint256 lastCheckIn;
        bool isActive;
    }
    
    mapping(address => Streak) public streaks;
    
    event StreakActivated(address indexed user, uint256 timestamp);
    event StreakContinued(address indexed user, uint256 newCount, uint256 timestamp);
    event StreakBroken(address indexed user, uint256 finalCount);
    
    uint256 public constant STREAK_WINDOW = 24 hours;
    uint256 public constant ACTIVATION_FEE = 0.000005 ether;
    
    /**
     * @dev Activate or continue a streak
     */
    function checkIn() external payable {
        require(msg.value >= ACTIVATION_FEE, "Insufficient payment");
        
        Streak storage userStreak = streaks[msg.sender];
        
        // First time activation
        if (!userStreak.isActive) {
            userStreak.isActive = true;
            userStreak.count = 1;
            userStreak.lastCheckIn = block.timestamp;
            emit StreakActivated(msg.sender, block.timestamp);
            return;
        }
        
        uint256 timeSinceLastCheckIn = block.timestamp - userStreak.lastCheckIn;
        
        // Check if within streak window
        if (timeSinceLastCheckIn <= STREAK_WINDOW) {
            require(timeSinceLastCheckIn >= 1 hours, "Already checked in recently");
            userStreak.count += 1;
            userStreak.lastCheckIn = block.timestamp;
            emit StreakContinued(msg.sender, userStreak.count, block.timestamp);
        } else {
            // Streak broken, restart
            uint256 oldCount = userStreak.count;
            userStreak.count = 1;
            userStreak.lastCheckIn = block.timestamp;
            emit StreakBroken(msg.sender, oldCount);
            emit StreakActivated(msg.sender, block.timestamp);
        }
    }
    
    /**
     * @dev Get user's current streak
     */
    function getStreak(address user) external view returns (
        uint256 count,
        uint256 lastCheckIn,
        bool isActive,
        bool isExpired
    ) {
        Streak memory userStreak = streaks[user];
        bool expired = userStreak.isActive && 
                      (block.timestamp - userStreak.lastCheckIn > STREAK_WINDOW);
        
        return (
            userStreak.count,
            userStreak.lastCheckIn,
            userStreak.isActive,
            expired
        );
    }
    
    /**
     * @dev Withdraw collected fees (only owner)
     */
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    function withdraw() external {
        require(msg.sender == owner, "Only owner");
        payable(owner).transfer(address(this).balance);
    }
}
```

### Step 4: Compile
1. Click on "Solidity Compiler" tab (left sidebar)
2. Select compiler version: `0.8.20` or higher
3. Click "Compile StreakTracker.sol"
4. Wait for green checkmark ✅

### Step 5: Connect Wallet to Base Network
1. Open MetaMask
2. Add Base Network:
   - **Network Name**: Base Mainnet
   - **RPC URL**: `https://mainnet.base.org`
   - **Chain ID**: `8453`
   - **Currency Symbol**: ETH
   - **Block Explorer**: `https://basescan.org`

**OR for Testnet:**
   - **Network Name**: Base Sepolia
   - **RPC URL**: `https://sepolia.base.org`
   - **Chain ID**: `84532`
   - **Currency Symbol**: ETH
   - **Block Explorer**: `https://sepolia.basescan.org`

3. Get testnet ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)

### Step 6: Deploy
1. Click on "Deploy & Run Transactions" tab (left sidebar)
2. **ENVIRONMENT**: Select "Injected Provider - MetaMask"
3. Make sure MetaMask connects and shows correct network (Base or Base Sepolia)
4. Select contract: **StreakTracker**
5. Click **Deploy** button (orange)
6. Confirm transaction in MetaMask
7. Wait for deployment confirmation

### Step 7: Copy Contract Address
1. After deployment, find your contract under "Deployed Contracts"
2. Copy the contract address (you'll need this for the frontend!)
3. Example: `0x1234...5678`

### Step 8: Verify Contract (Optional but Recommended)

#### On BaseScan:
1. Go to [BaseScan](https://basescan.org) (or [Sepolia BaseScan](https://sepolia.basescan.org))
2. Search for your contract address
3. Click "Contract" tab
4. Click "Verify and Publish"
5. Fill in:
   - **Compiler Type**: Solidity (Single file)
   - **Compiler Version**: v0.8.20
   - **License**: MIT
6. Paste your contract source code
7. Click "Verify and Publish"

### Step 9: Update Frontend
1. Go to `frontend/.env.local`
2. Update contract address:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS_HERE
```

### Step 10: Test Your Contract in Remix
Before using with frontend, test in Remix:

1. **Check activation fee:**
   - Call `ACTIVATION_FEE()` - should return `5000000000000` (0.000005 ETH in wei)

2. **Test check-in:**
   - Set value to `5000000000000` wei (at top, near "Deploy" button)
   - Call `checkIn()` function
   - Confirm in MetaMask

3. **Check your streak:**
   - Call `getStreak(YOUR_ADDRESS)`
   - Should see: count=1, isActive=true

## Contract Functions

### User Functions
- **`checkIn()`** - Payable - Activate or continue streak (send 0.000005 ETH)
- **`getStreak(address user)`** - View - Get user's streak data
- **`ACTIVATION_FEE()`** - View - Get fee amount (5000000000000 wei)
- **`STREAK_WINDOW()`** - View - Get time window (86400 seconds)

### Owner Functions
- **`withdraw()`** - Owner only - Withdraw collected fees
- **`owner()`** - View - Get owner address

## Wei Converter Helper

**0.000005 ETH** = `5000000000000` wei

Use this value when testing `checkIn()` in Remix!

## Troubleshooting

### "Insufficient payment" error
- Make sure you're sending exactly `5000000000000` wei
- Set the value in the VALUE field before clicking checkIn

### "Already checked in recently" error
- Wait at least 1 hour between check-ins
- This is by design to prevent spam

### Transaction fails
- Check you have enough ETH for gas + activation fee
- Make sure you're on Base network
- Try increasing gas limit

### Can't find deployed contract
- Check "Deployed Contracts" section in Remix
- Make sure transaction was confirmed
- Check MetaMask for transaction status

## Quick Copy-Paste Values

**For Remix Testing:**
```
Value to send: 5000000000000 wei
Contract: StreakTracker
Network: Base Sepolia (testnet) or Base Mainnet
```

## Need Help?
- Check the transaction on BaseScan
- Make sure wallet is connected to correct network
- Verify you have enough ETH for gas + fees

---

**Ready to deploy?** Follow the steps above and your contract will be live on Base! 🚀
