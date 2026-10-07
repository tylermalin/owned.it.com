# OWNED Contracts (v2)

Every creator gets their own store contract. Only the creator can list, change prices, or withdraw. OWNED's 3% is fixed when the store is created and can never be raised.

**Status: unaudited. Testnet only until an independent review is complete.**

## Contracts

| Contract | Role |
| --- | --- |
| `StoreFactory` | Deploys a `CreatorStore` clone (EIP-1167) per creator. Holds fixed config: USDC, fee recipient, fee. Its owner can only raise the per-product price cap. |
| `CreatorStore` | One per creator. Products, USDC checkout, ERC-721 receipts, creator-signed discount vouchers, per-product referrals, pull-based withdrawals. |
| `legacy/CreatorStoreV1` | The original single shared store, deployed on Base Sepolia at `0x2CfE077af112B9F6e6Ed39e327D3d31c840401BD`. Kept for reference only. |

## How money moves

1. Buyer calls `purchase` (optionally with an EIP-2612 permit, so one signature is enough).
2. The store pulls USDC first, then mints the receipt.
3. The price splits into three balances: platform fee, optional referral, creator remainder.
4. Each party withdraws their own balance. Nobody can withdraw anyone else's.

Purchases can be paused by the creator. Withdrawals can never be paused.

## Trust model

| Actor | Can | Cannot |
| --- | --- | --- |
| Creator (store owner) | Add, update, deactivate products. Sign vouchers. Pause sales. Withdraw creator balance. Transfer ownership (two-step). | Renounce ownership. Change the fee. Touch platform or referral balances. |
| OWNED fee recipient | Withdraw the platform balance of any store. | Anything else in a store. |
| Factory owner | Raise the price cap for all stores. | Lower the cap, change fees, or touch funds. |
| Buyer | Purchase with a `maxPrice` guard against price changes. | Buy inactive, sold-out or paused products. |

## Limits until a full audit

- Per-product price cap: $500 (`StoreFactory.priceCap`).
- Fee hard ceiling: 10% (`CreatorStore.MAX_FEE_BPS`). Factory default is 3%.
- Referral ceiling: 50% of a sale.

## Develop

```bash
forge build
forge test            # unit, fuzz (1,000 runs), invariant (256 x 64)
forge test --mc StoreInvariantTest -vv
```

## Deploy

```bash
cp .env.example .env   # fill in addresses
cast wallet import owned-deployer --interactive
source .env
forge script script/DeployFactory.s.sol --rpc-url base_sepolia --broadcast --verify --account owned-deployer
```

Record the factory address and deploy block in `deployments/`. The indexer starts from that block.
