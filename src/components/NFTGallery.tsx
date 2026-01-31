import { FC, useState, useEffect } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { Loader2, Image, ExternalLink, Wallet } from 'lucide-react'
import { getMintedNFTs } from '../utils/mintNFT'
import { WalletModal } from './WalletModal'

interface MintedNFT {
  mintAddress: string
  signature: string
  event: {
    id: string
    name: string
    category: string
    date: string
    location: string
    organizer: string
    imageUrl: string
  }
  owner: string
  mintedAt: string
}

export const NFTGallery: FC = () => {
  const { connected, publicKey } = useWallet()
  const [nfts, setNfts] = useState<MintedNFT[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (connected && publicKey) {
      fetchNFTs()
    } else {
      setNfts([])
    }
  }, [connected, publicKey])

  const fetchNFTs = async () => {
    if (!publicKey) return

    setLoading(true)
    try {
      // Small delay to simulate loading
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Get NFTs from localStorage (in production, these would come from the blockchain)
      const mintedNFTs = getMintedNFTs(publicKey.toString())
      setNfts(mintedNFTs)
    } catch (error) {
      console.error('Failed to fetch NFTs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Refresh NFTs when localStorage changes (for newly minted NFTs)
  useEffect(() => {
    const handleStorage = () => {
      if (publicKey) {
        const mintedNFTs = getMintedNFTs(publicKey.toString())
        setNfts(mintedNFTs)
      }
    }

    window.addEventListener('storage', handleStorage)
    
    // Also set up an interval to check for new NFTs
    const interval = setInterval(() => {
      if (publicKey) {
        const mintedNFTs = getMintedNFTs(publicKey.toString())
        if (mintedNFTs.length !== nfts.length) {
          setNfts(mintedNFTs)
        }
      }
    }, 2000)

    return () => {
      window.removeEventListener('storage', handleStorage)
      clearInterval(interval)
    }
  }, [publicKey, nfts.length])

  if (!connected) {
    return (
      <>
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <Wallet className="w-8 h-8 text-white/40" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-white/60 mb-6">
            Connect your wallet to view your PoP NFT collection
          </p>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            Connect Wallet
          </button>
        </div>
        <WalletModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    )
  }

  if (loading) {
    return (
      <div className="glass-card p-12 text-center">
        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-solana-purple" />
        <p className="text-white/60">Loading your NFT collection...</p>
      </div>
    )
  }

  if (nfts.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
          <Image className="w-8 h-8 text-white/40" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No PoP NFTs Yet</h3>
        <p className="text-white/60">
          Attend an event and mint your first Proof of Participation NFT!
        </p>
      </div>
    )
  }

  const categoryColors: Record<string, string> = {
    workshop: 'from-blue-500 to-cyan-500',
    hackathon: 'from-solana-purple to-pink-500',
    meetup: 'from-solana-green to-emerald-500',
    conference: 'from-orange-500 to-amber-500',
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((nft, index) => (
        <div key={index} className="glass-card overflow-hidden group hover:border-white/20 transition-all duration-300">
          <div className="relative h-48 overflow-hidden">
            <img
              src={nft.event.imageUrl}
              alt={nft.event.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-solana-dark to-transparent" />
            
            {/* Category Badge */}
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r ${categoryColors[nft.event.category] || 'from-gray-500 to-gray-600'} text-white text-xs font-semibold`}>
              {nft.event.category.charAt(0).toUpperCase() + nft.event.category.slice(1)}
            </div>
            
            {/* Verified Badge */}
            <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-solana-green/20 border border-solana-green/30 text-solana-green text-xs font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-solana-green"></span>
              Verified
            </div>
          </div>
          
          <div className="p-4">
            <h4 className="font-semibold text-white mb-1">PoP: {nft.event.name}</h4>
            <p className="text-white/60 text-sm mb-3">
              {nft.event.date} • {nft.event.location}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-2 py-1 bg-white/5 rounded-lg text-xs text-white/70">
                By {nft.event.organizer}
              </span>
              <span className="px-2 py-1 bg-white/5 rounded-lg text-xs text-white/70">
                Minted {new Date(nft.mintedAt).toLocaleDateString()}
              </span>
            </div>
            
            <a
              href={`https://explorer.solana.com/tx/${nft.signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-solana-green hover:text-solana-green/80 transition-colors"
            >
              View Transaction
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
