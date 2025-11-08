# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                  │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   UI Layer   │  │ Wallet Layer │  │ State Mgmt   │ │
│  │   (React)    │  │ (Reown Kit)  │  │ (React Query)│ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│           │                 │                 │         │
│           └─────────────────┴─────────────────┘         │
│                          │                              │
└──────────────────────────┼──────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Wagmi/    │
                    │    Viem     │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Base Chain  │
                    │  (L2 RPC)   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────────┐
                    │ StreakTracker   │
                    │   Contract      │
                    └─────────────────┘
```

## Smart Contract Layer

### StreakTracker Contract

**Location:** `contracts/StreakTracker.sol`

**Core Functionality:**
- `checkIn()`: Activate or continue user streaks
- `getStreak(address)`: Query user streak data
- `withdraw()`: Owner function to withdraw fees

**Data Structures:**
```solidity
struct Streak {
    uint256 count;        // Number of consecutive days
    uint256 lastCheckIn;  // Timestamp of last check-in
    bool isActive;        // Whether streak is active
}
```

**Events:**
- `StreakActivated`: First check-in
- `StreakContinued`: Successful continuation
- `StreakBroken`: Missed deadline, restart

**Constants:**
- `STREAK_WINDOW`: 24 hours (86400 seconds)
- `ACTIVATION_FEE`: 0.0001 ETH

### Gas Optimization

- Use `memory` for read operations
- Batch state updates
- Emit events for off-chain indexing
- Minimize storage writes

## Frontend Layer

### Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Web3:** Wagmi v2 + Viem v2
- **Wallet:** Reown AppKit
- **State:** React Query (TanStack Query)

### Component Hierarchy

```
App
├── Providers (Wagmi + Query Client)
│   └── Page
│       ├── Header
│       ├── StreakTracker (Main Component)
│       │   ├── Wallet Connect Button
│       │   ├── Streak Display
│       │   ├── Timer
│       │   ├── Check-in Button
│       │   └── Status Messages
│       └── Footer
```

### Key Components

**Providers (`src/components/Providers.tsx`)**
- Sets up Wagmi adapter
- Configures Reown AppKit
- Provides React Query client

**StreakTracker (`src/components/StreakTracker.tsx`)**
- Main application logic
- Contract interactions
- State management
- UI rendering

**Configuration (`src/config/`)**
- `wagmi.ts`: Network configuration
- `contract.ts`: Contract ABI and address

**Utilities (`src/utils/`)**
- `formatTime.ts`: Time formatting helpers
- `errors.ts`: Error parsing and handling

## Data Flow

### Check-in Flow

1. **User Action**
   - User clicks "Check In" button

2. **Frontend Validation**
   - Check if wallet is connected
   - Verify correct network
   - Check if 1 hour has passed since last check-in

3. **Transaction Creation**
   - Wagmi prepares transaction
   - User confirms in wallet
   - Transaction sent to Base chain

4. **Contract Execution**
   - Contract validates payment
   - Updates streak data
   - Emits event

5. **UI Update**
   - Transaction confirmed
   - React Query refetches data
   - UI displays new streak count

### State Management

**Contract State (On-chain)**
- User streak data
- Last check-in timestamps
- Collected fees

**Application State (Off-chain)**
- Wallet connection status
- Current streak display data
- Transaction pending states
- Error messages

## Network Architecture

### Base Chain

**Mainnet:**
- Chain ID: 8453
- RPC: https://mainnet.base.org
- Block time: ~2 seconds
- Gas: Very low (L2 optimizations)

**Testnet (Sepolia):**
- Chain ID: 84532
- RPC: https://sepolia.base.org
- Faucet available for testing

### Why Base?

1. **Low Fees:** L2 optimization keeps transactions cheap
2. **Fast:** 2-second block times
3. **EVM Compatible:** Use existing Solidity tools
4. **Growing Ecosystem:** Active community and development

## Security Considerations

### Smart Contract

- ✅ Owner-only withdrawal
- ✅ Reentrancy protection (no external calls in checkIn)
- ✅ Integer overflow protection (Solidity 0.8+)
- ✅ Input validation
- ⚠️ Consider adding pause functionality
- ⚠️ Consider time-locked upgrades

### Frontend

- ✅ User input validation
- ✅ Error handling
- ✅ Network verification
- ✅ Secure RPC endpoints
- ⚠️ Rate limiting (consider adding)
- ⚠️ Transaction replay protection

## Deployment Architecture

### Smart Contract Deployment

```
Developer
    │
    ├── Hardhat
    │   ├── Compile contracts
    │   ├── Run tests
    │   └── Deploy script
    │
    └── Base Chain
        └── Deployed Contract
```

### Frontend Deployment

```
Repository
    │
    ├── Vercel/Netlify
    │   ├── Build Next.js app
    │   ├── Inject env variables
    │   └── Deploy to CDN
    │
    └── Production URL
```

## Future Enhancements

### Planned Features

1. **Leaderboard**
   - Global streak rankings
   - Friend comparisons
   - Top streakers display

2. **NFT Rewards**
   - Milestone achievements (7, 30, 100 days)
   - Unique artwork
   - On-chain proof

3. **Social Features**
   - Share achievements
   - Invite friends
   - Streak challenges

4. **Analytics**
   - Personal statistics
   - Global stats
   - Historical data

### Scalability Considerations

**Current:**
- Single contract on Base
- Direct RPC calls
- Client-side state management

**Future:**
- Event indexing (The Graph)
- Backend API for analytics
- IPFS for metadata
- Multi-chain support

## Development Tools

### Smart Contracts
- **Hardhat:** Development framework
- **Ethers.js:** Contract interaction
- **Hardhat Network:** Local testing
- **BaseScan:** Block explorer

### Frontend
- **Next.js:** React framework
- **Wagmi:** React hooks for Ethereum
- **Viem:** TypeScript Ethereum library
- **Reown AppKit:** Wallet connection

### Testing
- **Hardhat Tests:** Contract testing
- **GitHub Actions:** CI/CD
- **Manual Testing:** UI/UX validation

## Performance Optimization

### Smart Contract
- Minimal storage writes
- Gas-efficient loops
- Event emission over storage

### Frontend
- React Query caching
- Lazy loading
- Image optimization
- Code splitting

## Monitoring & Analytics

### Current
- Transaction logs on BaseScan
- Browser console errors
- User feedback

### Future
- Application monitoring (Sentry)
- Analytics (Mixpanel/PostHog)
- Gas cost tracking
- User behavior analysis

---

For implementation details, see the code documentation in each file.
