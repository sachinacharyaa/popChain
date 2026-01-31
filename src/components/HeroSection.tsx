import { FC, useState } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { WalletModal } from './WalletModal'
import { Shield, Zap, Globe, CheckCircle } from 'lucide-react'

export const HeroSection: FC = () => {
  const { connected } = useWallet()
  const [showModal, setShowModal] = useState(false)

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-solana-purple/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-solana-green/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-solana-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-solana-green"></span>
            </span>
            <span className="text-sm text-white/70">Built on Solana</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-white">Proof of Participation</span>
            <br />
            <span className="gradient-text">On The Blockchain</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10">
            Mint verifiable NFTs that prove your attendance at events. 
            No more fake certificates—just immutable, on-chain proof that lives forever in your wallet.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {!connected ? (
              <button 
                onClick={() => setShowModal(true)}
                className="btn-primary"
              >
                Connect Wallet
              </button>
            ) : (
              <a href="#events" className="btn-primary">
                Explore Events
              </a>
            )}
            <a href="#how-it-works" className="btn-secondary">
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: 'NFTs Minted', value: '10,000+' },
              { label: 'Events', value: '500+' },
              { label: 'Organizers', value: '200+' },
              { label: 'Countries', value: '45+' },
            ].map((stat, index) => (
              <div key={index} className="glass-card p-4">
                <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20" id="how-it-works">
          {[
            {
              icon: Shield,
              title: 'Immutable Proof',
              description: 'Your participation is recorded forever on the Solana blockchain. No tampering, no forgery—just verifiable truth.',
            },
            {
              icon: Zap,
              title: 'Lightning Fast',
              description: 'Mint your PoP NFT in seconds with Solana\'s blazing-fast network. Low fees, instant confirmation.',
            },
            {
              icon: Globe,
              title: 'Globally Verifiable',
              description: 'Anyone, anywhere can verify your participation. Perfect for resumes, portfolios, and professional credentials.',
            },
          ].map((feature, index) => (
            <div key={index} className="glass-card p-6 hover:border-white/20 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-solana-purple to-solana-green flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="gradient-text">How It Works</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Connect Wallet', description: 'Link your Solana wallet to get started' },
              { step: '02', title: 'Find Event', description: 'Browse available events and find yours' },
              { step: '03', title: 'Mint NFT', description: 'Click mint and confirm the transaction' },
              { step: '04', title: 'Own Forever', description: 'Your PoP NFT is now in your wallet!' },
            ].map((item, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-solana-purple to-solana-green" />
                )}
                
                <div className="relative glass-card p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-solana-purple to-solana-green flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.description}</p>
                  <CheckCircle className="w-5 h-5 text-solana-green mx-auto mt-4 opacity-50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <WalletModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </section>
  )
}
