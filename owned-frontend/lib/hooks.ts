import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CREATOR_STORE_ADDRESS } from './constants';
import CreatorStoreABI from './CreatorStoreABI.json';

export interface Product {
    price: bigint;
    ipfsHash: string;
    maxSupply: bigint;
    sold: bigint;
    active: boolean;
}

export function useProduct(productId: number) {
    return useReadContract({
        address: CREATOR_STORE_ADDRESS,
        abi: CreatorStoreABI,
        functionName: 'getProduct',
        args: [BigInt(productId)],
    });
}

export function usePurchaseProduct() {
    const { data: hash, writeContract, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const purchaseProduct = (productId: number) => {
        writeContract({
            address: CREATOR_STORE_ADDRESS,
            abi: CreatorStoreABI,
            functionName: 'purchaseProduct',
            args: [BigInt(productId)],
        });
    };

    return {
        purchaseProduct,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
    };
}

export function useCreatorBalance() {
    return useReadContract({
        address: CREATOR_STORE_ADDRESS,
        abi: CreatorStoreABI,
        functionName: 'getCreatorBalance',
    });
}

export function useNextTokenId() {
    return useReadContract({
        address: CREATOR_STORE_ADDRESS,
        abi: CreatorStoreABI,
        functionName: 'nextTokenId',
    });
}

export function usePlatformBalance() {
    return useReadContract({
        address: CREATOR_STORE_ADDRESS,
        abi: CreatorStoreABI,
        functionName: 'getPlatformBalance',
    });
}

