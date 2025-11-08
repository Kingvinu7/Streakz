# Contributing to Streak Tracker

Thank you for your interest in contributing to Streak Tracker! 🎉

## Development Setup

### Prerequisites

- Node.js 18 or higher
- Git
- A wallet with Base Sepolia testnet ETH
- Basic knowledge of Solidity and React

### Getting Started

1. **Fork the repository**

2. **Clone your fork**
```bash
git clone https://github.com/YOUR_USERNAME/streak-tracker.git
cd streak-tracker
```

3. **Install dependencies**

For contracts:
```bash
cd contracts
npm install
```

For frontend:
```bash
cd frontend
npm install
```

4. **Set up environment variables**

Follow the instructions in `DEPLOYMENT.md` to set up your `.env` files.

## Development Workflow

### Working on Smart Contracts

1. Make your changes in `contracts/StreakTracker.sol`

2. Run tests:
```bash
cd contracts
npx hardhat test
```

3. Deploy to local network for testing:
```bash
npx hardhat node
# In another terminal
npx hardhat run scripts/deploy.js --network localhost
```

4. Deploy to Base Sepolia testnet:
```bash
npm run deploy:baseSepolia
```

### Working on Frontend

1. Make your changes in `frontend/src/`

2. Run development server:
```bash
cd frontend
npm run dev
```

3. Test your changes at `http://localhost:3000`

4. Build for production:
```bash
npm run build
```

## Code Style

### Smart Contracts

- Use Solidity 0.8.20
- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Add NatSpec comments for all public functions
- Keep functions small and focused

### Frontend

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and reusable
- Use Tailwind CSS for styling

## Testing

### Smart Contract Tests

All smart contract changes must include tests:

```bash
cd contracts
npx hardhat test
```

Tests should cover:
- Happy path scenarios
- Edge cases
- Error conditions
- Gas optimization checks

### Frontend Testing

Before submitting a PR:
1. Test wallet connection
2. Test on Base Sepolia testnet
3. Test mobile responsiveness
4. Test dark mode

## Pull Request Process

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Write clean, documented code
   - Add tests for new features
   - Update documentation if needed

3. **Commit your changes**
```bash
git add .
git commit -m "feat: add your feature description"
```

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `test:` for tests
- `refactor:` for refactoring
- `style:` for formatting

4. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

5. **Open a Pull Request**
   - Describe your changes clearly
   - Link related issues
   - Add screenshots for UI changes
   - Ensure all tests pass

## Reporting Issues

### Bug Reports

Include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment (browser, network, wallet)

### Feature Requests

Include:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Give constructive feedback
- Focus on what is best for the community

## Need Help?

- Check existing issues and PRs
- Read the documentation
- Ask questions in issues

## Areas for Contribution

### High Priority

- [ ] Gas optimization
- [ ] Additional tests
- [ ] Documentation improvements
- [ ] UI/UX enhancements
- [ ] Mobile responsiveness

### Feature Ideas

- [ ] Leaderboard functionality
- [ ] Streak rewards/NFTs
- [ ] Social sharing
- [ ] Multi-chain support
- [ ] Streak analytics
- [ ] Profile pages
- [ ] Achievement badges

### Documentation

- [ ] Video tutorials
- [ ] API documentation
- [ ] Architecture diagrams
- [ ] Troubleshooting guides

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Streak Tracker! 🔥
