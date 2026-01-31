import { 
  Connection, 
  PublicKey, 
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import { Event } from '../components/EventCard'

interface MintParams {
  connection: Connection
  publicKey: PublicKey
  signTransaction: (transaction: Transaction) => Promise<Transaction>
  event: Event
}

interface MintResult {
  mintAddress: string
  signature: string
}

// Generate a unique "mint address" for the PoP NFT
const generateMintAddress = (eventId: string, walletAddress: string): string => {
  // In production, this would be an actual NFT mint address
  // For demo, we generate a deterministic pseudo-address
  const combined = `${eventId}-${walletAddress}-${Date.now()}`
  const hash = combined.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0
  }, 0)
  return `PoP${Math.abs(hash).toString(16).padStart(40, '0').slice(0, 40)}`
}

// NFT metadata for the PoP token
export const createMetadata = (event: Event) => ({
  name: `PoP: ${event.name}`,
  symbol: 'POP',
  description: `Proof of Participation NFT for ${event.name}. This NFT certifies attendance at this event organized by ${event.organizer} on ${event.date}.`,
  image: event.imageUrl,
  external_url: 'https://popchain.app',
  attributes: [
    { trait_type: 'Event Name', value: event.name },
    { trait_type: 'Event Type', value: event.category },
    { trait_type: 'Date', value: event.date },
    { trait_type: 'Location', value: event.location },
    { trait_type: 'Organizer', value: event.organizer },
    { trait_type: 'Attendee Count', value: event.attendees.toString() },
  ],
  properties: {
    category: 'image',
    files: [
      {
        uri: event.imageUrl,
        type: 'image/png',
      },
    ],
  },
})

export const mintPoPNFT = async ({
  connection,
  publicKey,
  signTransaction,
  event,
}: MintParams): Promise<MintResult> => {
  try {
    // Check wallet balance
    const balance = await connection.getBalance(publicKey)
    const requiredBalance = 0.001 * LAMPORTS_PER_SOL // Minimum for transaction
    
    if (balance < requiredBalance) {
      throw new Error(
        `Insufficient SOL balance. You have ${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL. ` +
        `Please get some devnet SOL from faucet.solana.com`
      )
    }

    // Create a simple transaction to prove wallet ownership
    // In production, this would be a full NFT mint transaction using Metaplex
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
    
    // Create a memo-style transaction (self-transfer of 0 SOL)
    // This demonstrates the transaction flow without actual NFT minting fees
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: publicKey,
        lamports: 0, // Self-transfer of 0 to record participation
      })
    )
    
    transaction.recentBlockhash = blockhash
    transaction.feePayer = publicKey

    // Sign the transaction
    const signedTransaction = await signTransaction(transaction)
    
    // Send and confirm the transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize())
    
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    })

    // Generate a mock mint address (in production, this would be the actual NFT address)
    const mintAddress = generateMintAddress(event.id, publicKey.toString())

    // Store the "minted" NFT in localStorage for demo purposes
    // In production, this would be stored on-chain
    const mintedNFTs = JSON.parse(localStorage.getItem('popchain_nfts') || '[]')
    mintedNFTs.push({
      mintAddress,
      signature,
      event: {
        id: event.id,
        name: event.name,
        category: event.category,
        date: event.date,
        location: event.location,
        organizer: event.organizer,
        imageUrl: event.imageUrl,
      },
      owner: publicKey.toString(),
      mintedAt: new Date().toISOString(),
    })
    localStorage.setItem('popchain_nfts', JSON.stringify(mintedNFTs))

    return {
      mintAddress,
      signature,
    }
  } catch (error) {
    console.error('Mint error:', error)
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('insufficient funds') || error.message.includes('Insufficient')) {
        throw new Error('Insufficient SOL balance. Please add funds to your wallet from faucet.solana.com')
      }
      if (error.message.includes('User rejected') || error.message.includes('rejected')) {
        throw new Error('Transaction was cancelled by user.')
      }
      throw error
    }
    
    throw new Error('Failed to mint NFT. Please try again.')
  }
}

// Get minted NFTs from localStorage
export const getMintedNFTs = (walletAddress: string) => {
  const allNFTs = JSON.parse(localStorage.getItem('popchain_nfts') || '[]')
  return allNFTs.filter((nft: { owner: string }) => nft.owner === walletAddress)
}

// Utility to estimate mint cost
export const estimateMintCost = async (connection: Connection): Promise<number> => {
  try {
    // Get fee for a typical transaction
    const { blockhash } = await connection.getLatestBlockhash()
    const message = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: PublicKey.default,
        toPubkey: PublicKey.default,
        lamports: 0,
      })
    )
    message.recentBlockhash = blockhash
    message.feePayer = PublicKey.default
    const fee = await connection.getFeeForMessage(message.compileMessage())
    return (fee.value || 5000) / LAMPORTS_PER_SOL
  } catch {
    return 0.000005 // Fallback estimate (typical Solana tx fee)
  }
}
