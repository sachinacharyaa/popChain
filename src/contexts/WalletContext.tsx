import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback, 
  ReactNode,
  FC 
} from 'react'
import { Connection, PublicKey, Transaction, clusterApiUrl } from '@solana/web3.js'

// Types for Solana wallet providers
interface SolanaProvider {
  isPhantom?: boolean
  isBraveWallet?: boolean
  isBackpack?: boolean
  publicKey: PublicKey | null
  isConnected: boolean
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>
  disconnect: () => Promise<void>
  signTransaction: (transaction: Transaction) => Promise<Transaction>
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>
  on: (event: string, callback: (...args: unknown[]) => void) => void
  off: (event: string, callback: (...args: unknown[]) => void) => void
}

interface WalletInfo {
  name: string
  icon: string
  provider: SolanaProvider
}

interface WalletContextType {
  connected: boolean
  connecting: boolean
  publicKey: PublicKey | null
  walletName: string | null
  walletIcon: string | null
  connection: Connection
  availableWallets: WalletInfo[]
  connect: (wallet: WalletInfo) => Promise<void>
  disconnect: () => Promise<void>
  signTransaction: ((transaction: Transaction) => Promise<Transaction>) | null
}

const WalletContext = createContext<WalletContextType | null>(null)

// Solana devnet connection with better config
const connection = new Connection(clusterApiUrl('devnet'), {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000,
})

// Detect available wallet providers
const getAvailableWallets = (): WalletInfo[] => {
  const wallets: WalletInfo[] = []
  const win = window as unknown as { 
    solana?: SolanaProvider
    phantom?: { solana?: SolanaProvider }
    backpack?: SolanaProvider
    braveSolana?: SolanaProvider
    solflare?: SolanaProvider
  }
  
  // Check for Phantom (can be window.solana or window.phantom.solana)
  const phantom = win.phantom?.solana || (win.solana?.isPhantom ? win.solana : null)
  if (phantom) {
    wallets.push({
      name: 'Phantom',
      icon: 'https://phantom.app/img/phantom-logo.svg',
      provider: phantom,
    })
  }
  
  // Check for Backpack
  if (win.backpack) {
    wallets.push({
      name: 'Backpack',
      icon: 'https://backpack.app/assets/icons/icon128.png',
      provider: win.backpack,
    })
  }
  
  // Check for Brave Wallet
  if (win.braveSolana) {
    wallets.push({
      name: 'Brave Wallet',
      icon: 'https://brave.com/static-assets/images/brave-logo-sans-text.svg',
      provider: win.braveSolana,
    })
  }
  
  // Check for Solflare
  if (win.solflare) {
    wallets.push({
      name: 'Solflare',
      icon: 'https://solflare.com/assets/logo.svg',
      provider: win.solflare,
    })
  }

  // Generic solana provider fallback
  if (win.solana && !win.solana.isPhantom && wallets.length === 0) {
    wallets.push({
      name: 'Solana Wallet',
      icon: 'https://solana.com/favicon.ico',
      provider: win.solana,
    })
  }
  
  return wallets
}

interface Props {
  children: ReactNode
}

export const WalletProvider: FC<Props> = ({ children }) => {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [walletName, setWalletName] = useState<string | null>(null)
  const [walletIcon, setWalletIcon] = useState<string | null>(null)
  const [currentProvider, setCurrentProvider] = useState<SolanaProvider | null>(null)
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([])

  // Detect wallets on mount
  useEffect(() => {
    const detectWallets = () => {
      const wallets = getAvailableWallets()
      setAvailableWallets(wallets)
    }

    // Initial detection
    detectWallets()

    // Re-detect after delays (wallets inject at different times)
    const timeouts = [100, 500, 1000].map(delay => 
      setTimeout(detectWallets, delay)
    )
    
    return () => timeouts.forEach(clearTimeout)
  }, [])

  // Try eager connection for previously connected wallet
  useEffect(() => {
    const tryEagerConnect = async () => {
      const savedWallet = localStorage.getItem('popchain_wallet')
      if (!savedWallet || availableWallets.length === 0) return

      const wallet = availableWallets.find(w => w.name === savedWallet)
      if (!wallet) return

      try {
        // Try to connect without user interaction (only works if previously approved)
        const response = await wallet.provider.connect({ onlyIfTrusted: true })
        if (response.publicKey) {
          const pubKey = new PublicKey(response.publicKey.toString())
          setPublicKey(pubKey)
          setConnected(true)
          setWalletName(wallet.name)
          setWalletIcon(wallet.icon)
          setCurrentProvider(wallet.provider)
        }
      } catch {
        // Silent fail - user will need to connect manually
        localStorage.removeItem('popchain_wallet')
      }
    }

    tryEagerConnect()
  }, [availableWallets])

  // Handle wallet connection
  const connect = useCallback(async (wallet: WalletInfo) => {
    if (connecting) return
    
    setConnecting(true)
    try {
      // Regular connect (will show popup)
      const response = await wallet.provider.connect()
      const pubKey = new PublicKey(response.publicKey.toString())
      
      setPublicKey(pubKey)
      setConnected(true)
      setWalletName(wallet.name)
      setWalletIcon(wallet.icon)
      setCurrentProvider(wallet.provider)
      
      // Save for auto-reconnect
      localStorage.setItem('popchain_wallet', wallet.name)
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    } finally {
      setConnecting(false)
    }
  }, [connecting])

  // Handle wallet disconnection
  const disconnect = useCallback(async () => {
    if (currentProvider) {
      try {
        await currentProvider.disconnect()
      } catch (error) {
        console.error('Failed to disconnect:', error)
      }
    }
    
    setPublicKey(null)
    setConnected(false)
    setWalletName(null)
    setWalletIcon(null)
    setCurrentProvider(null)
    localStorage.removeItem('popchain_wallet')
  }, [currentProvider])

  // Sign transaction wrapper
  const signTransaction = currentProvider 
    ? async (transaction: Transaction) => {
        return currentProvider.signTransaction(transaction)
      }
    : null

  // Listen for account changes
  useEffect(() => {
    if (!currentProvider) return

    const handleAccountChange = (newPublicKey: PublicKey | null) => {
      if (newPublicKey) {
        setPublicKey(new PublicKey(newPublicKey.toString()))
      } else {
        disconnect()
      }
    }

    const handleDisconnect = () => {
      disconnect()
    }

    currentProvider.on('accountChanged', handleAccountChange)
    currentProvider.on('disconnect', handleDisconnect)

    return () => {
      currentProvider.off('accountChanged', handleAccountChange)
      currentProvider.off('disconnect', handleDisconnect)
    }
  }, [currentProvider, disconnect])

  return (
    <WalletContext.Provider
      value={{
        connected,
        connecting,
        publicKey,
        walletName,
        walletIcon,
        connection,
        availableWallets,
        connect,
        disconnect,
        signTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
