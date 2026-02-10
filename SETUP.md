## ⚙️ Setup Instructions

Follow these steps to run the project locally.

---

### 1️⃣ Prerequisites

Make sure the following are installed on your system:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **Git**
- **Phantom Wallet** browser extension

---

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/proof-of-registration.git
cd proof-of-registration
```

---

### 3️⃣ Install Dependencies

Using **npm**:

```bash
npm install
```

Or using **yarn**:

```bash
yarn install
```

---

### 4️⃣ Configure Environment Variables

Create a `.env` file in the root directory.

Example:

```env
VITE_SOLANA_NETWORK=devnet
VITE_RPC_URL=https://api.devnet.solana.com
```

You can configure:

- **Devnet** → Testing
- **Testnet** → Staging
- **Mainnet** → Production

---

### 5️⃣ Start Development Server

```bash
npm run dev
```

App will run on:

```
http://localhost:5173
```

---

### 6️⃣ Connect Wallet

1. Open the app in your browser
2. Click **Connect Wallet**
3. Select **Phantom**
4. Approve the connection

> ⚠️ Ensure Phantom is set to the same network (Devnet/Mainnet).

---

### 7️⃣ Mint Test Registration NFT

- Register for an event
- Approve the transaction
- Pay Devnet SOL fee
- NFT will appear in wallet
- Verify via Solana Explorer

---

### 8️⃣ Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

### 9️⃣ Deployment

You can deploy the frontend on:

- **Vercel**
- **Netlify**
- **GitHub Pages**
- **Cloudflare Pages**

Make sure to add environment variables in deployment settings.

---
