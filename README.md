# 🔥 Streakz - Base

An onchain streak tracking platform built on Base (Coinbase L2) that lets users maintain daily check-in streaks.

## Features

- 🔗 **Wallet Connection**: Seamless wallet integration using Reown AppKit
- 🔥 **Daily Streaks**: Check in daily to maintain your onchain streak
- ⏰ **24-Hour Window**: You have 24 hours between check-ins to keep your streak alive
- 💎 **Base**: Built on Base for fast and cheap transactions
- ✨ **Beautiful UI**: Modern, responsive interface with real-time updates

## Project Structure

```
├── contracts/          # Smart contracts
│   ├── StreakTracker.sol      # Main streak tracking contract
│   ├── hardhat.config.js      # Hardhat configuration for Base
│   └── scripts/deploy.js      # Deployment script
│
└── frontend/          # Next.js frontend
    ├── src/
    │   ├── app/              # Next.js app directory
    │   ├── components/       # React components
    │   └── config/           # Configuration files
    └── package.json
```

## Smart Contract

The `StreakTracker` contract implements:
- Streak activation with small fee (0.000005 ETH)
- 24-hour check-in windows
- Automatic streak breaking detection
- Event emissions for tracking

### Contract Features

- `checkIn()`: Activate or continue your streak (payable)
- `getStreak(address)`: View user's current streak data
- Streak breaks automatically if 24-hour window is missed

## Getting Started

### Prerequisites

- Node.js 18+
- A wallet with Base Sepolia ETH (for testing)
- Reown Project ID (get from [Reown Cloud](https://cloud.reown.com/))

### Deploy Smart Contract

1. Navigate to contracts directory:
```bash
cd contracts
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
# Add your private key and BaseScan API key
```

3. Deploy to Base Sepolia testnet:
```bash
npm run deploy:baseSepolia
```

4. Save the deployed contract address!

### Setup Frontend

1. Navigate to frontend directory:
```bash
cd frontend
npm install
```

2. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

3. Add your configuration:
```env
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
```

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## How It Works

1. **Connect Wallet**: Users connect their wallet using Reown AppKit
2. **Start Streak**: Click "Start Streak" and pay 0.000005 ETH
3. **Daily Check-ins**: Return within 24 hours to continue your streak
4. **Maintain Streak**: Keep checking in daily to grow your streak count!

## Technologies Used

- **Smart Contracts**: Solidity 0.8.20
- **Blockchain**: Base (Coinbase L2)
- **Frontend**: Next.js 14, React 18, TypeScript
- **Wallet Connection**: Reown AppKit (formerly WalletConnect)
- **Web3 Libraries**: Wagmi, Viem
- **Styling**: Tailwind CSS
- **Development**: Hardhat

## Networks

- **Base Mainnet**: Chain ID 8453
- **Base Sepolia**: Chain ID 84532 (Testnet)

## License

MIT

## Contributing

Feel free to open issues and pull requests!

---

Built with ❤️ on Base
