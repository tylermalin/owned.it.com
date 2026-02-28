import { base, baseSepolia } from 'viem/chains';

export const IS_MAINNET = process.env.NEXT_PUBLIC_CHAIN_ID === '8453';
export const CHAIN_ID = IS_MAINNET ? 8453 : 84532;
export const CHAIN = IS_MAINNET ? base : baseSepolia;
export const RPC_URL = IS_MAINNET ? 'https://mainnet.base.org' : 'https://sepolia.base.org';
export const EXPLORER_URL = IS_MAINNET ? 'https://basescan.org' : 'https://sepolia.basescan.org';

export const CREATOR_STORE_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
export const USDC_ADDRESS = IS_MAINNET
    ? '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' // Native USDC on Base
    : '0x036CbD53842c5426634e7929541eC2318f3dCF7e'; // Testnet USDC

export const PROTOCOL_TREASURY = '0xa6Baa026a54C0a1c4c38F5A49ecC29342B3ef84d' as `0x${string}`;
export const SUBSCRIPTION_MANAGER = '0xa6Baa026a54C0a1c4c38F5A49ecC29342B3ef84d' as `0x${string}`;
export const ADMIN_ADDRESS = '0x713713cb606385a9c5fec6677b15c8e3ca6328ac' as `0x${string}`;
export const ADMIN_EMAIL = 'tylermalin@gmail.com';
