# OWNED Contracts (v2)

Every creator gets their own store contract. Only the creator can list, change prices, or withdraw. OWNED's 3% is fixed when the store is created and can never be raised.

**Status: unaudited. Testnet only until an independent review is complete.**

## Contracts

| Contract | Role |
| --- | --- |
| `StoreFactory` | Deploys a `CreatorStore` clone (EIP-1167) per creator. Fixes USDC and the fee rate for every store. Holds the rotatable platform fee recipient and the raise-only price cap. `isStore` / `StoreCreated` is the only source of truth for real stores. |
| `CreatorStore` | One per creator. Products with per-wallet limits, USDC checkout, ERC-721 receipts frozen to the metadata they were sold with, creator-signed discount vouchers, referrals paid only to creator-approved referrers, pull-based withdrawals. |
| `legacy/CreatorStoreV1` | The original single shared store, deployed on Base Sepolia at `0x2CfE077af112B9F6e6Ed39e327D3d31c840401BD`. Kept for reference only. |

## How money moves

1. Buyer calls `purchase` (optionally with an EIP-2612 permit, so one signature is enough).
2. The store pulls USDC first, then mints the receipt.
3. The price splits into three balances: platform fee, optional referral (approved referrers only, never on voucher sales, never the buyer), creator remainder.
4. Each party withdraws their own balance. Nobody can withdraw anyone else's.
5. USDC sent outside a purchase is owed to nobody; the creator can sweep it with `sweepExcess`.

Purchases can be paused by the creator. Withdrawals can never be paused.

## Trust model

| Actor | Can | Cannot |
| --- | --- | --- |
| Creator (store owner) | Add, update, deactivate products. Approve referrers. Sign vouchers. Pause sales. Withdraw creator balance. Sweep unsolicited USDC, rescue other tokens. Transfer ownership (two-step; voids outstanding vouchers). | Renounce ownership. Change the fee. Touch platform or referral balances. |
| OWNED fee recipient | Withdraw the platform balance of any store. | Rotate itself, or anything else in a store. |
| Factory owner (platform Safe) | Raise the price cap for all stores. Rotate the fee recipient (two-step; the new address must accept). This redirects only platform money. | Lower the cap, change the fee rate, renounce ownership, or touch creator or referral funds. |
| Referrer | Withdraw their own earned balance, even after approval is revoked. | Earn on their own purchases or on voucher sales. |
| Buyer | Purchase with a `maxPrice` guard against price changes. | Buy inactive, sold-out or paused products. |

## Known residual risks

- An approved referrer who buys through a second wallet keeps their referral share, as in any affiliate program. Creators choose whom to approve.
- Per-wallet limits slow, but cannot stop, a buyer using many wallets.
- Anyone can clone the implementation with a fake factory. Indexers and frontends must only trust stores where `StoreFactory.isStore(store)` is true.

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
