import { Magic } from 'magic-sdk';
import { SolanaExtension } from '@magic-ext/solana';

const MAGIC_KEY = process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY;

if (!MAGIC_KEY && typeof window !== 'undefined') {
    console.warn('Magic Publishable Key is missing. Please check your .env.local file.');
}

import { CHAIN_ID, RPC_URL } from './constants';

// Primary: EVM instance (Base Mainnet or Sepolia based on env)
const createMagic = () => {
    return (typeof window !== 'undefined' && MAGIC_KEY)
        ? new Magic(MAGIC_KEY as string, {
            network: {
                rpcUrl: RPC_URL,
                chainId: CHAIN_ID,
            },
        })
        : null;
};

// Secondary: Solana instance for Solana-based features
const createSolanaMagic = () => {
    return (typeof window !== 'undefined' && MAGIC_KEY)
        ? new Magic(MAGIC_KEY as string, {
            extensions: [
                new SolanaExtension({
                    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
                }),
            ],
        })
        : null;
};

export const magic = createMagic();
export const solanaMagic = createSolanaMagic();
