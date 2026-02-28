import { CREATOR_STORE_ADDRESS, CHAIN, RPC_URL } from './constants';
import CreatorStoreABI from './CreatorStoreABI.json';
import { parseUSDC, getReadableError } from './utils';
import { createWalletClient, custom, createPublicClient, http } from 'viem';
import { useMagic } from '@/components/MagicProvider';
import { useState } from 'react';

const publicClient = createPublicClient({
    chain: CHAIN,
    transport: http(RPC_URL)
});

export function useAddProduct() {
    const { user, magic } = useMagic();
    const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
    const [isPending, setIsPending] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<any>(null);

    const addProduct = async (productId: number, priceUSD: string, ipfsHash: string, maxSupply: number) => {
        const priceInUSDC = parseUSDC(priceUSD);

        if (!user?.publicAddress || !magic) {
            setError('Please sign in first');
            return;
        }

        setIsPending(true);
        setHash(undefined);
        setIsSuccess(false);
        setError(null);

        try {
            const walletClient = createWalletClient({
                account: user.publicAddress as `0x${string}`,
                chain: CHAIN,
                transport: custom(magic.rpcProvider)
            });

            const txHash = await walletClient.writeContract({
                address: CREATOR_STORE_ADDRESS,
                abi: CreatorStoreABI as any,
                functionName: 'addProduct',
                args: [BigInt(productId), priceInUSDC, ipfsHash, BigInt(maxSupply)],
            });

            setHash(txHash);
            setIsConfirming(true);
            const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
            setIsConfirming(false);

            if (receipt.status === 'success') {
                setIsSuccess(true);
            } else {
                setError('Transaction failed on-chain');
            }
        } catch (err: any) {
            console.error('Add product error:', err);
            setError(getReadableError(err));
        } finally {
            setIsPending(false);
            setIsConfirming(false);
        }
    };

    return {
        addProduct,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
    };
}

export function useUpdateProduct() {
    const { user, magic } = useMagic();
    const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
    const [isPending, setIsPending] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<any>(null);

    const updateProduct = async (productId: number, priceUSD: string, ipfsHash: string, maxSupply: number) => {
        const priceInUSDC = parseUSDC(priceUSD);

        if (!user?.publicAddress || !magic) {
            setError('Please sign in first');
            return;
        }

        setIsPending(true);
        setHash(undefined);
        setIsSuccess(false);
        setError(null);

        try {
            const walletClient = createWalletClient({
                account: user.publicAddress as `0x${string}`,
                chain: CHAIN,
                transport: custom(magic.rpcProvider)
            });

            const txHash = await walletClient.writeContract({
                address: CREATOR_STORE_ADDRESS,
                abi: CreatorStoreABI as any,
                functionName: 'updateProduct',
                args: [BigInt(productId), priceInUSDC, ipfsHash, BigInt(maxSupply)],
            });

            setHash(txHash);
            setIsConfirming(true);
            const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
            setIsConfirming(false);

            if (receipt.status === 'success') {
                setIsSuccess(true);
            } else {
                setError('Transaction failed on-chain');
            }
        } catch (err: any) {
            console.error('Update product error:', err);
            setError(getReadableError(err));
        } finally {
            setIsPending(false);
            setIsConfirming(false);
        }
    };

    return {
        updateProduct,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
    };
}

export function useSetProductActive() {
    const { user, magic } = useMagic();
    const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
    const [isPending, setIsPending] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<any>(null);

    const setProductActive = async (productId: number, active: boolean) => {
        if (!user?.publicAddress || !magic) {
            setError('Please sign in first');
            return;
        }

        setIsPending(true);
        setHash(undefined);
        setIsSuccess(false);
        setError(null);

        try {
            const walletClient = createWalletClient({
                account: user.publicAddress as `0x${string}`,
                chain: CHAIN,
                transport: custom(magic.rpcProvider)
            });

            const txHash = await walletClient.writeContract({
                address: CREATOR_STORE_ADDRESS,
                abi: CreatorStoreABI as any,
                functionName: 'setProductActive',
                args: [BigInt(productId), active],
            });

            setHash(txHash);
            setIsConfirming(true);
            const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
            setIsConfirming(false);

            if (receipt.status === 'success') {
                setIsSuccess(true);
            } else {
                setError('Transaction failed on-chain');
            }
        } catch (err: any) {
            console.error('Toggle active error:', err);
            setError(getReadableError(err));
        } finally {
            setIsPending(false);
            setIsConfirming(false);
        }
    };

    return {
        setProductActive,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
    };
}

export function useWithdrawCreator() {
    const { user, magic } = useMagic();
    const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
    const [isPending, setIsPending] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<any>(null);

    const withdraw = async () => {
        if (!user?.publicAddress || !magic) {
            setError('Please sign in first');
            return;
        }

        setIsPending(true);
        setHash(undefined);
        setIsSuccess(false);
        setError(null);

        try {
            const walletClient = createWalletClient({
                account: user.publicAddress as `0x${string}`,
                chain: CHAIN,
                transport: custom(magic.rpcProvider)
            });

            const txHash = await walletClient.writeContract({
                address: CREATOR_STORE_ADDRESS,
                abi: CreatorStoreABI as any,
                functionName: 'withdrawCreatorFunds',
            });

            setHash(txHash);
            setIsConfirming(true);
            const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
            setIsConfirming(false);

            if (receipt.status === 'success') {
                setIsSuccess(true);
            } else {
                setError('Transaction failed on-chain');
            }
        } catch (err: any) {
            console.error('Withdrawal error:', err);
            setError(getReadableError(err));
        } finally {
            setIsPending(false);
            setIsConfirming(false);
        }
    };

    return {
        withdraw,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
    };
}
