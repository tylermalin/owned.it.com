# OWNED Contract Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. **Base Sepolia ETH** (~0.01 ETH for gas)
   - Get from: <https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet>

2. **Test wallet private key** (keep secure, never commit)

3. **Platform fee wallet address** (can be same as deployer for testing)

4. **(Optional) BaseScan API key** for contract verification
   - Get from: <https://basescan.org/myapikey>

## Setup

1. **Create `.env` file** in `owned-contracts/` directory:

```bash
cd owned-contracts
cp .env.example .env
```

1. **Edit `.env` with your values:**

```bash
# Your private key as a hex number WITH 0x prefix
# Example format: PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
PRIVATE_KEY=0xyour_64_character_hex_private_key

# Platform fee wallet address (with 0x prefix)
PLATFORM_FEE_ADDRESS=0xYourPlatformFeeWalletAddress

# RPC URL (default is fine)
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# BaseScan API key (optional, for verification)
BASESCAN_API_KEY=your_basescan_api_key_here
```

> **Important:**
>
> - Private key should be 64 hex characters WITH `0x` prefix (66 chars total)
> - Platform address should have `0x` prefix
> - Never commit `.env` to git

## Deployment

### Step 1: Verify Tests Pass

```bash
forge test -vvv
```

Expected: `11 tests passed, 0 failed`

### Step 2: Deploy to Base Sepolia

```bash
source .env
forge script script/Deploy.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL --broadcast --verify
```

### Step 3: Save Deployment Info

After successful deployment:

- Contract address will be logged to console
- Deployment info saved to `deployments/base-sepolia.json`
- Contract will be verified on BaseScan (if API key provided)

### Step 4: Verify on BaseScan

Visit: `https://sepolia.basescan.org/address/<YOUR_CONTRACT_ADDRESS>`

Confirm:

- ✅ Contract code is verified
- ✅ ABI is visible
- ✅ Constructor arguments are correct

## Post-Deployment Testing

### Add Test Product

You can add a test product using Cast:

```bash
cast send <CONTRACT_ADDRESS> \
  "addProduct(uint256,uint256,string,uint256)" \
  1 50000000 "QmTestHash123" 100 \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY
```

This adds:

- Product ID: 1
- Price: 50 USDC (50000000 = 50 * 10^6)
- IPFS Hash: QmTestHash123
- Max Supply: 100

### Verify Product

```bash
cast call <CONTRACT_ADDRESS> \
  "getProduct(uint256)" 1 \
  --rpc-url $BASE_SEPOLIA_RPC_URL
```

## Gas Costs

Document gas costs for mainnet budgeting:

- **Deployment:** ~X ETH (will be shown in deployment output)
- **Add Product:** ~X ETH
- **Purchase Product:** ~X ETH

## Next Steps

1. Save contract address to `.env` as `NEXT_PUBLIC_CONTRACT_ADDRESS`
2. Copy ABI from `out/CreatorStore.sol/CreatorStore.json` for frontend
3. Begin Phase 2: Next.js frontend setup

## Troubleshooting

**"Insufficient funds"**

- Get more Base Sepolia ETH from faucet

**"Invalid private key"**

- Ensure private key includes `0x` prefix
- Check it's the correct format (0x + 64 hex characters = 66 total)

**"Verification failed"**

- Check BaseScan API key is correct
- You can manually verify later on BaseScan

**"Transaction reverted"**

- Check RPC URL is correct
- Ensure wallet has ETH for gas
