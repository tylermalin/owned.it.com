# OWNED Protocol 🧱

**Stack sats, not subscriptions.** OWNED is a crypto-native commerce protocol built for the modern creator economy on Base.

This repository contains the full mono-repo for the OWNED platform, including permissionless smart contracts and a premium SaaS-style owner dashboard.

---

## 🚀 Key Features

- **Permissionless Creator Stores**: Every creator deploys their own storefront contract. No middleman, no censorship.
- **Premium SaaS Aesthetic**: A complete visual restyle featuring soft shadows, modern typography, and a high-conversion checkout flow.
- **Onchain Native**: Built on **Base** with native **USDC** payments. Receive funds instantly with a capped 3% platform fee.
- **Amazing Demo Products**: Pre-configured high-quality demo products including 1:1 Strategy Sessions and Startup AI Prompt Guides.
- **IPFS Integration**: Decentralized metadata and asset storage via Pinata/Lighthouse.

---

## 🛠 Tech Stack

### Frontend (`/owned-frontend`)

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 3.4
- **Web3**: Wagmi + RainbowKit + Viem
- **Icons**: Lucide React
- **State**: React Hooks & TanStack Query

### Contracts (`/owned-contracts`)

- **Language**: Solidity 0.8.20+
- **Tooling**: Foundry
- **Library**: OpenZeppelin
- **Standard**: ERC-721 for ownership and access control

---

## 📦 Project Structure

```text
.
├── owned-contracts/    # Smart contracts & deployment scripts (Foundry)
└── owned-frontend/     # Next.js web application (Dashboard & Storefront)
```

---

## 🚦 Getting Started

### 1. Smart Contracts

```bash
cd owned-contracts
forge install
forge build
forge test -vvv
```

### 2. Frontend

```bash
cd owned-frontend
npm install
npm run dev
```

---

## 🚀 Deployment

For detailed instructions on hosting the dashboard on Vercel, see the [Deployment Guide](./DEPLOYMENT.md).

---

## 📜 Principles

- **Monetization first, audience second**: Own your revenue stream.
- **Stack sats**: Direct-to-creator payments.
- **One Fee**: 3% per sale, enforced by the contract. No subscription, no setup fee.

---

Built with ⚡️ on **Base** by [Tyler Malin](https://github.com/tylermalin).  
*Owned Protocol 2026*
