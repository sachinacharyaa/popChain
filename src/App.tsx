import { FC } from 'react'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'
import { WalletProvider } from './contexts/WalletContext'
import { EventsProvider, useEvents } from './contexts/EventsContext'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { EventCard } from './components/EventCard'
import { NFTGallery } from './components/NFTGallery'
import { Footer } from './components/Footer'

// Events grid component that uses the events context
const EventsGrid: FC = () => {
  const { events } = useEvents()
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

const App: FC = () => {
  return (
    <WalletProvider>
      <EventsProvider>
        <div className="min-h-screen bg-solana-dark">
          {/* Toast Notifications */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#14F195',
                  secondary: '#0E0E10',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#0E0E10',
                },
              },
            }}
          />

          {/* Header */}
          <Header />

          {/* Hero Section */}
          <HeroSection />

          {/* Events Section */}
          <section id="events" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  <span className="gradient-text">Upcoming Events</span>
                </h2>
                <p className="text-white/60 max-w-2xl mx-auto">
                  Browse events and mint your Proof of Participation NFT. Each NFT is a unique, 
                  verifiable credential stored forever on the Solana blockchain.
                </p>
              </div>

              <EventsGrid />
            </div>
          </section>

          {/* My NFTs Section */}
          <section id="my-nfts" className="py-20 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  <span className="gradient-text">My PoP Collection</span>
                </h2>
                <p className="text-white/60 max-w-2xl mx-auto">
                  View all your Proof of Participation NFTs in one place. 
                  Each one represents an event you attended, forever verified on-chain.
                </p>
              </div>

              <NFTGallery />
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="glass-card p-8 sm:p-12 text-center relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-solana-purple/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-solana-green/30 rounded-full blur-3xl" />
                
                <div className="relative">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    Ready to Prove Your Participation?
                  </h2>
                  <p className="text-white/60 mb-8 max-w-xl mx-auto">
                    Connect your wallet and start minting verifiable credentials for the events you attend. 
                    Build your on-chain reputation today.
                  </p>
                  <a href="#events" className="btn-primary inline-flex items-center gap-2">
                    Explore Events
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <Footer />

          {/* Vercel Analytics */}
          <Analytics />
        </div>
      </EventsProvider>
    </WalletProvider>
  )
}

export default App
