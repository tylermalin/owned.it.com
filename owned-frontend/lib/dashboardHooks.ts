import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CREATOR_STORE_ADDRESS } from './constants';
import CreatorStoreABI from './CreatorStoreABI.json';
import { parseUSDC } from './utils';

export function useAddProduct() {
    const { data: hash, writeContract, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const addProduct = (productId: number, priceUSD: string, ipfsHash: string, maxSupply: number) => {
        const priceInUSDC = parseUSDC(priceUSD);

        writeContract({
            address: CREATOR_STORE_ADDRESS,
            abi: CreatorStoreABI,
            functionName: 'addProduct',
            args: [BigInt(productId), priceInUSDC, ipfsHash, BigInt(maxSupply)],
        });
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
    const { data: hash, writeContract, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const updateProduct = (productId: number, priceUSD: string, ipfsHash: string, maxSupply: number) => {
        const priceInUSDC = parseUSDC(priceUSD);

        writeContract({
            address: CREATOR_STORE_ADDRESS,
            abi: CreatorStoreABI,
            functionName: 'updateProduct',
            args: [BigInt(productId), priceInUSDC, ipfsHash, BigInt(maxSupply)],
        });
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
    const { data: hash, writeContract, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const setProductActive = (productId: number, active: boolean) => {
        writeContract({
            address: CREATOR_STORE_ADDRESS,
            abi: CreatorStoreABI,
            functionName: 'setProductActive',
            args: [BigInt(productId), active],
        });
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
    const { data: hash, writeContract, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const withdraw = () => {
        writeContract({
            address: CREATOR_STORE_ADDRESS,
            abi: CreatorStoreABI,
            functionName: 'withdrawCreator',
        });
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
