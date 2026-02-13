import { useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import { useState, useEffect } from 'react';
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

export function useAllProducts() {
    const publicClient = usePublicClient();
    const [productIds, setProductIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProductIds = async () => {
            if (!publicClient) return;
            try {
                // Get ProductAdded events
                const logs = await publicClient.getLogs({
                    address: CREATOR_STORE_ADDRESS,
                    event: {
                        type: 'event',
                        name: 'ProductAdded',
                        inputs: [
                            { name: 'productId', type: 'uint256', indexed: true },
                            { name: 'price', type: 'uint256', indexed: false },
                            { name: 'ipfsHash', type: 'string', indexed: false },
                            { name: 'maxSupply', type: 'uint256', indexed: false }
                        ]
                    },
                    fromBlock: 'earliest'
                });

                const ids = logs.map(log => Number(log.args.productId));
                // Sort by ID and remove duplicates (shouldn't be any but safe)
                const uniqueIds = Array.from(new Set(ids)).sort((a, b) => a - b);
                setProductIds(uniqueIds);
            } catch (error) {
                console.error('Error fetching product logs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductIds();
    }, [publicClient]);

    return { productIds, isLoading };
}

