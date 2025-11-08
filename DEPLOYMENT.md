# Deployment Guide

## Smart Contract Deployment

### Step 1: Set Up Environment

1. Install dependencies:
```bash
cd contracts
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your private key and API key to `.env`:
```env
PRIVATE_KEY=your_wallet_private_key_here
BASESCAN_API_KEY=your_basescan_api_key_here
```

### Step 2: Get Testnet ETH

Get Base Sepolia ETH from:
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
- [Alchemy Faucet](https://www.alchemy.com/faucets/base-sepolia)

### Step 3: Deploy Contract

Deploy to Base Sepolia testnet:
```bash
npm run deploy:baseSepolia
```

Save the contract address from the output!

### Step 4: Verify Contract (Optional)

```bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS>
```

## Frontend Deployment

### Step 1: Get Reown Project ID

1. Go to [Reown Cloud](https://cloud.reown.com/)
2. Create a new project
3. Copy your Project ID

### Step 2: Configure Frontend

1. Navigate to frontend:
```bash
cd frontend
npm install
```

2. Create `.env.local`:
```bash
cp .env.local.example .env.local
```

3. Add your configuration:
```env
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=0x_your_deployed_contract_address
```

### Step 3: Test Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and test:
1. Connect wallet
2. Switch to Base Sepolia network
3. Try activating a streak

### Step 4: Deploy to Vercel

1. Push your code to GitHub

2. Import project to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Set root directory to `frontend`

3. Add environment variables in Vercel:
   - `NEXT_PUBLIC_PROJECT_ID`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`

4. Deploy!

### Alternative: Deploy to Other Platforms

**Netlify:**
```bash
cd frontend
npm run build
# Deploy the .next folder
```

**Railway:**
```bash
# Set build command: cd frontend && npm install && npm run build
# Set start command: cd frontend && npm start
```

## Production Deployment (Base Mainnet)

⚠️ **Before deploying to mainnet:**

1. Thoroughly test on Base Sepolia
2. Get security audit for smart contract
3. Ensure you have ETH on Base mainnet

Deploy to mainnet:
```bash
cd contracts
npm run deploy:base
```

Update frontend `.env.local` with mainnet contract address.

## Monitoring

After deployment, monitor:
- Contract transactions on [BaseScan](https://basescan.org)
- Frontend errors in Vercel/Netlify dashboard
- User feedback and gas costs

## Troubleshooting

### Contract Deployment Issues

**"Insufficient funds"**: 
- Get more testnet ETH from faucet

**"Nonce too high"**:
- Reset nonce in MetaMask (Settings > Advanced > Reset Account)

### Frontend Issues

**"Project ID is not set"**:
- Check `.env.local` exists and has correct values
- Restart dev server after adding env variables

**"Cannot read contract"**:
- Verify contract address is correct
- Check you're on the right network (Base Sepolia)
- Ensure contract is deployed and verified

**Wallet connection fails**:
- Clear browser cache
- Try different wallet
- Check Reown Project ID is valid

## Security Notes

- ⚠️ Never commit `.env` files
- ⚠️ Never share private keys
- ⚠️ Test thoroughly before mainnet deployment
- ⚠️ Consider adding pause functionality to contract
- ⚠️ Implement rate limiting if needed

## Support

For issues:
1. Check this deployment guide
2. Review contract on BaseScan
3. Check browser console for errors
4. Verify environment variables are set correctly
