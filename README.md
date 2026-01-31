# PoPChain - Proof of Participation NFTs on Solana

A decentralized application that lets event attendees mint Proof of Participation (PoP) NFTs on Solana — digital badges proving attendance, securely and permanently stored on the blockchain.

## Features

- **Wallet Integration**: Connect with Any wallet(Software itself detects on your system) for seamless authentication
- **NFT Minting**: Mint unique PoP NFTs directly to your wallet
- **On-Chain Proof**: Immutable, verifiable credentials on Solana blockchain
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Low Fees**: Built on Solana for fast, affordable transactions

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Solana
- **NFT Standard**: Metaplex Token Metadata
- **Wallet**: Solana Wallet Adapter (Phantom)

## Prerequisites

- Node.js 18+
- npm or yarn
- Phantom Wallet browser extension
- SOL tokens (devnet for testing)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Get Devnet SOL

For testing, you'll need devnet SOL:

1. Open Phantom wallet
2. Switch to Devnet (Settings → Developer Settings → Change Network)
3. Visit [Solana Faucet](https://faucet.solana.com/) to get free devnet SOL

## Project Structure

```
src/
├── components/
│   ├── WalletContextProvider.tsx  # Wallet adapter setup
│   ├── Header.tsx                 # Navigation header
│   ├── HeroSection.tsx            # Landing page hero
│   ├── EventCard.tsx              # Event display card
│   ├── MintButton.tsx             # NFT minting button
│   ├── NFTGallery.tsx             # User's NFT collection
│   └── Footer.tsx                 # Page footer
├── utils/
│   └── mintNFT.ts                 # NFT minting logic
├── App.tsx                        # Main application
├── main.tsx                       # Entry point
└── index.css                      # Global styles
```

## How It Works

1. **Connect Wallet**: Users connect their Phantom wallet to authenticate
2. **Browse Events**: View available events with details (date, location, organizer)
3. **Mint NFT**: Click "Mint PoP NFT" and confirm the transaction
4. **Verify**: The NFT appears in your wallet as permanent proof of participation

## NFT Metadata

Each PoP NFT contains:

- Event name
- Event type (workshop, hackathon, meetup, conference)
- Date of attendance
- Location
- Organizer name
- Unique event image

## Configuration

### Network Configuration

By default, the app connects to Solana Devnet. To change networks:

```typescript
// src/components/WalletContextProvider.tsx
const endpoint = useMemo(() => clusterApiUrl("devnet"), []); // Change to 'mainnet-beta' for production
```

### Metadata Storage

For production, implement proper metadata storage:

- **Arweave**: Permanent, decentralized storage via Bundlr/Irys
- **IPFS**: Distributed storage via NFT.Storage
- **Shadow Drive**: Solana-native storage solution

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Deployment

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder, ready for deployment to any static hosting service (Vercel, Netlify, etc.).

## Future Enhancements

- [ ] Event organizer dashboard
- [ ] QR code check-in system
- [ ] Multi-wallet support
- [ ] Social sharing features
- [ ] Event creation via smart contract
- [ ] Attendance verification oracle

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own events and communities.

---

Built with love on Solana
