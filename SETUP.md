⚙️ Setup Instructions

Follow these steps to run the project locally.

1️⃣ Prerequisites

Make sure you have installed:

Node.js (v18 or higher recommended)

npm or yarn

Phantom Wallet browser extension

Git

2️⃣ Clone the Repository
git clone https://github.com/your-username/proof-of-registration.git
cd proof-of-registration
3️⃣ Install Dependencies

Using npm:

npm install

Or using yarn:

yarn install

4️⃣ Configure Environment Variables

Create a .env file in the root directory.

Example:

VITE_SOLANA_NETWORK=devnet
VITE_RPC_URL=https://api.devnet.solana.com

You may configure:

Devnet (testing)

Testnet

Mainnet (production)

5️⃣ Start Development Server
npm run dev

App will run on:

http://localhost:5173

6️⃣ Connect Wallet

Open the app in browser

Click Connect Wallet

Select Phantom

Approve connection

Make sure Phantom is set to the same network (Devnet/Mainnet).

7️⃣ Mint Test NFT (Devnet)

Register for an event

Approve transaction

Pay devnet SOL fee

View NFT in wallet

Verify transaction on Solana Explorer

8️⃣ Build for Production
npm run build

Preview build:

npm run preview

9️⃣ Deployment

You can deploy the frontend on:

Vercel

Netlify

GitHub Pages

Cloudflare Pages

Ensure environment variables are added in deployment settings.

Built for Web3 Events • On‑Chain Identity • Verifiable Registrations 🚀
