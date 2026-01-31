import { FC, useState } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { Sparkles, Loader2, Check, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { Event } from './EventCard'
import { mintPoPNFT } from '../utils/mintNFT'
import { WalletModal } from './WalletModal'

interface Props {
  event: Event
}

export const MintButton: FC<Props> = ({ event }) => {
  const { connected, publicKey, signTransaction, connection } = useWallet()
  const [showModal, setShowModal] = useState(false)
  const [minting, setMinting] = useState(false)
  const [minted, setMinted] = useState(false)
  const [mintAddress, setMintAddress] = useState<string | null>(null)

  const handleMint = async () => {
    if (!connected || !publicKey) {
      setShowModal(true)
      return
    }

    if (!signTransaction) {
      toast.error('Wallet does not support signing transactions')
      return
    }

    setMinting(true)

    try {
      const result = await mintPoPNFT({
        connection,
        publicKey,
        signTransaction,
        event,
      })

      setMintAddress(result.mintAddress)
      setMinted(true)
      toast.success(
        <div className="flex flex-col">
          <span className="font-semibold">NFT Minted Successfully!</span>
          <span className="text-sm text-white/70">Your PoP NFT is now in your wallet</span>
        </div>,
        { duration: 5000 }
      )
    } catch (error) {
      console.error('Minting failed:', error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to mint NFT. Please try again.'
      )
    } finally {
      setMinting(false)
    }
  }

  if (minted && mintAddress) {
    return (
      <div className="space-y-3">
        <button
          disabled
          className="w-full px-6 py-3 bg-solana-green/20 border border-solana-green/30 rounded-xl font-semibold flex items-center justify-center gap-2 text-solana-green"
        >
          <Check className="w-5 h-5" />
          NFT Minted
        </button>
        <a
          href={`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm flex items-center justify-center gap-2 text-white/70 hover:text-white hover:border-white/20 transition-all"
        >
          View on Explorer
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={handleMint}
        disabled={minting}
        className="w-full btn-primary flex items-center justify-center gap-2"
      >
        {minting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Minting...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            {connected ? 'Mint PoP NFT' : 'Connect Wallet to Mint'}
          </>
        )}
      </button>
      
      <WalletModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
