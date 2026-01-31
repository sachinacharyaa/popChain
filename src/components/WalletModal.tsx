import { FC } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { X, Loader2, AlertCircle, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const WalletModal: FC<Props> = ({ isOpen, onClose }) => {
  const { availableWallets, connect, connecting } = useWallet()

  if (!isOpen) return null

  const handleConnect = async (wallet: typeof availableWallets[0]) => {
    try {
      await connect(wallet)
      toast.success(`Connected to ${wallet.name}!`)
      onClose()
    } catch (error) {
      console.error('Connection error:', error)
      toast.error('Failed to connect. Please try again.')
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
        <div 
          className="bg-[#1a1a1f] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
              <p className="text-sm text-white/50 mt-1">Choose a wallet to connect to PoPChain</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>

          {/* Wallet List */}
          <div className="p-4">
            {availableWallets.length > 0 ? (
              <div className="space-y-2">
                {availableWallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={() => handleConnect(wallet)}
                    disabled={connecting}
                    className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-gradient-to-r hover:from-solana-purple/20 hover:to-solana-green/20 border border-white/10 hover:border-solana-purple/30 rounded-xl transition-all duration-200 disabled:opacity-50 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
                      <img 
                        src={wallet.icon} 
                        alt={wallet.name}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-white group-hover:text-solana-green transition-colors">
                        {wallet.name}
                      </p>
                      <p className="text-xs text-white/40">Detected</p>
                    </div>
                    {connecting ? (
                      <Loader2 className="w-5 h-5 text-solana-purple animate-spin" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-solana-green animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-white/40" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No Wallets Found</h3>
                <p className="text-white/50 text-sm mb-6">
                  Please install a Solana wallet extension to continue
                </p>
                
                {/* Wallet Install Links */}
                <div className="space-y-2">
                  <a
                    href="https://phantom.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#AB9FF2]/20 hover:bg-[#AB9FF2]/30 border border-[#AB9FF2]/30 rounded-xl text-[#AB9FF2] font-medium transition-colors"
                  >
                    Install Phantom
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href="https://backpack.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 font-medium transition-colors"
                  >
                    Install Backpack
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10">
            <p className="text-xs text-white/40 text-center">
              By connecting, you agree to PoPChain's Terms of Service
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
