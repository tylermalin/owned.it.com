import { createWalletClient, custom, http, createPublicClient } from 'viem';
import { baseSepolia } from 'viem/chains';
import CreatorStoreABI from './lib/CreatorStoreABI.json';
import { parseUSDC } from './lib/utils';
import { useMagic } from '@/components/MagicProvider';

// Environment variables or replace with actual values
const CREATOR_STORE_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x2CfE077af112B9F6e6Ed39e327D3d31c840401BD';

// Replace these with the desired product details
const PRODUCT_ID = 8; // the ID you want to add
const PRICE_USD = '10'; // price in USD
const IPFS_HASH = 'bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku'; // example IPFS CID
const MAX_SUPPLY = 100; // maximum supply

async function addProduct() {
    // Magic authentication (ensure you are logged in)
    const { user, magic } = await import('@/components/MagicProvider').then(m => m.useMagic());
    if (!user?.publicAddress || !magic) {
        console.error('Please sign in with Magic before running this script');
        return;
    }

    const walletClient = createWalletClient({
        account: user.publicAddress as `0x${string}`,
        chain: baseSepolia,
        transport: custom(magic.rpcProvider),
    });

    const priceInUSDC = parseUSDC(PRICE_USD);

    try {
        const txHash = await walletClient.writeContract({
            address: CREATOR_STORE_ADDRESS,
            abi: CreatorStoreABI as any,
            functionName: 'addProduct',
            args: [BigInt(PRODUCT_ID), priceInUSDC, IPFS_HASH, BigInt(MAX_SUPPLY)],
        });
        console.log('Transaction submitted, hash:', txHash);
        const publicClient = createPublicClient({
            chain: baseSepolia,
            transport: http('https://sepolia.base.org'),
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        console.log('Transaction receipt:', receipt);
    } catch (err) {
        console.error('Error adding product:', err);
    }
}

addProduct();
