# OWNED Contracts

Crypto-native creator commerce contracts.

## Stack

- Solidity 0.8.20+
- Foundry
- OpenZeppelin
- Base (L2)

## Contracts

- `CreatorStore.sol` - Individual creator storefronts
- `StoreFactory.sol` - Deploy new stores (coming in Phase 2)

## Setup

1. Install dependencies (already done via Foundry):

   ```bash
   forge install
   ```

2. Copy `.env.example` to `.env` and fill in your values:

   ```bash
   cp .env.example .env
   ```

3. Build contracts:

   ```bash
   forge build
   ```

4. Run tests:

   ```bash
   forge test -vvv
   ```

## Deployment

Deploy to Base Sepolia:

```bash
source .env
forge script script/Deploy.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL --broadcast --verify
```

## Architecture

**CreatorStore.sol** - Each creator deploys their own permissionless store instance:

- Add products (USDC pricing, IPFS metadata, supply limits)
- Buyers pay USDC → receive ERC-721 NFT as proof of purchase
- 3% platform fee (97% to creator, 3% to platform)
- Censorship-resistant, onchain ownership

## Brand Principles

OWNED: Stack sats, not subscriptions.

- Monetization first, audience second
- Onchain payments (USDC, ETH, SOL)
- Censorship-resistant (permissionless smart contracts)
- Capped fee model: $9/mo + 3% transactions, max $109/mo total
