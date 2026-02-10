# OWNED CreatorStore - Base Sepolia Deployment

## Deployment Details

**Contract Address:** `0x2CfE077af112B9F6e6Ed39e327D3d31c840401BD`

**Network:** Base Sepolia (Chain ID: 84532)

**Deployed At:** Block timestamp 1770744530

**Deployer:** `0xa6Baa026a54C0a1c4c38F5A49ecC29342B3ef84d`

**Platform Fee Address:** `0xa6Baa026a54C0a1c4c38F5A49ecC29342B3ef84d`

**USDC Address:** `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

## Contract Verification

**BaseScan URL:** <https://sepolia.basescan.org/address/0x2CfE077af112B9F6e6Ed39e327D3d31c840401BD>

Check the link above to:

- View contract code
- See ABI
- Verify constructor arguments
- Monitor transactions

## Next Steps

### 1. Add Test Product

```bash
cast send 0x2CfE077af112B9F6e6Ed39e327D3d31c840401BD \
  "addProduct(uint256,uint256,string,uint256)" \
  1 50000000 "QmTestHash123" 100 \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY
```

### 2. Verify Product

```bash
cast call 0x2CfE077af112B9F6e6Ed39e327D3d31c840401BD \
  "getProduct(uint256)" 1 \
  --rpc-url https://sepolia.base.org
```

### 3. Frontend Integration

Add to your frontend `.env`:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x2CfE077af112B9F6e6Ed39e327D3d31c840401BD
NEXT_PUBLIC_CHAIN_ID=84532
```

Copy ABI from: `owned-contracts/out/CreatorStore.sol/CreatorStore.json`

## Contract Features

✅ ERC-721 NFT minting on purchase
✅ USDC payment processing
✅ 3% platform fee (97% to creator)
✅ Product management (add, track inventory)
✅ Withdrawal functions (creator + platform)
✅ Supply limits and sold-out prevention
✅ IPFS metadata integration

## Gas Costs

Track actual gas costs for mainnet budgeting:

- Deployment: Check transaction on BaseScan
- Add Product: ~116,090 gas
- Purchase: ~308,309 gas
- Withdraw: ~313,147 gas (creator) / ~314,735 gas (platform)

## Security

✅ Reentrancy protection
✅ Access control (Ownable)
✅ SafeERC20 for transfers
✅ Duplicate product ID prevention
✅ 11/11 tests passing
