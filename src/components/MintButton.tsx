import { FC, useState, useEffect } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { useEvents } from '../contexts/EventsContext'
import { Sparkles, Loader2, Check, ExternalLink, PartyPopper } from 'lucide-react'
import toast from 'react-hot-toast'
import { Event } from './EventCard'
import { mintPoPNFT, hasClaimedEvent, getClaimedEventSignature } from '../utils/mintNFT'
import { WalletModal } from './WalletModal'

interface Props {
  event: Event
}

export const MintButton: FC<Props> = ({ event }) => {
  const { connected, publicKey, signTransaction, connection } = useWallet()
  const { incrementAttendees } = useEvents()
  const [showModal, setShowModal] = useState(false)
  const [minting, setMinting] = useState(false)
  const [minted, setMinted] = useState(false)
  const [txSignature, setTxSignature] = useState<string | null>(null)
  const [alreadyClaimed, setAlreadyClaimed] = useState(false)

  // Check if user already claimed this event
  useEffect(() => {
    if (publicKey) {
      const claimed = hasClaimedEvent(publicKey.toString(), event.id)
      setAlreadyClaimed(claimed)
      if (claimed) {
        const signature = getClaimedEventSignature(publicKey.toString(), event.id)
        if (signature) {
          setTxSignature(signature)
          setMinted(true)
        }
      }
    } else {
      setAlreadyClaimed(false)
      setMinted(false)
      setTxSignature(null)
    }
  }, [publicKey, event.id])

  const handleMint = async () => {
    if (!connected || !publicKey) {
      setShowModal(true)
      return
    }

    // Check if already claimed
    if (hasClaimedEvent(publicKey.toString(), event.id)) {
      toast(
        <div className="flex items-center gap-3">
          <PartyPopper className="w-6 h-6 text-solana-green" />
          <div>
            <p className="font-semibold">Hey buddy!</p>
            <p className="text-sm text-white/70">You've already claimed this event's PoP!</p>
          </div>
        </div>,
        {
          duration: 4000,
          style: {
            background: 'rgba(153, 69, 255, 0.2)',
            border: '1px solid rgba(153, 69, 255, 0.3)',
          },
        }
      )
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

      setTxSignature(result.signature)
      setMinted(true)
      setAlreadyClaimed(true)
      
      // Increment attendee count with animation
      incrementAttendees(event.id)
      
      toast.success(
        <div className="flex flex-col">
          <span className="font-semibold">PoP Claimed Successfully!</span>
          <span className="text-sm text-white/70">You're now a verified participant</span>
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

  // Already claimed state
  if (minted && txSignature) {
    return (
      <div className="space-y-3">
        <button
          disabled
          className="w-full px-6 py-3 bg-solana-green/20 border border-solana-green/30 rounded-xl font-semibold flex items-center justify-center gap-2 text-solana-green"
        >
          <Check className="w-5 h-5" />
          PoP Claimed
        </button>
        <a
          href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm flex items-center justify-center gap-2 text-white/70 hover:text-white hover:border-white/20 transition-all"
        >
          View Transaction
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    )
  }

  // Already claimed but no signature in state (from localStorage)
  if (alreadyClaimed && connected) {
    return (
      <div className="space-y-3">
        <button
          disabled
          className="w-full px-6 py-3 bg-solana-purple/20 border border-solana-purple/30 rounded-xl font-semibold flex items-center justify-center gap-2 text-solana-purple"
        >
          <PartyPopper className="w-5 h-5" />
          Already Registered
        </button>
        <p className="text-center text-xs text-white/50">
          You've already claimed this event's PoP
        </p>
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
            Claiming...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            {connected ? 'Claim PoP NFT' : 'Connect Wallet to Claim'}
          </>
        )}
      </button>
      
      <WalletModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
