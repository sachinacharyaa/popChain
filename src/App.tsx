import { FC } from 'react'
import { Toaster } from 'react-hot-toast'
import { WalletProvider } from './contexts/WalletContext'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { EventCard, Event } from './components/EventCard'
import { NFTGallery } from './components/NFTGallery'
import { Footer } from './components/Footer'

// Demo events data - in production, these would come from a backend/smart contract
const demoEvents: Event[] = [
  {
    id: '1',
    name: 'Solana Hackathon 2026',
    description: 'Join the biggest Solana hackathon of the year! Build innovative dApps and compete for prizes.',
    date: 'Feb 15-17, 2026',
    location: 'San Francisco, CA',
    organizer: 'Solana Foundation',
    attendees: 847,
    maxAttendees: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
    category: 'hackathon',
  },
  {
    id: '2',
    name: 'Web3 Developer Workshop',
    description: 'Learn to build decentralized applications from scratch with hands-on coding sessions.',
    date: 'Feb 20, 2026',
    location: 'Online',
    organizer: 'DevDAO',
    attendees: 234,
    maxAttendees: 500,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop',
    category: 'workshop',
  },
  {
    id: '3',
    name: 'Blockchain Builders Meetup',
    description: 'Monthly gathering of blockchain enthusiasts and developers. Network and share ideas!',
    date: 'Feb 25, 2026',
    location: 'New York, NY',
    organizer: 'NYC Blockchain',
    attendees: 89,
    maxAttendees: 150,
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop',
    category: 'meetup',
  },
  {
    id: '4',
    name: 'DeFi Summit 2026',
    description: 'The premier conference for decentralized finance. Featuring keynotes from industry leaders.',
    date: 'Mar 5-7, 2026',
    location: 'Miami, FL',
    organizer: 'DeFi Alliance',
    attendees: 1523,
    maxAttendees: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1591115765373-5207764f72e4?w=800&auto=format&fit=crop',
    category: 'conference',
  },
  {
    id: '5',
    name: 'NFT Art Workshop',
    description: 'Create your first NFT artwork. From concept to minting, learn the complete process.',
    date: 'Mar 12, 2026',
    location: 'Los Angeles, CA',
    organizer: 'Digital Art Collective',
    attendees: 67,
    maxAttendees: 100,
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop',
    category: 'workshop',
  },
  {
    id: '6',
    name: 'Solana Validators Meetup',
    description: 'Connect with fellow validators and learn about the latest network improvements.',
    date: 'Mar 18, 2026',
    location: 'Austin, TX',
    organizer: 'Solana Validators DAO',
    attendees: 45,
    maxAttendees: 75,
    imageUrl: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800&auto=format&fit=crop',
    category: 'meetup',
  },
]

const App: FC = () => {
  return (
    <WalletProvider>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {demoEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
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
      </div>
    </WalletProvider>
  )
}

export default App
