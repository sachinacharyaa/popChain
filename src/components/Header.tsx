import { FC } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { WalletButton } from './WalletButton'
import { Link2 } from 'lucide-react'

export const Header: FC = () => {
  const { connected } = useWallet()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-t-0 rounded-t-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-solana-purple to-solana-green flex items-center justify-center">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">PoPChain</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#events" className="text-white/70 hover:text-white transition-colors">
              Events
            </a>
            <a href="#how-it-works" className="text-white/70 hover:text-white transition-colors">
              How It Works
            </a>
            {connected && (
              <a href="#my-nfts" className="text-white/70 hover:text-white transition-colors">
                My NFTs
              </a>
            )}
          </nav>

          {/* Wallet Connection */}
          <WalletButton />
        </div>
      </div>
    </header>
  )
}
