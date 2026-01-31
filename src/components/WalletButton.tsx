import { FC, useState } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { Wallet, ChevronDown, LogOut, Copy, Check, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { WalletModal } from './WalletModal'
import { generatePixelAvatar } from '../utils/avatar'

export const WalletButton: FC = () => {
  const { connected, connecting, publicKey, walletName, disconnect } = useWallet()
  const [showModal, setShowModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toString())
      setCopied(true)
      toast.success('Address copied!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDisconnect = async () => {
    await disconnect()
    setShowDropdown(false)
    toast.success('Wallet disconnected')
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  // Generate avatar based on wallet address
  const avatarSrc = publicKey ? generatePixelAvatar(publicKey.toString()) : ''

  if (!connected) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          disabled={connecting}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-solana-purple to-solana-green rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-solana-purple/25 hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <Wallet className="w-4 h-4" />
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
        
        <WalletModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
        />
      </>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 px-3 py-2 bg-white/10 border border-white/15 rounded-xl font-medium text-white transition-all duration-300 hover:bg-white/15 hover:border-white/25"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-lg overflow-hidden ring-2 ring-solana-purple/50">
          <img 
            src={avatarSrc} 
            alt="Wallet Avatar" 
            className="w-full h-full"
          />
        </div>
        <span className="font-mono text-sm">{shortenAddress(publicKey?.toString() || '')}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-[#1e1e23]/98 border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden backdrop-blur-xl">
            {/* Wallet Info */}
            <div className="px-4 py-4 border-b border-white/10 bg-gradient-to-r from-solana-purple/10 to-solana-green/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg overflow-hidden ring-2 ring-white/20">
                  <img 
                    src={avatarSrc} 
                    alt="Wallet Avatar" 
                    className="w-full h-full"
                  />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white">{walletName}</span>
                  <p className="text-xs text-solana-green">Connected</p>
                </div>
              </div>
              <p className="text-xs text-white/50 font-mono break-all">
                {publicKey?.toString()}
              </p>
            </div>

            {/* Actions */}
            <div className="p-2">
              <button
                onClick={handleCopyAddress}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-solana-green" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? 'Copied!' : 'Copy Address'}
              </button>
              
              <a
                href={`https://explorer.solana.com/address/${publicKey?.toString()}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowDropdown(false)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on Explorer
              </a>

              <div className="my-1 border-t border-white/10" />
              
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
